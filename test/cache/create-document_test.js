const test = require("tape");
const testServer = require("@twilson63/test-server");
const app = require("../../src");
const fetch = require("node-fetch");

test("create cache document", async (t) => {
  t.plan(1);
  const server = testServer(app);
  const result = await (
    await fetch(server.url + "/micro/cache/foo?ttl=1m", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "1",
        doc: {
          type: "person",
          name: "Johnny Paper",
          email: "johnny@paper.com",
        },
      }),
    })
  ).json();
  t.ok(result.ok);
  server.close();
});
