

#' Reactlog asset path information
#'
#' To be used internally inside shiny to add resource paths for reactlog.
#' @export
#' @return A \code{list} of \code{list} elements that have
#'   \code{"prefix"} (string) and \code{"path"} (file path) defined.
#' @rdname reactlog_asset_paths
reactlog_asset_paths <- function() {
  list(
    list(
      prefix = "reactlogAsset",
      path = system.file("reactlogAsset", package = "reactlog")
    )
  )
}

#' @rdname reactlog_asset_paths
#' @export
reactlog_add_shiny_resource_paths <- function() {
  for (asset in reactlog_asset_paths()) {
    shiny::addResourcePath(
      asset$prefix,
      asset$path
    )
  }
}
