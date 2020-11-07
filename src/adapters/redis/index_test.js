import { default as test } from 'tape'
import { RedisCacheAdapter } from './index'
import {default as schema} from '../../utils/plugin_schema'

test('validate schema', t => {
  t.ok(schema(RedisCacheAdapter()).success)
  t.end()
})