

#' Reactlog Shiny Module
#'
#' Displays an iframe of the reactlog in the given application.
#'
#' State will not be preserved between refreshes.
#'
#' @param id \pkg{shiny} module id to use
#' @param ... parameters passed to [shiny::actionButton()]
#' @param width,height HTML attributes to be applied to the reactlog iframe
#' @param include_refresh should the ifram refresh button be included?
#' @seealso [shiny::moduleServer()]
#' @rdname reactlog_module
#' @export
#' @examples
#' if (!require("shiny")) {
#'   message("`shiny` required to run example")
#'   return()
#' }
#'
#' library(shiny)
#' # Enable reactlog
#' reactlog::reactlog_enable()
#'
#' # Define UI for app that draws a histogram ----
#' ui <- fluidPage(
#'   titlePanel("Hello Shiny!"),
#'   sidebarLayout(
#'     sidebarPanel(
#'       sliderInput(inputId = "bins", label = "Number of bins:",
#'                   min = 1, max = 50, value = 30)
#'     ),
#'     mainPanel(plotOutput(outputId = "distPlot"))
#'   ),
#' ### start ui module
#'   reactlog::reactlog_module_ui(id = "reactlog")
#' ### end ui module
#' )
#'
#' server <- function(input, output, session) {
#'
#'   output$distPlot <- renderPlot({
#'     x    <- faithful$waiting
#'     bins <- seq(min(x), max(x), length.out = input$bins + 1)
#'     hist(x, breaks = bins, col = "#75AADB", border = "white",
#'         xlab = "Waiting time to next eruption (in mins)",
#'         main = "Histogram of waiting times")
#'   })
#'
#' ### start server module
#'   reactlog::reactlog_module_server()
#' ### end server module
#'
#' }
#'
#' if (interactive()) {
#'   shinyApp(ui = ui, server = server)
#' }
reactlog_module_ui <- function(include_refresh = TRUE, id = "reactlog_module") {
  ns <- shiny::NS(id)
  shiny::tagList(
    if (isTRUE(include_refresh))
      shiny::actionButton(
        ns("refresh"),
        "",
        icon = shiny::icon("refresh"),
        class = "btn-sm btn-warning"
      ),
    shiny::uiOutput(ns("iframe"), inline = TRUE)
  )
}

#' @rdname reactlog_module
#' @export
reactlog_module_server <- function(
  id = "reactlog_module",
  width = "100%",
  height = 600,
  ...
) {

  assert_shiny_version()

  shiny::moduleServer(
    id,
    function(input, output, session) {
      ns <- shiny::NS(id)

      output$iframe <- shiny::renderUI({
        # trigger render refresh
        input$refresh

        random_id <- paste0(
          "reactlog_iframe_",
          as.hexmode(floor(stats::runif(1, 1, 16^7)))
        )

        htmltools::tagList(
          htmltools::tags$iframe(
            id = ns(random_id),
            width = width,
            height = height,
            ...
          ),
          htmltools::tags$script(htmltools::HTML(paste0("
            (function() {
              var src =
                'reactlog?w=' + window.escape(window.Shiny.shinyapp.config.workerId) +
                '&s=' + window.escape(window.Shiny.shinyapp.config.sessionId);
              $('#", ns(random_id), "').attr('src', src);
            })()
          ")))
        )

      })

    }
  )
}


test_shiny_version <- function() {
  utils::packageVersion("shiny") >= "1.4.0.9003"
}
assert_shiny_version <- function() {
  if (!test_shiny_version()) {
    stop("`shiny` v1.5.0 or greater must be installed")
  }
}
