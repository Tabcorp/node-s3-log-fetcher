#!/usr/bin/env node
const stdout = require('stdout-stream')
const cliclopts = require('cliclopts')
const minimist = require('minimist')
const path = require('path')
const pump = require('pump')
const fs = require('fs')

const pkg = require('../package.json')
const main = require('../')

const opts = cliclopts([
  { name: 'help', abbr: 'h', boolean: true },
  { name: 'version', abbr: 'v', boolean: true },
  { name: 'key', abbr: 'k', default: process.env.S3_ACCESS_KEY },
  { name: 'secret', abbr: 's', default: process.env.S3_SECRET_KEY },
  { name: 'bucket', abbr: 'b' },
  { name: 'from', abbr: 'f' },
  { name: 'until', abbr: 'u' }
])

const argv = minimist(process.argv.slice(2), opts.options())

// parse options
if (argv.version) {
  const version = require('../package.json').version
  process.stdout.write('v' + version + '\n')
  process.exit(0)
} else if (argv.help) {
  process.stdout.write(pkg.name + ' - ' + pkg.description + '\n')
  usage(0)
} else if (!argv.key) {
  process.stderr.write('Error: --key is required\n')
  usage(1)
} else if (!argv.secret) {
  process.stderr.write('Error: --secret is required\n')
  usage(1)
} else if (!argv.bucket) {
  process.stderr.write('Error: --bucket is required\n')
  usage(1)
} else if (!argv.from) {
  process.stderr.write('Error: --from is required\n')
  usage(1)
} else if (!argv.until) {
  process.stderr.write('Error: --until is required\n')
  usage(1)
} else {
  main(argv).pipe(stdout)
}

// print usage & exit
// num? -> null
function usage (exitCode) {
  const rs = fs.createReadStream(path.join(__dirname, '/usage.txt'))
  const ws = process.stdout
  pump(rs, ws, process.exit.bind(null, exitCode))
}
