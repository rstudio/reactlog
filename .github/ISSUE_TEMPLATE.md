Please briefly describe your problem and what output you expect. If you have a question, please try using the [RStudio Community website](https://community.rstudio.com/c/shiny) first.

Please include a minimal reprex. The goal of a reprex is to make it as easy as possible for me to recreate your problem so that I can fix it. If you've never heard of a reprex before, start by reading <https://github.com/jennybc/reprex#what-is-a-reprex>, and follow the advice further down the page. Do NOT include session info unless it's explicitly asked for, or you've used `reprex::reprex(..., si = TRUE)` to hide it away.

While you may not be able to submit true `reprex::reprex({#code})` due to the interactivity of shiny, a working [app.R script](http://shiny.rstudio.com/articles/app-formats.html#appr) containing the minimal elements to produce the error is highly appreciated.

Delete these instructions once you have read them.

---

Brief description of the problem

```r
library(shiny)
library(reactlog)

options("shiny.reactlog" = TRUE)

ui <- # FILL IN UI
server <- function(input, output, session) {
  # FILL IN SERVER
}

shiny::shinyApp(ui = ui, server = server)
```
