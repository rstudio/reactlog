inst_reactlog_file <- function(file) {
  system.file(file.path("reactlog", file), package = "reactlog")
}
inst_reactlog_assets <- function() {
  inst_reactlog_file("reactlogAsset")
}


#' @export
#' @rdname reactlog_show
#' @param session_token token to be used to subset which session is displayed.
#'   Defaults to all sessions.
reactlog_render <- function(log, session_token = NULL, time = TRUE) {
  log <- reactlog_upgrade(log)

  template_file <- inst_reactlog_file("reactlog.html")
  # does not need utf8 support
  html <- paste(readLines(template_file, warn = FALSE), collapse = "\n")

  # get the json form of the lgo without writing to disk
  json_blob <- as.character(
    reactlog_write(log, file = NULL, session_token = session_token)
  )

  fixed_sub <- function(...) {
    sub(..., fixed = TRUE)
  }

  html <- fixed_sub(
    "__DATA__", paste(json_blob, collapse = "\n"),
    fixed_sub(
      "__TIME__", paste0("\"", time, "\""),
      fixed_sub(
        "<script src=\"defaultLog.js\"></script>", "",
        html
      )
    )
  )

  # check if shiny is even available
  if (requireNamespace("shiny")) {
    # add resource path to pkg files for shiny
    # (avoids warning of tmp folder moving around)
    shiny::addResourcePath(
      "reactlogAsset", # prefix
      inst_reactlog_assets()
    )
  }

  file <- tempfile(fileext = ".html")

  write_utf8(html, file = file)

  # copy js and style folder
  file.copy(
    inst_reactlog_assets(),
    dirname(file),
    recursive = TRUE
  )

  return(file)
}
