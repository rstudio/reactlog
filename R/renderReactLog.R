
#' @export
#' @rdname reactlog_show
#' @param session_token token to be used to subset which session is displayed.  Defaults to all sessions.
reactlog_render <- function(log, session_token = NULL, time = TRUE) {
  log <- reactlog_upgrade(log)

  template_file <- system.file("reactlog.html", package = "reactlog")
  html <- paste(readLines(template_file, warn = FALSE), collapse = "\r\n")

  tmpfile <- file("")
  on.exit({
    close(tmpfile)
  })
  reactlog_write(log, tmpfile, session_token)

  fixed_sub <- function(...) {
    sub(..., fixed = TRUE)
  }

  # incomplete final line warning
  lines <- readLines(tmpfile, warn = FALSE, encoding = "UTF-8")

  html <- fixed_sub(
    "__DATA__", paste(lines, collapse = "\r\n"),
    fixed_sub(
      "__TIME__", paste0("\"", time, "\""),
      fixed_sub(
        "<script src=\"defaultLog.js\"></script>", "",
        html
      )
    )
  )

  file <- tempfile(fileext = ".html")
  writeLines(html, file)

  # copy js and style folder
  file.copy(
    system.file("reactlogAsset", package = "reactlog"),
    dirname(file),
    recursive = TRUE
  )

  return(file)
}
