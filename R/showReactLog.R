


#' Reactive Log Visualizer
#'
#' Provides an interactive browser-based tool for visualizing reactive
#' dependencies and execution in your application.
#'
#' To use the reactive log visualizer, start with a fresh R session and
#' run the command \code{options(shiny.reactlog=TRUE)}; then launch your
#' application in the usual way (e.g. using \code{\link[shiny]{runApp}}). At
#' any time you can hit Ctrl+F3 (or for Mac users, Command+F3) in your
#' web browser to launch the reactive log visualization.
#'
#' The reactive log visualization only includes reactive activity up
#' until the time the report was loaded. If you want to see more recent
#' activity, refresh the browser.
#'
#' Note that Shiny does not distinguish between reactive dependencies
#' that "belong" to one Shiny user session versus another, so the
#' visualization will include all reactive activity that has taken place
#' in the process, not just for a particular application or session.
#'
#' As an alternative to pressing Ctrl/Command+F3--for example, if you
#' are using reactives outside of the context of a Shiny
#' application--you can run the \code{showReactLog} function, which will
#' generate the reactive log visualization as a static HTML file and
#' launch it in your default browser. In this case, refreshing your
#' browser will not load new activity into the report; you will need to
#' call \code{showReactLog()} explicitly.
#'
#' For security and performance reasons, do not enable
#' \code{shiny.reactlog} in production environments. When the option is
#' enabled, it's possible for any user of your app to see at least some
#' of the source code of your reactive expressions and observers.
#'
#' @param log Log produced by shiny to be processed
#' @param time A boolean that specifies whether or not to display the
#' time that each reactive.
#' @param ... Future parameter expansion. Currently ignored
#' @export
#' @examples
#'
#' library(shiny)
#' library(shinyreactlog)
#'
#' # tell shiny to log reactivity
#' options("shiny.reactlog" = TRUE)
#'
#' \dontrun{
#' # run a shiny app
#' app <- system.file("examples/01_hello", package = "shiny")
#' runApp(app)
#'
#' # once app has closed, display reactlog
#' show_reactlog()
#' }

show_reactlog <- function(log, time = TRUE, ...) {
  file <- render_reactlog(log, time = as.logical(time), ...)
  utils::browseURL(file)
}



write_reactlog <- function(log, file=stdout(), session_token = NULL) {
  if (!is.null(session_token)) {
    log <- Filter(
      function(x) {
        is.null(x$session) || identical(x$session, session_token)
      },
      log
    )
  }
  json <- jsonlite::toJSON(
    log, prett = TRUE,
    # from shiny pkg
    null = "null", na = "null",
    auto_unbox = TRUE, digits = getOption("shiny.json.digits", 16),
    use_signif = TRUE, force = TRUE, POSIXt = "ISO8601", UTC = TRUE,
    rownames = FALSE, keep_vec_names = TRUE, strict_atomic = TRUE
  )
  cat(json, file = file)
}
