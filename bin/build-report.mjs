import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { build } from "esbuild";

const bundle = await build({
  entryPoints: ["viewer/reactlog.ts"],
  bundle: true,
  format: "iife",
  globalName: "ReactlogViewer",
  target: "es2022",
  charset: "utf8",
  write: false,
});

for (const dir of ["pkg-py/src/reactlog/assets", "pkg-r/inst/report"]) {
  await mkdir(dir, { recursive: true });
  await copyFile("viewer/reactlog.html", dir + "/reactlog.html");
  await copyFile("viewer/reactlog.css", dir + "/reactlog.css");
  await writeFile(dir + "/reactlog.js", bundle.outputFiles[0].contents);
}
