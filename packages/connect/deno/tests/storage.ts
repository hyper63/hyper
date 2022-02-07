import { HyperRequest } from "../types.ts";
import { assertEquals } from "../dev_deps.ts";

import { download, remove, upload } from "../services/storage.ts";

const test = Deno.test;

test("storage.upload", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "storage");
    assertEquals(h.method, "POST");
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket`, {
        method: "POST",
        //body: h.body,
      }),
    );
  };
  const req = await upload("avatar.png", new Uint8Array())(
    mockRequest,
  );
  assertEquals(req.url, "http://localhost/storage/bucket");
  //const body = await req.json()
  //assertEquals(body.get('name'), 'avatar.png')
});

test("storage.download", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "storage");
    assertEquals(h.method, "GET");
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: h.method,
        //body: new ReadableStream()
      }),
    );
  };
  const req = await download("avatar.png")(mockRequest);
  assertEquals(req.url, "http://localhost/storage/bucket/avatar.png");
});

test("storage.remove", async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, "storage");
    assertEquals(h.method, "DELETE");
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: h.method,
      }),
    );
  };
  const req = await remove("avatar.png")(mockRequest);
  assertEquals(req.url, "http://localhost/storage/bucket/avatar.png");
});
