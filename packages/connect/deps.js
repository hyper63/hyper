let signJWT, jwt;

const crocksLib = globalThis.Deno
  ? "https://cdn.skypack.dev/crocks@v0.12.4"
  : "crocks";
const RLib = globalThis.Deno ? "https://cdn.skypack.dev/ramda" : "ramda";
const jwtLib = globalThis.Deno
  ? "https://deno.land/x/djwt@v2.1/mod.ts"
  : "jsonwebtoken";

const crocks = (await import(crocksLib)).default;
const R = await import(RLib);

if (globalThis.Deno) {
  signJWT = (await import(jwtLib)).create;
} else {
  jwt = await import(jwtLib);
  signJWT = (headers, payload, secret) =>
    jwt(payload, secret, { algorithm: headers.alg });
}

export { crocks, R, signJWT };
