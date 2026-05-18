#!/bin/bash -e

# do not create stubs from missing libraries
# ignore dev dependencies
yarn flow-typed install --skip true --ignoreDeps dev || true

NODE_OPTIONS=--openssl-legacy-provider yarn build-only
