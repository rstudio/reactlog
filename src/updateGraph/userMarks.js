// @flow

import _sortedIndexOf from "lodash/sortedIndexOf";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
import { hasLength } from "../graph/GraphAtStep";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextUserMark = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick;
  if (_sortedIndexOf(rlog.getGraph.marks, rlog.curTick) !== -1) {
    // not at a user mark
    if (hasLength(rlog.getGraph.filterDatas)) {
      // if filtered, will go to previous step, then next step location
      nextTick = rlog.getGraph.nextStep(rlog.getGraph.prevStep(rlog.curTick));
    } else {
      // if not filtered
      nextTick = rlog.curTick;
    }
  } else {
    // at user mark
    // first move one step forward... then find next user mark
    nextTick = rlog.getGraph.nextStep(rlog.curTick);
  }
  let val, i;
  // move to user mark
  for (i = 0; i < rlog.getGraph.marks.length; i++) {
    val = rlog.getGraph.marks[i];
    if (nextTick < val) {
      updateGraph(val, cytoOptions);
      return true;
    }
  }
  return false;
};

let prevUserMark = function(cytoOptions?: CytoscapeOptions = {}) {
  let prevTick;
  if (_sortedIndexOf(rlog.getGraph.marks, rlog.curTick) !== -1) {
    // not at a marked point
    if (hasLength(rlog.getGraph.filterDatas)) {
      // if filtered, will go to next step, then prev step location
      prevTick = rlog.getGraph.prevStep(rlog.getGraph.nextStep(rlog.curTick));
    } else {
      // if not filtered
      prevTick = rlog.curTick;
    }
  } else {
    // at marked point
    // first move one step backward... then find prev user mark
    prevTick = rlog.getGraph.prevStep(rlog.curTick);
  }
  let val, i;
  // move to user mark
  for (i = rlog.getGraph.marks.length - 1; i >= 0; i--) {
    val = rlog.getGraph.marks[i];
    if (prevTick > val) {
      return updateGraph(val, cytoOptions);
    }
  }
  return false;
};

let lastUserMark = function(cytoOptions?: CytoscapeOptions = {}) {
  if (rlog.getGraph.marks.length === 0) return false;
  return updateGraph(
    rlog.getGraph.marks[rlog.getGraph.marks.length - 1],
    cytoOptions
  );
};
let firstUserMark = function(cytoOptions?: CytoscapeOptions = {}) {
  if (rlog.getGraph.marks.length === 0) return false;
  return updateGraph(rlog.getGraph.marks[0], cytoOptions);
};

export { nextUserMark, prevUserMark, firstUserMark, lastUserMark };
