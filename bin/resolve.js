#!/usr/bin/env node
'use strict'

var path = require('path')
var resolve = require('resolve')
var filename = process.argv[2]
var id = process.argv[3]

resolve(id, { basedir: path.dirname(filename) }, function (err, res) {
  if (!err) {
    process.stdout.write(res)
  }
})

