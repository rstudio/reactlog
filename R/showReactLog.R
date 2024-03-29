


#' Reactive Log Visualizer
#'
#' Provides an interactive browser-based tool for visualizing reactive
#' dependencies and execution in your application.
#'
#' To use the reactive log visualizer, start with a fresh R session and
#' run the command \code{reactlog_enable()}; then launch your
#' application in the usual way (e.g. using [shiny::runApp()]). At
#' any time you can hit \preformatted{Ctrl+F3}
#' (or for Mac users, \preformatted{Cmd+F3}) in your
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
#' As an alternative to pressing \preformatted{Ctrl/Cmd+F3}--for example, if you
#' are using reactives outside of the context of a Shiny
#' application--you can run the [shiny::reactlogShow()] function, which will
#' generate the reactive log visualization as a static HTML file and
#' launch it in your default browser. In this case, refreshing your
#' browser will not load new activity into the report; you will need to
#' call [shiny::reactlogShow()] explicitly.
#'
#' For security and performance reasons, do not enable the reactlog
#' in production environments. When the option is
#' enabled, it's possible for any user of your app to see at least some
#' of the source code of your reactive expressions and observers.
#'
#' @param log Log produced by shiny to be processed
#' @param time A boolean that specifies whether or not to display the
#' time that each reactive takes to calculate a result.
#' @param ... Future parameter expansion. Currently ignored
#' @seealso [shiny::reactlogShow()] and
#' [reactlog::reactlog_enable()]
#' @export
#' @examples
#'
#' \dontrun{
#' library(shiny)
#' library(reactlog)
#'
#' # tell shiny to log reactivity
#' reactlog_enable()
#'
#' # run a shiny app
#' app <- system.file("examples/01_hello", package = "shiny")
#' runApp(app)
#'
#' # once app has closed, display reactlog
#' shiny::reactlogShow()
#' }

reactlog_show <- function(log, time = TRUE, ...) {
  file <- reactlog_render(log, time = as.logical(time), ...)
  utils::browseURL(file)
}

#' Write reactlog
#'
#' Write the reactlog to a file.  If a session token is provided, all reactive
#' interactions will be subsetted to either the global session or the
#' session provided.
#'
#' @param log produced by shiny to be written
#' @param file location of output file. If a \code{NULL} file is given, the
#'   json representation is return.
#' @param session_token Session token identifier to be used when subsetting the
#'   complete reactlog
#' @export
reactlog_write <- function(log, file = stdout(), session_token = NULL) {
  if (!is.null(session_token)) {
    log <- Filter(
      function(x) {
        is.null(x$session) || identical(x$session, session_token)
      },
      log
    )
  }
  json <- jsonlite::toJSON(
    log, pretty = TRUE,
    # from shiny pkg
    null = "null", na = "null",
    auto_unbox = TRUE, digits = getOption("shiny.json.digits", 16),
    use_signif = TRUE, force = TRUE, POSIXt = "ISO8601", UTC = TRUE,
    rownames = FALSE, keep_vec_names = TRUE, strict_atomic = TRUE
  )
  if (is.null(file)) {
    # return the json as a character string
    json
  } else {
    # write to the file connection
    write_utf8(json, file = file)
  }
}


write_utf8 <- function(x, file, ...) {
  writeLines(enc2utf8(x), file, ..., useBytes = TRUE)
}
