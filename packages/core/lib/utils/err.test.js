import { assert, assertEquals } from '../../dev_deps.ts'
import { R, z } from '../../deps.ts'

import { HyperErrFrom, mapErr, mapStatus } from './err.js'

const { has } = R

const { test } = Deno

test('mapErr - should map the error', () => {
  let res = mapErr('foobar')
  assertEquals(res, 'foobar')

  res = mapErr(new Error('foobar'))
  assertEquals(res, 'foobar')

  res = mapErr({ message: 'foobar' })
  assertEquals(res, 'foobar')

  res = mapErr({ foo: 'bar' })
  assertEquals(res, JSON.stringify({ foo: 'bar' }))

  // recursion
  res = mapErr({ error: 'bar' })
  assertEquals(res, 'bar')

  res = mapErr({ errors: 'bar' })
  assertEquals(res, 'bar')

  res = mapErr({ error: { error: { error: 'bar' } } })
  assertEquals(res, 'bar')

  res = mapErr([{ error: 'foo' }, { message: 'bar' }])
  assertEquals(res, 'foo, bar')

  // generic
  res = mapErr(undefined)
  assertEquals(res, 'An error occurred')

  // field preference
  res = mapErr({ msg: 'foo', error: { msg: 'bar' } })
  assertEquals(res, 'foo')

  res = mapErr({ msg: { error: 'foo' }, error: { msg: 'bar' } })
  assertEquals(res, 'foo')
})

test('mapStatus - should parse status', () => {
  assertEquals(mapStatus(200), 200)
  assertEquals(mapStatus({ status: 200 }), 200)
  assertEquals(mapStatus({ statusCode: 200 }), 200)

  // parseable
  assertEquals(mapStatus('200'), 200)

  // not parseable
  assertEquals(mapStatus('foo'), undefined)
  assertEquals(mapStatus(undefined), undefined)
  assertEquals(mapStatus({}), undefined)

  // field preference
  assertEquals(mapStatus({ status: 200, statusCode: 400 }), 200)
  assertEquals(
    mapStatus({ status: { statusCode: 200 }, statusCode: 400 }),
    200,
  )
})

test('HyperErrFrom - should accept nil, string, object, array, function, basically should never throw', () => {
  assert(HyperErrFrom())
  assert(HyperErrFrom({}))
  assert(HyperErrFrom('foo'))
  assert(HyperErrFrom({ msg: 'foo' }))
  assert(HyperErrFrom({ foo: 'bar' }))
  assert(HyperErrFrom([]))
  assert(HyperErrFrom(function () {}))
})

test('HyperErrFrom - should map ZodError to HyperErr', async () => {
  const schema = z.function().args(z.object({ name: z.string() })).returns(
    z.promise(z.object({ ok: z.boolean() })),
  )

  const fn = schema.validate(function wrongReturn() {
    return Promise.resolve({ not: 'ok' })
  })

  const err = await fn({ name: 'string' }).catch(HyperErrFrom)

  assertEquals(err.ok, false)
  assertEquals(err.status, 500)
  assertEquals(err.msg, "Invalid Return 'ok': Required.")

  const errWrongArgs = await fn({ name: 123 }).catch(HyperErrFrom)

  assertEquals(errWrongArgs.ok, false)
  assertEquals(errWrongArgs.status, 422)
  assertEquals(
    errWrongArgs.msg,
    "Invalid Arguments 'name': Expected string, received number.",
  )
})

test('HyperErrFrom - should set originalErr', () => {
  const base = HyperErrFrom()
  const withBase = HyperErrFrom({ ok: false })
  const withStatus = HyperErrFrom({ status: 404 })
  const fromStr = HyperErrFrom('foo')
  const fromObj = HyperErrFrom({ msg: 'foo' })
  const strip = HyperErrFrom({ msg: 'foo', omit: 'me' })
  const withInvalidStatus = HyperErrFrom({ status: 'not_parseable' })
  ;[base, withBase, withStatus, fromStr, fromObj, strip, withInvalidStatus]
    .forEach(
      (err) => assert(has('originalErr', err)),
    )
})
