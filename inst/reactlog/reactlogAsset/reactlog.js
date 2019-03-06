/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./srcjs/index.js","vendors-main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./srcjs/cyto/cytoClasses.js":
/*!***********************************!*\
  !*** ./srcjs/cyto/cytoClasses.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var classes = {
    node: "node",
    edge: "edge",
    edgeGhost: ".edgeGhost",
    edgeIsolate: ".edgeIsolate",
    nodeStart: ".nodeStart",
    nodeMiddle: ".nodeMiddle",
    nodeEnd: ".nodeEnd",
    nodeStartBig: ".nodeStartBig",
    nodeMiddleBig: ".nodeMiddleBig",
    nodeEndBig: ".nodeEndBig",
    nodeEnter: ".nodeEnter",
    nodeEnterActive: ".nodeEnterActive",
    nodeInvalidate: ".nodeInvalidate",
    nodeInvalidateActive: ".nodeInvalidateActive",
    nodeInvalidateDone: ".nodeInvalidateDone",
    nodeIsolate: ".nodeIsolate",
    nodeIsolateInvalidate: ".nodeIsolateInvalidate",
    nodeFrozen: ".nodeFrozen",
    nodeValueChanged: ".nodeValueChanged",
    hoverNotFocused: ".hoverNotFocused",
    hoverNotFocusedButSticky: ".hoverNotFocusedButSticky",
    edgeGhostHoverNotFocused: ".edgeGhostHoverNotFocused",
    edgeGhostHoverNotFocusedButSticky: ".edgeGhostHoverNotFocusedButSticky",
    stickyNotFocused: ".stickyNotFocused",
    nodeFiltered: ".nodeFiltered",
    nodeFilteredStart: ".nodeFilteredStart",
    nodeFilteredMiddle: ".nodeFilteredMiddle",
    nodeFilteredEnd: ".nodeFilteredEnd",
    nodeSelected: ".nodeSelected",
    edgeSelected: ".edgeSelected",
    edgeGhostSelected: ".edgeGhostSelected",
    nodeHidden: ".nodeHidden",
    edgeHidden: ".edgeHidden"
  };
  var _default = classes;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/cyto/cytoOn.js":
/*!******************************!*\
  !*** ./srcjs/cyto/cytoOn.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _jquery, _debounce2, _rlog, updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.addOnMethods = _exports.onDblClick = _exports.onClick = _exports.onMouseOver = void 0;
  _jquery = _interopRequireDefault(_jquery);
  _debounce2 = _interopRequireDefault(_debounce2);
  updateGraph = _interopRequireWildcard(updateGraph);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // import console from "../utils/console";
  // cytoFamilySuccPred = function(ele, addExtraLayer = true) {
  //   var familyEles = cyto.collection();
  //   if (ele.isEdge()) {
  //     var edge = ele;
  //     if (false) {
  //       // TODO-barret attempt at getting all nodes and edges from final graph
  //       // abandon, as the edge should be stored and constantly retrieved somewhere else
  //       console.log(`#${ele.source().id()} -> #${ele.target().id()}`)
  //       ele = getGraph.finalCyto.$(`#${ele.source().id()} -> #${ele.target().id()}`)
  //     }
  //     familyEles = familyEles
  //       .add(edge)
  //       .add(ele.target())
  //       .add(ele.target().successors())
  //       .add(ele.source())
  //       .add(ele.source().predecessors());
  //   } else {
  //     // is node
  //     var node = ele;
  //     if (false) {
  //       ele = getGraph.finalCyto.$id(ele.id())
  //     }
  //     familyEles = familyEles
  //       .add(node)
  //       .add(ele.successors())
  //       .add(ele.predecessors());
  //   }
  //   if (addExtraLayer) {
  //     var familyNodes = familyEles.nodes();
  //     familyEles = familyEles
  //       .add(familyNodes.incomers())
  //       .add(familyNodes.outgoers());
  //   }
  //   return familyEles;
  // }
  var onMouseOver = function onMouseOver(cyto) {
    return function (evt) {
      var target = evt.target;
      if (target === cyto) return; // highlight all outgoer's outgoers and all incomer's incomers and self

      var hasCalled = false;
      var debounced = (0, _debounce2.default)(function () {
        hasCalled = true;
        updateGraph.hoverData(target.data());
      }, 200);
      debounced(); // if a mouseout occurs before the function is executed, cancel it
      // works as mouseout is always called before mouseover

      target.once("mouseout", function (evtOut) {
        debounced.cancel();

        if (hasCalled) {
          // only remove hover if hover added
          updateGraph.hoverDataReset();
        }
      });
    };
  };

  _exports.onMouseOver = onMouseOver;

  var onClick = function onClick(cyto) {
    var cytoClickedBefore, cytoClickedTimeout;
    return function (evt) {
      // remove focus on search
      (0, _jquery.default)("#search").blur();
      var target = evt.target; // check for double click
      // https://stackoverflow.com/a/44160927

      if (cytoClickedTimeout && cytoClickedBefore) {
        clearTimeout(cytoClickedTimeout);
      }

      if (cytoClickedBefore === target) {
        // is actually a double click... return!
        target.trigger("dblclick", evt);
        cytoClickedBefore = null;
        return;
      } else {
        cytoClickedTimeout = setTimeout(function () {
          cytoClickedBefore = null;
        }, 400);
        cytoClickedBefore = target; // continue like regular click
        // console.log("click!!", evt);
      }

      if (target === _rlog.rlog.cyto) {
        // remove sticky focus class
        updateGraph.stickyDatasReset();
        return;
      }

      updateGraph.stickyDatas([target.data()]);
      return;
    };
  };

  _exports.onClick = onClick;

  var onDblClick = function onDblClick(cyto) {
    return function (evt) {
      //, originalEvt: Event) {
      // console.log("dbl click!!");
      // console.log("dbl click!!", evt, originalEvt);
      var target = evt.target;

      if (target === _rlog.rlog.cyto) {
        // go back to full graph
        updateGraph.resetHoverStickyFilterData();
        return;
      } // var holdingShiftKey = originalEvt.originalEvent.shiftKey;
      // if (holdingShiftKey) {
      //   console.log("extra layers!")
      //   var familyEles = cytoFamilySuccPred(target, true);
      //   var familyDatas = elesData(familyEles)
      //
      //   var directFamilyEles = cytoFamilySuccPred(target, false);
      //   getGraph.updateHoverInfo(
      //     elesData(directFamilyEles),
      //     elesData(cyto.$().not(directFamilyEles))
      //   )
      //
      //   updateGraph.withDatas(familyDatas)
      //
      // } else {
      // var familyEles = cytoFamilySuccPred(target, false);
      // var familyDatas = elesData(familyEles)


      updateGraph.searchRegexReset();
      updateGraph.searchStringWithData(target.data()); // updateGraph.filterDatas([target.data()]);
    };
  };

  _exports.onDblClick = onDblClick;

  var addOnMethods = function addOnMethods(cyto) {
    cyto.on("mouseover", onMouseOver(cyto));
    cyto.on("click", onClick(cyto));
    cyto.on("dblclick", onDblClick(cyto));
  };

  _exports.addOnMethods = addOnMethods;
  var _default = addOnMethods;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/cyto/cytoStyle.js":
/*!*********************************!*\
  !*** ./srcjs/cyto/cytoStyle.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../style/colors */ "./srcjs/style/colors.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _colors) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.labelWidth = _exports.style = _exports.graphStyles = void 0;
  _colors = _interopRequireDefault(_colors);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var styleHelper = function styleHelper(selector, style) {
    return {
      selector: selector,
      style: style
    };
  };

  _exports.style = styleHelper;
  var nodeShapes = {
    start: {
      shape: "-1 1 0.33333333333 1 1 0 0.33333333333 -1 -1 -1",
      width: 50 * 0.75,
      height: 30
    },
    middle: {
      shape: "-1 1 0.5 1 1 0 0.5 -1 -1 -1 -0.5 0",
      width: 50,
      height: 30
    },
    end: {
      shape: "-1 1 1 1 1 -1 -1 -1 -0.33333333333 0",
      width: 50 * 0.75,
      height: 30
    }
  };
  var pulseScale = 1 + 1 / 16;
  var selectedScale = 2;
  var edgePixelWidth = 4;
  var labelWidth = 350;
  _exports.labelWidth = labelWidth;
  var maxTextWidth = "800px";
  var graphStyles = {
    node: {
      default: {
        "z-index": 0,
        label: "data(cytoLabelShort_)",
        color: _colors.default.nodes.label_text_color,
        "text-opacity": _colors.default.nodes.label_text_opacity,
        "text-valign": "bottom",
        // "text-margin-x": "-5",
        // "text-margin-y": "-5",
        "text-halign": "right",
        "border-color": _colors.default.regular.black,
        "border-style": "solid",
        "border-width": 1,
        "background-color": _colors.default.nodes.ready,
        "text-wrap": "ellipsis",
        "text-max-width": "".concat(labelWidth, "px"),
        "text-background-color": _colors.default.nodes.label_background_color,
        "text-background-opacity": _colors.default.nodes.label_background_opacity,
        "font-family": '"Fira Mono", monospace'
      },
      start: {
        shape: "polygon",
        "shape-polygon-points": nodeShapes.start.shape,
        width: nodeShapes.start.width,
        height: nodeShapes.start.height
      },
      startBig: {
        "border-width": 2,
        width: nodeShapes.start.width * pulseScale,
        height: nodeShapes.start.height * pulseScale
      },
      middle: {
        shape: "polygon",
        "shape-polygon-points": nodeShapes.middle.shape,
        width: nodeShapes.middle.width,
        height: nodeShapes.middle.height
      },
      middleBig: {
        "border-width": 2,
        width: nodeShapes.middle.width * pulseScale,
        height: nodeShapes.middle.height * pulseScale
      },
      end: {
        shape: "polygon",
        "shape-polygon-points": nodeShapes.end.shape,
        width: nodeShapes.end.width,
        height: nodeShapes.end.height,
        "text-max-width": "".concat(labelWidth * 1.5, "px")
      },
      endBig: {
        "border-width": 2,
        width: nodeShapes.end.width * pulseScale,
        height: nodeShapes.end.height * pulseScale
      },
      enter: {
        // "border-width": 2,
        "background-color": _colors.default.nodes.calculating
      },
      enterActive: {
        "background-color": _colors.default.nodes.calculating,
        "border-width": 2.5
      },
      invalidate: {
        // "border-width": 2,
        "background-color": _colors.default.nodes.invalidating
      },
      invalidateActive: {
        "background-color": _colors.default.nodes.invalidating,
        "border-width": 2.5
      },
      invalidateDone: {
        "background-color": _colors.default.nodes.invalidated
      },
      isolate: {
        "border-style": "dashed" // "border-width": 3,
        // "border-opacity"

      },
      isolateInvalidate: {
        "border-style": "dashed",
        "border-color": "darkgrey",
        "border-width": 3 // "border-opacity"

      },
      valueChanged: {
        // "background-color": colors.regular.red,
        "background-color": _colors.default.nodes.invalidating // "border-style": "dashed",
        // "border-color": "darkgrey",
        // "border-width": 3,
        // "border-opacity"

      },
      frozen: {
        "background-color": _colors.default.frozen.default
      }
    },
    edge: {
      default: {
        "curve-style": "bezier",
        width: edgePixelWidth,
        "target-arrow-shape": "triangle",
        "mid-target-arrow-shape": "triangle",
        "line-color": _colors.default.edges.running,
        //"#9dbaea",
        "mid-target-arrow-color": _colors.default.edges.running,
        "target-arrow-color": _colors.default.edges.running
      },
      isolate: {
        width: edgePixelWidth,
        "line-color": _colors.default.edges.isolate,
        "mid-target-arrow-color": _colors.default.edges.isolate,
        "target-arrow-color": _colors.default.edges.isolate,
        "line-style": "dashed"
      }
    },
    ghostEdge: {
      default: {
        width: 1,
        "mid-target-arrow-shape": "triangle",
        "mid-target-arrow-color": _colors.default.ghostEdges.default,
        "arrow-scale": 0.25,
        "curve-style": "haystack",
        "line-color": _colors.default.ghostEdges.default,
        "line-style": "dotted"
      },
      hoverNotFocusedButSticky: {
        "line-color": _colors.default.regular.grey2,
        "mid-target-arrow-color": _colors.default.regular.grey2
      },
      hoverNotFocused: {
        "line-color": _colors.default.regular.grey2,
        "mid-target-arrow-color": _colors.default.regular.grey2
      }
    },
    focus: {
      hoverNotFocused: {
        "background-blacken": -0.75,
        "border-color": _colors.default.regular.grey2,
        "line-color": _colors.default.regular.grey2,
        "mid-target-arrow-color": _colors.default.regular.grey2,
        "target-arrow-color": _colors.default.regular.grey2
      },
      hoverNotFocusedButSticky: {
        "background-blacken": -0.35,
        "border-color": _colors.default.regular.grey2,
        "line-color": _colors.default.regular.grey2,
        "mid-target-arrow-color": _colors.default.regular.grey2,
        "target-arrow-color": _colors.default.regular.grey2
      },
      stickyNotFocused: {
        "background-blacken": -0.75,
        "border-color": _colors.default.regular.grey2,
        "line-color": _colors.default.regular.grey2,
        "mid-target-arrow-color": _colors.default.regular.grey2,
        "target-arrow-color": _colors.default.regular.grey2
      }
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
        "text-border-color": _colors.default.regular.black,
        "text-background-padding": 8 * 2,
        label: "data(cytoLabel_)",
        "z-index": 1000
      },
      edge: {
        width: edgePixelWidth * 2
      },
      ghostEdge: {
        width: edgePixelWidth * 2,
        "arrow-scale": 2 / 3
      }
    },
    filtered: {
      node: {
        "border-width": 3,
        "font-size": "30"
      },
      start: {
        width: nodeShapes.start.width * selectedScale,
        height: nodeShapes.start.height * selectedScale
      },
      middle: {
        width: nodeShapes.middle.width * selectedScale,
        height: nodeShapes.middle.height * selectedScale
      },
      end: {
        width: nodeShapes.end.width * selectedScale,
        height: nodeShapes.end.height * selectedScale
      }
    },
    hidden: {
      node: {
        // visibility: "hidden",
        "background-color": "white",
        "background-opacity": 1,
        "border-opacity": 0.5,
        "text-opacity": 0.5,
        label: "data(label)" // do not display a value and only the raw label

      },
      edge: {
        // visibility: "hidden",
        opacity: 0.5
      }
    }
  };
  _exports.graphStyles = graphStyles;
  var _default = graphStyles;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/cyto/cytoscapeInit.js":
