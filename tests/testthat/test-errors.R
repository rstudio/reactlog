test_that("reactlog_disable() checks `warn` and warns about memory", {
  withr::local_options(shiny.reactlog = TRUE)
  expect_snapshot(error = TRUE, reactlog_disable(warn = "yes"))
  expect_snapshot(reactlog_disable())
  expect_silent(reactlog_disable(warn = FALSE))
})

test_that("bad log versions are explained by the function the user called", {
  expect_snapshot(error = TRUE, reactlog_render(list()))
  expect_snapshot(error = TRUE, reactlog_render(structure(list(), version = "2")))
})

test_that("assert_shiny_version() uses rlang::check_installed()", {
  local_mocked_bindings(shiny_version_required = function(...) package_version("999.0.0"))
  expect_error(assert_shiny_version(), class = "rlib_error_package_not_found")
})

test_that("reactlog_show() and reactlog_widget() check for shiny when `log` is missing", {
  local_mocked_bindings(
    check_installed = function(pkg, ...) stop("checked ", pkg),
    .package = "rlang"
  )
  expect_error(reactlog_show(), "checked shiny")
  skip_if_not_installed("htmlwidgets")
  local_mocked_bindings(
    check_installed = function(pkg, ...) if (pkg == "shiny") stop("checked ", pkg),
    .package = "rlang"
  )
  expect_error(reactlog_widget(), "checked shiny")
})
