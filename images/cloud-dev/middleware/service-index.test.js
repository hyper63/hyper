import { crocks, opine, R } from "../deps.js";
import { assertEquals, superdeno } from "../dev_deps.js";

import { HYPER_DELIMITER } from "../constants.js";

import { hyperCloudIndexMiddleware } from "./service-index.js";

const { replace, compose } = R;
const { Async } = crocks;

const test = Deno.test;

test("should filter the resource list returned from the adapter", async () => {
  const app = compose(
    hyperCloudIndexMiddleware(HYPER_DELIMITER, {
      cache: {
        index: () =>
          Async.of(
            [
              "foo-app|some-cache",
              "foo-app|other-cache",
              "bar-app|some-cache",
              `foo-appp${HYPER_DELIMITER}|tricky-one`,
            ].map(
              replace("|", HYPER_DELIMITER),
            ),
          ),
      },
    }),
  )(opine());

  await superdeno(app)
    .get("/foo-app/cache")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect(({ body }) => {
      assertEquals(body.name, "cache");
      assertEquals(body.stores.length, 2);
    });
});