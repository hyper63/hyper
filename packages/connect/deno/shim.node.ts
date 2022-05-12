// See https://github.com/fromdeno/deno2node#shimming

export { default as fetch, Headers, Request, Response } from "node-fetch";
export { default as FormData } from "form-data";
export { File } from "@web-std/file";
export { Deno } from "@deno/shim-deno";
