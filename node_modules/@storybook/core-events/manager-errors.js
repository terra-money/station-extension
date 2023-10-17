// This is required for projects that require paths such as `@storybook/core-events/manager-errors`
// but in CJS, while not in ESM mode. Else an error like this will occur:
// ENOENT: no such file or directory, open '/xyz/node_modules/@storybook/core-events/manager-errors.js'
module.exports = require('./dist/errors/manager-errors');
