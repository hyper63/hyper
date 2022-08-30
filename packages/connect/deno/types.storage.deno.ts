import {
  NotOkResult,
  OkUrlResult,
  Result,
  StorageSignedUrlOptions,
} from "./types.ts";

export interface HyperStorage {
  upload: (name: string, data: string | Uint8Array) => Promise<Result>;
  download: (name: string) => Promise<ReadableStream>;
  signedUrl: (
    name: string,
    options: StorageSignedUrlOptions,
  ) => Promise<OkUrlResult | NotOkResult>;
  remove: (name: string) => Promise<Result>;
}
