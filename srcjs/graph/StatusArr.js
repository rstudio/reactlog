// @flow

import _cloneDeep from "lodash/cloneDeep";
import _last from "lodash/last";

import console from "../utils/console";

import type { ActionsType } from "../log/logStates";

class StatusArr {
  statusArr: Array<StatusEntry>;

  constructor(statusArr: StatusArr | Array<StatusEntry> = []) {
    if (statusArr instanceof StatusArr) {
      this.statusArr = _cloneDeep(statusArr.statusArr);
    } else if (Array.isArray(statusArr)) {
      this.statusArr = statusArr;
    }
  }
  clone(): StatusArr {
    return new StatusArr(this);
  }
  add(obj: StatusEntry) {
    return this.statusArr.push(obj);
  }
  remove(): StatusEntry {
    return this.statusArr.pop();
  }
  last(): StatusEntry {
    return _last(this.statusArr);
  }
  containsStatus(status: string) {
    let arr = this.statusArr,
      n = arr.length;
    for (let i = 0; i < n; i++) {
      if (arr[i].action === status) {
        return true;
      }
    }
    return false;
  }
}

type StatusEntry = {
  action: ActionsType,
  ctxId: string,
};

let expectPrevStatus = function(
  curStatus: StatusEntry,
  prevStatus: StatusEntry,
  expectedAction: string
) {
  function onError(msg: string) {
    console.error("curStatus: ", curStatus);
    console.error("prevStatus: ", prevStatus);
    throw msg;
  }
  if (prevStatus.action !== expectedAction) {
    onError(`prior node status does not have "${expectedAction}" status`);
  }
  if (prevStatus.ctxId !== curStatus.ctxId) {
    onError(`prior node "ctxId" status does not have the same "ctxId" status`);
  }
};

export { StatusArr, expectPrevStatus };
export type { StatusEntry };
