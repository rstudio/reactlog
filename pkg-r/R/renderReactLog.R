#' @export
#' @rdname reactlog_show
#' @param session_token token to be used to subset which session is displayed.
#'   Defaults to all sessions.
reactlog_render <- function(log, session_token = NULL, time = TRUE) {
  log <- reactlog_upgrade(log)
  json <- as.character(reactlog_write(log, file = NULL, session_token = session_token))
  # A trace label may contain HTML, including a closing script tag.
  json <- gsub("<", "\\u003c", json, fixed = TRUE)
  json <- gsub(">", "\\u003e", json, fixed = TRUE)
  json <- gsub("&", "\\u0026", json, fixed = TRUE)

  read_asset <- function(name) {
    path <- system.file("report", name, package = "reactlog", mustWork = TRUE)
    paste(readLines(path, encoding = "UTF-8", warn = FALSE), collapse = "\n")
  }
  html <- read_asset("reactlog.html")
  fields <- c(
    THEME = "dark", TITLE = "Shiny App", CALCULATION_TIME = if (isTRUE(time)) "true" else "false",
    CSS = read_asset("reactlog.css"), SCRIPT = read_asset("reactlog.js"),
    DATA = json, RAW_SOURCE = "null", SOURCE_HTML = "", VIDEO_TAB_BTN = "", VIDEO_PANEL = ""
  )
  # Substitute only in the template. Labels and source can contain placeholder names.
  slots <- gregexpr("__REACTLOG_([A-Z_]+)__", html, perl = TRUE)
  keys <- sub("^__REACTLOG_(.+)__$", "\\1", regmatches(html, slots)[[1]])
  stopifnot(all(keys %in% names(fields)))
  regmatches(html, slots) <- list(unname(fields[keys]))

  file <- tempfile(fileext = ".html")
  write_utf8(html, file = file)
  file
}
