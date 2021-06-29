import { gql } from "../../../deps.js";

const typeDefs = gql`
  """
  Describes various metadata about a particular port
  """
  type PortInfo {
    name: String!
    version: String!
    status: String!
  }
`;

const resolvers = {
  PortInfo: {
    name: ({ port = "" }) => `hyper ${port}`.trim(),
    version: () => "1.0", // ? where should this come from
    status: () => "unstable", // ? where should this come from
  },
};

export { resolvers, typeDefs };
