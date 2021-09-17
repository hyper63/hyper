let crocks, R, signJWT, jwt;

if (globalThis.Deno) {
  crocks = (await import("https://cdn.skypack.dev/crocks")).default;
  R = await import("https://cdn.skypack.dev/ramda");
  signJWT = (await import("https://deno.land/x/djwt@v2.1/mod.ts")).create;
} else {
  crocks = (await import("crocks")).default;
  R = (await import("ramda")).default;
  jwt = (await import("jsonwebtoken"));
  signJWT = (headers, payload, secret) =>
    jwt(payload, secret, { algorithm: headers.alg });
}

export { crocks, R, signJWT };
