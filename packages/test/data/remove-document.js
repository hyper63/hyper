import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";
import { prop } from "ramda";

const test = Deno.test;

export default function (data) {
  const createDocument = (doc) => $fetch(data.add(doc)).chain(toJSON);

  const retrieveDocument = (id) => $fetch(data.get(id)).chain(toJSON);

  const removeDocument = (id) => $fetch(data.remove(id)).chain(toJSON);

  /*
  test("DELETE /data/:store/:id - delete document when db does not exist", () =>
    $fetch(`${url}/data/none/1`, {
      method: "DELETE",
      headers,
    }).chain(toJSON)
      .map((result) => (assertEquals(result.ok, false), result))
      .map((result) => (assertEquals(result.status, 400), result))
      .toPromise());
  */

  test("DELETE /data/:store/:id - delete document successfully", () =>
    createDocument({ id: "DELETE", type: "test" })
      .chain(() => retrieveDocument("DELETE"))
      .map((r) => (assertEquals(r.id, "DELETE"), r))
      .map((r) => (assertEquals(r.type, "test"), r))
      .map(prop("id"))
      .chain(removeDocument)
      .map((r) => (assertEquals(r.ok, true), r))
      .toPromise());
}
