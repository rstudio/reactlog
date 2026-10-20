# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository.

## What this is

`reactlog` is an R package that visualizes Shiny's reactive dependency graph. A small R side (`R/`) injects Shiny's recorded log into an HTML page; a TypeScript app (`srcts/`) replays it as a cytoscape graph.

The built bundle `inst/reactlog/reactlogAsset/reactlog.js` (and its `.map`) **is committed**. CRAN and `R-CMD-check` never run Node. If you change anything in `srcts/`, rebuild and commit the bundle with your change (the shared `routine` CI job also runs `npm ci` + `npm run build` and pushes any bundle changes back to same-repo PRs).

## Commands

JavaScript (npm; Node 22 works):

```bash
npm ci                         # install; postinstall also runs the build
npm run build-only             # esbuild -> inst/reactlog/reactlogAsset/reactlog.js (no type check)
npm run typecheck              # tsc, no output files
npm test                       # replay the sample logs in inst/log-files/ (node:test)
npm run build                  # eslint --fix + prettier on srcts, typecheck, test, then build
npm run watch                  # lint, then rebuild on change (no type check)
npm run lint -- srcts/foo.ts   # eslint --fix + prettier on given files
npm run check-shiny-target     # fail if tsc/esbuild target differs from rstudio/shiny (needs network)
```

R:

```r
devtools::load_all()
devtools::test()                                   # all tests
testthat::test_file("tests/testthat/test-shiny_module.R")  # one file
devtools::lint()                                   # lintr, line length 100 (.lintr)
devtools::document()                               # regenerate man/ and NAMESPACE (roxygen, markdown on)
devtools::check()
```

`npm ci` installs a git pre-commit hook (`pre-commit` + `lint-staged`, config in `package.json`). On commit it lints staged `R/*.R` with `devtools::lint()` (needs the `lintr` R package) and, for staged `srcts/**/*.ts`, runs lint, typecheck, and build, then `git add`s the rebuilt bundle.

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
Read it before working in `R/` or `srcts/`.

## Conventions

- Source is TypeScript (`tsconfig.json`, `strict` on). Lint is eslint 10 + typescript-eslint + prettier 3 (`eslint.config.mjs`, `prettier.config.js`).
- Add a NEWS.md entry for user-facing changes (CONTRIBUTING.md).
- New top-level files need an entry in `.Rbuildignore`, or R CMD check will warn.
