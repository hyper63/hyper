// import {
//   assert,
//   assertEquals,
//   equal,
// } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import { superdeno } from "https://deno.land/x/superdeno@4.4.0/mod.ts";
import { hyper } from "./deps.js";
import config from "./hyper.config.js";

const test = Deno.test;

test("GET /", async () => {
  const app = await hyper(config);
  await superdeno(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect(200);
});
