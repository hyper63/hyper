const { Async } = require('crocks')
const jwt = require('jsonwebtoken')
const ms = require('ms')
const toJSON = res => Async.fromPromise(res.json.bind(res))()
const [GET, PUT, POST, DELETE, CONTENT_TYPE, APPLICATION_JSON, BEARER] =
['GET', 'PUT', 'POST', 'DELETE', 'content-type', 'application/json', 'Bearer']

module.exports = function(fetch, client='noname', secret='nosecret') {
  var token // will be set and maintained by the fetch call
  const asyncFetch = Async.fromPromise(fetch)
  
  const doFetch = method => (url, body) => Async.of({url, method, body})
    // set token, check if expired
    .chain(data => 
      generateHeaders(client, secret)
        .map(headers => ({...data, headers}))
    )
   // .map(data => { console.log(data); return data; })
    .map(data => {
      let result = [data.url, {headers: data.headers, method: data.method}]
      if (data.body) {
        result[1] = {...result[1], body: JSON.stringify(data.body)}
      }
      return result
    })
    
    .chain(([url, content]) => asyncFetch(url, content))
    .chain(response => {
      
      if (response.status > 399) {
        return Async.Rejected({ok: false, error: response.statusText})
      }
      return Async.Resolved(response)
    })
    .chain(toJSON)
    
  

  return {
    post: doFetch(POST),
    put: doFetch(PUT),
    get: doFetch(GET),
    remove: doFetch(DELETE)
  }

  function generateHeaders(client, secret) {
    verify = Async.fromNode(jwt.verify.bind(jwt))
    return Async.of({[CONTENT_TYPE]: APPLICATION_JSON})
      .map(headers => {
        if (!token) {
          token = jwt.sign({sub: client}, secret, {expiresIn: '1h'})
        }
        return { authorization: `${BEARER} ${token}`, ...headers}
      })
      .chain(headers => Async(function (reject, resolve) {
        // generate token if expired
        jwt.verify(token, secret, (err) => {
          if (err && err.name === 'TokenExpiredError') {
            token = jwt.sign({sub: client}, secret, {expiresIn: '1h'})
            headers = {...headers, authorization: `${BEARER} ${token}`}
            return resolve(headers)
          } else if (err) {
            return reject(err)
          }
          return resolve(headers)
        })
      }))
  }
}
