import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { update } from '../src/services/data'
import { identity } from 'ramda'

test('data.update', () => {
  const request = update('game-1', { foo: 'bar' })(identity)
  assert.is(request.service, 'data')
  assert.is(request.method, 'PUT')
  assert.is(request.resource, 'game-1')
  assert.is(request.body.foo, 'bar')
})

test.run()