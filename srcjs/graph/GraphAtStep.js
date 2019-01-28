// @flow

import _assign from "lodash/assign";
import _clone from "lodash/clone";
import _filter from "lodash/filter";
import _indexOf from "lodash/indexOf";
import _some from "lodash/some";
import _sortBy from "lodash/sortBy";
import _sortedIndex from "lodash/sortedIndex";
import _sortedIndexOf from "lodash/sortedIndexOf";
import _union from "lodash/union";

import console from "../utils/console";

import { mapValues } from "../utils/MapHelper";
import { LogStates } from "../log/logStates";
import { Graph } from "./Graph";

import layoutOptions from "../cyto/layoutOptions";

import { Node } from "./Node";
import { Edge } from "./Edge";

import type {
  LogType,
  LogEntryInvalidateStartType,
  // LogEntryDefineType,
  // ReactIdType,
} from "../log/logStates";
import type { SomeGraphData } from "./Graph";
import type {
  CytoscapeType,
  CytoscapeNode,
  CytoscapeEdge,
} from "../cyto/cytoFlowType";

import type { CytoscapeOptions } from "../cyto/cytoFlowType";

// TODO-barret make filterDatas and hoverDatas sub modules of subsetDatas or something

class GraphAtStep {
  log: LogType;
  originalLog: LogType;
  searchRegex: ?RegExp;
  filterDatas: Array<SomeGraphData>;
  hoverData: ?SomeGraphData;
  stickyDatas: Array<SomeGraphData>;

  finalGraph: Graph;
  finalCyto: any;

  cytoLayout: any;

  steps: Array<number>;
  stepsVisible: Array<number>;
  filteredStepsVisible: Array<number>;
  stepsAsyncStart: Array<number>;
  stepsAsyncStop: Array<number>;
  stepsIdle: Array<number>;
  stepsOutputCalc: Array<number>;
  stepsUserMark: Array<number>;
  minStep: number;
  maxStep: number;

  constructor(log: LogType) {
    this.originalLog = log;

    // hoverInfo[key] = `HoverStatus`
    this.searchRegex = null;
    this.filterDatas = [];
    this.hoverData = null;
    this.stickyDatas = [];
    // this.hoverDefault = "focused"
    // this.hoverInfo = {} // use `hoverKey`

    // this.filterMap = {};

    this.log = log;
    this.updateSteps(log);

    this.updateFinalGraph();
  }

  get hasSearchRegex() {
    return this.searchRegex ? true : false;
  }
  // function hasFilterDatas(): boolean %checks {
  //   return this.filterDatas ? this.filterDatas.length > 0 : false;
  // }
  // get hasStickyDatas() {
  //   return this.stickyDatas ? this.stickyDatas.length > 0 : false;
  // }
  // get hasHoverData() {
  //   return this.hoverData ? true : false;
  // }

  // return graph at step k
  graphAtStep(k: number): Graph {
    return this.atStep(k, true);
  }
  updateFinalGraph() {
    this.finalGraph = this.graphAtStep(this.log.length);
    // this.finalCyto = this.finalGraph.cytoGraph;
  }

