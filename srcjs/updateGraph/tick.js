// @flow

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

let nextTick = function() {
  if (rlog.curTick >= rlog.log.length) return false;
  return updateGraph(rlog.curTick + 1);
};

let prevTick = function() {
  if (rlog.curTick <= 0) return false;
  return updateGraph(rlog.curTick - 1);
};

export { nextTick, prevTick };
