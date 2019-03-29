// @flow

import cytoscape from "cytoscape"; // flowlint-line untyped-import:off

import _isNil from "lodash/isNil";

import { Graph } from "./graph/Graph";
import { GraphAtStep } from "./graph/GraphAtStep";
import * as updateGraph from "./updateGraph";

import type { CytoscapeType } from "./cyto/cytoFlowType";
import type { LogType } from "./log/logStates";

let ret = {
  log: ([]: LogType),
  cyto: (cytoscape(): CytoscapeType),
  getGraph: new GraphAtStep([]),
  graph: new Graph([]),
  curTick: (1: number),
  updateGraph: updateGraph,
  barret: (null: any),
  displayTimeOnNodes:
    // is not `false`
    window.__APP_TIME__ === true || _isNil(window.__APP_TIME__),
};

// class RLog {
//
//   log: ([]: LogType);
//   cyto: (cytoscape(): CytoscapeType);
//   getGraph: new GraphAtStep([]);
//   graph: new Graph([]);
//   curTick: (1: number);
//   updateGraph: updateGraph;
//
//   constructor: () {
//
//   }
// }
export { ret as rlog,
   // RLog
 };
