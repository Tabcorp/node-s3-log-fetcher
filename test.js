require('./test/fixtures/server')

const concat = require('concat-stream')
const isStream = require('is-stream')
const test = require('tape')

const logFetcher = require('./')

test('should assert input types', function (t) {
  t.plan(6)
  t.throws(logFetcher.bind(null), /object/, 'is object')
  t.throws(logFetcher.bind(null, {}), /from/, 'opts.from')
  t.throws(logFetcher.bind(null, { from: '' }), /until/, 'opts.until')
  const keyOpts = { from: '', until: '' }
  t.throws(logFetcher.bind(null, keyOpts), /key/, 'opts.key')
  const secretOpts = { from: '', until: '', key: '' }
  t.throws(logFetcher.bind(null, secretOpts), /secret/, 'opts.secret')
  const bucketOpts = { from: '', until: '', key: '', secret: '' }
  t.throws(logFetcher.bind(null, bucketOpts), /bucket/, 'opts.bucket')
})

test('creates a stream', function (t) {
  t.plan(2)

  const opts = {
    from: '2015-11-10',
    until: '2015-11-10',
    key: 'asdfasdfasdfasdf',
    secret: 'asdfasdfasdfa',
    bucket: 'secret-bucket'
  }
  const rs = logFetcher(opts)
  t.ok(isStream(rs), 'is stream')

  rs.pipe(concat(function (buf) {
    const str = String(buf)
    t.equal(str, 'hello\nworld\n', 'response')
  }))
})

test('.destroy() should close the stream', function (t) {
  t.plan(2)
  const opts = {
    from: '2015-11-10',
    until: '2015-11-10',
    key: 'asdfasdfasdfasdf',
    secret: 'asdfasdfasdfa',
    bucket: 'secret-bucket'
  }

  const str = logFetcher(opts)
  t.ok(isStream(str), 'is stream')
  str.destroy()
  process.nextTick(function () {
    t.equal(str._destroyed, true, 'is destroyed')
  })
})
