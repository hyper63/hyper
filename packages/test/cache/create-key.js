import { $fetch } from '../lib/utils.js';
import { assert, assertEquals } from 'asserts';

const test = Deno.test;

export default function (cache) {
  const createKV = (key, value, ttl) => $fetch(() => cache.add(key, value, ttl));

  const cleanUp = (key) => $fetch(() => cache.remove(key));

  test('POST /cache/:store successfully', () =>
    createKV('test-1', { type: 'movie', title: 'Ghostbusters' })
      .map((r) => (assert(r.ok), r))
      .chain(() => cleanUp('test-1'))
      .toPromise());

  test('POST /cache/:store document conflict', () =>
    createKV('test-2', { type: 'movie', title: 'Caddyshack' })
      .chain(() => createKV('test-2', { type: 'movie', title: 'Caddyshack 2' }))
      .map((r) => (assertEquals(r.ok, false), r))
      .map((r) => (assertEquals(r.status, 409), r.id))
      .chain(() => cleanUp('test-2'))
      .toPromise());

  /*
  test("POST /cache/:store with ttl", () =>
    createKV("10", { type: 'movie', title: 'Avengers' }, '10s')
      //.chain($.fromPromise(new Promise(r => setTimeout(r, 15000))))
      //.chain(() => $fetch(cache.get("10")))
      .map(v => (assertEquals(true, true), v))
      .map(v => (console.log(v), v))
      .toPromise())
  */
}
