// @flow

import $ from "jquery";

// import console from "../utils/console";
import * as updateGraph from "./hoverStickyFilterSearch";

import { Node } from "../graph/Node";
import { Edge } from "../graph/Edge";
import { GhostEdge } from "../graph/GhostEdge";

let searchElement: JQuery;

let startsWithR = /^r\d/;

// when str length < 3 do not search
// when str length = 0, reset filter
// when str length >= 3, set filter to all elements that match
// when exact, only match the whole label or key
let searchStringWith = function(str: string, exact: boolean = false) {
  // if less than three chars...
  if (str.length < 3) {
    if (str.length === 0) {
      // TODO-barret show warning of resetting
      // console.log("resetting log!");
      return updateGraph.searchRegexReset();
    } else if (startsWithR.test(str)) {
      // continue execution like normal
      // will hopefully match against a node
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
  let pattern = escapeRegExp(str);
  let searchRegex = new RegExp(exact ? `^${pattern}$` : pattern);
  return updateGraph.searchRegex(searchRegex);
};

let searchStringSet = function(str: string, exact: boolean = false) {
  searchElement.val(str);
  return searchStringWith(str, exact);
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
    return searchStringSet(obj.ghostKey, true);
  }
  return searchStringSet(obj.key, true);
};

let searchStringContainer = function(searchElement_: JQuery) {
  searchElement = searchElement_;
  searchElement.on("input", function(e) {
    searchStringWith(
      $(e.target)
        .val()
        .toString()
    );
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
