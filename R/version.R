
upgrade_reactlog <- function(log) {
  version <- attr(log, "version")
  if (is.null(version)) {
    stop("'log' is missing a 'version' attribute.  This is required.")
  }
  version <- as.character(version)
  if (identical(version, "1")) {
    return(log)
  }

  stop("Versions available: 1\nLatest reactlog version: 1\nVersion provided: ", version)
}
