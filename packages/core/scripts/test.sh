#!/usr/bin/env bash

deno lint && \
deno fmt --check && \
deno test --unstable --allow-env --allow-read --allow-sys --allow-net --no-check=remote mod_test.js lib/**/*_test.js

