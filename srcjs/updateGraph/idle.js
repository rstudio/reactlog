// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
import { nextStepInArr, prevStepInArr } from "./outputCalc";

import type { CytoscapeOptions } from "../cyto/cytoFlowType.js";

let nextIdle = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  return nextStepInArr(rlog.getGraph.stepsIdle, cytoOptions);
};
let prevIdle = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  return prevStepInArr(rlog.getGraph.stepsIdle, cytoOptions);
};

let lastIdle = function() {
  let nextTick =
    rlog.getGraph.stepsIdle.length > 0
      ? rlog.getGraph.stepsIdle[rlog.getGraph.stepsIdle.length - 1]
      : rlog.log.length - 1;
  return updateGraph(nextTick);
};
let firstIdle = function() {
  let nextTick =
    rlog.getGraph.stepsIdle.length > 0 ? rlog.getGraph.stepsIdle[0] : 0;
  return updateGraph(nextTick);
};

export { nextIdle, prevIdle, lastIdle, firstIdle };
