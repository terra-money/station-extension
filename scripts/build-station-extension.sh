#!/bin/bash

# Remove node_modules and build directories
rm -rf node_modules
rm -rf build

# Install dependencies
npm install

# Comment out lines 25-27 in browser-polyfill.js
sed -i '25,27s/^/\/\//g' node_modules/webextension-polyfill/dist/browser-polyfill.js

# Build the project
npm run build

# Navigate to build directory and modify manifest.json
cd build

# Using jq to modify the JSON
jq '.content_scripts[0].js = ["contentScript.js"]' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json

# (Optional) Navigate back to the root for any subsequent steps in the workflow
cd ..

echo "Build complete!"
