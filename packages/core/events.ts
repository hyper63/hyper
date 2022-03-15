// deno-lint-ignore-file no-explicit-any

/**
 * Use cases:
 * - adapter notify core of operation success/failure
 * - adapter notify core of healthy/unhealthy state
 * - adapter notify core of read/write operation
 *   - is this covered by success/failure above?
 * - core notify adapter of termination
 *
 * Considerations:
 * - an adapter should be unaware of other running adapters
 * - an adapter powering one service should not be able to affect another adapter running another service
 *   - ie. storage adapter should not be able to send an event that restarts queue adapter
 *   - how do we secure adapters, while still keeping apis as vanilla (dispatchEvent) as possible
 *   - how does core verify an event for a service came from the adapter powering that service?
 */

const HyperEventPayloadType = [
  "unhealthy",
  "healthy",
  "info",
  "read",
  "write",
] as const;

export type HyperEventPayloadArgs = {
  type: typeof HyperEventPayloadType[number];
  uuid: string;
  payload?: any;
};

export type HyperEventDispatched = Omit<HyperEventPayloadArgs, "uuid">;

export class HyperEvent extends CustomEvent {
  declare public detail: HyperEventPayloadArgs;

  constructor(args: HyperEventPayloadArgs) {
    if (!HyperEventPayloadType.includes(args.type)) {
      throw new Error(
        `Invalid hyper event type. Valid options are: ${
          HyperEventPayloadType.join(", ")
        }`,
      );
    }

    super("hyper", { detail: args });
  }
}
