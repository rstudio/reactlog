// @flow

import _sortedIndex from "lodash/sortedIndex";
import _sortedIndexOf from "lodash/sortedIndexOf";

import { rlog } from "../rlog";

import { roundDecimals } from "../utils/numbers";

import { LogStates } from "../log/logStates";
import type {
  LogType,
  ReactIdType,
  LogEntryHasReactId,
  LogEntryAnyType,
  LogEntryDefineType,
  LogEntryDependsOnType,
  LogEntryDependsOnRemoveType,
  LogEntryEnterType,
  LogEntryExitType,
  LogEntryFreezeType,
  LogEntryThawType,
  LogEntryInvalidateStartType,
  LogEntryInvalidateEndType,
  LogEntryIsolateEnterType,
  LogEntryIsolateExitType,
  LogEntryIsolateInvalidateStartType,
  LogEntryIsolateInvalidateEndType,
  LogEntryUpdateNodeLabelType,
  LogEntryValueChangeType,
} from "../log/logStates";

let containers: {
  container: JQuery,
  time: JQuery,
  session: JQuery,
  step: JQuery,
  status: JQuery,
};
let timeDecimalDigits = 4;
let logInfo: {
  logLength: number,
  firstTime: number,
  lastTimeCharLength: number,
  maxSessionCharLength: number,
} = {
  logLength: 0,
  firstTime: 0,
  lastTimeCharLength: 0,
  maxSessionCharLength: 0,
};

let updateLogEntry = function(): void {
  if (logInfo.logLength === 0) return;

  let curEntry = rlog.log[rlog.curTick];

  let timeDiff = curEntry.time - logInfo.firstTime; // milliseconds

  timeDiff = roundDecimals(timeDiff, timeDecimalDigits)
    .toFixed(timeDecimalDigits)
    .padStart(logInfo.lastTimeCharLength, " ");

  containers.time.text(`${timeDiff}s`);
  if (curEntry.session) {
    containers.session.text(
      `${curEntry.session}`.padEnd(logInfo.maxSessionCharLength, " ")
    );
  } else {
    containers.session.text("".padEnd(logInfo.maxSessionCharLength, " "));
  }

  let stepDisplayValPadding = function(i) {
    let logNumDigits = `${logInfo.logLength}`.length;
    return `${i}`.padStart(logNumDigits, " ");
  };

  let stepDisplayVal = _sortedIndex(rlog.getGraph.stepsVisible, curEntry.step);
  if (_sortedIndexOf(rlog.getGraph.stepsVisible, curEntry.step) === -1) {
    // does not contain the step. display how many steps advanced from last visible step

    if (stepDisplayVal === 0) {
      // occurs before any visible step
      // let halfStepPos = _sortedIndex(rlog.getGraph.steps, curEntry.step);
      stepDisplayVal = `${stepDisplayValPadding(0)}_${curEntry.step}`;
    } else {
      // get visible step location
      let smallerStepVal = rlog.getGraph.stepsVisible[stepDisplayVal - 1];
      let smallerStepValVisible = _sortedIndex(
        rlog.getGraph.stepsVisible,
        smallerStepVal
      );
      let smallerPos = _sortedIndex(rlog.getGraph.steps, smallerStepVal);
      let halfStepPos = _sortedIndex(rlog.getGraph.steps, curEntry.step);

      // display number of steps away from lower, visible step
      let diffSteps = halfStepPos - smallerPos;
      stepDisplayVal = `${stepDisplayValPadding(
        smallerStepValVisible + 1
      )}_${diffSteps}`;
    }
  } else {
    // 1 start counting (not 0)
    stepDisplayVal = stepDisplayValPadding(stepDisplayVal + 1);
  }
  containers.step.text(`${stepDisplayVal}`);
  containers.status.html(statusForEntry(curEntry));

  containers.container.text(JSON.stringify(rlog.log[rlog.curTick], null, "  "));
};

let setContainers = function(
  time: JQuery,
  session: JQuery,
  step: JQuery,
  status: JQuery,
  container: JQuery,
  log: LogType
): void {
  let logInfoLength = log.length;
  let maxSessionCharLength = 0;
  let logEntry, sessionCharLength;
  // find largest session name length
  for (let i = 0; i < logInfoLength; i++) {
    logEntry = log[i];
    if (logEntry.session) {
      sessionCharLength = logEntry.session.length;
      if (sessionCharLength > maxSessionCharLength) {
        maxSessionCharLength = sessionCharLength;
      }
    }
  }
  logInfo = {
    logLength: logInfoLength,
    firstTime: log[0].time,
    maxSessionCharLength: maxSessionCharLength,
    lastTimeCharLength: (log[logInfoLength - 1].time - log[0].time).toFixed(
      timeDecimalDigits
    ).length,
  };
  containers = {
    time: time,
    session: session,
    step: step,
    status: status,
    container: container,
  };
};

