---
title: "Viewer UI and navigation"
description: "The reactlog viewer page: DOM ids in reactlog.html, how srcjs/index.js wires them up, the navigation actions in srcjs/updateGraph/, every keyboard shortcut, the timeline, the status panel, mouse events on the graph, the test=1 query param, and the CSS/images. Read before changing buttons, shortcuts, the header, the timeline, or mouse behavior."
---

# Viewer UI and navigation

The viewer is one HTML page (`inst/reactlog/reactlog.html`) plus the bundle built from `srcjs/`. This doc covers what the user sees and how input (buttons, keys, mouse, timeline) turns into a new step on screen. For the overall data flow see [architecture.md](architecture.md). For how a step becomes a graph (statuses, filtering, cytoscape diff) see [graphReplay.md](graphReplay.md).

Key files:

| File | Role |
| --- | --- |
| `inst/reactlog/reactlog.html` | Page template: placeholders, header, timeline, graph, legend, hidden log panel |
| `srcjs/index.js` | On page load: builds `GraphAtStep`, binds buttons, legend colors, timeline ticks, resize, search, keys, first step |
| `srcjs/rlog.js` | Shared state: `curTick`, `getGraph`, `cyto`, `displayTimeOnNodes` |
| `srcjs/updateGraph/index.js` | Re-exports all navigation actions; `atTick` is also exported as `updateGraph` |
| `srcjs/updateGraph/atTick.js` | The one function every action ends in |
| `srcjs/updateGraph/step.js`, `tick.js`, `idle.js`, `outputCalc.js`, `userMarks.js` | Move to a step |
| `srcjs/updateGraph/buttons.js` | `button*` wrappers: try a move, else go to first/last step |
| `srcjs/updateGraph/searchString.js`, `hoverStickyFilterSearch.js` | Search box, hover, sticky (click), filter (double click) |
| `srcjs/updateGraph/resize.js` | Resize cytoscape and refit |
| `srcjs/layout/keydown.js` | All keyboard shortcuts (`onKeydown`) |
| `srcjs/layout/progressBar.js` | Timeline fill, ticks, click/drag to seek |
| `srcjs/layout/logEntry.js` | Step / time / session / status text and the raw JSON panel |
| `srcjs/cyto/cytoOn.js` | Mouse events on the graph (hover, tap, double click) |
| `srcjs/utils/queryString.js`, `srcjs/utils/shinytest.js` | Read `?test=1` |
| `inst/reactlog/reactlogAsset/` | `reactlog.css`, font CSS, `images/*.svg`, built `reactlog.js` |

## The HTML template

`reactlog.html` has an inline script that sets two globals inside a `try`:

- `window.__APP_DATA__ = __DATA__;` R replaces `__DATA__` with the log JSON.
- `window.__APP_TIME__ = String(__TIME__).toLowerCase() === "true";` R replaces `__TIME__` with `"TRUE"` or `"FALSE"` (quoted, from `reactlog_render(time =)` in `R/renderReactLog.R`).

When you open the raw template in a browser, `__DATA__` is an unknown name, the `try` swallows the error, and both globals stay unset. Then `log/initStep.js` uses `window.log` from `defaultLog.js`, and time display stays on. R also removes the `<script src="defaultLog.js">` tag.

DOM ids used by the JS:

| Id | Used by |
| --- | --- |
| `prevUserMarkButton`, `prevIdleButton`, `prevOutputCalcButton`, `prevStepButton`, `nextStepButton`, `nextOutputCalcButton`, `nextIdleButton`, `nextUserMarkButton` | `index.js` click bindings (images, class `navigationButton`) |
| `eventStepNum`, `eventStatus`, `eventTimeNum`, `eventSessionNum` | `logEntry.setContainers()` |
| `search` | `searchStringContainer()`, `keydown.js`, `cytoOn.js`, and `$("#search").val("")` in `hoverStickyFilterSearch.js` and `GraphAtStep.resetHoverStickyFilterSearch()` |
| `timeline`, `timeline-bg`, `timeline-fill` | `progressBar.setContainers()`, `addTimelineTicks()` |
| `cyto` | `cytoscapeInit.withContainer()` |
| `legendReady`, `legendCalculating`, `legendInvalidating`, `legendInvalidated`, `legendFrozen`, `legendRowInvalidated`, `legendRowFrozen` | `index.js` sets colors from `style/colors.js`; the Frozen row is shown only if the log has a `freeze` action |
| `logEntry` | Raw JSON of the current entry; hidden until `l` is pressed |

