#!/usr/bin/env node
// Fail if reactlog's tsc / esbuild targets differ from rstudio/shiny's.
// The viewer only runs inside Shiny apps, so it should need no newer browser
// than Shiny does, and gains nothing from an older target.
// Usage: node bin/check_shiny_target.js [shiny-ref]   (default: main)

const fs = require("fs");
const path = require("path");

const ref = process.argv[2] || "main";
const root = path.join(__dirname, "..");
const shinyUrl = file =>
  `https://raw.githubusercontent.com/rstudio/shiny/${ref}/${file}`;

async function fetchText(file) {
  const res = await fetch(shinyUrl(file));
  if (!res.ok) throw new Error(`${res.status} fetching ${shinyUrl(file)}`);
  return res.text();
}

function match(text, regex, what) {
  const m = text.match(regex);
  if (!m) throw new Error(`Could not find ${what}`);
  return m[1].toLowerCase();
}

async function main() {
  const shinyTsconfig = await fetchText("tsconfig.json");
  const shinyBuild = await fetchText("srcts/build/_build.ts");

  // tsconfig.json files may have comments, so read them with a regex
  const tsconfig = fs.readFileSync(path.join(root, "tsconfig.json"), "utf8");
  const buildOnly = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8")
  ).scripts["build-only"];

  const targets = [
    [
      "shiny tsconfig.json target",
      match(shinyTsconfig, /"target":\s*"([^"]+)"/, "target in shiny tsconfig.json"),
    ],
    [
      "shiny srcts/build/_build.ts esbuild target",
      match(shinyBuild, /target:\s*"([^"]+)"/, "target in shiny _build.ts"),
    ],
    [
      "reactlog tsconfig.json target",
      match(tsconfig, /"target":\s*"([^"]+)"/, "target in tsconfig.json"),
    ],
    [
      "reactlog package.json build-only --target",
      match(buildOnly, /--target=(\S+)/, "--target in build-only"),
    ],
  ];

  for (const [name, value] of targets) console.log(`${value}\t${name}`);

  if (new Set(targets.map(([, value]) => value)).size !== 1) {
    console.error(
      `\nTargets differ from rstudio/shiny@${ref}. Update tsconfig.json ` +
        "(target and lib) and the build-only script in package.json to match, " +
        "then rebuild."
    );
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
