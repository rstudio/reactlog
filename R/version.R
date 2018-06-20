
upgrade_log <- function(log) {
  version <- attr(log, "version")
  version <- as.character(version)
  if (identical(version, "1")) {
    return(log)
  }
  stop("current versions understood: 1")
}
