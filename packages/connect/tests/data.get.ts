import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { get } from '../src/services/data'
import { identity } from 'ramda'

test('data.get', () => {
  const request = get('game-1')(identity)
  assert.is(request.service, 'data')
  assert.is(request.method, 'GET')
  assert.is(request.resource, 'game-1')
})

test.run()