import { hyper } from "./deps.js";
import config from "./hyper.config.js";

export const main = (middleware = []) => {
  return hyper({
    ...config,
    middleware,
  });
};
