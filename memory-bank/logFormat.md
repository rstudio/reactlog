---
title: "Log Format"
description: "The reactlog log format end to end: how Shiny records entries, every log action and its fields, the version attribute, how reactlog_write() turns the log into JSON, how the browser gives each entry a step, and the sample logs. Read before changing what Shiny logs, adding a new action, or editing code that switches on entry.action."
---

# Log Format

A reactlog is a flat list of entries, in the order they happened. Each entry is
a small named list (in R) or object (in JSON) with an `action` field and a few
other fields. Shiny writes the log. This package only reads it, turns it into
JSON, and replays it in the browser. For how the R and JS halves fit together,
see [architecture.md](architecture.md).

Key files:

| File | Role |
| --- | --- |
| shiny `R/graph.R` | `RLog` R6 class (`rLog` object): one method per action, `appendEntry`, `asList()`; also `reactlog()`, `reactlogShow()`, `reactlogReset()`, `reactlogAddMark()`, `renderReactlog()` |
| shiny `R/react.R`, `R/reactives.R`, `R/shiny.R`, `R/middleware-shiny.R` | Call sites of `rLog$...` (contexts, idle, freeze/thaw, invalidateLater, busy/async, `/reactlog` endpoints) |
| `R/version.R` | `reactlog_upgrade()`: checks the `version` attribute |
| `R/showReactLog.R` | `reactlog_write()`: session filter and JSON |
| `R/renderReactLog.R` | `reactlog_render()`: upgrade, write, put JSON into `reactlog.html` |
| `srcjs/log/logStates.js` | `LogStates` (every action name) and the Flow type of each entry |
| `srcjs/log/initStep.js` | Gives each entry `step = index` |
| `srcjs/graph/Graph.js` | `addEntry()`: how each action changes the graph |
| `srcjs/graph/GraphAtStep.js` | `initStepInfo()`, `updateFilteredStepsVisible()`: which actions are visible steps |
| `srcjs/layout/logEntry.js` | `statusForEntry()`: text shown for each action |
| `inst/reactlog/defaultLog.js`, `inst/log-files/` | Sample logs |

Read Shiny's R source on GitHub (the installed package only has compiled R
code), for example
`gh api repos/rstudio/shiny/contents/R/graph.R -H "Accept: application/vnd.github.raw"`.

## How Shiny records the log

`rLog` is created once when shiny loads (`RLog$new("shiny.reactlog", "shiny.reactlog.console")`).
Every reactive event calls a method on it, for example `rLog$define()`,
`rLog$enter()`, `rLog$dependsOn()`. Each method builds a list with `action` and
its own fields, then calls the private `appendEntry(domain, logEntry)`.

`appendEntry()`:

- Only stores the entry if `getOption("shiny.reactlog")` is `TRUE`
  (`isLogging()`).
- Adds two fields to every entry: `session` (the domain's `token`, or `NULL`
  when there is no session) and `time` (`as.numeric(Sys.time())`, seconds since
  the epoch, with decimals).
- Pushes it onto `logStack`, a `fastmap::faststack()`. The stack only grows
  until `reactlogReset()` or a restart.
- Always calls `domain$reactlog(logEntry)` when there is a session. In
  `ShinySession` this only matters for showcase mode: it sends `srcref` and
  `srcfile` to the browser to highlight code.

`shiny.reactlog.console = TRUE` also prints each entry as a message
(`MessageLogger`). That is separate from the stored log.

`reactlog()` returns `rLog$asList()`: the stack as a list with
`attr(, "version") <- "1"`. `reactlogShow()` passes it to
`reactlog::reactlog_show()`. The `/reactlog?s=<token>` endpoint
(`reactLogHandler()` in `R/middleware-shiny.R`) calls `renderReactlog(sessionToken)`,
which calls `reactlog::reactlog_render()` with that token.
`/reactlog/mark?s=<token>` and `reactlogAddMark()` add a `userMark` entry.

### Id strings

- `reactId`: `"r"` plus a global counter (`nextGlobalReactId()`), for example
  `"r26"`. Derived ids for `reactiveValues` are built from it:
  `names(r3)`, `reactiveValuesToList(r3)`,
  `reactiveValuesToList(r3, all.names = TRUE)`, and `r3$key`. Labels are built
  the same way from the parent label.
