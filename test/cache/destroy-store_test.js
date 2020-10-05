const test = require("tape");
const testServer = require("@twilson63/test-server");
const app = require("../../src");
const fetch = require("node-fetch");

test("delete cache store", async (t) => {
  const server = testServer(app);
  const result = await (
    await fetch(server.url + "/micro/cache/foo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();
  t.ok(result.ok);
  server.close();
});
