// @flow

import { rlog } from "../rlog";
import { atTick } from "./atTick";

let resize = function() {
  // tell cytoscape to update it's layout bounds
  rlog.cyto.resize();
  // force a redraw
  atTick(rlog.curTick, { fit: true, forceRedraw: true });
};

export { resize };