/*!*************************************!*\
  !*** ./srcjs/cyto/cytoscapeInit.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! cytoscape */ "./node_modules/cytoscape/dist/cytoscape.cjs.js"), __webpack_require__(/*! ./cytoOn */ "./srcjs/cyto/cytoOn.js"), __webpack_require__(/*! ./cytoStyle */ "./srcjs/cyto/cytoStyle.js"), __webpack_require__(/*! ./layoutOptions */ "./srcjs/cyto/layoutOptions.js"), __webpack_require__(/*! ./cytoClasses */ "./srcjs/cyto/cytoClasses.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _cytoscape, cytoOn, _cytoStyle, _layoutOptions, _cytoClasses) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.withContainer = void 0;
  _cytoscape = _interopRequireDefault(_cytoscape);
  cytoOn = _interopRequireWildcard(cytoOn);
  _cytoStyle = _interopRequireWildcard(_cytoStyle);
  _layoutOptions = _interopRequireDefault(_layoutOptions);
  _cytoClasses = _interopRequireDefault(_cytoClasses);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // flowlint-line untyped-import:off
  // // TODO-barret use cytoClasses
  var withContainer = function withContainer(container) {
    var cyto = (0, _cytoscape.default)({
      container: container,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: _layoutOptions.default,
      wheelSensitivity: 0.04,
      // minZoom: 0.5,
      // maxZoom: 1.5,
      style: [// order of the style definitions are how styles are applied
      (0, _cytoStyle.style)(_cytoClasses.default.node, _cytoStyle.default.node.default), (0, _cytoStyle.style)(_cytoClasses.default.edge, _cytoStyle.default.edge.default), (0, _cytoStyle.style)(_cytoClasses.default.edgeGhost, _cytoStyle.default.ghostEdge.default), (0, _cytoStyle.style)(_cytoClasses.default.edgeIsolate, _cytoStyle.default.edge.isolate), (0, _cytoStyle.style)(_cytoClasses.default.nodeStart, _cytoStyle.default.node.start), (0, _cytoStyle.style)(_cytoClasses.default.nodeMiddle, _cytoStyle.default.node.middle), (0, _cytoStyle.style)(_cytoClasses.default.nodeEnd, _cytoStyle.default.node.end), (0, _cytoStyle.style)(_cytoClasses.default.nodeStartBig, _cytoStyle.default.node.startBig), (0, _cytoStyle.style)(_cytoClasses.default.nodeMiddleBig, _cytoStyle.default.node.middleBig), (0, _cytoStyle.style)(_cytoClasses.default.nodeEndBig, _cytoStyle.default.node.endBig), (0, _cytoStyle.style)(_cytoClasses.default.nodeEnter, _cytoStyle.default.node.enter), (0, _cytoStyle.style)(_cytoClasses.default.nodeEnterActive, _cytoStyle.default.node.enterActive), (0, _cytoStyle.style)(_cytoClasses.default.nodeInvalidate, _cytoStyle.default.node.invalidate), (0, _cytoStyle.style)(_cytoClasses.default.nodeInvalidateActive, _cytoStyle.default.node.invalidateActive), (0, _cytoStyle.style)(_cytoClasses.default.nodeInvalidateDone, _cytoStyle.default.node.invalidateDone), (0, _cytoStyle.style)(_cytoClasses.default.nodeIsolate, _cytoStyle.default.node.isolate), (0, _cytoStyle.style)(_cytoClasses.default.nodeIsolateInvalidate, _cytoStyle.default.node.isolateInvalidate), (0, _cytoStyle.style)(_cytoClasses.default.nodeValueChanged, _cytoStyle.default.node.valueChanged), (0, _cytoStyle.style)(_cytoClasses.default.hoverNotFocused, _cytoStyle.default.focus.hoverNotFocused), (0, _cytoStyle.style)(_cytoClasses.default.hoverNotFocusedButSticky, _cytoStyle.default.focus.hoverNotFocusedButSticky), (0, _cytoStyle.style)(_cytoClasses.default.edgeGhostHoverNotFocused, _cytoStyle.default.ghostEdge.hoverNotFocused), (0, _cytoStyle.style)(_cytoClasses.default.edgeGhostHoverNotFocusedButSticky, _cytoStyle.default.ghostEdge.hoverNotFocusedButSticky), (0, _cytoStyle.style)(_cytoClasses.default.stickyNotFocused, _cytoStyle.default.focus.stickyNotFocused), (0, _cytoStyle.style)(_cytoClasses.default.nodeFiltered, _cytoStyle.default.filtered.node), (0, _cytoStyle.style)(_cytoClasses.default.nodeFilteredStart, _cytoStyle.default.filtered.start), (0, _cytoStyle.style)(_cytoClasses.default.nodeFilteredMiddle, _cytoStyle.default.filtered.middle), (0, _cytoStyle.style)(_cytoClasses.default.nodeFilteredEnd, _cytoStyle.default.filtered.end), (0, _cytoStyle.style)(_cytoClasses.default.nodeSelected, _cytoStyle.default.selected.node), (0, _cytoStyle.style)(_cytoClasses.default.edgeSelected, _cytoStyle.default.selected.edge), (0, _cytoStyle.style)(_cytoClasses.default.edgeGhostSelected, _cytoStyle.default.selected.ghostEdge), (0, _cytoStyle.style)(_cytoClasses.default.nodeFrozen, _cytoStyle.default.node.frozen), (0, _cytoStyle.style)(_cytoClasses.default.nodeHidden, _cytoStyle.default.hidden.node), (0, _cytoStyle.style)(_cytoClasses.default.edgeHidden, _cytoStyle.default.hidden.edge)]
    });
    cytoOn.addOnMethods(cyto);
    return cyto;
  };

  _exports.withContainer = withContainer;
  var _default = withContainer;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/cyto/layoutOptions.js":
/*!*************************************!*\
  !*** ./srcjs/cyto/layoutOptions.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! cytoscape */ "./node_modules/cytoscape/dist/cytoscape.cjs.js"), __webpack_require__(/*! cytoscape-dagre */ "./node_modules/cytoscape-dagre/cytoscape-dagre.js"), __webpack_require__(/*! ./cytoStyle */ "./srcjs/cyto/cytoStyle.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _cytoscape, _cytoscapeDagre, _cytoStyle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _cytoscape = _interopRequireDefault(_cytoscape);
  _cytoscapeDagre = _interopRequireDefault(_cytoscapeDagre);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // flowlint-line untyped-import:off
  // flowlint-line untyped-import:off
  _cytoscape.default.use(_cytoscapeDagre.default);

  var layoutOptions = {
    // whether to fit to viewport
    //   do not want to fit to viewport as user may have zoomed/panned
    fit: false,
    name: "dagre",
    rankDir: "LR",
    // 'TB' for top to bottom flow, 'LR' for left to right,
    rankSep: _cytoStyle.labelWidth + 50,
    // the separation between node columns
    nodeSep: 10,
    // vertical separation of nodes
    edgeSep: 50,
    // the separation between adjacent edges in the same rank
    ranker: "longest-path",
    // Type of algorithm to assign a rank to each node in the input graph. Possible values: "network-simplex", "tight-tree" or "longest-path"
    padding: 30,
    // fit padding
    spacingFactor: 1,
    // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: false,
    // whether labels should be included in determining the space used by a node
    animate: true,
    // whether to transition the node positions
    animateFilter: function animateFilter(node, i) {
      return true;
    },
    // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 1000,
    // duration of animation in ms if enabled
    animationEasing: "ease-in-out-quad" // easing of animation if enabled

  };
  var _default = layoutOptions;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/graph/ActiveStateStatus.js":
/*!******************************************!*\
  !*** ./srcjs/graph/ActiveStateStatus.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ActiveStateStatus = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var stateOff = "off";
  var stateOn = "on";
  var stateFinished = "finished";

  // pulse on being active at step k; isAtStep(k)
  // display engaged; isOn
  // display active engaged; isOn and isActive
  // display finished; isFinished
  // display none; isOff
  var ActiveStateStatus =
  /*#__PURE__*/
  function () {
    function ActiveStateStatus() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, ActiveStateStatus);

      _defineProperty(this, "state", void 0);

      _defineProperty(this, "activeStep", void 0);

      if (data instanceof ActiveStateStatus) {
        this.state = data.state;
        this.activeStep = data.activeStep;
      } else {
        this.state = stateOff; // "on", "finished", "off"

        this.activeStep = -1;
      }
    }

    _createClass(ActiveStateStatus, [{
      key: "setState",
      value: function setState(state) {
        this.state = state;
      }
    }, {
      key: "setActiveAtStep",
      value: function setActiveAtStep(step) {
        this.toOn();
        this.activeStep = step;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.toOff();
        this.resetActive();
      }
    }, {
      key: "resetActive",
      value: function resetActive() {
        this.activeStep = -1;
      }
    }, {
      key: "isActiveAtStep",
      value: function isActiveAtStep(k) {
        return this.isActive && this.activeStep === k;
      }
    }, {
      key: "toOn",
      value: function toOn() {
        this.state = stateOn;
      }
    }, {
      key: "toFinished",
      value: function toFinished() {
        this.state = stateFinished;
      }
    }, {
      key: "toOff",
      value: function toOff() {
        this.state = stateOff;
      }
    }, {
      key: "isOn",
      get: function get() {
        return this.state === stateOn;
      }
    }, {
      key: "isOff",
      get: function get() {
        return this.state === stateOff;
      }
    }, {
      key: "isFinished",
      get: function get() {
        return this.state === stateFinished;
      }
    }, {
      key: "isActive",
      get: function get() {
        return this.isOn && this.activeStep > 0;
      }
    }]);

    return ActiveStateStatus;
  }();

  _exports.ActiveStateStatus = ActiveStateStatus;
});

/***/ }),

/***/ "./srcjs/graph/Edge.js":
/*!*****************************!*\
  !*** ./srcjs/graph/Edge.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! ./HoverStatus */ "./srcjs/graph/HoverStatus.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _isNil2, _HoverStatus) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ghostKey = _exports.edgeKey = _exports.Edge = void 0;
  _isNil2 = _interopRequireDefault(_isNil2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var ghostKey = function ghostKey(reactId, depOnReactId) {
    return "".concat(reactId, " depends on ").concat(depOnReactId);
  };

  _exports.ghostKey = ghostKey;

  var edgeKey = function edgeKey(reactId, depOnReactId, ctxId) {
    return "".concat(reactId, " depends on ").concat(depOnReactId, " in ").concat(ctxId);
  };

  _exports.edgeKey = edgeKey;

  var Edge =
  /*#__PURE__*/
  function () {
    function Edge(data) {
      _classCallCheck(this, Edge);

      _defineProperty(this, "reactId", void 0);

      _defineProperty(this, "depOnReactId", void 0);

      _defineProperty(this, "ctxId", void 0);

      _defineProperty(this, "session", void 0);

      _defineProperty(this, "time", void 0);

      _defineProperty(this, "status", void 0);

      _defineProperty(this, "isGhost", void 0);

      _defineProperty(this, "hoverStatus", void 0);

      _defineProperty(this, "isDisplayed", void 0);

      if (typeof data.reactId === "undefined") throw "data.reactId not provided to new Edge()";
      if (typeof data.depOnReactId === "undefined") throw "data.depOnReactId not provided to new Edge()";
      if (typeof data.ctxId === "undefined") throw "data.ctxId not provided to new Edge()";
      if (typeof data.time === "undefined") throw "data.time not provided to new Edge()";
      this.reactId = data.reactId;
      this.depOnReactId = data.depOnReactId;
      this.ctxId = data.ctxId;
      this.session = (0, _isNil2.default)(data.session) ? "Global" : data.session;
      this.time = data.time;
      this.status = (0, _isNil2.default)(data.status) ? "normal" : data.status;
      this.isGhost = (0, _isNil2.default)(data.isGhost) ? false : data.isGhost;
      this.hoverStatus = new _HoverStatus.HoverStatus(data.hoverStatus);
      this.isDisplayed = (0, _isNil2.default)(data.isDisplayed) ? true : data.isDisplayed;
    }

    _createClass(Edge, [{
      key: "id",
      get: function get() {
        return "".concat(this.reactId, "_").concat(this.depOnReactId, "_").concat(this.ctxId).replace(/\$/g, "_");
      }
    }, {
      key: "source",
      get: function get() {
        return this.depOnReactId.replace(/\$/g, "_");
      }
    }, {
      key: "target",
      get: function get() {
        return this.reactId.replace(/\$/g, "_");
      }
    }, {
      key: "key",
      get: function get() {
        return edgeKey(this.reactId, this.depOnReactId, this.ctxId);
      }
    }, {
      key: "ghostKey",
      get: function get() {
        return ghostKey(this.reactId, this.depOnReactId);
      }
    }, {
      key: "hoverKey",
      get: function get() {
        return this.ghostKey;
      }
    }, {
      key: "inIsolate",
      get: function get() {
        return this.status === "isolate";
      }
    }, {
      key: "cytoStyle",
      get: function get() {
        return {};
      }
    }, {
      key: "cytoClasses",
      get: function get() {
        var classes = [];
        if (this.inIsolate) classes.push("edgeIsolate");

        switch (this.hoverStatus.state) {
          case _HoverStatus.HoverStatus.valFocused:
            break;

          case _HoverStatus.HoverStatus.valNotFocused:
            if (this.hoverStatus.sticky) {
              classes.push("hoverNotFocusedButSticky");
            } else {
              classes.push("hoverNotFocused");
            }

            break;
        }

        if (this.hoverStatus.selected) classes.push("edgeSelected");
        if (!this.isDisplayed) classes.push("edgeHidden");
        return classes.join(" ");
      }
    }, {
      key: "cytoData",
      get: function get() {
        var retData = this;
        return {
          group: "edges",
          data: retData
        };
      }
    }]);

    return Edge;
  }();

  _exports.Edge = Edge;
});

/***/ }),

/***/ "./srcjs/graph/GhostEdge.js":
/*!**********************************!*\
  !*** ./srcjs/graph/GhostEdge.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! ./HoverStatus */ "./srcjs/graph/HoverStatus.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _isNil2, _HoverStatus) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GhostEdge = void 0;
  _isNil2 = _interopRequireDefault(_isNil2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var GhostEdge =
  /*#__PURE__*/
  function () {
    function GhostEdge(data) {
      _classCallCheck(this, GhostEdge);

      _defineProperty(this, "reactId", void 0);

      _defineProperty(this, "depOnReactId", void 0);

      _defineProperty(this, "time", void 0);

      _defineProperty(this, "hoverStatus", void 0);

      _defineProperty(this, "isGhost", void 0);

      _defineProperty(this, "session", void 0);

      _defineProperty(this, "isDisplayed", void 0);

      if (typeof data.reactId === "undefined") throw "data.reactId not provided to new GhostEdge()";
      if (typeof data.depOnReactId === "undefined") throw "data.depOnReactId not provided to new GhostEdge()";
      if (typeof data.time === "undefined") throw "data.time not provided to new GhostEdge()";
      this.reactId = data.reactId;
      this.depOnReactId = data.depOnReactId;
      this.session = (0, _isNil2.default)(data.session) ? "Global" : data.session;
      this.time = data.time;
      this.isGhost = (0, _isNil2.default)(data.isGhost) ? true : data.isGhost;
      this.hoverStatus = new _HoverStatus.HoverStatus(data.hoverStatus);
      this.isDisplayed = (0, _isNil2.default)(data.isDisplayed) ? true : data.isDisplayed;
    }

    _createClass(GhostEdge, [{
      key: "id",
      get: function get() {
        return "".concat(this.reactId, "_").concat(this.depOnReactId).replace(/\$/g, "_");
      }
    }, {
      key: "source",
      get: function get() {
        return this.depOnReactId.replace(/\$/g, "_");
      }
    }, {
      key: "target",
      get: function get() {
        return this.reactId.replace(/\$/g, "_");
      }
    }, {
      key: "key",
      get: function get() {
        return "".concat(this.reactId, " depends on ").concat(this.depOnReactId);
      }
    }, {
      key: "hoverKey",
      get: function get() {
        return this.key;
      }
    }, {
      key: "cytoStyle",
      get: function get() {
        return {}; // return graphStyles.ghostEdge.default
      }
    }, {
      key: "cytoClasses",
      get: function get() {
        var classes = ["edgeGhost"];

        switch (this.hoverStatus.state) {
          case _HoverStatus.HoverStatus.valFocused:
            break;

          case _HoverStatus.HoverStatus.valNotFocused:
            if (this.hoverStatus.sticky) {
              classes.push("edgeGhostHoverNotFocusedButSticky");
            } else {
              classes.push("edgeGhostHoverNotFocused");
            }

            break;
        }

        if (this.hoverStatus.selected) classes.push("edgeGhostSelected");
        if (!this.isDisplayed) classes.push("edgeHidden");
        return classes.join(" ");
      }
    }, {
      key: "cytoData",
      get: function get() {
        var retData = this;
        return {
          group: "edges",
          data: retData
        };
      }
    }]);

    return GhostEdge;
  }();

  _exports.GhostEdge = GhostEdge;
});

/***/ }),

