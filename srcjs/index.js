// @flow

import "@babel/polyfill";

import $ from "jquery";
import _debounce from "lodash/debounce";

import { rlog } from "./rlog";

import { LogStates } from "./log/logStates";

import { GraphAtStep } from "./graph/GraphAtStep";

import colors from "./style/colors";

import * as cytoscapeInit from "./cyto/cytoscapeInit";

import * as layoutKeydown from "./layout/keydown";

import * as updateGraph from "./updateGraph";

import * as logEntry from "./layout/logEntry";
import * as progressBar from "./layout/progressBar";

import type { LogType } from "./log/logStates";

import "./log/initStep";

// https://ponyfoo.com/articles/es6-modules-in-depth
// https://github.com/DrkSephy/es6-cheatsheet

// TODO-barret
// √ add buttons for moving around
// √ clean up how active states are done
// √ pulse on active enter change
// √ pulse on valueChange
// √ highlight tree on hover
// √ keep highlight sticky on click
// X add edge styles
// X  distinguish active vs running edges
// X set up cloning of graph after every 250 steps
// √ filtering
// X update legend
// - Re do how subsetting is done by "selecting" and item and always be interested in that item
// enter/exit status and invalidateStart/End need to be controled by a single array status

// // Questions
// should layout be done with full graph and only "turn on" / "turn off" the nodes/edges?
// should filtering be done with the full layout?
//

// class Reactlog {
//   // rlog: rlog;
//
//   constructor(log, time = true) {

let make_reactlog = function(el: JQuery, log, time, id) {

  window.barret = rlog;

  rlog = new RLog();

  rlog.log = (window.log: LogType);
  rlog.cyto = cytoscapeInit.withContainer($("#cyto"));

  rlog.getGraph = new GraphAtStep(rlog.log);
  rlog.graph = rlog.getGraph.finalCompleteGraph;

  $(el).find(".prevUserMarkButton").click(updateGraph.buttonPrevMark);
  $("#nextUserMarkButton").click(updateGraph.buttonNextMark);
  $("#prevOutputCalcButton").click(updateGraph.buttonPrevOutputCalc);
  $("#nextOutputCalcButton").click(updateGraph.buttonNextOutputCalc);
  $("#prevIdleButton").click(updateGraph.buttonPrevIdle);
  $("#nextIdleButton").click(updateGraph.buttonNextIdle);
  $("#prevStepButton").click(updateGraph.buttonPrevStep);
  $("#nextStepButton").click(updateGraph.buttonNextStep);

  $("#legendInvalidating").css("background-color", colors.nodes.invalidating);
  $("#legendInvalidated").css("background-color", colors.nodes.invalidated);
  $("#legendCalculating").css("background-color", colors.nodes.calculating);
  $("#legendReady").css("background-color", colors.nodes.ready);
  {
    // display the frozen legend item only if a frozen state exists
    let entry;
    for (let i = 0; i < rlog.log.length; i++) {
      entry = rlog.log[i];
      if (entry.action === LogStates.freeze) {
        $("#legendRowInvalidated").addClass("legendRowTopMiddle"); // add spacing around legend row
        $("#legendFrozen").css("background-color", colors.frozen.default);
        $("#legendRowFrozen").css("display", ""); // remove display none form css
        break;
      }
    }
  }

  progressBar.setContainers($("#timeline"), $("#timeline-fill"));
  let timelineBackground = $("#timeline-bg");
  progressBar.addTimelineTicks(
    timelineBackground,
    colors.nodes.ready,
    rlog.getGraph.stepsOutputCalc,
    progressBar.timelinePadding * 2
  );
  progressBar.addTimelineTicks(
    timelineBackground,
    colors.progressBar.idle,
    rlog.getGraph.stepsIdle,
    0
  );
  if (rlog.getGraph.stepsUserMark.length > 0) {
    progressBar.addTimelineTicks(
      timelineBackground,
      colors.progressBar.userMark,
      rlog.getGraph.stepsUserMark,
      0
    );
  }
  logEntry.setContainers(
    $("#eventTimeNum"),
    $("#eventSessionNum"),
    $("#eventStepNum"),
    $("#eventStatus"),
    $("#logEntry"),
    rlog.log,
    rlog.getGraph.stepsVisible.length
  );

  window.addEventListener(
    "resize",
    _debounce(
      function(e) {
        updateGraph.resize();
      },
      250,
      { maxWait: 1000 }
    )
  );

  updateGraph.searchStringContainer($("#search"));

  {
    let docBody = document.body;
    if (docBody) {
      layoutKeydown.addKeydown($(docBody));
    }
  }

  {
    let cytoOpts = {
      fit: true,
      stop: function(evt) {
        let zoomLevel = rlog.cyto.zoom();
        let logZoomLevel = Math.log2(zoomLevel);

        // zoom out twice as far
        rlog.cyto.minZoom(Math.pow(2, logZoomLevel - 1));

        // // zoom in to double the size
        // rlog.cyto.maxZoom(Math.pow(2, logZoomLevel + 3)); // zoom in
      },
    };
    // start at last user mark or first idle location
    updateGraph.lastUserMark(cytoOpts) || updateGraph.nextIdle(cytoOpts);
  }
};
