// deno-lint-ignore-file ban-ts-comment

import { default as mongodb } from 'https://raw.githubusercontent.com/hyper63/hyper-adapter-mongodb/v3.3.0/mod.ts'

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
      plugins: [mongodb({ dir: '__hyper__', dirVersion: '7.0.4' })],
    },
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

Deno.test({
  name: 'mod',
  fn: async (t) => {
    // deno-lint-ignore no-explicit-any
    let server: any
    await t.step('init hyper Server', async () => {
      server = await core(config)
    })

    await t.step(
      'should compose the driving adapter with the driven adapters',
      () => {
        assert(server.app)
        assert(server.services.data)
      },
    )

    await t.step(
      'should pass the middleware to the driving adapter',
      () => {
        assertEquals(server.foo, 'bar')
        assertEquals(server.fizz, 'buzz')
      },
    )

    await t.step(
      'should pass the eventMgr to the driving adapter as a service',
      () => {
        assert(server.services.events)
      },
    )
  },
  sanitizeOps: false,
  sanitizeResources: false,
})
