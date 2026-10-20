// cytoscape 3.15 has no bundled types. Its shape is described by hand in
// cyto/cytoFlowType.ts, so the module itself stays untyped.
declare module "cytoscape";
declare module "cytoscape-dagre";

// Globals set by inst/reactlog/reactlog.html (or the sample log file) before
// the bundle runs, plus the debug handle set in index.ts.
interface Window {
  log: import("./log/logStates").LogType;
  __APP_DATA__?: import("./log/logStates").LogType;
  __APP_TIME__?: boolean;
  _reactlog: unknown;
}
