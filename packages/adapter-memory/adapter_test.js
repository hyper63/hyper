import {
  assert,
  assertEquals,
  assertObjectMatch,
  v4 as v4Generator,
} from "./dev_deps.js";

import createAdapter from "./adapter.js";

const v4 = v4Generator.generate.bind(v4Generator);

const memory = createAdapter();

Deno.test("try to create cache store with no name", async () => {
  const result = await memory.createStore(null).catch((e) => e);

  assert(!result.ok, "should be false");
  assertEquals(
    result.msg,
    "name must be a string value",
    "error msg is correct",
  );

  const result2 = await memory.createStore(undefined).catch((e) => e);

  assert(!result2.ok, "should be false");
  assertEquals(
    result2.msg,
    "name must be a string value",
    "error msg is correct",
  );
});

Deno.test("find documents", async () => {
  await memory.createStore("demo");
  await memory.createDoc({
    store: "demo",
    key: "marvel-spiderman",
    value: {
      hero: "spiderman",
      name: "Peter Parker",
      universe: "marvel",
    },
  });
  await memory.createDoc({
    store: "demo",
    key: "marvel-ironman",
    value: {
      hero: "ironman",
      name: "Tony Stark",
      universe: "marvel",
    },
  });
  await memory.createDoc({
    store: "demo",
    key: "dc-superman",
    value: {
      hero: "superman",
      name: "Clark Kent",
      universe: "dc",
    },
  });
  const results = await memory.listDocs({
    store: "demo",
    pattern: "dc-*",
  });
  assert(results.ok, "list docs was successful");
  assertEquals(results.docs[0].value.hero, "superman", "found match");
  await memory.destroyStore("demo");
});

Deno.test("create store", async () => {
  const result = await memory.createStore("default");
  assert(result.ok);
});

Deno.test("delete store", async () => {
  const result = await memory.destroyStore("default");
  assert(result.ok);
});

Deno.test("create doc", async () => {
  const store = v4();
  await memory.createStore(store);
  await memory.createDoc({
    store: store,
    key: "1",
    value: { hello: "world" },
  });
  const result = await memory.getDoc({
    store: store,
    key: "1",
  });
  assertObjectMatch(result, { hello: "world" });
  await memory.destroyStore(store);
});

Deno.test("get doc", async () => {
  const store = v4();
  await memory.createStore(store);
  await memory.createDoc({
    store,
    key: "2",
    value: { foo: "bar" },
  });
  const result = await memory.getDoc({
    store,
    key: "2",
  });
  assertObjectMatch(result, { foo: "bar" });
  await memory.destroyStore(store);
});

Deno.test("update doc", async () => {
  const store = v4();
  await memory.createStore(store);
  await memory.createDoc({
    store,
    key: "2",
    value: { foo: "bar" },
  });
  await memory.updateDoc({
    store,
    key: "2",
    value: { beep: "boop" },
  });
  const result = await memory.getDoc({
    store,
    key: "2",
  });
  assertObjectMatch(result, { beep: "boop" });
  await memory.destroyStore(store);
});

Deno.test("delete doc", async () => {
  const store = v4();
  await memory.createStore(store);
  await memory.createDoc({
    store,
    key: "2",
    value: { foo: "bar" },
  });
  await memory.deleteDoc({
    store,
    key: "2",
  });
  const result = await memory.getDoc({
    store,
    key: "2",
  }).catch((e) => e);
  assertEquals(result.ok, false);
  await memory.destroyStore(store);
});
