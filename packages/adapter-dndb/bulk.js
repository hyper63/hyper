// deno-lint-ignore-file no-unused-vars

import { crocks, R } from "./deps.js";

const {
  assoc,
  compose,
  identity,
  ifElse,
  isNil,
  map,
  omit,
  pick,
  prop,
  propEq,
} = R;
const { Async } = crocks;

const toInternalId = compose(omit(["id"]), (doc) => assoc("_id", doc.id, doc));

export function bulk({ db, docs }) {
  const remove = (doc) =>
    compose(
      map((r) => ({ ok: true, id: doc._id, deleted: true })),
      Async.fromPromise(db.remove.bind(db)),
      pick(["_id"]),
    )(doc);

  const isDeleted = propEq("_deleted", true);
  const isNew = propEq("_new", true);

  const insert = compose(
    map((r) => ({ ok: true, id: r._id })),
    Async.fromPromise(db.insert.bind(db)),
    omit(["_new"]),
  );
  const update = (doc) =>
    Async.fromPromise(db.update.bind(db))(prop("_id", doc), { $set: doc })
      .map((r) => ({ ok: true, id: doc._id }));

  const findOne = Async.fromPromise(db.findOne.bind(db));
  const flagNew = (doc) =>
    ifElse(isNil, () => assoc("_new", true, doc), identity);

  return Async.of(docs)
    .map(map(toInternalId))
    // findAll updates
    .chain(compose(
      Async.all,
      map((doc) =>
        compose(
          map(flagNew(doc)),
          findOne,
          pick(["_id"]),
        )(doc)
      ),
    ))
    .chain(compose(
      Async.all,
      map(
        ifElse(isDeleted, remove, ifElse(isNew, insert, update)),
      ),
    ));
}
