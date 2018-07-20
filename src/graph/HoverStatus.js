// @flow

import type { Node } from "./Node";
import type { Edge } from "./Edge";
import type { GhostEdge } from "./GhostEdge";

class HoverStatus {
  static valFocused = "focused";
  static valNotFocused = "notFocused";

  static valSticky = true;
  static valNotSticky = false;

  static valSelected = true;
  static valNotSelected = false;

  static valFiltered = true;
  static valNotFiltered = false;

  static onFn = function(
    hoverKey: "state" | "sticky" | "selected" | "filtered"
  ) {
    switch (hoverKey) {
      case "state":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toFocused();
        };
      case "sticky":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toSticky();
        };
      case "selected":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toFiltered();
        };
      case "filtered":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toFiltered();
        };
      default:
        throw `hoverKey: ${hoverKey} provided is not found`;
    }
  };
  static offFn = function(
    hoverKey: "state" | "sticky" | "selected" | "filtered"
  ) {
    switch (hoverKey) {
      case "state":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toNotFocused();
        };
      case "sticky":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toNotSticky();
        };
      case "selected":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toNotSelected();
        };
      case "filtered":
        return function(x: Node | Edge | GhostEdge) {
          x.hoverStatus.toNotFiltered();
        };
      default:
        throw `hoverKey: ${hoverKey} provided is not found`;
    }
  };

  sticky: boolean;
  state: "focused" | "notFocused";
  selected: boolean;
  filtered: boolean;

  constructor(state: "focused" | "notFocused" = HoverStatus.valFocused) {
    this.sticky = HoverStatus.valNotSticky; // true / false
    this.state = state; // "focused", "notFocused"
    this.selected = false;
    this.filtered = false;
  }
  isSticky() {
    return this.sticky === HoverStatus.valSticky;
  }
  toNotSticky() {
    this.sticky = HoverStatus.valNotSticky;
  }
  toSticky() {
    this.sticky = HoverStatus.valSticky;
  }

  isFocused() {
    return this.state === HoverStatus.valFocused;
  }
  toFocused() {
    this.state = HoverStatus.valFocused;
  }
  toNotFocused() {
    this.state = HoverStatus.valNotFocused;
  }

  isSelected() {
    return this.selected === HoverStatus.valSelected;
  }
  toSelected() {
    this.selected = HoverStatus.valSelected;
  }
  toNotSelected() {
    this.selected = HoverStatus.valNotSelected;
  }

  isFiltered() {
    return this.filtered === HoverStatus.valFiltered;
  }
  toFiltered() {
    this.filtered = HoverStatus.valFiltered;
  }
  toNotFiltered() {
    this.filtered = HoverStatus.valNotFiltered;
  }
}

export { HoverStatus };
