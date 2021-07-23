import { assert, assertEquals, base64Encode } from "../../dev_deps.js";
import crawler from "./mod.js";

const test = Deno.test;

const events = {
  dispatch: () => null,
};

const mockCrawler = {
  upsert: () => {
    //console.log(doc)
    return Promise.resolve({ ok: true });
  },
  get: ({ app, name }) => Promise.resolve({ id: `${app}-${name}` }),
  "delete": () => Promise.resolve({ ok: true }),
  start: () => Promise.resolve({ ok: true }),
  post: () => Promise.resolve({ ok: true }),
};

const { upsert, get, start, remove } = crawler({
  crawler: mockCrawler,
  events,
});

test("remove job", async () => {
  const result = await remove("test", "spider").toPromise();
  assert(result.ok);
});

test("start crawl", async () => {
  const result = await start("test", "spider").toPromise();
  assert(result.ok);
});

test("get job", async () => {
  const result = await get("test", "spider").toPromise();
  assertEquals(result.id, "test-spider");
});

test("upsert crawler job", async () => {
  const result = await upsert({
    app: "test",
    name: "secret",
    source: "https://example.com",
    depth: 2,
    script: base64Encode(`
let content = '';
document.querySelectorAll('main p').forEach(el => content = content.concat('\n', el.textContent));
return { title: document.title, content };`),
    target: {
      url: "https://jsonplaceholder.typicode.com/posts",
      secret: "secret",
      sub: "SPIDER",
      aud: "https://example.com",
    },
    notify: "https://example.com",
  }).toPromise();

  console.log("result", result);
  assert(result.ok);
});
