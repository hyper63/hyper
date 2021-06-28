import {
  GraphQLPrintSchema as printSchema,
  join,
  makeExecutableSchema,
} from "./deps.js";

import * as schema from "./lib/graphql/schema.js";

const _schema = makeExecutableSchema(schema);

Deno.writeFileSync(
  join(Deno.cwd(), "schema.graphql"),
  new TextEncoder().encode(printSchema(_schema)),
);
