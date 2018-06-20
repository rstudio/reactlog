#!/bin/bash -ex

# should be used with `yarn run lint FILE`

if [[ "$#" == 0 ]]
then
  echo "please include a file to lint and make prettier: 'yarn run lint FILE'"
  exit 1;
fi

echo "eslint..."
eslint --fix "$@"

echo "prettier..."
prettier --write "$@"

# echo "flow..."
# flow status
