# pkgdown copies files in pkgdown/assets/ to the site root.
setwd("pkg-r")
dir.create("pkgdown/assets/demo", recursive = TRUE, showWarnings = FALSE)
pkgload::load_all(".", helpers = FALSE)
sample_js <- readLines("inst/log-files/log-cranwhales.js", encoding = "UTF-8")
sample_json <- sub(";\\s*$", "", sub("^window\\.log = ", "", paste(sample_js, collapse = "\n")))
log <- structure(jsonlite::fromJSON(sample_json, simplifyVector = FALSE), version = "1")
stopifnot(
  file.copy("readme-images", "pkgdown/assets", recursive = TRUE, overwrite = TRUE),
  file.copy(reactlog::reactlog_render(log), "pkgdown/assets/demo/reactlog.html", overwrite = TRUE)
)
