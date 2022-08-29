// deno-lint-ignore-file no-unused-vars
import { assert, Buffer } from "./dev_deps.js";

import { storage as storagePort } from "./mod.js";

const wrap = {
  makeBucket: (name) => Promise.resolve({ ok: true }),
  removeBucket: (name) => Promise.resolve({ ok: true }),
  listBuckets: () => Promise.resolve({ ok: true, buckets: ["foo"] }),
  putObject: ({ bucket, object, stream }) => Promise.resolve({ ok: true }),
  removeObject: ({ bucket, object }) => Promise.resolve({ ok: true }),
  getObject: ({ bucket, object }) => Promise.resolve({ ok: true }),
  listObjects: ({ bucket, prefix }) =>
    Promise.resolve({ ok: true, objects: ["foo.jpg"] }),
};

let adapter = storagePort(wrap);

Deno.test("validate adapter", async () => {
  const results = await Promise.all([
    adapter.makeBucket("foo"),
    adapter.removeBucket("foo"),
    adapter.listBuckets(),
    adapter.putObject({
      bucket: "foo",
      object: "bar.jpg",
      stream: new Buffer(new Uint8Array(4).buffer),
    }),
    adapter.removeObject({
      bucket: "foo",
      object: "bar.jpg",
    }),
    adapter.getObject({
      bucket: "foo",
      object: "bar.jpg",
    }),
    adapter.listObjects({
      bucket: "foo",
      prefix: "bar.jpg",
    }),
  ])
    .then((_) => ({ ok: true }))
    .catch((_) => {
      console.log(_);
      return ({ ok: false });
    });

  assert(results.ok);
});

Deno.test("putObject", async (t) => {
  await t.step("always validate 'bucket' and 'object' params", async () => {
    let err = await adapter.putObject({
      bucket: "foo",
      no_object: "bar.jpg",
      stream: new Buffer(new Uint8Array(4).buffer),
    }).catch(() => ({ ok: false }));

    assert(!err.ok);

    err = await adapter.putObject({
      no_bucket: "foo",
      object: "bar.jpg",
      useSignedUrl: true,
    }).catch(() => ({ ok: false }));

    assert(!err.ok);
  });

  await t.step("upload", async (t) => {
    // happy
    await t.step("happy", async () => {
      const res = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        stream: new Buffer(new Uint8Array(4).buffer),
      });

      assert(res.ok);
      assert(!res.url);
    });

    await t.step("nil stream", async () => {
      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        stream: null,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);
    });

    await t.step("conflicting params", async () => {
      // conflicting params by passing both useSignedUrl: true and stream
      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        stream: new Buffer(new Uint8Array(4).buffer),
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);
    });

    await t.step("invalid return", async () => {
      // invalid return
      adapter = storagePort({
        ...wrap,
        putObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "https://foo.ar" }),
      });

      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        stream: new Buffer(new Uint8Array(4).buffer),
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });
  });

  await t.step("signedUrl", async (t) => {
    await t.step("happy", async () => {
      adapter = storagePort({
        ...wrap,
        putObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "https://foo.ar" }),
      });

      // happy
      const res = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      });

      assert(res.ok);
      assert(res.url);

      // cleanup
      adapter = storagePort(wrap);
    });

    await t.step("invalid useSignedUrl false", async () => {
      adapter = storagePort({
        ...wrap,
        putObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "https://foo.ar" }),
      });

      // useSignedUrl false
      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: false,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });

    await t.step("conflicting params", async () => {
      adapter = storagePort({
        ...wrap,
        putObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "https://foo.ar" }),
      });

      // conflicting params by passing both useSignedUrl: true and stream
      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        stream: new Buffer(new Uint8Array(4).buffer),
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });

    await t.step("invalid url in return", async () => {
      adapter = storagePort({
        ...wrap,
        putObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "not.a.url" }),
      });

      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });

    await t.step("no url in return", async () => {
      const err = await adapter.putObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);
    });
  });
});

Deno.test("getObject", async (t) => {
  await t.step("always validate 'bucket' and 'object' params", async () => {
    let err = await adapter.getObject({
      bucket: "foo",
      no_object: "bar.jpg",
    }).catch(() => ({ ok: false }));

    assert(!err.ok);

    err = await adapter.getObject({
      no_bucket: "foo",
      object: "bar.jpg",
      useSignedUrl: true,
    }).catch(() => ({ ok: false }));

    assert(!err.ok);
  });

  await t.step("download", async (t) => {
    await t.step("happy", async () => {
      const res = await adapter.getObject({
        bucket: "foo",
        object: "bar.jpg",
      });

      assert(res.ok);
      assert(!res.url);
    });

    await t.step("useSignedUrl is false", async () => {
      const res = await adapter.getObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: false,
      });

      assert(res.ok);
      assert(!res.url);
    });
  });

  await t.step("useSignedUrl", async (t) => {
    await t.step("happy", async () => {
      adapter = storagePort({
        ...wrap,
        getObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "https://foo.ar" }),
      });

      const res = await adapter.getObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      });

      assert(res.ok);
      assert(res.url);
    });

    await t.step("invalid url", async () => {
      adapter = storagePort({
        ...wrap,
        getObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true, url: "not.a.url" }),
      });

      const err = await adapter.getObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });

    await t.step("no url", async () => {
      adapter = storagePort({
        ...wrap,
        getObject: ({ bucket, object, useSignedUrl }) =>
          Promise.resolve({ ok: true }),
      });

      const err = await adapter.getObject({
        bucket: "foo",
        object: "bar.jpg",
        useSignedUrl: true,
      }).catch(() => ({ ok: false }));

      assert(!err.ok);

      // cleanup
      adapter = storagePort(wrap);
    });
  });
});
