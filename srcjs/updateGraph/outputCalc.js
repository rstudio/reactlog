// @flow

import _sortedIndexOf from "lodash/sortedIndexOf";
import _sortedIndex from "lodash/sortedIndex";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";
import type { LogType } from "../log/logStates";

let nextStepInArr = function(
  arr: Array<number>,
  cytoOptions?: CytoscapeOptions = {}
) {
  let nextTick;
  if (_sortedIndexOf(arr, rlog.curTick) !== -1) {
    // at arr point, move the tick one ahead
    nextTick = rlog.getGraph.nextStep(rlog.curTick);
  } else {
    // not at arr point,
    nextTick = rlog.curTick;
  }

  // get next tick idx
  let nextTickIdx = _sortedIndex(arr, nextTick);

  let i, arrStep;
  for (i = nextTickIdx; i < arr.length; i++) {
    arrStep = arr[i];
    if (_sortedIndexOf(rlog.getGraph.filteredStepsVisible, arrStep) >= 0) {
      updateGraph(arrStep, cytoOptions);
      return true;
    }
  }
  return false;
};

let prevStepInArr = function(
  arr: Array<number>,
  cytoOptions?: CytoscapeOptions = {}
) {
  let prevTick;
  if (_sortedIndexOf(arr, rlog.curTick) !== -1) {
    // at arr point, move the tick one back
    prevTick = rlog.getGraph.prevStep(rlog.curTick);
  } else {
    // not at arr point,
    prevTick = rlog.curTick;
  }

  // get next tick idx
  let prevTickIdx = _sortedIndex(arr, prevTick) - 1;
  if (prevTickIdx < 0) return false;

  let i, arrStep;
  for (i = prevTickIdx; i >= 0; i--) {
    arrStep = arr[i];
    if (_sortedIndexOf(rlog.getGraph.filteredStepsVisible, arrStep) >= 0) {
      updateGraph(arrStep, cytoOptions);
      return true;
    }
  }
  return false;
};

let nextOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  return nextStepInArr(rlog.getGraph.stepsOutputCalc, cytoOptions);
};

let prevOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  return prevStepInArr(rlog.getGraph.stepsOutputCalc, cytoOptions);
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

export {
  nextOutputCalc,
  prevOutputCalc,
  firstOutputCalc,
  lastOutputCalc,
  nextStepInArr,
  prevStepInArr,
};
