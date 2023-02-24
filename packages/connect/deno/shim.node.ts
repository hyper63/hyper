// See https://github.com/fromdeno/deno2node#shimming

export { fetch, File, FormData, Headers, Request, Response } from 'undici';
export { Deno } from '@deno/shim-deno';
