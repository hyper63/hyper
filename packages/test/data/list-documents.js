import crocks from "crocks";
import { assoc, concat, lensProp, map, over } from "ramda";
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const docs = [
  { id: "1001", type: "movie", title: "Ghostbusters" },
  { id: "1002", type: "movie", title: "Ghostbusters 2" },
  { id: "1003", type: "movie", title: "Groundhog Day" },
  { id: "1004", type: "movie", title: "Scrooged" },
  { id: "1005", type: "movie", title: "Caddyshack" },
  { id: "1006", type: "movie", title: "Meatballs" },
  { id: "1007", type: "movie", title: "Stripes" },
  { id: "1008", type: "movie", title: "What about Bob?" },
  { id: "1009", type: "movie", title: "Life Aquatic" },
];

const getDocs = (prefix) => map(over(lensProp("id"), concat(prefix)));
export default function (data) {
  const setup = (prefix) =>
    $fetch(data.bulk(getDocs(prefix)(docs)))
      .chain(toJSON);

  const listDocuments = (flags = {}) => $fetch(data.list(flags)).chain(toJSON);

  const tearDown = (prefix) =>
    () =>
      Async.of(getDocs(prefix)(docs))
        .map(map(assoc("_deleted", true)))
        .chain((docs) => $fetch(data.bulk(docs)))
        .chain(toJSON);

  test("GET /data/test - get docs with no flags", () =>
    setup("a")
      .chain(listDocuments)
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 9), r))
      .chain(tearDown("a"))
      .toPromise());

  test("GET /data/test?keys=['1002', '1005', '1008']", () =>
    setup("b")
      .chain(() => listDocuments({ keys: ["b1002", "b1005", "b1008"] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 3), r))
      .chain(tearDown("b"))
      .toPromise());

  test("GET /data/test?startkey=1004", () =>
    setup("c")
      .chain(() => listDocuments({ startkey: "c1004" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 6), r))
      .chain(tearDown("c"))
      .toPromise());

  test("GET /data/test?endkey=1008", () =>
    setup("d")
      .chain(() => listDocuments({ endkey: "d1008" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 8), r))
      .chain(tearDown("d"))
      .toPromise());

  test("GET /data/test?startkey=1004&endkey=1008", () =>
    setup("e")
      .chain(() => listDocuments({ startkey: "e1004", endkey: "e1008" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .chain(tearDown("e"))
      .toPromise());

  test("GET /data/test?limt=2", () =>
    setup("f")
      .chain(() => listDocuments({ limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .chain(tearDown("f"))
      .toPromise());

  test("GET /data/test?descending=true", () =>
    setup("g")
      .chain(() => listDocuments({ descending: true }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs[r.docs.length - 1].id, "g1001"), r))
      .chain(tearDown("g"))
      .toPromise());
}
