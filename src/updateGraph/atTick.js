// @flow

import { rlog } from "../rlog";

import * as logEntry from "../layout/logEntry";
import * as progressBar from "../layout/progressBar";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let atTick = function(
  nextTick: number = rlog.curTick,
  cytoOptions?: CytoscapeOptions = {}
) {
  rlog.curTick = nextTick;
  rlog.getGraph.displayAtStep(nextTick, rlog.cyto, cytoOptions);
  progressBar.update();
  logEntry.update();
};

export { atTick };