The button `title` attributes spell out the shortcuts (for example "Previous idle (⌥ ⇧ ←)"). Keep them in sync with `keydown.js`.

## Startup (`srcjs/index.js`)

Inside `$(function() {...})`:

1. `window._reactlog = rlog`; `rlog.log = window.log`; `rlog.cyto` is created (this also calls `cytoOn.addOnMethods`).
2. `rlog.getGraph = new GraphAtStep(rlog.log)`, `rlog.graph = getGraph.finalCompleteGraph`.
3. Bind the eight buttons to `updateGraph.button*`.
4. Legend colors; Frozen row check.
5. Timeline: `progressBar.setContainers`, then ticks (see below).
6. `logEntry.setContainers(...)` with `stepsVisible.length`.
7. `window` resize, debounced 250 ms (max wait 1000 ms), calls `updateGraph.resize()`.
8. `updateGraph.searchStringContainer($("#search"))`, `layoutKeydown.addKeydown($(document.body))`.
9. First view: `updateGraph.lastUserMark(cytoOpts) || updateGraph.nextIdle(cytoOpts)`. So it opens at the last user mark, or else the first idle step. `cytoOpts` has `fit: true` and a `stop` callback that sets `minZoom` to half the fitted zoom.

## Navigation actions (`srcjs/updateGraph/`)

Everything ends in `atTick(nextTick, cytoOptions)`: set `rlog.curTick`, call `rlog.getGraph.displayAtStep()`, then `progressBar.update()` and `logEntry.update()`. It always returns `true`. Inside the folder it is imported as `updateGraph` from `../updateGraph`.

"Step" below means a log index. Most moves only land on `getGraph.filteredStepsVisible` (steps that change the graph and pass the current filter). See [graphReplay.md](graphReplay.md) for how those lists are built.

| Action | File | What it does |
| --- | --- | --- |
| `nextStep` / `prevStep` | `step.js` | `getGraph.nextStep/prevStep(curTick)`; return `false` if it gives `-1` |
| `firstStep` / `lastStep` | `step.js` | First / last of `stepsVisible` (not the filtered list) |
| `nextTick` / `prevTick` | `tick.js` | `curTick + 1` / `- 1`, any log entry, even hidden ones |
| `nextIdle` / `prevIdle` | `idle.js` | `nextStepInArr` / `prevStepInArr` over `stepsIdle` |
| `firstIdle` / `lastIdle` | `idle.js` | Jump to first / last idle, not used by the UI |
| `nextOutputCalc` / `prevOutputCalc` | `outputCalc.js` | Same helpers over `stepsOutputCalc` |
| `nextStepInArr` / `prevStepInArr` | `outputCalc.js` | Find the next/prev array entry that is also in `filteredStepsVisible`; `false` if none |
| `nextUserMark` / `prevUserMark` | `userMarks.js` | Own loop over `stepsUserMark`; does not check `filteredStepsVisible` |
| `firstUserMark` / `lastUserMark` | `userMarks.js` | `false` when there are no marks |
| `button*` (8) | `buttons.js` | `move() \|\| firstStep()` (prev) or `move() \|\| lastStep()` (next) |
| `resize` | `resize.js` | `rlog.cyto.resize()` then `atTick(curTick, {fit: true, forceRedraw: true})` |

The `button*` functions take a `cytoOptions` argument but only `buttonPrevStep` / `buttonNextStep` pass it on.

Search, hover and filter (`hoverStickyFilterSearch.js`) each update a field on `GraphAtStep` and redraw the same `curTick`:

- `hoverData` / `hoverDataReset`: hover highlight.
- `stickyDatas` / `stickyDatasReset`: click highlight.
- `filterDatas`, `searchRegex`, their resets, and `resetHoverStickyFilterData`: change the visible set and redraw with `fit: true`. `searchRegexReset` also empties the search box.

`searchString.js` reads the `#search` box on every `input` event (`searchStringWith`):

- empty string: `searchRegexReset()`.
- 1 or 2 characters: ignored, unless it matches `/^r\d/` (a react id like `r3`).
- otherwise: the text is regex-escaped and passed to `searchRegex()`. `GraphAtStep.updateSearchRegex` tests node label and key, then edge `ghostKey`, then ghost edge key. No match resets the filter.

`searchStringWithData(obj)` puts an element's key (an `Edge`'s `ghostKey`) into the box and searches for it.

## Keyboard shortcuts (`srcjs/layout/keydown.js`)