/***/ "./srcjs/graph/Graph.js":
/*!******************************!*\
  !*** ./srcjs/graph/Graph.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/clone */ "./node_modules/lodash/clone.js"), __webpack_require__(/*! lodash/some */ "./node_modules/lodash/some.js"), __webpack_require__(/*! lodash/filter */ "./node_modules/lodash/filter.js"), __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! lodash/union */ "./node_modules/lodash/union.js"), __webpack_require__(/*! lodash/last */ "./node_modules/lodash/last.js"), __webpack_require__(/*! cytoscape */ "./node_modules/cytoscape/dist/cytoscape.cjs.js"), __webpack_require__(/*! ../utils/MapHelper */ "./srcjs/utils/MapHelper.js"), __webpack_require__(/*! ../log/logStates */ "./srcjs/log/logStates.js"), __webpack_require__(/*! ./Node */ "./srcjs/graph/Node.js"), __webpack_require__(/*! ./Edge */ "./srcjs/graph/Edge.js"), __webpack_require__(/*! ./GhostEdge */ "./srcjs/graph/GhostEdge.js"), __webpack_require__(/*! ./HoverStatus */ "./srcjs/graph/HoverStatus.js"), __webpack_require__(/*! ./StatusArr */ "./srcjs/graph/StatusArr.js"), __webpack_require__(/*! ../utils/ArrayHelper */ "./srcjs/utils/ArrayHelper.js"), __webpack_require__(/*! ../utils/console */ "./srcjs/utils/console.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _clone2, _some2, _filter2, _isNil2, _union2, _last2, _cytoscape, _MapHelper, _logStates, _Node, _Edge, _GhostEdge, _HoverStatus, _StatusArr, _ArrayHelper, _console) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Graph = void 0;
  _clone2 = _interopRequireDefault(_clone2);
  _some2 = _interopRequireDefault(_some2);
  _filter2 = _interopRequireDefault(_filter2);
  _isNil2 = _interopRequireDefault(_isNil2);
  _union2 = _interopRequireDefault(_union2);
  _last2 = _interopRequireDefault(_last2);
  _cytoscape = _interopRequireDefault(_cytoscape);
  _console = _interopRequireDefault(_console);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Graph =
  /*#__PURE__*/
  function () {
    function Graph(data) {
      var _this = this;

      _classCallCheck(this, Graph);

      _defineProperty(this, "log", void 0);

      _defineProperty(this, "nodes", void 0);

      _defineProperty(this, "edges", void 0);

      _defineProperty(this, "edgesUnique", void 0);

      _defineProperty(this, "activeNodeEnter", void 0);

      _defineProperty(this, "activeInvalidateEnter", void 0);

      this.log = data instanceof Graph ? data.log : data;
      this.nodes = new Map();
      this.edges = new Map();
      this.edgesUnique = new Map();
      this.activeNodeEnter = [];
      this.activeInvalidateEnter = [];

      if (data instanceof Graph) {
        var priorGraph = data;
        priorGraph.nodes.forEach(function (node, key) {
          return _this.nodes.set(key, new _Node.Node(node));
        });
        priorGraph.edges.forEach(function (edge, key) {
          return _this.edges.set(key, new _Edge.Edge(edge));
        });
        priorGraph.edgesUnique.forEach(function (edge, key) {
          return _this.edgesUnique.set(key, new _GhostEdge.GhostEdge(edge));
        });
        this.activeNodeEnter = (0, _clone2.default)(priorGraph.activeNodeEnter);
        this.activeInvalidateEnter = (0, _clone2.default)(priorGraph.activeInvalidateEnter);
      }
    }

    _createClass(Graph, [{
      key: "hasNodeReactId",
      value: function hasNodeReactId(reactId) {
        return this.nodes.has(reactId);
      }
    }, {
      key: "hasSomeData",
      value: function hasSomeData(data) {
        if (data instanceof _Node.Node) {
          return this.nodes.has(data.key);
        } else if (isEdgeLike(data)) {
          if (data instanceof _Edge.Edge) {
            if (this.edgesUnique.has(data.ghostKey)) return true;
          } else {
            if (this.edgesUnique.has(data.key)) return true;
          }

          var reactId = data.reactId;
          var depOnReactId = data.depOnReactId;

          var hasMatchingEdge = function hasMatchingEdge(edges) {
            return (0, _some2.default)(edges, function (edge) {
              if (edge.reactId === reactId && edge.depOnReactId === depOnReactId) {
                return true;
              }

              return false;
            });
          };

          return hasMatchingEdge((0, _MapHelper.mapValues)(this.edges)) || hasMatchingEdge((0, _MapHelper.mapValues)(this.edgesUnique));
        } else {
          _console.default.error(data);

          throw "unsupported data type";
        }
      }
    }, {
      key: "highlightSelected",
      value: function highlightSelected(data, hoverKey) {
        if (!data) return;

        var onFn = _HoverStatus.HoverStatus.onFn(hoverKey);

        if (data instanceof _Node.Node) {
          var node = this.nodes.get(data.key);

          if (typeof node !== "undefined") {
            onFn(node);
            return;
          }
        } else if (isEdgeLike(data)) {
          if (data instanceof _Edge.Edge) {
            var edge = this.edges.get(data.key);

            if (typeof edge !== "undefined") {
              onFn(edge);
              return;
            }
          } // highlight all the edges (and ghost edges) that have the same source and target


          var reactId = data.reactId;
          var depOnReactId = data.depOnReactId;

          var selectMatchingEdges = function selectMatchingEdges(edge) {
            if (edge.reactId === reactId && edge.depOnReactId === depOnReactId) {
              onFn(edge);
            }
          };

          (0, _MapHelper.mapValues)(this.edgesUnique).map(selectMatchingEdges);
          (0, _MapHelper.mapValues)(this.edges).map(selectMatchingEdges);
          return;
        }

        return;
      }
    }, {
      key: "reactIdFromData",
      value: function reactIdFromData(data) {
        var getParentFromEdge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (data === null) {
          throw "Graph.prototype.reactIdFromData(data) must submit non null data";
        }

        if (typeof data === "string") {
          return data;
        } else if (data instanceof _Node.Node) {
          return data.reactId;
        } else if (isEdgeLike(data)) {
          var node = getParentFromEdge ? this.nodes.get(data.depOnReactId) : this.nodes.get(data.reactId);

          if (node) {
            return node.reactId;
          } else {
            return null;
          }
        } else {
          _console.default.error(data);

          throw "unsupported data type. Can only 'reactId's of 'Node's, 'GhostEdge's, or 'Edge's or from a reactId";
        }
      } // return array of node 'reactId's

    }, {
      key: "parentNodeIds",
      value: function parentNodeIds(data) {
        if (data === null) {
          throw "Graph.prototype.parentNodeIds(data) must submit non null data";
        }

        if (isEdgeLike(data)) {
          // return edge source
          return [data.reactId];
        } else {
          var reactId;
          reactId = this.reactIdFromData(data, true);
          if ((0, _isNil2.default)(reactId)) return [];
          return (0, _filter2.default)((0, _MapHelper.mapValues)(this.edgesUnique), function (edge) {
            // if the target is the reactId
            return edge.reactId === reactId;
          }).map(function (edge) {
            // return the source
            return edge.depOnReactId;
          });
        }
      }
    }, {
      key: "childrenNodeIds",
      value: function childrenNodeIds(data) {
        if (data === null) {
          throw "Graph.prototype.childrenNodeIds(data) must submit non null data";
        }

        if (isEdgeLike(data)) {
          // return edge target
          return [data.depOnReactId];
        } else {
          var reactId = this.reactIdFromData(data, false);
          if ((0, _isNil2.default)(reactId)) return [];
          return (0, _filter2.default)((0, _MapHelper.mapValues)(this.edgesUnique), function (edge) {
            // if the source is the reactId
            return edge.depOnReactId === reactId;
          }).map(function (edge) {
            // return the target
            return edge.reactId;
          });
        }
      }
    }, {
      key: "ancestorNodeIds",
      value: function ancestorNodeIds(data) {
        var _this2 = this;

        var reactId = this.reactIdFromData(data, true);

        if ((0, _isNil2.default)(reactId)) {
          return [];
        } else {
          var _ret = function () {
            var originalReactId = reactId;
            var seenMap = new Set();
            var reactIdArr = [reactId];

            while (reactIdArr.length > 0) {
              reactId = reactIdArr.pop();

              if (!seenMap.has(reactId)) {
                _this2.parentNodeIds(reactId).forEach(function (parentReactId) {
                  if (parentReactId) {
                    reactIdArr.push(parentReactId);
                  }
                });

                seenMap.add(reactId);
              }
            }

            seenMap.delete(originalReactId);
            return {
              v: Array.from(seenMap).sort()
            };
          }();

          if (_typeof(_ret) === "object") return _ret.v;
        }
      }
    }, {
      key: "decendentNodeIds",
      value: function decendentNodeIds(data) {
        var reactId = this.reactIdFromData(data, false);
        if ((0, _isNil2.default)(reactId)) return [];
        var originalReactId = reactId;
        var seenMap = new Set();
        var reactIdArr = [reactId];

        while (reactIdArr.length > 0) {
          reactId = reactIdArr.pop();

          if (!seenMap.has(reactId)) {
            reactIdArr = reactIdArr.concat(this.childrenNodeIds(reactId));
            seenMap.add(reactId);
          }
        }

        seenMap.delete(originalReactId);
        return Array.from(seenMap).sort();
      } // all filtering can be done with only node reactIds

    }, {
      key: "familyTreeNodeIds",
      value: function familyTreeNodeIds(data) {
        var ret = [];
        var reactId;

        if (isEdgeLike(data)) {
          reactId = this.reactIdFromData(data, true);
          if (!(0, _isNil2.default)(reactId)) ret.push(reactId);
          reactId = this.reactIdFromData(data, false);
          if (!(0, _isNil2.default)(reactId)) ret.push(reactId);
        } else {
          reactId = this.reactIdFromData(data);
          if (!(0, _isNil2.default)(reactId)) ret.push(reactId);
        }

        return (0, _union2.default)(ret, this.ancestorNodeIds(data), this.decendentNodeIds(data));
      }
    }, {
      key: "familyTreeNodeIdsForDatas",
      value: function familyTreeNodeIdsForDatas(datas) {
        var self = this;
        return (0, _union2.default)((0, _ArrayHelper.flatMap)(datas, function (data) {
          return self.familyTreeNodeIds(data);
        }));
      }
    }, {
      key: "decendentNodeIdsForDatas",
      value: function decendentNodeIdsForDatas(datas) {
        var self = this;
        return (0, _union2.default)((0, _ArrayHelper.flatMap)(datas, function (data) {
          return self.decendentNodeIds(data);
        }));
      }
    }, {
      key: "ancestorNodeIdsForDatas",
      value: function ancestorNodeIdsForDatas(datas) {
        var self = this;
        return (0, _union2.default)((0, _ArrayHelper.flatMap)(datas, function (data) {
          return self.ancestorNodeIds(data);
        }));
      }
    }, {
      key: "hoverStatusOnNodeIds",
      value: function hoverStatusOnNodeIds(nodeIds, hoverKey) {
        var nodeSet = new Set(nodeIds);

        var onFn = _HoverStatus.HoverStatus.onFn(hoverKey);

        var offFn = _HoverStatus.HoverStatus.offFn(hoverKey); // highlight nodes


        (0, _MapHelper.mapValues)(this.nodes).map(function (node) {
          if (nodeSet.has(node.reactId)) {
            onFn(node);
          } else {
            offFn(node);
          }
        }); // highlight edges

        (0, _MapHelper.mapValues)(this.edges).map(function (edge) {
          if (nodeSet.has(edge.reactId) && nodeSet.has(edge.depOnReactId)) {
            onFn(edge);
          } else {
            offFn(edge);
          }
        }); // highlight unique edges

        (0, _MapHelper.mapValues)(this.edgesUnique).map(function (edge) {
          if (nodeSet.has(edge.reactId) && nodeSet.has(edge.depOnReactId)) {
            onFn(edge);
          } else {
            offFn(edge);
          }
        });
        return this;
      }
    }, {
      key: "filterGraphOnNodeIds",
      value: function filterGraphOnNodeIds(nodeIds) {
        var _this3 = this;

        var nodeSet = new Set(nodeIds); // prune nodes

        this.nodes.forEach(function (node, key) {
          if (!nodeSet.has(node.reactId)) {
            _this3.nodes.delete(key);
          }
        }); // prune edges

        this.edges.forEach(function (edge, key) {
          if (!(nodeSet.has(edge.reactId) && nodeSet.has(edge.depOnReactId))) {
            _this3.edges.delete(key);
          }
        }); // prune unique edges

        this.edgesUnique.forEach(function (edge, key) {
          if (!(nodeSet.has(edge.reactId) && nodeSet.has(edge.depOnReactId))) {
            _this3.edgesUnique.delete(key);
          }
        });
        return this;
      }
    }, {
      key: "addEntry",
      value: function addEntry(data) {
        if (!(0, _isNil2.default)(data.reactId)) {
          if (data.reactId === "rNoCtx") {
            return;
          }
        }

        data = data;
        var node, lastNodeId, edge;

        switch (data.action) {
          // {"action": "define", "reactId": "r3", "label": "plotObj", "type": "observable", "session": "fa3c747a6121aec5baa682cc3970b811", "time": 1524581676.5841},
          case _logStates.LogStates.define:
            {
              var logEntry = data;
              this.nodes.set(data.reactId, new _Node.Node(logEntry));
              break;
            }
          // {"action": "updateNodeLabel", "nodeId": "1", "label": "input", "session": null, "time": 1522955046.5537},

          case _logStates.LogStates.updateNodeLabel:
            node = this.nodes.get(data.reactId);

            if (node) {
              node.label = data.label;
            }

            break;

          case _logStates.LogStates.valueChange:
            node = this.nodes.get(data.reactId);

            if (node) {
              node.value = data.value;
              node.valueChangedStatus.setActiveAtStep(data.step);
            }

            break;

          case _logStates.LogStates.invalidateStart:
            {
              var _logEntry = data;
              node = this.nodes.get(_logEntry.reactId);
              lastNodeId = (0, _last2.default)(this.activeInvalidateEnter);

              if (lastNodeId) {
                var lastInvalidateNode = this.nodes.get(lastNodeId);

                if (lastInvalidateNode) {
                  lastInvalidateNode.invalidateStatus.resetActive();
                }
              }

              this.activeInvalidateEnter.push(_logEntry.reactId);

              if (node) {
                switch (node.type) {
                  case "observable":
                  case "observer":
                    node.invalidateStatus.setActiveAtStep(_logEntry.step);
                    break;
                }

                node.statusAdd(_logEntry);
              }

              break;
            }

          case _logStates.LogStates.enter:
            {
              var _logEntry2 = data;
              lastNodeId = (0, _last2.default)(this.activeNodeEnter);

              if (lastNodeId) {
                var lastNode = this.nodes.get(lastNodeId);

                if (lastNode) {
                  lastNode.enterStatus.resetActive();
                }
              }

              this.activeNodeEnter.push(_logEntry2.reactId);
              node = this.nodes.get(_logEntry2.reactId);

              if (node) {
                node.enterStatus.setActiveAtStep(_logEntry2.step);

                switch (node.type) {
                  case "observer":
                  case "observable":
                    node.invalidateStatus.reset();
                }

                node.statusAdd(_logEntry2);
              }

              break;
            }

          case _logStates.LogStates.isolateInvalidateStart:
          case _logStates.LogStates.isolateEnter:
            {
              var _logEntry3 = data;
              node = this.nodes.get(_logEntry3.reactId);

              if (node) {
                node.statusAdd(_logEntry3);
              }

              break;
            }

          case _logStates.LogStates.invalidateEnd:
          case _logStates.LogStates.exit:
          case _logStates.LogStates.isolateExit:
          case _logStates.LogStates.isolateInvalidateEnd:
            {
              node = this.nodes.get(data.reactId);

              switch (data.action) {
                case _logStates.LogStates.exit:
                  {
                    var activeEnterNode = this.nodes.get((0, _last2.default)(this.activeNodeEnter));

                    if (activeEnterNode) {
                      activeEnterNode.enterStatus.reset();
                    }

                    this.activeNodeEnter.pop();
                    lastNodeId = (0, _last2.default)(this.activeNodeEnter);

                    if (lastNodeId) {
                      var curActiveNode = this.nodes.get(lastNodeId);

                      if (curActiveNode) {
                        curActiveNode.enterStatus.setActiveAtStep(data.step);
                      }
                    }

                    break;
                  }

                case _logStates.LogStates.invalidateEnd:
                  {
                    // turn off the previously active node
                    var _curActiveNode = this.nodes.get((0, _last2.default)(this.activeInvalidateEnter));

                    if (_curActiveNode) {
                      _curActiveNode.invalidateStatus.resetActive();
                    }

                    this.activeInvalidateEnter.pop(); // if another invalidateStart node exists...
                    //   set the previous invalidateStart node to active

                    lastNodeId = (0, _last2.default)(this.activeInvalidateEnter);

                    if (lastNodeId) {
                      var _lastNode = this.nodes.get(lastNodeId);

                      if (_lastNode) {
                        _lastNode.invalidateStatus.setActiveAtStep(data.step);
                      }
                    }

                    if (node) {
                      node.invalidateStatus.toFinished();

                      if (node.valueChangedStatus.isOn) {
                        node.valueChangedStatus.reset();
                      }
                    }

                    break;
                  }

                case _logStates.LogStates.isolateInvalidateEnd:
                  if (node && node.valueChangedStatus.isOn) {
                    node.valueChangedStatus.reset();
                  }

                  break;
              }

              if (node) {
                var prevData = node.statusLast();
                var expectedAction;

                switch (data.action) {
                  case _logStates.LogStates.exit:
                    expectedAction = _logStates.LogStates.enter;
                    break;

                  case _logStates.LogStates.isolateExit:
                    expectedAction = _logStates.LogStates.isolateEnter;
                    break;

                  case _logStates.LogStates.invalidateEnd:
                    expectedAction = _logStates.LogStates.invalidateStart;
                    break;

                  case _logStates.LogStates.isolateInvalidateEnd:
                    expectedAction = _logStates.LogStates.isolateInvalidateStart;
                    break;
                }

                if (expectedAction) {
                  var _logEntry4 = data;
                  (0, _StatusArr.expectPrevStatus)(_logEntry4, prevData, expectedAction);
                  node.statusRemove(_logEntry4);
                }
              }

              break;
            }

          case _logStates.LogStates.dependsOn:
            {
              var _logEntry5 = data;

              if (!_logEntry5.reactId) {
                break;
              }

              edge = new _Edge.Edge(_logEntry5);
              var edgeKey = edge.key; // store unique edges to always display a transparent dependency

              if (!this.edgesUnique.has(edge.ghostKey)) {
                this.edgesUnique.set(edge.ghostKey, new _GhostEdge.GhostEdge(_logEntry5));
              }

              if (this.edges.has(edgeKey)) {
                edge = this.edges.get(edgeKey);
              } else {
                this.edges.set(edgeKey, edge);
              }

              if (edge) {
                node = this.nodes.get(edge.reactId);

                if (node && node.statusLast().action === _logStates.LogStates.isolateEnter) {
                  edge.status = "isolate";
                } else {
                  edge.status = "normal";
                }
              }

              break;
            }

          case _logStates.LogStates.dependsOnRemove:
            {
              var _logEntry6 = data;
              edge = new _Edge.Edge(_logEntry6); // remove the edge

              this.edges.delete(edge.key);
              break;
            }

          case _logStates.LogStates.createContext:
          case _logStates.LogStates.idle:
          case _logStates.LogStates.asyncStart:
          case _logStates.LogStates.asyncStop:
          case _logStates.LogStates.userMark:
            // do nothing
            // this[data.action] = data.step;
            break;

          case _logStates.LogStates.freeze:
            node = this.nodes.get(data.reactId);

            if (node) {
              node.isFrozen = true;
            }

            break;

          case _logStates.LogStates.thaw:
            node = this.nodes.get(data.reactId);

            if (node) {
              node.isFrozen = false;
            }

            break;

          default:
            _console.default.error("unknown data.action: ", data.action, data);

          // throw data;
        }
      }
    }, {
      key: "cytoGraph",
      get: function get() {
        var nodes = (0, _MapHelper.mapValues)(this.nodes).map(function (item) {
          return item.cytoData;
        });
        var ghostEdgeMap = new Map(this.edgesUnique.entries());
        var edges = (0, _MapHelper.mapValues)(this.edges).map(function (edge) {
          // remove matching unique/ghost edges
          if (ghostEdgeMap.has(edge.ghostKey)) {
            ghostEdgeMap.delete(edge.ghostKey);
          }

          return edge.cytoData;
        });
        var ghostEdges = (0, _MapHelper.mapValues)(ghostEdgeMap).map(function (item) {
          return item.cytoData;
        });
        var cyto = (0, _cytoscape.default)();
        cyto.add(nodes);
        cyto.add(edges);
        cyto.add(ghostEdges);
        return cyto;
      }
    }]);

    return Graph;
  }();

  _exports.Graph = Graph;

  function isEdgeLike(data) {
    return data instanceof _Edge.Edge || data instanceof _GhostEdge.GhostEdge;
  }
});

/***/ }),

