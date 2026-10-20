---
title: "Graph replay"
description: "How the JS app turns the log into a graph at any step: Graph.addEntry() per action, Node/Edge/GhostEdge, status objects and how they map to cytoscape classes and colors, GraphAtStep step indexes, hover/sticky/filter/search, and displayAtStep() diffing plus the dagre layout. Read before touching srcjs/graph/, srcjs/cyto/, or anything that changes what the graph shows at a step."
---

# Graph replay

The viewer never stores a graph per step. For every redraw it starts from an
empty `Graph`, applies log entries `0..k` with `Graph.addEntry()`, adds
hover/sticky/filter flags, pads the result with nodes and edges that only
appear later, and diffs that into the live cytoscape instance.

See [architecture.md](architecture.md) for the big picture,
[logFormat.md](logFormat.md) for the fields of each log action, and
[viewerUi.md](viewerUi.md) for buttons, keyboard, progress bar and the log
entry panel.

## Key files

| File | Role |
| --- | --- |
| `srcjs/updateGraph/atTick.js` | `atTick()` (also exported as `updateGraph`): sets `rlog.curTick`, calls `displayAtStep()`, updates progress bar and log entry |
| `srcjs/graph/GraphAtStep.js` | `GraphAtStep`: step indexes, `rawGraphAtStep()`, hover/sticky/filter state, `displayAtStep()` |
| `srcjs/graph/Graph.js` | `Graph`: `nodes`, `edges`, `edgesUnique`, `addEntry()`, family-tree queries, `filterGraphOnNodeIds()`, `cytoGraph` |
| `srcjs/graph/Node.js` | `Node`: statuses, labels, `cytoClasses` |
| `srcjs/graph/Edge.js`, `GhostEdge.js` | Live dependency edges and "ever existed" edges |
| `srcjs/graph/StatusArr.js` | Per-node stack of open enter/invalidate/isolate entries, `expectPrevStatus()` |
| `srcjs/graph/ActiveStateStatus.js` | `off` / `on` / `finished` state plus `activeStep` |
| `srcjs/graph/HoverStatus.js` | `state` (focused / notFocused), `sticky`, `selected`, `filtered` flags |
| `srcjs/updateGraph/hoverStickyFilterSearch.js`, `searchString.js` | Entry points that set hover/sticky/filter/search, then call `updateGraph()` |
| `srcjs/cyto/cytoOn.js` | Mouse events: hover, click (sticky), double click (filter) |
| `srcjs/cyto/cytoscapeInit.js` | Creates cytoscape with the ordered style list |
| `srcjs/cyto/cytoClasses.js`, `cytoStyle.js`, `srcjs/style/colors.js` | Class selectors, style objects, color values |
| `srcjs/cyto/layoutOptions.js` | dagre layout options |

## Data flow

```
navigation / hover / search  ->  atTick(k, cytoOptions)            (updateGraph/atTick.js)
  rlog.curTick = k
  rlog.getGraph.displayAtStep(k, rlog.cyto, cytoOptions)
    fullFilteredGraphAtStep(k)
      filteredGraphAtStep(k)
        rawGraphAtStep(k)            replay log[0..k] with Graph.addEntry()
        + hover / sticky flags       (family tree from finalFilteredGraph)
        + filter prune + "filtered"  flags
      + nodes / ghost edges from finalFilteredGraph not yet defined (isDisplayed = false)
    graph.cytoGraph                  headless cytoscape copy of the Graph
    diff with rlog.cyto, add / update / remove, then maybe run dagre
  progressBar.update(); logEntry.update()
```

## `Graph.addEntry()` per action

Entries with `reactId === "rNoCtx"` are skipped first.