let getLabel = function(reactId: ReactIdType): string {
  let node = rlog.graph.nodes.get(reactId);
  if (node) {
    return node.label;
  } else {
    return "<unknown>";
  }
};
let getReactIdLabel = function(entry: LogEntryHasReactId) {
  return getLabel(entry.reactId);
};
let pre = function(txt: string | number) {
  return `<span class="monospaced-pre">${txt}</span>`;
};
let statusForEntry = function(entry: LogEntryAnyType): string {
  switch (entry.action) {
    case LogStates.asyncStart: {
      return "Start asynchronous calculations";
    }
    case LogStates.asyncStop: {
      return "Start asynchronous calculations";
    }
    case LogStates.define: {
      let defineEntry = ((entry: Object): LogEntryDefineType);
      return `Defined ${pre(getReactIdLabel(defineEntry))}`;
    }
    case LogStates.dependsOn: {
      let dependsOnEntry = ((entry: Object): LogEntryDependsOnType);
      return `${pre(getReactIdLabel(dependsOnEntry))} depends on ${pre(
        getLabel(dependsOnEntry.depOnReactId)
      )}`;
    }
    case LogStates.dependsOnRemove: {
      let dependsOnRemoveEntry = ((entry: Object): LogEntryDependsOnRemoveType);
      return `${pre(
        getReactIdLabel(dependsOnRemoveEntry)
      )} removes dependency on ${pre(
        getLabel(dependsOnRemoveEntry.depOnReactId)
      )}`;
    }
    case LogStates.enter: {
      let enterEntry = ((entry: Object): LogEntryEnterType);
      return `${pre(getReactIdLabel(enterEntry))} started calculating`;
    }
    case LogStates.exit: {
      let exitEntry = ((entry: Object): LogEntryExitType);
      return `${pre(getReactIdLabel(exitEntry))} stopped calculating`;
    }
    case LogStates.freeze: {
      let frozenEntry = ((entry: Object): LogEntryFreezeType);
      return `${pre(getReactIdLabel(frozenEntry))} froze`;
    }
    case LogStates.invalidateEnd: {
      let invalidateEndEntry = ((entry: Object): LogEntryInvalidateEndType);
      return `${pre(getReactIdLabel(invalidateEndEntry))} has invalidated`;
    }
    case LogStates.invalidateStart: {
      let invalidateStartEntry = ((entry: Object): LogEntryInvalidateStartType);
      return `${pre(getReactIdLabel(invalidateStartEntry))} is invalidating`;
    }
    case LogStates.isolateEnter: {
      let isolateEnterEntry = ((entry: Object): LogEntryIsolateEnterType);
      return `${pre(
        getReactIdLabel(isolateEnterEntry)
      )} is isolating future dependencies`;
    }
    case LogStates.isolateExit: {
      let isolateExitEntry = ((entry: Object): LogEntryIsolateExitType);
      return `${pre(
        getReactIdLabel(isolateExitEntry)
      )} stopped isolating future dependencies`;
    }
    case LogStates.isolateInvalidateEnd: {
      let isolateInvalidateEndEntry = ((entry: Object): LogEntryIsolateInvalidateEndType);
      return `${pre(
        getReactIdLabel(isolateInvalidateEndEntry)
      )} invalidated during an isolate call`;
    }
    case LogStates.isolateInvalidateStart: {
      let isolateInvalidateStartEntry = ((entry: Object): LogEntryIsolateInvalidateStartType);
      return `${pre(
        getReactIdLabel(isolateInvalidateStartEntry)
      )} is invalidating during an isolate call`;
    }
    case LogStates.mark: {
      return `Marked step`;
    }
    case LogStates.queueEmpty: {
      return `Shiny App idle`;
    }
    case LogStates.thaw: {
      let thawEntry = ((entry: Object): LogEntryThawType);
      return `${pre(getReactIdLabel(thawEntry))} has thawed`;
    }
    case LogStates.updateNodeLabel: {
      let updateNodeLabelEntry = ((entry: Object): LogEntryUpdateNodeLabelType);
      return `Set label to ${pre(getReactIdLabel(updateNodeLabelEntry))}`;
    }
    case LogStates.valueChange: {
      let valueChangeEntry = ((entry: Object): LogEntryValueChangeType);
      return `${pre(getReactIdLabel(valueChangeEntry))} has a new value`;
    }
    default:
      throw `state: ${pre(entry.action)} not implemented for log status`;
  }
};

export { updateLogEntry as update, setContainers };
