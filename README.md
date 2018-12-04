# reactlog

[![Travis Build Status](https://travis-ci.org/rstudio/reactlog.svg?branch=master)](https://travis-ci.org/rstudio/reactlog) [![Coverage status](https://codecov.io/gh/rstudio/reactlog/branch/master/graph/badge.svg)](https://codecov.io/github/rstudio/reactlog?branch=master)
[![CRAN version](http://www.r-pkg.org/badges/version/reactlog)](https://cran.r-project.org/package=reactlog)


[Shiny](http://shiny.rstudio.com/) is an R package from RStudio that makes it incredibly easy to build interactive web applications with R.  The complexity of the reactive elements within a shiny application can quickly become complicated and are difficult to debug.  `reactlog` provides a visual debugger for shiny reactivity.  After logging the reactive interactions of a shiny application, `reactlog` visualizes the shiny reaction state at any time point in the record.

The `reactlog` dependency graph provides users with the ability to visually see if reactive elements are:
* not utilized (never retrieved)
* over utilized (called independently many times)
* interacting with unexpected elements
* invalidating all expected dependencies
* freezing (and thawing), preventing triggering of future reactivity

<!-- For an introduction and examples, visit the [Shiny Dev Center](http://shiny.rstudio.com/). -->

If you have general questions about using `reactlog`, please use the [RStudio Community website](https://community.rstudio.com/c/shiny). For bug reports, please use the `reactlog` [issue tracker](https://github.com/rstudio/reactlog/issues).

## Features

* Display the reactivity dependency graph of your shiny applications
* See how often elements of your shiny application are being processed
* Move throughout your reactive history to replay element interactions
* Highlight family trees within the reactive graph
* Filter on family trees within the reactive graph

## Installation

<!-- To install the stable version from CRAN, simply run the following from an R console:

```r
install.packages("reactlog")
``` -->

For the latest version:

<!-- cant use install-github.me, fails on recursion install -->

```r
devtools::install_github("rstudio/reactlog")
```

## Usage


```r
library(shiny)
library(reactlog)

# tell shiny to log reactivity
options("shiny.reactlog" = TRUE)

# run a shiny app
app <- system.file("examples/01_hello", package = "shiny")
runApp(app)

# once app has closed, display reactlog
show_reactlog()
```

Or while your shiny app is running, press the key combination `Ctrl+F3` (Mac: `Cmd+F3`) to launch the reactlog application.

To mark a specific execution time point within your shiny app, press the key combination Ctrl+F4 (Mac: Cmd+F4). This will highlight a specific point in time in your reactlog.

## Development

Please make sure you have [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install) installed.

Installation script:

```bash
# install dependencies and build javascript
yarn install

# build on file change
yarn watch
```

By changing the file `'./inst/defaultLog.js'` with the contents of any log file in `'./inst/log-files/'`, different default log files can be loaded.  Once the local js (`'./inst/reactlogAsset/reactlog.js'`) has been built with `yarn build` or `yarn watch`, refresh `'./inst/reactlog.html'` to avoid constantly spawning shiny applications for testing.


## Guidelines for contributing

We welcome contributions to the **reactlog** package. Please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for detailed guidelines of how to contribute.

Please note that the 'reactlog' project is released with a [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md). By contributing to this project, you agree to abide by its terms.
