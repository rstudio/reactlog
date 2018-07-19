// @flow

import _assign from "lodash/assign";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { SomeGraphData } from "../graph/Graph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let hoverData = function(
  data: SomeGraphData,
  cytoOptions?: CytoscapeOptions = {}
): void {
  rlog.getGraph.updateHoverData(data);
  updateGraph(rlog.curTick, cytoOptions);
};
let hoverDataReset = function(cytoOptions?: CytoscapeOptions = {}): void {
  rlog.getGraph.updateHoverDataReset();
  updateGraph(rlog.curTick, cytoOptions);
};
let stickyDatas = function(
  datas: Array<SomeGraphData>,
  cytoOptions?: CytoscapeOptions = {}
): void {
  rlog.getGraph.updateStickyDatas(datas);
  updateGraph(rlog.curTick, cytoOptions);
};
let stickyDatasReset = function(cytoOptions?: CytoscapeOptions = {}): void {
  rlog.getGraph.updateStickyDatasReset();
  updateGraph(rlog.curTick, cytoOptions);
};
let filterDatas = function(
  datas: Array<SomeGraphData>,
  cytoOptions?: CytoscapeOptions = {}
): void {
  rlog.getGraph.updateFilterDatas(datas);
  updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let filterDatasReset = function(cytoOptions?: CytoscapeOptions = {}): void {
  rlog.getGraph.updateFilterDatasReset();
  updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let searchRegex = function(
  searchRegex: RegExp,
  cytoOptions?: CytoscapeOptions = {}
): void {
  rlog.getGraph.updateSearchRegex(searchRegex);
  updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let searchRegexReset = function(cytoOptions?: CytoscapeOptions = {}): void {
  rlog.getGraph.updateSearchRegexReset();
  updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let resetHoverStickyFilterData = function(
  cytoOptions?: CytoscapeOptions = {}
): void {
  rlog.getGraph.updateHoverDataReset();
  rlog.getGraph.updateStickyDatasReset();
  rlog.getGraph.updateFilterDatasReset();
  rlog.getGraph.updateSearchRegexReset();
  updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};

export {
  hoverData,
  hoverDataReset,
  stickyDatas,
  stickyDatasReset,
  filterDatas,
  filterDatasReset,
  searchRegex,
  searchRegexReset,
  resetHoverStickyFilterData,
};
