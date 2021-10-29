# copy readme files
stopifnot(
  file.copy("readme-images/", "pkgdown/", recursive = TRUE)
)
# copy demo files
stopifnot(
  file.copy("inst/reactlog/", "pkgdown/", recursive = TRUE)
)
# rename to 'demo'
stopifnot(
  file.rename("pkgdown/reactlog", "pkgdown/demo")
)
