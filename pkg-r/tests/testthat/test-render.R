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

test_that("reactlog_show opens a self-contained report filtered to the session", {
  entries <- list(
    list(action = "define", reactId = "global-node", type = "observable"),
    list(action = "define", reactId = "local-node", session = "first",
         label = "</script> & __REACTLOG_TITLE__"),
    list(action = "define", reactId = "other-session-node", session = "second")
  )
  opened <- NULL
  local_mocked_bindings(browseURL = function(url) opened <<- url, .package = "utils")
  reactlog_show(structure(entries, version = "1"), session_token = "first", time = FALSE)
  html <- paste(readLines(opened, encoding = "UTF-8"), collapse = "\n")
  expect_match(html, 'id="scrubber-range"', fixed = TRUE)
  expect_match(html, 'data-calculation-time="false"', fixed = TRUE)
  expect_match(html, "global-node", fixed = TRUE)
  expect_match(html, "local-node", fixed = TRUE)
  expect_false(grepl("other-session-node", html, fixed = TRUE))
  # Recover the inline JSON exactly as the browser receives it.
  data <- sub("(?s)^.*?let reactlogData = (.*?);\\n    let rawAppSource =.*$", "\\1", html,
              perl = TRUE)
  expect_identical(jsonlite::fromJSON(data, simplifyVector = FALSE)[[2]]$label, entries[[2]]$label)
  expect_false(grepl("</script>", data, fixed = TRUE))
  expect_false(grepl("<script src=", html, fixed = TRUE))
})
