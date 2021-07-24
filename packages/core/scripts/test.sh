#!/usr/bin/env bash

deno lint
deno fmt --check
deno test --unstable --allow-env --allow-read --allow-net lib/storage/*_test.js utils/*_test.js lib/cache/*_test.js lib/data/*_test.js lib/crawler/*_test.js mod_test.js

