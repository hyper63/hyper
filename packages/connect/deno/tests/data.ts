import { HyperRequest } from "../types.ts";

import { assertEquals } from "../dev_deps.ts";

import {
  add,
  bulk,
  create,
  destroy,
  get,
  index,
  query,
  remove,
  update,
} from "../services/data.ts";

const test = Deno.test;

test("data.add", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "POST");

    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const request = await add({ id: "game-1", type: "game" })(mockRequest);
  const body = await request.json();
  assertEquals(body.type, "game");
});

test("data.get", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "GET");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await get("game-1")(mockRequest);
});

test("data.update", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "PUT");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify(h.body),
      }),
    );
  };

  const result = await update("game-1", { id: "game-1", type: "game" })(
    mockRequest,
  );
  const body = await result.json();
  assertEquals(body.type, "game");
});

test("data.remove", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "DELETE");
    assertEquals(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await remove("game-1")(mockRequest);
});

test("data.query", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "POST");
    assertEquals(h.action, "_query");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await query({ type: "game" })(mockRequest);
  const body = await result.json();
  assertEquals(body.selector.type, "game");
});

test("data.bulk", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "POST");
    assertEquals(h.action, "_bulk");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await bulk([{ id: "game-1", type: "game" }])(mockRequest);
  const body = await result.json();
  assertEquals(body[0].id, "game-1");
});

test("data.index", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "POST");
    assertEquals(h.action, "_index");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await index("foo", ["type"])(mockRequest);
  const body = await result.json();
  assertEquals(body.name, "foo");
  assertEquals(body.fields[0], "type");
});

test("data.create", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "PUT");
    return Promise.resolve(new Request("http://localhost", { method: "PUT" }));
  };

  await create()(mockRequest);
});

test("data.destroy", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "data");
    assertEquals(h.method, "DELETE");
    return Promise.resolve(
      new Request("http://localhost", { method: "DELETE" }),
    );
  };

  await destroy(true)(mockRequest);
});
