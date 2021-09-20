import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const add = (key, value) => $fetch(cache.add(key, value)).chain(toJSON);
  //const get = (key) => $fetch(cache.get(key)).chain(toJSON);
  const remove = (key) => $fetch(cache.remove(key)).chain(toJSON);

  test("DELETE /cache/:store/:key - remove key", () =>
    add("test-40", { type: "movie", title: "Batman" })
      .chain(() => remove("test-40"))
      .map((r) => (assertEquals(r.ok, true), r))
      .toPromise());
}
