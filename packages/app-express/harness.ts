// Load .env
import 'https://deno.land/std@0.182.0/dotenv/load.ts'

import { default as core } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper%40v4.0.0/packages/core/mod.ts'
import namespacedS3 from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-namespaced-s3/v3.0.0/mod.js'

import app from './mod.ts'

const hyperConfig = {
  app,
  adapters: [{ port: 'storage', plugins: [namespacedS3('express-harness')] }],
}

core(hyperConfig)
