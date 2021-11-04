// deno-lint-ignore-file no-explicit-any
import connect from "../connect.js";
import { engine, HyperPlugin } from "./engine.ts";

const SERVICES = ["data", "storage", "search", "cache", "queue"] as const;
const ACTIONS = [
  "add",
  "get",
  "list",
  "update",
  "remove",
  "query",
  "index",
  "load",
  "set",
  "create",
  "destroy",
  "bulk",
] as const;

export default function (connectString: string, plugins: HyperPlugin[]) {
  return function (domain: string) {
    const h = connect(connectString);
    const chain = engine({ hyper: h })(plugins);

    return new Proxy({}, {
      get(_t, service: typeof SERVICES[number]) {
        return new Proxy({}, {
          get(_t2, action: typeof ACTIONS[number]) {
            return async function (...params: any[]) {
              if (!SERVICES.includes(service)) {
                throw new Error(`ERROR: ${service} not in ${SERVICES}`);
              }
              if (!ACTIONS.includes(action)) {
                throw new Error(`ERROR: ${action} not in ${ACTIONS}`);
              }

              const res = await chain({
                service,
                command: action,
                domain,
                payload: params,
              });

              return res.json();
            };
          },
        });
      },
    });
  };
}
