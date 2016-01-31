require('babel-register')
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
module.exports = require('./src')
