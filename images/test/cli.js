#!/usr/bin/env node

const path = require("path");

const config = require(path.join(__dirname, "/hyper63.config.js"));
require("@hyper63/core")(config);
