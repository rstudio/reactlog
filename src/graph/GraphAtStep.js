// @flow

import _sortedIndex from "lodash/sortedIndex";
import _sortedIndexOf from "lodash/sortedIndexOf";
import _isNil from "lodash/isNil";
import _union from "lodash/union";
import _indexOf from "lodash/indexOf";
import _some from "lodash/some";
import _filter from "lodash/filter";
import _assign from "lodash/assign";

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
  LogEntryDefineType,
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

  finalGraph: any;
  finalCyto: any;

  cytoLayout: any;

  steps: Array<number>;
  stepsVisible: Array<number>;
  asyncStarts: Array<number>;
  asyncStops: Array<number>;
  queueEmpties: Array<number>;
  enterExitEmpties: Array<number>;
  marks: Array<number>;
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

  updateFinalGraph() {
    this.finalGraph = this.atStep(this.log.length, false);
    // this.finalCyto = this.finalGraph.cytoGraph;
  }

  updateSteps(log: LogType) {
    this.steps = [];
    this.asyncStarts = [];
    this.asyncStops = [];
    this.queueEmpties = [];
    this.enterExitEmpties = [];
    this.marks = [];
    this.minStep = log.length > 0 ? log[0].step : -1;
    this.maxStep = log.length > 0 ? log[log.length - 1].step : -1;

    let logItem, i;
    let enterExitQueue = [];
    let startI = 0;
    while (
      log.length > startI + 2 &&
      log[startI].action === LogStates.asyncStart &&
      log[startI].session === null &&
      log[startI + 1].action === LogStates.asyncStop &&
      log[startI + 1].session === null &&
      log[startI + 2].action === LogStates.queueEmpty &&
      log[startI + 2].session === null
    ) {
      startI = startI + 3;
    }
    for (i = startI; i < log.length; i++) {
      logItem = log[i];
      switch (logItem.action) {
        case LogStates.enter:
          enterExitQueue.push(i);
          break;
        case LogStates.exit:
          enterExitQueue.pop();
          if (enterExitQueue.length === 0) {
            this.enterExitEmpties.push(logItem.step);
          }
          break;
        case LogStates.asyncStart:
          this.asyncStarts.push(logItem.step);
          break;
        case LogStates.asyncStop:
          this.asyncStops.push(logItem.step);
          break;
        case LogStates.queueEmpty:
          this.queueEmpties.push(logItem.step);
          break;
        case LogStates.mark:
          this.marks.push(logItem.step);
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
        case LogStates.queueEmpty:
        case LogStates.mark:
          break;
        default:
          this.steps.push(logItem.step);
          break;
      }
    }

    this.stepsVisible = []
      .concat(this.steps)
      .concat(this.marks)
      .concat(this.queueEmpties)
      .sort((a, b) => a - b);

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

  nextStep(k: number): number {
    // if no filtering... get next step from step array
    if (!hasLength(this.filterDatas)) {
      let nextStepPos = _sortedIndex(this.stepsVisible, k);
      if (_sortedIndexOf(this.stepsVisible, k) >= 0) {
        // go to the next step location
        nextStepPos += 1;
      }
      // else, does not exist, so it is directly there
      nextStepPos = Math.min(this.stepsVisible.length - 1, nextStepPos);
      return this.stepsVisible[nextStepPos];
    }

    let graph = this.atStep(k);
    let decendents = undefined,
      ancestors = undefined;

    let logEntry, i, ret;

    for (i = k + 1; i < this.log.length - 1; i++) {
      logEntry = this.log[i];

      // skip if if it's not a valid step anyways...
      if (_sortedIndexOf(this.stepsVisible, logEntry.step) === -1) {
        continue;
      }
      // console.log(logEntry);
      ret = logEntry.step;
      switch (logEntry.action) {
        case LogStates.dependsOn:
          // lazy eval decendents and ancestors
          if (_isNil(decendents) || _isNil(ancestors)) {
            if (hasLength(this.filterDatas)) {
              // if (this.filterDatas && this.filterDatas.length > 0) {
              let filterReactIds = this.filterDatas.map(function(node) {
                return node.reactId;
              });
              decendents = _union(
                filterReactIds,
                graph.decendentNodeIdsForDatas(this.filterDatas)
              );
              ancestors = _union(
                filterReactIds,
                graph.ancestorNodeIdsForDatas(this.filterDatas)
              );
            }
          }
          // reactId is target (ends at ancestors)
          if (_indexOf(ancestors, logEntry.reactId) !== -1) {
            return ret;
          }
          // depOnReactId is source (starts from children)
          if (_indexOf(decendents, logEntry.depOnReactId) !== -1) {
            return ret;
          }
          break;
        case LogStates.dependsOnRemove:
          // check for both to and from (since it must exist beforehand)
          if (
            graph.nodes.has(logEntry.reactId) &&
            graph.nodes.has(logEntry.depOnReactId)
          ) {
            return ret;
          }
          break;

        case LogStates.define:
        case LogStates.updateNodeLabel:
          if (this.searchRegex) {
            if (this.searchRegex.test(logEntry.label)) {
              // if there is a search regex and the value is defined
              return ret;
            }
          }
          break;
        case LogStates.freeze:
        case LogStates.thaw:
        case LogStates.valueChange:
        case LogStates.enter:
        case LogStates.exit:
        case LogStates.invalidateStart:
        case LogStates.invalidateEnd:
        case LogStates.isolateEnter:
        case LogStates.isolateExit:
        case LogStates.isolateInvalidateStart:
        case LogStates.isolateInvalidateEnd:
          if (graph.nodes.has(logEntry.reactId)) {
            return ret;
          }
          break;

        case LogStates.queueEmpty:
        case LogStates.mark:
          return ret;

        case LogStates.createContext:
        case LogStates.asyncStart:
        case LogStates.asyncStop:
          break;

        default:
          console.error(logEntry);
          throw "unknown logEntry action in 'next'";
      }
    }

    // return the max step possible
    return -1;
  }
  prevStep(k: number): number {
    // if no filtering... get next step from step array
    if (!hasLength(this.filterDatas)) {
      let prevStepPos = Math.max(_sortedIndex(this.stepsVisible, k) - 1, 0);
      return this.stepsVisible[prevStepPos];
    }

    let graph = this.atStep(k);
    let logEntry, logItem, i, ret;

    for (i = k - 1; i >= 0; i--) {
      logItem = this.log[i];

      // skip if if it's not a valid step anyways...
      if (_sortedIndexOf(this.stepsVisible, logItem.step) === -1) {
        continue;
      }
      ret = logItem.step;
      switch (logItem.action) {
        case LogStates.dependsOn:
        case LogStates.dependsOnRemove:
          // check for both to and from (since it must exist beforehand)
          if (
            graph.nodes.has(logItem.reactId) &&
            graph.nodes.has(logItem.depOnReactId)
          ) {
            // TODO-barret with filtered data, the depOnReactId could be the bridge between existing graph and new subgraph.  This edge should not be included
            return ret;
          }
          break;

        case LogStates.freeze:
        case LogStates.thaw:
        case LogStates.updateNodeLabel:
        case LogStates.valueChange:
        case LogStates.enter:
        case LogStates.exit:
        case LogStates.invalidateStart:
        case LogStates.invalidateEnd:
        case LogStates.isolateEnter:
        case LogStates.isolateExit:
        case LogStates.isolateInvalidateStart:
        case LogStates.isolateInvalidateEnd:
          if (graph.nodes.has(logItem.reactId)) {
            return ret;
          }
          break;

        case LogStates.define:
          logEntry = (logItem: LogEntryDefineType);
          if (
            _some(this.filterDatas, function(filterData) {
              return filterData.reactId === logEntry.reactId;
            })
          ) {
            // some filterdata is defined... so it must be a next step
            return ret;
          }
          break;

        case LogStates.queueEmpty:
        case LogStates.mark:
          return ret;

        case LogStates.createContext:
        case LogStates.asyncStart:
        case LogStates.asyncStop:
          break;

        default:
          console.error(logItem);
          throw "unknown logItem action in 'prev'";
      }
    }

    return -1;
  }

  atStep(k: number, updateFinal?: boolean = true): Graph {
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
        this.updateFilterDatasReset(updateFinal);
      } else {
        // for some reason, an array of node does not work with an array of (node, edge, or ghostedge)
        this.updateFilterDatas(
          ((matchedNodes: Array<Object>): Array<SomeGraphData>),
          updateFinal
        );
        // filter on regex
        graph.filterGraphOnNodeIds(
          graph.familyTreeNodeIdsForDatas(this.filterDatas)
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
          graph.familyTreeNodeIdsForDatas(this.filterDatas)
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
    updateFinal?: boolean = true
  ) {
    this.filterDatas = dataArr;
    if (updateFinal) this.updateFinalGraph();
  }
  updateFilterDatasReset(updateFinal?: boolean = true) {
    this.filterDatas = [];
    if (updateFinal) this.updateFinalGraph();
  }
  updateSearchRegex(regex: ?RegExp, updateFinal?: boolean = true) {
    this.searchRegex = regex;
    if (updateFinal) this.updateFinalGraph();
  }
  updateSearchRegexReset(updateFinal?: boolean = true) {
    this.updateFilterDatasReset(false);
    this.searchRegex = null;
    if (updateFinal) this.updateFinalGraph();
  }
  // // set the value outright
  // updateHoverData(hoverData) {
  //   this.hoverData = hoverData;
  //   // var hoverInfo = this.hoverInfo;
  //   // focusedDatas.map(function(data) {
  //   //   hoverInfo[data.hoverKey].toFocused()
  //   // })
  //   // notFocusedDatas.map(function(data) {
  //   //   hoverInfo[data.hoverKey].toNotFocused()
  //   // })
  // }
  //
  // resetStickyInfo() {
  //   this.stickyData = null;
  //   // var anySticky = _some(this.hoverInfo, ["sticky", true])
  //   // if (anySticky) {
  //   //   _mapValues(this.hoverInfo, function(hoverStatus, key) {
  //   //     hoverStatus.toNotSticky()
  //   //     hoverStatus.toFocused()
  //   //   })
  //   // }
  //   // this.hoverDefault = "focused";
  //   return true;
  // }
  // updateStickyInfo(stickyData) {
  //   this.stickyData = stickyData;
  //   // var hoverInfo = this.hoverInfo;
  //   // stickyDatas.map(function(data) {
  //   //   hoverInfo[data.hoverKey].toSticky()
  //   // })
  //   // notStickyDatas.map(function(data) {
  //   //   hoverInfo[data.hoverKey].toNotSticky()
  //   // })
  // }

  // filterLogOnDatas(datas: Array<SomeGraphData>) {
  //   let nodeMap: Map<ReactIdType, Node> = new Map();
  //   datas.map(function(data) {
  //     if (data instanceof Node) {
  //       nodeMap.set(data.reactId, data);
  //     }
  //   });
  //   let newLog = _filter(this.originalLog, function(logItem) {
  //     switch (logItem.action) {
  //       case LogStates.dependsOn:
  //       case LogStates.dependsOnRemove:
  //         // check for both to and from
  //         return (
  //           nodeMap.has(logItem.reactId) && nodeMap.has(logItem.depOnReactId)
  //         );
  //       case LogStates.freeze:
  //       case LogStates.thaw:
  //       case LogStates.define:
  //       case LogStates.updateNodeLabel:
  //       case LogStates.valueChange:
  //       case LogStates.invalidateStart:
  //       case LogStates.enter:
  //       case LogStates.isolateInvalidateStart:
  //       case LogStates.isolateEnter:
  //       case LogStates.invalidateEnd:
  //       case LogStates.exit:
  //       case LogStates.isolateExit:
  //       case LogStates.isolateInvalidateEnd:
  //         // check for reactId
  //         return nodeMap.has(logItem.reactId);
  //       case LogStates.queueEmpty:
  //       case LogStates.asyncStart:
  //       case LogStates.asyncStop:
  //       case LogStates.mark:
  //         // always add
  //         return true;
  //       default:
  //         console.error("logItem.action: ", logItem.action, logItem);
  //         throw logItem;
  //     }
  //   });
  //   console.log("new Log: ", newLog);
  //   return newLog;
  // }

  // filterDatasLog() {
  //   var nodeMap = {};
  //   datas.map(function(data) {
  //     if (data instanceof Node) {
  //       nodeMap[data.reactId] = data;
  //     }
  //   });
  //   var newLog = _filter(this.originalLog, function(logEntry) {
  //     switch (logEntry.action) {
  //       case "dependsOn":
  //       case "dependsOnRemove":
  //         // check for both to and from
  //         return (
  //           _has(nodeMap, logEntry.reactId) &&
  //           _has(nodeMap, logEntry.depOnReactId)
  //         );
  //         break;
  //       case "define":
  //       case "updateNodeLabel":
  //       case "valueChange":
  //       case "invalidateStart":
  //       case "enter":
  //       case "isolateInvalidateStart":
  //       case "isolateEnter":
  //       case "invalidateEnd":
  //       case "exit":
  //       case "isolateExit":
  //       case "isolateInvalidateEnd":
  //         // check for reactId
  //         return _has(nodeMap, logEntry.reactId);
  //         break;
  //       case "queueEmpty":
  //       case "asyncStart":
  //       case "asyncStop":
  //         // always add
  //         return _has(nodeMap, logEntry.reactId);
  //       default:
  //         console.error("logEntry.action: ", logEntry.action, data);
  //         throw data;
  //     }
  //   });
  //   console.log("new Log: ", newLog);
  //   return newLog;
  // }

  // computes a graph containing all points and edges possible,
  //   extending the original graph at step k
  completeGraphAtStep(k: number) {
    let graph = this.atStep(k);
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

      cyNode
        // update to latest data
        .data(graphNodeData)
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
      nodesLRB.left.length === 0
    ) {
      // do not re-render layout... just call onLayoutReady
      onLayoutReady.map(function(fn) {
        fn();
      });
    } else {
      // TODO-barret move this method to layout
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
