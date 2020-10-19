module.exports = {
  cache: require("./redis"),
  data: require("./couchdb"),
  storage: require("./minio"),
};
