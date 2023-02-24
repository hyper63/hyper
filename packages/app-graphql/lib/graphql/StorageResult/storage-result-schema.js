import { gql, R } from '../../../deps.js'

const {
  allPass,
  always,
  compose,
  defaultTo,
  has,
  identity,
  ifElse,
  isEmpty,
  not,
  omit,
  prop,
} = R

const omitOk = omit(['ok'])

const returnIf = (pred, left = identity, right = always(null)) =>
  ifElse(
    pred,
    left,
    right,
  )

const typeDefs = gql`
  """
  Represents the result of a storage port operation
  """
  type StorageResult implements PortResult {
    ok: Boolean!
    msg: String
    type: String!
    # User will query for either one
    object: JSON
    objects: JSON
  }
`

const resolvers = {
  StorageResult: {
    type: () => 'storage',
    msg: ({ msg }) => msg,
    ok: ({ ok }) => Boolean(ok),
    object: returnIf(
      compose(
        allPass([
          compose(
            not,
            has('objects'),
          ),
          compose(
            not,
            isEmpty,
          ),
        ]),
        omitOk,
        defaultTo({}),
      ),
      omitOk,
    ),
    objects: compose(
      prop('objects'),
      omitOk,
      defaultTo({}),
    ),
  },
}

export { resolvers, typeDefs }
