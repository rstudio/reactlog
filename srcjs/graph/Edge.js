// @flow

import _isNil from "lodash/isNil";

import { HoverStatus } from "./HoverStatus";

import type { ReactIdType, CtxIdType } from "../log/logStates";

let ghostKey = function(reactId: ReactIdType, depOnReactId: ReactIdType) {
  return `${reactId} depends on ${depOnReactId}`;
};
let edgeKey = function(
  reactId: ReactIdType,
  depOnReactId: ReactIdType,
  ctxId: CtxIdType
) {
  return `${reactId} depends on ${depOnReactId} in ${ctxId}`;
};

class Edge {
  reactId: ReactIdType;
  depOnReactId: ReactIdType;
  ctxId: CtxIdType;
  session: string;
  time: number;
  status: string;
  isGhost: boolean;
  hoverStatus: HoverStatus;
  isDisplayed: boolean;

  constructor(data: EdgeInputType) {
    if (typeof data.reactId === "undefined")
      throw "data.reactId not provided to new Edge()";
    if (typeof data.depOnReactId === "undefined")
      throw "data.depOnReactId not provided to new Edge()";
    if (typeof data.ctxId === "undefined")
      throw "data.ctxId not provided to new Edge()";
    if (typeof data.time === "undefined")
      throw "data.time not provided to new Edge()";
    this.reactId = data.reactId;
    this.depOnReactId = data.depOnReactId;
    this.ctxId = data.ctxId;
    this.session = _isNil(data.session) ? "Global" : data.session;
    this.time = data.time;
    this.status = "normal";
    this.isGhost = false;
    this.hoverStatus = data.hoverStatus || new HoverStatus();
    this.isDisplayed = _isNil(data.isDisplayed) ? true : data.isDisplayed;
  }
  get id(): EdgeIdType {
    return `${this.reactId}_${this.depOnReactId}_${this.ctxId}`.replace(
      /\$/g,
      "_"
    );
  }
  get source(): GraphNodeKeyType {
    return this.depOnReactId.replace(/\$/g, "_");
  }
  get target(): GraphNodeKeyType {
    return this.reactId.replace(/\$/g, "_");
  }
  get key(): EdgeKeyType {
    return edgeKey(this.reactId, this.depOnReactId, this.ctxId);
  }
  get ghostKey(): EdgeKeyType {
    return ghostKey(this.reactId, this.depOnReactId);
  }
  get hoverKey(): EdgeHoverKeyType {
    return this.ghostKey;
  }
  get inIsolate(): boolean {
    return this.status === "isolate";
  }
  get cytoStyle(): Object {
    return {};
  }
  get cytoClasses(): string {
    let classes = [];
    if (this.inIsolate) classes.push("edgeIsolate");
    switch (this.hoverStatus.state) {
      case HoverStatus.valFocused:
        break;
      case HoverStatus.valNotFocused:
        if (this.hoverStatus.sticky) {
          classes.push("hoverNotFocusedButSticky");
        } else {
          classes.push("hoverNotFocused");
        }
        break;
    }
    if (this.hoverStatus.selected) classes.push("edgeSelected");
    if (!this.isDisplayed) classes.push("edgeHidden");
    return classes.join(" ");
  }
  get cytoData() {
    let retData = this;
    return {
      group: "edges",
      data: retData,
    };
  }
}

type EdgeKeyType = string;
type EdgeHoverKeyType = string;
type EdgeIdType = string;

type GraphNodeKeyType = string;

type EdgeInputType = EdgeLikeType & {
  ctxId: CtxIdType,
};

type EdgeLikeType = {
  reactId: ReactIdType,
  depOnReactId: ReactIdType,
  session: ?string,
  time: number,
  hoverStatus?: ?HoverStatus,
  isDisplayed?: boolean,
};

export { Edge, edgeKey, ghostKey };

export type {
  EdgeLikeType,
  EdgeIdType,
  EdgeKeyType,
  EdgeHoverKeyType,
  GraphNodeKeyType,
};
