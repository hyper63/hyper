// load config and supply it to core
const path = require('path')
const config = require(path.join(__dirname, '/hyper63.config.js'))
require('@hyper63/core')(config)
