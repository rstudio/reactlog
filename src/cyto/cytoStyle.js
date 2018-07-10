// @flow

import colors from "../style/colors";

let styleHelper = function(selector: string, style: Object) {
  return {
    selector: selector,
    style: style,
  };
};

let nodeShapes = {
  start: "-1 1 0.33333333333 1 1 0 0.33333333333 -1 -1 -1",
  middle: "-1 1 0.5 1 1 0 0.5 -1 -1 -1 -0.5 0",
  end: "-1 1 1 1 1 -1 -1 -1 -0.33333333333 0",
};
let pulseScale = 1 + 1 / 16;

let graphStyles = {
  node: {
    default: {
      label: "data(cytoLabel)",
      "text-opacity": 0.5,
      "text-valign": "bottom",
      "text-margin-x": "-5",
      "text-halign": "right",
      "border-color": colors.regular.black,
      "border-style": "solid",
      "border-width": 1,
      "background-color": colors.nodes.ready,
      "text-wrap": "ellipsis",
      "text-max-width": "200px",
    },
    start: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.start,
      width: 50 * 0.75,
      height: 30,
    },
    startBig: {
      "border-width": 2,
      width: 50 * 0.75 * pulseScale,
      height: 30 * pulseScale,
    },
    middle: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.middle,
      width: 50,
      height: 30,
    },
    middleBig: {
      "border-width": 2,
      width: 50 * pulseScale,
      height: 30 * pulseScale,
    },
    end: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.end,
      width: 50 * 0.75,
      height: 30,
    },
    endBig: {
      "border-width": 2,
      width: 50 * 0.75 * pulseScale,
      height: 30 * pulseScale,
    },
    enter: {
      // "border-width": 2,
      "background-color": colors.nodes.calculating,
    },
    enterActive: {
      "background-color": colors.nodes.calculating,
      "border-width": 2.5,
    },
    invalidate: {
      // "border-width": 2,
      "background-color": colors.nodes.invalidated,
    },
    invalidateActive: {
      "background-color": colors.nodes.invalidated,
      "border-width": 2.5,
    },
    invalidateDone: {
      "background-color": colors.nodes.invalidated,
    },
    isolate: {
      "border-style": "dashed",
      // "border-width": 3,
      // "border-opacity"
    },
    isolateInvalidate: {
      "border-style": "dashed",
      "border-color": "darkgrey",
      "border-width": 3,
      // "border-opacity"
    },
    valueChanged: {
      // "background-color": colors.regular.red,
      "background-color": colors.nodes.invalidated,
      // "border-style": "dashed",
      // "border-color": "darkgrey",
      // "border-width": 3,
      // "border-opacity"
    },
    frozen: {
      "background-color": colors.frozen.default,
    },
  },
  edge: {
    default: {
      "curve-style": "bezier",
      width: 4,
      "target-arrow-shape": "triangle",
      "mid-target-arrow-shape": "triangle",
      "line-color": colors.edges.running, //"#9dbaea",
      "mid-target-arrow-color": colors.edges.running,
      "target-arrow-color": colors.edges.running,
    },
    isolate: {
      width: 4,
      "line-color": colors.edges.isolate,
      "mid-target-arrow-color": colors.edges.isolate,
      "target-arrow-color": colors.edges.isolate,
      "line-style": "dashed",
    },
  },
  ghostEdge: {
    default: {
      width: 1,
      "mid-target-arrow-shape": "triangle",
      "mid-target-arrow-color": colors.ghostEdges.default,
      "arrow-scale": 0.25,
      "curve-style": "haystack",
      "line-color": colors.ghostEdges.default,
      "line-style": "dotted",
    },
    hoverNotFocusedButSticky: {
      "line-color": colors.regular.grey2,
      "mid-target-arrow-color": colors.regular.grey2,
    },
    hoverNotFocused: {
      "line-color": colors.nodes.invalidated,
      "mid-target-arrow-color": colors.nodes.invalidated,
    },
  },
  focus: {
    hoverNotFocused: {
      "background-blacken": -0.75,
      "border-color": colors.nodes.invalidated,
      "line-color": colors.nodes.invalidated,
      "mid-target-arrow-color": colors.nodes.invalidated,
      "target-arrow-color": colors.nodes.invalidated,
    },
    hoverNotFocusedButSticky: {
      "background-blacken": -0.35,
      "border-color": colors.regular.grey2,
      "line-color": colors.regular.grey2,
      "mid-target-arrow-color": colors.regular.grey2,
      "target-arrow-color": colors.regular.grey2,
    },
    stickyNotFocused: {
      "background-blacken": -0.75,
      "border-color": colors.nodes.invalidated,
      "line-color": colors.nodes.invalidated,
      "mid-target-arrow-color": colors.nodes.invalidated,
      "target-arrow-color": colors.nodes.invalidated,
    },
  },
  selected: {
    node: {
      "border-width": 4,
    },
    edge: {
      width: 10,
    },
    ghostEdge: {
      width: 6,
      "arrow-scale": 0.5,
    },
  },
};

export { graphStyles, styleHelper as style };

export default graphStyles;