  updateSteps(log: LogType) {
    this.steps = [];
    this.stepsAsyncStart = [];
    this.stepsAsyncStop = [];
    this.stepsIdle = [];
    this.stepsOutputCalc = [];
    this.stepsUserMark = [];
    this.minStep = log.length > 0 ? log[0].step : -1;
    this.maxStep = log.length > 0 ? log[log.length - 1].step : -1;

    let logItem, i;
    let idleArr = [];
    let startI = 0;
    while (
      log.length > startI + 2 &&
      log[startI].action === LogStates.asyncStart &&
      log[startI].session === null &&
      log[startI + 1].action === LogStates.asyncStop &&
      log[startI + 1].session === null &&
      log[startI + 2].action === LogStates.idle &&
      log[startI + 2].session === null
    ) {
      startI = startI + 3;
    }
    while (log.length > startI && log[startI].action === LogStates.idle) {
      startI = startI + 1;
    }
    for (i = startI; i < log.length; i++) {
      logItem = log[i];
      switch (logItem.action) {
        case LogStates.enter:
          idleArr.push(i);
          break;
        case LogStates.exit:
          idleArr.pop();
          if (idleArr.length === 0) {
            this.stepsOutputCalc.push(logItem.step);
          }
          break;
        case LogStates.asyncStart:
          this.stepsAsyncStart.push(logItem.step);
          break;
        case LogStates.asyncStop:
          this.stepsAsyncStop.push(logItem.step);
          break;
        case LogStates.idle:
          this.stepsIdle.push(logItem.step);
          break;
        case LogStates.userMark:
          this.stepsUserMark.push(logItem.step);
          break;
      }

      switch (logItem.action) {
        case LogStates.invalidateStart: {
          let logEntry = (logItem: LogEntryInvalidateStartType);
          if (logEntry.type === "other") {
            break;
          }
          if (log.length > i + 1 && i - 1 >= 0) {
            let prevLogItem = log[i - 1];
            let nextLogItem = log[i + 1];
            if (
              nextLogItem.action === LogStates.asyncStart &&
              log.length > i + 2
            ) {
              nextLogItem = log[i + 2];
            }
            if (
              nextLogItem.action === LogStates.invalidateEnd &&
              prevLogItem.action === LogStates.define &&
              logItem.reactId === prevLogItem.reactId &&
              logItem.reactId === nextLogItem.reactId
            ) {
              // define X <-- keep
              // invalidte start X <-- ignore!
              // invalidate end X <-- already ignored
              break;
            }
          }
          // TODO-barret check if reactId is a reactive values. If so, skip, otherwise add
          this.steps.push(logEntry.step);
          break;
        }
        case LogStates.define:
        // TODO-barret only for reactive values keys
        case LogStates.invalidateEnd:
        case LogStates.isolateInvalidateStart:
        case LogStates.isolateInvalidateEnd:
        // case "isolateEnter":
        // case "isolateExit":
        case LogStates.createContext:
        case LogStates.asyncStart:
        case LogStates.asyncStop:
        case LogStates.idle:
        case LogStates.userMark:
          break;
        default:
          this.steps.push(logItem.step);
          break;
      }
    }

    this.stepsVisible =
      // sort integer list
      _sortBy(
        // get union (unique values) of all visible locations
        _union(this.steps, this.stepsUserMark, this.stepsIdle)
      );
    this.updateFilteredStepsVisible();

    // this.graphCache = {};
    // this.cacheStep = 250;
    // var tmpGraph = new Graph(log);
    // for (i = 0; i < log.length; i++) {
    //   tmpGraph.addEntry(log[i])
    //   if ((i % this.cacheStep) == 0) {
    //     this.graphCache[i] = _cloneDeep(tmpGraph)
    //   }
    // }
  }