| Action | Effect |
| --- | --- |
| `define` | `nodes.set(reactId, new Node(entry))` |
| `updateNodeLabel` | `node.label = label` |
| `valueChange` | `node.value = value`; `valueChangedStatus.setActiveAtStep(step)` |
| `invalidateStart` | Clears `activeStep` on the previous top of `activeInvalidateEnter`, pushes this id. For `observable` / `observer`, `invalidateStatus.setActiveAtStep(step)`. `statusAdd(entry)` |
| `enter` | Clears `activeStep` on the previous top of `activeNodeEnter`, pushes this id. `enterStatus.setActiveAtStep(step)`; for `observable` / `observer`, `invalidateStatus.reset()` (off). `statusAdd(entry)` |
| `isolateEnter`, `isolateInvalidateStart` | `statusAdd(entry)` only |
| `exit` | `enterStatus.reset()` on the top of `activeNodeEnter`, pop, and mark the new top active at this step |
| `invalidateEnd` | Clear active on the top of `activeInvalidateEnter`, pop, mark the new top active. Node: `invalidateStatus.toFinished()` and reset `valueChangedStatus` if on |
| `isolateInvalidateEnd` | Reset `valueChangedStatus` if on |
| (all four "end" actions) | `expectPrevStatus()` checks the last `statusArr` entry is the matching start action with the same `ctxId` (it throws if not), then `statusRemove()` |
| `dependsOn` | Skips empty `reactId`. Adds a `GhostEdge` under `ghostKey` if new, adds or reuses the `Edge` under `key`. `edge.status = "isolate"` if the dependent node's last status is `isolateEnter`, else `"normal"` |
| `dependsOnRemove` | Deletes the `Edge` by `key`. The ghost edge stays |
| `freeze` / `thaw` | `node.isFrozen = true / false` |
| `createContext`, `idle`, `asyncStart`, `asyncStop`, `userMark` | Nothing |
| anything else | `console.error("unknown data.action: ", ...)` |

`activeNodeEnter` and `activeInvalidateEnter` are stacks. Only the top node is
"active" (thick border); nodes lower in the stack stay "on".

`Node.statusAdd()` / `statusRemove()` also track `calculationTime`: `enter`
stores the start time per `ctxId`, `exit` computes milliseconds, and `enter` /
`invalidateStart` / `isolateInvalidateStart` clear it. It is shown in labels of
observers and observables when `rlog.displayTimeOnNodes` is true
(`window.__APP_TIME__` is not `false`), or as `(shinytest)` in test mode.

## Node, Edge, GhostEdge

- **`Node`** holds `reactId`, `label`, `type`, `session` (`null` becomes
  `"Global"`), `value`, `isFrozen`, `statusArr`, three `ActiveStateStatus`
  objects, `hoverStatus`, and `isDisplayed`. Cytoscape `id` is `reactId` with
  `$` replaced by `_`; `key` is the raw `reactId`. `cytoLabel` is the full
  label (value or calculation time on extra lines); `cytoLabelShort` is one
  line. Observers and observables start with `invalidateStatus` "finished".
- **`Edge`** is one live dependency in one context. `key` is
  `"<reactId> depends on <depOnReactId> in <ctxId>"`, so every new context
  makes a new edge. Arrow goes `source = depOnReactId` to `target = reactId`.
- **`GhostEdge`** is "this dependency has existed at some point".
  `edgesUnique` is keyed by `ghostKey` (`"<reactId> depends on <depOnReactId>"`,
  no context) and is never pruned by `dependsOnRemove`. `Graph.cytoGraph`
  drops a ghost edge when a live `Edge` with the same `ghostKey` exists, so on
  screen a ghost edge (thin dotted line) means "was a dependency earlier, not
  right now". Family-tree queries (`parentNodeIds`, `childrenNodeIds`,
  `ancestorNodeIds`, `decendentNodeIds`, `familyTreeNodeIds`) walk
  `edgesUnique`, so they cover all dependencies ever seen up to that step.

## Status objects

- **`StatusArr`**: a stack of `{action, ctxId}` entries. `Node.inEnter`,
  `inIsolate`, `inInvalidate`, `inIsolateInvalidate` check if any entry has
  that action.
- **`ActiveStateStatus`**: `state` is `"off"`, `"on"` or `"finished"`;
  `activeStep` is `-1` or the step that turned it on. `isActive` is
  `isOn && activeStep > 0`. `isActiveAtStep(k)` drives the pulse animation.
- **`HoverStatus`**: `state` (`"focused"` by default), `sticky`, `selected`,
  `filtered`. `HoverStatus.onFn(key)` / `offFn(key)` return setters used by
  `Graph.hoverStatusOnNodeIds()` and `Graph.highlightSelected()`.

## Status to class to color

`Node.cytoClasses` builds the class string. Styles are applied in the order
listed in `cytoscapeInit.js`, so later entries win (for example `nodeFrozen`
and `nodeHidden` override the fill colors).

