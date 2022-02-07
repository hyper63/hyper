import { $fetch } from "../lib/utils.js";
import { assertEquals } from "asserts";

const test = Deno.test;

export default function (storage) {
  const upload = (name, data) => $fetch(() => storage.upload(name, data));

  const download = (name) => $fetch(() => storage.download(name));

  const cleanUp = (name) => $fetch(() => storage.remove(name));

  test("GET /storage/:bucket/:filename successfully", () =>
    upload("logo.png", Deno.readFileSync("logo.png"))
      .map((r) => assertEquals(r.ok, true))
      .chain(() => download("logo.png"))
      .map((buff) => assertEquals(buff.length, 100))
      .chain(() => cleanUp("logo.png"))
      .toPromise());
}
