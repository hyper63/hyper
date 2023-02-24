// index search document tests
import { $fetch } from '../lib/utils.js';
import { assert, assertEquals } from 'asserts';

const test = Deno.test;
const doAssert = (prop) => (obj) => {
  assert(obj[prop]);
  return obj;
};

const doEquals = (prop, value) => (obj) => {
  assertEquals(obj[prop], value);
  return obj;
};

const doError = (code) => (res) => {
  assert(!res.ok);
  assertEquals(res.status, code);
  return res;
};

//const log = (_) => (console.log(_), _);

export default function (search) {
  const setup = () =>
    $fetch(() =>
      search.add('movie-1', {
        id: 'movie-1',
        type: 'movie',
        title: 'Red Dawn',
      })
    );
  const cleanUp = (key) => () => $fetch(() => search.remove(key)).map(doAssert('ok'));

  test('GET /search/:store/:id - get search doc', () =>
    setup()
      .chain(() => $fetch(() => search.get('movie-1')))
      //.map(log)
      .map(doAssert('ok'))
      .map(doEquals('key', 'movie-1'))
      .chain(cleanUp('movie-1'))
      .toPromise());

  test('GET /search/:store/:id - get search doc not found', () =>
    $fetch(() => search.get('movie-2'))
      .map(doError(404))
      .toPromise());
}
