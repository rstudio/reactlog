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
    testthat::skip("Insufficient shiny version. Need >= 1.5.0")
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
