#!/bin/sh

log_fetcher=./bin/cli.js

"$log_fetcher" \
  --from '2015-11-10' \
  --until '2015-11-10' \
  --bucket 'ywtest'
