let signJWT, jwt, crocks, R;

const crocksLib = globalThis.Deno
  ? "https://cdn.skypack.dev/crocks@v0.12.4"
  : "crocks";
const RLib = globalThis.Deno ? "https://cdn.skypack.dev/ramda" : "ramda";
const jwtLib = globalThis.Deno
  ? "https://deno.land/x/djwt@v2.1/mod.ts"
  : "jsonwebtoken";

if (globalThis.Deno) {
  crocks = (await import(crockLib)).default;
  R = await import(RLib);
  signJWT = (await import(jwtLib)).create;
} else {
  crocks = (await import(crockLib)).default;
  R = (await import(RLib)).default;
  jwt = (await import(jwtLib));
  signJWT = (headers, payload, secret) =>
    jwt(payload, secret, { algorithm: headers.alg });
}
  
export { crocks, R, signJWT };
