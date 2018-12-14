// @flow

import _sortedIndexOf from "lodash/sortedIndexOf";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
import { hasLength } from "../graph/GraphAtStep";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick;
  if (_sortedIndexOf(rlog.getGraph.stepsOutputCalc, rlog.curTick) !== -1) {
    // not at a cycle point
    if (hasLength(rlog.getGraph.filterDatas)) {
      // if filtered, will go to previous step, then next step location
      nextTick = rlog.getGraph.nextStep(rlog.getGraph.prevStep(rlog.curTick));
    } else {
      // if not filtered
      nextTick = rlog.curTick;
    }
  } else {
    // at cycle point
    // first move one step forward... then find next enter/exit empty
    nextTick = rlog.getGraph.nextStep(rlog.curTick);
  }
  let val, i;
  // move to queue empty
  for (i = 0; i < rlog.getGraph.stepsOutputCalc.length; i++) {
    val = rlog.getGraph.stepsOutputCalc[i];
    if (nextTick < val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};

let prevOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  let prevTick;
  if (_sortedIndexOf(rlog.getGraph.stepsOutputCalc, rlog.curTick) !== -1) {
    // not at a cycle point
    if (hasLength(rlog.getGraph.filterDatas)) {
      // if filtered, will go to next step, then prev step location
      prevTick = rlog.getGraph.prevStep(rlog.getGraph.nextStep(rlog.curTick));
    } else {
      // if not filtered
      prevTick = rlog.curTick;
    }
  } else {
    // at cycle point
    // first move one step backward... then find prev enter/exit empty
    prevTick = rlog.getGraph.prevStep(rlog.curTick);
  }
  let val, i;
  // move to queue empty
  for (i = rlog.getGraph.stepsOutputCalc.length - 1; i >= 0; i--) {
    val = rlog.getGraph.stepsOutputCalc[i];
    if (prevTick > val) {
      return updateGraph(val, cytoOptions);
    }
  }
  return false;
};

let lastOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick =
    rlog.getGraph.stepsOutputCalc[rlog.getGraph.stepsOutputCalc.length - 1] ||
    0;
  return updateGraph(nextTick, cytoOptions);
};
let firstOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick = rlog.getGraph.stepsOutputCalc[0] || 0;
  return updateGraph(nextTick, cytoOptions);
};

export { nextOutputCalc, prevOutputCalc, firstOutputCalc, lastOutputCalc };