/***/ "./srcjs/graph/GraphAtStep.js":
/*!************************************!*\
  !*** ./srcjs/graph/GraphAtStep.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/assign */ "./node_modules/lodash/assign.js"), __webpack_require__(/*! lodash/clone */ "./node_modules/lodash/clone.js"), __webpack_require__(/*! lodash/filter */ "./node_modules/lodash/filter.js"), __webpack_require__(/*! lodash/some */ "./node_modules/lodash/some.js"), __webpack_require__(/*! lodash/sortBy */ "./node_modules/lodash/sortBy.js"), __webpack_require__(/*! lodash/sortedIndex */ "./node_modules/lodash/sortedIndex.js"), __webpack_require__(/*! lodash/sortedIndexOf */ "./node_modules/lodash/sortedIndexOf.js"), __webpack_require__(/*! lodash/union */ "./node_modules/lodash/union.js"), __webpack_require__(/*! ../utils/console */ "./srcjs/utils/console.js"), __webpack_require__(/*! ../utils/MapHelper */ "./srcjs/utils/MapHelper.js"), __webpack_require__(/*! ../log/logStates */ "./srcjs/log/logStates.js"), __webpack_require__(/*! ./Graph */ "./srcjs/graph/Graph.js"), __webpack_require__(/*! ../cyto/layoutOptions */ "./srcjs/cyto/layoutOptions.js"), __webpack_require__(/*! ./Node */ "./srcjs/graph/Node.js"), __webpack_require__(/*! ./Edge */ "./srcjs/graph/Edge.js"), __webpack_require__(/*! ./GhostEdge */ "./srcjs/graph/GhostEdge.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _jquery, _assign2, _clone2, _filter2, _some2, _sortBy2, _sortedIndex2, _sortedIndexOf2, _union2, _console, _MapHelper, _logStates, _Graph, _layoutOptions, _Node, _Edge, _GhostEdge) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hasLength = hasLength;
  _exports.GraphAtStep = void 0;
  _jquery = _interopRequireDefault(_jquery);
  _assign2 = _interopRequireDefault(_assign2);
  _clone2 = _interopRequireDefault(_clone2);
  _filter2 = _interopRequireDefault(_filter2);
  _some2 = _interopRequireDefault(_some2);
  _sortBy2 = _interopRequireDefault(_sortBy2);
  _sortedIndex2 = _interopRequireDefault(_sortedIndex2);
  _sortedIndexOf2 = _interopRequireDefault(_sortedIndexOf2);
  _union2 = _interopRequireDefault(_union2);
  _console = _interopRequireDefault(_console);
  _layoutOptions = _interopRequireDefault(_layoutOptions);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  // TODO-barret make filterDatas and hoverDatas sub modules of subsetDatas or something
  var GraphAtStep =
  /*#__PURE__*/
  function () {
    function GraphAtStep(log) {
      _classCallCheck(this, GraphAtStep);

      _defineProperty(this, "log", void 0);

      _defineProperty(this, "originalLog", void 0);

      _defineProperty(this, "filterDatas", void 0);

      _defineProperty(this, "hoverData", void 0);

      _defineProperty(this, "stickyDatas", void 0);

      _defineProperty(this, "finalFilteredGraph", void 0);

      _defineProperty(this, "finalCompleteGraph", void 0);

      _defineProperty(this, "finalCyto", void 0);

      _defineProperty(this, "cytoLayout", void 0);

      _defineProperty(this, "steps", void 0);

      _defineProperty(this, "stepsVisible", void 0);

      _defineProperty(this, "filteredStepsVisible", void 0);

      _defineProperty(this, "stepsAsyncStart", void 0);

      _defineProperty(this, "stepsAsyncStop", void 0);

      _defineProperty(this, "stepsIdle", void 0);

      _defineProperty(this, "stepsOutputCalc", void 0);

      _defineProperty(this, "stepsUserMark", void 0);

      _defineProperty(this, "minStep", void 0);

      _defineProperty(this, "maxStep", void 0);

      this.originalLog = log; // hoverInfo[key] = `HoverStatus`

      this.filterDatas = [];
      this.hoverData = null;
      this.stickyDatas = []; // this.hoverDefault = "focused"
      // this.hoverInfo = {} // use `hoverKey`
      // this.filterMap = {};

      this.log = log;
      this.initStepInfo(log); // make a graph with no filtering that is completly made

      this.finalCompleteGraph = this.rawGraphAtStep(log.length);
      this.updateFinalFilteredGraphAndStepsVisible();
    }

    _createClass(GraphAtStep, [{
      key: "updateFinalFilteredGraphAndStepsVisible",
      value: function updateFinalFilteredGraphAndStepsVisible() {
        this.updateFinalFilteredGraph();
        this.updateFilteredStepsVisible();
        return;
      } // function hasFilterDatas(): boolean %checks {
      //   return this.filterDatas ? this.filterDatas.length > 0 : false;
      // }
      // get hasStickyDatas() {
      //   return this.stickyDatas ? this.stickyDatas.length > 0 : false;
      // }
      // get hasHoverData() {
      //   return this.hoverData ? true : false;
      // }

    }, {
      key: "initStepInfo",
      value: function initStepInfo(log) {
        this.steps = [];
        this.stepsAsyncStart = [];
        this.stepsAsyncStop = [];
        this.stepsIdle = [];
        this.stepsOutputCalc = [];
        this.stepsUserMark = [];
        this.minStep = log.length > 0 ? log[0].step : -1;
        this.maxStep = log.length > 0 ? log[log.length - 1].step : -1;
        var logItem, i;
        var idleArr = [];
        var startI = 0;

        while (log.length > startI + 2 && log[startI].action === _logStates.LogStates.asyncStart && log[startI].session === null && log[startI + 1].action === _logStates.LogStates.asyncStop && log[startI + 1].session === null && log[startI + 2].action === _logStates.LogStates.idle && log[startI + 2].session === null) {
          startI = startI + 3;
        }

        while (log.length > startI && log[startI].action === _logStates.LogStates.idle) {
          startI = startI + 1;
        }

        for (i = startI; i < log.length; i++) {
          logItem = log[i];

          switch (logItem.action) {
            case _logStates.LogStates.enter:
              idleArr.push(i);
              break;

            case _logStates.LogStates.exit:
              idleArr.pop();

              if (idleArr.length === 0) {
                this.stepsOutputCalc.push(logItem.step);
              }

              break;

            case _logStates.LogStates.asyncStart:
              this.stepsAsyncStart.push(logItem.step);
              break;

            case _logStates.LogStates.asyncStop:
              this.stepsAsyncStop.push(logItem.step);
              break;

            case _logStates.LogStates.idle:
              this.stepsIdle.push(logItem.step);
              break;

            case _logStates.LogStates.userMark:
              this.stepsUserMark.push(logItem.step);
              break;
          }

          switch (logItem.action) {
            case _logStates.LogStates.invalidateStart:
              {
                var logEntry = logItem;

                if (logEntry.type === "other") {
                  break;
                }

                if (log.length > i + 1 && i - 1 >= 0) {
                  var prevLogItem = log[i - 1];
                  var nextLogItem = log[i + 1];

                  if (nextLogItem.action === _logStates.LogStates.asyncStart && log.length > i + 2) {
                    nextLogItem = log[i + 2];
                  }

                  if (nextLogItem.action === _logStates.LogStates.invalidateEnd && prevLogItem.action === _logStates.LogStates.define && logItem.reactId === prevLogItem.reactId && logItem.reactId === nextLogItem.reactId) {
                    // define X <-- keep
                    // invalidte start X <-- ignore!
                    // invalidate end X <-- already ignored
                    break;
                  }
                } // TODO-barret check if reactId is a reactive values. If so, skip, otherwise add


                this.steps.push(logEntry.step);
                break;
              }

            case _logStates.LogStates.define: // TODO-barret only for reactive values keys

            case _logStates.LogStates.invalidateEnd:
            case _logStates.LogStates.isolateInvalidateStart:
            case _logStates.LogStates.isolateInvalidateEnd: // case "isolateEnter":
            // case "isolateExit":

            case _logStates.LogStates.createContext:
            case _logStates.LogStates.asyncStart:
            case _logStates.LogStates.asyncStop:
            case _logStates.LogStates.idle:
            case _logStates.LogStates.userMark:
              break;

            default:
              this.steps.push(logItem.step);
              break;
          }
        }

        this.stepsVisible = // sort integer list
        (0, _sortBy2.default)( // get union (unique values) of all visible locations
        (0, _union2.default)(this.steps, this.stepsUserMark, this.stepsIdle));
      }
    }, {
      key: "updateFilteredStepsVisible",
      value: function updateFilteredStepsVisible() {
        if (!hasLength(this.filterDatas)) {
          // no filtered data, so set to all visible steps
          this.filteredStepsVisible = (0, _clone2.default)(this.stepsVisible);
          return;
        } // must have filtered data


        var filteredStepsVisible = [];
        var finalFilteredGraph = this.finalFilteredGraph;
        var visibleStep, logEntry, i; // todo must be actual log. not visible steps

        for (i = 0; i < this.stepsVisible.length; i++) {
          visibleStep = this.stepsVisible[i];
          logEntry = this.log[visibleStep];

          switch (logEntry.action) {
            case _logStates.LogStates.dependsOn:
            case _logStates.LogStates.dependsOnRemove:
              // check for both to and from (since it must exist beforehand)
              if (finalFilteredGraph.hasNodeReactId(logEntry.reactId) && finalFilteredGraph.hasNodeReactId(logEntry.depOnReactId)) {
                filteredStepsVisible.push(visibleStep);
                break;
              } // not found


              break;

            case _logStates.LogStates.define:
            case _logStates.LogStates.updateNodeLabel:
            case _logStates.LogStates.freeze:
            case _logStates.LogStates.thaw:
            case _logStates.LogStates.valueChange:
            case _logStates.LogStates.enter:
            case _logStates.LogStates.exit:
            case _logStates.LogStates.invalidateLater:
            case _logStates.LogStates.invalidateStart:
            case _logStates.LogStates.invalidateEnd:
            case _logStates.LogStates.isolateEnter:
            case _logStates.LogStates.isolateExit:
            case _logStates.LogStates.isolateInvalidateStart:
            case _logStates.LogStates.isolateInvalidateEnd:
              if (!finalFilteredGraph.hasNodeReactId(logEntry.reactId)) {
                // no node found in filtered graph
                break;
              }

              filteredStepsVisible.push(visibleStep);
              break;

            case _logStates.LogStates.idle:
              if (filteredStepsVisible.length > 0) {
                var priorFilteredStepVisible = filteredStepsVisible[filteredStepsVisible.length - 1];

                if (this.log[priorFilteredStepVisible].action !== _logStates.LogStates.idle) {
                  // if the visible state is not an idle state, add it
                  filteredStepsVisible.push(visibleStep);
                }
              }

              break;

            case _logStates.LogStates.userMark:
              // always include (for now, multiple idle steps are removed later)
              filteredStepsVisible.push(visibleStep);
              break;

            case _logStates.LogStates.createContext:
            case _logStates.LogStates.asyncStart:
            case _logStates.LogStates.asyncStop:
              // do not include
              break;

            default:
              _console.default.error(logEntry);

              throw "unknown logEntry action in 'next'";
          }
        }

        this.filteredStepsVisible = filteredStepsVisible;
        return;
      }
    }, {
      key: "nextStep",
      value: function nextStep(k) {
        var idx = (0, _sortedIndexOf2.default)(this.filteredStepsVisible, k);

        if (idx >= 0) {
          // go to the next step location
          idx += 1;
        } else {
          // doesn't exist... so go to next closes step
          idx = (0, _sortedIndex2.default)(this.filteredStepsVisible, k);
        } // else, does not exist, so it is directly there


        if (idx >= this.filteredStepsVisible.length || idx < 0) return -1;
        return this.filteredStepsVisible[idx];
      }
    }, {
      key: "prevStep",
      value: function prevStep(k) {
        var idx = (0, _sortedIndex2.default)(this.filteredStepsVisible, k) - 1;
        if (idx < 0 || idx >= this.filteredStepsVisible.length) return -1;
        return this.filteredStepsVisible[idx];
      } // full graph at step without filtering
      //  no cometic changes

    }, {
      key: "rawGraphAtStep",
      value: function rawGraphAtStep(k) {
        var kVal = Math.max(0, Math.min(k, this.log.length)); // if (kVal >= this.cacheStep) {
        //   iStart = Math.floor((kVal - 1) / this.cacheStep) * this.cacheStep;
        //   graph = _cloneDeep(this.graphCache[iStart])
        // }

        var i,
            graph = new _Graph.Graph(this.log);

        for (i = 0; i < this.log.length && this.log[i].step <= kVal; i++) {
          graph.addEntry(this.log[i]);
        }

        return graph; // this.graphCache = {};
        // this.cacheStep = 250;
        // var tmpGraph = new Graph(log);
        // for (i = 0; i < log.length; i++) {
        //   tmpGraph.addEntry(log[i])
        //   if ((i % this.cacheStep) == 0) {
        //     this.graphCache[i] = _cloneDeep(tmpGraph)
        //   }
        // }
      } // update the filtering for the final graph. No cosmetics

    }, {
      key: "updateFinalFilteredGraph",
      value: function updateFinalFilteredGraph() {
        // copy final graph
        var finalGraph = new _Graph.Graph(this.finalCompleteGraph); // if any filtering...

        if (hasLength(this.filterDatas)) {
          finalGraph.filterGraphOnNodeIds( // graph.familyTreeNodeIdsForDatas(this.filterDatas)
          this.finalCompleteGraph.familyTreeNodeIdsForDatas(this.filterDatas));
        }

        this.finalFilteredGraph = finalGraph;
        return;
      } // graph at step with filtering
      // include all cosmetic information

    }, {
      key: "filteredGraphAtStep",
      value: function filteredGraphAtStep(k) {
        // get unfiltered graph at step k
        var graph = this.rawGraphAtStep(k); // if any hover...

        if (this.hoverData && graph.hasSomeData(this.hoverData)) {
          graph.hoverStatusOnNodeIds(this.finalFilteredGraph.familyTreeNodeIds(this.hoverData), "state");
          graph.highlightSelected(this.hoverData, "selected");
        } // if any sticky...


        if (hasLength(this.stickyDatas)) {
          if ((0, _some2.default)(this.stickyDatas.map(function (data) {
            return graph.hasSomeData(data);
          }))) {
            // at least some sticky data is visible
            var stickyTree = this.finalFilteredGraph.familyTreeNodeIdsForDatas(this.stickyDatas);
            graph.hoverStatusOnNodeIds(stickyTree, "sticky");
            this.stickyDatas.map(function (data) {
              graph.highlightSelected(data, "selected");
            });

            if (!this.hoverData) {
              // if sticky data no hover data... make the sticky data hover!
              graph.hoverStatusOnNodeIds(stickyTree, "state");
            }
          }
        } // if any filtering...


        if (hasLength(this.filterDatas)) {
          graph.filterGraphOnNodeIds( // graph.familyTreeNodeIdsForDatas(this.filterDatas)
          this.finalFilteredGraph.familyTreeNodeIdsForDatas(this.filterDatas)); // graph.hoverStatusOnNodeIds(this.filterDatas.map((x) => x.reactId), "filtered");

          this.filterDatas.map(function (data) {
            graph.highlightSelected(data, "filtered");
          });
        }

        return graph;
      } // if some sticky items, set those to focused and everything else to not focused
      // else set all to focused

    }, {
      key: "resetHoverData",
      value: function resetHoverData() {
        this.hoverData = null; // if (this.stickyData) {
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
    }, {
      key: "updateHoverData",
      value: function updateHoverData(data) {
        this.hoverData = data;
      }
    }, {
      key: "updateHoverDataReset",
      value: function updateHoverDataReset() {
        this.hoverData = null;
      }
    }, {
      key: "updateStickyDatas",
      value: function updateStickyDatas(dataArr) {
        this.stickyDatas = dataArr;
      }
    }, {
      key: "updateStickyDatasReset",
      value: function updateStickyDatasReset() {
        this.stickyDatas = [];
      }
    }, {
      key: "updateFilterDatas",
      value: function updateFilterDatas(dataArr) {
        this.filterDatas = dataArr;
        this.updateFinalFilteredGraphAndStepsVisible();
      }
    }, {
      key: "updateFilterDatasReset",
      value: function updateFilterDatasReset() {
        this.updateFilterDatas([]);
      }
    }, {
      key: "updateSearchRegex",
      value: function updateSearchRegex(regex) {
        // update filterDatas below
        var matchedElements = (0, _filter2.default)( // (mapValues(graph.nodes): ArraySomeGraphData),
        (0, _MapHelper.mapValues)(this.finalCompleteGraph.nodes), function (node) {
          return regex.test(node.label) || regex.test(node.key);
        });

        if (matchedElements.length === 0) {
          matchedElements = (0, _filter2.default)((0, _MapHelper.mapValues)(this.finalCompleteGraph.edges), function (edge) {
            return regex.test(edge.ghostKey);
          });
        }

        if (matchedElements.length === 0) {
          matchedElements = (0, _filter2.default)((0, _MapHelper.mapValues)(this.finalCompleteGraph.edgesUnique), function (edge) {
            return regex.test(edge.key);
          });
        }

        if (matchedElements.length === 0) {
          // no matches found
          this.updateStickyDatasReset();
          this.updateFilterDatasReset();
        } else {
          this.updateStickyDatas(matchedElements);
          this.updateFilterDatas( // for some reason, an array of node does not work with an array of (node, edge, or ghostedge)
          matchedElements);
        }
      }
    }, {
      key: "updateSearchRegexReset",
      value: function updateSearchRegexReset() {
        this.resetHoverStickyFilterSearch();
      }
    }, {
      key: "resetHoverStickyFilterSearch",
      value: function resetHoverStickyFilterSearch() {
        this.hoverData = null;
        this.stickyDatas = [];
        this.filterDatas = [];
        (0, _jquery.default)("#search").val("");
        this.updateFinalFilteredGraphAndStepsVisible();
      } // computes a graph containing all points and edges possible,
      //   extending the original graph at step k

    }, {
      key: "fullFilteredGraphAtStep",
      value: function fullFilteredGraphAtStep(k) {
        // get graph at step k and update the final graph obect
        var graph = this.filteredGraphAtStep(k);
        var finalGraph = this.finalFilteredGraph; // add any points and edges that have not be defined yet
        // do not include regular edges, only unique edges
        // append all missing nodes

        (0, _MapHelper.mapValues)(finalGraph.nodes).map(function (fullNode) {
          if (!graph.nodes.has(fullNode.key)) {
            // stomps finalGraph node value, but currently not a consequence to worry about
            fullNode.isDisplayed = false;
            graph.nodes.set(fullNode.key, fullNode);
          }
        });
        (0, _MapHelper.mapValues)(finalGraph.edgesUnique).map(function (fullEdge) {
          if (!graph.edgesUnique.has(fullEdge.key)) {
            // stomps finalGraph edge value, but currently not a consequence to worry about
            fullEdge.isDisplayed = false;
            graph.edgesUnique.set(fullEdge.key, fullEdge);
          }
        });
        return graph;
      }
    }, {
      key: "displayAtStep",
      value: function displayAtStep(k, cy) {
        var cytoOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var graph = this.fullFilteredGraphAtStep(k);
        cy.startBatch(); // let cytoDur = 0;

        var cyNodes = cy.nodes();
        var graphCyto = graph.cytoGraph;
        var graphNodes = graphCyto.nodes();
        var nodesLRB = cyNodes.diff(graphNodes); // .removeStyle()

        var onLayoutReady = [];
        var someNodeHasNewLabel = false; // enter visible nodes

        nodesLRB.right.map(function (graphNode) {
          var graphNodeData = graphNode.data();
          cy.add(graphNode).data("cytoLabel_", graphNodeData.cytoLabel).data("cytoLabelShort_", graphNodeData.cytoLabelShort).classes(graphNodeData.cytoClasses).style(graphNodeData.cytoStyle); // .animate({
          //   // style: ,
          //   duration: cytoDur
          // });
        }); // update visible nodes

        nodesLRB.both.map(function (cytoNode) {
          var cyNode = cy.$id(cytoNode.id());
          var graphNode = graphNodes.$id(cytoNode.id());
          var graphNodeData = graphNode.data();
          var graphClasses = graphNodeData.cytoClasses;

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

          cyNode // update to latest data
          .data(graphNodeData) // prolly due to how accessor methods are done, this data value must be placed manually
          .data("value", graphNodeData.value).data("cytoLabel_", graphNodeData.cytoLabel).data("cytoLabelShort_", graphNodeData.cytoLabelShort).classes(graphClasses).removeStyle().style(graphNodeData.cytoStyle); // .animate({
          //   // style: graphNodeData.cytoStyle,
          //   duration: cytoDur
          // });
          // pulse value change

          if (graphNodeData.valueChangedStatus.isActiveAtStep(k)) {
            onLayoutReady.push(function () {
              cyNode.flashClass("nodeStartBig", 125);
            });
          } // pulse value enter or invalidate change


          if (graphNodeData.invalidateStatus.isActiveAtStep(k) || graphNodeData.enterStatus.isActiveAtStep(k)) {
            onLayoutReady.push(function () {
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
        }); // exit visible nodes

        nodesLRB.left.map(function (cytoNode) {
          cy.remove(cytoNode); // .animate({duration: cytoDur});
        });
        var cyEdges = cy.edges();
        var graphEdges = graphCyto.edges();
        var edgesLRB = cyEdges.diff(graphEdges); // enter visible edges

        edgesLRB.right.map(function (graphEdge) {
          var graphEdgeData = graphEdge.data();
          cy.add(graphEdge).classes(graphEdgeData.cytoClasses).removeStyle().style(graphEdgeData.cytoStyle); // .animate({
          //   style: graphEdgeData.cytoStyle,
          //   duration: cytoDur
          // });
        }); // update visible edges

        edgesLRB.both.map(function (cytoEdge) {
          var graphEdgeData = graphEdges.$id(cytoEdge.id()).data();
          cy.$id(cytoEdge.id()) // .classes()
          .classes(graphEdgeData.cytoClasses).data(graphEdgeData).removeStyle().style(graphEdgeData.cytoStyle); // .animate({
          //   style: graphEdgeData.cytoStyle,
          //   duration: cytoDur
          // });
        }); // exit visible edges

        edgesLRB.left.map(function (cytoEdge) {
          // var graphEdge = cytoEdge.data();
          // remove the original edge
          cy.remove(cytoEdge); //  .animate({ duration: cytoDur });
        });
        cy.endBatch(); // send in sorted elements according to the key.
        // If provided in a consistent order, layouts are consistent.
        // `eles` default to `options.eles != null ? options.eles : cy.$();`

        var sortedElements = cy.$().sort(function (a, b) {
          return a.data().key > b.data().key ? 1 : -1;
        }); // if no new edges appeared or disappeared
        // or no nodes entered or exited

        if (edgesLRB.right.length === edgesLRB.left.length && nodesLRB.right.length === 0 && nodesLRB.left.length === 0 && !someNodeHasNewLabel && cytoOptions.forceRedraw !== true) {
          // do not re-render layout... just call onLayoutReady
          onLayoutReady.map(function (fn) {
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

          this.cytoLayout = cy.layout((0, _assign2.default)({}, _layoutOptions.default, cytoOptions, {
            // provide elements in sorted order to make determanistic layouts
            eles: sortedElements,
            // run on layout ready
            ready: function ready() {
              onLayoutReady.map(function (fn) {
                fn();
              });
            } // ,
            // TODO-barret Make animation a setting... it's expensive!
            // {animate: true}

          })); // remove the layout once it's finished

          this.cytoLayout.one("layoutstop", function (evt) {
            if (this.cytoLayout) {
              this.cytoLayout = null;
            }
          });
          this.cytoLayout.run();
        }
      }
    }]);

    return GraphAtStep;
  }();

  _exports.GraphAtStep = GraphAtStep;

  function hasLength(x) {
    return x && x.length > 0;
  }
});

/***/ }),

/***/ "./srcjs/graph/HoverStatus.js":
/*!************************************!*\
  !*** ./srcjs/graph/HoverStatus.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.HoverStatus = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var HoverStatus =
  /*#__PURE__*/
  function () {
    function HoverStatus() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      _classCallCheck(this, HoverStatus);

      _defineProperty(this, "sticky", void 0);

      _defineProperty(this, "state", void 0);

      _defineProperty(this, "selected", void 0);

      _defineProperty(this, "filtered", void 0);

      if (data instanceof HoverStatus) {
        this.sticky = data.sticky;
        this.state = data.state;
        this.selected = data.selected;
        this.filtered = data.filtered;
      } else {
        this.sticky = HoverStatus.valNotSticky; // true / false

        this.state = "focused"; // "focused", "notFocused"

        this.selected = false;
        this.filtered = false;
      }
    }

    _createClass(HoverStatus, [{
      key: "isSticky",
      value: function isSticky() {
        return this.sticky === HoverStatus.valSticky;
      }
    }, {
      key: "toNotSticky",
      value: function toNotSticky() {
        this.sticky = HoverStatus.valNotSticky;
      }
    }, {
      key: "toSticky",
      value: function toSticky() {
        this.sticky = HoverStatus.valSticky;
      }
    }, {
      key: "isFocused",
      value: function isFocused() {
        return this.state === HoverStatus.valFocused;
      }
    }, {
      key: "toFocused",
      value: function toFocused() {
        this.state = HoverStatus.valFocused;
      }
    }, {
      key: "toNotFocused",
      value: function toNotFocused() {
        this.state = HoverStatus.valNotFocused;
      }
    }, {
      key: "isSelected",
      value: function isSelected() {
        return this.selected === HoverStatus.valSelected;
      }
    }, {
      key: "toSelected",
      value: function toSelected() {
        this.selected = HoverStatus.valSelected;
      }
    }, {
      key: "toNotSelected",
      value: function toNotSelected() {
        this.selected = HoverStatus.valNotSelected;
      }
    }, {
      key: "isFiltered",
      value: function isFiltered() {
        return this.filtered === HoverStatus.valFiltered;
      }
    }, {
      key: "toFiltered",
      value: function toFiltered() {
        this.filtered = HoverStatus.valFiltered;
      }
    }, {
      key: "toNotFiltered",
      value: function toNotFiltered() {
        this.filtered = HoverStatus.valNotFiltered;
      }
    }]);

    return HoverStatus;
  }();

  _exports.HoverStatus = HoverStatus;

  _defineProperty(HoverStatus, "valFocused", "focused");

  _defineProperty(HoverStatus, "valNotFocused", "notFocused");

  _defineProperty(HoverStatus, "valSticky", true);

  _defineProperty(HoverStatus, "valNotSticky", false);

  _defineProperty(HoverStatus, "valSelected", true);

  _defineProperty(HoverStatus, "valNotSelected", false);

  _defineProperty(HoverStatus, "valFiltered", true);

  _defineProperty(HoverStatus, "valNotFiltered", false);

  _defineProperty(HoverStatus, "onFn", function (hoverKey) {
    switch (hoverKey) {
      case "state":
        return function (x) {
          x.hoverStatus.toFocused();
        };

      case "sticky":
        return function (x) {
          x.hoverStatus.toSticky();
        };

      case "selected":
        return function (x) {
          x.hoverStatus.toSelected();
        };

      case "filtered":
        return function (x) {
          x.hoverStatus.toFiltered();
        };

      default:
        throw "hoverKey: ".concat(hoverKey, " provided is not found");
    }
  });

  _defineProperty(HoverStatus, "offFn", function (hoverKey) {
    switch (hoverKey) {
      case "state":
        return function (x) {
          x.hoverStatus.toNotFocused();
        };

      case "sticky":
        return function (x) {
          x.hoverStatus.toNotSticky();
        };

      case "selected":
        return function (x) {
          x.hoverStatus.toNotSelected();
        };

      case "filtered":
        return function (x) {
          x.hoverStatus.toNotFiltered();
        };

      default:
        throw "hoverKey: ".concat(hoverKey, " provided is not found");
    }
  });
});

