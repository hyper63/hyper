import { of, apply } from '../utils'

export default ({ search }) => ({
  createIndex: (index, mapping={}) => of({index, mapping})
    .chain(apply("createIndex")).runWith(search),
  deleteIndex: (index) => of(index)
    .chain(apply("deleteIndex")).runWith(search),
  indexDoc: (index, key, doc) => of({index, key, doc})
    .chain(apply("indexDoc")).runWith(search),
  getDoc: (index, key) => of({index, key})
    .chain(apply("getDoc")).runWith(search),
  updateDoc: (index, key, doc) => of({index, key, doc})
    .chain(apply("updateDoc")).runWith(search),
  removeDoc: (index, key) => of({index, key})
    .chain(apply("removeDoc")).runWith(search),
  query: (index, q={}) => of({index, q})
    .chain(apply("query")).runWith(search),
  //batch or bulk
})