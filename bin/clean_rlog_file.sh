#!/bin/bash -e

# should be used with `npm run fix FILE`

yarn run lint "$@"

yarn run build-only
