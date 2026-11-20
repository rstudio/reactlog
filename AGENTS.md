# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository.

## What this is

Both packages embed the report under `viewer/`. R calls `reactlog_render()` for saved and live reports. Python uses `format_reactlog_html()`. After editing the shared template, CSS, or TypeScript, run `npm run build-report` and commit the generated assets in `pkg-r/inst/report/` and `pkg-py/src/reactlog/assets/`. Package installations require no Node runtime.

The original Cytoscape viewer under `srcts/` has its own build and replay tests. Its committed assets live under `pkg-r/inst/reactlog/`.

## Commands

JavaScript (npm; Node 22 works):

```bash
npm ci                         # install; postinstall also runs the build
npm run build-only             # esbuild -> pkg-r/inst/reactlog/reactlogAsset/reactlog.js (no type check)
npm run typecheck              # tsc for app code, then for tests (tsconfig.test.json); no output files
npm test                       # replay the sample logs in pkg-r/inst/log-files/ (node:test)
npm run build                  # eslint --fix + prettier on srcts, typecheck, test, then build
npm run watch                  # lint, then rebuild on change (no type check)
npm run lint -- srcts/foo.ts   # eslint --fix + prettier on given files
npm run check-shiny-target     # fail if tsc/esbuild target differs from rstudio/shiny (needs network)
```

R (from `pkg-r/`):

```r
devtools::load_all()
devtools::test()                                   # all tests
testthat::test_file("tests/testthat/test-shiny_module.R")  # one file
devtools::lint()                                   # lintr, line length 100 (.lintr)
devtools::document()                               # regenerate man/ and NAMESPACE (roxygen, markdown on)
devtools::check()
```

`npm ci` installs a git pre-commit hook (`pre-commit` + `lint-staged`, config in `package.json`). On commit it lints staged `pkg-r/R/*.R` with `devtools::lint()` (needs the `lintr` R package) and, for staged `srcts/**/*.ts`, runs lint, typecheck, and build, then `git add`s the rebuilt bundle.

## Memory Bank

The `memory-bank/` directory holds contributor documentation with YAML
frontmatter (`title`, `description`). **Before exploring the codebase**, invoke
the `memory-bank` skill to find and read the relevant docs. Update or add docs
when you learn something future contributors will need (see the skill for
conventions).

Contributor skills live in `.agents/skills/`; `.claude/skills` is a symlink to
it. Only allowlisted skills are tracked, so when adding or removing one, update
the `!/.agents/skills/<name>/` lines in `.gitignore` to match.

## Architecture

`memory-bank/architecture.md` explains how the R side, the HTML template, and
the JavaScript app connect, plus how to work on the JS without running Shiny.
Read it before working in `pkg-r/R/` or `srcts/`.

## Conventions

- Source is TypeScript (`tsconfig.json`, `strict` on). Lint is eslint 10 + typescript-eslint + prettier 3 (`eslint.config.mjs`, `prettier.config.js`).
- Add a pkg-r/NEWS.md entry for user-facing changes (CONTRIBUTING.md).
- New development files under `pkg-r/` may need an entry in `pkg-r/.Rbuildignore`, or R CMD check will warn.
