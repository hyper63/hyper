// index search document tests
import { $fetch } from '../lib/utils.js';
import { assert } from 'asserts';

const test = Deno.test;
const doAssert = (prop) => (obj) => assert(obj[prop]);
//const log = (_) => (console.log(_), _);

export default function (search) {
  const cleanUp = (key) => () => $fetch(() => search.remove(key)).map(doAssert('ok'));

  test('POST /search/:store - index doc successfully', () =>
    $fetch(() => search.add('1', { id: '1', type: 'movie', title: 'Ghostbusters' }))
      .map(doAssert('ok'))
      .chain(cleanUp('1'))
      .toPromise());

  test('POST /search/:store - multiples of same key should 409', () =>
    $fetch(() => search.add('2', { id: '2', type: 'movie', title: 'Hackers' }))
      .map(doAssert('ok'))
      .chain(() =>
        $fetch(
          () => search.add('2', { id: '2', type: 'movie', title: 'Sneakers' }),
        )
      )
      //.map(log)
      .map((res) => assert(!res.ok))
      .chain(cleanUp('2'))
      .toPromise());
}
