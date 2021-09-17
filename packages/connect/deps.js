let crocks, R, signJWT, jwt

if (globalThis.Deno) {
  crocks = (await import('https://cdn.skypack.dev/crocks')).default
  R = await import('https://cdn.skypack.dev/ramda')
  signJWT = (await import('https://deno.land/x/djwt@2.1/mod.ts')).create
} else {
  crocks = (await import('crocks')).default
  R = (await import('ramda')).default
  jwt = (await import('jsonwebtoken'))
}

// create generic sign jwt method and export it

export { crocks, R }
