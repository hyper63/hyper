import crocks from "crocks";
import { assoc, keys, map } from "ramda";
import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const albums = [
  {
    id: "2001",
    type: "album",
    title: "Nothing Shocking",
    band: "Janes Addiction",
  },
  {
    id: "2002",
    type: "album",
    title: "Appetite for Destruction",
    band: "Guns and Roses",
  },
  { id: "2003", type: "album", title: "Back in Black", band: "ACDC" },
  { id: "2004", type: "album", title: "The Doors", band: "Doors" },
  { id: "2005", type: "album", title: "Nevermind", band: "Nirvana" },
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
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query documents with no selector", () =>
    tearDown().chain(setup)
      .chain(query())
      .map((r) => (assertEquals(r.docs.length, 5)))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector with limit", () =>
    tearDown().chain(setup)
      .chain(query({ type: "album" }, { limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector with sort", () =>
    tearDown().chain(setup)
      .chain(createIndex)
      .chain(query({ type: "album" }, { sort: [{ title: "DESC" }] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs[0].id, "2004"), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_query - query selector - select fields", () =>
    tearDown().chain(setup)
      .chain(query({ type: "album" }, { fields: ["id", "band"] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(keys(r.docs[0]).length, 2 + 1), r)) // +1 because _id and id are being added to result by core
      .chain(tearDown)
      .toPromise());
}
