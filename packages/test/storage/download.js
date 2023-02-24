import { $fetch } from '../lib/utils.js';
import { assertEquals } from 'asserts';
import { has } from 'ramda';

const test = Deno.test;

export default function (storage) {
  const upload = (name, data) => $fetch(() => storage.upload(name, data));

  const download = (name) => $fetch(() => storage.download(name));

  const cleanUp = (name) => $fetch(() => storage.remove(name));

  test('GET /storage/:bucket/:filename successfully', () =>
    upload('logo.png', Deno.readFileSync('logo.png'))
      .map((r) => assertEquals(r.ok, true))
      .chain(() => download('logo.png'))
      .map((r) => {
        assertEquals(has('read', r), true);
        return r;
      })
      .map((r) => Deno.writeFileSync(`${new Date().toISOString()}.png`, r))
      .chain(() => cleanUp('logo.png'))
      .toPromise());
}
