# reactlog (development)

- Migrated project license from GPL-3 to the MIT License.

- Documented that `reactlog_show()` passes `...` on to `reactlog_render()`, so `session_token` can be set from `reactlog_show()`. The docs used to say `...` was ignored (#120)

- Fixed `reactlog_render()` printing "Loading required namespace: shiny" (#120)

- Fixed an "unknown data.action" browser console error for every `invalidateLater` entry during replay (#120)

- Fixed the status text for `asyncStop` entries, which said "Start asynchronous calculations" (#120)

- Fixed `Shift+Right` moving past the last log entry (#120)

# reactlog 1.1.1

- Fixed Font Awesome icon warning about `refresh` icon (#87)

# reactlog 1.1.0

- Added a shiny module to inline the current `reactlog`. See `?reactlog_module_ui` for an example (#66)
- Added `reactlog_enable()` and `reactlog_disable()` which replace the need to explicitly set R options (#61)
- Use log entry for status bar instead of a final graph (#67)
- Allow reactlog to handle isolate calls in a non-reactive context (#68)


# reactlog 1.0.0

Initialize package
