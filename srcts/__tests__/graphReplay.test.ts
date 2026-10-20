// Replays each sample log in inst/log-files/ and checks the graph at a few
// steps. Run with `npm test`. The counts and fingerprints were recorded from the
// current code. If a change moves them on purpose, check the viewer in a
// browser, then update them.

// Must load first: it sets the `window` that the modules below read on load
import "./setupWindow";
// Load rlog before GraphAtStep to match index.ts; they import each other
import "../rlog";

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { GraphAtStep } from "../graph/GraphAtStep";
import { initStep } from "../log/initStep";
import { mapValues } from "../utils/MapHelper";

import type { Graph } from "../graph/Graph";
import type { LogType } from "../log/logStates";

// [step, nodes, edges, unique edges, fingerprint]
type StepCounts = [number, number, number, number, string];

const expected: Record<
  string,
  {
    entries: number;
    visible: number;
    idle: number;
    outputCalc: number;
    userMark: number;
    // first, middle, and last visible step
    steps: Array<StepCounts>;
    // filtered on the first node: filtered visible steps, last filtered step
    filtered: { visible: number; last: StepCounts };
  }
> = {
  "log-crandash.js": {
    entries: 870,
    visible: 595,
    idle: 13,
    outputCalc: 42,
    userMark: 1,
    steps: [
      [5, 4, 0, 0, "bd1cbc0099a3"],
      [461, 34, 18, 51, "20bae93dedf4"],
      [869, 34, 42, 51, "da92d884a9c7"],
    ],
    filtered: { visible: 403, last: [869, 20, 22, 22, "755aa90607e0"] },
  },
  "log-cranwhales.js": {
    entries: 563,
    visible: 413,
    idle: 8,
    outputCalc: 19,
    userMark: 0,
    steps: [
      [48, 21, 0, 0, "f007434cc201"],
      [305, 27, 12, 18, "847cb7277d81"],
      [561, 27, 7, 18, "e6a31134268c"],
    ],
    filtered: { visible: 264, last: [561, 9, 5, 10, "94e83ff5f8b0"] },
  },
  "log-linear-multi.js": {
    entries: 830,
    visible: 707,
    idle: 5,
    outputCalc: 5,
    userMark: 0,
    steps: [
      [6, 3, 0, 0, "e679dbc65c6c"],
      [398, 4, 54, 3, "cae70698f328"],
      [828, 4, 11, 3, "4d833b8fdc7f"],
    ],
    filtered: { visible: 707, last: [828, 3, 11, 3, "b8c2635ca126"] },
  },
  "log-radiant.js": {
    entries: 6883,
    visible: 3686,
    idle: 40,
    outputCalc: 347,
    userMark: 0,
    steps: [
      [0, 0, 0, 0, "e3b0c44298fc"],
      [4421, 1202, 451, 493, "eab4aad787a3"],
      [6881, 1218, 29, 617, "a570269a0fa9"],
    ],
    filtered: { visible: 10, last: [5862, 2, 0, 2, "eff96dd9436a"] },
  },
  "log-superzip.js": {
    entries: 460,
    visible: 318,
    idle: 14,
    outputCalc: 25,
    userMark: 0,
    steps: [
      [31, 12, 0, 0, "165bcae050fa"],
      [241, 28, 22, 32, "17df0cd0966e"],
      [458, 28, 5, 32, "20ca22391be3"],
    ],
    filtered: { visible: 4, last: [421, 1, 0, 0, "5bdd2edaf3a3"] },
  },
};

// The bundle runs from node_modules/.cache/reactlog-test/
const logDir = path.join(__dirname, "..", "..", "..", "inst", "log-files");

// Each file is `window.log = [...];`
function readLog(file: string): LogType {
  const text = fs.readFileSync(path.join(logDir, file), "utf8");
  return initStep(
    JSON.parse(
      text.replace(/^window\.log\s*=\s*/, "").replace(/;\s*$/, "")
    ) as LogType
  );
}

// Short hash of what cytoscape would draw: each element's key, classes, and
// label. Catches wrong statuses or edges that the counts alone would miss.
function fingerprint(g: Graph): string {
  const lines = [
    ...mapValues(g.nodes).map(
      n => `node ${n.key} ${n.cytoClasses} ${n.cytoLabelShort}`
    ),
    ...mapValues(g.edges).map(e => `edge ${e.key} ${e.cytoClasses}`),
    ...mapValues(g.edgesUnique).map(e => `ghost ${e.key} ${e.cytoClasses}`),
  ].sort();
  return crypto
    .createHash("sha256")
    .update(lines.join("\n"))
    .digest("hex")
    .slice(0, 12);
}

function stepCounts(k: number, g: Graph): StepCounts {
  return [k, g.nodes.size, g.edges.size, g.edgesUnique.size, fingerprint(g)];
}

test("every sample log has expected counts", () => {
  const files = fs.readdirSync(logDir).filter(f => f.endsWith(".js"));
  assert.deepEqual(files.sort(), Object.keys(expected).sort());
});

for (const [file, want] of Object.entries(expected)) {
  test(`replays ${file}`, () => {
    const log = readLog(file);
    const graph = new GraphAtStep(log);

    assert.equal(log.length, want.entries);
    assert.equal(graph.stepsVisible.length, want.visible);
    assert.equal(graph.stepsIdle.length, want.idle);
    assert.equal(graph.stepsOutputCalc.length, want.outputCalc);
    assert.equal(graph.stepsUserMark.length, want.userMark);

    const visible = graph.stepsVisible;
    const steps = [
      visible[0],
      visible[Math.floor(visible.length / 2)],
      visible[visible.length - 1],
    ];
    const got = steps.map(k => stepCounts(k, graph.rawGraphAtStep(k)));
    assert.deepEqual(got, want.steps);

    const firstNode = mapValues(graph.finalCompleteGraph.nodes)[0];
    graph.updateFilterDatas([firstNode]);
    const filtered = graph.filteredStepsVisible;
    assert.ok(filtered.every(k => visible.includes(k)));
    const last = filtered[filtered.length - 1];
    assert.deepEqual(
      {
        visible: filtered.length,
        last: stepCounts(last, graph.filteredGraphAtStep(last)),
      },
      want.filtered
    );
  });
}
