#!/usr/bin/env bash

deno lint && deno fmt --check && deno test -A --no-lock --no-check --unstable 