| Class | When | Look (`cytoStyle.js`, `colors.js`) |
| --- | --- | --- |
| (default) | every node | fill `colors.nodes.ready` `#a3c586` (green) |
| `nodeStart` / `nodeMiddle` / `nodeEnd` | type is not observer/observable / `observable` / `observer` | polygon shape |
| `nodeEnter` | `inEnter` | fill `calculating` `#fcbf49` |
| `nodeEnterActive` | `enterStatus.isActive` | same fill, border 2.5 |
| `nodeInvalidateActive` | observer/observable, `invalidateStatus.isActive` | fill `invalidating` `#969696`, border 2.5 |
| `nodeInvalidate` | else if `invalidateStatus.isOn` | fill `invalidating` |
| `nodeInvalidateDone` | else if `isFinished` | fill `invalidated` `#d9d9d9` |
| `nodeIsolate` | `inIsolate` | dashed border |
| `nodeValueChanged` | `valueChangedStatus.isOn` | fill `invalidating` |
| `hoverNotFocused` / `hoverNotFocusedButSticky` | `hoverStatus.state` is notFocused (with or without sticky) | faded (`background-blacken` -0.75 / -0.35), grey border |
| `nodeSelected*` | `hoverStatus.selected` | border 4, full `cytoLabel_`, z-index 1000 |
| `nodeFiltered*` | `hoverStatus.filtered` | border 3, double size, larger font |
| `nodeFrozen` | `isFrozen` | fill `colors.frozen.default` `#2171b5` |
| `nodeHidden` | `!isDisplayed` (not yet defined at this step) | white fill, half opacity, raw `label` |

Edges: `edgeIsolate` (dashed) when `status === "isolate"`, plus
`hoverNotFocused*`, `edgeSelected`, `edgeHidden`. Ghost edges always get
`edgeGhost` (width 1, dotted, `haystack` curve) plus `edgeGhostHoverNotFocused*`,
`edgeGhostSelected`, `edgeHidden`. `nodeIsolateInvalidate` and
`stickyNotFocused` have styles but no code adds them.

A typical observer: light grey at define, dark grey while invalidating, yellow
while calculating, green after `exit`. Async actions change no node.

## `GraphAtStep` step indexes

`initStepInfo(log)` first skips leading entries: repeated `asyncStart` /
`asyncStop` / `idle` triples with `session === null`, and repeated `idle`s.
Then for each remaining entry:

- `stepsOutputCalc`: the `exit` step that empties the enter stack (a full
  top-level calculation finished).
- `stepsIdle`: `idle` steps not preceded by another `idle` (and never index 0).
- `stepsUserMark`: `userMark` steps.
- `stepsAsyncStart` / `stepsAsyncStop`: recorded, but nothing reads them.
- `steps`: every action except `define`, `invalidateEnd`,
  `isolateInvalidateStart/End`, `createContext`, `asyncStart/Stop`, `idle`,
  `userMark`. `invalidateStart` is also dropped when its `type` is `"other"` or
  when it sits between a `define` and an `invalidateEnd` of the same node
  (an `asyncStart` in between is allowed).
- `stepsVisible` = sorted union of `steps`, `stepsUserMark`, `stepsIdle`.

`filteredStepsVisible` equals `stepsVisible` with no filter. With a filter,
`updateFilteredStepsVisible()` keeps only steps whose `reactId` (and
`depOnReactId` for edges) is in `finalFilteredGraph`, keeps `userMark`s, and
keeps an `idle` only if the last kept step is not an `idle`. `nextStep()` /
`prevStep()` move through `filteredStepsVisible`. Steps equal log indexes
(`log/initStep.js`), so `this.log[step]` is valid.

## Hover, sticky, filter, search

`GraphAtStep` keeps `hoverData`, `stickyDatas` and `filterDatas`, plus two
whole-log graphs: `finalCompleteGraph` (built once, `rawGraphAtStep(log.length)`)
and `finalFilteredGraph` (a copy, pruned to the filter's family tree, rebuilt
only by `updateFilterDatas()`).

In `filteredGraphAtStep(k)`:

1. **Hover** (mouseover after 200 ms in `cytoOn.js`): if the hovered item
   exists at step `k`, its family tree from `finalFilteredGraph` is set focused
   and everything else notFocused; the item itself gets `selected`.
2. **Sticky** (single click; click on background clears): if any sticky item
   exists at `k`, its family tree gets `sticky`, the items get `selected`, and
   without a hover the sticky tree also becomes the focus.
