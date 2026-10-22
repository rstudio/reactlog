# reactlog (development)

- Added `reactlog_widget()`, which shows the reactlog as an htmlwidget so it can be embedded in R Markdown or Quarto documents. Like `reactlog_show()`, `log` defaults to `shiny::reactlog()`. Requires the htmlwidgets package (#160)

- `reactlog_show()` now uses `shiny::reactlog()` as its default `log`, so `reactlog_show()` works with no arguments after running an app (#91)

- The graph legend now shows that a solid line is a dependency, a dashed line is an `isolate()`d dependency, and a dotted line is an inactive dependency (one that existed earlier but is not active at the current step) (#76)

- Migrated project license from GPL-3 to the MIT License.

- Added a `?` button to the reactlog header. Hover over it or click it to see every keyboard shortcut, with key names for your operating system. The navigation button tooltips now also use your operating system's key names. The vignette has the same list (#73)

- Documented that `reactlog_show()` passes `...` on to `reactlog_render()`, so `session_token` can be set from `reactlog_show()`. The docs used to say `...` was ignored (#120)

- Fixed `reactlog_render()` printing "Loading required namespace: shiny" (#120)

- Fixed an "unknown data.action" browser console error for every `invalidateLater` entry during replay (#120)

- Fixed the status text for `asyncStop` entries, which said "Start asynchronous calculations" (#120)

- Fixed `Shift+Right` moving past the last log entry (#120)

- Fixed double clicking a graph element also matching elements with a longer id, such as `r30` for `r3` (#120)

- Fixed the next / previous user mark buttons skipping a mark that is the very next step (#120)

- Fixed clicking the timeline moving to a spot to the right of where it was clicked (#120)

# reactlog 1.1.1

- Fixed Font Awesome icon warning about `refresh` icon (#87)

# reactlog 1.1.0

- Added a shiny module to inline the current `reactlog`. See `?reactlog_module_ui` for an example (#66)
- Added `reactlog_enable()` and `reactlog_disable()` which replace the need to explicitly set R options (#61)
- Use log entry for status bar instead of a final graph (#67)
- Allow reactlog to handle isolate calls in a non-reactive context (#68)


# reactlog 1.0.0

Initialize package
