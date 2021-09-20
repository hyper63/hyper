import { $fetch, toJSON } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const add = (key, value) => $fetch(cache.add(key, value)).chain(toJSON);
  const set = (key, value) => $fetch(cache.set(key, value)).chain(toJSON);
  const remove = (key) => $fetch(cache.remove(key)).chain(toJSON);

  test("PUT /cache/:store/:key - set key", () =>
    add("test-100", { type: "movie", title: "Alien" })
      .chain(() => set("test-100", { type: "movie", title: "Alien", year: "1979" }))
      .map((r) => (assertEquals(r.ok, true), r))
      .chain(() => remove("test-100"))
      .toPromise());

  test("PUT /cache/:store/:key - set key that dont exist", () =>
    set("test-101", { type: "movie", title: "Aquaman" })
      .map((r) => (assertEquals(r.ok, true), r))
      .chain(() => remove("test-101"))
      .toPromise());
}