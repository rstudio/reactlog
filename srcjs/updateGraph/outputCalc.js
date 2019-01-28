// @flow

import _sortedIndexOf from "lodash/sortedIndexOf";
import _sortedIndex from "lodash/sortedIndex";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextStepInArr = function(arr, cytoOptions?: CytoscapeOptions = {}) {
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

let prevStepInArr = function(arr, cytoOptions?: CytoscapeOptions = {}) {
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
  //
  // if (hasLength(rlog.getGraph.filterDatas)) {
  //   // is filtered
  //
  //   let i, step, graph, decendentIds, logItem;
  //
  //   // for every output finished calculating step
  //   for (i = nextTickIdx; i < rlog.getGraph.stepsOutputCalc.length; i++) {
  //     step = rlog.getGraph.stepsOutputCalc[i];
  //     logItem = (rlog.log[step]: LogEntryExitType);
  //     // get the graph at the location (using the internal filtered data values)
  //     graph = rlog.getGraph.graphAtStep(step);
  //     // get that graph's decendents of the filtered data
  //     decendentIds = graph.decendentNodeIdsForDatas(rlog.getGraph.filterDatas);
  //     // if any of those decendents were the output that finished calculating, update the graph
  //     if (_indexOf(decendentIds, logItem.reactId) >= 0) {
  //       updateGraph(step, cytoOptions);
  //       return true;
  //     }
  //   }
  // } else {
  //   // no filter
  //
  //   // if in a "normal" position....
  //   if (
  //     nextTickIdx < rlog.getGraph.stepsOutputCalc.length &&
  //     nextTickIdx >= 0
  //   ) {
  //     updateGraph(rlog.getGraph.stepsOutputCalc[nextTickIdx], cytoOptions);
  //     return true;
  //   }
  // }
  //
  // return false;
};

let prevOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  return prevStepInArr(rlog.getGraph.stepsOutputCalc, cytoOptions);
  // let prevTick = rlog.curTick;
  // while (
  //   // if on an outputCalc point
  //   _sortedIndexOf(rlog.getGraph.stepsOutputCalc, prevTick) !== -1 ||
  //   // if on a idle time point,
  //   _sortedIndexOf(rlog.getGraph.stepsIdle, prevTick) !== -1
  // ) {
  //   // at cycle point, move the tick one ahead
  //   prevTick = rlog.getGraph.prevStep(prevTick);
  // }
  //
  // // get outputCalc position from stepsOutputCalc array
  // // subtract 1 to move it to the "previous" outputCalc step
  // let prevTickIdx = _sortedIndex(rlog.getGraph.stepsOutputCalc, prevTick) - 1;
  //
  // if (hasLength(rlog.getGraph.filterDatas)) {
  //   // is filtered
  //
  //   let i, step, graph, decendentIds, logItem;
  //   // TODO!!
  //   // for every output finished calculating step
  //   for (i = prevTickIdx; i >= 0; i--) {
  //     step = rlog.getGraph.stepsOutputCalc[i];
  //     logItem = (rlog.log[step]: LogEntryExitType);
  //     // get the graph at the location (using the internal filtered data values)
  //     graph = rlog.getGraph.graphAtStep(step);
  //     // get that graph's decendents of the filtered data
  //     decendentIds = graph.decendentNodeIdsForDatas(rlog.getGraph.filterDatas);
  //     // if any of those decendents were the output that finished calculating, update the graph
  //     if (_indexOf(decendentIds, logItem.reactId) >= 0) {
  //       updateGraph(step, cytoOptions);
  //       return true;
  //     }
  //   }
  // } else {
  //   // no filter
  //
  //   // if in a "normal" position....
  //   if (
  //     prevTickIdx < rlog.getGraph.stepsOutputCalc.length &&
  //     prevTickIdx >= 0
  //   ) {
  //     updateGraph(rlog.getGraph.stepsOutputCalc[prevTickIdx], cytoOptions);
  //     return true;
  //   }
  // }
  //
  // return false;
  //
  //
  //
  // return null;
  //
  //
  // let prevTick;
  // if (_sortedIndexOf(rlog.getGraph.stepsOutputCalc, rlog.curTick) !== -1) {
  //   // not at a cycle point
  //   if (hasLength(rlog.getGraph.filterDatas)) {
  //     // if filtered, will go to next step, then prev step location
  //     prevTick = rlog.getGraph.prevStep(rlog.getGraph.nextStep(rlog.curTick));
  //   } else {
  //     // if not filtered
  //     prevTick = rlog.curTick;
  //   }
  // } else {
  //   // at cycle point
  //   // first move one step backward... then find prev enter/exit empty
  //   prevTick = rlog.getGraph.prevStep(rlog.curTick);
  // }
  // let val, i;
  // // move to queue empty
  // for (i = rlog.getGraph.stepsOutputCalc.length - 1; i >= 0; i--) {
  //   val = rlog.getGraph.stepsOutputCalc[i];
  //   if (prevTick > val) {
  //     return updateGraph(val, cytoOptions);
  //   }
  // }
  // return false;
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
