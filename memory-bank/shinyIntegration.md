---
title: "Shiny Integration"
description: "How reactlog and the shiny package call each other: the R exports, the shiny functions and HTTP endpoints that use them, keyboard shortcuts, the shiny version contract, session filtering, test mode, the example app, and what to change in both repos when the log format or entry points change. Read before changing anything in R/, the reactlog.html placeholders, or DESCRIPTION Suggests."
---

# Shiny Integration

reactlog does not record anything itself. shiny records the log and owns the
keyboard shortcuts and the `/reactlog` HTTP endpoint. reactlog turns a log into
an HTML page and offers a module that shows that page in an iframe. The two
packages call into each other, so a change on one side often needs a change on
the other.

For the overall layout of the R and JavaScript halves, see
[architecture.md](architecture.md). For the log entries themselves (actions and
fields), see [logFormat.md](logFormat.md).

Key files:

| File | Role |
| --- | --- |
| `R/setReactLog.R` | `reactlog_enable()`, `reactlog_disable()` |
| `R/version.R` | `reactlog_upgrade()` |
| `R/showReactLog.R` | `reactlog_show()`, `reactlog_write()`, `write_utf8()` |
| `R/renderReactLog.R` | `reactlog_render()`, `inst_reactlog_file()`, `inst_reactlog_assets()` |
| `R/shinyModule.R` | `reactlog_module_ui()`, `reactlog_module_server()` |
| `R/version.R` | `shiny_version_required()`, `test_shiny_version()`, `assert_shiny_version()` |
| `inst/reactlog/reactlog.html` | HTML template with `__DATA__` and `__TIME__` placeholders |
| `inst/examples/03_reactivity/` | Example app using the module, plus old shinytest files |
| `tests/testthat/test-shiny_module.R` | The only test file |
| `rstudio/shiny:R/graph.R` | `reactlog()`, `reactlogShow()`, `reactlogReset()`, `reactlogAddMark()`, `renderReactlog()`, `check_reactlog()`, `RLog` |
| `rstudio/shiny:R/middleware-shiny.R` | `reactLogHandler()`: the `/reactlog` and `/reactlog/mark` endpoints |
| `rstudio/shiny:R/server.R` | Adds `reactLogHandler` to the app's HTTP handlers |
| `rstudio/shiny:srcts/src/shiny/reactlog.ts` | `initReactlog()`: the Ctrl/Cmd+F3 keyboard handlers |

## Turning logging on

`reactlog_enable()` only runs `options(shiny.reactlog = TRUE)`.
`reactlog_disable(warn = TRUE)` sets it to `FALSE` and, by default, warns that R
must be restarted to free the memory. The log is not cleared; use
`shiny::reactlogReset()` for that.

In shiny, `RLog` (in `rstudio/shiny:R/graph.R`) checks the option with
`isLogging()`. While it is on, every entry is pushed onto a stack with two extra
fields added: `session` (the session token, or `NULL` when there is no reactive
domain) and `time` (`as.numeric(Sys.time())`). `rLog$asList()` returns the stack
as a list and sets `attr(, "version") <- "1"`. `shiny::reactlog()` returns that
list. The option is read for each entry, so set it before the app starts.

## Entry points

### `shiny::reactlogShow()` (static file)

`reactlogShow(time = TRUE)` in `rstudio/shiny:R/graph.R` calls
`check_reactlog()` and then `reactlog::reactlog_show(reactlog(), time = time)`.

`reactlog_show(log, time = TRUE, ...)` calls `reactlog_render()` and opens the
file with `utils::browseURL()`. This shows all sessions. It can be called with
any saved log, for example after the app has stopped.

### `/reactlog` endpoint (Ctrl/Cmd+F3 and the module)

`reactLogHandler()` in `rstudio/shiny:R/middleware-shiny.R` handles two paths:

- `/reactlog`: reads `s` from the query string and calls the internal
  `renderReactlog(sessionToken)` (in `rstudio/shiny:R/graph.R`), which calls
  `reactlog::reactlog_render(reactlog(), session_token = sessionToken, time = time)`.
  The returned temp file is served with `owned = TRUE`, so shiny deletes it
  after sending.
- `/reactlog/mark`: reads `s`, finds the session with `appsByToken$get()`, and
  adds a user mark with `rLog$userMark()`. Replies with the text `marked`.

If `shiny.reactlog` is not on, both paths reply with status 501 and a plain text
message saying how to turn it on. Other paths fall through.

The `w` query parameter is the worker id. The handler does not read it; it is
there so some Shiny Server editions can route the request to the right R
process (see `workerId` in `rstudio/shiny:R/runapp.R`). The endpoint never
passes `time`, so it always uses `time = TRUE`.

