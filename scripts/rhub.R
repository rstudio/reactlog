if (!require("rhub", quietly = TRUE)) {
  install.packages("rhub")
}

cat("building...\n")
build_dir <- "../builds"
if (!dir.exists(build_dir) {
  dir.create(build_dir, recursive = TRUE, showWarnings = FALSE)
}
build_file <- rhub:::build_package(".", build_dir)

platforms <- c("windows-x86_64-release", rhub:::default_cran_check_platforms(build_file))
check_output <- rhub::check_for_cran(
  build_file,
  email = "barret@rstudio.com",
  platforms = platforms,
  env_vars = c("_R_CHECK_FORCE_SUGGESTS_" = "0"),
  show_status = FALSE
)

for (i in seq_along(platforms)) {
  check_output$livelog(i)
}

# check_output$web()

print(check_output)
