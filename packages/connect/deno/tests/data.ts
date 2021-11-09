import { HyperRequest } from '../types.ts'

import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.107.0/testing/asserts.ts";
import { add, get } from '../services/data.ts'

const test = Deno.test

test('data.add', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "POST");
    
    return Promise.resolve(new Request('http://localhost', { method: 'POST', body: JSON.stringify(h.body)}))
  }
  const request = await add({ id: "game-1", type: "game" })(mockRequest);
  const body = await request.json()
  assertEquals(body.type, 'game')
})

test('data.get', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "GET");
    assertEquals(h.resource, "game-1")
    return Promise.resolve(new Request('http://localhost'))
  }
  await get("game-1")(mockRequest);
})