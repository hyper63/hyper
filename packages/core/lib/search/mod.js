import { apply, of, triggerEvent } from '../utils'

export default function ({ search, events }) {
  return ({
    createIndex: (index, mappings = {}) =>
      of({ index, mappings })
        .chain(apply('createIndex'))
        .chain(triggerEvent('SEARCH:CREATE_INDEX'))
        .runWith({ svc: search, events }),
    deleteIndex: (index) =>
      of(index)
        .chain(apply('deleteIndex'))
        .chain(triggerEvent('SEARCH:DELETE_INDEX'))
        .runWith({ svc: search, events }),
    indexDoc: (index, key, doc) =>
      of({ index, key, doc })
        .chain(apply('indexDoc'))
        .chain(triggerEvent('SEARCH:CREATE'))
        .runWith({ svc: search, events }),
    getDoc: (index, key) =>
      of({ index, key })
        .chain(apply('getDoc'))
        .chain(triggerEvent('SEARCH:GET'))
        .runWith({ svc: search, events }),
    updateDoc: (index, key, doc) =>
      of({ index, key, doc })
        .chain(apply('updateDoc'))
        .chain(triggerEvent('SEARCH:UPDATE'))
        .runWith({ svc: search, events }),
    removeDoc: (index, key) =>
      of({ index, key })
        .chain(apply('removeDoc'))
        .chain(triggerEvent('SEARCH:DELETE'))
        .runWith({ svc: search, events }),

    bulk: (index, docs) =>
      of({ index, docs })
        .chain(apply('bulk'))
        .chain(triggerEvent('SEARCH:BULK'))
        .runWith({ svc: search, events }),
    query: (index, q = {}) =>
      of({ index, q })
        .chain(apply('query'))
        .chain(triggerEvent('SEARCH:QUERY'))
        .runWith({ svc: search, events })
    // batch or bulk
  })
}