/***/ }),

/***/ "./srcjs/graph/Node.js":
/*!*****************************!*\
  !*** ./srcjs/graph/Node.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../log/logStates */ "./srcjs/log/logStates.js"), __webpack_require__(/*! ./HoverStatus */ "./srcjs/graph/HoverStatus.js"), __webpack_require__(/*! ./ActiveStateStatus */ "./srcjs/graph/ActiveStateStatus.js"), __webpack_require__(/*! ./StatusArr */ "./srcjs/graph/StatusArr.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _isNil2, _rlog, _logStates, _HoverStatus, _ActiveStateStatus, _StatusArr) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Node = void 0;
  _isNil2 = _interopRequireDefault(_isNil2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  // // TODO-barret use log states everywhere
  // import logStates from "../log/logStates"
  var Node =
  /*#__PURE__*/
  function () {
    function Node(data) {
      _classCallCheck(this, Node);

      _defineProperty(this, "reactId", void 0);

      _defineProperty(this, "label", void 0);

      _defineProperty(this, "type", void 0);

      _defineProperty(this, "session", void 0);

      _defineProperty(this, "time", void 0);

      _defineProperty(this, "isFrozen", void 0);

      _defineProperty(this, "statusArr", void 0);

      _defineProperty(this, "value", void 0);

      _defineProperty(this, "hoverStatus", void 0);

      _defineProperty(this, "valueChangedStatus", void 0);

      _defineProperty(this, "enterStatus", void 0);

      _defineProperty(this, "invalidateStatus", void 0);

      _defineProperty(this, "isDisplayed", void 0);

      _defineProperty(this, "calculationTime", void 0);

      _defineProperty(this, "calculationStartMap", void 0);

      if (typeof data.reactId === "undefined") throw "data.reactId not provided in new Node";
      if (typeof data.label === "undefined") throw "data.label not provided in new Node";
      if (typeof data.type === "undefined") throw "data.type not provided in new Node";
      if (typeof data.session === "undefined") throw "data.session not provided in new Node";
      if (typeof data.time === "undefined") throw "data.time not provided in new Node";
      this.reactId = data.reactId;
      this.label = data.label;
      this.type = data.type;
      this.session = (0, _isNil2.default)(data.session) ? "Global" : data.session;
      this.time = data.time;
      this.isFrozen = data.isFrozen || false;
      this.statusArr = new _StatusArr.StatusArr(data.statusArr || []);
      this.value = (0, _isNil2.default)(data.value) ? null : data.value;
      this.hoverStatus = new _HoverStatus.HoverStatus(data.hoverStatus);
      this.isDisplayed = (0, _isNil2.default)(data.isDisplayed) ? true : data.isDisplayed;
      this.calculationTime = (0, _isNil2.default)(data.calculationTime) ? null : data.calculationTime;
      this.calculationStartMap = (0, _isNil2.default)(data.calculationStartMap) ? new Map() : new Map(data.calculationStartMap);
      this.valueChangedStatus = data.valueChangedStatus || new _ActiveStateStatus.ActiveStateStatus(); // this.inInvalidate = data.inInvalidate || false;
      // this.activeInvalidate = data.activeInvalidate || false;

      this.enterStatus = data.enterStatus || new _ActiveStateStatus.ActiveStateStatus();

      if (data.invalidateStatus) {
        this.invalidateStatus = data.invalidateStatus;
      } else {
        this.invalidateStatus = new _ActiveStateStatus.ActiveStateStatus(); // init state for observer and obervable is to be invalidated

        switch (this.type) {
          case "observable":
          case "observer":
            this.invalidateStatus.toFinished();
            break;
        }
      }
    }

    _createClass(Node, [{
      key: "statusAdd",
      value: function statusAdd(logEntry) {
        if (logEntry.action === _logStates.LogStates.enter) {
          this.calculationStartMap.set(logEntry.ctxId, logEntry.time);
        }

        switch (logEntry.action) {
          case _logStates.LogStates.enter:
          case _logStates.LogStates.isolateInvalidateStart:
          case _logStates.LogStates.invalidateStart:
            this.calculationTime = null;
            break;
        }

        this.statusArr.add(logEntry);
        return this.statusArr;
      }
    }, {
      key: "statusRemove",
      value: function statusRemove(logEntry) {
        if (logEntry.action === _logStates.LogStates.exit) {
          var startEntryTime = this.calculationStartMap.get(logEntry.ctxId);

          if (!(0, _isNil2.default)(startEntryTime)) {
            this.calculationTime = (logEntry.time - startEntryTime) * 1000;
          }

          this.calculationStartMap.delete(logEntry.ctxId);
        }

        return this.statusArr.remove();
      }
    }, {
      key: "statusLast",
      value: function statusLast() {
        return this.statusArr.last();
      }
    }, {
      key: "id",
      get: function get() {
        return this.reactId.replace(/\$/g, "_");
      }
    }, {
      key: "key",
      get: function get() {
        return this.reactId;
      }
    }, {
      key: "hoverKey",
      get: function get() {
        return this.key;
      }
    }, {
      key: "inEnter",
      get: function get() {
        return this.statusArr.containsStatus(_logStates.LogStates.enter);
      }
    }, {
      key: "inIsolate",
      get: function get() {
        return this.statusArr.containsStatus(_logStates.LogStates.isolateEnter);
      }
    }, {
      key: "inInvalidate",
      get: function get() {
        return this.statusArr.containsStatus(_logStates.LogStates.invalidateStart);
      }
    }, {
      key: "inIsolateInvalidate",
      get: function get() {
        return this.statusArr.containsStatus(_logStates.LogStates.isolateInvalidateStart);
      }
    }, {
      key: "cytoStyle",
      get: function get() {
        return {};
      }
    }, {
      key: "cytoLabel",
      get: function get() {
        var label = "".concat(this.label);

        if (this.type === "observer" || this.type === "observable") {
          var time = this.calculationTime;

          if (_rlog.rlog.displayTimeOnNodes) {
            if (!(0, _isNil2.default)(time)) {
              // is just chillin... so I'm assuming it's calculated and I want to know how long it took.
              return "".concat(label, "\n\nCalculation Time: ").concat(time.toFixed(0), "ms");
            }
          }

          return label;
        } // not a middle or end node...


        if (!(0, _isNil2.default)(this.value)) {
          var value = "".concat(this.value); // only if there are no new lines...

          if (!value.includes("\\n")) {
            // trim beginning of string
            value = value.replace(/^\s+/, "");
          }

          return "".concat(label, "\n\nValue:\n").concat(value);
        }

        return label;
      }
    }, {
      key: "cytoLabelShort",
      get: function get() {
        var label = "".concat(this.label).replace(/[\t\n\r ]+/g, " ");

        if (this.type === "observer" || this.type === "observable") {
          var time = this.calculationTime;

          if (_rlog.rlog.displayTimeOnNodes) {
            if (!(0, _isNil2.default)(time)) {
              // is just chillin... so I'm assuming it's calculated and I want to know how long it took.
              return "".concat(label, " (").concat(time.toFixed(0), "ms)");
            }
          }

          return label;
        } // not a middle or end node...


        if (!(0, _isNil2.default)(this.value)) {
          var value = "".concat(this.value); // only if there are no new lines...

          if (!value.includes("\\n")) {
            // trim beginning of string
            value = value.replace(/^\s+/, "");
          }

          return "".concat(label, " - '").concat(value, "'");
        }

        return label;
      }
    }, {
      key: "cytoClasses",
      get: function get() {
        var classes = [];

        switch (this.type) {
          case "observer":
            classes.push("nodeEnd");
            break;

          case "observable":
            classes.push("nodeMiddle");
            break;

          default:
            classes.push("nodeStart");
        }

        if (this.inEnter) classes.push("nodeEnter");
        if (this.enterStatus.isActive) classes.push("nodeEnterActive");

        if (this.type === "observer" || this.type === "observable") {
          if (this.invalidateStatus.isActive) classes.push("nodeInvalidateActive");else if (this.invalidateStatus.isOn) classes.push("nodeInvalidate");else if (this.invalidateStatus.isFinished) classes.push("nodeInvalidateDone");
        } // if (this.inInvalidate) classes.push("nodeInvalidate");


        if (this.inIsolate) classes.push("nodeIsolate"); // if (this.inIsolateInvalidate) classes.push("nodeIsolateInvalidate");

        if (this.valueChangedStatus.isOn) classes.push("nodeValueChanged");

        switch (this.hoverStatus.state) {
          case _HoverStatus.HoverStatus.valFocused:
            break;

          case _HoverStatus.HoverStatus.valNotFocused:
            // console.log("not focused!")
            if (this.hoverStatus.isSticky()) {
              classes.push("hoverNotFocusedButSticky");
            } else {
              classes.push("hoverNotFocused");
            }

            break;
        }

        if (this.hoverStatus.isSelected()) {
          classes.push("nodeSelected");

          switch (this.type) {
            case "observable":
              classes.push("nodeSelectedMiddle");
              break;

            case "observer":
              classes.push("nodeSelectedEnd");
              break;

            default:
              classes.push("nodeSelectedStart");
          }
        }

        if (this.hoverStatus.isFiltered()) {
          classes.push("nodeFiltered");

          switch (this.type) {
            case "observable":
              classes.push("nodeFilteredMiddle");
              break;

            case "observer":
              classes.push("nodeFilteredEnd");
              break;

            default:
              classes.push("nodeFilteredStart");
          }
        }

        if (this.isFrozen) classes.push("nodeFrozen");
        if (!this.isDisplayed) classes.push("nodeHidden");
        return classes.join(" ");
      }
    }, {
      key: "cytoData",
      get: function get() {
        var retData = this;
        return {
          group: "nodes",
          data: retData
        };
      }
    }]);

    return Node;
  }();

  _exports.Node = Node;
});

/***/ }),

/***/ "./srcjs/graph/StatusArr.js":
/*!**********************************!*\
  !*** ./srcjs/graph/StatusArr.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/cloneDeep */ "./node_modules/lodash/cloneDeep.js"), __webpack_require__(/*! lodash/last */ "./node_modules/lodash/last.js"), __webpack_require__(/*! ../utils/console */ "./srcjs/utils/console.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _cloneDeep2, _last2, _console) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.expectPrevStatus = _exports.StatusArr = void 0;
  _cloneDeep2 = _interopRequireDefault(_cloneDeep2);
  _last2 = _interopRequireDefault(_last2);
  _console = _interopRequireDefault(_console);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var StatusArr =
  /*#__PURE__*/
  function () {
    function StatusArr() {
      var statusArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _classCallCheck(this, StatusArr);

      _defineProperty(this, "statusArr", void 0);

      if (statusArr instanceof StatusArr) {
        this.statusArr = (0, _cloneDeep2.default)(statusArr.statusArr);
      } else if (Array.isArray(statusArr)) {
        this.statusArr = statusArr;
      }
    }

    _createClass(StatusArr, [{
      key: "clone",
      value: function clone() {
        return new StatusArr(this);
      }
    }, {
      key: "add",
      value: function add(obj) {
        return this.statusArr.push(obj);
      }
    }, {
      key: "remove",
      value: function remove() {
        return this.statusArr.pop();
      }
    }, {
      key: "last",
      value: function last() {
        return (0, _last2.default)(this.statusArr);
      }
    }, {
      key: "containsStatus",
      value: function containsStatus(status) {
        var arr = this.statusArr,
            n = arr.length;

        for (var i = 0; i < n; i++) {
          if (arr[i].action === status) {
            return true;
          }
        }

        return false;
      }
    }]);

    return StatusArr;
  }();

  _exports.StatusArr = StatusArr;

  var expectPrevStatus = function expectPrevStatus(curStatus, prevStatus, expectedAction) {
    function onError(msg) {
      _console.default.error("curStatus: ", curStatus);

      _console.default.error("prevStatus: ", prevStatus);

      throw msg;
    }

    if (prevStatus.action !== expectedAction) {
      onError("prior node status does not have \"".concat(expectedAction, "\" status"));
    }

    if (prevStatus.ctxId !== curStatus.ctxId) {
      onError("prior node \"ctxId\" status does not have the same \"ctxId\" status");
    }
  };

  _exports.expectPrevStatus = expectPrevStatus;
});

/***/ }),

