// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let nextStep = function(cytoOptions?: CytoscapeOptions = {}) {
  // Move one step ahead (skipping unneccessary steps)
  let nextStepVal = rlog.getGraph.nextStep(rlog.curTick);
  if (nextStepVal === -1) return false;

  return updateGraph(nextStepVal, cytoOptions);
};

let prevStep = function(cytoOptions?: CytoscapeOptions = {}) {
  // Move one step back
  let prevStepVal = rlog.getGraph.prevStep(rlog.curTick);
  if (prevStepVal === -1) return false;

  return updateGraph(prevStepVal, cytoOptions);
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
