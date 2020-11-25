
const { compose, lensProp } = require('ramda')

const hyper63ContextLens = lensProp('__hyper63')

const hyper63ServicesContextLens = compose(
  hyper63ContextLens,
  lensProp('services')
)

module.exports = {
  hyper63ContextLens,
  hyper63ServicesContextLens
}
