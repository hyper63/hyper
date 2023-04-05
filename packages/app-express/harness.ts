// Load .env
import 'https://deno.land/std@0.182.0/dotenv/load.ts'

import { default as core } from 'https://x.nest.land/hyper@3.4.2/mod.js'
import namespacedS3 from 'https://x.nest.land/hyper-adapter-namespaced-s3@3.0.0/mod.js'

import app from './mod.ts'

const hyperConfig = {
  app,
  adapters: [{ port: 'storage', plugins: [namespacedS3('express-harness')] }],
}

core(hyperConfig)
