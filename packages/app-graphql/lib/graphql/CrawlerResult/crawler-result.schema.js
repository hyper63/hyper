import { gql, R } from '../../../deps.js';

const { always, compose, identity, ifElse, is, omit, prop } = R;

const typeDefs = gql`
  """
  Represents the result of a crawler port operation
  """
  type CrawlerResult implements PortResult {
    ok: Boolean!
    msg: String
    type: String!
    data: JSON
  }
`;

const resolvers = {
  CrawlerResult: {
    type: () => 'crawler',
    msg: ({ msg }) => msg,
    ok: compose(
      ifElse(
        is(Boolean),
        identity,
        always(true), // default to ok: true if not in parent
      ),
      prop('ok'),
    ),
    // Parent is the data
    data: omit(['ok']),
  },
};

export { resolvers, typeDefs };
