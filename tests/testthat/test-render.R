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

test_that("reactlog_widget() inlines the page and defaults to shiny::reactlog()", {
  skip_if_not_installed("shiny")
  skip_if_not_installed("htmlwidgets")
  local_mocked_bindings(
    reactlog = function() structure(list(), version = "1"),
    .package = "shiny"
  )
  w <- reactlog_widget()
  expect_s3_class(w, "htmlwidget")
  expect_no_error(htmltools::renderTags(w))
  html <- w$x$html
  expect_false(grepl("reactlogAsset/", html, fixed = TRUE))
  expect_false(grepl("images/iconSearch.svg", html, fixed = TRUE))
  expect_true(grepl("data:image/svg+xml;base64,", html, fixed = TRUE))
  # no line breaks inside the base64 data uris
  expect_false(grepl("base64,[A-Za-z0-9+/=]*\n", html))
})
