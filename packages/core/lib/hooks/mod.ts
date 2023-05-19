import { crocks, type HooksPort } from '../../deps.ts'
import { EventsManager } from '../../types.ts'

const { Async } = crocks

export default function ({
  events,
  hooks,
}: {
  events: EventsManager
  hooks: HooksPort
}) {
  /**
   * The hooks service is a method of introspection into the hyper
   * Service Framework. It provides insights
   * into each operation that flows through hyper.
   *
   * Hook implementing adapters can be provided via the hyper configuration
   * and used to integrate 3rd part tools for monitoring, metrics, etc.
   *
   * The hooks service merely subscribes to events emitted
   * by the EventManager, which is triggered by each service operation
   * that flows through core. (see triggerEvent)
   */
  events.subscribe((action) => {
    if (hooks && hooks.call) {
      Async.fromPromise(hooks.call)(action).fork(
        // deno-lint-ignore no-explicit-any
        (err: any) => console.log('ERROR', err.message),
        () => null,
      )
    } else {
      console.log(`${action.type}: ${JSON.stringify(action.payload)}`)
    }
  })

  return {
    status: () => Async.of({ ok: true, msg: 'listening for events' }),
  }
}
