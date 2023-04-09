import { crocks, R } from '../deps.ts'
import { type Event, type EventSubscription, eventSubscriptionSchema } from '../model.ts'

const { Identity } = crocks
const { is, append, map } = R

export function eventMgr() {
  let subscriptions = Identity<EventSubscription[]>([])

  return Object.freeze({
    subscribe(fn: EventSubscription) {
      if (!is(Function, fn)) return
      subscriptions = subscriptions.map(
        append(eventSubscriptionSchema.implement(fn)),
      )
    },

    dispatch(event: Event) {
      /**
       * We know each subscription is an EventSubscription
       * because we parse it as such on the initial subscribe
       *
       * So it's safe to declare here
       */
      map((fn: EventSubscription) => fn(event), subscriptions.valueOf())
    },
  })
}
