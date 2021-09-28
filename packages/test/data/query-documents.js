import crocks from "crocks";
import { assoc, concat, keys, lensProp, map, over } from "ramda";
import { $fetch, toJSON } from "../lib/utils.js";
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

const getAlbums = (prefix) => map(over(lensProp("id"), concat(prefix)));

export default function (data) {
  const setup = (prefix) =>
    $fetch(data.bulk(getAlbums(prefix)(albums)))
      .chain(toJSON);

  const query = (selector, options) =>
    () =>
      $fetch(data.query(selector, options))
        .chain(toJSON);

  const tearDown = (prefix) =>
    () =>
      Async.of(getAlbums(prefix)(albums))
        .map(map(assoc("_deleted", true)))
        .chain((docs) => $fetch(data.bulk(docs)))
        .chain(toJSON);

  const createIndex = () =>
    $fetch(data.index("idx-title", ["title"]))
      .chain(toJSON);

  test("POST /data/:store/_query - query documents of type album", () =>
    setup("a")
      .chain(query({ type: "album" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .chain(tearDown("a"))
      .toPromise());

  test("POST /data/:store/_query - query documents with no selector", () =>
    setup("b")
      .chain(query())
      .map((r) => (assertEquals(r.docs.length, 5)))
      .chain(tearDown("b"))
      .toPromise());

  test("POST /data/:store/_query - query selector with limit", () =>
    setup("c")
      .chain(query({ type: "album" }, { limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .chain(tearDown("c"))
      .toPromise());

  test("POST /data/:store/_query - query selector with sort", () =>
    setup("d")
      .chain(createIndex)
      .chain(query({ type: "album" }, { sort: [{ title: "DESC" }] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs[0].id, "d2004"), r))
      .chain(tearDown("d"))
      .toPromise());

  test("POST /data/:store/_query - query selector - select fields", () =>
    setup("e")
      .chain(query({ type: "album" }, { fields: ["id", "band"] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(keys(r.docs[0]).length, 2), r))
      .chain(tearDown("e"))
      .toPromise());
}