- Special ids: `rNoCtxReactId` (no current context) and `rDummyReactId`.
- `ctxId`: `"ctx"` plus the context id (`ctxIdStr()`), or `NULL` when empty.
- `value`: never the real object. `valueStr()` returns the output of
  `utils::str(value, max.level = 1)`, cut to 200 characters. For observers the
  value is `NULL`, so the string is `" NULL"`.
- `label`: cut to 250 characters by `shortenString()`.

## Actions and fields

Every entry has `action`, `session` (string or `null`) and `time` (number).
After loading in the browser it also has `step`. Extra fields per action, as
Shiny writes them:

| Action | Extra fields | Written by (`rLog$...`) |
| --- | --- | --- |
| `define` | `reactId`, `label`, `type`, `value` | `define()`, `defineNames()`, `defineAsList()`, `defineAsListAll()`, `defineKey()`, `defineObserver()` |
| `createContext` | `ctxId`, `label`, `type`, `prevCtxId`, `srcref`, `srcfile` | `createContext()` (from `Context$new` in `R/react.R`) |
| `dependsOn` | `reactId`, `depOnReactId`, `ctxId` | `dependsOn()`, `dependsOnKey()` |
| `dependsOnRemove` | `reactId`, `depOnReactId`, `ctxId` | `dependsOnRemove()`, `dependsOnKeyRemove()` |
| `enter` / `exit` | `reactId`, `ctxId`, `type` | `enter()` / `exit()` when `type != "isolate"` |
| `isolateEnter` / `isolateExit` | `reactId`, `ctxId` | `enter()` / `exit()` when `type == "isolate"` |
| `invalidateStart` / `invalidateEnd` | `reactId`, `ctxId`, `type` | `invalidateStart()` / `invalidateEnd()` when `type != "isolate"` |
| `isolateInvalidateStart` / `isolateInvalidateEnd` | `reactId`, `ctxId` | same methods when `type == "isolate"` |
| `valueChange` | `reactId`, `value` | `valueChange()` and its `Names`/`AsList`/`AsListAll`/`Key` forms |
| `invalidateLater` | `reactId`, `ctxId`, `millis` | `invalidateLater()` (from `shiny::invalidateLater()`) |
| `freeze` / `thaw` | `reactId` | `freezeReactiveVal()`, `freezeReactiveKey()` / `thawReactiveVal()`, `thawReactiveKey()` |
| `idle` | none | `idle()`, at the end of every flush (`session` is always `null`) |
| `asyncStart` / `asyncStop` | none | `ShinySession` `incrementBusyCount()` / `decrementBusyCount()` |
| `userMark` | none | `userMark()` |
| `updateNodeLabel` | `reactId`, `label` | nothing in current Shiny; only handled in JS |

Notes on fields:

- `type` on `define` is one of `observable`, `observer`, `reactiveVal`,
  `reactiveValuesNames`, `reactiveValuesAsList`, `reactiveValuesAsListAll`,
  `reactiveValuesKey` (see the commented `TypeType` in `logStates.js`). The JS
  only treats `observable` and `observer` as "middle/end" nodes.
- `type` on contexts, `enter`, and `invalidateStart` is the context type
  (`observable`, `observer`, `other`, `isolate`...). `initStepInfo()` skips
  `invalidateStart` entries with `type === "other"`.
- `srcref` is a 6-number vector from the label's `srcref` attribute, and
  `srcfile` a file name; both are `null` when missing. The viewer does not use
  them today.
- `time` drives the "Calculation Time" label: `Node.statusAdd()` stores the
  `enter` time per `ctxId` and `statusRemove()` on `exit` computes
  `(exit.time - enter.time) * 1000` ms. `Node` and `Edge` constructors throw if
  `time` or `session` is `undefined` (but `null` is fine; it shows as
  `"Global"`).
- The Flow types in `logStates.js` are not exact: `enter`/`exit` entries carry
  `type` but `LogEntryEnterType`/`LogEntryExitType` do not list it.

## Version and `reactlog_upgrade()`

Shiny sets `attr(log, "version") <- "1"` in `asList()`. `reactlog_render()`
calls `reactlog_upgrade()` (`R/version.R`) first. It stops if the attribute is
missing, returns the log unchanged for `"1"`, and stops for any other value.
Only version `"1"` exists. If the format ever changes in a breaking way, bump
the version in Shiny's `asList()` and add a conversion step here.

`reactlog_write()` does not call `reactlog_upgrade()`, and the browser never
sees the version (JSON drops R attributes).

## `reactlog_write()`

`reactlog_write(log, file = stdout(), session_token = NULL)` in
`R/showReactLog.R`:

