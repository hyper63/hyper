import { create as signJWT } from 'https://deno.land/x/djwt@v2.1/mod.ts'
import { contentType } from 'jsr:@std/media-types@^1'
import { extname } from 'jsr:@std/path@^1'
export { default as ms } from 'npm:ms@^2'

// @deno-types="npm:@types/ramda@^0.28.23"
export * as R from 'npm:ramda@0.28.0'

/**
 * See deps.node.ts for shims of below
 */

export { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

export const generateToken = (sub: string, secret: string) => {
  const exp = Math.floor(Date.now() / 1000) + (60 * 5)
  return signJWT({ alg: 'HS256', type: 'JWT' }, { sub: sub, exp }, secret)
}

export const getMimeType = (name: string) => contentType(extname(name))
