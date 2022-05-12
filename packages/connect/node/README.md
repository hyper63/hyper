# Node `hyper-connect`

Some tests for verifying `hyper-connect` works in Node

## Getting Started

`make test-integration` from the root will transform the Deno code into Node
code, and then run the unit tests and integration tests for node.

You can run `yarn && yarn test` here as well, but you must first transform the
Deno code into Node code using the `Makefile` rule `to-node`:

```sh
make clean to-node
```

## Background

`hyper-connect` is written as a Deno first class citizen and is "transformed" to
run on Node using [`deno2node`](https://github.com/fromdeno/deno2node), the
bundled into `esm`, `cjs` and `umd` modules using
[`microbundle`](https://github.com/developit/microbundle).

Part of that transformation involves shimming global dependencies available in
Deno, but not in Node (see [node shims](../deno/shim.node.ts)) and also
replacing dependencies used in Deno with deps used in Node (see
[node deps](../deno/deps.node.ts) and how they differ from
[deno deps](../deno/deps.deno.ts))

There are a lot of moving parts, so we have a couple things to test:

- Unit test custom code in [node deps](../deno/deps.node.ts)
- Integration test to ensure `hyper-connect` can be used in a ESM project
  (`type: "module"`)
- Integration test to ensure `hyper-connect` can be used in a CJS project
  (`type: "commonjs"`)

### Relevant Code

Unit tests are found in `./tests` and contain tests only for the bits of custom
code used in Node, and not in Deno. All other coverage is achieved in Deno unit
tests

For the integration tests, we have a `./harness` folder that contains an `esm`
project and a `cjs` project. They both simply instantiate `hyper-connect` and
make a call to fetch services list. This is to ensure the global shims are
working as expected.

Both of the harnesses use `yarn link` to link their `hyper-connect` dependency
to the built output (`dist`) at the root of the `hyper-connect` module. This is
to help ensure module loading is working correctly for each each respective
harness.
