# pkgdown copies everything in `pkgdown/assets/` to the site root
dir.create("pkgdown/assets", showWarnings = FALSE)
# copy readme files
stopifnot(
  file.copy("readme-images/", "pkgdown/assets/", recursive = TRUE)
)
# copy demo files
stopifnot(
  file.copy("inst/reactlog/", "pkgdown/assets/", recursive = TRUE)
)
# rename to 'demo'
stopifnot(
  file.rename("pkgdown/assets/reactlog", "pkgdown/assets/demo")
)
