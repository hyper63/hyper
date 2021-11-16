import { HyperRequest } from "../types.ts";

import { assertEquals } from "../dev_deps.ts";

import {
  add,
  create,
  destroy,
  get,
  query,
  remove,
  set,
} from "../services/cache.ts";

const test = Deno.test;

test("cache.add", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "POST");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await add("game-1", { id: "game-1", type: "game" })(
    mockRequest,
  );
  const body = await result.json();
  assertEquals(body.key, "game-1");
  assertEquals(body.value.id, "game-1");
});

test("cache.get", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "GET");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await get("game-1")(mockRequest);
});

test("cache.set", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "PUT");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await set("game-1", { id: "game-1", type: "game" })(
    mockRequest,
  );
  const body = await result.json();
  assertEquals(body.id, "game-1");
});

test("cache.remove", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "DELETE");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await remove("game-1")(mockRequest);
});

test("cache.query", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "POST");
    assertEquals(h.action, "_query");
    return Promise.resolve(new Request("http://localhost"));
  };
  await query("game*")(mockRequest);
});

test("cache.create", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "PUT");
    return Promise.resolve(new Request("http://localhost", { method: "PUT" }));
  };

  await create()(mockRequest);
});

test("cache.destroy", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "cache");
    assertEquals(h.method, "DELETE");
    return Promise.resolve(
      new Request("http://localhost", { method: "DELETE" }),
    );
  };

  await destroy(true)(mockRequest);
});
