const compose = (f, g) => x => f(g(x))

const _type = 'Reader'
const _of = x => Reader(() => x)

function ask(fn) {
  if (!arguments.length) {
    return Reader(x => x)
  }

  return Reader(fn)
}


function Reader(runWith) {
  const of = _of

  function map(method) {
    return function (fn) {
      if (typeof fn !== 'function') {
        throw new TypeError(`Reader.${method}: Function required`)
      }
      return Reader(compose(fn, runWith))
    }
  }

  function ap(m) {
    if (m['@@type'] !== _type) {
      throw new Error('Reader.ap: Reader required!')
    }
    return Reader(function (e) {
      const fn = runWith(e)
      return m.map(fn).runWith(e)
    })
  }

  function chain(method) {
    return function (fn) {
      return Reader(function (e) {
        const m = fn(runWith(e))

        if (m['@@type'] !== _type) {
          throw new Error(`Reader.${method}: Function must return Reader!`)
        }

        return m.runWith(e)
      })
    }
  }

  return {
    type,
    ap,
    of,
    map: map('map'),
    chain: chain('chain'),
    ['@@type']: _type,
    constructor: Reader
  }
}

Reader.of = _of
Reader.ask = ask
Reader.type = type
Reader['@@type'] = _type

export default Reader