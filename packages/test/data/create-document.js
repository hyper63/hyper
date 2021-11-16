import { $fetch } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (data) {
  const createDocument = (doc) => $fetch(() => data.add(doc));

  const cleanUp = (id) => $fetch(() => data.remove(id));

  test("POST /data/:store successfully", () =>
    createDocument({ type: "test" })
      .map((r) => (assert(r.ok), r.id))
      .chain(cleanUp)
      .toPromise());

  test("POST /data/:store with id successfully", () =>
    createDocument({ id: "10", type: "test" })
      .map((r) => (assert(r.id === "10"), r.id))
      .chain(cleanUp)
      .toPromise());

  test("POST /data/:store document conflict", () =>
    createDocument({ id: "2", type: "test" })
      .chain(() => createDocument({ id: "2", type: "test" }))
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 409), r.id))
      .chain(() => cleanUp("2"))
      .toPromise());

  test("POST /data/:store with no document", () =>
    createDocument()
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 400), r))
      //.map(r => (assertEquals(r.msg, 'empty document not allowed'), r))
      .toPromise());
}