  updateFilteredStepsVisible(): void {
    if (!hasLength(this.filterDatas)) {
      // no filtered data, so set to all visible steps
      this.filteredStepsVisible = _clone(this.stepsVisible);
      return;
    }
    // must have filtered data

    let filteredStepsVisible = [];
    let graphAtEnd = this.graphAtStep(this.log.length);
    let visibleStep, logEntry, i;

    let filterReactIds = this.filterDatas.map(function(node) {
      return node.reactId;
    });
    // todo must be actual log. not visible steps
    for (i = 0; i < this.stepsVisible.length; i++) {
      visibleStep = this.stepsVisible[i];
      logEntry = this.log[visibleStep];

      switch (logEntry.action) {
        case LogStates.dependsOn: {
          // since we are adding an edge in the graph, update the graph
          // graphAtI = this.graphAtStep(visibleStep);
          let decendents = _union(
            filterReactIds,
            graphAtEnd.decendentNodeIdsForDatas(this.filterDatas)
          );
          let ancestors = _union(
            filterReactIds,
            graphAtEnd.ancestorNodeIdsForDatas(this.filterDatas)
          );
          // reactId is target (ends at ancestors)
          if (_indexOf(ancestors, logEntry.reactId) !== -1) {
            filteredStepsVisible.push(visibleStep);
            break;
          }
          // depOnReactId is source (starts from children)
          if (_indexOf(decendents, logEntry.depOnReactId) !== -1) {
            filteredStepsVisible.push(visibleStep);
            break;
          }
          // not found
          break;
        }
        case LogStates.dependsOnRemove:
          // check for both to and from (since it must exist beforehand)
          // graphAtI = this.graphAtStep(visibleStep);
          if (
            graphAtEnd.nodes.has(logEntry.reactId) &&
            graphAtEnd.nodes.has(logEntry.depOnReactId)
          ) {
            filteredStepsVisible.push(visibleStep);
            break;
          }
          // not found
          break;

        case LogStates.define:
        case LogStates.updateNodeLabel:
          // graphAtI = this.graphAtStep(visibleStep);

          if (!graphAtEnd.hasNodeReactId(logEntry.reactId)) {
            // no node found
            break;
          }
          if (this.searchRegex) {
            if (logEntry.label) {
              if (!this.searchRegex.test(logEntry.label)) {
                // regex doesn't match node
                break;
              }
            }
          }
          filteredStepsVisible.push(visibleStep);
          break;

        case LogStates.freeze:
        case LogStates.thaw:
        case LogStates.valueChange:
        case LogStates.enter:
        case LogStates.exit:
        case LogStates.invalidateLater:
        case LogStates.invalidateStart:
        case LogStates.invalidateEnd:
        case LogStates.isolateEnter:
        case LogStates.isolateExit:
        case LogStates.isolateInvalidateStart:
        case LogStates.isolateInvalidateEnd:
          if (!graphAtEnd.hasNodeReactId(logEntry.reactId)) {
            // no node found in filtered graph
            break;
          }
          filteredStepsVisible.push(visibleStep);
          break;

        case LogStates.idle:
        case LogStates.userMark:
          // always include (for now)
          filteredStepsVisible.push(visibleStep);
          break;

        case LogStates.createContext:
        case LogStates.asyncStart:
        case LogStates.asyncStop:
          // do not include
          break;

        default:
          console.error(logEntry);
          throw "unknown logEntry action in 'next'";
      }
    }

    // return early if nothing is found. I hope this is never called
    if (filteredStepsVisible.length === 0) {
      this.filteredStepsVisible = filteredStepsVisible;
      return;
    }

    let log = this.log;
    this.filteredStepsVisible = _filter(filteredStepsVisible, function(
      visibleStep,
      idx
    ) {
      if (idx === 0) return true;

      if (log[visibleStep].action === LogStates.idle) {
        let priorVisibleStep = filteredStepsVisible[idx - 1];
        if (log[priorVisibleStep].action === LogStates.idle) {
          return false;
        }
      }
      return true;
    });

    return;
  }

  nextStep(k: number): number {
    let idx = _sortedIndexOf(this.filteredStepsVisible, k);
    if (idx >= 0) {
      // go to the next step location
      idx += 1;
    } else {
      // doesn't exist... so go to next closes step
      idx = _sortedIndex(this.filteredStepsVisible, k);
    }
    // else, does not exist, so it is directly there
    if (idx >= this.filteredStepsVisible.length || idx < 0) return -1;
    return this.filteredStepsVisible[idx];
  }
  prevStep(k: number): number {
    let idx = _sortedIndex(this.filteredStepsVisible, k) - 1;
    if (idx < 0 || idx >= this.filteredStepsVisible.length) return -1;
    return this.filteredStepsVisible[idx];
  }

