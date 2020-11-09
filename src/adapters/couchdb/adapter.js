import { Async } from 'crocks'
import { omit } from 'ramda'

export default ({asyncFetch, config, handleResponse, headers }) => {
  const retrieveDocument = ({ db, id }) =>
    asyncFetch(`${config.origin}/${db}/${id}`, {
      headers,
    }).chain(handleResponse(200))
      
      
  
  return ({
    createDatabase: (name) => asyncFetch(`${config.origin}/${name}`, {
      method: 'PUT',
      headers
    })
      .chain(handleResponse(201))
      .toPromise()
      
    ,
    
    removeDatabase: (name) => asyncFetch(`${config.origin}/${name}`, {
      method: 'DELETE',
      headers
    }).chain(handleResponse(200)).toPromise(),
    
    createDocument: ({ db, id, doc }) =>
      Async.of({ ...doc, _id: id })
        .chain((doc) =>
          asyncFetch(`${config.origin}/${db}`, {
            method: "POST",
            headers,
            body: JSON.stringify(doc),
          })
        )
        .chain(handleResponse(201))
        .toPromise(),
    retrieveDocument: ({db, id}) => retrieveDocument({db, id}).map(omit(['_id', '_rev'])).toPromise(),
    updateDocument: ({ db, id, doc }) =>
      retrieveDocument({ db, id })
        .chain((old) =>
          asyncFetch(`${config.origin}/${db}/${id}?rev=${old._rev}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(doc),
          })
        )
        .chain(handleResponse(201))
        .map(omit(['rev']))
        .toPromise(),
    removeDocument: ({ db, id }) =>
      retrieveDocument({ db, id })
        .chain((old) =>
          asyncFetch(`${config.origin}/${db}/${id}?rev=${old._rev}`, {
            method: "DELETE",
            headers,
          })
        )
        .chain(handleResponse(200)).toPromise(),
  })
}