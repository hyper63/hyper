import type {
  CachePort,
  CrawlerPort,
  DataPort,
  QueuePort,
  SearchPort,
  StoragePort,
} from "./deps.ts";

import { parseHyperServices } from "./ports.ts";
import { eventMgr } from "./utils/event-mgr.ts";

export type HyperServices = ReturnType<typeof parseHyperServices> & {
  events: ReturnType<typeof eventMgr>;
  middleware: <A>(app: A) => A;
};

export type HyperService =
  | DataPort
  | CachePort
  | StoragePort
  | SearchPort
  | QueuePort
  | CrawlerPort;

export type ReaderEnvironment<Service extends HyperService = HyperService> = {
  svc: Service;
  events: ReturnType<typeof eventMgr>;
  isLegacyGetEnabled?: boolean;
};

export type { Config, Event } from "./model.ts";
