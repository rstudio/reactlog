---
title: "Architecture"
description: "How reactlog fits together: Shiny's recorded log, the R functions that inject it into an HTML template, and the JavaScript app that replays it as a cytoscape graph. Start here before working in R/ or srcts/."
---

# Architecture

`reactlog` has two halves:

- **R package** (`R/`): small. It takes the log that Shiny records while `options(shiny.reactlog = TRUE)` is set, turns it into JSON, and injects it into an HTML page.
- **JavaScript app** (`srcts/`): most of the code. A TypeScript single page app, bundled with esbuild, that replays the log step by step and draws the reactive graph with cytoscape + dagre.

The built bundle `inst/reactlog/reactlogAsset/reactlog.js` (and its `.map`) is committed. CRAN and `R-CMD-check` never run Node; the shared `routine` CI job runs `npm ci` + `npm run build` and commits any bundle changes back to the PR.

## R side

1. Shiny records log entries while `shiny.reactlog` is on (`reactlog_enable()` / `reactlog_disable()` in `R/setReactLog.R` just set that option). `shiny::reactlogShow()`, or Ctrl/Cmd+F3 in a running app, calls into this package.
2. `reactlog_render()` (`R/renderReactLog.R`):
   - checks the log's `version` attribute with `reactlog_upgrade()` (`R/version.R`; only version `"1"` exists),
   - turns the log into JSON with `reactlog_write()` (`R/showReactLog.R`), optionally keeping only one session plus global entries,
   - replaces placeholders in `inst/reactlog/reactlog.html`: `__DATA__` becomes the JSON, `__TIME__` the time flag, and the `defaultLog.js` script tag is removed,
   - writes a temp HTML file and copies `reactlogAsset/` next to it.
3. `reactlog_show()` opens that file in a browser.
4. `reactlog_module_ui()` / `reactlog_module_server()` (`R/shinyModule.R`) embed the viewer as an iframe that points at Shiny's own `reactlog?w=...&s=...` endpoint. The module needs the shiny version listed in DESCRIPTION `Suggests`, which `shiny_version_required()` reads at runtime, so keep that field accurate.

## Browser side (`srcts/`)

Entry point is `srcts/index.ts`, which wires DOM elements from `reactlog.html` to the modules below on page load.

- `log/initStep.ts` runs first on import. It takes `window.__APP_DATA__` (or `window.log` from `defaultLog.js`) and gives each entry `step = index`. `log/logStates.ts` lists every log `action` and its TypeScript types.
- `rlog.ts` is a shared mutable singleton (also `window._reactlog`) holding the log, the cytoscape instance, the `GraphAtStep`, and `curTick`. Most modules read and write state through it.
- `graph/Graph.ts` is the graph state built by applying log entries in order with `addEntry()`: nodes, edges, ghost edges, statuses, family-tree queries, filtering.
- `graph/GraphAtStep.ts` is the time-travel layer. It indexes special steps (idle, output calc, user marks, async) and rebuilds a `Graph` for any step by replaying the log from the start (`rawGraphAtStep`; the cache is commented out). `displayAtStep()` pushes the result into cytoscape.
- `updateGraph/` holds the navigation actions (next/prev step, idle, output calc, user mark, search, hover/sticky filter). They all end in `atTick()`, which redraws the graph, progress bar and log entry panel.
- `cyto/` has cytoscape setup, styles and event handlers. `layout/` has DOM pieces (keyboard shortcuts, progress bar, log entry panel).

## Fast JS dev loop without Shiny

`inst/reactlog/reactlog.html` loads `defaultLog.js` (which sets `window.log = [...]`) and then the bundle. Open that HTML file directly in a browser after building. To try a different log, copy one of `inst/log-files/log-*.js` over `inst/reactlog/defaultLog.js`.

## Website

The pkgdown site (`pkgdown/`, built by `.github/shiny-workflows/website.R`) copies `readme-images/` and `inst/reactlog/` into `pkgdown/assets/`, so the demo at `/demo/reactlog.html` is the committed bundle with `defaultLog.js`.

## Deep dives

| Doc | Covers |
| --- | --- |
| [logFormat.md](logFormat.md) | Every log action and its fields, the `version` attribute, how Shiny records entries |
| [graphReplay.md](graphReplay.md) | `Graph` / `GraphAtStep`, node and edge status, filtering, the cytoscape diff and layout |
| [viewerUi.md](viewerUi.md) | Page DOM, navigation actions, keyboard shortcuts, timeline, status panel |
| [shinyIntegration.md](shinyIntegration.md) | How shiny calls reactlog, the `/reactlog` endpoint, the module, tests |
| [jsBuild.md](jsBuild.md) | npm / esbuild / TypeScript toolchain, lint, the pre-commit hook |
| [ciAndRelease.md](ciAndRelease.md) | GitHub Actions, the pkgdown site, CRAN release files |
