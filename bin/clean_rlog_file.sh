#!/bin/bash -e

# should be used with `npm run fix FILE`

yarn lint "$@"

yarn build-only
