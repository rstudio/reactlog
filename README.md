# reactlog <a href='https://rstudio.github.io/reactlog/'><img src='man/figures/logo.svg' align="right" height="139" /></a>

<!-- badges: start -->
[![R build status](https://github.com/rstudio/reactlog/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/rstudio/reactlog/actions)
[![CRAN version](http://www.r-pkg.org/badges/version/reactlog)](https://cran.r-project.org/package=reactlog)
[![reactlog downloads per month](http://cranlogs.r-pkg.org/badges/reactlog)](http://www.rpackages.io/package/reactlog)
[![DOI](https://zenodo.org/badge/137799634.svg)](https://zenodo.org/badge/latestdoi/137799634)
[![RStudio community](https://img.shields.io/badge/community-reactlog-blue?style=social&logo=rstudio&logoColor=75AADB)](https://community.rstudio.com/tags/c/shiny/8/reactlog)
<!-- badges: end -->

<br><!-- space above image break only -->
<!-- [![Coverage status](https://codecov.io/gh/rstudio/reactlog/branch/main/graph/badge.svg)](https://codecov.io/github/rstudio/reactlog?branch=main) -->


<img src="http://rstudio.github.io/reactlog/readme-images/pythagoras.gif" style="border: 1px solid black; box-shadow: 5px 5px 5px #eee;" width="100%">

[Shiny](https://shiny.rstudio.com/) is an R package from RStudio that makes it incredibly easy to build interactive web applications with R.  Behind the scenes, Shiny builds a reactive graph that can quickly become intertwined and difficult to debug. **reactlog** provides a visual insight into that _black box_ of Shiny reactivity.

After logging the reactive interactions of a Shiny application, **reactlog** constructs a directed dependency graph of the Shiny's reactive state at any time point in the record. The **reactlog** dependency graph provides users with the ability to visually see if reactive elements are:
* Not utilized (never retrieved)
* Over utilized (called independently many times)
* Interacting with unexpected elements
* Invalidating all expected dependencies
* Freezing (and thawing), preventing triggering of future reactivity

<!-- For an introduction and examples, visit the [Shiny Dev Center](https://shiny.rstudio.com/). -->


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
reactlog_enable()

# run a shiny app
app <- system.file("examples/01_hello", package = "shiny")
runApp(app)

# once app has closed, display reactlog from shiny
shiny::reactlogShow()
```

Or while your Shiny app is running, press the key combination `Ctrl+F3` (Mac: `Cmd+F3`) to launch the **reactlog** application.

To mark a specific execution time point within your Shiny app, press the key combination `Ctrl+Shift+F3` (Mac: `Cmd+Shift+F3`). This will highlight a specific point in time in your reactlog.


#### Example

Here is a [demo](https://rstudio.github.io/reactlog/demo/reactlog.html) of the **reactlog** visualization applied to the [`cranwhales`](https://github.com/rstudio/cranwhales) shiny app.

[
<img src="http://rstudio.github.io/reactlog/readme-images/cranwhales.gif" style="border: 1px solid black; box-shadow: 5px 5px 5px #eee;" width="100%">
](https://rstudio.github.io/reactlog/demo/reactlog.html)

For more examples and explanation, see the [**reactlog** vignette](https://rstudio.github.io/reactlog/articles/reactlog.html#reactlog).


## Community Support

The best place to get help with Shiny and **reactlog** is [RStudio Community](https://community.rstudio.com/c/shiny/8).
If you're having difficulties with **reactlog**, feel free to [ask questions here](https://community.rstudio.com/new-topic?title=&category_id=8&tags=reactlog&body=%0A%0A%0A%20%20--------%0A%20%20%0A%20%20%3Csup%3EReferred%20here%20by%20%60reactlog%60%27s%20README%3C/sup%3E%0A&u=barret).
For bug reports, please use the **reactlog** [issue tracker](https://github.com/rstudio/reactlog/issues).


## Development

[![node version: 12.x](https://img.shields.io/badge/node-12.x-brightgreen.svg)](https://nodejs.org/en/)
[![yarn version: 1.x](https://img.shields.io/badge/yarn-1.x-257bac.svg)](https://classic.yarnpkg.com/lang/en/)
[![JavaScript type: flow](https://img.shields.io/npm/types/flow-typed.svg)](https://github.com/flow-typed/flow-typed)
[![cytoscape](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/cytoscape.svg)](https://js.cytoscape.org/)
[![@babel/preset-env](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/dev/@babel/preset-env.svg)](https://babeljs.io/)
[![webpack](https://img.shields.io/github/package-json/dependency-version/rstudio/reactlog/dev/webpack.svg)](https://webpack.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![linter: eslint](https://img.shields.io/badge/linter-eslint-3524ca.svg)](https://eslint.org/)


Please make sure you have [GitHub Large File Storage](https://git-lfs.github.com/), [Node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install) installed.

Installation script:

```bash
# install git lfs hooks
git lfs install

# install dependencies and build JavaScript
yarn install

# build on file change
yarn watch
```

By changing the file `'./inst/reactlog/defaultLog.js'` with the contents of any log file in `'./inst/log-files/'`, different default log files can be loaded.  Once the local JavaScript (`'./inst/reactlog/reactlogAsset/reactlog.js'`) has been built with `yarn build` or `yarn watch`, refresh `'./inst/reactlog/reactlog.html'` to avoid constantly spawning Shiny applications for testing.
