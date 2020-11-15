import {default as test} from 'tape'
import { initAdapters } from './plugins'
import {default as validate} from  './plugin-schema'

test('sucessfully compose plugins', t => {
  const plugin1 = validate({
    id: 'plugin1',
    port: 'default',
    load: (env) => ({ ...env, hello: 'world' }),
    link: env => _ => ({ hello: () => env.hello })
  })

  const plugin2 = config => validate({
    id: 'plugin2',
    port: 'default',
    load: (env) => ({...env, ...config}),
    link: env => plugin => ({...plugin, beep: () => env })
  })

  const config = {
    adapters: [
      { port: 'default', plugins: [plugin2({foo: 'bar'}), plugin1]}
    ]
  }
  const adapters = initAdapters(config.adapters)
  
  t.equal(adapters.default.hello(), 'world')
  t.deepEqual(adapters.default.beep(), {foo: 'bar', hello: 'world'})
  t.ok(true)
  t.end()
})

