test_that("backslashes in the log are kept in the rendered page", {
  log <- list(list(
    action = "define", reactId = "r1", label = "a\\b\"c\\",
    type = "observable", session = NULL, time = 1
  ))
  attr(log, "version") <- "1"
  file <- reactlog_render(log)
  html <- paste(readLines(file, warn = FALSE), collapse = "\n")

  expect_true(grepl("\"a\\\\b\\\"c\\\\\"", html, fixed = TRUE))
})
