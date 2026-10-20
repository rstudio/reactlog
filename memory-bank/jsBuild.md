---
title: "JavaScript build"
description: "The npm/grunt/webpack 4 toolchain that turns srcjs/ into the committed bundle inst/reactlog/reactlogAsset/reactlog.js, plus Babel, Flow, eslint, prettier, the pre-commit hook, the license scripts, and which CI job runs Node. Read before changing srcjs/, package.json, Gruntfile.js, or any JS config file."
---

# JavaScript build

The viewer is written in Flow-typed ES6 under `srcjs/`. Grunt runs webpack 4,
which runs Babel, and writes one minified file plus a source map into
`inst/reactlog/reactlogAsset/`. Both files are committed, because installing
the R package never runs Node. For how the bundle is used at runtime, see
`memory-bank/architecture.md`. For the short command list, see `AGENTS.md`.

The repo moved from yarn to npm (`package-lock.json`; `yarn.lock` is gone). At
the same time, `flow-typed install` was dropped from the `postinstall` step.

## Key files

| File | Role |
| --- | --- |
| `package.json` | npm scripts, `pre-commit` / `lint-staged` hook config, `flow-coverage-report` config, dependencies |
| `Gruntfile.js` | The webpack config (`gruntConfig.webpack.reactlog`) and the `webpackSetWatch` task |
| `.babelrc` | Babel presets: Flow stripping, `preset-env`, class properties |
| `.flowconfig` | Flow settings; only `srcjs` is included |
| `.eslintrc.js` / `prettier.config.js` | Lint and format rules |
| `bin/lint_file.sh` | `eslint --fix` then `prettier --write` on the given files |
| `bin/clean_rlog_file.sh` | Lint the given files, then `npm run build-only` |
| `bin/postinstall.sh` | Runs `npm run build-only` |
| `bin/update-license.js`, `scripts/license_checker.js` | Print a third-party license list (not used today, see below) |
| `inst/reactlog/reactlogAsset/reactlog.js` (+ `.map`) | The committed build output |
| `inst/reactlog/reactlog.html`, `inst/reactlog/defaultLog.js` | Page and sample log for the local dev loop |

## npm scripts

- `build-only`: `NODE_OPTIONS=--openssl-legacy-provider grunt`. Runs the grunt
  `default` task, which is `webpack:reactlog`.
- `build`: `lint-all` then `build-only`. `lint-all` runs `bin/lint_file.sh` on
  `srcjs/*.js srcjs/**/*.js`. All `srcjs/` sub folders are one level deep, so
  this glob covers every file even without bash `globstar`.
- `watch`: `lint-all` once, then `grunt webpackSetWatch default`.
  `webpackSetWatch` sets `gruntConfig.webpack.reactlog.watch = true` before the
  webpack task runs, so webpack keeps running and rebuilds on save. Files are
  not linted again while watching.
- `lint` / `fix`: `bin/lint_file.sh` / `bin/clean_rlog_file.sh` on files you
  pass after `--`. `lint` with no files exits with an error.
- `fix-all`: `fix` on every `srcjs` file (lint + build).
- `flow-report`, `flow-status`, `flow-stop`: Flow coverage and server commands.
- `postinstall`: `bin/postinstall.sh`, so `npm install` / `npm ci` also builds.
- `update-license`, `lint-staged`, `git_add_compiled`: used by the license
  script and the commit hook below.

## Why `--openssl-legacy-provider`

Webpack 4 hashes with MD4, which OpenSSL 3 (Node 17+) no longer offers by
default. Without the flag, `grunt` on Node 22 fails at the end of the build
with `Fatal error: error:0308010C:digital envelope routines::unsupported`. Only
`build-only` and `watch` set the flag; call those scripts instead of running
`grunt` by hand.

## Gruntfile.js (webpack config)

- `entry`: `srcjs/index.js`. It starts with `import "@babel/polyfill"`.
- `output`: `inst/reactlog/reactlogAsset/reactlog.js`.
- `mode: "production"`: the output is minified by Terser, even though the
  comment next to it says "do not take time to shrink files".
- `devtool: "source-map"`: writes `reactlog.js.map` next to the bundle and adds
  a `//# sourceMappingURL=reactlog.js.map` line at the end.
- One rule: `babel-loader` for `.js` files outside `node_modules`.
- `failOnError: true`, `progress: true`. The progress output is long; read the
  end of it.
- `BundleAnalyzerPlugin` and `DuplicatePackageCheckerPlugin` are imported but
  commented out in `plugins`. Turning on the analyzer in `static` mode writes
  `report.html`, which `.gitignore` lists as
  `inst/reactlog/reactlogAsset/report.html`.

## Babel, Flow, eslint, prettier

- `.babelrc`: `@babel/preset-flow` strips types. `@babel/preset-env` uses
  `modules: "umd"`, `useBuiltIns: "entry"` and `corejs: 2`, which swaps the
  `@babel/polyfill` import for the needed `core-js` 2 parts.
  `@babel/plugin-proposal-class-properties` allows class fields.
- `.flowconfig`: `[include] srcjs`, all lints set to `error` with a few turned
  down, `$Flow...` comments suppress errors. `[libs]` is empty. Type stubs for
  `jquery` / `lodash` used to come from `flow-typed install` in postinstall;
  `flow-typed/` is in `.gitignore`, so a fresh clone has none.
