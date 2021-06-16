#!/usr/bin/env bash

deno fmt --check
deno test --allow-env --allow-read --allow-write --unstable
