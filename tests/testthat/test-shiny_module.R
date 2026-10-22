width <- "99%"
height <- 501
expect_iframe <- function(output) {
  iframe_content <- as.character(output$iframe$html)
  testthat::expect_true(
    grepl(
      "width\\s*=\\s*[\"']99%[\"']",
      iframe_content
    )
  )
  testthat::expect_true(
    grepl(
      "height\\s*=\\s*[\"']501[\"']",
      iframe_content
    )
  )
}

test_that("iframe is displayed immediately", {

  if (!test_shiny_version()) {
    testthat::skip(paste0("Insufficient shiny version. Need >= ", shiny_version_required()))
  }

  shiny::testServer(
    reactlog_module_server,
    args = list(
      width = width,
      height = height
    ),
    expr = {

      expect_iframe(output)
    }
  )

})

test_that("shiny version is read from Suggests", {
  expect_equal(shiny_version_required("knitr, shiny (>= 1.5.0)"), package_version("1.5.0"))
  expect_equal(shiny_version_required("knitr, shiny(>= 1.5.0)"), package_version("1.5.0"))
  expect_equal(
    shiny_version_required("shinytest, shiny.i18n (>= 9.9), shiny (>= 1.5.0)"),
    package_version("1.5.0")
  )
  expect_length(shiny_version_required(), 1)
})

test_that("module UIs namespace their outputs and can drop the refresh button", {
  skip_if_not_installed("htmlwidgets")
  has <- function(ui, text) grepl(text, as.character(ui), fixed = TRUE)
  for (ui in list(reactlog_module_ui, reactlog_widget_module_ui)) {
    expect_true(has(ui(id = "x"), "id=\"x-refresh\""))
    expect_false(has(ui(include_refresh = FALSE, id = "x"), "x-refresh"))
  }
  expect_true(has(reactlog_module_ui(id = "x"), "id=\"x-iframe\""))
  expect_true(has(reactlog_widget_module_ui(id = "x"), "id=\"x-widget\""))
})
