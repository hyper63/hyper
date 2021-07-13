import { GraphQLHTTP, makeExecutableSchema, R, Router } from "../../deps.js";

import { hyper63ServicesContextLens } from "../utils/hyper63-context.lens.js";

import { resolvers, typeDefs } from "./schema.js";

const { reduce, set } = R;

function addServicesContexter(services) {
  return (_, prevContext) =>
    set(
      hyper63ServicesContextLens,
      services,
      prevContext,
    );
}

function addOpineContext({ req, res }, prevContext) {
  return {
    ...prevContext,
    req,
    res,
  };
}

const gqlRouter = ({
  contexters = [],
  playground = true,
} = { contexters: [], playground: true }) =>
  (services) => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = new Router();

    app.use(async (req, res) => {
      // Build graphql context
      const context = await reduce(
        async (prevContext, contexter) =>
          contexter({ req, res }, await prevContext),
        {},
        [...contexters, addOpineContext, addServicesContexter(services)],
      );

      // Mount graphql server and playground
      await GraphQLHTTP({
        schema,
        context: () => context,
        graphiql: playground,
      })(req, res);
    });

    return app;
  };

export { gqlRouter };