/***/ "./srcjs/index.js":
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js"), __webpack_require__(/*! ./rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ./log/logStates */ "./srcjs/log/logStates.js"), __webpack_require__(/*! ./graph/GraphAtStep */ "./srcjs/graph/GraphAtStep.js"), __webpack_require__(/*! ./style/colors */ "./srcjs/style/colors.js"), __webpack_require__(/*! ./cyto/cytoscapeInit */ "./srcjs/cyto/cytoscapeInit.js"), __webpack_require__(/*! ./layout/keydown */ "./srcjs/layout/keydown.js"), __webpack_require__(/*! ./updateGraph */ "./srcjs/updateGraph/index.js"), __webpack_require__(/*! ./layout/logEntry */ "./srcjs/layout/logEntry.js"), __webpack_require__(/*! ./layout/progressBar */ "./srcjs/layout/progressBar.js"), __webpack_require__(/*! ./log/initStep */ "./srcjs/log/initStep.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_jquery, _debounce2, _rlog, _logStates, _GraphAtStep, _colors, cytoscapeInit, layoutKeydown, updateGraph, logEntry, progressBar, _initStep) {
  "use strict";

  _jquery = _interopRequireDefault(_jquery);
  _debounce2 = _interopRequireDefault(_debounce2);
  _colors = _interopRequireDefault(_colors);
  cytoscapeInit = _interopRequireWildcard(cytoscapeInit);
  layoutKeydown = _interopRequireWildcard(layoutKeydown);
  updateGraph = _interopRequireWildcard(updateGraph);
  logEntry = _interopRequireWildcard(logEntry);
  progressBar = _interopRequireWildcard(progressBar);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  (0, _jquery.default)(function () {
    window.barret = _rlog.rlog;
    _rlog.rlog.log = window.log;
    _rlog.rlog.cyto = cytoscapeInit.withContainer((0, _jquery.default)("#cyto"));
    _rlog.rlog.getGraph = new _GraphAtStep.GraphAtStep(_rlog.rlog.log);
    _rlog.rlog.graph = _rlog.rlog.getGraph.finalCompleteGraph;
    (0, _jquery.default)("#prevUserMarkButton").click(updateGraph.buttonPrevMark);
    (0, _jquery.default)("#nextUserMarkButton").click(updateGraph.buttonNextMark);
    (0, _jquery.default)("#prevOutputCalcButton").click(updateGraph.buttonPrevOutputCalc);
    (0, _jquery.default)("#nextOutputCalcButton").click(updateGraph.buttonNextOutputCalc);
    (0, _jquery.default)("#prevIdleButton").click(updateGraph.buttonPrevIdle);
    (0, _jquery.default)("#nextIdleButton").click(updateGraph.buttonNextIdle);
    (0, _jquery.default)("#prevStepButton").click(updateGraph.buttonPrevStep);
    (0, _jquery.default)("#nextStepButton").click(updateGraph.buttonNextStep);
    (0, _jquery.default)("#legendInvalidating").css("background-color", _colors.default.nodes.invalidating);
    (0, _jquery.default)("#legendInvalidated").css("background-color", _colors.default.nodes.invalidated);
    (0, _jquery.default)("#legendCalculating").css("background-color", _colors.default.nodes.calculating);
    (0, _jquery.default)("#legendReady").css("background-color", _colors.default.nodes.ready);
    {
      // display the frozen legend item only if a frozen state exists
      var entry;

      for (var i = 0; i < _rlog.rlog.log.length; i++) {
        entry = _rlog.rlog.log[i];

        if (entry.action === _logStates.LogStates.freeze) {
          (0, _jquery.default)("#legendRowFrozen").css("display", ""); // remove display none form css

          (0, _jquery.default)("#legendFrozen").css("background-color", _colors.default.frozen.default);
          break;
        }
      }
    }
    progressBar.setContainers((0, _jquery.default)("#timeline"), (0, _jquery.default)("#timeline-fill"));
    var timelineBackground = (0, _jquery.default)("#timeline-bg");
    progressBar.addTimelineTicks(timelineBackground, _colors.default.nodes.ready, _rlog.rlog.getGraph.stepsOutputCalc, progressBar.timelinePadding * 2);
    progressBar.addTimelineTicks(timelineBackground, _colors.default.progressBar.idle, _rlog.rlog.getGraph.stepsIdle, 0);

    if (_rlog.rlog.getGraph.stepsUserMark.length > 0) {
      progressBar.addTimelineTicks(timelineBackground, _colors.default.progressBar.userMark, _rlog.rlog.getGraph.stepsUserMark, 0);
    }

    logEntry.setContainers((0, _jquery.default)("#eventTimeNum"), (0, _jquery.default)("#eventSessionNum"), (0, _jquery.default)("#eventStepNum"), (0, _jquery.default)("#eventStatus"), (0, _jquery.default)("#logEntry"), _rlog.rlog.log, _rlog.rlog.getGraph.stepsVisible.length);
    window.addEventListener("resize", (0, _debounce2.default)(function (e) {
      updateGraph.resize();
    }, 250, {
      maxWait: 1000
    }));
    updateGraph.searchStringContainer((0, _jquery.default)("#search"));
    {
      var docBody = document.body;

      if (docBody) {
        layoutKeydown.addKeydown((0, _jquery.default)(docBody));
      }
    }
    {
      var cytoOpts = {
        fit: true,
        stop: function stop(evt) {
          var zoomLevel = _rlog.rlog.cyto.zoom();

          var logZoomLevel = Math.log2(zoomLevel); // zoom out twice as far

          _rlog.rlog.cyto.minZoom(Math.pow(2, logZoomLevel - 1)); // // zoom in to double the size
          // rlog.cyto.maxZoom(Math.pow(2, logZoomLevel + 3)); // zoom in

        }
      }; // start at last user mark or first idle location

      updateGraph.lastUserMark(cytoOpts) || updateGraph.nextIdle(cytoOpts);
    }
  });
});

/***/ }),

/***/ "./srcjs/layout/keydown.js":
/*!*********************************!*\
  !*** ./srcjs/layout/keydown.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/defer */ "./node_modules/lodash/defer.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js"), __webpack_require__(/*! ../graph/GraphAtStep */ "./srcjs/graph/GraphAtStep.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _jquery, _defer2, updateGraph, _GraphAtStep, _rlog) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.addKeydown = void 0;
  _jquery = _interopRequireDefault(_jquery);
  _defer2 = _interopRequireDefault(_defer2);
  updateGraph = _interopRequireWildcard(updateGraph);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // import console from "../utils/console";
  var onKeydown = function onKeydown(e) {
    // console.log("keydown: ", e);
    var target = (0, _jquery.default)(e.target).get(0);

    if (target.id && target.id === "search") {
      // is in search text box
      if (e.which === 27) {
        // esc hit. remove focus from search box
        target.blur();
      } else {// let act like normal
        // if (e.which == 13) { // enter
        // }
      }

      return;
    }

    if (e.which === 39 || e.which === 32) {
      // space, right
      if (e.altKey) {
        if (e.shiftKey) {
          // option + shift + right
          if (updateGraph.buttonNextIdle()) {
            return;
          } // if it can't go right, try a cycle

        } // option + right
        // return false if there is no more enter/exit empty marks


        if (updateGraph.buttonNextOutputCalc()) {
          return;
        } // if it cant go right, try a step

      } else if (e.shiftKey) {
        // shift + right
        updateGraph.nextTick();
        return;
      }

      if (_rlog.rlog.curTick < _rlog.rlog.getGraph.maxStep) {
        // right
        updateGraph.buttonNextStep();
        return;
      }
    }

    if (e.which === 37) {
      // left
      if (e.altKey) {
        if (e.shiftKey) {
          // option + shift + left
          if (updateGraph.buttonPrevIdle()) {
            return;
          } // if can't go left, try cycle

        } // option + left


        if (updateGraph.buttonPrevOutputCalc()) {
          return;
        } // if can't go left, try step

      } else if (e.shiftKey) {
        // shift + left
        updateGraph.prevTick();
        return;
      }

      if (_rlog.rlog.curTick > 1) {
        // left
        updateGraph.buttonPrevStep();
        return;
      }
    }

    if (e.which === 35) {
      // end
      // Seek to next mark or end
      updateGraph.buttonNextMark();
      return;
    }

    if (e.which === 36) {
      // home
      // Seek to prev mark or beginning
      updateGraph.buttonPrevMark();
      return;
    }

    if (e.which === 27) {
      // esc
      // remove hover
      // remove sticky
      //   if sicky == filter
      //     remove sticky and filter
      // remove filter
      // if (rlog.getGraph.hoverData) {
      //   console.log("reset hover");
      //   updateGraph.hoverDataReset();
      //   return;
      // }
      if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.stickyDatas)) {
        // console.log("reset sticky");
        var sd = _rlog.rlog.getGraph.stickyDatas;
        var fd = _rlog.rlog.getGraph.filterDatas;

        if ((0, _GraphAtStep.hasLength)(fd)) {
          if (sd.length === fd.length) {
            var sdReactIdStr = sd.map(function (x) {
              return x.reactId;
            }).join(", ");
            var fdReactIdStr = fd.map(function (x) {
              return x.reactId;
            }).join(", ");

            if (sdReactIdStr === fdReactIdStr) {
              // the filter data is the same as the sticky data
              // remove both
              _rlog.rlog.getGraph.resetHoverStickyFilterSearch();

              updateGraph.updateGraph(_rlog.rlog.curTick, {
                fit: true
              });
              return;
            }
          } // reset to original filter data information


          updateGraph.stickyDatas(_rlog.rlog.getGraph.filterDatas);
          return;
        } // reset sticky data


        updateGraph.stickyDatasReset();
        return;
      } else if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.filterDatas)) {
        // console.log("reset filter");
        // must be in filter... so exit filter
        updateGraph.searchRegexReset();
        return;
      }

      return;
    }

    if (e.which === 38) {
      // arrow up
      if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.filterDatas)) {// TODO-barret add filter expansion layer here
        // console.log("add layer!");
      }

      return;
    }

    if (e.which === 40) {
      // arrow down
      if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.filterDatas)) {// TODO-barret remove filter expansion layer here
        // console.log("remove layer!");
      }

      return;
    }

    if (e.which === 83) {
      // s
      (0, _defer2.default)(function () {
        (0, _jquery.default)("#search").focus();
      });
      e.stopPropagation();
      return;
    }

    if (e.which === 76) {
      // l // for Log
      var cssVal = (0, _jquery.default)("#logEntry").css("display");

      if (cssVal !== "none") {
        (0, _jquery.default)("#logEntry").css("display", "none");
      } else {
        (0, _jquery.default)("#logEntry").css("display", "inline");
      }
    }

    if (e.which === 70) {
      // f // for fit graph
      updateGraph.resize();
    }
  };

  var addKeydown = function addKeydown(jqueryContainer) {
    jqueryContainer.keydown(onKeydown);
  };

  _exports.addKeydown = addKeydown;
  var _default = onKeydown;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/layout/logEntry.js":
/*!**********************************!*\
  !*** ./srcjs/layout/logEntry.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/sortedIndex */ "./node_modules/lodash/sortedIndex.js"), __webpack_require__(/*! lodash/sortedIndexOf */ "./node_modules/lodash/sortedIndexOf.js"), __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../utils/numbers */ "./srcjs/utils/numbers.js"), __webpack_require__(/*! ../log/logStates */ "./srcjs/log/logStates.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _sortedIndex2, _sortedIndexOf2, _isNil2, _rlog, _numbers, _logStates) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setContainers = _exports.update = void 0;
  _sortedIndex2 = _interopRequireDefault(_sortedIndex2);
  _sortedIndexOf2 = _interopRequireDefault(_sortedIndexOf2);
  _isNil2 = _interopRequireDefault(_isNil2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var containers;
  var timeDecimalDigits = 4;
  var logInfo = {
    logLength: 0,
    firstTime: 0,
    lastTimeCharLength: 0,
    maxSessionCharLength: 0
  };

  var updateLogEntry = function updateLogEntry() {
    if (logInfo.logLength === 0) return;
    var curEntry = _rlog.rlog.log[_rlog.rlog.curTick];
    var timeDiff = curEntry.time - logInfo.firstTime; // milliseconds

    timeDiff = (0, _numbers.roundDecimals)(timeDiff, timeDecimalDigits).toFixed(timeDecimalDigits).padStart(logInfo.lastTimeCharLength, " ");
    containers.time.text("".concat(timeDiff, "s"));

    if (!(0, _isNil2.default)(curEntry.session)) {
      containers.session.text("".concat(curEntry.session).padEnd(logInfo.maxSessionCharLength, " "));
    } else {
      containers.session.text("(Global)".padEnd(logInfo.maxSessionCharLength, " "));
    }

    var stepDisplayValPadding = function stepDisplayValPadding(i) {
      return "".concat(i).padStart("".concat(logInfo.logLength).length, " ");
    };

    var stepDisplayVal = (0, _sortedIndex2.default)(_rlog.rlog.getGraph.stepsVisible, curEntry.step);

    if ((0, _sortedIndexOf2.default)(_rlog.rlog.getGraph.stepsVisible, curEntry.step) === -1) {
      // does not contain the step. display how many steps advanced from last visible step
      if (stepDisplayVal === 0) {
        // occurs before any visible step
        // let halfStepPos = _sortedIndex(rlog.getGraph.steps, curEntry.step);
        stepDisplayVal = "".concat(stepDisplayValPadding(0), "_").concat(curEntry.step);
      } else {
        // get visible step location
        var smallerStepVal = _rlog.rlog.getGraph.stepsVisible[stepDisplayVal - 1];
        var smallerStepValVisible = (0, _sortedIndex2.default)(_rlog.rlog.getGraph.stepsVisible, smallerStepVal);
        var smallerPos = (0, _sortedIndex2.default)(_rlog.rlog.getGraph.steps, smallerStepVal);
        var halfStepPos = (0, _sortedIndex2.default)(_rlog.rlog.getGraph.steps, curEntry.step); // display number of steps away from lower, visible step

        var diffSteps = halfStepPos - smallerPos;
        stepDisplayVal = "".concat(stepDisplayValPadding(smallerStepValVisible + 1), "_").concat(diffSteps);
      }
    } else {
      // 1 start counting (not 0)
      stepDisplayVal = stepDisplayValPadding(stepDisplayVal + 1);
    }

    containers.step.text("".concat(stepDisplayVal));
    containers.status.html(statusForEntry(curEntry));
    containers.container.text(JSON.stringify(_rlog.rlog.log[_rlog.rlog.curTick], null, "  "));
  };

  _exports.update = updateLogEntry;

  var setContainers = function setContainers(time, session, step, status, container, log, maxVisibleStep) {
    var logInfoLength = log.length;
    var maxSessionCharLength = 0;
    var logEntry, sessionCharLength; // find largest session name length

    for (var i = 0; i < logInfoLength; i++) {
      logEntry = log[i];

      if (!(0, _isNil2.default)(logEntry.session)) {
        sessionCharLength = logEntry.session.length;

        if (sessionCharLength > maxSessionCharLength) {
          maxSessionCharLength = sessionCharLength;
        }
      }
    }

    logInfo = {
      logLength: maxVisibleStep,
      firstTime: log[_rlog.rlog.getGraph.stepsVisible[0]].time,
      maxSessionCharLength: maxSessionCharLength,
      lastTimeCharLength: (log[logInfoLength - 1].time - log[_rlog.rlog.getGraph.stepsVisible[0]].time).toFixed(timeDecimalDigits).length
    };
    containers = {
      time: time,
      session: session,
      step: step,
      status: status,
      container: container
    };
  };

  _exports.setContainers = setContainers;

  var getLabel = function getLabel(reactId) {
    var node = _rlog.rlog.graph.nodes.get(reactId);

    if (node) {
      return node.label;
    } else {
      return "<unknown>";
    }
  };

  var getReactIdLabel = function getReactIdLabel(entry) {
    return getLabel(entry.reactId);
  };

  var getReactIdValue = function getReactIdValue(entry) {
    var node = _rlog.rlog.graph.nodes.get(entry.reactId);

    if (node) {
      if (!(0, _isNil2.default)(node.value)) {
        return node.value;
      }
    }

    return "<unknown>";
  };

  var getContextId = function getContextId(entry) {
    return entry.ctxId;
  };

  var monospaced = function monospaced(txt) {
    return "<span class=\"monospaced\">".concat(txt, "</span>");
  };

  var statusForEntry = function statusForEntry(entry) {
    switch (entry.action) {
      case _logStates.LogStates.createContext:
        {
          var contextEntry = entry;
          return "Create Context: ".concat(monospaced(getContextId(contextEntry)));
        }

      case _logStates.LogStates.asyncStart:
        {
          return "Start asynchronous calculations";
        }

      case _logStates.LogStates.asyncStop:
        {
          return "Start asynchronous calculations";
        }

      case _logStates.LogStates.define:
        {
          var defineEntry = entry;
          return "Defined ".concat(monospaced(getReactIdLabel(defineEntry)));
        }

      case _logStates.LogStates.dependsOn:
        {
          var dependsOnEntry = entry;
          return "".concat(monospaced(getReactIdLabel(dependsOnEntry)), " depends on ").concat(monospaced(getLabel(dependsOnEntry.depOnReactId)));
        }

      case _logStates.LogStates.dependsOnRemove:
        {
          var dependsOnRemoveEntry = entry;
          return "".concat(monospaced(getReactIdLabel(dependsOnRemoveEntry)), " removes dependency on ").concat(monospaced(getLabel(dependsOnRemoveEntry.depOnReactId)));
        }

      case _logStates.LogStates.enter:
        {
          var enterEntry = entry;
          return "".concat(monospaced(getReactIdLabel(enterEntry)), " started calculating");
        }

      case _logStates.LogStates.exit:
        {
          var exitEntry = entry;
          return "".concat(monospaced(getReactIdLabel(exitEntry)), " stopped calculating");
        }

      case _logStates.LogStates.freeze:
        {
          var frozenEntry = entry;
          return "".concat(monospaced(getReactIdLabel(frozenEntry)), " froze");
        }

      case _logStates.LogStates.invalidateLater:
        {
          var invalidateLaterEntry = entry;
          return "".concat(monospaced(getReactIdLabel(invalidateLaterEntry)), " will invalidate in ").concat(monospaced(invalidateLaterEntry.millis), "ms");
        }

      case _logStates.LogStates.invalidateEnd:
        {
          var invalidateEndEntry = entry;
          return "".concat(monospaced(getReactIdLabel(invalidateEndEntry)), " has invalidated");
        }

      case _logStates.LogStates.invalidateStart:
        {
          var invalidateStartEntry = entry;
          return "".concat(monospaced(getReactIdLabel(invalidateStartEntry)), " is invalidating");
        }

      case _logStates.LogStates.isolateEnter:
        {
          var isolateEnterEntry = entry;
          return "".concat(monospaced(getReactIdLabel(isolateEnterEntry)), " is isolating future dependencies");
        }

      case _logStates.LogStates.isolateExit:
        {
          var isolateExitEntry = entry;
          return "".concat(monospaced(getReactIdLabel(isolateExitEntry)), " stopped isolating future dependencies");
        }

      case _logStates.LogStates.isolateInvalidateEnd:
        {
          var isolateInvalidateEndEntry = entry;
          return "".concat(monospaced(getReactIdLabel(isolateInvalidateEndEntry)), " invalidated during an isolate call");
        }

      case _logStates.LogStates.isolateInvalidateStart:
        {
          var isolateInvalidateStartEntry = entry;
          return "".concat(monospaced(getReactIdLabel(isolateInvalidateStartEntry)), " is invalidating during an isolate call");
        }

      case _logStates.LogStates.userMark:
        {
          return "User marked step";
        }

      case _logStates.LogStates.idle:
        {
          return "Shiny App idle";
        }

      case _logStates.LogStates.thaw:
        {
          var thawEntry = entry;
          return "".concat(monospaced(getReactIdLabel(thawEntry)), " has thawed");
        }

      case _logStates.LogStates.updateNodeLabel:
        {
          var updateNodeLabelEntry = entry;
          return "Set label to ".concat(monospaced(getReactIdLabel(updateNodeLabelEntry)));
        }

      case _logStates.LogStates.valueChange:
        {
          var valueChangeEntry = entry;
          return "".concat(monospaced(getReactIdLabel(valueChangeEntry)), " has a new value: ").concat(monospaced(getReactIdValue(valueChangeEntry)));
        }

      default:
        throw "state: ".concat(monospaced(entry.action), " not implemented for log status");
    }
  };
});

