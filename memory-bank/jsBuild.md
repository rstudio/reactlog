---
title: "JavaScript build"
description: "The npm/esbuild/TypeScript toolchain that turns srcts/ into the committed bundle inst/reactlog/reactlogAsset/reactlog.js, plus tsconfig, eslint, prettier, the pre-commit hook, the license scripts, and which CI job runs Node. Read before changing srcts/, package.json, tsconfig.json, or any JS config file."
---

# JavaScript build

The viewer is written in TypeScript under `srcts/`. esbuild bundles it into one
minified file plus a source map in `inst/reactlog/reactlogAsset/`, and `tsc`
checks the types. Both output files are committed, because installing the R
package never runs Node. For how the bundle is used at runtime, see
`memory-bank/architecture.md`. For the short command list, see `AGENTS.md`.

The folder is named `srcts/` to match `rstudio/shiny`. The shared `routine`
CI job knows both `srcjs/` and `srcts/`.

## History

Until 2026 the code was Flow-typed JavaScript in `srcjs/`, built by grunt,
webpack 4, and Babel, with `flow-bin` 0.86, eslint 5, and prettier 1. It was
converted by hand-editing the Flow syntax in place (renames keep the git
history): casts `(x: T)` became `x as T`, `?T` became `T | null | undefined`,
`%checks` became a type guard, Flow's `Object` became `any`, `$Values` and
`$ReadOnlyArray` became their TypeScript forms, and the `states` object in
`log/logStates.ts` became `as const` so `switch (entry.action)` narrows.
`flow-to-ts` was tried and dropped because it rewrote formatting and removed
blank lines.

## Key files

| File | Role |
| --- | --- |
| `package.json` | npm scripts, `pre-commit` / `lint-staged` hook config, dependencies |
| `tsconfig.json` | `tsc` settings: `noEmit`, `target` es2021, `moduleResolution` bundler, `strict` on |
| `srcts/modules.d.ts` | `declare module` for untyped `cytoscape` / `cytoscape-dagre`, and the `window` globals |
| `srcts/cyto/cytoFlowType.ts` | Hand-written types for the parts of cytoscape the app uses |
| `eslint.config.mjs` / `prettier.config.js` | Lint and format rules |
| `bin/lint_file.sh` | `eslint --fix` then `prettier --write` on the given files |
| `bin/clean_rlog_file.sh` | Lint the given files, `typecheck`, then `build-only` |
| `bin/postinstall.sh` | Runs `npm run build-only` |
| `bin/check_shiny_target.js` | Fails if our tsc / esbuild target differs from rstudio/shiny's |
| `bin/update-license.js` | Prints a third-party license list (not used today, see below) |
| `inst/reactlog/reactlogAsset/reactlog.js` (+ `.map`) | The committed build output |
| `inst/reactlog/reactlog.html`, `inst/reactlog/defaultLog.js` | Page and sample log for the local dev loop |

## npm scripts

- `build-only`: `esbuild srcts/index.ts --bundle --minify --sourcemap
  --target=es2021 --outfile=inst/reactlog/reactlogAsset/reactlog.js`. Takes
  well under a second. esbuild strips types without checking them.
- `typecheck`: `tsc -p .`. Writes nothing.
- `test`: bundles `srcts/__tests__/graphReplay.test.ts` for Node with esbuild
  (into `node_modules/.cache/reactlog-test/`) and runs it with `node --test`.
  See "Tests" below.
- `build`: `lint-all`, then `typecheck`, then `test`, then `build-only`. `lint-all` runs
  `bin/lint_file.sh` on the `srcts` folder.
- `watch`: `lint-all` once, then `build-only -- --watch`. No type check while
  watching; run `npm run typecheck` (or an editor) for that.
- `lint` / `fix`: `bin/lint_file.sh` / `bin/clean_rlog_file.sh` on files you
  pass after `--` (files or folders). `lint` with no arguments exits with an
  error.
- `fix-all`: `fix` on every `srcts` file.
- `check-shiny-target`: `bin/check_shiny_target.js` (see below). Needs
  network access.
- `postinstall`: `bin/postinstall.sh`, so `npm install` / `npm ci` also builds.
- `update-license`, `lint-staged`, `git_add_compiled`: used by the license
  script and the commit hook below.

