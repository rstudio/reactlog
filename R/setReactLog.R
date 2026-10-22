#' Enable or disable the reactlog
#'
#' Before the reactlog can be visualized, it needs to be enabled. For security
#' and performance reasons, you should not enable the reactlog in a shiny app
#' in production.
#' @param warn Should a warning message be shown?
#' @seealso [reactlog::reactlog_show()]
#' @name setReactLog
#' @export
#' @rdname setReactLog
reactlog_enable <- function() {
  options(shiny.reactlog = TRUE)
}

#' @export
#' @rdname setReactLog
reactlog_disable <- function(warn = TRUE) {
  if (!rlang::is_bool(warn)) {
    cli::cli_abort(
      "{.arg warn} must be {.code TRUE} or {.code FALSE}, not {.obj_type_friendly {warn}}."
    )
  }

  options(shiny.reactlog = FALSE)
  if (isTRUE(warn)) {
    cli::cli_warn("Please restart R to free up {.pkg reactlog} memory.")
  }
}
