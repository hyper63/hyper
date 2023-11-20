import { create as signJWT } from 'https://deno.land/x/djwt@v2.1/mod.ts'
import { contentType } from 'https://deno.land/std@0.207.0/media_types/mod.ts'
import { extname } from 'https://deno.land/std@0.207.0/path/mod.ts'
export { ms } from 'https://deno.land/x/ms@v0.1.0/ms.ts'

// @deno-types="npm:@types/ramda@^0.28.23"
export * as R from 'npm:ramda@0.28.0'

export { default as crocks } from 'npm:crocks@0.12.4'

/**
 * See deps.node.ts for shims of below
 */

export { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

export const generateToken = (sub: string, secret: string) => {
  const exp = Math.floor(Date.now() / 1000) + (60 * 5)
  return signJWT({ alg: 'HS256', type: 'JWT' }, { sub: sub, exp }, secret)
}

export const getMimeType = (name: string) => contentType(extname(name))
