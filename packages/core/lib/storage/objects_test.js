// deno-lint-ignore-file no-unused-vars
import { R } from "../../deps.js";
import { assertEquals } from "../../dev_deps.js";
import * as objects from "./objects.js";

const { tap } = R;

const test = Deno.test;

const mock = {
  putObject({ bucket, object, stream, useSignedUrl }) {
    return Promise.resolve({ ok: true, stream, useSignedUrl });
  },
  getObject({ bucket, object }) {
    return Promise.resolve({ ok: true });
  },
  removeObject({ bucket, object }) {
    return Promise.resolve({ ok: true });
  },
  listObjects({ bucket, prefix }) {
    return Promise.resolve({
      ok: true,
      objects: ["one.txt", "two.txt", "three.txt"],
    });
  },
};

const fork = (m) =>
  () => {
    m.fork(
      () => assertEquals(true, false),
      () => assertEquals(true, true),
    );
  };

const events = {
  dispatch: () => null,
};

test(
  "put object",
  () => {
    // upload
    fork(
      objects
        .put(
          "test",
          "README.md",
          "foo", // fs.createReadStream(path.resolve('../../README.md'))
        )
        .map(tap(({ stream, useSignedUrl }) => {
          assertEquals(stream, "foo");
          assertEquals(useSignedUrl, undefined);
        }))
        .runWith({ svc: mock, events }),
    );

    // useSignedUrl
    fork(
      objects
        .put(
          "test",
          "README.md",
          undefined,
          true,
        )
        .map(tap(({ stream, useSignedUrl }) => {
          assertEquals(stream, undefined);
          assertEquals(useSignedUrl, true);
        }))
        .runWith({ svc: mock, events }),
    );
  },
);

test(
  "remove bucket",
  fork(objects.remove("beep").runWith({ svc: mock, events })),
);
test("list buckets", fork(objects.list().runWith({ svc: mock, events })));
