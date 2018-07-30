// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType.js";

let nextQueueEmpty = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  let i, val;
  // traverse to the next valid step,
  //   skipping the very close queue empties (which would be skipped on next step)
  let nextTick = rlog.getGraph.nextStep(rlog.curTick);
  // move to queue empty
  for (i = 0; i < rlog.getGraph.enterExitEmpties.length; i++) {
    val = rlog.getGraph.queueEmpties[i];
    if (nextTick < val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};
let prevQueueEmpty = function(cytoOptions?: CytoscapeOptions = {}): boolean {
  let i, val;
  // traverse to the previous valid step,
  //   skipping the very close queue empties (which would be skipped on prev step)
  let prevTick = rlog.getGraph.prevStep(rlog.curTick);
  // move to queue empty
  for (i = rlog.getGraph.queueEmpties.length - 1; i >= 0; i--) {
    val = rlog.getGraph.queueEmpties[i];
    if (prevTick > val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};

let lastQueueEmpty = function() {
  let nextTick =
    rlog.getGraph.queueEmpties[rlog.getGraph.queueEmpties.length - 1] || 0;
  return updateGraph(nextTick);
};
let firstQueueEmpty = function() {
  let nextTick = rlog.getGraph.queueEmpties[0] || 0;
  return updateGraph(nextTick);
};

export { nextQueueEmpty, prevQueueEmpty, lastQueueEmpty, firstQueueEmpty };
