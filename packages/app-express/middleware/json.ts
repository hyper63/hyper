import { express } from '../deps.ts'

/**
 * Parses a requst body as JSON. Identical
 * to the standard json() middleware with the distinction
 * of setting a default catch-all content type option.
 *
 * Because we set type to a wildcard,
 * This middleware will always parse the request body as JSON, regardless of
 * content-type header.
 *
 * This is to take into account, badly behaved clients
 * that don't provide the header explictly
 */
export const json = (options: Parameters<typeof express.json>[0] = {}) =>
  express.json({ type: '*/*', ...options })
