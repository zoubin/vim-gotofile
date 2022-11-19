#!/usr/bin/env node
'use strict'

const path = require('path')
const resolve = require('resolve')
const id = process.argv[2]
const parent = process.argv[3]
const os = require('os')
const fs = require('fs')

//const ws = fs.createWriteStream(__dirname + '/log')
//function log(str) {
//  if (typeof str === 'string') {
//    ws.write(str + '\n')
//  } else {
//    ws.write(JSON.stringify(str, null, 2) + '\n')
//  }
//}
//process.on('exit', () => ws.end())

function createOptions() {
  let config = []
  try {
    // extensions
    // moduleDirectory
    // main
    // alias
    config = require(path.join(os.homedir(), '.vim.gotofile.config.js'))
  } catch (e) {}
  if (typeof config === 'function') {
    config = config(parent)
  }
  config.push(
    {
      fileType: ['.wxml']
    },
    {
      fileType: ['.js', '.ts', '.jsx', '.tsx', '.es6', '.json', '.wxml', '.vue']
    },
    {
      fileType: ['.css', '.scss', '.sass', '.wxss']
    }
  )
  const parentExt = path.extname(parent)
  let baseOpts = config.find(o => o.fileType.includes(parentExt))
  if (!baseOpts) process.exit(1)

  let opts = {
    alias: baseOpts.alias,
    basedir: path.dirname(parent),
    extensions: baseOpts.extensions || baseOpts.fileType
  }
  if (baseOpts.moduleDirectory) opts.moduleDirectory = baseOpts.moduleDirectory
  if (baseOpts.main) {
    opts.packageFilter = function (pkg, pkgFile) {
      if (pkg[baseOpts.main]) {
        pkg.main = pkg[baseOpts.main]
      }
      return pkg
    }
  }
  return opts
}

async function bailout(tasks) {
  for (let task of tasks) {
    try {
      const res = await task()
      if (res) return res
      if (res === false) return
    } catch (e) {}
  }
}

function resolver(id, opts) {
  return new Promise((rs, rj) => {
    resolve(id, opts, function (err, res) {
      if (err) return rj(err)
      rs(res)
    })
  })
}

async function resolveWithAlias(id, opts) {
  if (!opts.alias) return
  let alias = opts.alias

  if (alias[id]) {
    return resolver(alias[id], opts)
  }

  for (let k of Object.keys(alias)) {
    if (id.startsWith(k + '/')) {
      return resolver(path.resolve(alias[k], id.slice(k.length + 1)), opts)
    }
  }
}

async function main() {
  const options = createOptions()
  const res = await bailout([
    () => resolver(id, options),
    () => path.isAbsolute(id) ? false : undefined,
    () => resolveWithAlias(id, options),
    () => resolver('./' + id, options)
  ])
  if (res) process.stdout.write(res)
}
main()
