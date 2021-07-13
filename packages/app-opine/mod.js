import { mountGql, opine } from "./deps.js";

import { hyperRouter } from "./router.js";

// opine app
export default function (services) {
  const playground = Deno.env.get("GQL_PLAYGROUND");
  const port = Deno.env.get("PORT") ? parseInt(Deno.env.get("PORT")) : 6363;
  const env = Deno.env.get("DENO_ENV");

  const app = opine();

  // REST
  app.use(hyperRouter(services));

  // TODO: refactor this to a router like hyperRouter
  // /graphql
  mountGql(
    { app },
    // disable playground in production by default
    {
      playground: (playground && playground !== "false") ||
        env !== "production",
    },
  )(services);

  if (env !== "test") {
    app.listen(port);
    console.log("hyper63 service listening on port ", port);
  }

  return app;
}
