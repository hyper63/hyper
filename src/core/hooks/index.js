import crocks from 'crocks'

const { Async } = crocks;

export default function ({events, hooks}) {
  events.subscribe(action => {
    //console.log('got event: ', action)
    Async.fromPromise(hooks.call)(action)
      .fork(
        err => console.log('ERROR', err.message),
        results => null
      )
  })
  return ({
    status: () => ({ok: true, msg: 'listening for events '})
  })
}