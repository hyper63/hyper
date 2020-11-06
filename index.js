require("dotenv").config();
require = require('esm')(module)
app = require('./src/main').default

app.listen(3000)