- Flow coverage: `npm run flow-report` runs `flow-coverage-report` with the
  `flow-coverage-report` block in `package.json`: files `srcjs/**/*.js`, four
  files excluded (`utils/Console.js`, `cyto/layoutOptions.js`,
  `log/initStep.js`, `rlog.js`), threshold 95%, text output.
- `flow-bin` is pinned to `^0.86.0`. Its macOS binary is x86_64 only. On Apple
  Silicon without Rosetta, `flow-report` fails right away with
  `spawn Unknown system error -86`.
- `.eslintrc.js`: `babel-eslint` parser, `flowtype` plugin, extends
  `plugin:flowtype/recommended` and `eslint:recommended`. Notable rules:
  `no-console` and `no-var` are errors, `eqeqeq`, `semi`, `guard-for-in`.
- `prettier.config.js`: 2 spaces, width 80, double quotes, semicolons,
  `trailingComma: "es5"`, `arrowParens: "avoid"`.

## The commit hook

The `pre-commit` npm package installs `.git/hooks/pre-commit` during
`npm install`. It runs the `pre-commit` key of `package.json`, which is
`lint-staged`. `lint-staged` 8 reads `lint-staged.linters` and runs one glob at
a time (`concurrent: false`), adding the staged file names to each command:

- `R/*.R`: `Rscript` runs `devtools::load_all()` and `devtools::lint()` on the
  whole package and fails if any lint is found. Needs R with `devtools`,
  `lintr` and `testthat`.
- `.flowconfig`: `npm run flow-report-and-echo`.
- `srcjs/**/*.js`: `npm run fix --` (lint those files, then build),
  `npm run flow-report-and-echo`, then `npm run git_add_compiled --`, which runs
  `git add inst/reactlog/reactlogAsset/reactlog.js` and `git add` on the files.

So a JS commit rebuilds and stages the bundle for you, but only if Flow can run
on your machine.

## Committed bundle and the R package

`reactlog.js` and `reactlog.js.map` are tracked in git so that
`install.packages()`, `R CMD check` and CRAN never need Node. Rebuild and commit
the bundle in the same change as any `srcjs/` edit. A clean `npm run build-only`
on unchanged sources gives a byte-identical bundle, so a diff in `inst/` after
building means the sources or the installed packages changed.

`.Rbuildignore` keeps the JS toolchain out of the R tarball: `^srcjs`,
`^node_modules`, `^bin`, `^scripts`, `^flow-typed`, `^package\.json$`,
`^package-lock\.json$`, `^Gruntfile\.js$`, `^\.babelrc$`, `^\.eslintrc\.js$`,
`^\.flowconfig$`, `^prettier\.config\.js$`, `^inst/log-files`, and
`.*\.js\.map$`. The last one means the source map is in git but not in the R
package; the `sourceMappingURL` line still points to it.

## CI and Node

`R-CMD-check` does not run Node. The `routine` job
(`rstudio/shiny-workflows` `routine.yaml@v1`, called from
`.github/workflows/R-CMD-check.yaml`) does: when `package.json` has a `build`
script it runs `npm ci` (which builds through `postinstall`), then
`npm run build` on the current Node release, and commits any changes under
`inst/` and `srcjs/` plus `package-lock.json`. On a same-repo PR it pushes that
commit back; on a push to `main` it fails instead. That job does not run Flow.

## License list

`bin/update-license.js` (run by `npm run update-license`, writing
`LICENSE.note`) and `scripts/license_checker.js` are near copies. Both use
`license-checker` to list the packages in `dependencies` with their license
text. `LICENSE.note` does not exist in the repo, and the shared `routine`
workflow's `license-note` step is off by default. The header both scripts print
says the package is GPL-3, but the package is now MIT (`DESCRIPTION`,
`LICENSE`).

## Dev loop without Shiny

1. `npm run watch` (or `npm run build-only` after each change).
2. Open `inst/reactlog/reactlog.html` in a browser straight from disk. It loads
   `defaultLog.js` (sets `window.log`) and then `reactlogAsset/reactlog.js`.
3. Refresh after each rebuild. To try another log, copy a file from
   `inst/log-files/` over `inst/reactlog/defaultLog.js` (and do not commit that
   unless you mean to; the website demo uses it).

## Pitfalls

- Do not run `grunt` without `NODE_OPTIONS=--openssl-legacy-provider` on Node
  17+; use `npm run build-only`.
- `git_add_compiled` stages `reactlog.js` but not `reactlog.js.map`. Stage the
  map yourself or it falls out of sync with the bundle.
- On Apple Silicon without Rosetta, Flow cannot run, so `flow-report` and the
  `srcjs/` and `.flowconfig` commit hooks fail. Install Rosetta or skip the
  hook with `git commit --no-verify`, then build and stage by hand.
- `npm install` / `npm ci` rebuilds the bundle. If `inst/` changes afterwards,
  check whether you meant it; restore with `git checkout -- inst/`.
- The `R/*.R` hook lints the whole package, not just your staged files, and
  needs `lintr` installed.
- `npm run build` runs `eslint --fix` and `prettier --write` on all of
  `srcjs/`, so it can change source files, not just the bundle. CI does the same
  and may push a commit to your PR.
- New top-level JS files need an `.Rbuildignore` entry or `R CMD check` warns.
