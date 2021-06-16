const path = require("path");

// load config and supply it to core
const config = require(path.join(__dirname, "/hyper63.config.js"));
require("@hyper63/core")(config);
