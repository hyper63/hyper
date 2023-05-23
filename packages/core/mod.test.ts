// deno-lint-ignore-file ban-ts-comment

import {
  default as pouchdb,
  PouchDbAdapterTypes,
} from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-pouchdb/v0.1.7/mod.js'
import memory from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-memory/v2.0.0/mod.js'

import { R } from './deps.ts'
import { assert, assertEquals } from './dev_deps.ts'

const { compose } = R

import type { Config } from './model.ts'
import core from './mod.ts'

Deno.env.set('DENO_ENV', 'test')

const config: Config = {
  /**
   * A simple stub driving app
   * to assert that it is being called to bootstrap
   * the hyper server
   */
  app: (services) => {
    let app = { services, app: true }
    /**
     * Run the 'app' through the provided middleware
     */
    // @ts-ignore
    app = compose(...services.middleware)(app)
    return app
  },
  adapters: [
    {
      port: 'data',
      /**
       * types are inaccurate in the adatper, so once that is
       * addressed, this should no longer be needed
       */
      // @ts-ignore
      plugins: [pouchdb({ storage: PouchDbAdapterTypes.memory })],
    },
    { port: 'cache', plugins: [memory()] },
  ],
  middleware: [
    (app) => ({
      ...app,
      foo: 'bar',
    }),
    (app) => ({
      ...app,
      fizz: 'buzz',
    }),
  ],
}

Deno.test('mod', async (t) => {
  await t.step(
    'should compose the driving adapter with the driven adapters',
    async () => {
      const server = await core(config)
      assert(server.app)
      assert(server.services.data)
      assert(server.services.cache)
    },
  )

  await t.step(
    'should pass the middleware to the driving adapter',
    async () => {
      const server = await core(config)
      assertEquals(server.foo, 'bar')
      assertEquals(server.fizz, 'buzz')
    },
  )

  await t.step(
    'should pass the eventMgr to the driving adapter as a service',
    async () => {
      const server = await core(config)
      assert(server.services.events)
    },
  )
})
