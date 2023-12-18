#!/bin/bash

# stop script if one of the commands return a non-0 error code
set -e

echo "Updating node_modules"
npm ci

version=$(cat public/manifest.json | jq -r '.version_name')
name=$(cat public/manifest.json | jq -r '.name')
echo "Building $name $version"
npm run build

echo "Building Chrome zip."
zip -r "$name $version - Chrome.zip" build/ > /dev/null

echo "DONE!"
