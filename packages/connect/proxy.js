import connect from "./connect.js";

const SERVICES = ["data", "storage", "search", "cache", "queue"];
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
];

export default function (connectString) {
  return function (domain) {
    const h = connect(connectString)(domain);
    return new Proxy({}, {
      get(_t, service) {
        return new Proxy({}, {
          get(_t2, action) {
            return async function (...params) {
              if (!SERVICES.includes(service)) {
                throw new Error(`ERROR: ${service} not in ${SERVICES}`);
              }
              if (!ACTIONS.includes(action)) {
                throw new Error(`ERROR: ${action} not in ${ACTIONS}`);
              }
              return fetch(await h[service][action](...params)).then((r) =>
                r.json()
              );
            };
          },
        });
      },
    });
  };
}
