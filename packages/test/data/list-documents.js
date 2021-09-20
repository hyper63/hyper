import crocks from "crocks";
import { assoc, map } from "ramda";
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

export default function (data) {
  const setup = () =>
    $fetch(data.bulk(docs))
      .chain(toJSON);

  const listDocuments = (flags = {}) => $fetch(data.list(flags)).chain(toJSON);

  const tearDown = () =>
    Async.of(docs)
      .map(map(assoc("_deleted", true)))
      .chain((docs) => $fetch(data.bulk(docs)))
      .chain(toJSON);

  test("GET /data/test - get docs with no flags", () =>
    setup()
      .chain(listDocuments)
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 9), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?keys=['1002', '1005', '1008']", () =>
    setup()
      .chain(() => listDocuments({ keys: ["1002", "1005", "1008"] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 3), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?startkey=1004", () =>
    setup()
      .chain(() => listDocuments({ startkey: "1004" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 6), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?endkey=1008", () =>
    setup()
      .chain(() => listDocuments({ endkey: "1008" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 8), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?startkey=1004&endkey=1008", () =>
    setup()
      .chain(() => listDocuments({ startkey: "1004", endkey: "1008" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?limt=2", () =>
    setup()
      .chain(() => listDocuments({ limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .chain(tearDown)
      .toPromise());

  test("GET /data/test?descending=true", () =>
    setup()
      .chain(() => listDocuments({ descending: true }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs[r.docs.length - 1].id, "1001"), r))
      .chain(tearDown)
      .toPromise());
}
