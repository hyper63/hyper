<h1 align="center">hyper-port-cache</h1>
<p align="center">Port for the Cache Service in the <a href="https://hyper.io/">hyper</a> Service Framework</p>
</p>
<p align="center">
  <a href="https://nest.land/package/hyper-port-cache"><img src="https://nest.land/badge.svg" alt="Nest Badge" /></a>
  <a href="https://jsr.io/@hyper63/port-cache"><img src="https://jsr.io/badges/@hyper63/port-cache" alt="" /></a>
  <a href="https://github.com/hyper63/hyper63/actions/workflows/port-cache.yml"><img src="https://github.com/hyper63/hyper63/actions/workflows/port-cache.yml/badge.svg" alt="Test" /></a>
</p>

The cache port takes an adapter and environment, then parses the adapter and wraps function
validations around each function.

Your adapter or composed adapter should implement all specified functions:

```js
export default (env) => ({
  createStore,
  destroyStore,
  createDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  listDocs,
})
```

You can create a test for your adapter with the port like so:

```js
import { default as test } from 'tape'
import { default as cache } from '@hyper63/ports-cache'
import { default as redis } from '@hyper63/adapters-redis'

test('certify adapter', async (t) => {
  t.plan(3)
  const instance = cache(redis, { url: 'redis://redis:6379' })
  const store = 'default'
  t.ok((await instance.createStore('default')).ok)
  t.ok(
    (
      await instance.createDoc({
        store: 'default',
        key: 'hello',
        value: { foo: 'bar' },
      })
    ).ok,
  )
  t.deepEqual((await instance.getDoc({ store: 'default', key: 'hello' })).doc, {
    foo: 'bar',
  })
})
```
