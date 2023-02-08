#!/bin/bash

# stop script if one of the commands return a non-0 error code
set -e

echo "Updating node_modules"
npm ci

version=$(cat public/manifest.json | jq -r '.version')
name=$(cat public/manifest.json | jq -r '.name')
echo "Building $name $version"
npm run build

echo "Building Chrome zip."
zip -r "$name $version - Chrome.zip" build/ > /dev/null

echo "Building Firefox zip."
# use firefox manifest
cp build/manifest.json build/chrome.manifest.json
cp build/firefox.manifest.json build/manifest.json
zip -r "$name $version - Firefox.zip" build/* > /dev/null

# put files back in the right position
cp build/manifest.json build/firefox.manifest.json
cp build/chrome.manifest.json build/manifest.json

echo "DONE!"
