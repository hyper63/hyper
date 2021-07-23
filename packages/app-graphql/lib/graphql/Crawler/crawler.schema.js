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
    get (name: String!): CrawlerResult!
  }

  extend type Mutation {
    upsertCrawlerJob (bucket: String!, name: String!, job: JSON!): CrawlerResult!
    startCrawlerJob (bucket: String!, name: String!): CrawlerResult!
    deleteCrawlerJob (bucket: String!, name: String!): CrawlerResult!
  }
`;

export const resolvers = {
  Crawler: {
    info: () => ({ port: "Crawler" }),
    name: ({ name }) => name,
    get: ({ name: bucket }, { name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.get(bucket, name).toPromise();
    },
  },
  Mutation: {
    upsertCrawlerJob: (_, { bucket, name, job }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.upsert({ app: bucket, name, ...job }).toPromise();
    },
    startCrawlerJob: (_, { bucket, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.start(bucket, name).toPromise();
    },
    deleteCrawlerJob: (_, { bucket, name }, context) => {
      const { crawler } = view(hyper63ServicesContextLens, context);
      return crawler.remove(bucket, name).toPromise();
    },
  },
};