1. If `session_token` is given, keeps entries where `x$session` is `NULL`
   (global entries such as `idle`) or equals the token. `Filter()` also drops
   the `version` attribute.
2. Calls `jsonlite::toJSON()` with the same options Shiny uses
   (`auto_unbox = TRUE`, `null = "null"`, `na = "null"`,
   `digits = getOption("shiny.json.digits", 16)`, `pretty = TRUE`, ...). `NULL`
   fields such as `ctxId`, `prevCtxId`, `srcref`, `session` become `null`.
3. Returns the JSON string when `file = NULL`, else writes UTF-8 text to `file`.

`reactlog_render()` puts that JSON in place of `__DATA__` in
`inst/reactlog/reactlog.html` (`window.__APP_DATA__ = __DATA__;`).

## How the browser assigns `step`

`srcjs/log/initStep.js` runs when imported. If `window.__APP_DATA__` exists it
replaces `window.log`. Then it sets `entry.step = i` for every entry.
`index.js` then sets `rlog.log = window.log`.

Because of this, `step` always equals the array index of the log that was
loaded (after session filtering). `GraphAtStep` depends on that: it reads
`this.log[step]` directly and replays entries `0..step` to build a graph.

## Sample logs

- `inst/reactlog/defaultLog.js` sets `window.log = [...]`. It is used when
  `reactlog.html` is opened directly, and by the website demo. It is the same
  file as `inst/log-files/log-crandash.js` and uses almost every action
  (including `createContext` with `srcref`, `freeze`/`thaw`, `userMark`).
- `inst/log-files/log-*.js` (`crandash`, `cranwhales`, `linear-multi`,
  `radiant`, `superzip`) are other version 1 logs in the same
  `window.log = [...]` form. Copy one over `defaultLog.js` to try it. Only
  `crandash` has `createContext` entries. None has `invalidateLater` or
  `updateNodeLabel`.

## Adding a new action

Both repos must change, and the reactlog side should ship first (or together)
so older reactlog versions are not fed an action they do not know.

In shiny (`R/graph.R` and the call site):

1. Add an `RLog` method that builds `list(action = "<name>", ...)` and calls
   `private$appendEntry(domain, ...)`. Add a `msg$log()` line for console output.
2. Call it from the reactive code. Pass the right `domain` so `session` is set.
3. If old reactlog versions cannot handle it, raise `reactlog_min_version` in
   `R/graph.R` and the reactlog version in shiny's DESCRIPTION.

In reactlog (`srcjs/`), then rebuild the bundle (`npm run build`) and commit
`inst/reactlog/reactlogAsset/`:

1. `log/logStates.js`: add the name to `states`, add a `LogEntry...Type`, add
   it to `LogEntryAnyType` (and `LogEntryHasReactId` if it has `reactId`), and
   export it.
2. `graph/Graph.js` `addEntry()`: add a `case` (even a no-op). Unknown actions
   hit `default` and log `console.error("unknown data.action: ", ...)`.
3. `graph/GraphAtStep.js` `initStepInfo()`: the second `switch` makes every
   action a visible step by `default`. Add it to the "skip" list if it should
   not be a stop for next/prev.
4. `graph/GraphAtStep.js` `updateFilteredStepsVisible()`: add a `case`. Its
   `default` throws `"unknown logEntry action in 'next'"` when a filter is on.
5. `layout/logEntry.js` `statusForEntry()`: add display text. Its `default`
   throws `not implemented for log status`.
6. Add a sample log with the new action to `inst/log-files/` if useful.

## Pitfalls

- **`invalidateLater` has no graph effect.** It is a status-bar step only;
  `Graph.addEntry()` ignores it. Shiny passes the raw `ctx$id` without the
  `"ctx"` prefix, so do not match its `ctxId` against other entries.
- **`updateNodeLabel` has no producer.** Shiny does not write it today; the JS
  handlers are left over. The comment in `Graph.js` shows an old `nodeId` field.
- **`step` is the index, not a saved field.** Do not filter or reorder
  `rlog.log` after `initStep.js` runs, or `this.log[step]` lookups break.
- **Session filtering keeps all global entries.** Entries with `session: null`
  (every `idle`, and anything made outside a session) stay in every
  per-session log.
- **`value` is text from `str()`**, cut to 200 characters, not the real value.
  When logging is off it is `"<reactlog is turned off>"`.
- **The log only grows.** Shiny keeps every entry in memory until
  `reactlogReset()` or restart, which is why `reactlog_disable()` warns.
