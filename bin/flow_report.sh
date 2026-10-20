#!/bin/bash -e

# flow-bin 0.86 only has an x86_64 macOS binary. When it cannot run (Apple
# Silicon without Rosetta), warn and skip instead of failing the commit hook.
if ! "$(node -p "require('flow-bin')")" version > /dev/null 2>&1; then
  echo "Skipping flow report: flow-bin cannot run here (Apple Silicon needs Rosetta)" >&2
  exit 0
fi

npm run flow-report
echo 'done flow report'
