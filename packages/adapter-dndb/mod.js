import { adapter } from "./adapter.js";
import { Datastore } from "./deps.js";

export default function dndbAdapter(config) {
  return Object.freeze({
    id: "dndb",
    port: "data",
    load: () => config,
    link: (env) => () => adapter(env, Datastore),
  });
}
