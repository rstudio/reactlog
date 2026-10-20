import _find from "lodash/find";
import _findLast from "lodash/findLast";
import _isNil from "lodash/isNil";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

// User marks are always in `filteredStepsVisible`, so no filter check is needed
let nextUserMark = function(cytoOptions: CytoscapeOptions = {}) {
  let nextMark = _find(rlog.getGraph.stepsUserMark, val => val > rlog.curTick);
  if (_isNil(nextMark)) return false;
  return updateGraph(nextMark, cytoOptions);
};

let prevUserMark = function(cytoOptions: CytoscapeOptions = {}) {
  let prevMark = _findLast(
    rlog.getGraph.stepsUserMark,
    val => val < rlog.curTick
  );
  if (_isNil(prevMark)) return false;
  return updateGraph(prevMark, cytoOptions);
};

let lastUserMark = function(cytoOptions: CytoscapeOptions = {}) {
  if (rlog.getGraph.stepsUserMark.length === 0) return false;
  return updateGraph(
    rlog.getGraph.stepsUserMark[rlog.getGraph.stepsUserMark.length - 1],
    cytoOptions
  );
};
let firstUserMark = function(cytoOptions: CytoscapeOptions = {}) {
  if (rlog.getGraph.stepsUserMark.length === 0) return false;
  return updateGraph(rlog.getGraph.stepsUserMark[0], cytoOptions);
};

export { nextUserMark, prevUserMark, firstUserMark, lastUserMark };
