import type {
  CachePort,
  CrawlerPort,
  DataPort,
  HooksPort,
  QueuePort,
  SearchPort,
  StoragePort,
} from './deps.ts'

import type { parseHyperServices } from './ports.ts'
import type { eventMgr } from './utils/event-mgr.ts'

export type EventsManager = ReturnType<typeof eventMgr>

export type HyperServices = ReturnType<typeof parseHyperServices> & {
  events: EventsManager
  middleware: <A>(app: A) => A
}

export type HyperService =
  | DataPort
  | CachePort
  | StoragePort
  | SearchPort
  | QueuePort
  | CrawlerPort
  | HooksPort

export type ReaderEnvironment<Service extends HyperService = HyperService> = {
  svc: Service
  events: EventsManager
  isLegacyGetEnabled?: boolean
}

export type { Config, Event } from './model.ts'

// deno-lint-ignore no-explicit-any
export type AwaitedFn<F extends (...args: any) => any> = Awaited<ReturnType<F>>
