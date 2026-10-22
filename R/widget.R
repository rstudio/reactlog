#' Reactlog htmlwidget
#'
#' Displays the reactlog as an \pkg{htmlwidgets} widget, so it can be embedded
#' in R Markdown or Quarto documents, or shown in the RStudio viewer.
#'
#' The widget is a self-contained page shown in an `<iframe>`. Requires the
#' \pkg{htmlwidgets} package.
#'
#' @inheritParams reactlog_show
#' @param width,height Size of the widget. Defaults to `"100%"` wide and
#'   `600` pixels tall.
#' @param elementId Optional element id for the widget.
#' @seealso [reactlog_show()]
#' @export
#' @examples
#' \dontrun{
#' library(shiny)
#' reactlog_enable()
#'
#' # run a shiny app
#' app <- system.file("examples/01_hello", package = "shiny")
#' runApp(app)
#'
#' # once app has closed, display reactlog as a widget
#' reactlog_widget()
#' }
reactlog_widget <- function(
  log = shiny::reactlog(),
  time = TRUE,
  ...,
  width = NULL,
  height = NULL,
  elementId = NULL # nolint: object_name_linter.
) {
  rlang::check_installed("htmlwidgets")

  html <- reactlog_page_html(log, time = as.logical(time), ...)

  htmlwidgets::createWidget(
    name = "reactlog",
    x = list(html = reactlog_inline_assets(html)),
    width = width,
    height = height,
    package = "reactlog",
    elementId = elementId,
    sizingPolicy = htmlwidgets::sizingPolicy(
      defaultWidth = "100%",
      defaultHeight = 600,
      knitr.figure = FALSE
    )
  )
}

# Put the css, js, and images into the page so it works from an iframe `srcdoc`
reactlog_inline_assets <- function(html) {
  asset_dir <- inst_reactlog_assets()
  read_asset <- function(file) {
    paste(readLines(file.path(asset_dir, file), warn = FALSE), collapse = "\n")
  }
  svg_uri <- function(file) {
    path <- file.path(asset_dir, "images", file)
    paste0(
      "data:image/svg+xml;base64,",
      # base64_enc() adds line breaks, which break css `url("...")`
      gsub("\n", "", jsonlite::base64_enc(readBin(path, "raw", file.size(path))), fixed = TRUE)
    )
  }

  for (css in c("fira-mono_source-sans-pro_latin-ext.css", "reactlog.css")) {
    content <- fixed_sub(
      "url(\"images/iconSearch.svg\")",
      paste0("url(\"", svg_uri("iconSearch.svg"), "\")"),
      read_asset(css)
    )
    html <- fixed_sub(
      paste0("<link rel=\"stylesheet\" type=\"text/css\" href=\"reactlogAsset/", css, "\">"),
      paste0("<style>", content, "</style>"),
      html
    )
  }

  html <- fixed_sub(
    "<script src=\"reactlogAsset/reactlog.js\"></script>",
    paste0("<script>", read_asset("reactlog.js"), "</script>"),
    html
  )

  for (svg in dir(file.path(asset_dir, "images"))) {
    html <- gsub(paste0("./reactlogAsset/images/", svg), svg_uri(svg), html, fixed = TRUE)
  }

  html
}
