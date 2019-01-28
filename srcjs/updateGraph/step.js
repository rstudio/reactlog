// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextStep = function(cytoOptions?: CytoscapeOptions = {}) {
  let nextTick = rlog.getGraph.nextStep(rlog.curTick);
  if (nextTick === -1) return false;
  return updateGraph(nextTick, cytoOptions);
};

let prevStep = function(cytoOptions?: CytoscapeOptions = {}) {
  let prevTick = rlog.getGraph.prevStep(rlog.curTick);
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
