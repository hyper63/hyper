import { test } from "uvu";
import * as assert from "uvu/assert";
import { generateToken } from "../src/utils/hyper-request";

test("generateToken", async () => {
  try {
    await generateToken("SUB", "SECRET");
    assert.ok(true);
  } catch (error) {
    assert.ok(false, (error as Error).message);
  }
});

test.run();
