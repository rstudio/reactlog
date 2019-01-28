// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
// import { hasLength } from "../graph/GraphAtStep";

// import { LogStates } from "../log/logStates";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextStep = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick = rlog.curTick;

  // if (hasLength(rlog.getGraph.filterDatas)) {
  //   let maybeNextTick = rlog.getGraph.nextStep(
  //     rlog.getGraph.prevStep(nextTick)
  //   );
  //   if (nextTick !== maybeNextTick && maybeNextTick !== -1) {
  //     nextTick = maybeNextTick;
  //   }
  // }

  // // if currently at an idle step, do not go to another idle step
  // if (rlog.log[rlog.curTick].action === LogStates.idle) {
  //   // currently at an idle step
  //   do {
  //     nextTick = rlog.getGraph.nextStep(nextTick);
  //   } while (rlog.log[nextTick].action === LogStates.idle);
  // } else {
  // }
  nextTick = rlog.getGraph.nextStep(nextTick);

  if (nextTick === -1) return false;

  return updateGraph(nextTick, cytoOptions);
};

let prevStep = function(cytoOptions?: CytoscapeOptions = {}) {
  let prevTick = rlog.getGraph.prevStep(rlog.curTick);

  // if (hasLength(rlog.getGraph.filterDatas)) {
  //   let maybePrevTick = rlog.getGraph.prevStep(
  //     rlog.getGraph.nextStep(prevTick)
  //   );
  //   if (prevTick !== maybePrevTick && maybePrevTick !== -1) {
  //     prevTick = maybePrevTick;
  //   }
  // }

  // let prevPrevTick = rlog.getGraph.prevStep(prevTick);

  // // if the prev step is an idle step, continue going backwards until the "prev" prev step is not an idle
  // while (
  //   prevPrevTick >= 0 &&
  //   prevTick >= 0 &&
  //   rlog.log[prevTick].action === LogStates.idle &&
  //   rlog.log[prevPrevTick].action === LogStates.idle
  // ) {
  //   prevTick = prevPrevTick;
  //   prevPrevTick = rlog.getGraph.prevStep(prevTick);
  // }

  // Move one step back
  if (prevTick === -1) return false;

  return updateGraph(prevTick, cytoOptions);
};

let firstStep = function(cytoOptions?: CytoscapeOptions = {}) {
  return updateGraph(rlog.getGraph.stepsVisible[0], cytoOptions);
};
let lastStep = function(cytoOptions?: CytoscapeOptions = {}) {
  return updateGraph(
    rlog.getGraph.stepsVisible[rlog.getGraph.stepsVisible.length - 1],
    cytoOptions
  );
};

export { nextStep, prevStep, firstStep, lastStep };
