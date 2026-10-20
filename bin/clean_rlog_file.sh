#!/bin/bash -e

# should be used with `npm run fix FILE`

npm run typecheck

npm run build-only
