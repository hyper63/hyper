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
const env = {
  cache: {
    url: "redis://redis:6379",
  },
  data: {
    db: "http://couchdb:5984",
    user: "admin",
    password: "password",
  },
};
// bind services and environment to core
module.exports = () => {
  const initializedServices = {
    cache: services.cache(env.cache),
    data: services.data(env.data),
  };
  return core(initializedServices);
};
