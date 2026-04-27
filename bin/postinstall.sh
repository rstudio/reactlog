#!/bin/bash -e

# do not create stubs from missing libraries
# ignore dev dependencies
# Allow failure: flow-typed may fail if the GitHub API is unavailable
yarn flow-typed install --skip true --ignoreDeps dev || true

yarn build-only
