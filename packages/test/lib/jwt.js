import { encode } from "base64url";
import { HmacSha256 } from "sha256";

export default function (username, password) {
  const hdr = encode(new TextEncoder().encode(JSON.stringify({
    alg: "HS256",
    typ: "JWT",
  })));
  const payload = encode(new TextEncoder().encode(JSON.stringify({
    sub: username,
  })));
  //console.log("pwd: " + password);
  // NOTE: sig does not appear to be working...
  const sig = (new HmacSha256(password)).update(`${hdr}.${payload}`).toString();
  const tkn = `${hdr}.${payload}.${sig}`;
  //console.log(tkn);
  return tkn;
}