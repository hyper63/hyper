// TODO: Tyler. Probably better way to do this
import { crocks } from '../deps.js';
import { assert, assertEquals, superdeno } from '../dev_deps.js';

import build from '../mod.js';

Deno.env.set('DENO_ENV', 'test');

const app = build({
  cache: {
    getDoc: (name, key, isLegacyGetEnabled) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: key, name, isLegacyGetEnabled },
      }),
  },
  middleware: [],
});

Deno.test('cache', async (t) => {
  await t.step('GET /cache/:name/:id', async (t) => {
    await t.step('should pass the correct values', async () => {
      const withLegacy = await superdeno(app)
        .get('/cache/movies/key')
        .set('X-HYPER-LEGACY-GET', true);

      assert(withLegacy.body.ok);
      assertEquals(withLegacy.body.doc._id, 'key');
      assertEquals(withLegacy.body.doc.name, 'movies');
      assert(withLegacy.body.doc.isLegacyGetEnabled);

      const withoutLegacy = await superdeno(app)
        .get('/cache/movies/key');

      assert(withoutLegacy.body.ok);
      assertEquals(withoutLegacy.body.doc._id, 'key');
      assertEquals(withoutLegacy.body.doc.name, 'movies');
      // Will cause the default in core to be used
      assertEquals(withoutLegacy.body.doc.isLegacyGetEnabled, undefined);

      const withLegacyDisabled = await superdeno(app)
        .get('/cache/movies/key')
        .set('X-HYPER-LEGACY-GET', false);

      assert(withLegacyDisabled.body.ok);
      assertEquals(withLegacyDisabled.body.doc._id, 'key');
      assertEquals(withLegacyDisabled.body.doc.name, 'movies');
      assertEquals(withLegacyDisabled.body.doc.isLegacyGetEnabled, false);
    });
  });

  // TODO: add more test coverage here
});
