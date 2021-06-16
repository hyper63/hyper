#!/usr/bin/env bash

deno fmt --check
deno test *_test.js
