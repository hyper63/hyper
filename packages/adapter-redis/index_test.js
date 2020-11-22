import { default as test } from 'tape'
import { default as RedisCacheAdapter } from './index'
import {default as schema} from '../../utils/plugin-schema'

test('validate schema', t => {
  t.ok(schema(RedisCacheAdapter()))
  //t.ok(true)
  t.end()
})