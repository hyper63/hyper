import { Request } from "node-fetch";
import connect from "./connect.js";

globalThis.Request = Request;

export default connect;
