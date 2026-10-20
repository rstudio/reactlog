#!/bin/bash -e

# should be used with `npm run fix FILE`

npm run lint -- "$@"

npm run build-only
