import { $fetch, toJSON } from '../lib/utils.js';
import { assert } from 'asserts';

const test = Deno.test;
const doAssert = (prop) => (obj) => {
  assert(obj[prop]);
  return obj;
};

export default function (search) {
  // const setup = () =>
  //   $fetch(
  //     search.add("movie-3", { id: "movie-3", type: "movie", title: "Hulk" }),
  //   )
  //     .chain(toJSON);

  // const badIndex = async () => {
  //   const r = await search.update("movie-5", {
  //     id: "movie-5",
  //     type: "movie",
  //     title: "Captain Carter",
  //   });
  //   return Promise.resolve(
  //     new Request(
  //       r.url.replace("test", "none"),
  //       {
  //         method: "PUT",
  //         headers: r.headers,
  //         body: await r.json(),
  //       },
  //     ),
  //   );
  // };

  //const cleanUp = (key) => () => $fetch(search.remove(key)).chain(toJSON);
  /*
  test('PUT /search/:index/:key - update search document successfully', () =>
    setup()
      .chain(() => $fetch(search.update('movie-3', { id: 'movie-3', type: 'movie', title: 'Avengers' })))
      .chain(toJSON)
      .map(doAssert('ok'))
      .chain(cleanUp('movie-3'))
      .toPromise()
  )
  */

  test('PUT /search/:index/:key - upsert document successfully', () =>
    $fetch(
      search.update('movie-4', {
        id: 'movie-4',
        type: 'movie',
        title: 'Batman',
      }),
    )
      .chain(toJSON)
      .map(doAssert('ok'))
      //.chain(cleanUp('movie-4'))
      .toPromise());

  /*
    test('PUT /search/:index/:key - index does not exist', () =>
      $fetch(badIndex())
        .chain(toJSON)
        .map(v => assertEquals(v.ok, false))
        .toPromise()
    )
    */
}
