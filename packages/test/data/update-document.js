import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (data) {
  const update = ({ id, doc }) => $fetch(data.update(id, doc)).chain(toJSON);

  const create = (doc) => $fetch(data.add(doc)).chain(toJSON);

  const remove = (id) => $fetch(data.remove(id)).chain(toJSON);

  /*
  test("PUT /data/:store/:id - update document should fail if db does not exist", () =>
    update({ db: "none", doc: { id: "33", type: "test" } })
      .map((result) => (assertEquals(result.status, 400), result))
      .toPromise());
  */

  test("PUT /data/:store/:id - update document should be successful", () =>
    create({ id: "63", type: "test" })
      .chain(
        () =>
          update({ id: "63", doc: { id: "63", type: "test", name: "foo" } }),
      )
      .map((result) => (assertEquals(result.ok, true), "63"))
      .chain(remove) // cleanup
      .toPromise());
}
