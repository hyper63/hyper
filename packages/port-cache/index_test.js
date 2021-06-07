const test = require('tape')
const cachePort = require('./index.js')

test('port cache ok', t => {
  const goodCache = cachePort({
    createStore (name) {
      return Promise.resolve({ ok: true })
    },
    destroyStore (name) {
      return Promise.resolve({ ok: true })
    },
    createDoc ({
      store,
      key,
      value,
      ttl
    }) {
      return Promise.resolve({ ok: true })
    },
    getDoc ({ store, key }) {
      return Promise.resolve({ ok: true, doc: { beep: 'boop' } })
    },
    updateDoc ({ store, key, value, ttl }) {
      return Promise.resolve({ ok: true })
    },
    deleteDoc ({ store, key }) {
      return Promise.resolve({ ok: true })
    },
    listDocs ({ store, pattern }) {
      return Promise.resolve({ ok: true, docs: [] })
    }
  }
  )
  Promise.all([
    goodCache.createStore('foo'),
    goodCache.destroyStore('foo'),
    goodCache.createDoc({
      store: 'foo',
      key: 'hello',
      value: { beep: 'world' },
      ttl: '2m'
    }),
    goodCache.getDoc({ store: 'foo', key: 'hello' }),
    goodCache.updateDoc({ store: 'foo', key: 'hello', value: { baz: 'bam' } }),
    goodCache.deleteDoc({ store: 'foo', key: 'hello' }),
    goodCache.listDocs({ store: 'foo', pattern: 'w*' })
  ])
    .then(() => {
      t.ok(true)
      t.end()
    })
    .catch(e => {
      t.ok(false)
      t.end()
    })
})

test('port cache shape not ok', t => {
  t.end()
})

test('port cache methods not ok', t => {
  t.end()
})
