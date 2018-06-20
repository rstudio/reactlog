# Shiny Reactlog

*Travis:* [![Travis Build Status](https://travis-ci.org/schloerke/shinyreactlog.svg?branch=master)](https://travis-ci.org/schloerke/shinyreactlog)

<!-- *AppVeyor:* [![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/rstudio/shiny?branch=master&svg=true)](https://ci.appveyor.com/project/rstudio/shiny) -->

<!-- Shiny is a new package from RStudio that makes it incredibly easy to build interactive web applications with R. -->

<!-- For an introduction and examples, visit the [Shiny Dev Center](http://shiny.rstudio.com/). -->

<!-- If you have general questions about using Shiny, please use the [RStudio Community website](https://community.rstudio.com). For bug reports, please use the [issue tracker](https://github.com/rstudio/shiny/issues). -->

## Features

* Display the reactivity hierarchy graph of your shiny applications
* See how often elements of your shiny application are being processed
* Move throughout your reactive history to replay element interactions
* Highlight family trees within the reactive graph
* Filter on family trees within the reactive graph

## Installation

<!-- To install the stable version from CRAN, simply run the following from an R console:

```r
install.packages("shinyreactlog")
``` -->

For the latest version:

```r
source("https://install-github.me/schloerke/shinyreactlog")
```

## Usage


```r
library(shiny)
library(shinyreactlog)

options("shiny.reactlog" = TRUE)
app <- system.file("examples/01_hello", package = "shiny")
runApp(app)
showReactLog()
```

Or while your app is running, press the key combination Ctrl+F3 (or for Mac users, Cmd+F3) to launch the reactlog application.

To mark a specific execution time within your shiny app, press the key combination Ctrl+F4 (Mac: Cmd+F4) to highlight a specific time in your shiny app react log.

## Development notes

Please make sure you have [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/docs/install) installed.

Installation script:

```bash
# install dependencies and build javascript
yarn install

# build on file change
yarn run watch
```


## Guidelines for contributing

We welcome contributions to the **shinyreactlog** package. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines of how to contribute.

Please note that the 'shinyreactlog' project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By contributing to this project, you agree to abide by its terms.
