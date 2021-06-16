#!/usr/bin/env bash

deno fmt --check
deno test --allow-read --allow-write
