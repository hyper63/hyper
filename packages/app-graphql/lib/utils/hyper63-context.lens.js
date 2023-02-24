import { R } from '../../deps.js'

const { compose, lensProp } = R

const hyper63ContextLens = lensProp('__hyper63')

const hyper63ServicesContextLens = compose(
  hyper63ContextLens,
  lensProp('services'),
)

const requestContextLens = lensProp('req')

export { hyper63ContextLens, hyper63ServicesContextLens, requestContextLens }
