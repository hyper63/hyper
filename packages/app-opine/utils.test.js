import { crocks } from './deps.js'
import { assert, assertEquals } from './dev_deps.js'

import { fork, isFile, isMultipartFormData, isTrue } from './utils.js'

const { Async } = crocks

let result
const res = {
  setStatus: () => res,
  send: (r) => {
    result = r
  },
}

const env = Deno.env.get('DENO_ENV')
const cleanup = () => env ? Deno.env.set('DENO_ENV', env) : Deno.env.delete('DENO_ENV')

Deno.test('utils', async (t) => {
  await t.step('fork', async (t) => {
    await t.step('should sanitize errors on both branches', async () => {
      Deno.env.set('DENO_ENV', 'production')

      // resolved success
      await fork(res, 200, Async.Resolved({ ok: true }))
      assert(result.ok)

      // resolved error
      await fork(
        res,
        200,
        Async.Resolved({ ok: false, originalErr: 'foobar' }),
      )
      assertEquals(result.ok, false)
      assert(!result.originalErr)

      // rejected error (fatal)
      await fork(
        res,
        200,
        Async.Rejected({ ok: false, originalErr: 'foobar' }),
      )
      assertEquals(result, 'Internal Server Error')

      cleanup()
    })

    await t.step('should NOT sanitize errors on both branches', async () => {
      Deno.env.set('DENO_ENV', 'foo')

      // resolved success
      await fork(res, 200, Async.Resolved({ ok: true }))
      assert(result.ok)

      // resolved error
      await fork(
        res,
        200,
        Async.Resolved({ ok: false, originalErr: 'foobar' }),
      )
      assertEquals(result.ok, false)
      assert(result.originalErr)

      // rejected error (fatal)
      await fork(
        res,
        200,
        Async.Rejected({ ok: false, originalErr: 'foobar' }),
      )
      assertEquals(result.ok, false)
      assert(result.originalErr)

      cleanup()
    })
  })

  await t.step('isMultipartFormData', async (t) => {
    await t.step(
      'should return true if header indicates multipart/form-data',
      () => {
        assert(isMultipartFormData('multipart/form-data'))
        assert(!isMultipartFormData('application/json'))
        assert(!isMultipartFormData())
      },
    )
  })

  await t.step('isFile', async (t) => {
    await t.step(
      'should return true if path points to a file',
      () => {
        assert(isFile('/foo.jpg'))
        assert(!isFile('/foo'))
        assert(!isFile())
      },
    )
  })

  await t.step('isTrue', async (t) => {
    await t.step(
      'should return true if value is true-like',
      () => {
        assert(isTrue(true))
        assert(isTrue('true'))
        assert(!isTrue('t'))
        assert(!isTrue(false))
        assert(!isTrue('false'))
        assert(!isTrue(''))
      },
    )
  })
})
