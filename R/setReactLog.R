#' Set reactlog to be enabled or disabled
#'
#' Before the reactlog can be visualized, it needs to be enabled. It's recommended
#' to disable the reactlog when deploying a shiny app in production.
#' @param enabled whether to enable the reactlog (default) or disable it.
#' @seealso \code{\link[reactlog]{reactlog_show}}
#' @export
reactlog_set <- function(enabled = TRUE) {
  if (!identical(enabled, TRUE) && !identical(enabled, FALSE)) {
    stop("'enabled' must be either 'TRUE' or 'FALSE'.")
  }
  options(shiny.reactlog = enabled)
}
