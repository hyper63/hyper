import Ask from "ask";
import { default as connect } from "hyper-connect";

const test = Deno.test;
const ask = new Ask();
const cs = Deno.env.get("HYPER") || "http://localhost:6363/test";
console.log("hyper test suite ⚡️");
const answers = await ask.prompt([
  {
    name: "hyper",
    type: "input",
    message: `hyper (${cs}):`,
  },
]);

const hyperCS = answers.hyper === "" ? cs : answers.hyper;
const hyper = connect(hyperCS)();

const services = ['data', 'cache', 'search', 'storage', 'queue']
//const services = await hyper.info.services
const runTest = (svc) => (x) => x.default(hyper[svc]);

if (services.includes("data")) {
  if (!hyper.info.isCloud) {
    // create app/domain instance
    await fetch(await hyper.data.destroy(true));
    await fetch(await hyper.data.create());
  }

  await import("./data/create-document.js").then(runTest("data"));
  await import("./data/retrieve-document.js").then(runTest("data"));
  await import("./data/update-document.js").then(runTest("data"));
  await import("./data/remove-document.js").then(runTest("data"));
  await import("./data/list-documents.js").then(runTest("data"));
  await import("./data/query-documents.js").then(runTest("data"));
  await import("./data/bulk-documents.js").then(runTest("data"));
}

if (services.includes("cache")) {
  if (!hyper.info.isCloud) {
    await fetch(await hyper.cache.destroy(true));
    await fetch(await hyper.cache.create());
  }
  await import("./cache/create-key.js").then(runTest("cache"));
  await import("./cache/get-key.js").then(runTest("cache"));
  await import("./cache/remove-key.js").then(runTest("cache"));
  await import("./cache/set-key.js").then(runTest("cache"));
  await import("./cache/query-keys.js").then(runTest("cache"));
}

if (services.includes("search")) {
  if (!hyper.info.isCloud) {
    await fetch(await hyper.search.destroy(true));
    await fetch(
      await hyper.search.create(["title", "type"], ["title", "type"]),
    );
  }
  await import("./search/index-doc.js").then(runTest("search"));
  await import("./search/get-doc.js").then(runTest("search"));
  //await import("./search/update-doc.js").then(runTest("search"))
  await import("./search/query-docs.js").then(runTest("search"));
}