  atStep(k: number, graphOnly: boolean = true): Graph {
    let kVal = Math.max(1, Math.min(k, this.log.length));
    let i, graph;
    // if (kVal >= this.cacheStep) {
    //   iStart = Math.floor((kVal - 1) / this.cacheStep) * this.cacheStep;
    //   graph = _cloneDeep(this.graphCache[iStart])
    // }
    graph = new Graph(this.log);
    for (i = 0; i < this.log.length && this.log[i].step <= kVal; i++) {
      graph.addEntry(this.log[i]);
    }

    // if any hover...
    if (this.hoverData && graph.hasSomeData(this.hoverData)) {
      graph.hoverStatusOnNodeIds(
        graph.familyTreeNodeIds(this.hoverData),
        "state"
      );
      graph.highlightSelected(this.hoverData, "selected");
    }
    // if any sticky...
    if (hasLength(this.stickyDatas)) {
      if (
        _some(
          this.stickyDatas.map(function(data) {
            return graph.hasSomeData(data);
          })
        )
      ) {
        // at least some sticky data is visible
        let stickyTree = graph.familyTreeNodeIdsForDatas(this.stickyDatas);
        graph.hoverStatusOnNodeIds(stickyTree, "sticky");
        this.stickyDatas.map(function(data) {
          graph.highlightSelected(data, "selected");
        });
        if (!this.hoverData) {
          // if sticky data no hover data... make the sticky data hover!
          graph.hoverStatusOnNodeIds(stickyTree, "state");
        }
      }
    }

    // if any searching
    if (this.searchRegex) {
      let searchRegex = this.searchRegex;
      let matchedNodes = _filter(
        // (mapValues(graph.nodes): ArraySomeGraphData),
        mapValues(graph.nodes),
        function(node: Node) {
          return searchRegex.test(node.label);
        }
      );

      if (matchedNodes.length === 0) {
        // TODO-barret warn of no matches
        // console.log("no matches!");
        graph.hoverStatusOnNodeIds([], "filtered");

        if (!graphOnly) {
          this.updateFilterDatasReset(!graphOnly);
        }
      } else {
        if (!graphOnly) {
          this.updateFilterDatas(
            // for some reason, an array of node does not work with an array of (node, edge, or ghostedge)
            ((matchedNodes: Array<Object>): Array<SomeGraphData>),
            !graphOnly
          );
        }
        // filter on regex
        graph.filterGraphOnNodeIds(
          this.finalGraph.familyTreeNodeIdsForDatas(this.filterDatas)
        );
        matchedNodes.map(function(data) {
          graph.highlightSelected(data, "filtered");
        });
        // graph.hoverStatusOnNodeIds(matchedNodes.map((x) => x.reactId), "filtered");
      }
    } else {
      // if any filtering...
      if (hasLength(this.filterDatas)) {
        graph.filterGraphOnNodeIds(
          // graph.familyTreeNodeIdsForDatas(this.filterDatas)
          this.finalGraph.familyTreeNodeIdsForDatas(this.filterDatas)
        );
        // graph.hoverStatusOnNodeIds(this.filterDatas.map((x) => x.reactId), "filtered");
        this.filterDatas.map(function(data) {
          graph.highlightSelected(data, "filtered");
        });
      }
    }

    return graph;
  }

  // if some sticky items, set those to focused and everything else to not focused
  // else set all to focused
  resetHoverData() {
    this.hoverData = null;
    // if (this.stickyData) {
    //   // some sticky values... bring them to focus
    //   _mapValues(this.hoverInfo, function(hoverStatus, key){
    //     if (hoverStatus.isSticky) {
    //       hoverStatus.toFocused();
    //     } else {
    //       hoverStatus.toNotFocused();
    //     }
    //   })
    //   this.hoverDefault = HoverStatus.notFocused;
    // } else {
    //   // no sticky values, bring everything to normal
    //   _mapValues(this.hoverInfo, function(hoverStatus, key){
    //     hoverStatus.toFocused();
    //   })
    //   this.hoverDefault = "focused";
    // }
    return true;
  }