`onKeydown` is bound to `document.body`. It checks `e.which`. If the event target is `#search`, only Esc is handled (it blurs the box); all other keys type normally.

| Key | Action |
| --- | --- |
| Right or Space | `buttonNextStep()`, only if `curTick < getGraph.maxStep` |
| Left | `buttonPrevStep()`, only if `curTick > 1` |
| Alt/Option + Right (or Space) | `buttonNextOutputCalc()`; if it returns false, falls through to next step |
| Alt/Option + Left | `buttonPrevOutputCalc()`; falls through to prev step |
| Alt/Option + Shift + Right (or Space) | `buttonNextIdle()`; else tries next output calc, else next step |
| Alt/Option + Shift + Left | `buttonPrevIdle()`; else prev output calc, else prev step |
| Shift + Right (or Space) | `nextTick()` (one raw log entry) |
| Shift + Left | `prevTick()` |
| End | `buttonNextMark()` (next user mark, else last step) |
| Home | `buttonPrevMark()` (prev user mark, else first step) |
| Esc | Undo selection, see below |
| s | Focus `#search` (deferred), `stopPropagation()` |
| l | Toggle `#logEntry` between `display: none` and `inline` |
| f | `updateGraph.resize()` (refit graph) |
| Up / Down | Nothing yet (TODO stubs when a filter is set) |

Esc order: if there is sticky data and a filter, and both hold the same react ids, clear everything (`resetHoverStickyFilterSearch`) and refit. If they differ, set sticky back to the filter set. If only sticky data, `stickyDatasReset()`. If only a filter, `searchRegexReset()`. Hover is not cleared by Esc (that code is commented out).

## Mouse on the graph (`srcjs/cyto/cytoOn.js`)

`addOnMethods(cyto)` binds three cytoscape events:

- `mouseover` (`onMouseOver`): after a 200 ms debounce, `hoverData(target.data())`. A one-time `mouseout` cancels the debounce, and calls `hoverDataReset()` only if the hover already fired. Ignored when the target is the canvas.
- `tap` (`onClick`): blurs `#search`. Two taps on the same target within 400 ms trigger a cytoscape `dblclick` event instead. A single tap on the background calls `stickyDatasReset()`; on an element, `stickyDatas([target.data()])`.
- `dblclick` (`onDblClick`, a custom event fired by `onClick`): on the background, `resetHoverStickyFilterData()`. On an element, `searchRegexReset()` then `searchStringWithData(target.data())`, so double click is really a search for that element's key.

`target.data()` is the `Node` / `Edge` / `GhostEdge` instance itself (see `cytoData` getters).

## Timeline (`srcjs/layout/progressBar.js`)

- `setContainers(timeline, fill)`: sets height (`timelineHeight` = 20 px), colors from `colors.progressBar`, fill top/bottom padding (`timelinePadding` = 3 px), and binds `mousedown mousemove` to `updateFromProgressBar`.
- `updateFromProgressBar`: only left button. Maps `e.pageX / offsetWidth` to an index in `stepsVisible` and calls `updateGraph(step)` if it changed. Dragging works because `mousemove` with the button held also seeks.
- `update()` (called by `atTick`): fill width is the position of `curTick` in `stepsVisible` (or the visible step before it) divided by `length - 1`. CSS animates width over 250 ms.
- `addTimelineTicks(container, color, steps, top)`: one absolutely placed `div.timeline-tick` per step. `index.js` adds output calc ticks (`colors.nodes.ready`, short: `top = 2 * timelinePadding`), idle ticks (`colors.progressBar.idle`, full height), and user mark ticks (`colors.progressBar.userMark`, full height) only if marks exist. Output calc and idle share the same green.

The timeline always uses `stepsVisible`, not the filtered list.

## Status panel (`srcjs/layout/logEntry.js`)

`setContainers` stores the elements and computes padding widths: longest session id, number of visible steps, and width of the last time value. `update()` (alias of `updateLogEntry`) fills:

- **Step**: 1-based position in `stepsVisible`. For a hidden step (reached with Shift+arrow) it shows `<last visible>_<entries after it>`, for example `12_3`; before any visible step, `0_<step>`.
- **Time**: `entry.time - firstTime` with 4 decimals plus `s` (Shiny records time in seconds). `firstTime` is the time of the first visible step.
- **Session**: `entry.session`, or `(Global)`.
- **Status**: `statusForEntry(entry)`, an HTML sentence per `LogStates` action, with labels wrapped in `<span class="monospaced">`. Unknown actions throw.
- `#logEntry`: `JSON.stringify` of the entry.

