import { assertEquals } from '../dev_deps.ts'
import type { EventSubscription } from '../model.ts'

import { eventMgr } from './event-mgr.ts'

Deno.test('eventMgr', async (t) => {
  const events = eventMgr()

  await t.step('happy path', () => {
    return new Promise(function (resolve) {
      let count = 0
      const log: EventSubscription = function (action) {
        console.log(`${action.type} - ${JSON.stringify(action.payload)}`)
        count++
        if (count === 2) {
          assertEquals(true, true)
          resolve()
        }
      }
      // maybe need to add unsubscribe?
      events.subscribe(log) // x = em.subscribe(fn); x.unsubscribe()

      //
      events.dispatch({
        type: 'SEARCH:CREATE_DOC',
        payload: { date: new Date().toISOString(), app: 'foo', id: '1234' },
      })

      setTimeout(() => {
        events.dispatch({
          type: 'DATA:READ_DOC',
          payload: { date: new Date().toISOString(), app: 'bar', id: '4321' },
        })
      }, 500)
    })
  })
})
