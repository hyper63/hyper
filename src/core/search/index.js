import { of, apply } from '../utils'
import { Async } from 'crocks'

export default ({ search }) => ({
  createIndex: (index, mappings={}) => of({index, mappings})
    .chain(apply("createIndex")).runWith(search),
  deleteIndex: (index) => of(index)
    .chain(apply("deleteIndex")).runWith(search),
  // indexDoc: (index, key, doc) => Async(function(reject, resolve) {
  //     console.log('should return with a fork')
  //     try {
  //       search.indexDoc({index, key, doc}).then(resolve)
  //     } catch (e) {
  //       console.log('ERROR...')
  //       console.log(e.code)
  //       return reject({ok: false, msg: e.errors.map(x => x.code).join(',')})
  //     }
  //     //return of({index, key, doc})
  //     //  .chain(apply("indexDoc")).runWith(search)
    
  // }),
  indexDoc: (index, key, doc) => of({index, key, doc}).chain(apply("indexDoc")).runWith(search),
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