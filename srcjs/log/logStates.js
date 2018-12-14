// @flow

let states = {
  asyncStart: "asyncStart",
  asyncStop: "asyncStop",
  createContext: "createContext",
  define: "define",
  dependsOn: "dependsOn",
  dependsOnRemove: "dependsOnRemove",
  enter: "enter",
  exit: "exit",
  freeze: "freeze",
  invalidateEnd: "invalidateEnd",
  invalidateStart: "invalidateStart",
  isolateEnter: "isolateEnter",
  isolateExit: "isolateExit",
  isolateInvalidateEnd: "isolateInvalidateEnd",
  isolateInvalidateStart: "isolateInvalidateStart",
  userMark: "userMark",
  idle: "idle",
  thaw: "thaw",
  updateNodeLabel: "updateNodeLabel",
  valueChange: "valueChange",
};

// type ActionsType = $Values<typeof states>;

type ReactIdType = string;
type CtxIdType = string;

// type EntryType = {
//   action: ActionsType,
//   session: ?string,
//   time: number,
//   step: number,
// };

// type TypeType =
//   | "observable"
//   | "observer"
//   | "reactiveVal"
//   | "reactiveValuesNames"
//   | "reactiveValuesAsList"
//   | "reactiveValuesAsListAll"
//   | "reactiveValuesKey";

// type EntryReactIdType = {
//   session: ?string,
//   time: number,
//   step: number,
//   reactId: ReactIdType,
// };
// type EntryContextType = {
//   session: ?string,
//   time: number,
//   step: number,
//   reactId: ReactIdType,
//   ctxId: CtxIdType,
// };

type LogEntryAsyncStartType = {
  action: "asyncStart",
  session: ?string,
  time: number,
  step: number,
};
type LogEntryAsyncStopType = {
  action: "asyncStop",
  session: ?string,
  time: number,
  step: number,
};

// used to capture srcref and srcfile information for a given context
type LogEntryCreateContextType = {
  action: "createContext",
  session: ?string,
  time: number,
  step: number,
  ctxId: CtxIdType,
  label: string,
  type: string,
  prevCtxId: ?CtxIdType,
  srcref: ?Array<number>,
  srcfile: ?string,
};

type LogEntryDefineType = {
  action: "define",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  type: string, // TypeType,
  label: string,
};

type LogEntryDependsOnType = {
  action: "dependsOn",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  depOnReactId: ReactIdType,
};
type LogEntryDependsOnRemoveType = {
  action: "dependsOnRemove",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  depOnReactId: ReactIdType,
};

type LogEntryEnterType = {
  action: "enter",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryExitType = {
  action: "exit",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryFreezeType = {
  action: "freeze",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
};
type LogEntryThawType = {
  action: "thaw",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
};

type LogEntryInvalidateStartType = {
  action: "invalidateStart",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  type: string,
};
type LogEntryInvalidateEndType = {
  action: "invalidateEnd",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  type: string,
};

type LogEntryIsolateEnterType = {
  action: "isolateEnter",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryIsolateExitType = {
  action: "isolateExit",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryIsolateInvalidateStartType = {
  action: "isolateInvalidateStart",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryIsolateInvalidateEndType = {
  action: "isolateInvalidateEnd",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryUserMark = {
  action: "userMark",
  session: ?string,
  time: number,
  step: number,
};

type LogEntryIdleType = {
  action: "idle",
  session: ?string,
  time: number,
  step: number,
};

type LogEntryUpdateNodeLabelType = {
  action: "updateNodeLabel",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  label: string,
};

type LogEntryValueChangeType = {
  action: "valueChange",
  session: ?string,
  time: number,
  step: number,
  reactId: ReactIdType,
  value: string,
};

type LogEntryHasReactId =
  | LogEntryDefineType
  | LogEntryDependsOnType
  | LogEntryDependsOnRemoveType
  | LogEntryEnterType
  | LogEntryExitType
  | LogEntryFreezeType
  | LogEntryThawType
  | LogEntryInvalidateStartType
  | LogEntryInvalidateEndType
  | LogEntryIsolateEnterType
  | LogEntryIsolateExitType
  | LogEntryIsolateInvalidateStartType
  | LogEntryIsolateInvalidateEndType
  | LogEntryUpdateNodeLabelType
  | LogEntryValueChangeType;

type LogEntryAnyType =
  | LogEntryAsyncStartType
  | LogEntryAsyncStopType
  | LogEntryCreateContextType
  | LogEntryDefineType
  | LogEntryDependsOnType
  | LogEntryDependsOnRemoveType
  | LogEntryEnterType
  | LogEntryExitType
  | LogEntryFreezeType
  | LogEntryThawType
  | LogEntryInvalidateStartType
  | LogEntryInvalidateEndType
  | LogEntryIsolateEnterType
  | LogEntryIsolateExitType
  | LogEntryIsolateInvalidateStartType
  | LogEntryIsolateInvalidateEndType
  | LogEntryUserMark
  | LogEntryIdleType
  | LogEntryUpdateNodeLabelType
  | LogEntryValueChangeType;

type LogType = Array<LogEntryAnyType>;

export { states as LogStates };
export type {
  ReactIdType,
  CtxIdType,
  LogType,
  LogEntryHasReactId,
  LogEntryAnyType,
  LogEntryAsyncStartType,
  LogEntryAsyncStopType,
  LogEntryCreateContextType,
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
  LogEntryUserMark,
  LogEntryIdleType,
  LogEntryUpdateNodeLabelType,
  LogEntryValueChangeType,
};
