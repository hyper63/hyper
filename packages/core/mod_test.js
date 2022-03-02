import opine from "https://x.nest.land/hyper-app-opine@2.0.0/mod.js";
import dndb from "https://x.nest.land/hyper-adapter-dndb@2.0.0/mod.js";
import memory from "https://x.nest.land/hyper-adapter-memory@1.2.6/mod.js";
import { superdeno } from "https://deno.land/x/superdeno@4.7.2/mod.ts";

import { assertEquals } from "./dev_deps.js";

import core from "./mod.js";

const test = Deno.test;
Deno.env.set("DENO_ENV", "test");

const config = {
  app: opine,
  adapters: [
    { port: "data", plugins: [dndb("./data/foo.db")] },
    { port: "cache", plugins: [memory()] },
  ],
  middleware: [],
};

test("build hyper core", async () => {
  const app = await core(config);
  const res = await superdeno(app)
    .get("/");
  //console.log(res.body)

  assertEquals(res.body.name, "hyper63");
});
