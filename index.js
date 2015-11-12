const parallel = require('parallel-multistream')
const dateRange = require('date-range-array')
const stream = require('readable-stream')
const S3Lister = require('s3-lister')
const assert = require('assert')
const split = require('split2')
const eol = require('os').EOL
const knox = require('knox')
const pump = require('pump')
const util = require('util')

module.exports = LogFetcher

// Fetch logs from S3
// obj -> rstream
function LogFetcher (opts) {
  if (!(this instanceof LogFetcher)) return new LogFetcher(opts)

  assert.equal(typeof opts, 'object', 'opts should be an object')
  assert.equal(typeof opts.from, 'string', 'opts.from should be a string')
  assert.equal(typeof opts.until, 'string', 'opts.until should be a string')
  assert.equal(typeof opts.key, 'string', 'opts.key should be a string')
  assert.equal(typeof opts.secret, 'string', 'opts.secret should be a string')
  assert.equal(typeof opts.bucket, 'string', 'opts.bucket should be a string')

  this._forwarding = false
  this._destroyed = false
  this._drained = false
  this._dates = dateRange(opts.from, opts.until)
  this._client = knox.createClient({
    key: opts.key,
    secret: opts.secret,
    bucket: opts.bucket
  })

  stream.Readable.call(this, opts)
}
util.inherits(LogFetcher, stream.Readable)

// abort a stream before it ends
// err? -> null
LogFetcher.prototype.destroy = function (err) {
  if (this._destroyed) return
  this._destroyed = true
  var self = this
  process.nextTick(function () {
    if (err) self.emit('error', err)
    self.emit('close')
  })
}

// start the reader
// null -> rstream
LogFetcher.prototype._read = function () {
  this._drained = true
  this._forward()
}

// start forwarding data from S3
LogFetcher.prototype._forward = function () {
  if (this._forwarding || !this._drained) return
  this._forwarding = true

  const self = this
  const files = []
  const rs = new S3Lister(this._client, { prefix: this._dates[0] })
  var counter = 0

  rs.on('data', function (data) {
    if (!data.Size) return
    counter++

    self._client.getFile(data.Key, function (err, fileStream) {
      if (err) return self.emit('error', err)
      if (self.ended) return

      files.push(fileStream)

      const ended = rs.ended
      if (ended && (files.length === counter)) streamFiles()
    })
  })

  function streamFiles () {
    const ts = split()
    const rs = parallel(files)
    pump(rs, ts)
    ts.on('data', function (line) {
      self.push(line + eol)
    })
    ts.on('end', function () {
      self.push(null)
    })
    ts.on('error', function (err) {
      self.emit('error', err)
    })
  }
}
