import connect from "./nodejs/index.js";

if (!globalThis.Request) {
  throw new Error(
    "Request is not found, please import the Request Class from a fetch library like node-fetch",
  );
}
if (!globalThis.fetch) {
  throw new Error(
    "fetch is not found, please import fetch function from a fetch library like node-fetch",
  );
}

export default connect;
