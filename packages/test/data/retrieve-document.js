import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (data) {
  const setup = () =>
    $fetch(
      data.add({ id: "42", type: "test" }),
    ).chain(toJSON);

  const tearDown = () => $fetch(data.remove("42")).chain(toJSON);

  const retrieve = (id) => () => $fetch(data.get(id)).chain(toJSON);

  test("GET /data/:store/:id - get document that does not exist", () =>
    $fetch(data.get("99"))
      .chain(toJSON)
      .map((result) => (assertEquals(result.status, 404), result))
      .toPromise());

  test("GET /data/:store/:id - success", () =>
    setup()
      .chain(retrieve("42"))
      .map((result) => (assertEquals(result.id, "42"), result))
      .chain(tearDown)
      .toPromise());
}
