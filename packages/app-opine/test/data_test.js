// TODO: Tyler. Probably better way to do this
import { crocks } from '../deps.js';
import { assert, assertEquals, superdeno } from '../dev_deps.js';

import build from '../mod.js';

Deno.env.set('DENO_ENV', 'test');

const app = build({
  data: {
    getDocument: (db, id, isLegacyGetEnabled) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: id, db, isLegacyGetEnabled },
      }),
    bulkDocuments: (db, body) => crocks.Async.Resolved({ ok: true, db, results: body }),
    listDocuments: (db, query) => {
      return crocks.Async.Resolved({ ok: true, db, query, docs: [] });
    },
  },
  middleware: [],
});

Deno.test('data', async (t) => {
  await t.step('GET /data/:db/:id', async (t) => {
    await t.step('should pass the correct values', async () => {
      const withLegacy = await superdeno(app)
        .get('/data/movies/1')
        .set('X-HYPER-LEGACY-GET', true);

      assert(withLegacy.body.ok);
      assertEquals(withLegacy.body.doc._id, '1');
      assertEquals(withLegacy.body.doc.db, 'movies');
      assert(withLegacy.body.doc.isLegacyGetEnabled);

      const withoutLegacy = await superdeno(app)
        .get('/data/movies/1');

      assert(withoutLegacy.body.ok);
      assertEquals(withoutLegacy.body.doc._id, '1');
      assertEquals(withoutLegacy.body.doc.db, 'movies');
      // Will cause the default in core to be used
      assertEquals(withoutLegacy.body.doc.isLegacyGetEnabled, undefined);

      const withLegacyDisabled = await superdeno(app)
        .get('/data/movies/1')
        .set('X-HYPER-LEGACY-GET', false);

      assert(withLegacyDisabled.body.ok);
      assertEquals(withLegacyDisabled.body.doc._id, '1');
      assertEquals(withLegacyDisabled.body.doc.db, 'movies');
      assertEquals(withLegacyDisabled.body.doc.isLegacyGetEnabled, false);
    });
  });

  await t.step('POST /data/movies/_bulk', async (t) => {
    await t.step('should pass the correct values', async () => {
      const res = await superdeno(app)
        .post('/data/movies/_bulk')
        .set('Content-Type', 'application/json')
        .send([{ id: '1', type: 'movie' }]);

      assert(res.body.ok);
      assertEquals(res.body.db, 'movies');
      assertEquals(res.body.results, [{ id: '1', type: 'movie' }]);
    });
  });

  await t.step('GET /data/movies', async (t) => {
    await t.step('query parmas ?limit=2', async () => {
      const res = await superdeno(app)
        .get('/data/movies?limit=2');

      assert(res.body.ok);
      assertEquals(res.body.db, 'movies');
      assertEquals(res.body.query, { limit: '2' });
    });

    await t.step('no query params', async () => {
      const res = await superdeno(app)
        .get('/data/movies');

      assert(res.body.ok);
      assertEquals(res.body.db, 'movies');
      assertEquals(res.body.query, {});
    });
  });

  // TODO: add more test coverage here
});