Keyboard handlers live in `initReactlog()` in
`rstudio/shiny:srcts/src/shiny/reactlog.ts`:

- Ctrl/Cmd+F3 (key code 114, no Shift, no Alt) opens
  `reactlog?w=<workerId>&s=<sessionId>` in a new window. So the shortcut shows
  only the current session plus global entries.
- Ctrl/Cmd+Shift+F3, or Ctrl/Cmd+F4, sends a GET to `reactlog/mark?w=...&s=...`
  and shows a "Marked time point in reactlog" notification. If the request
  fails, it opens the URL in a new window so the 501 message is visible.

### `reactlog_render()`

`reactlog_render(log, session_token = NULL, time = TRUE)` in
`R/renderReactLog.R`:

1. Calls `reactlog_upgrade()`, which stops unless `attr(log, "version")` is
   `"1"`.
2. Reads `inst/reactlog/reactlog.html`.
3. Gets JSON from `reactlog_write(log, file = NULL, session_token = session_token)`.
4. Replaces `__DATA__` with the JSON, `__TIME__` with `"TRUE"` or `"FALSE"`
   (quoted), and removes the `defaultLog.js` script tag. The template reads them
   as `window.__APP_DATA__` and `window.__APP_TIME__`.
5. If shiny can be loaded, calls `shiny::addResourcePath("reactlogAsset", inst_reactlog_assets())`.
6. Writes the HTML to a `tempfile()` and copies `inst/reactlog/reactlogAsset/`
   next to it.

The template loads its CSS, JS and images with relative `reactlogAsset/...`
paths. For the static file, the copied folder next to the temp file serves
them. For the `/reactlog` endpoint, the page is served from the app's root, so
`reactlogAsset/...` is served by shiny's resource path handler from the
installed package folder. That is why `reactlog_render()` registers the
resource path even though it also copies the folder.

### `reactlog_write()` and session filtering

`reactlog_write(log, file = stdout(), session_token = NULL)` in
`R/showReactLog.R` turns the log into pretty JSON with `jsonlite::toJSON()`. The
options are copied from shiny's own JSON settings (`auto_unbox = TRUE`,
`null = "null"`, `digits = getOption("shiny.json.digits", 16)`, and so on).
With `file = NULL` it returns the JSON; otherwise it writes it with
`write_utf8()`.

When `session_token` is given, it keeps an entry if `x$session` is `NULL`
(global entries, made outside any session) or equal to the token. Everything
else is dropped. Filtering only happens here, so the `/reactlog` endpoint and
the module get filtered output, while `reactlogShow()` does not.

## The Shiny module

`reactlog_module_ui(include_refresh = TRUE, id = "reactlog_module")` returns an
optional small refresh `actionButton()` (icon `arrows-rotate`) and a
`uiOutput()` named `iframe`.

`reactlog_module_server(id = "reactlog_module", width = "100%", height = 600, ...)`:

- calls `assert_shiny_version()` first, before `shiny::moduleServer()`;
- renders an `<iframe>` with a random id (`reactlog_iframe_<hex>`, namespaced),
  the given `width`, `height` and `...` attributes;
- adds an inline script that sets the iframe `src` to
  `reactlog?w=<workerId>&s=<sessionId>`, read from
  `window.Shiny.shinyapp.config` in the browser;
- reads `input$refresh`, so clicking the button re-renders the iframe and loads
  a fresh log. The iframe shows the same page Ctrl/Cmd+F3 opens.

## Test mode (`&test=1`)

If `getOption("shiny.testmode")` is `TRUE` when the iframe renders,
`reactlog_module_server()` adds `&test=1` to the URL. shiny sets this option when
an app runs under shinytest or shinytest2 (`test.mode` in
`rstudio/shiny:R/runapp.R`).

On the JS side, `srcjs/utils/shinytest.js` sets `inTestMode` when the page's
query has `test=1`. Then `srcjs/layout/logEntry.js` shows `(shinytest)` instead
of the time and session, and `Node.calculationTimeStr` in `srcjs/graph/Node.js`
returns `(shinytest)` instead of milliseconds. This keeps screenshots stable
between runs.

## Version contract

There are two minimum versions, one in each repo.

- reactlog needs shiny for the module only. `shiny_version_required()` in
  `R/version.R` reads the installed reactlog `DESCRIPTION`, finds the `Suggests`
  entry that starts with `shiny ` and turns the digits into a
  `package_version`. Today that is `shiny (>= 1.5.0)`, the release that added
  `moduleServer()`. `test_shiny_version()` returns `FALSE` if shiny is missing
  or too old; `assert_shiny_version()` stops with a message.
