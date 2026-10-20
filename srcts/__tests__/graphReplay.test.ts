/// <reference types="node" />

// Replays each sample log in inst/log-files/ and checks the graph at a few
// steps. Run with `npm test`. The counts were recorded from the current code.
// If a change moves them on purpose, check the viewer in a browser, then update
// them.

// Must load first: it sets the `window` that the modules below read on load
import "./setupWindow";
// Load rlog before GraphAtStep to match index.ts; they import each other
import "../rlog";

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { GraphAtStep } from "../graph/GraphAtStep";

import type { LogType } from "../log/logStates";

// [step, nodes, edges, unique edges]
type StepCounts = [number, number, number, number];

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
  }
> = {
  "log-crandash.js": {
    entries: 870,
    visible: 595,
    idle: 13,
    outputCalc: 42,
    userMark: 1,
    steps: [
      [5, 4, 0, 0],
      [461, 34, 18, 51],
      [869, 34, 42, 51],
    ],
  },
  "log-cranwhales.js": {
    entries: 563,
    visible: 413,
    idle: 8,
    outputCalc: 19,
    userMark: 0,
    steps: [
      [48, 21, 0, 0],
      [305, 27, 12, 18],
      [561, 27, 7, 18],
    ],
  },
  "log-linear-multi.js": {
    entries: 830,
    visible: 707,
    idle: 5,
    outputCalc: 5,
    userMark: 0,
    steps: [
      [6, 3, 0, 0],
      [398, 4, 54, 3],
      [828, 4, 11, 3],
    ],
  },
  "log-radiant.js": {
    entries: 6883,
    visible: 3686,
    idle: 40,
    outputCalc: 347,
    userMark: 0,
    steps: [
      [0, 0, 0, 0],
      [4421, 1202, 451, 493],
      [6881, 1218, 29, 617],
    ],
  },
  "log-superzip.js": {
    entries: 460,
    visible: 318,
    idle: 14,
    outputCalc: 25,
    userMark: 0,
    steps: [
      [31, 12, 0, 0],
      [241, 28, 22, 32],
      [458, 28, 5, 32],
    ],
  },
};

const logDir = path.join("inst", "log-files");

// Each file is `window.log = [...];`
function readLog(file: string): LogType {
  const text = fs.readFileSync(path.join(logDir, file), "utf8");
  const log = JSON.parse(
    text.replace(/^window\.log\s*=\s*/, "").replace(/;\s*$/, "")
  ) as LogType;
  // same as log/initStep.ts
  log.forEach((entry, i) => {
    entry.step = i;
  });
  return log;
}

test("every sample log has expected counts", () => {
  assert.deepEqual(fs.readdirSync(logDir).sort(), Object.keys(expected).sort());
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
    const got = steps.map((k): StepCounts => {
      const g = graph.rawGraphAtStep(k);
      return [k, g.nodes.size, g.edges.size, g.edgesUnique.size];
    });
    assert.deepEqual(got, want.steps);
  });
}
