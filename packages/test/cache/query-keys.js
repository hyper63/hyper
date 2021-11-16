import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (cache) {
  const add = (key, value) => $fetch(() => cache.add(key, value));
  //const set = (key, value) => $fetch(cache.set(key, value)).chain(toJSON);
  const remove = (key) => $fetch(() => cache.remove(key));
  const query = (pattern) => $fetch(() => cache.query(pattern));

  test("POST /cache/:store/_query? - list all", () =>
    // setup
    add("movie-1", { title: "Superman" })
      .chain(() => add("movie-2", { title: "Batman" }))
      .chain(() => add("movie-3", { title: "Spiderman" }))
      .chain(() => add("album-1", { title: "The Doors" }))
      // test
      .chain(() => query())
      //.map((r) => (console.log(r), r))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 4), r))
      // clean up
      .chain(() => remove("movie-1"))
      .chain(() => remove("movie-2"))
      .chain(() => remove("movie-3"))
      .chain(() => remove("album-1"))
      .toPromise());

  test("POST /cache/:store/_query?pattern=movie* - list movies", () =>
    // setup
    add("movie-1", { title: "Superman" })
      .chain(() => add("movie-2", { title: "Batman" }))
      .chain(() => add("movie-3", { title: "Spiderman" }))
      .chain(() => add("album-1", { title: "The Doors" }))
      // test
      .chain(() => query("movie-*"))
      //.map(r => (console.log(r), r))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 3), r))
      // clean up
      .chain(() => remove("movie-1"))
      .chain(() => remove("movie-2"))
      .chain(() => remove("movie-3"))
      .chain(() => remove("album-1"))
      .toPromise());

  test("POST /cache/:store/_query?pattern=*-movie - keys ends with movies", () =>
    // setup
    add("x1-movie", { title: "Superman" })
      .chain(() => add("x2-movie", { title: "Batman" }))
      .chain(() => add("x3-movie", { title: "Spiderman" }))
      .chain(() => add("x1-album", { title: "The Doors" }))
      // test
      .chain(() => query("*-movie"))
      //.map(r => (console.log(r), r))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 3), r))
      // clean up
      .chain(() => remove("x1-movie"))
      .chain(() => remove("x2-movie"))
      .chain(() => remove("x3-movie"))
      .chain(() => remove("x1-album"))
      .toPromise());
}
