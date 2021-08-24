import { R } from "../deps.js";
import { assertEquals, opine, superdeno } from "../deps_dev.js";
import { serviceIndex } from "./service-index.js";

const { compose } = R;
const test = Deno.test;

test("should filter the resource list returned from the adapter", async () => {
  const app = compose(
    serviceIndex(),
  )(opine());

  await superdeno(app)
    .get("/foo-app/cache")
    .expect("Content-Type", /json/)
    .expect(501)
    .expect(({ body }) => {
      assertEquals(body.message, "Not Implemented");
    });
});
