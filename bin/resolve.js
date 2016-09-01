#!/usr/bin/env node
'use strict'

var path = require('path')
var resolve = require('resolve')
var id = process.argv[2]

function parseArgs (argv) {
  var options = {}
  var current
  var arg
  while (argv.length) {
    arg = argv.shift()
    if (arg[0] === '-') {
      current = arg[1] === '-' ? arg.slice(2) : arg.slice(1)
    } else if (current) {
      if (options[current]) {
        options[current] = [].concat(options[current], arg)
      } else {
        options[current] = arg
      }
    }
  }
  return options
}

var opts = parseArgs(process.argv.slice(3))
if (opts.filename) {
  opts.basedir = path.dirname(opts.filename)
}
opts.basedir = opts.basedir || process.cwd()

if (opts.main) {
  opts.packageFilter = function (pkg, pkgFile) {
    if (pkg[opts.main]) {
      pkg.main = pkg[opts.main]
    }
    return pkg
  }
}

if (~~opts.alwaysTryRelative === 1 && !path.isAbsolute(id) && id[0] !== '.') {
  resolve('./' + id, opts, function (err, res) {
    if (!err) {
      process.stdout.write(res)
    } else {
      normalResolve(id)
    }
  })
} else {
  normalResolve(id)
}

function normalResolve (id) {
  resolve(id, opts, function (err, res) {
    if (!err) {
      process.stdout.write(res)
    }
  })
}

