// @flow

import _has from "lodash/has";
import $ from "jquery";

import _sortedIndex from "lodash/sortedIndex";
import _sortedIndexOf from "lodash/sortedIndexOf";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
import { colors } from "../style/colors";

let fillContainer: JQuery;
let updateProgressBar = function(): void {
  // fillContainer.width((rlog.curTick / rlog.log.length) * 100 + "%");
  let stepsToPresent = rlog.getGraph.stepsVisible;
  let tickPos = _sortedIndexOf(stepsToPresent, rlog.curTick);
  if (tickPos === -1) {
    tickPos = _sortedIndex(stepsToPresent, rlog.curTick) - 1;
  }
  // console.log("progress bar: ", tickPos, stepsToPresent.length, tickPos / stepsToPresent.length, rlog.curTick, stepsToPresent)
  fillContainer.width(`${(tickPos / (stepsToPresent.length - 1)) * 100}%`);
};

let setContainers = function(
  fullContainerVal: JQuery,
  fillContainerVal: JQuery
): void {
  fillContainerVal.css("background-color", colors.progressBar.progress);
  fillContainerVal.css("top", `${timelinePadding}px`);
  fillContainerVal.css("bottom", `${timelinePadding}px`);
  fillContainer = fillContainerVal;

  fullContainerVal.css("height", `${timelineHeight}px`);
  fullContainerVal.css("background-color", colors.progressBar.background);
  fullContainerVal.on("mousedown mousemove", updateFromProgressBar);
};

let updateFromProgressBar = function(e: BaseJQueryEventObject): void {
  // Make sure left mouse button is down.
  // Firefox is stupid; e.which is always 1 on mousemove events,
  // even when button is not down!! So read e.originalEvent.buttons.
  if (!_has(e.originalEvent, "buttons")) {
    // odd type casting as jquery doesn't believe this exists
    let originalEvent = ((e.originalEvent: Object): MouseEvent);
    if (originalEvent.buttons !== 1) return;
  }
  // return if not left click
  if (e.which !== 1) {
    return;
  }
  let timeline = $(e.currentTarget)[0];
  let pos = e.pageX; // pageX in pixels  // || e.originalEvent.pageX;

  let width = timeline.offsetWidth; // width in pixels

  let stepsToPresent = rlog.getGraph.stepsVisible;
  let targetStepPos = Math.min(
    Math.max(Math.round((pos / width) * stepsToPresent.length), 0),
    stepsToPresent.length - 1
  );
  let targetStep = stepsToPresent[targetStepPos];
  if (targetStep !== rlog.curTick) {
    updateGraph(targetStep);
  }
  return;
};

let addTimelineTicks = function(
  jqueryContainer: JQuery,
  backgroundColor: string,
  stepArr: Array<number>,
  top: number = 0
): void {
  let visibleSteps = rlog.getGraph.stepsVisible;
  let visibleStepLengthMinusOne = visibleSteps.length - 1;
  let topValue =
    top === 0
      ? `top: 0; height: ${timelineHeight}px;`
      : `top: ${top}px; height: ${timelineHeight - 2 * top}px`;
  stepArr.map(function(step) {
    let stepPos = _sortedIndex(visibleSteps, step);
    // add an extra step to show that it is completed
    // i = i + 1;
    let left = (100 * stepPos) / visibleStepLengthMinusOne;
    let width = ((100 * 1) / visibleStepLengthMinusOne) * 0.75;
    jqueryContainer.append(
      `<div class="timeline-tick" style="background-color: ${backgroundColor}; left: ${left}%; width: ${width}%; margin-left: -${width}%; ${topValue}"></div>`
    );
  });
};

let timelineHeight = 20;
let timelinePadding = 3;

export {
  updateProgressBar as update,
  addTimelineTicks,
  setContainers,
  timelinePadding,
};
