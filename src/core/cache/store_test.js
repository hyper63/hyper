import { default as test } from 'tape'
import * as store from './store'
import { Async } from 'crocks'

const mockService = {
  createStore: (name) =>
    Async.of({
      ok: true,
    }),
  destroyStore: (name) => Async.of({ ok: true }),
  listDocs: (name) => Async.of({ ok: true }),
};

test("create cache store", (t) => {
  t.plan(1);

  function handleError() {
    t.ok(false);
  }
  function handleSuccess() {
    t.ok(true);
  }

  store.create("Hello").runWith(mockService).fork(handleError, handleSuccess);
});

test("destroy cache store", (t) => {
  t.plan(1);

  function handleError() {
    t.ok(false);
  }
  function handleSuccess() {
    t.ok(true);
  }

  store.delete("Hello").runWith(mockService).fork(handleError, handleSuccess);
});

test("query cache store", (t) => {
  t.plan(1);

  function handleError() {
    t.ok(false);
  }
  function handleSuccess() {
    t.ok(true);
  }

  store.query("Hello").runWith(mockService).fork(handleError, handleSuccess);
});
