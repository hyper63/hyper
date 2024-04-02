// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals, assertObjectMatch } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  index: () => Promise.resolve({ ok: true }),
  createStore: (name: any) =>
    Promise.resolve({
      ok: true,
      name,
    }),
  destroyStore: (name: any) => Promise.resolve({ ok: true, name }),
  listDocs: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  createDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  // legacy get response
  getDoc: (arg: any) => Promise.resolve({ hello: 'world', ...arg }),
  updateDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  deleteDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('cache', async (t) => {
  const cache = builder({
    cache: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .index()
        .map(() => assert(true))
        .toPromise()
    })
  })

  await t.step('createStore', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .createStore('hello')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'hello')
        })
        .toPromise()
    })

    await t.step(
      'should lowercase the name passed to the adapter',
      async () => {
        await cache
          .createStore('Hello')
          .map((res) => {
            // @ts-expect-error
            assertEquals(res.name, 'hello')
          })
          .toPromise()
      },
    )

    await t.step('should resolve HyperErr if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await cache
          .createStore('_foo')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a space', async () => {
        await cache
          .createStore('foo bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a slash', async () => {
        await cache
          .createStore('foo/bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains non URI friendly character', async () => {
        await cache
          .createStore('foo?bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })
    })
  })

  await t.step('deleteStore', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .deleteStore('hello')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'hello')
        })
        .toPromise()
    })

    await t.step('should resolve HyperErr if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await cache
          .deleteStore('_foo')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a space', async () => {
        await cache
          .deleteStore('foo bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a slash', async () => {
        await cache
          .deleteStore('foo/bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains non URI friendly character', async () => {
        await cache
          .deleteStore('foo?bar')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })
    })
  })

  await t.step('queryStore', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .queryStore('hello', 'foo*')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.store, 'hello')
          // @ts-expect-error
          assertEquals(res.pattern, 'foo*')
        })
        .toPromise()
    })

    await t.step('should resolve HyperErr if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await cache
          .queryStore('_foo', 'foo*')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a space', async () => {
        await cache
          .queryStore('foo bar', 'foo*')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains a slash', async () => {
        await cache
          .queryStore('foo/bar', 'foo*')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })

      await t.step('contains non URI friendly character', async () => {
        await cache
          .queryStore('foo?bar', 'foo*')
          .toPromise()
          .then((err: any) => {
            assertEquals(err.status, 422)
          })
      })
    })
  })

  await t.step('createDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .createDoc('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
            value: { hello: 'world' },
            ttl: '20000',
          })
          return res
        })
        .toPromise()
    })

    await t.step('should convert the ttl, if provided', async () => {
      await cache
        .createDoc('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          // @ts-ignore
          assertEquals(res.ttl, '20000')
          return res
        })
        .toPromise()
    })

    await t.step('should remove the ttl, if not provided', async () => {
      await cache
        .createDoc('store', 'key', { hello: 'world' })
        .map((res) => {
          assert(!Object.hasOwn(res, 'ttl'))
          return res
        })
        .toPromise()
    })

    await t.step('should resolve HyperErr if cache doc has an invalid key', async () => {
      await cache
        .createDoc('store', 'Not_Valid', { beep: 'boop' })
        .toPromise()
        .then((err: any) => {
          assertEquals(err.status, 422)
        })
    })
  })

  await t.step('getDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .getDoc('foo', 'key', true)
        .map((res) => {
          assertObjectMatch(res, {
            store: 'foo',
            key: 'key',
          })
        })
        .toPromise()
    })

    await t.step(
      'should NOT return a hyper response shape if isLegacyGetEnabled',
      async () => {
        await cache
          .getDoc('foo', 'key', true)
          .map((res) => {
            // @ts-expect-error
            assert(res.hello)
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper error shape if isLegacyGetEnabled',
      async () => {
        const cacheWithErr = builder({
          cache: {
            ...mockService,
            getDoc() {
              // HyperErr shape
              return Promise.resolve({ ok: false, msg: 'oops' })
            },
          },
          events: mockEvents,
        } as unknown as any)

        await cacheWithErr
          .getDoc('foo', 'err', true)
          .map((res) => {
            // @ts-expect-error
            assert(!res.ok)
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper response shape if NOT isLegacyGetEnabled',
      async () => {
        await cache
          .getDoc('foo', 'key', false)
          .map((res) => {
            // @ts-expect-error
            assert(res.ok)
            // @ts-expect-error
            assert(res.doc.hello)
          })
          .toPromise()
      },
    )

    await t.step(
      'should passthrough a hyper error shape if NOT isLegacyGetEnabled',
      async () => {
        const cacheWithErr = builder({
          cache: {
            ...mockService,
            getDoc() {
              // NOT legacyGet response
              return Promise.resolve({ ok: false, msg: 'oops' })
            },
          },
          events: mockEvents,
        } as unknown as any)

        await cacheWithErr
          .getDoc('foo', 'err', false)
          .map((res) => {
            // @ts-expect-error
            assert(!res.ok)
          })
          .toPromise()
      },
    )
  })

  await t.step('updateDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .updateDoc('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
            value: { hello: 'world' },
            ttl: '20000',
          })
        })
        .toPromise()
    })

    await t.step('should convert the ttl, if provided', async () => {
      await cache
        .updateDoc('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          // @ts-ignore
          assertEquals(res.ttl, '20000')
          return res
        })
        .toPromise()
    })

    await t.step('should remove the ttl, if not provided', async () => {
      await cache
        .updateDoc('store', 'key', { hello: 'world' })
        .map((res) => {
          assert(!Object.hasOwn(res, 'ttl'))
          return res
        })
        .toPromise()
    })

    await t.step('should resolve HyperErr if cache doc has an invalid key', async () => {
      await cache
        .updateDoc('store', 'Not_Valid', { beep: 'boop' })
        .toPromise()
        .then((err: any) => {
          assertEquals(err.status, 422)
        })
    })
  })

  await t.step('deleteDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await cache
        .deleteDoc('store', 'key')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
          })
        })
        .toPromise()
    })

    await t.step('should resolve HyperErr if cache doc has an invalid key', async () => {
      await cache
        .deleteDoc('store', 'Not_Valid')
        .toPromise()
        .then((err: any) => {
          assertEquals(err.status, 422)
        })
    })
  })
})
