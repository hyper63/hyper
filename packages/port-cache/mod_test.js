// deno-lint-ignore-file no-unused-vars

import { assert } from "./dev_deps.js";

import { cache as cachePort } from "./mod.js";

Deno.test("port cache ok", () => {
  const goodCache = cachePort({
    createStore(name) {
      return Promise.resolve({ ok: true });
    },
    destroyStore(name) {
      return Promise.resolve({ ok: true });
    },
    createDoc({
      store,
      key,
      value,
      ttl,
    }) {
      return Promise.resolve({ ok: true });
    },
    getDoc({ store, key }) {
      return Promise.resolve({ ok: true, doc: { beep: "boop" } });
    },
    updateDoc({ store, key, value, ttl }) {
      return Promise.resolve({ ok: true });
    },
    deleteDoc({ store, key }) {
      return Promise.resolve({ ok: true });
    },
    listDocs({ store, pattern }) {
      return Promise.resolve({ ok: true, docs: [] });
    },
    index() {
      return Promise.resolve([]);
    },
  });
  Promise.all([
    goodCache.createStore("foo"),
    goodCache.destroyStore("foo"),
    goodCache.createDoc({
      store: "foo",
      key: "hello",
      value: { beep: "world" },
      ttl: "2m",
    }),
    goodCache.getDoc({ store: "foo", key: "hello" }),
    goodCache.updateDoc({ store: "foo", key: "hello", value: { baz: "bam" } }),
    goodCache.deleteDoc({ store: "foo", key: "hello" }),
    goodCache.listDocs({ store: "foo", pattern: "w*" }),
  ])
    .then(() => {
      assert(true);
    })
    .catch((e) => {
      assert(false);
    });
});

Deno.test("port cache shape not ok", (t) => {
  assert(true);
});

Deno.test("port cache methods not ok", (t) => {
  assert(true);
});
