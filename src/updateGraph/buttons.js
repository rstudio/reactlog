// @flow

import * as enterExit from "./enterExit";
import * as step from "./step";
import * as userMarks from "./userMarks";
import * as queueEmpty from "./queueEmpty";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let buttonPrevMark = function(cytoOptions?: CytoscapeOptions = {}) {
  return userMarks.prevUserMark() || step.firstStep();
};
let buttonNextMark = function(cytoOptions?: CytoscapeOptions = {}) {
  return userMarks.nextUserMark() || step.lastStep();
};

let buttonPrevIdle = function(cytoOptions?: CytoscapeOptions = {}) {
  return queueEmpty.prevQueueEmpty() || step.firstStep();
};
let buttonNextIdle = function(cytoOptions?: CytoscapeOptions = {}) {
  return queueEmpty.nextQueueEmpty() || step.lastStep();
};

let buttonPrevCycle = function(cytoOptions?: CytoscapeOptions = {}) {
  return enterExit.prevEnterExitEmpty() || step.firstStep();
};
let buttonNextCycle = function(cytoOptions?: CytoscapeOptions = {}) {
  return enterExit.nextEnterExitEmpty() || step.lastStep();
};

let buttonPrevStep = function(cytoOptions?: CytoscapeOptions = {}) {
  return step.prevStep(cytoOptions);
};
let buttonNextStep = function(cytoOptions?: CytoscapeOptions = {}) {
  return step.nextStep(cytoOptions);
};

export {
  buttonPrevMark,
  buttonNextMark,
  buttonPrevIdle,
  buttonNextIdle,
  buttonPrevCycle,
  buttonNextCycle,
  buttonPrevStep,
  buttonNextStep,
};
