// These are here, so to not bog down deps.js if consumer imports mount.js instead of mod.js
import { lookup as getMimeType } from "https://deno.land/x/media_types@v2.8.4/mod.ts";
import { opine } from "https://deno.land/x/opine@1.5.0/mod.ts";
import { default as helmet } from "https://cdn.skypack.dev/helmet@^4.6.0";
import { opineCors as cors } from "https://deno.land/x/cors@v1.2.1/mod.ts";

import { mountGql } from "./lib/graphql/mount.js";
import { STORAGE_PATH } from "./lib/constants.js";
import { multipartMiddleware } from "./lib/middleware.js";

function getObject(storage) {
  return ({ params }, res) => {
    storage.getObject(params.name, params[0]).fork(
      (e) => res.setStatus(500).send({ ok: false, msg: e.message }),
      async (reader) => {
        // get mime type
        const mimeType = getMimeType(params[0].split(".")[1]);
        res.set({
          "Content-Type": mimeType,
          "Transfer-Encoding": "chunked",
        });
        res.setStatus(200);

        await res.send(reader);
      },
    );
  };
}

// TODO: Maybe allow passing custom schema here?
export default function () {
  return function (services) {
    const app = opine();
    app.use(helmet());
    app.use(cors({ credentials: true }));
    app.get("/", (_req, res) => res.send({ name: "hyper63" }));

    app.use(multipartMiddleware());
    // For serving files since graphql doesn't handle this
    app.get(`/${STORAGE_PATH}/:name/*`, getObject(services.storage));

    app = mountGql({ app }, { multipartMiddleware: false, playground: true })(
      services,
    );

    const port = parseInt(process.env.PORT) || 6363;

    // Start server
    app.listen(port);
    console.log("hyper graphql service listening on port ", port);
  };
}
