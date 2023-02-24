//import { hyperGqlRouter, opine } from "./deps.js";
import { opine } from './deps.js';

import { hyperRouter } from './router.js';

// opine app
export default function (services) {
  //const playground = Deno.env.get("GQL_PLAYGROUND");
  const port = Deno.env.get('PORT') ? parseInt(Deno.env.get('PORT')) : 6363;
  const env = Deno.env.get('DENO_ENV');

  const app = opine();

  // REST
  app.use(hyperRouter(services));

  // GQL
  // app.use(
  //   "/graphql",
  //   hyperGqlRouter({
  //     playground: (playground && playground !== "false") ||
  //       env !== "production",
  //   })(services),
  // );

  if (env !== 'test') {
    app.listen(port);
    console.log('hyper service listening on port ', port);
  }

  return app;
}
