#!/usr/bin/env node
'use strict'
const fs = require('node:fs/promises')
const path = require('path')
const resolve = require('resolve')

async function getAlias(parent) {
  const conf = '.eslintrc.js'
  const paths = []
  let current = parent
  while (true) {
    const next = path.dirname(current)
    if (next === current) {
      break
    }
    paths.push(path.join(next, conf))
    current = next
  }
  const results = await Promise.all(paths.map(
    p => fs.access(p).then(() => p, () => null)
  ))
  const file = results.filter(Boolean)[0]
  if (!file) {
    return {}
  }
  const { settings } = require(file)
  return settings?.['import/resolver']?.alias?.map.reduce((o, [k, v]) => {
      o[k] = v
      return o
    }, {})
    || {}
}

function resolver(id, opts) {
  return new Promise((rs) => {
    resolve(id, opts, function (err, res) {
      rs(err ? '' : res)
    })
  })
}

async function resolveAlias(id, parent) {
  const alias = await getAlias(parent)

  if (alias[id]) {
    return alias[id]
  }

  for (let k of Object.keys(alias)) {
    if (id.startsWith(k + '/')) {
      return path.join(alias[k], id.slice(k.length))
    }
  }
  return id
}

async function resolve_(id, parent, extensions) {
  let options = {
    basedir: path.dirname(parent),
    extensions: extensions.split(','),
  }
  const id1 = await resolveAlias(id, parent)
  const id2 = await resolver(id1, options)
  const res = id2 || await resolver('./' + id1, options)
  if (!res) {
    throw new Error('Not Found')
  }
  const prefix = res.slice(0, -1 * path.extname(res).length)
  return Promise.all(options.extensions.map(ext => {
    const p = prefix + ext
    return fs.access(p).then(() => p, () => '')
  }))
}

async function main() {
  const id = process.argv[2]
  const parent = process.argv[3]
  const extensions = process.argv[4]
  resolve_(id, parent, path.extname(id) || extensions).then(res => {
    console.log(res.filter(Boolean).join('\n'))
  }).catch(() => {})
}
main()
