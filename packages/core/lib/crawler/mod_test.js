import { assert, base64Encode } from '../../dev_deps.js'
import crawler from './mod.js'

const test = Deno.test

const events = {
  dispatch: () => null,
};

const mockCrawler = {
  upsert: (doc) => Promise.resolve({ ok: true }),
  get: (x) => Promise.resolve({}),
  'delete': (x) => Promise.resolve({ ok: true }),
  start: (x) => Promise.resolve({ ok: true }),
  post: (x) => Promise.resolve({ ok: true })
}

const { upsert, get, start, remove } = crawler(
  mockCrawler,
  events
)

test('upsert crawler job', async () => {
  const result = await upsert({
    app: 'test',
    name: 'secret',
    source: 'https://example.com',
    depth: 2,
    script: base64Encode(`
let content = '';
document.querySelectorAll('main p').forEach(el => content = content.concat('\n', el.textContent));
return { title: document.title, content };`),
    target: {
      url: 'https://jsonplaceholder.typicode.com/posts',
      secret: 'secret',
      sub: 'SPIDER',
      aud: 'https://example.com'
    },
    notify: 'https://example.com'
  }).toPromise()
  
  console.log('result', result)
  assert(result.ok)

})