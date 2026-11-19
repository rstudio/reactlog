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

test_that("reactlog_show() passes ... to reactlog_render()", {
  log <- structure(list(), version = "1")
  local_mocked_bindings(browseURL = function(...) NULL, .package = "utils")
  expect_no_error(reactlog_show(log, session_token = "abc"))
  # no message match: "unused argument" is translated in other locales
  expect_error(reactlog_show(log, foo = 1))
})

test_that("reactlog_show() defaults to shiny::reactlog()", {
  skip_if_not_installed("shiny")
  called <- FALSE
  local_mocked_bindings(
    reactlog = function() {
      called <<- TRUE
      structure(list(), version = "1")
    },
    .package = "shiny"
  )
  local_mocked_bindings(browseURL = function(...) NULL, .package = "utils")
  reactlog_show()
  expect_true(called)
})

test_that("reactlog_read() reads back what reactlog_write() wrote", {
  log <- list(list(
    action = "define", reactId = "r1", label = "a\\b\"c\\",
    type = "observable", session = NULL, time = 1
  ))
  attr(log, "version") <- "1"
  file <- tempfile(fileext = ".json")
  on.exit(unlink(file))
  reactlog_write(log, file)

  log2 <- reactlog_read(file)
  expect_identical(attr(log2, "version"), "1")
  expect_identical(reactlog_write(log2, NULL), reactlog_write(log, NULL))
  expect_no_error(reactlog_render(log2))
})