Node time labels are separate: `rlog.displayTimeOnNodes` is true unless `window.__APP_TIME__` is exactly `false`. `Node.cytoLabel` and `cytoLabelShort` (`srcjs/graph/Node.js`) add "Calculation Time" only for observers and observables when it is true.

## Query params and test mode

`parseQuery()` (`srcjs/utils/queryString.js`) turns `window.location.search` into an object. The only key read is `test`: `inTestMode = parseQuery().test === "1"` (`srcjs/utils/shinytest.js`). In test mode:

- the header time and session show `(shinytest)` (`logEntry.js`),
- `Node.calculationTimeStr` returns `(shinytest)`.

This keeps snapshots stable. `reactlog_module_server()` (`R/shinyModule.R`) adds `&test=1` to the iframe URL `reactlog?w=...&s=...` when `getOption("shiny.testmode")` is `TRUE`. `reactlog_show()` never sets it.

## CSS and images (`inst/reactlog/reactlogAsset/`)

- `reactlog.css` is hand-written and committed as is (Grunt only bundles JS; the vendor prefixes are already in the file). Layout: `#bodyContent` is a column flexbox (header, timeline, `#content`); `#statusHeader` is a row flexbox; `#legend` and `#logEntry` are absolute over the graph. `div` has `user-select: none`. `#search` uses `images/iconSearch.svg` as background. Some rules (`#description`, `#moveButtons`, `#cy`, `.timeline-cycle`, `.timeline-enterexit`, `.timeline-mark`, `#eventTimeSession*`) match no element in the current HTML.
- `fira-mono_source-sans-pro_latin-ext.css`: local font faces (Fira Mono for numbers, Source Sans Pro for text).
- `images/`: the eight button SVGs used by the HTML, `iconSearch.svg`, plus `next-end.svg` and `prev-start.svg`, which the HTML does not use. `vignettes/images/buttons/` holds the same ten SVG file names for the vignette.

## Adding a navigation action or shortcut

1. Write the move in a file under `srcjs/updateGraph/` (or an existing one). Compute the target step from `rlog.getGraph` lists, return `false` when there is nowhere to go, and finish with `updateGraph(step, cytoOptions)` from `../updateGraph`. Do not set `rlog.curTick` yourself.
2. Export it from `srcjs/updateGraph/index.js` (`export *` for a new file).
3. If it needs a button: add a `button*` wrapper in `buttons.js` with the first/last fallback, add an `<img class="navigationButton">` with an id, `alt`, and a `title` that names the key in `reactlog.html`, add the SVG to `reactlogAsset/images/`, and bind it in `index.js`.
4. For a key: add a branch in `onKeydown`. Mind the order: the arrow branches fall through when a move fails, and the target check for `#search` runs first. Pick a key not used above.
5. If the step list is new, add timeline ticks in `index.js` with `progressBar.addTimelineTicks`.
6. Update `vignettes/reactlog.Rmd` (Navigation Buttons / tips), then `npm run build` and commit the rebuilt `reactlog.js` and `.map`.

## Vignette vs code

`vignettes/reactlog.Rmd` lists arrows, Option+arrows, Option+Shift+arrows, Home/End, `l`, `s`, click, double click and Esc. Differences:

- The vignette says search starts at three characters. The code also searches 1-2 characters that look like a react id (`r` + digit).
- User marks are added in the Shiny app (not this repo) with `Ctrl/Cmd + Shift + F3` or `Ctrl/Cmd + F4`; Shiny accepts both.
- The vignette describes output calc marks as "short green" and idle marks as "tall green", which matches the code.

## Pitfalls

- `atTick` does not clamp, so callers must keep `curTick` within `0` to `log.length - 1` (`tick.js` does).
- Keys use the old `e.which` codes (for example `83` for `s`). Use the same style for new branches so the handler stays readable as one list.
- Letter shortcuts do not check modifiers, so Ctrl/Cmd + `s`, `l` or `f` also run them.
- Moves that use `filteredStepsVisible` (step, idle, output calc) respect the search filter; user marks, ticks, the timeline and `firstStep`/`lastStep` do not.
- The search box is cleared in two places (`searchRegexReset` and `GraphAtStep.resetHoverStickyFilterSearch`). Any reset clears the text the user typed.
- Double click searches with an unanchored regex of the key, so `r3` also matches `r30`, `r31`, and labels containing `r3`.
- After editing `srcjs/`, rebuild. The page loads only the committed `reactlogAsset/reactlog.js`.
