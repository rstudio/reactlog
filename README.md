# reactlog

[![Travis Build Status](https://travis-ci.org/rstudio/reactlog.svg?branch=master)](https://travis-ci.org/rstudio/reactlog)
[![CRAN version](http://www.r-pkg.org/badges/version/reactlog)](https://cran.r-project.org/package=reactlog)
[![](http://cranlogs.r-pkg.org/badges/reactlog)](http://www.rpackages.io/package/reactlog)
[![DOI](https://zenodo.org/badge/137799634.svg)](https://zenodo.org/badge/latestdoi/137799634)
[![code style: lintr](https://img.shields.io/badge/linter-lintr-198CE7.svg)](https://eslint.org/)
<br/><!-- single line break only -->
[![node version: 11.x](https://img.shields.io/badge/node-11.x-brightgreen.svg)](https://nodejs.org/en/)
[![yarn version: 1.13.0](https://img.shields.io/badge/yarn-1.13.0-257bac.svg)](https://yarnpkg.com/en/)
[![JavaScript type: flow](https://img.shields.io/npm/types/flow-typed.svg)](https://github.com/flow-typed/flow-typed)
[![cytoscape version: 1.13.0](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/cytoscape.svg)](http://js.cytoscape.org/)
[![@babel/preset-env](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/dev/@babel/preset-env.svg)](https://babeljs.io/)
[![webpack](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/dev/webpack.svg)](https://webpack.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![linter: eslint](https://img.shields.io/badge/linter-eslint-3524ca.svg)](https://eslint.org/)



<!-- [![Coverage status](https://codecov.io/gh/rstudio/reactlog/branch/master/graph/badge.svg)](https://codecov.io/github/rstudio/reactlog?branch=master) -->


![](man/figures/pythagoras.png)


[Shiny](http://shiny.rstudio.com/) is an R package from RStudio that makes it incredibly easy to build interactive web applications with R.  Behind the scenes, Shiny builds a reactive graph that can quickly become intertwined and difficult to debug. **reactlog** provides a visual insight into that _black box_ of Shiny reactivity.

After logging the reactive interactions of a Shiny application, **reactlog** constructs a directed dependency graph of the Shiny's reactive state at any time point in the record. The **reactlog** dependency graph provides users with the ability to visually see if reactive elements are:
* Not utilized (never retrieved)
* Over utilized (called independently many times)
* Interacting with unexpected elements
* Invalidating all expected dependencies
* Freezing (and thawing), preventing triggering of future reactivity

<!-- For an introduction and examples, visit the [Shiny Dev Center](http://shiny.rstudio.com/). -->


## Major Features

There are many subtle features hidden throughout **reactlog**. Here is a short list quickly describing what is possible within **reactlog**:

* Display the reactivity dependency graph of your Shiny applications
* Navigate throughout your reactive history to replay element interactions
* Highlight reactive family trees
* Filter on reactive family trees
* Search for reactive elements

For a more in-depth explanation of **reactlog**, please visit the [**reactlog** vignette](https://rstudio.github.io/reactlog/articles/reactlog.html).

## Installation

To install the stable version from CRAN, run the following from an R console:

```r
install.packages("reactlog")
```

For the latest development version:

```r
remotes::install_github("rstudio/reactlog")
```

## Usage


```r
library(shiny)
library(reactlog)

# tell shiny to log all reactivity
options(shiny.reactlog = TRUE)

# run a shiny app
app <- system.file("examples/01_hello", package = "shiny")
runApp(app)

# once app has closed, display reactlog from shiny
shiny::showReactLog()
```

Or while your Shiny app is running, press the key combination `Ctrl+F3` (Mac: `Cmd+F3`) to launch the **reactlog** application.

To mark a specific execution time point within your Shiny app, press the key combination `Ctrl+F4` (Mac: `Cmd+F4`). This will highlight a specific point in time in your reactlog.


#### Example

Here is a [demo](https://rstudio.github.io/reactlog/demo/reactlog.html) of the **reactlog** visualization applied to the [`cranwhales`](https://github.com/rstudio/cranwhales) shiny app.

[![](man/figures/cranwhales.gif)](https://rstudio.github.io/reactlog/demo/reactlog.html)

For more examples and explanation, see the [**reactlog** vignette](https://rstudio.github.io/reactlog/articles/reactlog.html#reactlog).


## Help

If you have general questions about using **reactlog**, please use the [RStudio Community website](https://community.rstudio.com/c/shiny). For bug reports, please use the **reactlog** [issue tracker](https://github.com/rstudio/reactlog/issues).


## Development

Please make sure you have [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install) installed.

Installation script:

```bash
# install dependencies and build JavaScript
yarn install

# build on file change
yarn watch
```

By changing the file `'./inst/reactlog/defaultLog.js'` with the contents of any log file in `'./inst/log-files/'`, different default log files can be loaded.  Once the local JavaScript (`'./inst/reactlog/reactlogAsset/reactlog.js'`) has been built with `yarn build` or `yarn watch`, refresh `'./inst/reactlog/reactlog.html'` to avoid constantly spawning Shiny applications for testing.


## Guidelines for contributing

We welcome contributions to the **reactlog** package. Please see our [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for detailed guidelines of how to contribute.

Please note that the **reactlog** project is released with a [Contributor Code of Conduct](.github/CODE_OF_CONDUCT.md). By contributing to this project, you agree to abide by its terms.
