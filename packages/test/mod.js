import Ask from "ask";
import { connect } from "hyper-connect";
import { prop } from "ramda";

const ask = new Ask();
const ci = Boolean(Deno.env.get("CI")) || false;
const cs = Deno.env.get("HYPER") || "http://localhost:6363/test";
console.log("hyper test suite ⚡️");
let answers = { hyper: cs };
const isCloud = /^cloud/.test(answers.hyper);

if (!ci) {
  answers = await ask.prompt([
    {
      name: "hyper",
      type: "input",
      message: `hyper (${cs}):`,
    },
  ]);
}
const hyperCS = answers.hyper === "" ? cs : answers.hyper;
const hyper = connect(hyperCS);

// get services that are active on the hyper instance
const services = prop("services", await hyper.info.services());

//const services = await hyper.info.services
const runTest = (svc) => (x) => x.default(hyper[svc]);

if (services.includes("data")) {
  if (!isCloud) {
    // create app/domain instance
    await hyper.data.destroy(true);
    await hyper.data.create();
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
  if (!isCloud) {
    await hyper.cache.destroy(true).catch(console.log);
    await hyper.cache.create();
  }
  await import("./cache/create-key.js").then(runTest("cache"));
  await import("./cache/get-key.js").then(runTest("cache"));
  await import("./cache/remove-key.js").then(runTest("cache"));
  await import("./cache/set-key.js").then(runTest("cache"));
  await import("./cache/query-keys.js").then(runTest("cache"));
}

if (services.includes("search")) {
  if (!isCloud) {
    await hyper.search.destroy(true).catch(console.log);
    await hyper.search.create(["title", "type"], ["title", "type"]);
  }

  await import("./search/index-doc.js").then(runTest("search"));
  await import("./search/get-doc.js").then(runTest("search"));
  await import("./search/query-docs.js").then(runTest("search"));
  /*
  //await import("./search/update-doc.js").then(runTest("search"))
  */
}
