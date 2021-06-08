const Async = require('crocks/Async')
const ReaderT = require('crocks/Reader/ReaderT')
const compose = require('crocks/helpers/compose')
const Either = require('crocks/Either')
const eitherToAsync = require('crocks/Async/eitherToAsync')
const ReaderAsync = ReaderT(Async)
const { ask, lift } = ReaderAsync

const { Left, Right } = Either

const doValidate = (pred, msg) => (value) =>
  pred(value) ? Right(value) : Left({ ok: false, msg })

/**
 * takes a predicate function and error message
 * if the predicate function fails then returns an object with an error message
 * if the predicate function passes then the value is passed down the chain
 */
exports.is = (fn, msg) => compose(lift, eitherToAsync, doValidate(fn, msg))
/**
 * uses the reader monad to get the environment, in this case a service
 * module and invokes a method on that module passing the data from the
 * pipeline as the arguments
 */
exports.apply = (method) => (data) =>
  ask(({ svc }) => {
    // const async = Async.fromPromise(svc[method])
    return Async(function (reject, resolve) {
      // NOTE: maybe consider using an Either here?
      try {
        const p = data ? svc[method](data) : svc[method]()
        return p.then(resolve)
          .catch(e => {
            console.log(e)
            return reject(e)
          })
      } catch (e) {
        let msg = ''
        console.log(e)
        if (e.errors) {
          msg = e.errors.map(x => x.code).join(',')
        }
        return reject({ ok: false, msg })
      }
    })
    // return async(data)
  }).chain(lift)

exports.triggerEvent = (event) => (data) =>
  ask(({ events }) => {
    const payload = { date: new Date().toISOString() }
    if (data.name) { payload.name = data.name }
    if (data.id) { payload.id = data.id }
    if (data.type) { payload.type = data.type }

    events.dispatch({
      type: event,
      payload
    })
    return Async.Resolved(data)
  }).chain(lift)

/**
 * constructor for an AsyncReader monad
 */
exports.of = ReaderAsync.of
