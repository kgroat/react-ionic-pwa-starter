#!/usr/bin/env node
'use strict'

// ideal for use with AWS Lambda and native Node.js modules

// requires Docker: https://docs.docker.com/engine/installation/

/*
Usage:
  node docker-npm.js install
  node docker-npm.js rebuild
*/

const childProcess = require('child_process')

const nodejsImage = 'node:8.10'
const innerWorkingDir = '/src'
const dockerArgs = [
  'run', '-i',
  '-v', `${process.cwd()}:${innerWorkingDir}`,
  '-w', innerWorkingDir,
  nodejsImage
]
const nodeArgs = process.argv.slice(2)

const cp = childProcess.execFile(
  'docker',
  dockerArgs.concat(nodeArgs),
  {},
  (err, stdout, stderr) => {}
)

cp.stderr.on('data', (data) => console.error(data))
cp.stdout.on('data', (data) => console.log(data))

cp.on('close', (code) => process.exit(code))