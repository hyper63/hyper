import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (queue) {
  const queued = () => $fetch(() => queue.queued());

  test("GET /queue/:name successfully", () =>
    queued()
      .map((r) => assertEquals(r.ok, true)));
}
