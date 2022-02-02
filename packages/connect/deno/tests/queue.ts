import { HyperRequest } from "../types.ts";
import { assertEquals } from "../dev_deps.ts";

import { enqueue, errors, queued } from "../services/queue.ts";

const test = Deno.test;

test("queue.enqueue", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "queue");
    assertEquals(h.method, "POST");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify(h.body),
      }),
    );
  };
  const result = await enqueue({ id: "game-1", type: "game" })(
    mockRequest,
  );
  const body = await result.json();
  assertEquals(body.id, "game-1");
  assertEquals(body.type, "game");
});

test("queue.errors", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "queue");
    assertEquals(h.method, "GET");
    return Promise.resolve(
      new Request(
        "http://localhost?" + new URLSearchParams(h.params).toString(),
        {
          method: "GET",
        },
      ),
    );
  };
  const request = await errors()(mockRequest);
  assertEquals(request.url, "http://localhost/?status=ERROR");
});

test("queue.queued", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "queue");
    assertEquals(h.method, "GET");
    return Promise.resolve(
      new Request(
        "http://localhost?" + new URLSearchParams(h.params).toString(),
        {
          method: "GET",
        },
      ),
    );
  };
  const request = await queued()(mockRequest);
  assertEquals(request.url, "http://localhost/?status=READY");
});
