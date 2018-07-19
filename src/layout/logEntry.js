// @flow

import { rlog } from "../rlog";

import { LogStates } from "../log/logStates";
import type {
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

let updateLogEntry = function(): void {
  let curEntry = rlog.log[rlog.curTick];

  containers.time.text(`Time: ${curEntry.time}`);
  if (curEntry.session) {
    containers.session.text(`Session: ${curEntry.session}`);
  } else {
    containers.session.text("");
  }

  containers.step.text(`Step: ${curEntry.step}`);
  containers.status.text(statusForEntry(curEntry));

  containers.container.text(JSON.stringify(rlog.log[rlog.curTick], null, "  "));
};

let setContainers = function(
  time: JQuery,
  session: JQuery,
  step: JQuery,
  status: JQuery,
  container: JQuery
): void {
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
      return `Defined ${getReactIdLabel(defineEntry)}`;
    }
    case LogStates.dependsOn: {
      let dependsOnEntry = ((entry: Object): LogEntryDependsOnType);
      return `${getReactIdLabel(dependsOnEntry)} depends on ${getLabel(
        dependsOnEntry.depOnReactId
      )}`;
    }
    case LogStates.dependsOnRemove: {
      let dependsOnRemoveEntry = ((entry: Object): LogEntryDependsOnRemoveType);
      return `${getReactIdLabel(
        dependsOnRemoveEntry
      )} removes dependency on ${getLabel(dependsOnRemoveEntry.depOnReactId)}`;
    }
    case LogStates.enter: {
      let enterEntry = ((entry: Object): LogEntryEnterType);
      return `${getReactIdLabel(enterEntry)} started calculating`;
    }
    case LogStates.exit: {
      let exitEntry = ((entry: Object): LogEntryExitType);
      return `${getReactIdLabel(exitEntry)} stopped calculating`;
    }
    case LogStates.freeze: {
      let frozenEntry = ((entry: Object): LogEntryFreezeType);
      return `${getReactIdLabel(frozenEntry)} froze`;
    }
    case LogStates.invalidateEnd: {
      let invalidateEndEntry = ((entry: Object): LogEntryInvalidateEndType);
      return `${getReactIdLabel(invalidateEndEntry)} has invalidated`;
    }
    case LogStates.invalidateStart: {
      let invalidateStartEntry = ((entry: Object): LogEntryInvalidateStartType);
      return `${getReactIdLabel(invalidateStartEntry)} is invalidating`;
    }
    case LogStates.isolateEnter: {
      let isolateEnterEntry = ((entry: Object): LogEntryIsolateEnterType);
      return `${getReactIdLabel(
        isolateEnterEntry
      )} is isolating future dependencies`;
    }
    case LogStates.isolateExit: {
      let isolateExitEntry = ((entry: Object): LogEntryIsolateExitType);
      return `${getReactIdLabel(
        isolateExitEntry
      )} stopped isolating future dependencies`;
    }
    case LogStates.isolateInvalidateEnd: {
      let isolateInvalidateEndEntry = ((entry: Object): LogEntryIsolateInvalidateEndType);
      return `${getReactIdLabel(
        isolateInvalidateEndEntry
      )} invalidated during an isolate call`;
    }
    case LogStates.isolateInvalidateStart: {
      let isolateInvalidateStartEntry = ((entry: Object): LogEntryIsolateInvalidateStartType);
      return `${getReactIdLabel(
        isolateInvalidateStartEntry
      )} is invalidating during an isolate call`;
    }
    case LogStates.mark: {
      return `Marked step`;
    }
    case LogStates.queueEmpty: {
      return `Shiny flushed`;
    }
    case LogStates.thaw: {
      let thawEntry = ((entry: Object): LogEntryThawType);
      return `${getReactIdLabel(thawEntry)} has thawed`;
    }
    case LogStates.updateNodeLabel: {
      let updateNodeLabelEntry = ((entry: Object): LogEntryUpdateNodeLabelType);
      return `Set label to ${getReactIdLabel(updateNodeLabelEntry)}`;
    }
    case LogStates.valueChange: {
      let valueChangeEntry = ((entry: Object): LogEntryValueChangeType);
      return `${getReactIdLabel(valueChangeEntry)} has a new value`;
    }
    default:
      throw `state: ${entry.action} not implemented for log status`;
  }
};

export { updateLogEntry as update, setContainers };
