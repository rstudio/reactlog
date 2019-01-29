// @flow

import type { SomeGraphData } from "../graph/Graph";

type CytoOnEvent = (method: string, callback: (evt: CytoEvent) => any) => void;
// type CytoOnDblClick = (method: string, callback: (evt: CytoEvent, originalEvt: Event) => any) => void

type CytoData = {
  group: string,
  data: SomeGraphData,
};

type CytoscapeLRB = {
  left: CytoscapeElements,
  right: CytoscapeElements,
  both: CytoscapeElements,
};

type CytoscapeEdge = {
  id: () => string,
  // data: () => SomeGraphData,
  data: (info?: SomeGraphData | string) => any,
  flashClass: (className: string, timeout: number) => void,
  once: (string, (CytoEvent) => any) => any,
  trigger: (string, CytoEvent) => any,
  classes: string => CytoscapeEdge,
  style: Object => CytoscapeNode,
  removeStyle: () => CytoscapeNode,
};

// type SetEleData = (info: SomeGraphData) => CytoscapeElements;
// type GetEleData = () => CytoscapeElements;
type CytoscapeNode = {
  id: () => string,
  // data: (info: SomeGraphData) => CytoscapeElements,
  data: (info?: SomeGraphData | string) => any,
  flashClass: (className: string, timeout: number) => void,
  once: (string, (CytoEvent) => any) => any,
  trigger: (string, CytoEvent) => any,
  classes: string => CytoscapeNode,
  style: Object => CytoscapeNode,
  removeStyle: () => CytoscapeNode,
};
type CytoscapeElement = CytoscapeNode | CytoscapeEdge;
type CytoscapeElements = {
  $: (identifier?: string | CytoscapeElement) => CytoscapeElements,
  $id: (id: string) => CytoscapeElement,
  length: number,
  data: (info?: SomeGraphData | string) => any,
  map: ((element: CytoscapeElement) => void) => void,
  diff: (other: CytoscapeElements) => CytoscapeLRB,
  style: Object => CytoscapeElements,
  sort: (
    (a: CytoscapeElement, b: CytoscapeElement) => number
  ) => CytoscapeElements,
};

type CytoscapeLayoutObject = {
  run: () => void,
  one: (event: string, callback: Function) => void,
};
type CytoscapeType = {
  $: (identifier?: string | CytoscapeElement) => CytoscapeElements,
  $id: (id: string) => CytoscapeElement,
  add: (x: Array<CytoData> | CytoData | CytoscapeElement) => CytoscapeElement,
  on: CytoOnEvent, // | CytoOnDblClick
  startBatch: () => void,
  endBatch: () => void,
  nodes: () => CytoscapeElements,
  edges: () => CytoscapeElements,
  remove: (info: any) => CytoscapeType,
  animate: (animationInfo: { duration: number }) => CytoscapeType,
  layout: (layoutOptions: Object) => CytoscapeLayoutObject,
  zoom: (zoomLevel?: number) => number,
  minZoom: (zoomLevel?: number) => number,
  maxZoom: (zoomLevel?: number) => number,
  resize: () => void,
};

type CytoEvent = {
  target: CytoEventTarget,
};

type CytoEventTarget = EventTarget & {
  data: () => SomeGraphData,
  once: (string, (CytoEvent) => any) => any,
  trigger: (string, CytoEvent) => any,
};

type CytoscapeLibrary = {
  use: (lib: any) => void,
};

type CytoscapeOptions = {
  animate?: boolean, // whether to animate changes to the layout
  animationDuration?: number, // duration of animation in ms, if enabled
  animationEasing?: string, // easing of animation, if enabled
  animateFilter?: (node: CytoscapeNode, i: number) => boolean, // a function that determines whether the node should be animated.
  //All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  eles?: CytoscapeElements, // collection of elements involved in the layout; set by cy.layout() or eles.layout()
  fit?: boolean, // whether to fit the viewport to the graph
  padding?: number, // padding to leave between graph and viewport
  pan?: { x: number, y: number }, // pan the graph to the provided position, given as { x, y }
  ready?: () => void, // callback for the layoutready event
  stop?: () => void, // callback for the layoutstop event
  spacingFactor?: number, // a positive value which adjusts spacing between nodes (>1 means greater than usual spacing)
  transform?: (
    node: CytoscapeNode,
    position: { x: number, y: number }
  ) => { x: number, y: number }, // transform a given node position. Useful for changing flow direction in discrete layouts
  zoom?: number, // zoom level as a positive number to set after animation
  forceRedraw?: boolean,
};

export type {
  CytoscapeType,
  CytoEvent,
  CytoscapeNode,
  CytoscapeEdge,
  CytoData,
  CytoscapeElement,
  CytoscapeLibrary,
  CytoscapeOptions,
};
