/**
 * https://github.com/fromdeno/deno2node#runtime-specific-code
 *
 * We export dependencies from node_modules to match shape of
 * deno deps from deps.ts
 */

// deno-lint-ignore ban-ts-comment
// @ts-ignore
export * as R from 'ramda'
export { default as ms } from 'ms'
// deno-lint-ignore ban-ts-comment
// @ts-ignore
export { default as crocks } from 'crocks'

import { SignJWT } from 'jose'
import { BinaryToTextEncoding, createHmac, createSecretKey } from 'crypto'
import { lookup } from 'mime-types'

/**
 * Shim for https://deno.land/x/hmac@v2.0.1/mod.ts
 */
export const hmac = (
  alg: 'sha256',
  secret: string,
  data: string,
  inputEncoding: BufferEncoding,
  outputEncoding: BinaryToTextEncoding,
) => {
  const result = createHmac(alg, secret, { encoding: inputEncoding })
  result.update(data)
  return result.digest(outputEncoding)
}

/**
 * Shim for https://deno.land/x/djwt@v2.1/mod.ts usage
 */
export const generateToken = async (sub: string, secret: string) => {
  const key = createSecretKey(Buffer.from(secret, 'utf-8'))
  const token = await new SignJWT({ sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(key)
  return token
}

export const getMimeType = (name: string) => lookup(name)
