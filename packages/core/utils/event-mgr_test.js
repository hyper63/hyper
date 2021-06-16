import eventMgr from './event-mgr.js'
import { assertEquals } from '../dev_deps.js'

const test = Deno.test

const events = eventMgr()

test('event mgr - happy path', () => {
  return new Promise(function (resolve) {
    let count = 0
    const log = function (action) {
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
      payload: { date: new Date().toISOString(), app: 'foo', id: '1234' }
    })

    setTimeout(() => {
      events.dispatch({
        type: 'DATA:READ_DOC',
        payload: { date: new Date().toISOString(), app: 'bar', id: '4321' }
      })
    }, 500)
  })
})
