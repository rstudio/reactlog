log_two_sessions <- function() {
  structure(list(
    list(action = "define", reactId = "r1", label = "global", session = NULL),
    list(action = "define", reactId = "r2", label = "a", session = "a"),
    list(action = "define", reactId = "r3", label = "b", session = "b")
  ), version = "1")
}

test_that("reactlog_write() returns json when `file` is NULL", {
  json <- reactlog_write(log_two_sessions(), file = NULL)
  labels <- vapply(jsonlite::fromJSON(json, simplifyVector = FALSE), `[[`, "", "label")
  expect_equal(labels, c("global", "a", "b"))
})

test_that("reactlog_write() keeps global and matching session entries", {
  json <- reactlog_write(log_two_sessions(), file = NULL, session_token = "a")
  labels <- vapply(jsonlite::fromJSON(json, simplifyVector = FALSE), `[[`, "", "label")
  expect_equal(labels, c("global", "a"))
})

test_that("reactlog_write() writes to a file", {
  file <- withr::local_tempfile(fileext = ".json")
  reactlog_write(log_two_sessions(), file = file)
  expect_length(jsonlite::fromJSON(file, simplifyVector = FALSE), 3)
})
