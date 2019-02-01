// @flow

import $ from "jquery";

// import console from "../utils/console";
import * as updateGraph from "./hoverStickyFilterSearch";

import { Node } from "../graph/Node";
import { Edge } from "../graph/Edge";
import { GhostEdge } from "../graph/GhostEdge";

let searchElement: JQuery;

// when str length < 3 do not search
// when str length = 0, reset filter
// when str length >= 3, set filter to all elements that match
let searchStringWith = function(str: string) {
  // if less than three chars...
  if (str.length < 3) {
    if (str.length === 0) {
      // TODO-barret show warning of resetting
      // console.log("resetting log!");
      return updateGraph.searchRegexReset();
    } else {
      // TODO-barret show warning of not enough characters
      // console.log("do nothing");
      return false;
    }
  }
  // escape the string
  // https://stackoverflow.com/a/17606289
  let escapeRegExp = function(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  };
  let searchRegex = new RegExp(escapeRegExp(str));
  return updateGraph.searchRegex(searchRegex);
};

let searchStringSet = function(str: string) {
  searchElement.val(str);
  return searchStringWith(str);
};
let searchStringClear = function() {
  return searchStringSet("");
};
let searchStringClearNoUpdate = function() {
  searchElement.val("");
};

let searchStringWithData = function(obj: Node | Edge | GhostEdge) {
  // update the graph by searching for the key
  if (obj instanceof Edge) {
    return searchStringSet(obj.ghostKey);
  }
  return searchStringSet(obj.key);
};

let searchStringContainer = function(searchElement_: JQuery) {
  searchElement = searchElement_;
  searchElement.on("input", function(e) {
    searchStringWith($(e.target).val());
  });
};

export {
  searchStringWith,
  searchStringSet,
  searchStringClear,
  searchStringClearNoUpdate,
  searchStringContainer,
  searchStringWithData,
};
