import { assertEquals, assertObjectMatch } from "./deps_dev.js";
import { asyncFetch, createHeaders, handleResponse } from "./async-fetch.js";
import { adapter } from "./adapter.js";

const test = Deno.test;
const COUCH = "http://localhost:5984";

const testFetch = (url, options) => {
  options.method = options.method || "GET";

  if (url === "http://localhost:5984/hello" && options.method === "PUT") {
    return Promise.resolve({
      status: 201,
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
  }
  if (
    url === "http://localhost:5984/hello/_security" && options.method === "PUT"
  ) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
  }

  if (url === "http://localhost:5984/hello" && options.method === "DELETE") {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
  }

  if (url === "http://localhost:5984/hello" && options.method === "POST") {
    return Promise.resolve({
      status: 201,
      ok: true,
      json: () => Promise.resolve({ ok: true, id: "1" }),
    });
  }
  if (url === "http://localhost:5984/hello/1" && options.method === "GET") {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ _id: "1", _rev: "1", hello: "world" }),
    });
  }

  if (
    url === "http://localhost:5984/hello/_find" && options.method === "POST"
  ) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () =>
        Promise.resolve({
          ok: true,
          docs: [{ _id: "1", _rev: "1", hello: "world" }],
        }),
    });
  }

  if (
    url === "http://localhost:5984/hello/_index" && options.method === "POST"
  ) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });
  }

  if (
    url === "http://localhost:5984/hello/_all_docs" && options.method === "POST"
  ) {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () =>
        Promise.resolve({
          ok: true,
          rows: [{
            key: "1",
            id: "1",
            value: { rev: "1" },
            doc: { _id: "1", _rev: "1", hello: "world" },
          }],
        }),
    });
  }

  if (url === "http://localhost:5984/hello" && options.method === "GET") {
    return Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ db_name: "hello" }),
    });
  }

  if (
    url === "http://localhost:5984/hello/_bulk_docs" &&
    options.method === "POST"
  ) {
    return Promise.resolve({
      status: 201,
      ok: true,
      json: () =>
        Promise.resolve([{ id: "1", ok: true }, { id: "2", ok: true }]),
    });
  }
  console.log("URL not resolving: ", options.method, url);

  return Promise.resolve({
    status: 500,
    ok: false,
    json: () => Promise.resolve({ ok: true }),
  });
};

const a = adapter({
  config: { origin: COUCH },
  asyncFetch: asyncFetch(testFetch),
  headers: createHeaders("admin", "password"),
  handleResponse,
});

test("bulk documents", async () => {
  const result = await a.bulkDocuments({
    db: "hello",
    docs: [{ id: "1" }, { id: "2" }],
  }).catch((err) => ({ ok: false, err }));
  console.log("results", result);
  assertEquals(result.ok, true);
  assertEquals(result.results.length, 2);
});

test("create database", async () => {
  const result = await a.createDatabase("hello");
  assertEquals(result.ok, true);
});

test("remove database", async () => {
  const result = await a.removeDatabase("hello");
  assertEquals(result.ok, true);
});

test("create document", async () => {
  const result = await a.createDocument({
    db: "hello",
    id: "1",
    doc: { hello: "world" },
  });
  assertEquals(result.ok, true);
});

test("can not create design document", async () => {
  try {
    await a.createDocument({
      db: "hello",
      id: "_design/1",
      doc: { hello: "world" },
    });
  } catch (e) {
    assertEquals(e.ok, false);
  }
});

test("retrieve document", async () => {
  const result = await a.retrieveDocument({
    db: "hello",
    id: "1",
  });
  assertEquals(result.hello, "world");
});

test("find documents", async () => {
  const results = await a.queryDocuments({
    db: "hello",
    query: {
      selector: {
        id: "1",
      },
    },
  });

  assertObjectMatch(results.docs[0], {
    id: "1",
    hello: "world",
  });
});

test("create query index", async () => {
  const results = await a.indexDocuments({
    db: "hello",
    name: "foo",
    fields: ["foo"],
  });
  console.log("results", results);
  assertEquals(results.ok, true);
});

test("list documents", async () => {
  const results = await a.listDocuments({
    db: "hello",
    limit: 1,
  });
  assertObjectMatch(results.docs[0], {
    id: "1",
    hello: "world",
  });
});
