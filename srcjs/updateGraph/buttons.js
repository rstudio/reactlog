// @flow

import * as outputCalc from "./outputCalc";
import * as step from "./step";
import * as userMarks from "./userMarks";
import * as idle from "./idle";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let buttonPrevMark = function(cytoOptions?: CytoscapeOptions = {}) {
  return userMarks.prevUserMark() || step.firstStep();
};
let buttonNextMark = function(cytoOptions?: CytoscapeOptions = {}) {
  return userMarks.nextUserMark() || step.lastStep();
};

let buttonPrevIdle = function(cytoOptions?: CytoscapeOptions = {}) {
  return idle.prevIdle() || step.firstStep();
};
let buttonNextIdle = function(cytoOptions?: CytoscapeOptions = {}) {
  return idle.nextIdle() || step.lastStep();
};

let buttonPrevOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  return outputCalc.prevOutputCalc() || step.firstStep();
};
let buttonNextOutputCalc = function(cytoOptions?: CytoscapeOptions = {}) {
  return outputCalc.nextOutputCalc() || step.lastStep();
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
  buttonPrevOutputCalc,
  buttonNextOutputCalc,
  buttonPrevStep,
  buttonNextStep,
};