  updateHoverData(data: SomeGraphData) {
    this.hoverData = data;
  }
  updateHoverDataReset() {
    this.hoverData = null;
  }
  updateStickyDatas(dataArr: Array<SomeGraphData>) {
    this.stickyDatas = dataArr;
  }
  updateStickyDatasReset() {
    this.stickyDatas = [];
  }
  updateFilterDatas(
    dataArr: Array<SomeGraphData>,
    callUpdateFinal?: boolean = true
  ) {
    this.filterDatas = dataArr;
    if (callUpdateFinal) this.updateFinalGraph();
    this.updateFilteredStepsVisible();
  }
  updateFilterDatasReset(callUpdateFinal?: boolean = true) {
    this.updateFilterDatas([], callUpdateFinal);
  }
  updateSearchRegex(regex: ?RegExp, callUpdateFinal?: boolean = true) {
    this.searchRegex = regex;
    if (callUpdateFinal) this.updateFinalGraph();
  }
  updateSearchRegexReset(callUpdateFinal?: boolean = true) {
    this.updateFilterDatasReset(false);
    this.updateSearchRegex(null, callUpdateFinal);
  }

  // computes a graph containing all points and edges possible,
  //   extending the original graph at step k
  completeGraphAtStep(k: number) {
    let graph = this.atStep(k, false);
    let finalGraph = this.finalGraph;

    mapValues(finalGraph.nodes).map(function(finalNode) {
      if (!graph.nodes.has(finalNode.key)) {
        // stomps finalGraph node value, but currently not a consequence to worry about
        finalNode.isDisplayed = false;
        graph.nodes.set(finalNode.key, finalNode);
      }
    });
    mapValues(finalGraph.edgesUnique).map(function(finalEdge) {
      if (!graph.edgesUnique.has(finalEdge.key)) {
        // stomps finalGraph edge value, but currently not a consequence to worry about
        finalEdge.isDisplayed = false;
        graph.edgesUnique.set(finalEdge.key, finalEdge);
      }
    });

    return graph;
  }

