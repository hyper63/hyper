// deno-lint-ignore-file no-unused-vars
import { assertEquals } from "../../dev_deps.js";

import * as store from "./store.js";

const test = Deno.test;

const mockService = {
  createStore: (name) =>
    Promise.resolve({
      ok: true,
    }),
  destroyStore: (name) => Promise.resolve({ ok: true }),
  listDocs: (name) => Promise.resolve({ ok: true }),
};

const events = {
  dispatch: () => null,
};

test("create cache store", () => {
  function handleError() {
    assertEquals(false, true);
  }
  function handleSuccess() {
    assertEquals(true, true);
  }

  store.create("hello").runWith({ svc: mockService, events }).fork(
    handleError,
    handleSuccess,
  );
});

test("should not create store", () => {
  store.create("_foo").runWith({ svc: mockService, events })
    .fork(
      () => assertEquals(true, true),
      () => assertEquals(false, true),
    );
});

test("destroy cache store", () => {
  function handleError() {
    assertEquals(false, true);
  }
  function handleSuccess() {
    assertEquals(true, true);
  }

  store.del("hello").runWith({ svc: mockService, events }).fork(
    handleError,
    handleSuccess,
  );
});

test("query cache store", () => {
  function handleError() {
    assertEquals(false, true);
  }
  function handleSuccess() {
    assertEquals(true, true);
  }

  store.query("hello").runWith({ svc: mockService, events }).fork(
    handleError,
    handleSuccess,
  );
});
