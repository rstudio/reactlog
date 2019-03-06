# there is no package an only exists within the rstudio ide
utils::globalVariables("RStudio.Version")

.onAttach <- function(...) {
  # if on unix
  if (.Platform$OS.type == "unix") {
    # if in RStudio IDE
    if (identical(.Platform$GUI, "RStudio")) {
      # if on a release version 1.2.1303
      try({
        # this function exists as a loaded namespace within the ide...
        # there is no direct package for it
        if (RStudio.Version()$version == "1.2.1303") {
          packageStartupMessage(
            "There is a known bug within unix systems",
            " on RStudio pre-release v1.2.1303.",
            "\nPlease install the latest RStudio daily build to display",
            " the reactlog using the `Ctrl+F3` keybinding."
          )
        } # end is preview version
      }) # end try
    } # end if RStudio
  } # end if unix
}
