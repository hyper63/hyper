const test = require('tape')
const fetchMock = require('fetch-mock')
const fetch = require('node-fetch')

globalThis.fetch = fetchMock
  .get('https://nano.hyper63.com/data/bar', { status: 200, body: {ok: true, docs: []}})
  .put('https://nano.hyper63.com/search/bar', {
    status: 201, 
    body: {ok: true}
  })
  .sandbox()

//globalThis.fetch = fetch

const client = require('./index')
const services = client('https://nano.hyper63.com', 'foo', 'secret', 'bar')

test('get data', t => {
  t.plan(1)
  services.data.list()
    .fork(
      e => {
        console.log(e)
        t.ok(false)
      },
      r => t.ok(r.ok)
      
    )

})

test('create search index', t => {
  t.plan(1)
  services.setup.search({fields: ['title']})
    .fork(
      e => {
        console.log(e)
        t.ok(false)
      },
      r => {
        console.log(r)
        t.ok(r.ok)
      }
    )
})