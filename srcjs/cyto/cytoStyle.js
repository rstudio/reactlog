// @flow

import colors from "../style/colors";

let styleHelper = function(selector: string, style: Object) {
  return {
    selector: selector,
    style: style,
  };
};

let nodeShapes = {
  start: {
    shape: "-1 1 0.33333333333 1 1 0 0.33333333333 -1 -1 -1",
    width: 50 * 0.75,
    height: 30,
  },
  middle: {
    shape: "-1 1 0.5 1 1 0 0.5 -1 -1 -1 -0.5 0",
    width: 50,
    height: 30,
  },
  end: {
    shape: "-1 1 1 1 1 -1 -1 -1 -0.33333333333 0",
    width: 50 * 0.75,
    height: 30,
  },
};

let pulseScale = 1 + 1 / 16;
let selectedScale = 2;

let edgePixelWidth = 4;

let labelWidth = 350;
let maxTextWidth = "800px";

let graphStyles = {
  node: {
    default: {
      "z-index": 0,
      label: "data(cytoLabelShort_)",
      color: colors.nodes.label_text_color,
      "text-opacity": colors.nodes.label_text_opacity,
      "text-valign": "bottom",
      // "text-margin-x": "-5",
      // "text-margin-y": "-5",
      "text-halign": "right",
      "border-color": colors.regular.black,
      "border-style": "solid",
      "border-width": 1,
      "background-color": colors.nodes.ready,
      "text-wrap": "ellipsis",
      "text-max-width": `${labelWidth}px`,
      "text-background-color": colors.nodes.label_background_color,
      "text-background-opacity": colors.nodes.label_background_opacity,
      "font-family": '"Fira Mono", monospace',
    },
    start: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.start.shape,
      width: nodeShapes.start.width,
      height: nodeShapes.start.height,
    },
    startBig: {
      "border-width": 2,
      width: nodeShapes.start.width * pulseScale,
      height: nodeShapes.start.height * pulseScale,
    },
    middle: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.middle.shape,
      width: nodeShapes.middle.width,
      height: nodeShapes.middle.height,
    },
    middleBig: {
      "border-width": 2,
      width: nodeShapes.middle.width * pulseScale,
      height: nodeShapes.middle.height * pulseScale,
    },
    end: {
      shape: "polygon",
      "shape-polygon-points": nodeShapes.end.shape,
      width: nodeShapes.end.width,
      height: nodeShapes.end.height,
      "text-max-width": `${labelWidth * 1.5}px`,
    },
    endBig: {
      "border-width": 2,
      width: nodeShapes.end.width * pulseScale,
      height: nodeShapes.end.height * pulseScale,
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
      "background-color": colors.nodes.invalidating,
    },
    invalidateActive: {
      "background-color": colors.nodes.invalidating,
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
      "background-color": colors.nodes.invalidating,
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
      width: edgePixelWidth,
      "target-arrow-shape": "triangle",
      "mid-target-arrow-shape": "triangle",
      "line-color": colors.edges.running, //"#9dbaea",
      "mid-target-arrow-color": colors.edges.running,
      "target-arrow-color": colors.edges.running,
    },
    isolate: {
      width: edgePixelWidth,
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
      "line-color": colors.regular.grey2,
      "mid-target-arrow-color": colors.regular.grey2,
    },
  },
  focus: {
    hoverNotFocused: {
      "background-blacken": -0.75,
      "border-color": colors.regular.grey2,
      "line-color": colors.regular.grey2,
      "mid-target-arrow-color": colors.regular.grey2,
      "target-arrow-color": colors.regular.grey2,
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
      "border-color": colors.regular.grey2,
      "line-color": colors.regular.grey2,
      "mid-target-arrow-color": colors.regular.grey2,
      "target-arrow-color": colors.regular.grey2,
    },
  },
  selected: {
    node: {
      "border-width": 4,
      // if you hover / selected, show all the label
      "text-max-width": maxTextWidth,
      "text-wrap": "wrap",
      "background-opacity": 1,
      "text-background-opacity": 1,
      "text-border-opacity": 1,
      "text-border-width": 1,
      "text-border-style": "solid",
      "text-border-color": colors.regular.black,
      "text-background-padding": 8 * 2,
      label: "data(cytoLabel_)",
      "z-index": 1000,
    },
    edge: {
      width: edgePixelWidth * 2,
    },
    ghostEdge: {
      width: edgePixelWidth * 2,
      "arrow-scale": 2 / 3,
    },
  },
  filtered: {
    node: {
      "border-width": 3,
      "font-size": "30",
    },
    start: {
      width: nodeShapes.start.width * selectedScale,
      height: nodeShapes.start.height * selectedScale,
    },
    middle: {
      width: nodeShapes.middle.width * selectedScale,
      height: nodeShapes.middle.height * selectedScale,
    },
    end: {
      width: nodeShapes.end.width * selectedScale,
      height: nodeShapes.end.height * selectedScale,
    },
  },
  hidden: {
    node: {
      // visibility: "hidden",
      "background-color": "white",
      "background-opacity": 1,
      "border-opacity": 0.5,
      "text-opacity": 0.5,
      label: "data(label)", // do not display a value and only the raw label
    },
    edge: {
      // visibility: "hidden",
      opacity: 0.5,
    },
  },
};

export { graphStyles, styleHelper as style, labelWidth };

export default graphStyles;
