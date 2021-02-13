
const test = require('tape')
const elasticsearchAdapterFactory = require('./index')

test('validate adapter', t => {
  const adapter = elasticsearchAdapterFactory({})
  t.ok(adapter)
  t.end()
})

test('validate load()', t => {
  const config = { foo: 'bar' }
  const adapter = elasticsearchAdapterFactory(config)

  const loadedConfig = adapter.load({ fizz: 'buzz' })
  t.equals(loadedConfig.foo, config.foo)
  t.equals(loadedConfig.fizz, 'buzz')
  t.end()
})

test('validate link()', t => {
  const config = {
    username: 'foo',
    password: 'bar',
    url: 'http://localhost:9200'
  }

  const adapter = elasticsearchAdapterFactory(config)
  t.ok(adapter.link(config)())
  t.end()
})

test('validate link() - no url', t => {
  const config = {
    username: 'foo',
    password: 'bar',
    no_url: 'http://localhost:9200'
  }

  const adapter = elasticsearchAdapterFactory(config)
  t.throws(() => adapter.link(config)(), 'Config URL is required elastic search')
  t.end()
})
