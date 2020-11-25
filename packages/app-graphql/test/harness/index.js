
require("dotenv").config();
require = require('esm')(module)

// Hacky way to run a separate hyper63 server with a separate hyper63.config
require('../../../../main').default
