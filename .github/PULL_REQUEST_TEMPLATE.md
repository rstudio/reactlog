## Pull Request

Before you submit a pull request, please do the following:

* Add an entry to NEWS concisely describing what you changed.

* If appropriate, add unit tests in the tests/testthat directory.

* Run Build->Check Package in the RStudio IDE, or `devtools::check()`, to make sure your change did not add any messages, warnings, or errors.  (Known NOTE of large package size and sub-directories 'reactlogAsset' size.)

Doing these things will make it easier for the `shinyreactlog` development team to evaluate your pull request. Even so, we may still decide to modify your code or even not merge it at all. Factors that may prevent us from merging the pull request include:

* breaking backward compatibility
* adding a feature that we do not consider relevant for `shinyreactlog`
* is hard to understand
* is hard to maintain in the future
* is computationally expensive
* is not intuitive for people to use

We will try to be responsive and provide feedback in case we decide not to merge your pull request.

## Minimal reproducible example

Finally, Please include a minimal reprex. The goal of a reprex is to make it as easy as possible for me to recreate your problem so that I can fix it. If you've never heard of a reprex before, start by reading <https://github.com/jennybc/reprex#what-is-a-reprex>, and follow the advice further down the page. Do NOT include session info unless it's explicitly asked for, or you've used `reprex::reprex(..., si = TRUE)` to hide it away.

While you may not be able to submit true `reprex::reprex({#code})` due to the interactivity of shiny, a working [app.R script](http://shiny.rstudio.com/articles/app-formats.html#appr) containing the minimal elements to produce the error is highly appreciated.

Delete these instructions once you have read them.

---

Brief description of the problem

```r
library(shiny)
library(shinyreactlog)

options("shiny.reactlog" = TRUE)

ui <- # FILL IN UI
server <- function(input, output, session) {
  # FILL IN SERVER
}

shiny::shinyApp(ui = ui, server = server)
```


PR task list:
- [ ] Passes `devtools::check()`
- [ ] Add NEWS entry explaining change (reference PR#)
- [ ] Add tests (if appropriate)
- [ ] Update documentation with `devtools::document()`