  displayAtStep(
    k: number,
    cy: CytoscapeType,
    cytoOptions?: CytoscapeOptions = {}
  ) {
    let graph = this.completeGraphAtStep(k);

    cy.startBatch();

    // let cytoDur = 0;
    let cyNodes = cy.nodes();
    let graphCyto = graph.cytoGraph;
    let graphNodes = graphCyto.nodes();
    let nodesLRB = cyNodes.diff(graphNodes);
    // .removeStyle()

    let onLayoutReady = [];
    let someNodeHasNewLabel = false;

    // enter visible nodes
    nodesLRB.right.map(function(graphNode: CytoscapeNode) {
      let graphNodeData = (graphNode.data(): Node);
      cy.add(graphNode)
        .classes(graphNodeData.cytoClasses)
        .style(graphNodeData.cytoStyle);
      // .animate({
      //   // style: ,
      //   duration: cytoDur
      // });
    });
    // update visible nodes
    nodesLRB.both.map(function(cytoNode: CytoscapeNode) {
      let cyNode = (cy.$id(cytoNode.id()): CytoscapeNode);

      let graphNode = (graphNodes.$id(cytoNode.id()): CytoscapeNode);
      let graphNodeData = (graphNode.data(): Node);
      let graphClasses = graphNodeData.cytoClasses;

      switch (cyNode.data("type")) {
        case "observer":
        case "observable":
          break;
        default:
          if (cyNode.data("value") !== graphNodeData.value) {
            someNodeHasNewLabel = true;
          }
          break;
      }

      cyNode
        // update to latest data
        .data(graphNodeData)
        // prolly due to how accessor methods are done, this data value must be placed manually
        .data("value", graphNodeData.value)
        .classes(graphClasses)
        .removeStyle()
        .style(graphNodeData.cytoStyle);
      // .animate({
      //   // style: graphNodeData.cytoStyle,
      //   duration: cytoDur
      // });

      // pulse value change
      if (graphNodeData.valueChangedStatus.isActiveAtStep(k)) {
        onLayoutReady.push(function() {
          cyNode.flashClass("nodeStartBig", 125);
        });
      }
      // pulse value enter or invalidate change
      if (
        graphNodeData.invalidateStatus.isActiveAtStep(k) ||
        graphNodeData.enterStatus.isActiveAtStep(k)
      ) {
        onLayoutReady.push(function() {
          switch (graphNodeData.type) {
            case "observable":
              cyNode.flashClass("nodeMiddleBig", 125);
              break;
            case "observer":
              cyNode.flashClass("nodeEndBig", 125);
              break;
          }
        });
      }
    });
    // exit visible nodes
    nodesLRB.left.map(function(cytoNode) {
      cy.remove(cytoNode);
      // .animate({duration: cytoDur});
    });

    let cyEdges = cy.edges();
    let graphEdges = graphCyto.edges();
    let edgesLRB = cyEdges.diff(graphEdges);
    // enter visible edges
    edgesLRB.right.map(function(graphEdge: CytoscapeEdge) {
      let graphEdgeData = (graphEdge.data(): Edge);
      cy.add(graphEdge)
        .classes(graphEdgeData.cytoClasses)
        .removeStyle()
        .style(graphEdgeData.cytoStyle);
      // .animate({
      //   style: graphEdgeData.cytoStyle,
      //   duration: cytoDur
      // });
    });
    // update visible edges
    edgesLRB.both.map(function(cytoEdge) {
      let graphEdgeData = graphEdges.$id(cytoEdge.id()).data();
      cy.$id(cytoEdge.id())
        // .classes()
        .classes(graphEdgeData.cytoClasses)
        .data(graphEdgeData)
        .removeStyle()
        .style(graphEdgeData.cytoStyle);
      // .animate({
      //   style: graphEdgeData.cytoStyle,
      //   duration: cytoDur
      // });
    });
    // exit visible edges
    edgesLRB.left.map(function(cytoEdge) {
      // var graphEdge = cytoEdge.data();
      // remove the original edge
      cy.remove(cytoEdge);
      //  .animate({ duration: cytoDur });
    });

    cy.endBatch();

    // send in sorted elements according to the key.
    // If provided in a consistent order, layouts are consistent.
    // `eles` default to `options.eles != null ? options.eles : cy.$();`
    let sortedElements = cy.$().sort(function(a, b) {
      return a.data().key > b.data().key ? 1 : -1;
    });

    // if no new edges appeared or disappeared
    // or no nodes entered or exited
    if (
      edgesLRB.right.length === edgesLRB.left.length &&
      nodesLRB.right.length === 0 &&
      nodesLRB.left.length === 0 &&
      !someNodeHasNewLabel &&
      cytoOptions.forceRedraw !== true
    ) {
      // do not re-render layout... just call onLayoutReady
      onLayoutReady.map(function(fn) {
        fn();
      });
    } else {
      // calculate a new layout
      // time expensive!!!

      // stop previous layout
      if (this.cytoLayout) {
        this.cytoLayout.stop();
        this.cytoLayout = null;
      }

      this.cytoLayout = cy.layout(
        _assign(
          {},
          layoutOptions,
          cytoOptions,
          {
            // provide elements in sorted order to make determanistic layouts
            eles: sortedElements,
            // run on layout ready
            ready: function() {
              onLayoutReady.map(function(fn) {
                fn();
              });
            },
          }
          // ,
          // TODO-barret Make animation a setting... it's expensive!
          // {animate: true}
        )
      );
      // remove the layout once it's finished
      this.cytoLayout.one("layoutstop", function(evt: any) {
        if (this.cytoLayout) {
          this.cytoLayout = null;
        }
      });
      this.cytoLayout.run();
    }
  }
}

function hasLength(x: Array<any>): boolean %checks {
  return x && x.length > 0;
}

export { GraphAtStep, hasLength };
