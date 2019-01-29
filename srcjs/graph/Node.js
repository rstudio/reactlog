// @flow

import _isNil from "lodash/isNil";

import { rlog } from "../rlog";

import { LogStates } from "../log/logStates";
import { HoverStatus } from "./HoverStatus";
import { ActiveStateStatus } from "./ActiveStateStatus";
import { StatusArr } from "./StatusArr";
import type { LogEntryAnyType, CtxIdType } from "../log/logStates";
import type { StatusEntry } from "./StatusArr";
import type { CytoData } from "../cyto/cytoFlowType";

// // TODO-barret use log states everywhere
// import logStates from "../log/logStates"

class Node {
  reactId: string;
  label: string;
  type: string;
  session: string;
  time: number;
  isFrozen: boolean;
  statusArr: StatusArr;
  value: ?string;
  hoverStatus: HoverStatus;
  valueChangedStatus: ActiveStateStatus;
  enterStatus: ActiveStateStatus;
  invalidateStatus: ActiveStateStatus;
  isDisplayed: boolean;
  calculationTime: ?number;
  calculationStartMap: Map<CtxIdType, number>;

  constructor(data: NodeInputType) {
    if (typeof data.reactId === "undefined")
      throw "data.reactId not provided in new Node";
    if (typeof data.label === "undefined")
      throw "data.label not provided in new Node";
    if (typeof data.type === "undefined")
      throw "data.type not provided in new Node";
    if (typeof data.session === "undefined")
      throw "data.session not provided in new Node";
    if (typeof data.time === "undefined")
      throw "data.time not provided in new Node";
    this.reactId = data.reactId;
    this.label = data.label;
    this.type = data.type;
    this.session = _isNil(data.session) ? "Global" : data.session;
    this.time = data.time;
    this.isFrozen = data.isFrozen || false;
    this.statusArr = new StatusArr(data.statusArr || []);
    this.value = _isNil(data.value) ? null : data.value;
    this.hoverStatus = data.hoverStatus || new HoverStatus();
    this.isDisplayed = _isNil(data.isDisplayed) ? true : data.isDisplayed;

    this.calculationTime = _isNil(data.calculationTime)
      ? null
      : data.calculationTime;
    this.calculationStartMap = _isNil(data.calculationStartMap)
      ? new Map()
      : data.calculationStartMap;

    this.valueChangedStatus =
      data.valueChangedStatus || new ActiveStateStatus();

    // this.inInvalidate = data.inInvalidate || false;
    // this.activeInvalidate = data.activeInvalidate || false;

    this.enterStatus = data.enterStatus || new ActiveStateStatus();

    if (data.invalidateStatus) {
      this.invalidateStatus = data.invalidateStatus;
    } else {
      this.invalidateStatus = new ActiveStateStatus();
      // init state for observer and obervable is to be invalidated
      switch (this.type) {
        case "observable":
        case "observer":
          this.invalidateStatus.toFinished();
          break;
      }
    }
  }
  get id(): NodeIdType {
    return this.reactId.replace(/\$/g, "_");
  }
  get key(): NodeKeyType {
    return this.reactId;
  }
  get hoverKey(): NodeHoverKeyType {
    return this.key;
  }
  statusAdd(logEntry: LogEntryAnyType): StatusArr {
    if (logEntry.action === LogStates.enter) {
      this.calculationStartMap.set(logEntry.ctxId, logEntry.time);
    }
    switch (logEntry.action) {
      case LogStates.enter:
      case LogStates.isolateInvalidateStart:
      case LogStates.invalidateStart:
        this.calculationTime = null;
        break;
    }
    this.statusArr.add(((logEntry: Object): StatusEntry));
    return this.statusArr;
  }
  statusRemove(logEntry: LogEntryAnyType): StatusEntry {
    if (logEntry.action === LogStates.exit) {
      let startEntryTime = this.calculationStartMap.get(logEntry.ctxId);
      if (!_isNil(startEntryTime)) {
        this.calculationTime = (logEntry.time - startEntryTime) * 1000;
      }
      this.calculationStartMap.delete(logEntry.ctxId);
    }
    return this.statusArr.remove();
  }
  statusLast(): StatusEntry {
    return this.statusArr.last();
  }
  get inEnter(): boolean {
    return this.statusArr.containsStatus(LogStates.enter);
  }
  get inIsolate(): boolean {
    return this.statusArr.containsStatus(LogStates.isolateEnter);
  }
  get inInvalidate(): boolean {
    return this.statusArr.containsStatus(LogStates.invalidateStart);
  }
  get inIsolateInvalidate(): boolean {
    return this.statusArr.containsStatus(LogStates.isolateInvalidateStart);
  }
  get cytoStyle() {
    return {};
  }
  get cytoLabel(): string {
    let label = `${this.label}`;
    if (this.type === "observer" || this.type === "observable") {
      let time = this.calculationTime;
      if (rlog.displayTimeOnNodes) {
        if (!_isNil(time)) {
          // is just chillin... so I'm assuming it's calculated and I want to know how long it took.
          return `${label}; ${time.toFixed(0)}ms`;
        }
      }
      return label;
    }

    // not a middle or end node...
    if (!_isNil(this.value)) {
      let value = `${this.value}`;
      // only if there are no new lines...
      if (!value.includes("\\n")) {
        // trim beginning of string
        value = value.replace(/^\s+/, "");
      }
      return `${label} - '${value}'`;
    }
    return label;
  }
  get cytoClasses(): string {
    let classes = [];
    switch (this.type) {
      case "observer":
        classes.push("nodeEnd");
        break;
      case "observable":
        classes.push("nodeMiddle");
        break;
      default:
        classes.push("nodeStart");
    }

    if (this.inEnter) classes.push("nodeEnter");
    if (this.enterStatus.isActive) classes.push("nodeEnterActive");

    if (this.type === "observer" || this.type === "observable") {
      if (this.invalidateStatus.isActive) classes.push("nodeInvalidateActive");
      else if (this.invalidateStatus.isOn) classes.push("nodeInvalidate");
      else if (this.invalidateStatus.isFinished)
        classes.push("nodeInvalidateDone");
    }
    // if (this.inInvalidate) classes.push("nodeInvalidate");
    if (this.inIsolate) classes.push("nodeIsolate");
    // if (this.inIsolateInvalidate) classes.push("nodeIsolateInvalidate");
    if (this.valueChangedStatus.isOn) classes.push("nodeValueChanged");

    switch (this.hoverStatus.state) {
      case HoverStatus.valFocused:
        break;
      case HoverStatus.valNotFocused:
        // console.log("not focused!")
        if (this.hoverStatus.isSticky()) {
          classes.push("hoverNotFocusedButSticky");
        } else {
          classes.push("hoverNotFocused");
        }
        break;
    }
    if (this.hoverStatus.isSelected()) {
      classes.push("nodeSelected");
      switch (this.type) {
        case "observable":
          classes.push("nodeSelectedMiddle");
          break;
        case "observer":
          classes.push("nodeSelectedEnd");
          break;
        default:
          classes.push("nodeSelectedStart");
      }
    }
    if (this.hoverStatus.isFiltered()) {
      classes.push("nodeFiltered");
      switch (this.type) {
        case "observable":
          classes.push("nodeFilteredMiddle");
          break;
        case "observer":
          classes.push("nodeFilteredEnd");
          break;
        default:
          classes.push("nodeFilteredStart");
      }
    }

    if (this.isFrozen) classes.push("nodeFrozen");

    if (!this.isDisplayed) classes.push("nodeHidden");
    return classes.join(" ");
  }
  get cytoData(): CytoData {
    let retData = this;
    return {
      group: "nodes",
      data: retData,
    };
  }
}

type NodeKeyType = string;
type NodeHoverKeyType = string;
type NodeIdType = string;

type NodeInputType = {
  reactId: string,
  label: string,
  type: string,
  session: ?string,
  time: number,
  isFrozen?: boolean,
  statusArr?: StatusArr,
  value: ?string,
  hoverStatus?: HoverStatus,
  valueChangedStatus?: ActiveStateStatus,
  enterStatus?: ActiveStateStatus,
  invalidateStatus?: ActiveStateStatus,
  isDisplayed?: boolean,
  calculationTime?: number,
  calculationStartMap?: number,
};

export { Node };
export type { NodeKeyType, NodeHoverKeyType, NodeIdType, NodeInputType };
