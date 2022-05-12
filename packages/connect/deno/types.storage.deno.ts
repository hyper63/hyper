import { Result } from "./types.ts";

export interface HyperStorage {
  upload: (
    name: string,
    data: string | Uint8Array,
  ) => Promise<Result>;
  download: (name: string) => Promise<ReadableStream>;
  remove: (name: string) => Promise<Result>;
}
