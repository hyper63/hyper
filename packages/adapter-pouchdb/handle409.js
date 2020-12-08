const equals = require('crocks/pointfree/equals')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const propSatisfies = require('crocks/predicates/propSatisfies')
const safe = require('crocks/Maybe/safe')
const substitution = require('crocks/combinators/substitution')

const allow409 = substitution(
  maybeToAsync,
  safe(propSatisfies('status', equals(409)))
)

module.exports = allow409