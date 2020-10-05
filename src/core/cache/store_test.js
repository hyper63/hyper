const test = require("tape");
const store = require("./store");
const Async = require("crocks/Async");

const mockService = {
  create: (name) =>
    Async.of({
      ok: true,
    }),
  destroy: (name) => Async.of({ ok: true }),
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
