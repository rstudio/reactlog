# Reactlog

Reactlog shows how a Shiny application's reactive dependencies change as it runs.

* The [R package](pkg-r/) opens the reactive graph from a running Shiny app. [Try the demo](https://rstudio.github.io/reactlog/demo/reactlog.html).
* The [Python package](pkg-py/) turns a saved R or Python trace into an interactive HTML report.

The R viewer lives in `srcts/`. The standalone report viewer lives in `viewer/`, with its HTML and CSS in `pkg-py/src/reactlog/assets/`. Run `npm ci` and `npm run build` at the repository root to rebuild and test both bundles.
