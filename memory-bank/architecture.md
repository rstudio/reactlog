---
title: "Architecture"
description: "How reactlog fits together: Shiny's recorded log, the R functions that inject it into an HTML template, and the JavaScript app that replays it as a cytoscape graph. Start here before working in R/ or srcts/."
---

# Architecture

R package paths below are relative to `pkg-r/`. JavaScript source paths are relative to the repository root.

The report UI lives in `viewer/`. Both packages embed the same HTML, CSS and JavaScript in their output. Run `npm run build-report` at the repository root to update the installed assets in both packages.

## R and Python entry points

R checks the log version, filters by session through `reactlog_write()`, and embeds the JSON in the shared template. `reactlog_show()` opens the resulting HTML file. Shiny's live endpoint and iframe module serve the same self-contained file from `reactlog_render()`.

Python's `load_reactlog_json()` prepares a saved trace. `format_reactlog_html()` embeds it with the same viewer and optional source and video controls. The TypeScript viewer also reads raw event arrays from R and from its JSON import menu.

The cross-language Chromium test in `tests/test_report_parity.py` opens output from both installed packages. The pkgdown demo uses the R renderer with the cranwhales sample log.

## Original Cytoscape viewer (`srcts/`)

Entry point is `srcts/index.ts`, which wires DOM elements from `reactlog.html` to the modules below on page load.

- `log/initStep.ts` runs first on import. It takes `window.__APP_DATA__` (or `window.log` from `defaultLog.js`) and gives each entry `step = index`. `log/logStates.ts` lists every log `action` and its TypeScript types.
- `rlog.ts` is a shared mutable singleton (also `window._reactlog`) holding the log, the cytoscape instance, the `GraphAtStep`, and `curTick`. Most modules read and write state through it.
- `graph/Graph.ts` is the graph state built by applying log entries in order with `addEntry()`: nodes, edges, ghost edges, statuses, family-tree queries, filtering.
- `graph/GraphAtStep.ts` is the time-travel layer. It indexes special steps (idle, output calc, user marks, async) and rebuilds a `Graph` for any step by replaying the log from the start (`rawGraphAtStep`; the cache is commented out). `displayAtStep()` pushes the result into cytoscape.
- `updateGraph/` holds the navigation actions (next/prev step, idle, output calc, user mark, search, hover/sticky filter). They all end in `atTick()`, which redraws the graph, progress bar and log entry panel.
- `cyto/` has cytoscape setup, styles and event handlers. `layout/` has DOM pieces (keyboard shortcuts, progress bar, log entry panel).

## Fast JS dev loop without Shiny

`inst/reactlog/reactlog.html` loads `defaultLog.js` (which sets `window.log = [...]`) and then the bundle. Open that HTML file directly in a browser after building. To try a different log, copy one of `inst/log-files/log-*.js` over `inst/reactlog/defaultLog.js`.

## Deep dives

| Doc | Covers |
| --- | --- |
| [logFormat.md](logFormat.md) | Every log action and its fields, the `version` attribute, how Shiny records entries |
| [graphReplay.md](graphReplay.md) | `Graph` / `GraphAtStep`, node and edge status, filtering, the cytoscape diff and layout |
| [viewerUi.md](viewerUi.md) | Page DOM, navigation actions, keyboard shortcuts, timeline, status panel |
| [shinyIntegration.md](shinyIntegration.md) | How shiny calls reactlog, the `/reactlog` endpoint, the module, tests |
| [jsBuild.md](jsBuild.md) | npm / esbuild / TypeScript toolchain, lint, the pre-commit hook |
| [ciAndRelease.md](ciAndRelease.md) | GitHub Actions, the pkgdown site, CRAN release files |
