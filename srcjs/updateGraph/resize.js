// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

let resize = function() {
  // tell cytoscape to update it's layout bounds
  rlog.cyto.resize();
  // force a redraw
  updateGraph.atTick(rlog.curTick, { fit: true, forceRedraw: true });
};

export { resize };
