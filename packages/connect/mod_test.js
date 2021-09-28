import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";
import connect from "./mod.js";

const test = Deno.test;

const hyper = connect("http://localhost:6363/test")();

test("HYPER: get info", () => {
  assert(!hyper.info.isCloud);
});

test("DATA: list documents", async () => {
  const req = await hyper.data.list();
  assertEquals(req.url, "http://localhost:6363/data/test?");
  assertEquals(req.method, "GET");
});

test("DATA: add document", async () => {
  const req = await hyper.data.add({
    id: "x-1",
    type: "test",
    title: "Hello World",
  });
  assertEquals(req.url, "http://localhost:6363/data/test");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), {
    id: "x-1",
    type: "test",
    title: "Hello World",
  });
});

test("DATA: remove document", async () => {
  const req = await hyper.data.remove("x-1");
  assertEquals(req.url, "http://localhost:6363/data/test/x-1");
  assertEquals(req.method, "DELETE");
});

test("DATA: update document", async () => {
  const req = await hyper.data.update("x-1", {
    id: "x-1",
    type: "test",
    title: "Hello Mars",
  });
  assertEquals(req.url, "http://localhost:6363/data/test/x-1");
  assertEquals(req.method, "PUT");
});

test("DATA: query documents", async () => {
  const req = await hyper.data.query({ type: "test" });
  assertEquals(req.url, "http://localhost:6363/data/test/_query");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), { selector: { type: "test" } });
});

test("DATA: bulk documents", async () => {
  const req = await hyper.data.bulk([{ id: "x-1" }, { id: "x-2" }]);
  assertEquals(req.url, "http://localhost:6363/data/test/_bulk");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), [{ id: "x-1" }, { id: "x-2" }]);
});

test("DATA: index database", async () => {
  const req = await hyper.data.index("idx-name", ["type", "title"]);
  assertEquals(req.url, "http://localhost:6363/data/test/_index");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), {
    fields: ["type", "title"],
    name: "idx-name",
    type: "json",
  });
});

test("CACHE: add key/value", async () => {
  const req = await hyper.cache.add("x-1", {
    type: "test",
    title: "Hello World",
  }, "1m");
  assertEquals(req.url, "http://localhost:6363/cache/test");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), {
    key: "x-1",
    value: { type: "test", title: "Hello World" },
    ttl: "1m",
  });
});

test("CACHE: remove key/value", async () => {
  const req = await hyper.cache.remove("x-1");
  assertEquals(req.url, "http://localhost:6363/cache/test/x-1");
  assertEquals(req.method, "DELETE");
});

test("CACHE: set key/value", async () => {
  const req = await hyper.cache.set("x-1", {
    id: "x-1",
    type: "test",
    title: "Hello Mars",
  }, "2m");
  assertEquals(req.url, "http://localhost:6363/cache/test/x-1?ttl=2m");
  assertEquals(req.method, "PUT");
  assertEquals(await req.json(), {
    id: "x-1",
    type: "test",
    title: "Hello Mars",
  });
});

test("CACHE: query keys", async () => {
  const req = await hyper.cache.query("x*");
  assertEquals(req.url, "http://localhost:6363/cache/test/_query?pattern=x*");
  assertEquals(req.method, "POST");
});

test("SEARCH: index document", async () => {
  const req = await hyper.search.add("x-1", {
    type: "test",
    title: "Hello World",
  });
  assertEquals(req.url, "http://localhost:6363/search/test");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), {
    key: "x-1",
    doc: { type: "test", title: "Hello World" },
  });
});

test("SEARCH: remove document", async () => {
  const req = await hyper.search.remove("x-1");
  assertEquals(req.url, "http://localhost:6363/search/test/x-1");
  assertEquals(req.method, "DELETE");
});

test("SEARCH: get document", async () => {
  const req = await hyper.search.get("x-1");
  assertEquals(req.url, "http://localhost:6363/search/test/x-1");
  assertEquals(req.method, "GET");
});

test("SEARCH: query document", async () => {
  const req = await hyper.search.query("hello");
  assertEquals(req.url, "http://localhost:6363/search/test/_query");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), { query: "hello" });
});

test("SEARCH: load document", async () => {
  const req = await hyper.search.load([{ id: "x1" }, { id: "x-2" }]);
  assertEquals(req.url, "http://localhost:6363/search/test/_bulk");
  assertEquals(req.method, "POST");
  assertEquals(await req.json(), [{ id: "x1" }, { id: "x-2" }]);
});
