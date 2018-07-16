// @flow

import _has from "lodash/has";
import $ from "jquery/dist/jquery.slim";

import { rlog } from "../rlog";
import { updateGraph } from "../updateGraph";
import { colors } from "../style/colors";

let fillContainer: JQuery;
let updateProgressBar = function(): void {
  fillContainer.width((rlog.curTick / rlog.log.length) * 100 + "%");
};

let setContainers = function(
  fullContainerVal: JQuery,
  fillContainerVal: JQuery
): void {
  fillContainerVal.css("background-color", colors.progressBar.progress);
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
  let targetStep = Math.max(Math.round((pos / width) * rlog.log.length), 1);
  if (targetStep !== rlog.curTick) {
    updateGraph(targetStep);
  }
  return;
};

let addTimelineTicks = function(
  jqueryContainer: JQuery,
  backgroundColor: string,
  enterExits: Array<number>,
  logLength: number,
  top: number = 0
): void {
  let topValue =
    top === 0
      ? `top: 0; height: ${timelineHeight}px;`
      : `top: ${top}px; height: ${timelineHeight - 2 * top}px`;
  enterExits.map(function(i) {
    // add an extra step to show that it is completed
    // i = i + 1;
    let left = (100 * i) / logLength;
    let width = ((100 * 1) / logLength) * 0.75;
    jqueryContainer.append(
      `<div class="timeline-tick" style="background-color: ${backgroundColor}; left: ${left}%; width: ${width}%; margin-left: -${width}%; ${topValue}"></div>`
    );
  });
};

let timelineHeight = 16;

export { updateProgressBar as update, addTimelineTicks, setContainers };