## TypeScript

- `typescript` is pinned to `~6.0`. TypeScript 7 (the Go port) does not offer
  the JS API that `typescript-eslint` needs, and `typescript-eslint` 8 lists
  `typescript <6.1` as its peer.
- `strict` is on. `GraphAtStep` fields filled by `initStepInfo()` and
  `updateFinalFilteredGraph()` (called from the constructor) are marked with
  `!`. `no-explicit-any` is still off, so `any` still skips checks.
- cytoscape 3.15 (the locked version) has no bundled types, so it is declared
  as an untyped module and the app uses the hand-written types in
  `cyto/cytoFlowType.ts`. Newer cytoscape ships `index.d.ts`, but upgrading it
  changes the runtime.
- jQuery and lodash use `@types/jquery` (v3, to match jQuery 3) and
  `@types/lodash`.
- No polyfills, like rstudio/shiny. The old build added `@babel/polyfill` /
  core-js 2.

## Matching rstudio/shiny's target

The tsc `target` (and `lib`) in `tsconfig.json` and esbuild's `--target` in the
`build-only` script match rstudio/shiny: es2021 in shiny's `tsconfig.json` and
`srcts/build/_build.ts`. The viewer only opens from a Shiny app, so its browser
already runs Shiny's code; an older target gains nothing.

`npm run check-shiny-target` fetches those two shiny files from GitHub (`main`,
or pass a ref: `node bin/check_shiny_target.js v1.11.0`), prints all four
targets, and exits 1 if any differ. `.github/workflows/shiny-target.yaml` runs
it on PRs that touch `tsconfig.json`, `package.json`, the script, or the
workflow, every Monday, and on demand. When it fails because shiny moved,
update `target` and `lib` in `tsconfig.json` and `--target` in `build-only`,
run `npm run build`, and check the viewer in a browser. It does not compare
`lib`, so keep that in step by hand.

## eslint and prettier

- `eslint.config.mjs` (flat config, eslint's `defineConfig()`; the older
  `tseslint.config()` helper is deprecated): `@eslint/js` recommended plus
  `typescript-eslint` recommended (no type-aware rules). Kept from the old
  config: `eqeqeq`, `guard-for-in`, `no-console` and `no-var` as errors,
  `consistent-return` as a warning, unused vars as warnings with
  `args: "none"`, `no-fallthrough` off. Turned off to match the existing code:
  `no-explicit-any` (Flow's `Object` became `any`), `prefer-const` (the code
  uses `let` everywhere), and `no-this-alias` (`let self = this`).
  `no-unused-expressions` allows `a() || b()`.
- `prettier.config.js`: 2 spaces, width 80, double quotes, semicolons,
  `trailingComma: "es5"`, `arrowParens: "avoid"`.
- The old formatting rules (`semi`, `comma-dangle`, `dot-location`) were
  dropped; prettier handles them.

## The commit hook

The `pre-commit` npm package installs `.git/hooks/pre-commit` during
`npm install`. It runs the `pre-commit` key of `package.json`, which is
`lint-staged`. `lint-staged` 8 reads `lint-staged.linters` and runs one glob at
a time (`concurrent: false`), adding the staged file names to each command:

- `R/*.R`: `Rscript` runs `devtools::load_all()` and `devtools::lint()` on the
  whole package and fails if any lint is found. Needs R with `devtools`,
  `lintr` and `testthat`.
- `srcts/**/*.ts`: `npm run fix --` (lint those files, typecheck, build), then
  `npm run git_add_compiled --`, which runs `git add` on
  `inst/reactlog/reactlogAsset/reactlog.js` and its `.map`, then `git add` on
  the files.

So a TS commit rebuilds and stages the bundle for you.

## Committed bundle and the R package

`reactlog.js` and `reactlog.js.map` are tracked in git so that
`install.packages()`, `R CMD check` and CRAN never need Node. Rebuild and commit
the bundle in the same change as any `srcts/` edit. A clean `npm run build-only`
on unchanged sources gives a byte-identical bundle, so a diff in `inst/` after
building means the sources or the installed packages changed. Changes that only
touch formatting or comments change the `.map` but not `reactlog.js`.

