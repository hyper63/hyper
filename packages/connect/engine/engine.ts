// deno-lint-ignore-file no-explicit-any
type HyperPluginEnvironment = {
  hyper: any;
};

type HyperPluginEvent<P = any, R = any> = {
  request?: HyperPluginEventRequest<P>;
  response?: HyperPluginEventResponse<R>;
};

type HyperPluginEventWithRequest =
  & Required<Pick<HyperPluginEvent, "request">>
  & HyperPluginEvent;
type HyperPluginEventWithResponse =
  & Required<Pick<HyperPluginEvent, "response">>
  & HyperPluginEvent;

interface HyperPluginEventSum<P = any> {
  service: "data" | "cache" | "storage" | "search" | "queue";
  command: string;
  domain: string | undefined;
  payload: P;
}

type HyperPluginEventRequest<P = any> = HyperPluginEventSum<P>;

type HyperPluginEventResponse<R = any> = HyperPluginEventSum & {
  status: number;
  statusText: string;
  headers: any;
  body: () => Promise<R>;
};

type HyperPluginAction = {
  type: "request" | "response";
};

export type HyperPlugin = (
  env: HyperPluginEnvironment,
) => (
  event: HyperPluginEvent,
  // TODO: might not even need action since event is a Sum type
  action: HyperPluginAction,
) => Promise<HyperPluginEvent>;

export const engine = (env: HyperPluginEnvironment) =>
  (plugins: HyperPlugin[]) => {
    /**
     * pass enviornment to each plugin
     */
    const handlers = plugins.map((p) => p(env));

    /**
     * plugins flowed through on request
     */
    const requestChain = [
      ...handlers,
      // make the actual call to hyper as last 'plugin' in the request chain
      async (eventToSendToHyper: HyperPluginEventWithRequest) => {
        const res = await fetch(
          await env.hyper(
            eventToSendToHyper.request.domain,
          )[eventToSendToHyper.request.service]
            [eventToSendToHyper.request.command](
              ...eventToSendToHyper.request.payload,
            ),
        );

        // Hyper always returns JSON
        const body = await res.json();

        // build out response
        eventToSendToHyper.response = {
          ...eventToSendToHyper.request,
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
          body: () => Promise.resolve(body),
        };

        return eventToSendToHyper;
      },
    ];

    /**
     * plugins flowed through on response
     *
     * TODO: should these be reversed? Or is that too much like middleware?
     */
    const responseChain = handlers;

    /**
     * The main chain where everything is done
     * - call each plugin, with action type of 'request'. This produces an event with response
     *   - response could be from bailout, or flowing through entire chain, eventually calling to hyper
     *
     * - call each plugin, with action type of 'response'. This produces an event with response
     *   - response could be from recusive call back through chain, or flowing through entire chain
     *
     * - Build a Response object from event response and return it to caller
     */
    const chain = async (args: HyperPluginEventRequest) => {
      // request
      let event: HyperPluginEvent = await requestChain.reduce<
        Promise<HyperPluginEvent>
      >(
        async (curEvent, handler) =>
          (await curEvent).response
            // Left
            ? curEvent
            : // Right
            // TODO: maybe auto-spread curEvent.request onto returned result here
              handler(await curEvent as HyperPluginEventWithRequest, {
                type: "request",
              }),
        Promise.resolve({
          request: {
            service: args.service,
            command: args.command,
            domain: args.domain,
            payload: args.payload,
          },
        }),
      );

      // response
      event = await responseChain.reduce<Promise<HyperPluginEvent>>(
        async (curEvent, handler) =>
          (await curEvent).request
            // Left
            // Loop back into chains, recursively (chain within this chain)
            // TODO: should this just return, then recurse outside of the reduce (chain would stay linear instead of chains within chains)
            ? chain((await curEvent).request as HyperPluginEventRequest)
            : // Right
            // continue up the chain
              handler(await curEvent, { type: "response" }),
        Promise.resolve({ response: event.response }),
      );

      if (!event.response) {
        throw new Error("Plugin chain is required to return a response");
      }

      return { response: event.response };
    };

    /**
     * The actual function to be called within hyper-connect
     * hyper-connect will to pass a HyperPluginEventRequest, which
     * matches similar shape to what $ currently passes to service SDK
     */
    return async (args: HyperPluginEventRequest<any>) => {
      const res = await chain(args);

      return new Response(
        JSON.stringify(await res.response.body()),
        {
          statusText: res.response.statusText,
          status: res.response.status,
          headers: res.response.headers,
        },
      );
    };
  };

