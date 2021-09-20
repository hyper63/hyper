import { $, $fetch, toJSON } from "../lib/utils.js";
import { assert } from "asserts";

const test = Deno.test;
const doAssert = (prop) =>
  (obj) => {
    assert(obj[prop]);
    return obj;
  };

// const log = (_) => (console.log(_), _);
const map = (fn, items) => items.map(fn);
const compose = (f, g) => (v) => f(g(v));
const prop = (key) => (obj) => obj[key];

const movies = [{
  id: "movie-1",
  type: "movie",
  title: "Dune",
}, {
  id: "movie-2",
  type: "movie",
  title: "Alien",
}, {
  id: "movie-3",
  type: "movie",
  title: "Avatar",
}, {
  id: "movie-4",
  type: "movie",
  title: "Star Wars",
}, {
  id: "movie-5",
  type: "movie",
  title: "Jaws",
}, {
  id: "movie-6",
  type: "movie",
  title: "Ironman",
}, {
  id: "movie-7",
  type: "movie",
  title: "Batman",
}];

export default function (search) {
  // add 5 searchable docs
  const setup = () =>
    $fetch(search.load(movies))
      .chain(toJSON);

  const cleanUp = () =>
    $.all(map(
      compose(
        (id) => $fetch(search.remove(id)).chain(toJSON),
        prop("id"),
      ),
      movies,
    ));

  // search based on content
  test("POST /search/:index/_query - find movie successfully using fields and filter", () =>
    setup()
      .chain(() =>
        $fetch(
          search.query("Ironman", {
            fields: ["title"],
            filter: { type: "movie" },
          }),
        )
      )
      .chain(toJSON)
      //.map(log)
      .map(doAssert("ok"))
      .chain(cleanUp)
      .toPromise());

  test("POST /search/:index/_query - find movie successfully filter", () =>
    setup()
      .chain(() =>
        $fetch(search.query("Spiderman", { filter: { type: "movie" } }))
      )
      .chain(toJSON)
      //.map(log)
      .map(doAssert("ok"))
      .chain(cleanUp)
      .toPromise());

  test("POST /search/:index/_query - find movie successfully", () =>
    setup()
      .chain(() => $fetch(search.query("Jaws")))
      .chain(toJSON)
      //.map(log)
      .map(doAssert("ok"))
      .chain(cleanUp)
      .toPromise());
}