`.Rbuildignore` keeps the JS toolchain out of the R tarball: `^srcts`,
`^node_modules`, `^bin`, `^package\.json$`, `^package-lock\.json$`,
`^tsconfig\.json$`, `^eslint\.config\.mjs$`, `^prettier\.config\.js$`,
`^inst/log-files`, and `.*\.js\.map$`. The last one means the source map is in
git but not in the R package; the `sourceMappingURL` line still points to it.

## CI and Node

`R-CMD-check` does not run Node. The `routine` job
(`rstudio/shiny-workflows` `routine.yaml@v1`, called from
`.github/workflows/R-CMD-check.yaml`) does: when `package.json` has a `build`
script it runs `npm ci` (which builds through `postinstall`), then
`npm run build` on the current Node release, and commits any changes under
`inst/`, `srcjs/`, and `srcts/` plus `package-lock.json`. On a same-repo PR it
pushes that commit back; on a push to `main` it fails instead. A type error
fails that job.

## License list

`bin/update-license.js` (run by `npm run update-license`, writing
`LICENSE.note`) uses `license-checker` to list the packages in `dependencies`
with their license text, under a header saying the package is MIT.
`LICENSE.note` does not exist in the repo, and the shared `routine` workflow's
`license-note` step is off by default.

## Dev loop without Shiny

1. `npm run watch` (or `npm run build-only` after each change).
2. Open `inst/reactlog/reactlog.html` in a browser straight from disk, or serve
   `inst/reactlog/` (`python3 -m http.server`). It loads `defaultLog.js` (sets
   `window.log`) and then `reactlogAsset/reactlog.js`.
3. Refresh after each rebuild. To try another log, copy a file from
   `inst/log-files/` over `inst/reactlog/defaultLog.js` (and do not commit that
   unless you mean to; the website demo uses it).

To check that a build change did not change behavior, load the old and new
bundle in turn and compare `window._reactlog.curTick`,
`window._reactlog.cyto.nodes().length` and the `#logEntry` text after the same
button clicks and key presses.

## Tests

`srcts/__tests__/graphReplay.test.ts` replays every log in `inst/log-files/`
through `GraphAtStep` and checks the step lists (visible, idle, output calc,
user mark) and the node and edge counts at the first, middle, and last visible
step. It runs in about 0.2 seconds, and `npm run build` runs it, so CI's
`routine` job does too. Adding a log file without adding its counts fails the
test.

- The graph modules read `window` when they load, and `rlog.ts` and
  `GraphAtStep.ts` import each other. So the test imports `./setupWindow`
  (a minimal `window` stub) first, then `../rlog`, then `GraphAtStep`. jQuery
  and cytoscape load fine in Node without a DOM.
- The counts are recorded from the code, not worked out by hand. If a change
  moves them on purpose, check the viewer in a browser, then update the table.
- The file has `/// <reference types="node" />` so `tsc` knows the `node:`
  modules. That reference adds Node's globals to the whole `tsc` run, not
  just the test, so `tsc` will not flag Node-only APIs in app code.
- Nothing tests the DOM or cytoscape drawing; use the browser comparison
  above for that.

## Pitfalls

- `npm run build-only` and `watch` do not type check. Run `npm run typecheck`
  or `npm run build` before committing.
- Do not upgrade `typescript` past 6.0 until `typescript-eslint` supports it.
- Bind jQuery handlers through an arrow, as in
  `.click(() => updateGraph.buttonNextStep())`. Passing the function itself
  hands jQuery's event in as the first argument, which for most `updateGraph`
  functions is `cytoOptions`, and that ends up in the cytoscape layout options.
- `npm install` / `npm ci` rebuilds the bundle. If `inst/` changes afterwards,
  check whether you meant it; restore with `git checkout -- inst/`.
- `npm install` in a folder other than `reactlog` rewrites the `"name"` at the
  top of `package-lock.json` (there is no `name` in `package.json`). Put it back
  before committing.
- The `R/*.R` hook lints the whole package, not just your staged files, and
  needs `lintr` installed.
- `npm run build` runs `eslint --fix` and `prettier --write` on all of
  `srcts/`, so it can change source files, not just the bundle. CI does the same
  and may push a commit to your PR.
- New top-level JS files need an `.Rbuildignore` entry or `R CMD check` warns.
