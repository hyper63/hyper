import { test } from "uvu";
import * as assert from "uvu/assert";
import { generateToken } from "../../to-node/deps.node.js";

test("generateToken", async () => {
  try {
    await generateToken("SUB", "SECRET");
    assert.ok(true);
  } catch (error) {
    assert.ok(false, error.message);
  }
});

test.run();
