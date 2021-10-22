import fetch, { Request } from "node-fetch";
import connect from "./nodejs/index.js";

if (!globalThis.Request) globalThis.Request = Request;
if (!globalThis.fetch) globalThis.fetch = fetch;

export default connect;
