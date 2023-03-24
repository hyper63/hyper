// See https://deno.land/manual@v1.31.1/advanced/typescript/types#providing-types-when-importing
// @deno-types="npm:@types/express@^4.17"
export { default as express } from 'npm:express@4.18.2'
// @deno-types="npm:@types/multer@^1.4.7"
export { default as multer } from 'npm:multer@1.4.4'
// @deno-types="npm:@types/body-parser@^1.19.2"
export { default as bodyParser } from 'npm:body-parser@1.20.2'
export { default as cors } from 'npm:cors@2.8.5'

export { readerFromIterable } from 'https://deno.land/std@0.181.0/streams/reader_from_iterable.ts'

/**
 * We will try to use skypack over npm
 * to avoid the npm/node compat layer
 *
 * and let Skypack do the heavy lifting of that compat
 * beforehand
 *
 * TODO: revisit whether this is still working for us
 */
export { default as helmet } from 'https://cdn.skypack.dev/helmet@6.0.1?dts'
export * as R from 'https://cdn.skypack.dev/ramda@0.28.0?dts'

export { default as crocks } from 'https://cdn.skypack.dev/crocks@0.12.4?dts'

export { isHyperErr } from 'https://x.nest.land/hyper-utils@0.1.0/hyper-err.js'
