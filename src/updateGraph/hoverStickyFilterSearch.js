// @flow

import $ from "jquery";
import _assign from "lodash/assign";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";

import type { SomeGraphData } from "../graph/Graph";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

let hoverData = function(
  data: SomeGraphData,
  cytoOptions?: CytoscapeOptions = {}
) {
  rlog.getGraph.updateHoverData(data);
  return updateGraph(rlog.curTick, cytoOptions);
};
let hoverDataReset = function(cytoOptions?: CytoscapeOptions = {}) {
  rlog.getGraph.updateHoverDataReset();
  return updateGraph(rlog.curTick, cytoOptions);
};
let stickyDatas = function(
  datas: Array<SomeGraphData>,
  cytoOptions?: CytoscapeOptions = {}
) {
  rlog.getGraph.updateStickyDatas(datas);
  return updateGraph(rlog.curTick, cytoOptions);
};
let stickyDatasReset = function(cytoOptions?: CytoscapeOptions = {}) {
  rlog.getGraph.updateStickyDatasReset();
  return updateGraph(rlog.curTick, cytoOptions);
};
let filterDatas = function(
  datas: Array<SomeGraphData>,
  cytoOptions?: CytoscapeOptions = {}
) {
  rlog.getGraph.updateFilterDatas(datas);
  return updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let filterDatasReset = function(cytoOptions?: CytoscapeOptions = {}) {
  rlog.getGraph.updateFilterDatasReset();
  return updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let searchRegex = function(
  searchRegex: RegExp,
  cytoOptions?: CytoscapeOptions = {}
) {
  rlog.getGraph.updateSearchRegex(searchRegex);
  return updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let searchRegexReset = function(cytoOptions?: CytoscapeOptions = {}) {
  $("#search").val("");
  rlog.getGraph.updateSearchRegexReset();
  return updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
};
let resetHoverStickyFilterData = function(cytoOptions?: CytoscapeOptions = {}) {
  rlog.getGraph.updateHoverDataReset();
  rlog.getGraph.updateStickyDatasReset();
  rlog.getGraph.updateFilterDatasReset();
  rlog.getGraph.updateSearchRegexReset();
  return updateGraph(rlog.curTick, _assign({ fit: true }, cytoOptions));
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
