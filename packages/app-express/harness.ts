// Load .env
import 'https://deno.land/std@0.208.0/dotenv/load.ts'

import { join } from 'https://deno.land/std@0.208.0/path/mod.ts'

import { default as core } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper%40v4.3.2/packages/core/mod.ts'

import { default as sqlite } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-sqlite/v2.0.12/mod.js'
import { default as fs } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-fs/v3.0.2/mod.js'
import { default as minisearch } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-minisearch/v2.1.4/mod.js'
import { default as mongodb } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-mongodb/v3.3.0/mod.ts'
import { default as queue } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-queue/v0.3.1/mod.js'

import app from './mod.ts'

async function mkdir(DIR: string) {
  try {
    return await Deno.mkdir(DIR, { recursive: true })
  } catch (err) {
    if (err instanceof Deno.errors.AlreadyExists) {
      // already exists so return
      return true
    } else {
      // unexpected error, maybe permissions, pass it along
      throw err
    }
  }
}

async function main() {
  const DIR = join('.', '__hyper__')

  await mkdir(DIR)

  const hyperConfig = {
    app,
    adapters: [
      {
        port: 'data' as const,
        plugins: [mongodb({ dir: DIR, dirVersion: '7.0.4' })],
      },
      {
        port: 'cache' as const,
        plugins: [sqlite({ dir: DIR })],
      },
      {
        port: 'storage' as const,
        plugins: [fs({ dir: DIR })],
      },
      {
        port: 'search' as const,
        plugins: [minisearch({ dir: DIR })],
      },
      {
        port: 'queue' as const,
        // @ts-ignore name is actually optional, so this error can be ignored. TODO: update the types
        plugins: [queue({ dir: DIR })],
      },
    ],
    middleware: [],
  }

  return core(hyperConfig)
}

main()
