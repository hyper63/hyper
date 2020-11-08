import { Async } from 'crocks'

export default ({asyncFetch, config, handleResponse, headers }) => {
  const retrieveDocument = ({ db, id }) =>
    asyncFetch(`${config.origin}/${db}/${id}`, {
      headers,
    }).chain(handleResponse(200))
      .toPromise()
  
  return ({
    createDatabase: (name) => asyncFetch(`${config.origin}/${name}`, {
      method: 'PUT',
      headers
    }).chain(handleResponse(201))
      .toPromise(),
    
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
        .chain(handleResponse(201)).toPromise(),
    retrieveDocument,
    updateDocument: ({ db, id, doc }) =>
      retrieveDocument(config)({ db, id })
        .chain((old) =>
          asyncFetch(`${config.origin}/${db}/${id}?rev=${old._rev}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(doc),
          })
        )
        .chain(handleResponse(201)).toPromise(),
    removeDocument: ({ db, id }) =>
      retrieveDocument(config)({ db, id })
        .chain((old) =>
          asyncFetch(`${config.origin}/${db}/${id}?rev=${old._rev}`, {
            method: "DELETE",
            headers,
          })
        )
        .chain(handleResponse(200)).toPromise(),
  })
}