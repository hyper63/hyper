// index search document tests
import { $fetch } from "../lib/utils.js";
import { assert, assertEquals } from "asserts";

const docs = [{
  id: "1",
  type: "movie",
  title: "Ghostbusters",
  year: "1980",
}, {
  id: "2",
  type: "movie",
  title: "Avengers",
  year: "2011",
}];

const test = Deno.test;

export default function (search) {
  test("POST /search/:index/_bulk", () =>
    $fetch(() => search.load(docs))
      .map((r) => {
        assert(r.ok);
        assert(r.results[0].ok);
        assert(r.results[1].ok);
        assertEquals(r.results[0].id, "1");
        assertEquals(r.results[1].id, "2");
      })
      .toPromise());
}
