

#' Reactlog Shiny Module
#'
#' Displays an iframe of the reactlog in the given application.
#'
#' State will not be preserved between refreshes.
#'
#' @param id \pkg{shiny} module id to use
#' @param ... parameters passed to [shiny::actionButton()]
#' @param text_init text to be displayed before the reactlog is displayed.
#'   Clicking the button will cause the reactlog to be loaded.
#' @param text_refresh text to be displayed once the reactlog has been displayed.
#'   Clicking the button will cause the reactlog to be reloaded.
#' @param width,height HTML attributes to be applied to the reactlog iframe
#' @param display_immediately should the reactlog iframe be displayed immediately?
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
#' ### start ui
#'   reactlog::reactlog_module_ui(id = "reactlog")
#' ### end ui
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
#' ### start server
#'   reactlog::reactlog_module_server()
#' ### end server
#'
#' }
#'
#' if (interactive()) {
#'   shinyApp(ui = ui, server = server)
#' }
reactlog_module_ui <- function(id = "reactlog", ...) {
  ns <- shiny::NS(id)
  shiny::tagList(
    shiny::actionButton(ns("button"), "", ...),
    shiny::uiOutput(ns("iframe"))
  )
}

#' @rdname reactlog_module
#' @export
reactlog_module_server <- function(
  id = "reactlog",
  text_init = "Display Reactlog",
  text_refresh = "Refresh Reactlog",
  width = "100%",
  height = 600,
  display_immediately = TRUE
) {

  assert_shiny_version()

  shiny::moduleServer(
    id,
    function(input, output, session) {
      # init label
      shiny::updateActionButton(session, "button", label = text_init)

      output$iframe <- shiny::renderUI({
        # trigger refresh
        button_val <- input$button
        if (!isTRUE(display_immediately)) {
          shiny::req(button_val > 0)
        }

        # update label
        shiny::updateActionButton(session, "button", label = text_refresh)

        random_id <- paste0(
          "reactlog_iframe_",
          as.hexmode(floor(stats::runif(1, 1, 16^7)))
        )

        htmltools::tagList(
          htmltools::tags$iframe(
            id = random_id,
            width = width,
            height = height),
          htmltools::tags$script(htmltools::HTML(paste0("
            (function() {
              var src =
                'reactlog?w=' + window.escape(window.Shiny.shinyapp.config.workerId) +
                '&s=' + window.escape(window.Shiny.shinyapp.config.sessionId);
              $('#", random_id, "').attr('src', src);
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