/***/ }),

/***/ "./srcjs/layout/progressBar.js":
/*!*************************************!*\
  !*** ./srcjs/layout/progressBar.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/has */ "./node_modules/lodash/has.js"), __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/sortedIndex */ "./node_modules/lodash/sortedIndex.js"), __webpack_require__(/*! lodash/sortedIndexOf */ "./node_modules/lodash/sortedIndexOf.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js"), __webpack_require__(/*! ../style/colors */ "./srcjs/style/colors.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _has2, _jquery, _sortedIndex2, _sortedIndexOf2, _rlog, _updateGraph, _colors) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.timelinePadding = _exports.setContainers = _exports.addTimelineTicks = _exports.update = void 0;
  _has2 = _interopRequireDefault(_has2);
  _jquery = _interopRequireDefault(_jquery);
  _sortedIndex2 = _interopRequireDefault(_sortedIndex2);
  _sortedIndexOf2 = _interopRequireDefault(_sortedIndexOf2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var fillContainer;

  var updateProgressBar = function updateProgressBar() {
    // fillContainer.width((rlog.curTick / rlog.log.length) * 100 + "%");
    var stepsToPresent = _rlog.rlog.getGraph.stepsVisible;
    var tickPos = (0, _sortedIndexOf2.default)(stepsToPresent, _rlog.rlog.curTick);

    if (tickPos === -1) {
      tickPos = (0, _sortedIndex2.default)(stepsToPresent, _rlog.rlog.curTick) - 1;
    } // console.log("progress bar: ", tickPos, stepsToPresent.length, tickPos / stepsToPresent.length, rlog.curTick, stepsToPresent)


    fillContainer.width("".concat(tickPos / (stepsToPresent.length - 1) * 100, "%"));
  };

  _exports.update = updateProgressBar;

  var setContainers = function setContainers(fullContainerVal, fillContainerVal) {
    fillContainerVal.css("background-color", _colors.colors.progressBar.progress);
    fillContainerVal.css("top", "".concat(timelinePadding, "px"));
    fillContainerVal.css("bottom", "".concat(timelinePadding, "px"));
    fillContainer = fillContainerVal;
    fullContainerVal.css("height", "".concat(timelineHeight, "px"));
    fullContainerVal.css("min-height", "".concat(timelineHeight, "px"));
    fullContainerVal.css("background-color", _colors.colors.progressBar.background);
    fullContainerVal.on("mousedown mousemove", updateFromProgressBar);
  };

  _exports.setContainers = setContainers;

  var updateFromProgressBar = function updateFromProgressBar(e) {
    // Make sure left mouse button is down.
    // Firefox is stupid; e.which is always 1 on mousemove events,
    // even when button is not down!! So read e.originalEvent.buttons.
    if (!(0, _has2.default)(e.originalEvent, "buttons")) {
      // odd type casting as jquery doesn't believe this exists
      var originalEvent = e.originalEvent;
      if (originalEvent.buttons !== 1) return;
    } // return if not left click


    if (e.which !== 1) {
      return;
    }

    var timeline = (0, _jquery.default)(e.currentTarget)[0];
    var pos = e.pageX; // pageX in pixels  // || e.originalEvent.pageX;

    var width = timeline.offsetWidth; // width in pixels

    var stepsToPresent = _rlog.rlog.getGraph.stepsVisible;
    var targetStepPos = Math.min(Math.max(Math.round(pos / width * stepsToPresent.length), 0), stepsToPresent.length - 1);
    var targetStep = stepsToPresent[targetStepPos];

    if (targetStep !== _rlog.rlog.curTick) {
      (0, _updateGraph.updateGraph)(targetStep);
    }

    return;
  };

  var addTimelineTicks = function addTimelineTicks(jqueryContainer, backgroundColor, stepArr) {
    var top = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var visibleSteps = _rlog.rlog.getGraph.stepsVisible;
    var visibleStepLengthMinusOne = visibleSteps.length - 1;
    var topValue = top === 0 ? "top: 0; height: ".concat(timelineHeight, "px;") : "top: ".concat(top, "px; height: ").concat(timelineHeight - 2 * top, "px");
    stepArr.map(function (step) {
      var stepPos = (0, _sortedIndex2.default)(visibleSteps, step); // add an extra step to show that it is completed
      // i = i + 1;

      var left = 100 * stepPos / visibleStepLengthMinusOne;
      var width = 100 * 1 / visibleStepLengthMinusOne * 0.75;
      jqueryContainer.append("<div class=\"timeline-tick\" style=\"background-color: ".concat(backgroundColor, "; left: ").concat(left, "%; width: ").concat(width, "%; margin-left: -").concat(width, "%; ").concat(topValue, "\"></div>"));
    });
  };

  _exports.addTimelineTicks = addTimelineTicks;
  var timelineHeight = 20;
  var timelinePadding = 3;
  _exports.timelinePadding = timelinePadding;
});

/***/ }),

/***/ "./srcjs/log/initStep.js":
/*!*******************************!*\
  !*** ./srcjs/log/initStep.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! lodash/map */ "./node_modules/lodash/map.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_map2) {
  "use strict";

  _map2 = _interopRequireDefault(_map2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // initialize all log entries to have a step value
  if (window.__APP_DATA__) {
    window.log = window.__APP_DATA__;
  }

  (0, _map2.default)(window.log, function (entry, i) {
    entry.step = i;
  });
});

/***/ }),

/***/ "./srcjs/log/logStates.js":
/*!********************************!*\
  !*** ./srcjs/log/logStates.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LogStates = void 0;
  var states = {
    asyncStart: "asyncStart",
    asyncStop: "asyncStop",
    createContext: "createContext",
    define: "define",
    dependsOn: "dependsOn",
    dependsOnRemove: "dependsOnRemove",
    enter: "enter",
    exit: "exit",
    freeze: "freeze",
    invalidateEnd: "invalidateEnd",
    invalidateStart: "invalidateStart",
    invalidateLater: "invalidateLater",
    isolateEnter: "isolateEnter",
    isolateExit: "isolateExit",
    isolateInvalidateEnd: "isolateInvalidateEnd",
    isolateInvalidateStart: "isolateInvalidateStart",
    userMark: "userMark",
    idle: "idle",
    thaw: "thaw",
    updateNodeLabel: "updateNodeLabel",
    valueChange: "valueChange"
  };
  _exports.LogStates = states;
});

/***/ }),

/***/ "./srcjs/rlog.js":
/*!***********************!*\
  !*** ./srcjs/rlog.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! cytoscape */ "./node_modules/cytoscape/dist/cytoscape.cjs.js"), __webpack_require__(/*! lodash/isNil */ "./node_modules/lodash/isNil.js"), __webpack_require__(/*! ./graph/Graph */ "./srcjs/graph/Graph.js"), __webpack_require__(/*! ./graph/GraphAtStep */ "./srcjs/graph/GraphAtStep.js"), __webpack_require__(/*! ./updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _cytoscape, _isNil2, _Graph, _GraphAtStep, updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rlog = void 0;
  _cytoscape = _interopRequireDefault(_cytoscape);
  _isNil2 = _interopRequireDefault(_isNil2);
  updateGraph = _interopRequireWildcard(updateGraph);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // flowlint-line untyped-import:off
  // TODO-barret change to individual exports
  var ret = {
    log: [],
    cyto: (0, _cytoscape.default)(),
    getGraph: new _GraphAtStep.GraphAtStep([]),
    graph: new _Graph.Graph([]),
    curTick: 1,
    updateGraph: updateGraph,
    barret: null,
    displayTimeOnNodes: // is not `false`
    window.__APP_TIME__ === true || (0, _isNil2.default)(window.__APP_TIME__)
  };
  _exports.rlog = ret;
});

/***/ }),

/***/ "./srcjs/style/colors.js":
/*!*******************************!*\
  !*** ./srcjs/style/colors.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.colors = void 0;
  var colors = {
    // robby colors
    progressBar: {
      background: "#f0f0f0",
      progress: "#8e8e8e",
      userMark: "#666666",
      // matches right/left stop buttons
      idle: "#a3c586"
    },
    nodes: {
      label_text_color: "#606060",
      label_text_opacity: 1,
      label_background_color: "white",
      label_background_opacity: 0.8,
      invalidating: "#969696",
      invalidated: "#d9d9d9",
      calculating: "#fcbf49",
      ready: "#a3c586"
    },
    // end robby colors
    // regular colors
    regular: {
      white: "#ffffff",
      black: "#000000",
      // http://colorbrewer2.org/#type=sequential&scheme=YlGn&n=4
      // #2-4
      green1: "#f7fcb9",
      // ready
      green2: "#78c679",
      // enter
      green3: "#238443",
      // active enter
      greenLite: "#b2df8a",
      // green from http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=8
      // http://colorbrewer2.org/#type=qualitative&scheme=Set1&n=9
      red: "#e41a1c",
      // valueChange
      blue: "#377eb8",
      // frozen
      green: "#4daf4a",
      // enter
      purple: "#984ea3",
      //
      purpleLite: "#f191ff",
      //
      orange: "#ff7f00",
      //
      yellow: "#ffff33",
      //
      brown: "#a65628",
      //
      pink: "#f781bf",
      //
      grey: "#999999",
      // invalidate
      // http://colorbrewer2.org/#type=sequential&scheme=Greys&n=9
      grey1: "#d9d9d9",
      // invalidate
      grey2: "#969696",
      // active invalidate
      grey3: "#737373" // active invalidate

    },
    edges: {
      running: "#676767",
      isolate: "#818181",
      active: "#818181",
      inactive: "#ececec"
    },
    ghostEdges: {
      default: "#3c3b39"
    },
    frozen: {
      default: "#2171b5"
    },
    // filtered colors
    lite: {
      white: "#ffffff",
      black: "#b2b2b2",
      // personal attempt
      // http://colorbrewer2.org/#type=sequential&scheme=YlGn&n=9
      // #1-3
      green1: "#ffffe5",
      green2: "#f7fcb9",
      green3: "#d9f0a3",
      greenLite: "#d6eec0",
      // personal attempt
      // http://colorbrewer2.org/#type=qualitative&scheme=Pastel1&n=9
      red: "#fbb4ae",
      blue: "#b3cde3",
      green: "#ccebc5",
      purple: "#decbe4",
      orange: "#fed9a6",
      yellow: "#ffffcc",
      brown: "#e5d8bd",
      pink: "#fddaec",
      grey: "#f2f2f2"
    }
  };
  _exports.colors = colors;
  var _default = colors;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/updateGraph/atTick.js":
/*!*************************************!*\
  !*** ./srcjs/updateGraph/atTick.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../layout/logEntry */ "./srcjs/layout/logEntry.js"), __webpack_require__(/*! ../layout/progressBar */ "./srcjs/layout/progressBar.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _rlog, logEntry, progressBar) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.atTick = void 0;
  logEntry = _interopRequireWildcard(logEntry);
  progressBar = _interopRequireWildcard(progressBar);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  var atTick = function atTick() {
    var nextTick = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _rlog.rlog.curTick;
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _rlog.rlog.curTick = nextTick;

    _rlog.rlog.getGraph.displayAtStep(nextTick, _rlog.rlog.cyto, cytoOptions);

    progressBar.update();
    logEntry.update();
    return true;
  };

  _exports.atTick = atTick;
});

/***/ }),

/***/ "./srcjs/updateGraph/buttons.js":
/*!**************************************!*\
  !*** ./srcjs/updateGraph/buttons.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./outputCalc */ "./srcjs/updateGraph/outputCalc.js"), __webpack_require__(/*! ./step */ "./srcjs/updateGraph/step.js"), __webpack_require__(/*! ./userMarks */ "./srcjs/updateGraph/userMarks.js"), __webpack_require__(/*! ./idle */ "./srcjs/updateGraph/idle.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, outputCalc, step, userMarks, idle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.buttonNextStep = _exports.buttonPrevStep = _exports.buttonNextOutputCalc = _exports.buttonPrevOutputCalc = _exports.buttonNextIdle = _exports.buttonPrevIdle = _exports.buttonNextMark = _exports.buttonPrevMark = void 0;
  outputCalc = _interopRequireWildcard(outputCalc);
  step = _interopRequireWildcard(step);
  userMarks = _interopRequireWildcard(userMarks);
  idle = _interopRequireWildcard(idle);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  var buttonPrevMark = function buttonPrevMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return userMarks.prevUserMark() || step.firstStep();
  };

  _exports.buttonPrevMark = buttonPrevMark;

  var buttonNextMark = function buttonNextMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return userMarks.nextUserMark() || step.lastStep();
  };

  _exports.buttonNextMark = buttonNextMark;

  var buttonPrevIdle = function buttonPrevIdle() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return idle.prevIdle() || step.firstStep();
  };

  _exports.buttonPrevIdle = buttonPrevIdle;

  var buttonNextIdle = function buttonNextIdle() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return idle.nextIdle() || step.lastStep();
  };

  _exports.buttonNextIdle = buttonNextIdle;

  var buttonPrevOutputCalc = function buttonPrevOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return outputCalc.prevOutputCalc() || step.firstStep();
  };

  _exports.buttonPrevOutputCalc = buttonPrevOutputCalc;

  var buttonNextOutputCalc = function buttonNextOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return outputCalc.nextOutputCalc() || step.lastStep();
  };

  _exports.buttonNextOutputCalc = buttonNextOutputCalc;

  var buttonPrevStep = function buttonPrevStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return step.prevStep(cytoOptions) || step.firstStep();
  };

  _exports.buttonPrevStep = buttonPrevStep;

  var buttonNextStep = function buttonNextStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return step.nextStep(cytoOptions) || step.lastStep();
  };

  _exports.buttonNextStep = buttonNextStep;
});

/***/ }),

/***/ "./srcjs/updateGraph/hoverStickyFilterSearch.js":
/*!******************************************************!*\
  !*** ./srcjs/updateGraph/hoverStickyFilterSearch.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! lodash/assign */ "./node_modules/lodash/assign.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _jquery, _assign2, _rlog, _updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.resetHoverStickyFilterData = _exports.searchRegexReset = _exports.searchRegex = _exports.filterDatasReset = _exports.filterDatas = _exports.stickyDatasReset = _exports.stickyDatas = _exports.hoverDataReset = _exports.hoverData = void 0;
  _jquery = _interopRequireDefault(_jquery);
  _assign2 = _interopRequireDefault(_assign2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var hoverData = function hoverData(data) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _rlog.rlog.getGraph.updateHoverData(data);

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, cytoOptions);
  };

  _exports.hoverData = hoverData;

  var hoverDataReset = function hoverDataReset() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _rlog.rlog.getGraph.updateHoverDataReset();

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, cytoOptions);
  };

  _exports.hoverDataReset = hoverDataReset;

  var stickyDatas = function stickyDatas(datas) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _rlog.rlog.getGraph.updateStickyDatas(datas);

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, cytoOptions);
  };

  _exports.stickyDatas = stickyDatas;

  var stickyDatasReset = function stickyDatasReset() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _rlog.rlog.getGraph.updateStickyDatasReset();

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, cytoOptions);
  };

  _exports.stickyDatasReset = stickyDatasReset;

  var filterDatas = function filterDatas(datas) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _rlog.rlog.getGraph.updateFilterDatas(datas);

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, (0, _assign2.default)({
      fit: true
    }, cytoOptions));
  };

  _exports.filterDatas = filterDatas;

  var filterDatasReset = function filterDatasReset() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _rlog.rlog.getGraph.updateFilterDatasReset();

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, (0, _assign2.default)({
      fit: true
    }, cytoOptions));
  };

  _exports.filterDatasReset = filterDatasReset;

  var searchRegex = function searchRegex(_searchRegex) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _rlog.rlog.getGraph.updateSearchRegex(_searchRegex);

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, (0, _assign2.default)({
      fit: true
    }, cytoOptions));
  };

  _exports.searchRegex = searchRegex;

  var searchRegexReset = function searchRegexReset() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _jquery.default)("#search").val("");

    _rlog.rlog.getGraph.updateSearchRegexReset();

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, (0, _assign2.default)({
      fit: true
    }, cytoOptions));
  };

  _exports.searchRegexReset = searchRegexReset;

  var resetHoverStickyFilterData = function resetHoverStickyFilterData() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _rlog.rlog.getGraph.resetHoverStickyFilterSearch();

    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick, (0, _assign2.default)({
      fit: true
    }, cytoOptions));
  };

  _exports.resetHoverStickyFilterData = resetHoverStickyFilterData;
});

/***/ }),

/***/ "./srcjs/updateGraph/idle.js":
/*!***********************************!*\
  !*** ./srcjs/updateGraph/idle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js"), __webpack_require__(/*! ./outputCalc */ "./srcjs/updateGraph/outputCalc.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _rlog, _updateGraph, _outputCalc) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.firstIdle = _exports.lastIdle = _exports.prevIdle = _exports.nextIdle = void 0;

  var nextIdle = function nextIdle() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _outputCalc.nextStepInArr)(_rlog.rlog.getGraph.stepsIdle, cytoOptions);
  };

  _exports.nextIdle = nextIdle;

  var prevIdle = function prevIdle() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _outputCalc.prevStepInArr)(_rlog.rlog.getGraph.stepsIdle, cytoOptions);
  };

  _exports.prevIdle = prevIdle;

  var lastIdle = function lastIdle() {
    var nextTick = _rlog.rlog.getGraph.stepsIdle.length > 0 ? _rlog.rlog.getGraph.stepsIdle[_rlog.rlog.getGraph.stepsIdle.length - 1] : _rlog.rlog.log.length - 1;
    return (0, _updateGraph.updateGraph)(nextTick);
  };

  _exports.lastIdle = lastIdle;

  var firstIdle = function firstIdle() {
    var nextTick = _rlog.rlog.getGraph.stepsIdle.length > 0 ? _rlog.rlog.getGraph.stepsIdle[0] : 0;
    return (0, _updateGraph.updateGraph)(nextTick);
  };

  _exports.firstIdle = firstIdle;
});

