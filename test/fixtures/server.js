const nock = require('nock')

nock('https://secret-bucket.s3.amazonaws.com:443')
  .get('/')
  .query({
    'prefix': '2015-11-10',
    'marker': '',
    'delimiter': '',
    'max-keys': ''
  })
  .reply(200, '<?xml version="1.0" encoding="UTF-8"?>\n<ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>secret-bucket</Name><Prefix>2015-11-10</Prefix><Marker></Marker><MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated><Contents><Key>2015-11-10/</Key><LastModified>2015-11-10T04:07:12.000Z</LastModified><Size>0</Size><StorageClass>STANDARD</StorageClass></Contents><Contents><Key>2015-11-10/2015-11-10-1.log</Key><LastModified>2015-11-10T04:07:23.000Z</LastModified><Size>6</Size><StorageClass>STANDARD</StorageClass></Contents><Contents><Key>2015-11-10/2015-11-10-2.log</Key><LastModified>2015-11-10T04:25:22.000Z</LastModified><Size>6</Size><StorageClass>STANDARD</StorageClass></Contents></ListBucketResult>', {
    date: 'Thu, 12 Nov 2015 03:26:21 GMT',
    'x-amz-bucket-region': 'ap-southeast-2',
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    server: 'AmazonS3',
    connection: 'close'
  })

nock('https://secret-bucket.s3.amazonaws.com:443')
  .get('/2015-11-10/2015-11-10-1.log')
  .reply(200, 'hello\n', {
    date: 'Thu, 12 Nov 2015 03:26:22 GMT',
    'last-modified': 'Tue, 10 Nov 2015 04:07:23 GMT',
    'accept-ranges': 'bytes',
    'content-type': 'application/octet-stream',
    'content-length': '6',
    server: 'AmazonS3',
    connection: 'close'
  })

nock('https://secret-bucket.s3.amazonaws.com:443')
  .get('/2015-11-10/2015-11-10-2.log')
  .reply(200, 'world\n', {
    date: 'Thu, 12 Nov 2015 03:26:22 GMT',
    'last-modified': 'Tue, 10 Nov 2015 04:25:22 GMT',
    'accept-ranges': 'bytes',
    'content-type': 'application/octet-stream',
    'content-length': '6',
    server: 'AmazonS3',
    connection: 'close'
  })
