
reactlog_upgrade <- function(log, call = rlang::caller_env()) {
  version <- attr(log, "version")
  if (is.null(version)) {
    cli::cli_abort(c(
      "{.arg log} is missing a {.field version} attribute.",
      "i" = "Use {.fn shiny::reactlog} to get a log."
    ), call = call)
  }
  version <- as.character(version)
  if (identical(version, "1")) {
    return(log)
  }

  cli::cli_abort(c(
    "x" = "{.arg log} has version {.val {version}}.",
    "i" = "{.pkg reactlog} supports version {.val 1}."
  ), call = call)
}
