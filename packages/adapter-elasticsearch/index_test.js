import { default as test } from 'tape'
import {default as searchAdapter} from './index'
import schema from '../../utils/plugin-schema'

test('validate adapter', t => {
  t.plan(1)
  try {
    const result = schema(searchAdapter())
    t.ok(true)
  } catch (e) {
    console.log(e)
    t.ok(false)
  }
  
})