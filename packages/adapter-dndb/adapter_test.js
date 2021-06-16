// deno-lint-ignore-file no-unused-vars

import { adapter } from "./adapter.js";
import { assertEquals } from "./dev_deps.js";

function Datastore(config) {
  return Object.freeze({
    insert: (doc) => Promise.resolve(doc),
    findOne: (o) => Promise.resolve({ _id: "1", hello: "world" }),
    updateOne: (criteria, action) =>
      Promise.resolve({ _id: "1", hello: "moon" }),
    removeOne: (o) => Promise.resolve(o),
    find: () => Promise.resolve([]),
    update: (criteria, action) => Promise.resolve(action.$set),
  });
}

const test = Deno.test;
const a = adapter({ filename: "./test.db" }, Datastore);

test("create database", async () => {
  const result = await a.createDatabase("foo");
  assertEquals(result.ok, true);
});

test("remove database", async () => {
  const result = await a.removeDatabase("foo");
  assertEquals(result.ok, true);
});

test("create document", async () => {
  const result = await a.createDocument({
    db: "foo",
    id: "1",
    doc: { hello: "world" },
  });
  assertEquals(result.ok, true);
});

test("retrieve document", async () => {
  const result = await a.retrieveDocument({
    db: "foo",
    id: "1",
  });

  assertEquals(result.id, "1");
});

test("update document", async () => {
  const result = await a.updateDocument({
    db: "foo",
    id: "1",
    doc: { id: "1", hello: "moon" },
  });
  assertEquals(result.ok, true);
});

test("remove document", async () => {
  const result = await a.removeDocument({
    db: "foo",
    id: "1",
  });
  assertEquals(result.ok, true);
});

test("list documents", async () => {
  const result = await a.listDocuments({ db: "foo" });
  assertEquals(result.ok, true);
});

test("query documents", async () => {
  await a.createDocument({
    db: "foo",
    id: "movid-1",
    doc: { id: "movie-1", type: "movie", title: "Great Outdoors" },
  });

  const result = await a.queryDocuments({
    db: "foo",
    query: {
      selector: { type: "movie" },
    },
  });

  assertEquals(result.ok, true);
});

test("index documents", async () => {
  const result = await a.indexDocuments({
    db: "foo",
    name: "fooIndex",
    fields: ["type"],
  });
  assertEquals(result.ok, true);
});

test("bulk update/insert/remove documents", async () => {
  const result = await a.bulkDocuments({
    db: "foo",
    docs: [
      { id: "movie-1", type: "movie", name: "ghostbusters", _deleted: true },
      { id: "movie-2", type: "movie", name: "great outdoors" },
      { id: "movie-3", type: "movie", name: "groundhog day" },
      { id: "movie-4", type: "movie", name: "what about bob?" },
      { id: "movie-5", type: "movie", name: "spaceballs" },
    ],
  });
  assertEquals(result.ok, true);
});
