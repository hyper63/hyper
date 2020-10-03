const express = require("express");
const helmet = require("helmet");

const app = express();
const port = process.env.PORT || 6363;

app.use(helmet());

app.use("/micro/data", require("./api/data"));
app.use("/micro/cache", require("./api/cache"));
app.use("/micro/storage", require("./api/storage"));
app.use("/micro/hooks", require("./api/hooks"));

app.get("/", (req, res) => res.send({ name: "Atlas" }));

app.listen(port);
console.log(`Atlas is running on port ${port}`);
