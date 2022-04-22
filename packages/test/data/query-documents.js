import crocks from "crocks";
import { assoc, keys, map } from "ramda";
import { $fetch } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const albums = [
  {
    _id: "2001",
    type: "album",
    title: "Nothing Shocking",
    band: "Janes Addiction",
  },
  {
    _id: "2002",
    type: "album",
    title: "Appetite for Destruction",
    band: "Guns and Roses",
  },
  { _id: "2003", type: "album", title: "Back in Black", band: "ACDC" },
  { _id: "2004", type: "album", title: "The Doors", band: "Doors" },
  { _id: "2005", type: "album", title: "Nevermind", band: "Nirvana" },
];

export default function (data) {
  const setup = () => $fetch(() => data.bulk(albums));

  const query = (selector, options) =>
    () => $fetch(() => data.query(selector, options));

  const tearDown = () =>
    Async.of(albums)
      .map(map(assoc("_deleted", true)))
      .chain((docs) => $fetch(() => data.bulk(docs)));

  const createIndex = () => $fetch(() => data.index("idx-title", ["title"]));

  test("POST /data/:store/_query - query documents of type album", () =>
    tearDown().chain(setup)
      .chain(query({ type: "album" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query documents with no selector", () =>
    tearDown().chain(setup)
      .chain(query())
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector with limit", () =>
    tearDown().chain(setup)
      .chain(query({ type: "album" }, { limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector with sort", () =>
    tearDown().chain(setup)
      .chain(createIndex)
      .chain(query({ type: "album" }, { sort: [{ title: "DESC" }] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs[0]._id, "2004"), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector - select fields", () =>
    tearDown().chain(setup)
      .chain(query({ type: "album" }, { fields: ["_id", "band"] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .map((r) => (assertEquals(keys(r.docs[0]).length, 2), r))
      .chain(tearDown)
      .toPromise());
}
