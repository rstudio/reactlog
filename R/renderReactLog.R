
renderReactLog <- function(log, sessionToken = NULL, time = TRUE) {
  upgrade_log(log)

  templateFile <- system.file("www/reactive-graph.html", package="shiny")
  html <- paste(readLines(templateFile, warn=FALSE), collapse="\r\n")
  tc <- textConnection(NULL, "w")
  on.exit(close(tc))
  writeReactLog(log, tc, sessionToken)
  cat("\n", file=tc)
  flush(tc)

  html <- sub("__DATA__", paste(textConnectionValue(tc), collapse="\r\n"), html, fixed=TRUE)
  html <- sub("__TIME__", paste0("\"", time, "\""), html, fixed=TRUE)
  html <- sub("<script src=\"reactLog/defaultLog.js\"></script>", "", html, fixed = TRUE)

  file <- tempfile(fileext = ".html")
  writeLines(html, file)

  # copy js and style files
  file.copy(
    system.file("www/reactLog", package="shiny"),
    dirname(file),
    recursive = TRUE
  )

  return(file)
}
