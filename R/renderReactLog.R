
#' @export
#' @rdname show_reactlog
#' @param session_token token to be used to subset which session is displayed.  Defaults to all sessions.
render_reactlog <- function(log, session_token = NULL, time = TRUE) {
  log <- upgrade_reactlog(log)

  template_file <- system.file("reactlog.html", package = "shinyreactlog")
  html <- paste(readLines(template_file, warn = FALSE), collapse = "\r\n")

  tc <- textConnection(NULL, "w")
  on.exit(close(tc))
  write_reactlog(log, tc, session_token)
  cat("\n", file = tc)
  flush(tc)

  html <- sub("__DATA__", paste(textConnectionValue(tc), collapse = "\r\n"), html, fixed = TRUE)
  html <- sub("__TIME__", paste0("\"", time, "\""), html, fixed = TRUE)
  html <- sub("<script src=\"defaultLog.js\"></script>", "", html, fixed = TRUE)

  file <- tempfile(fileext = ".html")
  writeLines(html, file)

  # copy js and style folder
  file.copy(
    system.file("reactlogAsset", package = "shinyreactlog"),
    dirname(file),
    recursive = TRUE
  )

  return(file)
}
