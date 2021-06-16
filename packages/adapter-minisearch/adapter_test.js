import { assert, assertEquals } from "./dev_deps.js";

import createAdapter from "./adapter.js";

const adapter = createAdapter();

// TODO: Tyler. Make tests independent of each other

Deno.test("create index", async () => {
  const result = await adapter.createIndex({
    index: "default",
    mappings: {
      fields: ["title", "body"],
      storeFields: ["title", "body", "category"],
    },
  });
  assert(result.ok);
});

Deno.test("index doc", async () => {
  const result2 = await adapter.indexDoc({
    index: "default",
    key: "1",
    doc: {
      id: "1",
      title: "Search is fun",
      body: "This is a search post about cool and exciting stuff",
      category: "search",
    },
  });

  assert(result2.ok);
});

Deno.test("get document", async () => {
  const result3 = await adapter.getDoc({
    index: "default",
    key: "1",
  });

  assertEquals(result3.id, "1");
});

Deno.test("update document", async () => {
  const result4 = await adapter.updateDoc({
    index: "default",
    key: "1",
    doc: {
      id: "1",
      title: "Search is cool",
      body: "This is a search post and it is fun",
      category: "search",
    },
  });

  const newDoc = await adapter.getDoc({
    index: "default",
    key: "1",
  });

  assertEquals(newDoc.title, "Search is cool");
  assert(result4.ok);
});

Deno.test("query doc", async () => {
  const searchResults = await adapter.query({
    index: "default",
    q: { query: "Search is cool" },
  });

  assertEquals(searchResults.matches[0].id, "1");

  const searchResults2 = await adapter.query({
    index: "default",
    q: {
      query: "Search is cool",
      filter: { category: "search" },
    },
  });

  assertEquals(searchResults2.matches[0].id, "1", "found doc");
});

Deno.test("remove doc", async () => {
  const docDeleteResult = await adapter.removeDoc({
    index: "default",
    key: "1",
  });

  assert(docDeleteResult.ok);

  const deletedDoc = await adapter.getDoc({
    index: "default",
    key: "1",
  });

  assertEquals(deletedDoc, null);
});

Deno.test("delete index", async () => {
  const deleteResult = await adapter.deleteIndex("default");
  assert(deleteResult.ok);
});
