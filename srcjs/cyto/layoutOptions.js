// @flow

import cytoscape from "cytoscape"; // flowlint-line untyped-import:off
import dagre from "cytoscape-dagre"; // flowlint-line untyped-import:off

import { labelWidth } from "./cytoStyle";

import type { CytoscapeElement, CytoscapeLibrary } from "./cytoFlowType";

(cytoscape: CytoscapeLibrary).use(dagre);

let layoutOptions = {
  // whether to fit to viewport
  //   do not want to fit to viewport as user may have zoomed/panned
  fit: false,

  name: "dagre",
  rankDir: "LR", // 'TB' for top to bottom flow, 'LR' for left to right,
  rankSep: labelWidth + 50, // the separation between node columns
  nodeSep: 10, // vertical separation of nodes
  edgeSep: 50, // the separation between adjacent edges in the same rank
  ranker: "longest-path", // Type of algorithm to assign a rank to each node in the input graph. Possible values: "network-simplex", "tight-tree" or "longest-path"
  padding: 30, // fit padding
  spacingFactor: 1, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
  animate: true, // whether to transition the node positions
  animateFilter: function(node: CytoscapeElement, i: number) {
    return true;
  }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 1000, // duration of animation in ms if enabled
  animationEasing: "ease-in-out-quad", // easing of animation if enabled
};

export default layoutOptions;
