import crocks from 'crocks'

const { Async } = crocks

export const $fetch = (fn) => Async.fromPromise(fn)()

export const toJSON = (res) => {
  return res.ok ? Async.fromPromise(res.json.bind(res))() : Async.fromPromise(res.json.bind(res))()
    .map((r) => ({ ok: false, status: res.status, ...r }))
}

//: Async.Resolved({ ok: false, status: res.status })
export const $ = Async
