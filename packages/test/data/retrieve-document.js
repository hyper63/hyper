import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (data) {
  const setup = () =>
    $fetch(
      () => data.add({ _id: "42", type: "test" }),
    );

  const tearDown = () => $fetch(() => data.remove("42"));

  const retrieve = (id) => () => $fetch(() => data.get(id));

  test("GET /data/:store/:id - get document that does not exist", () =>
    $fetch(() => data.get("99"))
      .map((result) => (assertEquals(result.status, 404), result))
      .toPromise());

  test("GET /data/:store/:id - success", () =>
    setup()
      .chain(retrieve("42"))
      .map((result) => (assertEquals(result._id, "42"), result))
      .chain(tearDown)
      .toPromise());
}
