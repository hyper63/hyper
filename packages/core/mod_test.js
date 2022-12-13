import opine from "https://x.nest.land/hyper-app-opine@2.0.0/mod.js";
import {
  default as pouchdb,
  PouchDbAdapterTypes,
} from "https://x.nest.land/hyper-adapter-pouchdb@0.1.6/mod.js";
import memory from "https://x.nest.land/hyper-adapter-memory@1.2.6/mod.js";
import { superdeno } from "https://deno.land/x/superdeno@4.7.2/mod.ts";

import { assertEquals } from "./dev_deps.js";

import core from "./mod.js";

const test = Deno.test;
Deno.env.set("DENO_ENV", "test");

const config = {
  app: opine,
  adapters: [
    {
      port: "data",
      plugins: [pouchdb({ storage: PouchDbAdapterTypes.memory })],
    },
    { port: "cache", plugins: [memory()] },
  ],
  middleware: [],
};

test("build hyper core", async () => {
  const app = await core(config);
  const res = await superdeno(app)
    .get("/");
  //console.log(res.body)

  assertEquals(res.body.name, "hyper");
});
