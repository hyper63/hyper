import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (data) {
  const createDocument = (doc) => $fetch(data.add(doc)).chain(toJSON);

  const cleanUp = (id) => $fetch(data.remove(id)).chain(toJSON);

  const createDocForDb = async (doc) => {
    let req = await data.add(doc);
    let _req = new Request(req.url + "db", {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(doc),
    });
    return $fetch(Promise.resolve(_req)).chain(toJSON);
  };

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

  // return error if store does not exist

  test("POST /data/:store error if store does not exist", async () =>
    (await createDocForDb("none", { id: "30", type: "test" }))
      .map((r) => {
        assertEquals(r.ok, false);
        assertEquals(r.status, 500);
        return r;
      })
      .toPromise());

  test("POST /data/:store with no document", () =>
    createDocument()
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 400), r))
      //.map(r => (assertEquals(r.msg, 'empty document not allowed'), r))
      .toPromise());
}
