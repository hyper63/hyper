import initAdapters from "./plugins.js";
import validate from "./plugin-schema.js";
import { assertEquals, assertObjectMatch } from "../dev_deps.js";

const test = Deno.test;

test("sucessfully compose plugins", async () => {
  const plugin1 = validate({
    id: "plugin1",
    port: "default",
    load: (env) => Promise.resolve({ ...env, hello: "world" }),
    link: (env) => () => ({ hello: () => env.hello }),
  });

  const plugin2 = (config) =>
    validate({
      id: "plugin2",
      port: "default",
      load: (env) => Promise.resolve({ ...env, ...config }),
      link: (env) => (plugin) => ({ ...plugin, beep: () => env }),
    });

  const config = {
    adapters: [
      { port: "default", plugins: [plugin2({ foo: "bar" }), plugin1] },
    ],
  };
  const adapters = await initAdapters(config.adapters);

  assertEquals(adapters.default.hello(), "world");
  assertObjectMatch(adapters.default.beep(), { foo: "bar", hello: "world" });
});