/**
 * Some Plugins
 */

export const dataCachePlugin: HyperPlugin = ({ hyper }) =>
  async (event) => {
    // Request
    if (event.request) {
      if (event.request.service === "data" && event.request.command === "get") {
        const res = await fetch(
          await hyper(event.request.domain).cache.get(...event.request.payload),
        );

        // bailout
        if (res.status < 400) {
          const body = await res.json();
          console.log(
            `cache HIT on data fetch for id ${event.request.payload[0]}: `,
            body,
          );
          // TODO: maybe the engine can handle auto-spreading event.request onto responses
          event.response = {
            ...event.request,
            ...res,
            body: () => Promise.resolve(body),
          };

          return event;
        }
        console.log(`cache MISS for id ${event.request.payload[0]}`);
      }
    }

    // Response
    if (event.response) {
      if (
        event.response.service === "data" &&
        ["get", "add", "update"].includes(event.response.command)
      ) {
        if (event.response.command === "get") {
          const body = await event.response.body();
          console.log(`saving data response in cache for 2 minutes`, body);
          // already have object, so just cache
          await fetch(
            await hyper(event.response.domain).cache.set(body.id, body, "2m"),
          );
        } else {
          const body = await event.response.body();
          // fetch from data store and cache
          const res = await fetch(
            await hyper(event.response.domain).data.get(body.id),
          );
          const json = await res.json();

          console.log(
            `refetched and saving data response in cache for 2 minutes`,
            json,
          );
          await fetch(
            await hyper(event.response.domain).cache.set(json.id, json, "2m"),
          );
        }
      }
    }

    return event;
  };

/**
 * Possible second api for plugins
 */
export const dataCachePluginSecondApi = (
  { hyper }: HyperPluginEnvironment,
) => ({
  request: async (event: HyperPluginEventWithRequest) => {
    if (event.request.service === "data" && event.request.command === "get") {
      const res = await fetch(
        await hyper(event.request.domain).cache.get(...event.request.payload),
      );

      // bailout
      if (res.status < 400) {
        const body = await res.json();
        console.log(
          `cache HIT on data fetch for id ${event.request.payload[0]}: `,
          body,
        );
        // TODO: maybe the engine can handle auto-spreading event.request onto responses
        event.response = {
          ...event.request,
          ...res,
          body: () => Promise.resolve(body),
        };

        return event;
      }
      console.log(`cache MISS for id ${event.request.payload[0]}`);
    }
  },
  response: async (event: HyperPluginEventWithResponse) => {
    if (
      event.response.service === "data" &&
      ["get", "add", "update"].includes(event.response.command)
    ) {
      if (event.response.command === "get") {
        const body = await event.response.body();
        console.log(`saving data response in cache for 2 minutes`, body);
        // already have object, so just cache
        await fetch(
          await hyper(event.response.domain).cache.set(body.id, body, "2m"),
        );
      } else {
        const body = await event.response.body();
        // fetch from data store and cache
        const res = await fetch(
          await hyper(event.response.domain).data.get(body.id),
        );
        const json = await res.json();

        console.log(
          `refetched and saving data response in cache for 2 minutes`,
          json,
        );
        await fetch(
          await hyper(event.response.domain).cache.set(json.id, json, "2m"),
        );
      }
    }
  },
});
