module_iframe <- "document.querySelector('iframe[id^=\"reactlog_module-reactlog_iframe_\"]')"
widget_iframe <- "document.querySelector('#widget iframe')"
widget_module_iframe <- "document.querySelector('#reactlog_widget_module-widget iframe')"

# Number of log entries loaded in the reactlog inside `iframe`, or -1 if not loaded yet
log_length_js <- function(iframe) {
  paste0("(function() {
    var frame = ", iframe, ";
    var win = frame && frame.contentWindow;
    var step = win && win.document.querySelector('#eventStepNum');
    if (!win || !win.log || !step || step.textContent.trim() === '') return -1;
    return win.log.length;
  })()")
}

expect_log_grows <- function(app, iframe, refresh_id) {
  app$wait_for_js(paste0(log_length_js(iframe), " > 0"))
  n <- app$get_js(log_length_js(iframe))

  app$set_inputs(a = 5)
  app$click(refresh_id)
  app$wait_for_js(paste0(log_length_js(iframe), " > ", n))

  expect_gt(app$get_js(log_length_js(iframe)), n)
}

local_app <- function(env = parent.frame()) {
  skip_on_cran()
  skip_if_not_installed("shinytest2")
  skip_if_not_installed("htmlwidgets")
  app <- shinytest2::AppDriver$new(test_path("apps/reactlog"), name = "reactlog")
  withr::defer(app$stop(), envir = env)
  app
}

test_that("module iframe shows the log and its refresh button loads new entries", {
  app <- local_app()
  expect_log_grows(app, module_iframe, "reactlog_module-refresh")
})

test_that("render_reactlog_widget() shows the log and re-renders with new entries", {
  app <- local_app()
  # The first render happens before shiny's first idle, so refresh once to load a full log
  app$click("refresh_widget")
  expect_log_grows(app, widget_iframe, "refresh_widget")
})

test_that("widget module shows the log and its refresh button loads new entries", {
  app <- local_app()
  expect_log_grows(app, widget_module_iframe, "reactlog_widget_module-refresh")
})
