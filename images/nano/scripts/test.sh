deno lint
deno fmt --check
DENO_ENV=test deno test -A --unstable mod_test.js