import { $fetch } from '../lib/utils.js'
import { assertEquals } from 'asserts'

const test = Deno.test

export default function (queue) {
  const errors = () => $fetch(() => queue.errors())

  test('GET /queue/:name successfully', () =>
    errors()
      .map((r) => assertEquals(r.ok, true))
      .toPromise())
}
