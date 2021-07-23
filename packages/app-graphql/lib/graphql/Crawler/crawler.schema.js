import { gql, R } from "../../../deps.js";
const { view } = R;

import { hyper63ServicesContextLens } from "../../utils/hyper63-context.lens.js";

export const typeDefs = gql`
  """
  The hyper Crawler Service Type
  """
  type Crawler {
    info: PortInfo!
    name: String!
    get (app: String!, name: String!): CrawlerResult!
  }

  extend type Mutation {
    upsert (app: String!, name: String!, job: JSON!): CrawlerResult!
    start (app: String!, name: String!): CrawlerResult!
    delete (app: String!, name: String!): CrawlerResult!
  }
`;

export const resolvers = {
  Crawler: {
    info: () => ({ port: "Crawler" }),
    name: ({ name }) => name,
    get: (_, { app, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.get(app, name).toPromise();
    },
  },
  Mutation: {
    upsert: (_, { app, name, job }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.upsert(app, name, job).toPromise();
    },
    start: (_, { app, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.start(app, name).toPromise();
    },
    delete: (_, { app, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.remove(app, name).toPromise();
    },
  },
};
