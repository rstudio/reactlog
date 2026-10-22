test_that("reactlog_enable() and reactlog_disable() set the shiny option", {
  withr::local_options(shiny.reactlog = NULL)
  reactlog_enable()
  expect_true(getOption("shiny.reactlog"))
  reactlog_disable(warn = FALSE)
  expect_false(getOption("shiny.reactlog"))
})
