import { apply, of, triggerEvent } from "../utils/mod.js";

export default function ({ crawler, events }) {
  const upsert = (job) => of(job)
    .chain(apply('upsert'))
    .chain(triggerEvent('CRAWLER:UPSERT_JOB'))
    .runWith({svc: crawler, events})

  const get = (app, name) => of({ app, name })
    .chain(apply('get'))
    .chain(triggerEvent('CRAWLER:GET_JOB'))
    .runWith({svc: crawler, events})
  
  const start = (app, name) => of({ app, name })
    .chain(apply('get'))
    .chain(triggerEvent('CRAWLER:START_JOB'))
    .runWith({svc: crawler, events})
  
  const remove = (app, name) => of({ app, name })
    .chain(apply('delete'))
    .chain(triggerEvent('CRAWLER:DELETE_JOB'))
    .runWith({svc: crawler, events})

  return Object.freeze({
    upsert,
    get,
    start,
    remove
  })
}