/***/ }),

/***/ "./srcjs/updateGraph/index.js":
/*!************************************!*\
  !*** ./srcjs/updateGraph/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./atTick */ "./srcjs/updateGraph/atTick.js"), __webpack_require__(/*! ./outputCalc */ "./srcjs/updateGraph/outputCalc.js"), __webpack_require__(/*! ./idle */ "./srcjs/updateGraph/idle.js"), __webpack_require__(/*! ./step */ "./srcjs/updateGraph/step.js"), __webpack_require__(/*! ./tick */ "./srcjs/updateGraph/tick.js"), __webpack_require__(/*! ./searchString */ "./srcjs/updateGraph/searchString.js"), __webpack_require__(/*! ./hoverStickyFilterSearch */ "./srcjs/updateGraph/hoverStickyFilterSearch.js"), __webpack_require__(/*! ./userMarks */ "./srcjs/updateGraph/userMarks.js"), __webpack_require__(/*! ./buttons */ "./srcjs/updateGraph/buttons.js"), __webpack_require__(/*! ./resize */ "./srcjs/updateGraph/resize.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _atTick, _outputCalc, _idle, _step, _tick, _searchString, _hoverStickyFilterSearch, _userMarks, _buttons, _resize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    atTick: true,
    updateGraph: true,
    nextOutputCalc: true,
    prevOutputCalc: true,
    firstOutputCalc: true,
    lastOutputCalc: true
  };
  Object.defineProperty(_exports, "atTick", {
    enumerable: true,
    get: function get() {
      return _atTick.atTick;
    }
  });
  Object.defineProperty(_exports, "updateGraph", {
    enumerable: true,
    get: function get() {
      return _atTick.atTick;
    }
  });
  Object.defineProperty(_exports, "nextOutputCalc", {
    enumerable: true,
    get: function get() {
      return _outputCalc.nextOutputCalc;
    }
  });
  Object.defineProperty(_exports, "prevOutputCalc", {
    enumerable: true,
    get: function get() {
      return _outputCalc.prevOutputCalc;
    }
  });
  Object.defineProperty(_exports, "firstOutputCalc", {
    enumerable: true,
    get: function get() {
      return _outputCalc.firstOutputCalc;
    }
  });
  Object.defineProperty(_exports, "lastOutputCalc", {
    enumerable: true,
    get: function get() {
      return _outputCalc.lastOutputCalc;
    }
  });
  Object.keys(_idle).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _idle[key];
      }
    });
  });
  Object.keys(_step).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _step[key];
      }
    });
  });
  Object.keys(_tick).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _tick[key];
      }
    });
  });
  Object.keys(_searchString).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _searchString[key];
      }
    });
  });
  Object.keys(_hoverStickyFilterSearch).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _hoverStickyFilterSearch[key];
      }
    });
  });
  Object.keys(_userMarks).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _userMarks[key];
      }
    });
  });
  Object.keys(_buttons).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _buttons[key];
      }
    });
  });
  Object.keys(_resize).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _resize[key];
      }
    });
  });
});

/***/ }),

/***/ "./srcjs/updateGraph/outputCalc.js":
/*!*****************************************!*\
  !*** ./srcjs/updateGraph/outputCalc.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/sortedIndexOf */ "./node_modules/lodash/sortedIndexOf.js"), __webpack_require__(/*! lodash/sortedIndex */ "./node_modules/lodash/sortedIndex.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _sortedIndexOf2, _sortedIndex2, _rlog, _updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.prevStepInArr = _exports.nextStepInArr = _exports.lastOutputCalc = _exports.firstOutputCalc = _exports.prevOutputCalc = _exports.nextOutputCalc = void 0;
  _sortedIndexOf2 = _interopRequireDefault(_sortedIndexOf2);
  _sortedIndex2 = _interopRequireDefault(_sortedIndex2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var nextStepInArr = function nextStepInArr(arr) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var nextTick;

    if ((0, _sortedIndexOf2.default)(arr, _rlog.rlog.curTick) !== -1) {
      // at arr point, move the tick one ahead
      nextTick = _rlog.rlog.getGraph.nextStep(_rlog.rlog.curTick);
    } else {
      // not at arr point,
      nextTick = _rlog.rlog.curTick;
    } // get next tick idx


    var nextTickIdx = (0, _sortedIndex2.default)(arr, nextTick);
    var i, arrStep;

    for (i = nextTickIdx; i < arr.length; i++) {
      arrStep = arr[i];

      if ((0, _sortedIndexOf2.default)(_rlog.rlog.getGraph.filteredStepsVisible, arrStep) >= 0) {
        (0, _updateGraph.updateGraph)(arrStep, cytoOptions);
        return true;
      }
    }

    return false;
  };

  _exports.nextStepInArr = nextStepInArr;

  var prevStepInArr = function prevStepInArr(arr) {
    var cytoOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var prevTick;

    if ((0, _sortedIndexOf2.default)(arr, _rlog.rlog.curTick) !== -1) {
      // at arr point, move the tick one back
      prevTick = _rlog.rlog.getGraph.prevStep(_rlog.rlog.curTick);
    } else {
      // not at arr point,
      prevTick = _rlog.rlog.curTick;
    } // get next tick idx


    var prevTickIdx = (0, _sortedIndex2.default)(arr, prevTick) - 1;
    if (prevTickIdx < 0) return false;
    var i, arrStep;

    for (i = prevTickIdx; i >= 0; i--) {
      arrStep = arr[i];

      if ((0, _sortedIndexOf2.default)(_rlog.rlog.getGraph.filteredStepsVisible, arrStep) >= 0) {
        (0, _updateGraph.updateGraph)(arrStep, cytoOptions);
        return true;
      }
    }

    return false;
  };

  _exports.prevStepInArr = prevStepInArr;

  var nextOutputCalc = function nextOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return nextStepInArr(_rlog.rlog.getGraph.stepsOutputCalc, cytoOptions);
  };

  _exports.nextOutputCalc = nextOutputCalc;

  var prevOutputCalc = function prevOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return prevStepInArr(_rlog.rlog.getGraph.stepsOutputCalc, cytoOptions);
  };

  _exports.prevOutputCalc = prevOutputCalc;

  var lastOutputCalc = function lastOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nextTick = _rlog.rlog.getGraph.stepsOutputCalc[_rlog.rlog.getGraph.stepsOutputCalc.length - 1] || 0;
    return (0, _updateGraph.updateGraph)(nextTick, cytoOptions);
  };

  _exports.lastOutputCalc = lastOutputCalc;

  var firstOutputCalc = function firstOutputCalc() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nextTick = _rlog.rlog.getGraph.stepsOutputCalc[0] || 0;
    return (0, _updateGraph.updateGraph)(nextTick, cytoOptions);
  };

  _exports.firstOutputCalc = firstOutputCalc;
});

/***/ }),

/***/ "./srcjs/updateGraph/resize.js":
/*!*************************************!*\
  !*** ./srcjs/updateGraph/resize.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ./atTick */ "./srcjs/updateGraph/atTick.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _rlog, _atTick) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.resize = void 0;

  var resize = function resize() {
    // tell cytoscape to update it's layout bounds
    _rlog.rlog.cyto.resize(); // force a redraw


    (0, _atTick.atTick)(_rlog.rlog.curTick, {
      fit: true,
      forceRedraw: true
    });
  };

  _exports.resize = resize;
});

/***/ }),

/***/ "./srcjs/updateGraph/searchString.js":
/*!*******************************************!*\
  !*** ./srcjs/updateGraph/searchString.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! ./hoverStickyFilterSearch */ "./srcjs/updateGraph/hoverStickyFilterSearch.js"), __webpack_require__(/*! ../graph/Node */ "./srcjs/graph/Node.js"), __webpack_require__(/*! ../graph/Edge */ "./srcjs/graph/Edge.js"), __webpack_require__(/*! ../graph/GhostEdge */ "./srcjs/graph/GhostEdge.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _jquery, updateGraph, _Node, _Edge, _GhostEdge) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.searchStringWithData = _exports.searchStringContainer = _exports.searchStringClearNoUpdate = _exports.searchStringClear = _exports.searchStringSet = _exports.searchStringWith = void 0;
  _jquery = _interopRequireDefault(_jquery);
  updateGraph = _interopRequireWildcard(updateGraph);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // import console from "../utils/console";
  var searchElement; // when str length < 3 do not search
  // when str length = 0, reset filter
  // when str length >= 3, set filter to all elements that match

  var searchStringWith = function searchStringWith(str) {
    // if less than three chars...
    if (str.length < 3) {
      if (str.length === 0) {
        // TODO-barret show warning of resetting
        // console.log("resetting log!");
        return updateGraph.searchRegexReset();
      } else {
        // TODO-barret show warning of not enough characters
        // console.log("do nothing");
        return false;
      }
    } // escape the string
    // https://stackoverflow.com/a/17606289


    var escapeRegExp = function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    };

    var searchRegex = new RegExp(escapeRegExp(str));
    return updateGraph.searchRegex(searchRegex);
  };

  _exports.searchStringWith = searchStringWith;

  var searchStringSet = function searchStringSet(str) {
    searchElement.val(str);
    return searchStringWith(str);
  };

  _exports.searchStringSet = searchStringSet;

  var searchStringClear = function searchStringClear() {
    return searchStringSet("");
  };

  _exports.searchStringClear = searchStringClear;

  var searchStringClearNoUpdate = function searchStringClearNoUpdate() {
    searchElement.val("");
  };

  _exports.searchStringClearNoUpdate = searchStringClearNoUpdate;

  var searchStringWithData = function searchStringWithData(obj) {
    // update the graph by searching for the key
    if (obj instanceof _Edge.Edge) {
      return searchStringSet(obj.ghostKey);
    }

    return searchStringSet(obj.key);
  };

  _exports.searchStringWithData = searchStringWithData;

  var searchStringContainer = function searchStringContainer(searchElement_) {
    searchElement = searchElement_;
    searchElement.on("input", function (e) {
      searchStringWith((0, _jquery.default)(e.target).val().toString());
    });
  };

  _exports.searchStringContainer = searchStringContainer;
});

/***/ }),

/***/ "./srcjs/updateGraph/step.js":
/*!***********************************!*\
  !*** ./srcjs/updateGraph/step.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _rlog, _updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.lastStep = _exports.firstStep = _exports.prevStep = _exports.nextStep = void 0;

  var nextStep = function nextStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var nextTick = _rlog.rlog.getGraph.nextStep(_rlog.rlog.curTick);

    if (nextTick === -1) return false;
    return (0, _updateGraph.updateGraph)(nextTick, cytoOptions);
  };

  _exports.nextStep = nextStep;

  var prevStep = function prevStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var prevTick = _rlog.rlog.getGraph.prevStep(_rlog.rlog.curTick);

    if (prevTick === -1) return false;
    return (0, _updateGraph.updateGraph)(prevTick, cytoOptions);
  };

  _exports.prevStep = prevStep;

  var firstStep = function firstStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _updateGraph.updateGraph)(_rlog.rlog.getGraph.stepsVisible[0], cytoOptions);
  };

  _exports.firstStep = firstStep;

  var lastStep = function lastStep() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (0, _updateGraph.updateGraph)(_rlog.rlog.getGraph.stepsVisible[_rlog.rlog.getGraph.stepsVisible.length - 1], cytoOptions);
  };

  _exports.lastStep = lastStep;
});

/***/ }),

/***/ "./srcjs/updateGraph/tick.js":
/*!***********************************!*\
  !*** ./srcjs/updateGraph/tick.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _rlog, _updateGraph) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.prevTick = _exports.nextTick = void 0;

  var nextTick = function nextTick() {
    if (_rlog.rlog.curTick >= _rlog.rlog.log.length) return false;
    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick + 1);
  };

  _exports.nextTick = nextTick;

  var prevTick = function prevTick() {
    if (_rlog.rlog.curTick <= 0) return false;
    return (0, _updateGraph.updateGraph)(_rlog.rlog.curTick - 1);
  };

  _exports.prevTick = prevTick;
});

/***/ }),

/***/ "./srcjs/updateGraph/userMarks.js":
/*!****************************************!*\
  !*** ./srcjs/updateGraph/userMarks.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/sortedIndexOf */ "./node_modules/lodash/sortedIndexOf.js"), __webpack_require__(/*! ../rlog */ "./srcjs/rlog.js"), __webpack_require__(/*! ../updateGraph */ "./srcjs/updateGraph/index.js"), __webpack_require__(/*! ../graph/GraphAtStep */ "./srcjs/graph/GraphAtStep.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _sortedIndexOf2, _rlog, _updateGraph, _GraphAtStep) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.lastUserMark = _exports.firstUserMark = _exports.prevUserMark = _exports.nextUserMark = void 0;
  _sortedIndexOf2 = _interopRequireDefault(_sortedIndexOf2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var nextUserMark = function nextUserMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nextTick;

    if ((0, _sortedIndexOf2.default)(_rlog.rlog.getGraph.stepsUserMark, _rlog.rlog.curTick) !== -1) {
      // not at a user mark
      if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.filterDatas)) {
        // if filtered, will go to previous step, then next step location
        nextTick = _rlog.rlog.getGraph.nextStep(_rlog.rlog.getGraph.prevStep(_rlog.rlog.curTick));
      } else {
        // if not filtered
        nextTick = _rlog.rlog.curTick;
      }
    } else {
      // at user mark
      // first move one step forward... then find next user mark
      nextTick = _rlog.rlog.getGraph.nextStep(_rlog.rlog.curTick);
    }

    var val, i; // move to user mark

    for (i = 0; i < _rlog.rlog.getGraph.stepsUserMark.length; i++) {
      val = _rlog.rlog.getGraph.stepsUserMark[i];

      if (nextTick < val) {
        (0, _updateGraph.updateGraph)(val, cytoOptions);
        return true;
      }
    }

    return false;
  };

  _exports.nextUserMark = nextUserMark;

  var prevUserMark = function prevUserMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var prevTick;

    if ((0, _sortedIndexOf2.default)(_rlog.rlog.getGraph.stepsUserMark, _rlog.rlog.curTick) !== -1) {
      // not at a marked point
      if ((0, _GraphAtStep.hasLength)(_rlog.rlog.getGraph.filterDatas)) {
        // if filtered, will go to next step, then prev step location
        prevTick = _rlog.rlog.getGraph.prevStep(_rlog.rlog.getGraph.nextStep(_rlog.rlog.curTick));
      } else {
        // if not filtered
        prevTick = _rlog.rlog.curTick;
      }
    } else {
      // at marked point
      // first move one step backward... then find prev user mark
      prevTick = _rlog.rlog.getGraph.prevStep(_rlog.rlog.curTick);
    }

    var val, i; // move to user mark

    for (i = _rlog.rlog.getGraph.stepsUserMark.length - 1; i >= 0; i--) {
      val = _rlog.rlog.getGraph.stepsUserMark[i];

      if (prevTick > val) {
        return (0, _updateGraph.updateGraph)(val, cytoOptions);
      }
    }

    return false;
  };

  _exports.prevUserMark = prevUserMark;

  var lastUserMark = function lastUserMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (_rlog.rlog.getGraph.stepsUserMark.length === 0) return false;
    return (0, _updateGraph.updateGraph)(_rlog.rlog.getGraph.stepsUserMark[_rlog.rlog.getGraph.stepsUserMark.length - 1], cytoOptions);
  };

  _exports.lastUserMark = lastUserMark;

  var firstUserMark = function firstUserMark() {
    var cytoOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (_rlog.rlog.getGraph.stepsUserMark.length === 0) return false;
    return (0, _updateGraph.updateGraph)(_rlog.rlog.getGraph.stepsUserMark[0], cytoOptions);
  };

  _exports.firstUserMark = firstUserMark;
});

/***/ }),

/***/ "./srcjs/utils/ArrayHelper.js":
/*!************************************!*\
  !*** ./srcjs/utils/ArrayHelper.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! lodash/flatten */ "./node_modules/lodash/flatten.js"), __webpack_require__(/*! lodash/map */ "./node_modules/lodash/map.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports, _flatten2, _map2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.flatMap = void 0;
  _flatten2 = _interopRequireDefault(_flatten2);
  _map2 = _interopRequireDefault(_map2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // // Made because...
  // // has an error as there is a double definition of _.flatMap.
  // // One for an Array (defined first)
  // // One for an Object (defined second, which stomps the first)
  // flatMap<T, U>(
  //   array?: ?$ReadOnlyArray<T>,
  //   iteratee?: ?FlatMapIteratee<T, U>
  // ): Array<U>;
  // flatMap<T: Object, U>(
  //   object: T,
  //   iteratee?: OFlatMapIteratee<T, U>
  // ): Array<U>;
  var flatMap = function flatMap(array, iteratee) {
    return (0, _flatten2.default)((0, _map2.default)(array, iteratee));
  };

  _exports.flatMap = flatMap;
});

/***/ }),

/***/ "./srcjs/utils/MapHelper.js":
/*!**********************************!*\
  !*** ./srcjs/utils/MapHelper.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.mapValues = mapValues;
  _exports.mapKeys = mapKeys;

  function mapValues(x) {
    return Array.from(x.values());
  }

  function mapKeys(x) {
    return Array.from(x.keys());
  }
});

/***/ }),

/***/ "./srcjs/utils/console.js":
/*!********************************!*\
  !*** ./srcjs/utils/console.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var console = window.console || {
    log: function log() {},
    warn: function warn() {},
    error: function error() {}
  };
  var _default = console;
  _exports.default = _default;
});

/***/ }),

/***/ "./srcjs/utils/numbers.js":
/*!********************************!*\
  !*** ./srcjs/utils/numbers.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.roundDecimals = void 0;

  var roundDecimals = function roundDecimals(value, decimals) {
    var roundedNumber = Math.round(Number("".concat(value, "e").concat(decimals)));
    return Number("".concat(roundedNumber, "e-").concat(decimals));
  };

  _exports.roundDecimals = roundDecimals;
});

/***/ })

/******/ });
//# sourceMappingURL=reactlog.js.map