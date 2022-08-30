import { Result, StorageDownloadOptions } from "./types.ts";

export interface HyperStorage {
  upload: (name: string, data: string | Uint8Array) => Promise<Result>;
  download: (
    name: string,
    options?: StorageDownloadOptions,
  ) => Promise<NodeJS.ReadableStream>;
  remove: (name: string) => Promise<Result>;
}
