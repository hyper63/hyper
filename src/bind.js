require("dotenv").config();
/**
 * The core is where all the business logic
 * will be for the project
 *
 * This file should wrap the services
 * into the core rules modules so that
 * they have access to the services
 * that contain the implementation details
 * to create a dependency inversion.
 *
 * This dependency inversion will allow
 * the business rules to have no direct
 * dependencies to any implementation details
 */
const services = require("./services");
const core = require("./core");

const couchUrl = new URL(
  process.env.COUCH || "http://admin:password@couchdb:5984"
);
const minioUrl = new URL(
  process.env.MINIO || "http://minio:minio123@minio:9000"
);
const env = {
  cache: {
    url: process.env.REDIS || "redis://redis:6379",
  },
  data: {
    db: `${couchUrl.protocol}//${couchUrl.host}`,
    user: couchUrl.username,
    password: couchUrl.password,
  },
  storage: {
    endPoint: minioUrl.hostname,
    port: Number(minioUrl.port),
    accessKey: minioUrl.username,
    secretKey: minioUrl.password,
    useSSL: false,
  },
};
// bind services and environment to core
module.exports = () => {
  const initializedServices = {
    cache: services.cache(env.cache),
    data: services.data(env.data),
    storage: services.storage(env.storage),
  };
  return core(initializedServices);
};
