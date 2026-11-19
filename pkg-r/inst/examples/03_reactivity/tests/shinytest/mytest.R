app <- ShinyDriver$new("../../", seed = 54322)
app$snapshotInit("mytest")

take_snapshot <- function(refresh = TRUE) {
  app$setInputs(`reactlog_module-refresh` = "click")
  Sys.sleep(4)
  app$snapshot()
}
take_snapshot(FALSE)

take_snapshot()

app$setInputs(obs = 9)
app$setInputs(obs = 8)

take_snapshot()

take_snapshot()
