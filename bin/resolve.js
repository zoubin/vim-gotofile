#!/usr/bin/env node
'use strict'

var path = require('path')
var resolve = require('resolve')
var id = process.argv[2]
var readPkgUp = require('read-pkg-up')

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

var {pkg, path: pkgPath} = readPkgUp.sync({ cwd: opts.basedir })
if (pkg && pkg['vim-gotofile']) {
  Object.assign(opts, pkg['vim-gotofile'])
}

if (opts.main) {
  opts.packageFilter = function (pkg, pkgFile) {
    if (pkg[opts.main]) {
      pkg.main = pkg[opts.main]
    }
    return pkg
  }
}

tryNormal(id)

function tryAlias() {
  if (!opts.alias) return
  let alias = opts.alias
  let pkgBase = path.dirname(pkgPath)
  if (typeof alias === 'string') {
    let info = opts.alias.split('|')
    alias = path.resolve(pkgBase, info[0])
    alias = require(alias)
    for (let i = 1; i < info.length; i++) {
      alias = alias[info[i]]
    }
  }
  for (let n of Object.keys(alias)) if (id.startsWith(n + path.sep)) {
    return resolve(path.resolve(pkgBase, alias[n], id.slice(n.length + 1)), opts, function (ex, res) {
      if (!ex) {
        process.stdout.write(res)
      }
    })
  }
}

function tryRelative() {
  if (~~opts.alwaysTryRelative !== 1 || path.isAbsolute(id) || id[0] == '.') return tryAlias()

  resolve('./' + id, opts, function (ex, res) {
    if (!ex) {
      process.stdout.write(res)
    } else {
      tryAlias()
    }
  })
}

function tryNormal() {
  resolve(id, opts, function (err, res) {
    if (!err) {
      process.stdout.write(res)
    } else {
      tryRelative()
    }
  })
}

