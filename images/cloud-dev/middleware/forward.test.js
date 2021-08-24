import { opine, R } from "../deps.js";
import { superdeno } from "../dev_deps.js";

import { HYPER_DELIMITER } from "../constants.js";
import { forward } from "./forward.js";

const { compose } = R;

const test = Deno.test;

test("should forward the app route", async () => {
  const app = compose(
    (app) =>
      app.put(
        `/cache/foo-app${HYPER_DELIMITER}bar`,
        (_req, res) => res.setStatus(200).json({ ok: true }),
      ),
    forward(HYPER_DELIMITER),
  )(opine());

  await superdeno(app)
    .put("/foo-app/cache/bar")
    .expect("Content-Type", /json/)
    .expect(200);
});

test("should 404 on if root service route is hit and is not a forwarded request", async () => {
  const app = compose(
    hyperCloudForwardMiddleware(HYPER_DELIMITER),
  )(opine());

  await superdeno(app)
    .get("/cache")
    .expect(404);
});