3. **Filter**: the graph is pruned with `filterGraphOnNodeIds()` to the
   family tree of `filterDatas`, and the filter items get `filtered`.

Family trees come from the whole-log graph, so hovering highlights nodes that
are related at any time, not only at step `k`.

**Search** (`searchString.js`): an empty string resets everything; 1-2
characters are ignored unless they look like `r<digit>`; otherwise the text is
escaped into a `RegExp` and `updateSearchRegex()` tests it against node
`label` and `key` in `finalCompleteGraph`, then edge `ghostKey`, then ghost
edge `key`, stopping at the first group with matches. The matches become both
`stickyDatas` and `filterDatas`. Double click on an element searches for its
`key` (or `ghostKey` for an `Edge`); double click on the background calls
`resetHoverStickyFilterData()`. Filter and search calls pass `fit: true`.

## `rawGraphAtStep` cost

`rawGraphAtStep(k)` replays from entry 0 on every call, so each step change,
hover, click and resize costs O(k). The snapshot cache (every 250 entries) is
commented out. Family-tree queries also scan all of `edgesUnique` per node
visited, and `Graph.cytoGraph` builds a new headless cytoscape each redraw.

## `displayAtStep()`

1. `fullFilteredGraphAtStep(k)` adds every node and ghost edge from
   `finalFilteredGraph` that is missing at step `k`, with `isDisplayed = false`.
   All nodes that will ever exist are always in the layout, so positions stay
   stable while stepping.
2. Inside `cy.startBatch()` / `endBatch()`, `cy.nodes().diff(graphNodes)` and
   the same for edges (by cytoscape `id`):
   - right (new): `cy.add()`, set `cytoLabel_` / `cytoLabelShort_`, classes.
   - both: replace data, labels, classes; queue pulses with `flashClass`
     (`nodeStartBig` if `valueChangedStatus.isActiveAtStep(k)`,
     `nodeMiddleBig` / `nodeEndBig` if enter or invalidate is active at `k`).
   - left (gone): `cy.remove()`.
3. Layout is skipped (pulses run right away) when the number of added edges
   equals the number of removed edges, no node was added or removed, no
   non-observer node changed `value`, and `cytoOptions.forceRedraw` is not
   true. Otherwise the previous layout is stopped and a new one runs with
   `_assign({}, layoutOptions, cytoOptions, {eles, ready})`. `eles` is all
   elements sorted by `data().key` so dagre gives the same result each time;
   `ready` runs the queued pulses.

`layoutOptions`: `dagre`, `rankDir: "LR"`, `rankSep: labelWidth + 50` (400),
`ranker: "longest-path"`, `fit: false` (keep the user's zoom), `animate: true`
for 1000 ms. `cytoscapeInit.withContainer()` also uses it as the initial
layout. `resize()` calls `atTick(curTick, {fit: true, forceRedraw: true})`.

## Pitfalls

- **Every redraw replays the log.** Anything added to `addEntry()` or
  `filteredGraphAtStep()` runs once per entry per redraw. Keep it cheap.
- **`expectPrevStatus()` throws.** An end action without its matching start
  (same `ctxId`) on top of `statusArr` stops the replay.
- **Unknown actions only log.** `invalidateLater` is in `LogStates` but has no
  `case` in `addEntry()`, so it logs `console.error` on every replay that
  passes it. Add a `case` when adding a new log action, and also update
  `initStepInfo()` and `updateFilteredStepsVisible()` (the latter throws on
  unknown actions).
- **Layout skip uses counts only.** Swapping one edge for another (new
  `ctxId` each cycle) does not relayout. Use `forceRedraw: true` if a change
  must move nodes.
- **`fullFilteredGraphAtStep()` mutates `finalFilteredGraph`.** It sets
  `isDisplayed = false` on shared node and ghost edge objects (the code
  comment says so).
- **Copied nodes share `ActiveStateStatus`.** `new Graph(prior)` clones
  `statusArr` and `hoverStatus`, but the three `ActiveStateStatus` objects are
  shared, so mutating them on the copy also changes the source.
- **Style order matters.** A new class needs `cytoClasses.js`, `cytoStyle.js`,
  and a line at the right position in `cytoscapeInit.js`.
- **Search matches are substrings.** The regex is not anchored, so searching
  `r1` also matches `r10`, `r12`, and labels containing `r1`.
