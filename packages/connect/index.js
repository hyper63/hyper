import connect from "./nodejs/index.js";

if (!globalThis.Request) globalThis.Request = await import('node-fetch').Request;
if (!globalThis.fetch) globalThis.fetch = await import('node-fetch').default;

export default connect;
