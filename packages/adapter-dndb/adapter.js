// deno-lint-ignore-file no-unused-vars

import { cuid, R } from "./deps.js";
import { bulk } from "./bulk.js";

const { assoc, compose, equals, omit } = R;
const toInternalId = compose(omit(["id"]), (doc) => assoc("_id", doc.id, doc));

let db = null;
export function adapter(_env, Datastore) {
  // create _system json file to hold all db names

  return Object.freeze({
    createDatabase: (name) => {
      try {
        db = new Datastore({ filename: `./${name}.db`, autoload: true });
      } catch (e) {
        return Promise.resolve({ ok: false, message: e.message });
      }
      return Promise.resolve({ ok: true });
    },
    removeDatabase: async (name) => {
      // todo delete file if exists
      try {
        await Deno.remove(`./${name}.db`);
      } catch (e) {
        console.log(e.message);
      }
      return Promise.resolve({ ok: true });
    },
    createDocument: async ({ db, id, doc }) => {
      db = new Datastore({ filename: `./${db}.db` });
      doc._id = id || cuid();
      const result = await db.insert(doc);
      return Promise.resolve({ ok: equals(result, doc), id: result._id });
    },
    retrieveDocument: async ({ db, id }) => {
      db = new Datastore({ filename: `./${db}.db` });
      const doc = await db.findOne({ _id: id });
      // swap ids
      return Promise.resolve(compose(omit(["_id"]), assoc("id", doc._id))(doc));
    },
    updateDocument: async ({ db, id, doc }) => {
      db = new Datastore({ filename: `./${db}.db` });
      // swap ids
      doc = toInternalId(doc);
      const result = await db.updateOne({ _id: id }, { $set: doc });
      return Promise.resolve({ ok: equals(doc, result) });
    },
    removeDocument: async ({ db, id }) => {
      db = new Datastore({ filename: `./${db}.db` });
      const result = await db.removeOne({ _id: id });
      if (!result) return Promise.resolve({ ok: false, message: "not found" });
      return Promise.resolve({ ok: equals(result._id, id) });
    },
    listDocuments: async ({ db }) => {
      db = new Datastore({ filename: `./${db}.db` });
      const results = await db.find();
      return Promise.resolve({ ok: true, docs: results });
    },
    queryDocuments: async ({ db, query }) => {
      db = new Datastore({ filename: `./${db}.db` });
      const results = await db.find(query.selector);
      return Promise.resolve({ ok: true, docs: results });
    },
    indexDocuments: ({ db, name, fields }) => {
      // noop - db is not built for
      // optimizability yet! will add this when
      // supported
      return Promise.resolve({ ok: true });
    },
    bulkDocuments: ({ db, docs }) => {
      db = new Datastore({ filename: `./${db}.db` });
      return bulk({ db, docs })
        .map((results) => ({ ok: true, results }))
        .toPromise();
    },
  });
}
