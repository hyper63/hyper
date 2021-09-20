import crocks from "crocks";
import { assoc, compose, map } from "ramda";
import { $fetch, toJSON } from "../lib/utils.js";
import { assertEquals } from "asserts";

const { Async } = crocks;
const test = Deno.test;

const teams = [
  { id: "3001", type: "team", name: "Falcons", region: "Atlanta" },
  { id: "3002", type: "team", name: "Panthers", region: "Carolina" },
  { id: "3003", type: "team", name: "Cardinals", region: "Arizona" },
  { id: "3004", type: "team", name: "Bears", region: "Chicago" },
  { id: "3005", type: "team", name: "Eagles", region: "Philidelphia" },
  { id: "3006", type: "team", name: "Giants", region: "New York" },
];

export default function (data) {
  const loadTeams = () => $fetch(data.bulk(teams)).chain(toJSON);

  const updateTeams = () =>
    $fetch(data.bulk(map(
      compose(
        assoc("_update", true),
        assoc("active", true),
      ),
      teams,
    ))).chain(toJSON);

  const tearDown = () =>
    $fetch(data.bulk(map(assoc("_deleted", true), teams))).chain(toJSON);

  test("POST /data/:store/_bulk - insert documents", () =>
    $fetch(data.bulk(teams)).chain(toJSON)
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.results.length, 6), r))
      .chain(tearDown)
      .toPromise());

  test("POST /data/:store/_bulk - update docs", () =>
    loadTeams()
      .chain(updateTeams)
      .map((r) => (assertEquals(r.ok, true), r))
      .chain(() => $fetch(data.query({ type: "team", active: true }))).chain(
        toJSON,
      )
      .map((r) => (assertEquals(r.docs.length, 6), r))
      .chain(tearDown)
      .toPromise());
}
