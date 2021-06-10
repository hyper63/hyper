
import { R, crocks } from './deps.js'

const { Async } = crocks
const { map } = R

export default function ({ asyncFetch, hooks }) {
  const doNotify = action => hooks => Async.all(
    map(notify(action), hooks)
  )

  return ({
    call: (action) => Async
      .of(hooks)

      .map(matcher(action.type))
      .map(v => { console.log(`${action.type}: ${JSON.stringify(action.payload)}`); return v })
      .chain(doNotify(action))
      .toPromise()
  })

  function notify (action) {
    return function (hook) {
      return asyncFetch(`${hook.target}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      })
        .chain(resp => Async.fromPromise(resp.json.bind(resp))())
    }
  }
}

function matcher (actionType) {
  return function (hooks) {
    // simple brittle implementation
    // TODO: Refine and make safe before release...
    return hooks.filter(hook => {
      if (hook.matcher === '*') {
        return true
      }
      if (
        hook.matcher.split(':')[0] === actionType.split(':')[0] &&
        hook.matcher.split(':')[1] === '*'
      ) {
        return true
      }
      if (
        hook.matcher.split(':')[1] === actionType.split(':')[1] &&
        hook.matcher.split(':')[0] === '*'
      ) {
        return true
      }
      if (hook.matcher === actionType) {
        return true
      }
      return false
    })
  }
}
