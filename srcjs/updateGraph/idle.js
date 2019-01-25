// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType.js";

let nextIdle = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  let i, val;
  // traverse to the next valid step,
  //   skipping the very close queue empties (which would be skipped on next step)
  let nextTick = rlog.getGraph.nextStep(rlog.curTick);
  // move to queue empty
  for (i = 0; i < rlog.getGraph.stepsIdle.length; i++) {
    val = rlog.getGraph.stepsIdle[i];
    if (nextTick < val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};
let prevIdle = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  let i, val;
  // traverse to the previous valid step,
  //   skipping the very close queue empties (which would be skipped on prev step)
  let prevTick = rlog.getGraph.prevStep(rlog.curTick);
  // move to queue empty
  for (i = rlog.getGraph.stepsIdle.length - 1; i >= 0; i--) {
    val = rlog.getGraph.stepsIdle[i];
    if (prevTick > val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};

let lastIdle = function() {
  let nextTick =
    rlog.getGraph.stepsIdle.length > 0
      ? rlog.getGraph.stepsIdle[rlog.getGraph.stepsIdle.length - 1]
      : 0;
  return updateGraph(nextTick);
};
let firstIdle = function() {
  let nextTick =
    rlog.getGraph.stepsIdle.length > 0 ? rlog.getGraph.stepsIdle[0] : 0;
  return updateGraph(nextTick);
};

export { nextIdle, prevIdle, lastIdle, firstIdle };
