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
  invalidateLater: "invalidateLater",
  isolateEnter: "isolateEnter",
  isolateExit: "isolateExit",
  isolateInvalidateEnd: "isolateInvalidateEnd",
  isolateInvalidateStart: "isolateInvalidateStart",
  userMark: "userMark",
  idle: "idle",
  thaw: "thaw",
  updateNodeLabel: "updateNodeLabel",
  valueChange: "valueChange",
} as const;

type ActionsType = (typeof states)[keyof typeof states];

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
  session: string | null | undefined,
  time: number,
  step: number,
};
type LogEntryAsyncStopType = {
  action: "asyncStop",
  session: string | null | undefined,
  time: number,
  step: number,
};

// used to capture srcref and srcfile information for a given context
type LogEntryCreateContextType = {
  action: "createContext",
  session: string | null | undefined,
  time: number,
  step: number,
  ctxId: CtxIdType,
  label: string,
  type: string,
  prevCtxId: CtxIdType | null | undefined,
  srcref: Array<number> | null | undefined,
  srcfile: string | null | undefined,
};

type LogEntryDefineType = {
  action: "define",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  type: string, // TypeType,
  label: string,
  value: string,
};

type LogEntryDependsOnType = {
  action: "dependsOn",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  depOnReactId: ReactIdType,
};
type LogEntryDependsOnRemoveType = {
  action: "dependsOnRemove",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  depOnReactId: ReactIdType,
};

type LogEntryEnterType = {
  action: "enter",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryExitType = {
  action: "exit",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryFreezeType = {
  action: "freeze",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
};
type LogEntryThawType = {
  action: "thaw",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
};

type LogEntryInvalidateStartType = {
  action: "invalidateStart",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  type: string,
};
type LogEntryInvalidateEndType = {
  action: "invalidateEnd",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  type: string,
};

type LogEntryInvalidateLaterType = {
  action: "invalidateLater",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
  millis: number,
};

type LogEntryIsolateEnterType = {
  action: "isolateEnter",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryIsolateExitType = {
  action: "isolateExit",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryIsolateInvalidateStartType = {
  action: "isolateInvalidateStart",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};
type LogEntryIsolateInvalidateEndType = {
  action: "isolateInvalidateEnd",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  ctxId: CtxIdType,
};

type LogEntryUserMark = {
  action: "userMark",
  session: string | null | undefined,
  time: number,
  step: number,
};

type LogEntryIdleType = {
  action: "idle",
  session: string | null | undefined,
  time: number,
  step: number,
};

type LogEntryUpdateNodeLabelType = {
  action: "updateNodeLabel",
  session: string | null | undefined,
  time: number,
  step: number,
  reactId: ReactIdType,
  label: string,
};

type LogEntryValueChangeType = {
  action: "valueChange",
  session: string | null | undefined,
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
  | LogEntryInvalidateLaterType
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
  | LogEntryInvalidateLaterType
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
  ActionsType,
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
  LogEntryInvalidateLaterType,
  LogEntryIsolateEnterType,
  LogEntryIsolateExitType,
  LogEntryIsolateInvalidateStartType,
  LogEntryIsolateInvalidateEndType,
  LogEntryUserMark,
  LogEntryIdleType,
  LogEntryUpdateNodeLabelType,
  LogEntryValueChangeType,
};
