import cytoscape from "cytoscape";

import _isNil from "lodash/isNil";

import { Graph } from "./graph/Graph";
import { GraphAtStep } from "./graph/GraphAtStep";
import * as updateGraph from "./updateGraph";

import type { CytoscapeType } from "./cyto/cytoFlowType";
import type { LogType } from "./log/logStates";

// TODO-barret change to individual exports
let ret = {
  log: [] as LogType,
  cyto: cytoscape() as CytoscapeType,
  getGraph: new GraphAtStep([]),
  graph: new Graph([]),
  curTick: 1 as number,
  updateGraph: updateGraph,
  barret: null as any,
  displayTimeOnNodes:
    // is not `false`
    window.__APP_TIME__ === true || _isNil(window.__APP_TIME__),
};

export { ret as rlog };
