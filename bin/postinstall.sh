#!/bin/bash -e

# do not create stubs from missing libraries
# ignore dev dependencies
npx flow-typed install --skip true --ignoreDeps dev

npm run build-only
