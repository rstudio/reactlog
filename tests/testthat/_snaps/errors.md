# reactlog_disable() checks `warn` and warns about memory

    Code
      reactlog_disable(warn = "yes")
    Condition
      Error in `reactlog_disable()`:
      ! `warn` must be `TRUE` or `FALSE`, not a string.

---

    Code
      reactlog_disable()
    Condition
      Warning:
      Please restart R to free up reactlog memory.

# bad log versions are explained by the function the user called

    Code
      reactlog_render(list())
    Condition
      Error in `reactlog_render()`:
      ! `log` is missing a version attribute.
      i Use `shiny::reactlog()` to get a log.

---

    Code
      reactlog_render(structure(list(), version = "2"))
    Condition
      Error in `reactlog_render()`:
      x `log` has version "2".
      i reactlog supports version "1".

