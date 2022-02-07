import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (queue) {
  const enqueue = (text) => $fetch(() => queue.enqueue({ type: "job", text }));

  test("POST /queue/:name successfully", () =>
    enqueue("Hello World")
      .map(r => assertEquals(r.ok, true))
      .toPromise()
  );
}
