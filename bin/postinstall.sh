#!/bin/bash -e

# do not create stubs from missing libraries
# ignore dev dependencies
flow-typed install --skip true --ignoreDeps dev

yarn build-only
