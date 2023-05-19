import { assertEquals } from '../../dev_deps.ts'
import { eventMgr } from '../../utils/event-mgr.ts'

import builder from './mod.ts'

const mockService = () => {
  let calls = 0
  return {
    calls() {
      return calls
    },
    call() {
      calls++
      return Promise.resolve()
    },
  }
}

const mockEvents = eventMgr()

Deno.test('hooks', async (t) => {
  await t.step('status', async (t) => {
    await t.step(
      'should return true if the hooks are listening to events',
      async () => {
        const hooks = builder({
          hooks: mockService(),
          events: mockEvents,
        })

        await hooks
          .status()
          .map((res) => assertEquals(res, { ok: true, msg: 'listening for events' }))
          .toPromise()
      },
    )
  })

  await t.step('should subscribe to events and invoke the hook', async () => {
    const mockHooks = mockService()
    builder({
      hooks: mockHooks,
      events: mockEvents,
    })

    mockEvents.dispatch({ type: 'foo', payload: { fizz: 'buzz' } })
    mockEvents.dispatch({ type: 'foo', payload: { fizz: 'buzz' } })

    await new Promise((r) => setTimeout(r, 100)) // wait until next tick

    assertEquals(mockHooks.calls(), 2)
  })
})