- shiny needs reactlog for `reactlogShow()` and the endpoint.
  `check_reactlog()` in `rstudio/shiny:R/graph.R` calls
  `rlang::check_installed("reactlog", reactlog_min_version)`, with
  `reactlog_min_version <- "1.0.0"`. shiny's `DESCRIPTION` lists
  `reactlog (>= 1.0.0)` in `Suggests`, and a code comment says the two must
  match.

Because `shiny_version_required()` parses DESCRIPTION at runtime, the
`Suggests` line is part of the code. Keep the form `shiny (>= x.y.z)`.

## Example app and shinytest files

`inst/examples/03_reactivity/app.R` is a short version of
`shiny::runExample("03_reactivity")` with `reactlog_enable()` at the top and the
module added to the UI and server.

`inst/examples/03_reactivity/tests/` holds tests for the old `shinytest`
package (not shinytest2): `shinytest.R` calls `shinytest::testApp("../")`, and
`shinytest/mytest.R` clicks `reactlog_module-refresh`, waits 4 seconds, changes
`obs`, and takes four snapshots. The expected output is in
`shinytest/mytest-expected/` (`00N.json` and `00N.png`). The JSON files contain
the iframe HTML with `&test=1`, which shows that test mode was on.
`debug_reactlog.json` is a saved log from this app; no code reads it.

`shinytest` is not in DESCRIPTION, and this repo's CI
(`.github/workflows/R-CMD-check.yaml`) does not run these tests. They have to be
run by hand. The `.lintr` file excludes `app.R`.

## Tests in this repo

`tests/testthat/test-shiny_module.R` has one test. It skips unless
`test_shiny_version()` is `TRUE`, then runs `reactlog_module_server` inside
`shiny::testServer()` with `width = "99%"` and `height = 501` and checks that
`output$iframe$html` contains those attributes. Nothing tests
`reactlog_render()`, `reactlog_write()`, session filtering, or
`reactlog_upgrade()`.

Run with `Rscript -e 'devtools::test()'` from the repo root.

## When things change

| Change | reactlog | shiny |
| --- | --- | --- |
| New or changed log action or field | Update `srcjs/` (see [logFormat.md](logFormat.md)), rebuild and commit the bundle | Update `RLog` in `rstudio/shiny:R/graph.R` |
| Breaking log format change | Add the new version to `reactlog_upgrade()`; teach the JS to read it | Change `attr(, "version")` in `RLog$asList()`; raise `reactlog_min_version` and `Suggests` |
| Rename or change args of `reactlog_render()` / `reactlog_show()` | Keep old names working; release first | Update `reactlogShow()` and `renderReactlog()`; raise `reactlog_min_version` |
| New query parameter on `/reactlog` | Read it in `srcjs/` (like `utils/shinytest.js`) or in `reactlog_render()` | Read it in `reactLogHandler()` and pass it through `renderReactlog()` |
| New keyboard shortcut | Update the docs in `R/showReactLog.R` and `R/shinyModule.R` | Add it in `rstudio/shiny:srcts/src/shiny/reactlog.ts` |
| Module needs a newer shiny | Raise `shiny (>= ...)` in DESCRIPTION `Suggests` | Nothing |
| Template placeholders | Update `reactlog.html` and `reactlog_render()` together | Nothing |

Release order matters: shiny calls exported reactlog functions, so ship the
reactlog side first and then raise shiny's minimum version.

## Pitfalls

- Do not reformat the `shiny` line in DESCRIPTION `Suggests`. `shiny_version_required()`
  matches `^shiny ` and keeps only digits and dots.
- The endpoint filters by session; `reactlogShow()` does not. Global entries
  (`session` is `NULL`) are always kept, so a filtered log still has entries
  from outside the session.
- The `/reactlog` endpoint ignores `w` and always uses `time = TRUE`. There is
  no way to turn timing off from the module or the shortcut.
- `reactlog_render()` registers the `reactlogAsset` resource path as a side
  effect. Removing it breaks the endpoint and module pages (missing CSS/JS),
  while the static `reactlogShow()` file still works.
- `reactlog_render()` puts the JSON into the template with
  `sub(fixed = TRUE)`, which still treats `\\` in the replacement as an escape.
  Each pair of backslashes in the JSON becomes one, so log values that contain
  backslashes are changed (and can break the page).
- `reactlog_show()` documents `...` as ignored, but passes it to
  `reactlog_render()`. Any name other than `session_token` is an error.
- The shinytest files depend on screenshots and the deprecated `shinytest`
  package. Rebuilding the JS bundle can change the PNGs, and nothing in CI will
  tell you.
- Turning `shiny.reactlog` on in production lets any user open `/reactlog` and
  see labels and values from all sessions' reactive code.
