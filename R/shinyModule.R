

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
#' @param include_refresh should the iframe refresh button be included?
#' @seealso [shiny::moduleServer()]
#' @rdname reactlog_module
#' @export
#' @examples
#' if (requireNamespace("shiny", quietly = TRUE)) {
#'   library(shiny)
#'   # Enable reactlog
#'   reactlog_enable()
#'
#'   # Define UI for app that draws a histogram ----
#'   ui <- fluidPage(
#'     tags$h1("Pythagorean theorem"),
#'     numericInput("a", "A", 3),
#'     numericInput("b", "B", 4),
#'     "C:", verbatimTextOutput("c"),
#'   ### start ui module
#'     reactlog_module_ui()
#'   ### end ui module
#'   )
#'
#'   server <- function(input, output, session) {
#'     a2 <- reactive({a <- input$a; req(a); a * a}, label = "a^2")
#'     b2 <- reactive({b <- input$b; req(b); b * b}, label = "b^2")
#'     c2 <- reactive({a2() + b2()}, label = "c^2")
#'     c_val <- reactive({sqrt(c2())}, label = "c")
#'
#'     output$c <- renderText({
#'       c_val()
#'     })
#'
#'   ### start server module
#'     reactlog_module_server()
#'   ### end server module
#'
#'   }
#'
#'   if (interactive()) {
#'     shinyApp(ui = ui, server = server)
#'   }
#' }
reactlog_module_ui <- function(include_refresh = TRUE, id = "reactlog_module") {
  ns <- shiny::NS(id)
  shiny::tagList(
    if (isTRUE(include_refresh)) refresh_button(ns),
    shiny::uiOutput(ns("iframe"))
  )
}

refresh_button <- function(ns) {
  shiny::actionButton(
    ns("refresh"),
    "",
    icon = shiny::icon("arrows-rotate", lib = "font-awesome"),
    class = "btn-sm btn-warning"
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

        test_mode_txt <-
          if (isTRUE(getOption("shiny.testmode"))) {
            "&test=1"
          } else {
            ""
          }

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
          # nolint start: indentation_linter.
          htmltools::tags$script(htmltools::HTML(paste0("
            (function() {
              var src =
                'reactlog?w=' + window.escape(window.Shiny.shinyapp.config.workerId) +
                '&s=' + window.escape(window.Shiny.shinyapp.config.sessionId) + '",
                test_mode_txt, "';
              $('#", random_id, "').attr('src', src);
            })()
          ")))
          # nolint end
        )

      })

    }
  )
}


shiny_version_required <- function(
  suggests = read.dcf(
    system.file("DESCRIPTION", package = "reactlog")
  )[1, "Suggests"]
) {
  pkgs <- trimws(strsplit(suggests, ",")[[1]])
  shiny_version <- gsub("[^.0-9]", "", pkgs[grepl("^shiny([^.[:alnum:]]|$)", pkgs)])
  package_version(shiny_version)
}
test_shiny_version <- function() {
  tryCatch({
    utils::packageVersion("shiny") >= shiny_version_required()
  }, error = function(e) {
    # package not found
    FALSE
  })
}
assert_shiny_version <- function(call = rlang::caller_env()) {
  # Fail instead of asking to install; this runs at the start of a live session
  rlang::local_options(rlib_restart_package_not_found = FALSE)
  rlang::check_installed(
    "shiny",
    version = as.character(shiny_version_required()),
    call = call
  )
}


#' Reactlog widget Shiny module
#'
#' Displays a [reactlog_widget()] in the given application, filtered to the
#' current session. Unlike [reactlog_module_ui()], the log is sent through
#' Shiny's websocket, so it does not need the `reactlog` URL that Shiny serves.
#'
#' The log is read when the widget renders, after Shiny's first flush. Click
#' the refresh button to show newer entries. Each render sends the whole
#' reactlog page (about 600 KB) plus the log.
#'
#' @inheritParams reactlog_module_ui
#' @param width,height Size of the widget. Must be a valid CSS unit or a number.
#'   Unlike [reactlog_module_ui()], the size is set in the UI function, not the
#'   server function.
#' @seealso [reactlog_widget_output()]
#' @rdname reactlog_widget_module
#' @export
#' @examples
#' if (interactive()) {
#'   library(shiny)
#'   reactlog_enable()
#'
#'   ui <- fluidPage(
#'     numericInput("n", "n", 1),
#'     reactlog_widget_module_ui()
#'   )
#'   server <- function(input, output, session) {
#'     reactlog_widget_module_server()
#'   }
#'   shinyApp(ui, server)
#' }
reactlog_widget_module_ui <- function(
  include_refresh = TRUE,
  id = "reactlog_widget_module",
  width = "100%",
  height = "600px"
) {
  ns <- shiny::NS(id)
  shiny::tagList(
    if (isTRUE(include_refresh)) refresh_button(ns),
    reactlog_widget_output(ns("widget"), width = width, height = height)
  )
}

#' @rdname reactlog_widget_module
#' @export
reactlog_widget_module_server <- function(id = "reactlog_widget_module") {
  assert_shiny_version()

  shiny::moduleServer(
    id,
    function(input, output, session) {
      # Wait for the first flush so the first render shows a complete step
      ready <- shiny::reactiveVal(FALSE)
      session$onFlushed(function() ready(TRUE), once = TRUE)

      output$widget <- render_reactlog_widget({
        # trigger render refresh
        input$refresh
        shiny::req(ready())
        reactlog_widget(session_token = session$token)
      })
    }
  )
}
