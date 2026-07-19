#!/usr/bin/env bash
set -euo pipefail

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  # Keep Node, npm scripts, and native dependencies on the same Node ABI.
  # nvm uses the nearest .nvmrc from the current working directory.
  unset npm_config_prefix NPM_CONFIG_PREFIX
  . "$NVM_DIR/nvm.sh" --no-use
  if [ -f .nvmrc ]; then
    node_version="$(tr -d '[:space:]' < .nvmrc)"
    if ! nvm use --delete-prefix "$node_version" --silent >/dev/null 2>&1; then
      nvm use --delete-prefix "$node_version"
    fi
  else
    if ! nvm use --delete-prefix --silent >/dev/null 2>&1; then
      nvm use --delete-prefix
    fi
  fi
fi

exec "$@"
