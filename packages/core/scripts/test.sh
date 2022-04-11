#!/usr/bin/env bash

deno lint && \
deno fmt --check && \
deno test --unstable --allow-env --allow-read --allow-net lib/**/*_test.js

