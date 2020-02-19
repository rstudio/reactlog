Please briefly describe your problem and what output you expect. If you have a question, please try using the [RStudio Community website](https://community.rstudio.com/c/shiny) first.

Please include a minimal reprex. The goal of a reprex is to make it as easy as possible for me to recreate your problem so that I can fix it. If you've never heard of a reprex before, start by reading <https://github.com/jennybc/reprex#what-is-a-reprex>, and follow the advice further down the page. Do NOT include session info unless it's explicitly asked for, or you've used `reprex::reprex(..., si = TRUE)` to hide it away.

While you may not be able to submit true `reprex::reprex({#code})` due to the interactivity of shiny, a working [app.R script](http://shiny.rstudio.com/articles/app-formats.html#appr) containing the minimal elements to produce the error is highly appreciated.

Delete these instructions once you have read them.

---

## Recording issue

Brief description of the problem.  This should show how shiny is not recording something properly.

```r
library(shiny)
library(reactlog)

reactlog_set()

ui <- # FILL IN UI
server <- function(input, output, session) {
  # FILL IN SERVER
}

shiny::shinyApp(ui = ui, server = server)
```

#### Interactive steps to produce bad reactlog recording

* Select A
* Click plot
* Show reactlog
* ...


-----------------

## Playback issue

Brief description of the problem.  Given that Shiny recorded it correctly, the reactlog provided by `shiny::reactlog()` is not being displaying properly.

Please attach a screenshot if appropriate.

```r
jsonlite::toJSON(shiny::reactlog(), pretty = TRUE, auto_unbox = TRUE)
```
