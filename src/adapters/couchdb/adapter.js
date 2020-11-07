import { Async } from 'crocks'

export default ({asyncFetch, config, handleResponse, headers }) => {
  const retrieveDocument = ({ db, id }) =>
    asyncFetch(`${config.db}/${db}/${id}`, {
      headers: createHeaders(config.user, config.password),
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
          asyncFetch(`${config.db}/${db}`, {
            method: "POST",
            headers: createHeaders(config.user, config.password),
            body: JSON.stringify(doc),
          })
        )
        .chain(handleResponse(201)).toPromise(),
    retrieveDocument,
    updateDocument: ({ db, id, doc }) =>
      retrieveDocument(config)({ db, id })
        .chain((old) =>
          asyncFetch(`${config.db}/${db}/${id}?rev=${old._rev}`, {
            method: "PUT",
            headers: createHeaders(config.user, config.password),
            body: JSON.stringify(doc),
          })
        )
        .chain(handleResponse(201)).toPromise(),
    removeDocument: ({ db, id }) =>
      retrieveDocument(config)({ db, id })
        .chain((old) =>
          asyncFetch(`${config.db}/${db}/${id}?rev=${old._rev}`, {
            method: "DELETE",
            headers: createHeaders(config.user, config.password),
          })
        )
        .chain(handleResponse(200)).toPromise(),
  })
}