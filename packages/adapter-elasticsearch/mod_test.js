
import { assert, assertEquals, assertThrows } from './dev_deps.js'

import elasticsearchAdapterFactory from './mod.js'

Deno.test('validate adapter', () => {
  const adapter = elasticsearchAdapterFactory({})
  assert(adapter)
})

Deno.test('validate load()', () => {
  const config = { foo: 'bar' }
  const adapter = elasticsearchAdapterFactory(config)

  const loadedConfig = adapter.load({ fizz: 'buzz' })
  assertEquals(loadedConfig.foo, config.foo)
  assertEquals(loadedConfig.fizz, 'buzz')
})

Deno.test('validate link()', () => {
  const config = {
    username: 'foo',
    password: 'bar',
    url: 'http://localhost:9200'
  }

  const adapter = elasticsearchAdapterFactory(config)
  assert(adapter.link(config)())
})

Deno.test('validate link() - no url', () => {
  const config = {
    username: 'foo',
    password: 'bar',
    // deno-lint-ignore camelcase
    no_url: 'http://localhost:9200'
  }

  const adapter = elasticsearchAdapterFactory(config)
  assertThrows(() => adapter.link(config)(), Error, 'Config URL is required elastic search')
})
