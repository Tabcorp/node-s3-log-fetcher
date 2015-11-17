# s3-log-fetcher [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Fetch logs from S3.

__Features:__
- incredibly fast
- log lines are pumped out as they come in
- incredibly fast
- uses {node,unix} streams
- incredibly fast
- automatic header based gunzip through
  [gunzip-maybe](https://github.com/mafintosh/gunzip-maybe)

## Installation
```sh
$ npm install s3-log-fetcher
```

## Usage
```js
const logFetcher = require('s3-log-fetcher')

const rs = logFetcher({
  from: '2015-10-03',
  until: '2015-11-04',
  bucket: 'sydney-my-app-test',
  key: '<S3 key>',
  secret: '<S3 secret>'
})

rs.pipe(stdout)
```

__cli:__
```txt
Usage: s3-log-fetcher [options]

Options:
  -h, --help      Output usage information
  -v, --version   Output version number
  -f, --from      Start date (required)
  -u, --until     End date (required)
  -k, --key       S3 access key, defaults to env.S3_ACCESS_KEY (required)
  -s, --secret    S3 secret key, defaults to env.S3_SECRET_KEY (required)
  -b, --bucket    S3 bucket name (required)

Examples:
  $ s3-log-fetcher -f 2015-10-03 -u 2015-10-03 \
    -b testbucket  # Fetch logs from S3 for 2015-10-03
  $ s3-log-fetcher -f 2015-10-03 -u 2015-10-13 \
    -b testbucket  # Fetch logs from S3 for 2015-10-03 until 2015-10-13

Docs: https://github.com/TabDigital/node-s3-log-fetcher
Bugs: https://github.com/TabDigital/node-s3-log-fetcher/issues
```

## S3 directory structure
`S3-log-fetcher` expects the S3 bucket to follow a format. All files should
either be prefixed by a date, or live in a directory that is prefixed with the
date, this package don't care. For example:
```txt
. [ bucket: sydney-my-app-test ]
  - 2015-10-11-sydney-ec2-01.log
  - 2015-10-11-sydney-ec2-04.log
  - 2015-10-11
    - sydney-ec2-02.log
    - sydney-ec2-03.log
  - 2015-10-12
    - sydney-ec2-01.log
    - sydney-ec2-02.log
  - 2015-10-12-sydney-ec2-03.log
  - 2015-10-12-sydney-ec2-04.log
```

## API
### readStream = logFetcher.createReadStream(opts)
Create a readable stream for a start and end date. Takes the following opts:
- __from (required):__ Start date.
- __until (required):__ End date.
- __key (required):__ S3 access key. Defaults to `process.env.S3_ACCESS_KEY`.
- __secret (required):__ S3 secret key. Defaults to
  `process.env.S3_SECRET_KEY`.
- __bucket (required):__ S3 bucket name.

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/s3-log-fetcher.svg?style=flat-square
[3]: https://npmjs.org/package/node-s3-log-fetcher
[4]: https://img.shields.io/travis/TabDigital/node-s3-log-fetcher/master.svg?style=flat-square
[5]: https://travis-ci.org/TabDigital/node-s3-log-fetcher
[6]: https://img.shields.io/codecov/c/github/TabDigital/node-s3-log-fetcher/master.svg?style=flat-square
[7]: https://codecov.io/github/TabDigital/node-s3-log-fetcher
[8]: http://img.shields.io/npm/dm/node-s3-log-fetcher.svg?style=flat-square
[9]: https://npmjs.org/package/node-s3-log-fetcher
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
