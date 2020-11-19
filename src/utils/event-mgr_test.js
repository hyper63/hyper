import { default as test } from 'tape'
import eventMgr from './event-mgr'

const events = eventMgr()

test('event mgr - happy path', t => {
  t.plan(2)
  const log = function(action) {
    console.log(`${action.type} - ${JSON.stringify(action.payload)}`)
    t.ok(true)
  }
  // maybe need to add unsubscribe?
  events.subscribe(log) // x = em.subscribe(fn); x.unsubscribe()

  // 
  events.dispatch({
    type: 'SEARCH:CREATE_DOC',
    payload: { date: new Date().toISOString(), app: 'foo', id: '1234'}
  })

  setTimeout(() => {
    events.dispatch({
      type: 'DATA:READ_DOC',
      payload: {date: new Date().toISOString(), app: 'bar', id: '4321'}
    }),
    500
  })
  
})