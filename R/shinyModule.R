

#' Reactlog Shiny Module
#'
#' Displays an iframe of the reactlog in the given application.
#'
#' State will not be preserved between refreshes.
#' To open the reactlog at a particular step, be sure to mark your time points
#' with `Cmd+Shift+F3` (Windows: `Ctrl+Shift+F3`)
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
#' reactlog_enable()
#'
#' # Define UI for app that draws a histogram ----
#' ui <- fluidPage(
#'   tags$h1("Pythagorean theorem"),
#'   numericInput("a", "A", 3),
#'   numericInput("b", "B", 4),
#'   "C:", verbatimTextOutput("c"),
#' ### start ui module
#'   reactlog_module_ui()
#' ### end ui module
#' )
#'
#' server <- function(input, output, session) {
#'   a2 <- reactive({a <- input$a; req(a); a * a}, label = "a^2")
#'   b2 <- reactive({b <- input$b; req(b); b * b}, label = "b^2")
#'   c2 <- reactive({a2() + b2()}, label = "c^2")
#'   c_val <- reactive({sqrt(c2())}, label = "c")
#'
#'   output$c <- renderText({
#'     c_val()
#'   })
#'
#' ### start server module
#'   reactlog_module_server()
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

        random_id <- ns(paste0(
          "reactlog_iframe_",
          as.hexmode(floor(stats::runif(1, 1, 16^7)))
        ))
        htmltools::tagList(
          htmltools::tags$iframe(
            id = random_id,
            width = width,
            height = height,
            ...
          ),
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
  suggests <- read.dcf(system.file("DESCRIPTION", package = "reactlog"))[1, "Suggests"]
  pkgs <- strsplit(suggests, ",")[[1]]
  shiny_version <- gsub("[^.0-9]", "", pkgs[grepl("^shiny ", pkgs)])
  utils::packageVersion("shiny") >= package_version(shiny_version)
}
assert_shiny_version <- function() {
  if (!test_shiny_version()) {
    stop("`shiny` v1.5.0 or greater must be installed")
  }
}
