#!/bin/bash -e

# do not create stubs from missing libraries
# ignore dev dependencies
# Allow flow-typed to fail (e.g. due to network issues fetching type defs from GitHub)
yarn flow-typed install --skip true --ignoreDeps dev || true

yarn build-only
