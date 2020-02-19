#' Enable or disable the reactlog
#'
#' Before the reactlog can be visualized, it needs to be enabled. For security
#' and performance reasons, you should not enable the reactlog in a shiny app
#' in production.
#' @param warn Should a warning message be shown?
#' @seealso \code{\link[reactlog]{reactlog_show}}
#' @name setReactLog

#' @export
#' @rdname setReactLog
reactlog_enable <- function() {
  options(shiny.reactlog = TRUE)
}

#' @export
#' @rdname setReactLog
reactlog_disable <- function(warn = TRUE) {
  if (!isTRUE(warn) && !isFALSE(warn)) {
    stop("'warn' must be either 'TRUE' or 'FALSE'")
  }

  options(shiny.reactlog = FALSE)
  if (isTRUE(warn)) {
    warning("Please restart R to free up 'reactlog' memory", call. = FALSE)
  }
}
