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
    get (bucket: String!, name: String!): CrawlerResult!
  }

  extend type Mutation {
    upsert (bucket: String!, name: String!, job: JSON!): CrawlerResult!
    start (bucket: String!, name: String!): CrawlerResult!
    delete (bucket: String!, name: String!): CrawlerResult!
  }
`;

export const resolvers = {
  Crawler: {
    info: () => ({ port: "Crawler" }),
    name: ({ name }) => name,
    get: (_, { bucket, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.get(bucket, name).toPromise();
    },
  },
  Mutation: {
    upsert: (_, { bucket, name, job }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.upsert({ app: bucket, name, ...job }).toPromise();
    },
    start: (_, { bucket, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.start(bucket, name).toPromise();
    },
    delete: (_, { bucket, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.remove(bucket, name).toPromise();
    },
  },
};
