// See https://deno.land/manual@v1.31.1/advanced/typescript/types#providing-types-when-importing
// @deno-types="npm:@types/express@^4.17"
export { default as express } from 'npm:express@4.18.2'
export { default as cors } from 'npm:cors@2.8.5'

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
