import { create as signJWT } from 'https://deno.land/x/djwt@v2.1/mod.ts'

export * as R from 'https://cdn.skypack.dev/ramda@0.28.0'
export { default as crocks } from 'https://cdn.skypack.dev/crocks@0.12.4'
export { ms } from 'https://deno.land/x/ms@v0.1.0/ms.ts'

/**
 * See deps.node.ts for shims of below
 */

export { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

export const generateToken = (sub: string, secret: string) => {
  const exp = Math.floor(Date.now() / 1000) + (60 * 5)
  return signJWT({ alg: 'HS256', type: 'JWT' }, { sub: sub, exp }, secret)
}
