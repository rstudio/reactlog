# pkgdown copies files in pkgdown/assets/ to the site root.
setwd("pkg-r")
dir.create("pkgdown/assets/demo", recursive = TRUE, showWarnings = FALSE)
stopifnot(
  file.copy("readme-images", "pkgdown/assets", recursive = TRUE, overwrite = TRUE),
  file.copy(list.files("inst/reactlog", full.names = TRUE),
            "pkgdown/assets/demo", recursive = TRUE, overwrite = TRUE)
)
