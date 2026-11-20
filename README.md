# Reactlog

Reactlog shows how a Shiny application's reactive dependencies change as it runs.

* The [R package](pkg-r/) opens the reactive graph from a running Shiny app. [Try the demo](https://rstudio.github.io/reactlog/demo/reactlog.html).
* The [Python package](pkg-py/) turns a saved R or Python trace into an interactive HTML report.

Both packages open the same interactive report. The timeline, graph, HTML, and styles live in `viewer/`. Run `npm ci` and `npm run build-report` at the repository root to build the viewer for both packages.
