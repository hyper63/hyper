import { $fetch } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (storage) {
  const upload = (name, data) => $fetch(() => storage.upload(name, data));

  const cleanUp = (name) => $fetch(() => storage.remove(name));

  test("POST /storage/:bucket successfully", () =>
    upload('logo.png', Deno.readFileSync('logo.png'))
      .map(r => assertEquals(r.ok, true))
      .chain(() => cleanUp('logo.png'))
  )

}
