// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

let nextTick = function() {
  return updateGraph(rlog.curTick + 1);
};

let prevTick = function() {
  return updateGraph(rlog.curTick - 1);
};

export { nextTick, prevTick };
