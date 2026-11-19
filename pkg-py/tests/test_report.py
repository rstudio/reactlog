from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, List

import pytest

import reactlog
from reactlog import format_reactlog_html, load_reactlog_json


def test_load_reactlog_json_with_r_reactlog_schema():
    r_reactlog = {
        "version": "1.0",
        "session": "session_abc",
        "log": [
            {
                "action": "define",
                "id": "input:num",
                "label": "num",
                "type": "observable",
                "time": 0.01,
                "session": "session_abc",
            },
            {
                "action": "define",
                "id": "calc:double",
                "label": "double",
                "type": "calc",
                "time": 0.02,
                "session": "session_abc",
            },
            {
                "action": "dependsOn",
                "id": "calc:double",
                "dependsOn": "input:num",
                "time": 0.03,
                "session": "session_abc",
            },
            {
                "action": "define",
                "id": "output:txt",
                "label": "txt",
                "type": "observer",
                "time": 0.04,
                "session": "session_abc",
            },
            {
                "action": "dependsOn",
                "id": "output:txt",
                "dependsOn": "calc:double",
                "time": 0.05,
                "session": "session_abc",
            },
            {
                "action": "valueChange",
                "id": "input:num",
                "value": "42",
                "time": 1.0,
                "session": "session_abc",
            },
        ],
    }
    loaded = load_reactlog_json(r_reactlog)
    assert loaded["success"] is True
    assert len(loaded["nodes"]) == 3
    assert len(loaded["edges"]) == 2
    assert len(loaded["events"]) == 6

    input_node = next(n for n in loaded["nodes"] if n["id"] == "input:num")
    assert input_node["role"] == "source"
    assert input_node["type"] == "input"
    dep_events = [e for e in loaded["events"] if e["action"] == "dependsOn"]
    assert dep_events[0]["details"] == "Dependency: 'input:num' used by 'calc:double'"
    assert dep_events[1]["details"] == "Dependency: 'calc:double' used by 'output:txt'"
    val_event = next(e for e in loaded["events"] if e["action"] == "valueChange")
    assert val_event["node_label"] == "num"
    assert val_event["details"] == "Value change for 'num': 42"

    raw_events_list = r_reactlog["log"]
    loaded_raw = load_reactlog_json(raw_events_list)
    assert loaded_raw["success"] is True
    assert len(loaded_raw["nodes"]) == 3
    assert len(loaded_raw["edges"]) == 2


@pytest.mark.parametrize("precomputed", [False, True])
def test_activity_and_explanation_use_node_names(precomputed: bool):
    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js is needed to run the report's activity formatter")
    report: dict[str, Any] = {
        "nodes": [
            {
                "id": "r45",
                "name": "r45",
                "label": "reactive.calc filtered_data",
                "type": "calc",
            },
            {
                "id": "r9",
                "label": "input.summary-metric",
                "type": "input",
                "role": "source",
            },
        ],
        "events": [
            {"node_id": "r45", "type": "calc", "action": "enter", "time": 1, "step": 0}
        ],
    }
    if precomputed:
        report["action_waves"] = [
            {
                "short_label": "r45",
                "trigger_label": "r45",
                "human_action": "Recalc: r45",
                "inferred_executions": ["r45"],
                "start_step": 0,
                "end_step": 0,
            }
        ]
    html = format_reactlog_html(report, "")
    functions: list[str] = []
    for name in (
        "escapeHTML",
        "filterItems",
        "cleanName",
        "formatHumanValue",
        "formatTime",
        "nodeDisplayName",
        "waveToBurst",
        "buildActionWaves",
        "getCurrentFlushIndex",
        "updateFlushUI",
        "nodeKind",
        "explainWhyNodeRan",
    ):
        match = re.search(rf"    function {name}\([\s\S]*?\n    \}}", html)
        assert match is not None
        functions.append(match[0])
    script = (
        "const reactlogData = "
        + json.dumps(report)
        + ";\n"
        + """
const nodeIndex = new Map(reactlogData.nodes.map(n => [n.id, n]));
const adjUpstream = new Map();
let allBursts = [], actionWaves = [], currentStep = 0;
const elements = Object.fromEntries(['flush-card-title', 'flush-card-trigger'].map(id => [id, {}]));
const document = {getElementById: id => elements[id] || null};
"""
        + "\n".join(functions)
        + """
buildActionWaves();
updateFlushUI();
console.log(JSON.stringify({
  name: allBursts[0].shortLabel, action: allBursts[0].humanAction,
  title: elements['flush-card-title'].textContent,
  trigger: elements['flush-card-trigger'].textContent,
  narrative: explainWhyNodeRan('r9', 0).narrative
}));
"""
    )
    result = subprocess.run(
        [node, "-e", script], capture_output=True, text=True, check=True
    )
    labels = json.loads(result.stdout)
    assert labels["name"] == "reactive.calc filtered_data"
    assert labels["action"] == "Recalc: reactive.calc filtered_data"
    assert labels["title"] == "Activity 1: reactive.calc filtered_data"
    assert labels["trigger"] == labels["action"]
    assert (
        "Did not change during Recalc: reactive.calc filtered_data"
        in labels["narrative"]
    )
    assert "r45" not in result.stdout


def test_graph_routes_stay_outside_node_cards():
    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js is needed to run the graph router")
    html = format_reactlog_html({"nodes": [], "edges": [], "events": []}, "")
    router = re.search(r"    function routeGraphEdge\([\s\S]*?\n    \}", html)
    assert router is not None
    edge_path = re.search(r"    function graphEdgePath\([\s\S]*?\n    \}", html)
    assert edge_path is not None
    filters = re.search(r"    function filterItems\([\s\S]*?\n    \}", html)
    assert filters is not None
    script = filters[0] + router[0] + edge_path[0] + """
const positions = {
  source: {x: 150, y: 650}, blocker: {x: 150, y: 450},
  calc: {x: 500, y: 110}, middle: {x: 500, y: 650},
  output: {x: 850, y: 650}, cycle: {x: 150, y: 850}
};
const edges = [
  {from: 'source', to: 'calc'}, {from: 'source', to: 'output'},
  {from: 'source', to: 'cycle'}, {from: 'cycle', to: 'source'},
  {from: 'output', to: 'source'}
];
console.log(JSON.stringify({
  routes: edges.map(edge => routeGraphEdge(edge, positions, 280, 64, edges)),
  paths: edges.map(edge => graphEdgePath(edge, positions, 280, 64, edges))
}));
"""
    result = subprocess.run(
        [node, "-e", script], capture_output=True, text=True, check=True
    )
    payload = json.loads(result.stdout)
    for d in payload["paths"]:
        assert d.startswith("M ")
        assert " C " in d
    centers = [(150, 650), (150, 450), (500, 110), (500, 650), (850, 650), (150, 850)]
    for points in payload["routes"]:
        assert len(points) >= 2
        for first, second in zip(points, points[1:]):
            x1, y1 = first
            x2, y2 = second
            assert x1 == x2 or y1 == y2
            for x, y in centers:
                if x1 == x2:
                    assert not (
                        x - 140 < x1 < x + 140
                        and max(y1, y2) > y - 32
                        and min(y1, y2) < y + 32
                    )
                else:
                    assert not (
                        y - 32 < y1 < y + 32
                        and max(x1, x2) > x - 140
                        and min(x1, x2) < x + 140
                    )


def test_graph_layout_groups_connected_inputs_and_aligns_dependencies():
    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js is needed to run the graph layout")
    html = format_reactlog_html({"nodes": [], "edges": [], "events": []}, "")
    layout = re.search(r"    function arrangeGraphBand\([\s\S]*?\n    \}", html)
    assert layout is not None
    filters = re.search(r"    function filterItems\([\s\S]*?\n    \}", html)
    assert filters is not None
    script = filters[0] + layout[0] + """
const nodes = ['a', 'b', 'c', 'calc', 'plot', 'summary'].map(id => ({id}));
const ranks = new Map([['a', 0], ['b', 0], ['c', 0], ['calc', 1], ['plot', 2], ['summary', 2]]);
const edges = [
  {from: 'a', to: 'plot'}, {from: 'b', to: 'calc'},
  {from: 'c', to: 'plot'}, {from: 'calc', to: 'summary'}
];
console.log(JSON.stringify(arrangeGraphBand(nodes, edges, ranks, 70, 350, 92)));
"""
    result = subprocess.run(
        [node, "-e", script], capture_output=True, text=True, check=True
    )
    layout_result = json.loads(result.stdout)
    positions = layout_result["positions"]
    assert layout_result["rows"] == 3
    assert abs(positions["a"]["y"] - positions["c"]["y"]) == 92
    assert positions["b"]["y"] == positions["calc"]["y"] == positions["summary"]["y"]
    assert positions["b"]["x"] < positions["calc"]["x"] < positions["summary"]["x"]
    assert (
        abs(positions["plot"]["y"] - (positions["a"]["y"] + positions["c"]["y"]) / 2)
        <= 46
    )


def test_format_reactlog_html_accessible_palette():
    html = format_reactlog_html({"nodes": [], "edges": [], "events": []}, "")
    style = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    assert style is not None
    palettes: list[bool] = []
    shared: dict[str, str] = {}
    for selector, declarations in re.findall(r"([^{}]+)\{([^{}]*)\}", style[1]):
        tokens = dict(re.findall(r"(--[\w-]+):\s*(#[\da-fA-F]{6});", declarations))
        if "--state-ready" in tokens:
            shared = tokens
        if "--source" not in tokens:
            continue
        is_light = any(value in selector for value in ('"light"', '"auto"'))
        roles = [tokens[f"--{role}"] for role in ("source", "calc", "effect", "output")]
        palettes.append(is_light)

        def luminance(color: str) -> float:
            channels = [int(color[i : i + 2], 16) / 255 for i in (1, 3, 5)]
            linear = [
                c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
                for c in channels
            ]
            return sum(
                c * weight for c, weight in zip(linear, (0.2126, 0.7152, 0.0722))
            )

        for foreground in roles + [tokens["--text-muted"], tokens["--module-text"]]:
            for background in (tokens["--surface"], tokens["--surface-2"]):
                levels = sorted((luminance(foreground), luminance(background)))
                assert (levels[1] + 0.05) / (levels[0] + 0.05) >= 4.5

        for marker in (
            "#355c23" if is_light else shared["--state-ready"],
            tokens["--timeline-output"],
            tokens["--timeline-mark"],
            tokens["--timeline-error"],
            tokens["--output"],
        ):
            for track in (tokens["--track-bg"], tokens["--track-fill"]):
                levels = sorted((luminance(marker), luminance(track)))
                assert (levels[1] + 0.05) / (levels[0] + 0.05) >= 3.0

        stroke_levels = sorted(
            (luminance(tokens["--node-stroke"]), luminance(tokens["--bg"]))
        )
        assert (stroke_levels[1] + 0.05) / (stroke_levels[0] + 0.05) >= 3.0

        for state_token in (
            "--state-ready",
            "--state-calculating",
            "--state-invalidating",
            "--state-invalidated",
            "--state-error",
        ):
            fill = shared[state_token]
            for fg in ("#0f172a", "#1e293b", "#3b0764"):
                levels = sorted((luminance(fg), luminance(fill)))
                assert (levels[1] + 0.05) / (levels[0] + 0.05) >= 4.5
        frozen_fill = shared["--state-frozen"]
        for fg in ("#ffffff", "#e2e8f0", "#e9d5ff"):
            levels = sorted((luminance(fg), luminance(frozen_fill)))
            assert (levels[1] + 0.05) / (levels[0] + 0.05) >= 4.5

    # Explicit light/dark themes and the automatic light-mode fallback agree.
    assert palettes == [False, True, True]


def test_real_shiny_for_r_reactlog_parsing_and_epoch_time_normalization():
    r_reactlog = {
        "version": "1.0",
        "session": "r_session_123",
        "log": [
            {
                "action": "define",
                "reactId": "r1",
                "label": "input$num",
                "type": "observable",
                "time": 1650000000.100,
                "session": "r_session_123",
            },
            {
                "action": "define",
                "reactId": "r2",
                "label": "calc_double",
                "type": "calc",
                "time": 1650000000.250,
                "session": "r_session_123",
            },
            {
                "action": "define",
                "reactId": "r3",
                "label": "output$plot",
                "type": "observer",
                "time": 1650000000.300,
                "session": "r_session_123",
            },
            {
                "action": "dependsOn",
                "reactId": "r2",
                "depOnReactId": "r1",
                "time": 1650000000.400,
                "session": "r_session_123",
            },
            {
                "action": "dependsOn",
                "reactId": "r3",
                "depOnReactId": "r2",
                "time": 1650000000.500,
                "session": "r_session_123",
            },
            {
                "action": "valueChange",
                "reactId": "r1",
                "value": "99",
                "time": 1650000001.100,
                "session": "r_session_123",
            },
        ],
    }

    loaded = load_reactlog_json(r_reactlog)
    assert loaded["success"] is True
    assert len(loaded["nodes"]) == 3
    assert len(loaded["edges"]) == 2
    assert len(loaded["events"]) == 6

    assert {"from": "r1", "to": "r2"} in loaded["edges"]
    assert {"from": "r2", "to": "r3"} in loaded["edges"]

    events = loaded["events"]
    assert events[0]["time_sec"] == 0.0
    assert round(events[-1]["time_sec"], 1) == 1.0
    assert all(e["time_sec"] < 100.0 for e in events)


def test_r_reactlog_types_and_late_definitions():
    events = [
        {"action": "invalidateStart", "reactId": "r2"},
        {
            "action": "define",
            "reactId": "r1$x",
            "type": "reactiveValuesKey",
            "label": "input$x",
        },
        {"action": "define", "reactId": "r2", "type": "observable", "label": "doubled"},
        {
            "action": "define",
            "reactId": "r3",
            "type": "observer",
            "label": "output$result",
        },
        {
            "action": "define",
            "reactId": "r4",
            "type": "reactiveVal",
            "label": "counter",
        },
        {"action": "dependsOn", "reactId": "r2", "depOnReactId": "r1$x"},
        {"action": "dependsOn", "reactId": "r3", "depOnReactId": "r2"},
    ]
    result = load_reactlog_json(events)
    nodes = {n["id"]: n for n in result["nodes"]}
    assert nodes["r1$x"]["role"] == "source"
    assert nodes["r2"]["role"] == "conductor"
    assert nodes["r2"]["label"] == "doubled"
    assert nodes["r3"]["role"] == "observer"
    assert nodes["r4"]["role"] == "source"
    assert result["edges"] == [{"from": "r1$x", "to": "r2"}, {"from": "r2", "to": "r3"}]


def test_load_reactlog_json_with_plot_preview():
    data = {
        "version": "1.0",
        "session": "test-session",
        "entry_file": "app.py",
        "sources": {"app.py": "from shiny import ui"},
        "events": [
            {
                "action": "output",
                "node_id": "output:plot",
                "node_label": "output:plot",
                "plot": {
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                    "alt": "Test Plot",
                },
            }
        ],
    }
    loaded = load_reactlog_json(data)
    assert loaded["success"] is True
    assert loaded["entry_file"] == "app.py"
    assert "app.py" in loaded["sources"]
    assert loaded["events"][0]["plot"]["alt"] == "Test Plot"
    assert loaded["events"][0]["plot"]["src"].startswith("data:image/png;base64")


def test_graph_edge_ports_attach_to_chevron_and_concave_notches():
    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js is needed to run the graph router")
    html = format_reactlog_html({"nodes": [], "edges": [], "events": []}, "")
    assert 'marker id="arrow" viewBox="0 0 10 10" refX="9.6"' in html
    assert 'marker id="arrow-isolated" viewBox="0 0 10 10" refX="9.6"' in html
    assert 'marker id="arrow-active" viewBox="0 0 10 10" refX="9.8"' in html
    router = re.search(r"    function routeGraphEdge\([\s\S]*?\n    \}", html)
    assert router is not None
    edge_path = re.search(r"    function graphEdgePath\([\s\S]*?\n    \}", html)
    assert edge_path is not None
    filters = re.search(r"    function filterItems\([\s\S]*?\n    \}", html)
    assert filters is not None
    script = filters[0] + router[0] + edge_path[0] + """
const positions = {
  src: {x: 150, y: 110, nodeType: 'input', nodeRole: 'source'},
  clc: {x: 500, y: 110, nodeType: 'calc', nodeRole: 'conductor'},
  out: {x: 850, y: 110, nodeType: 'output', nodeRole: 'output'}
};
const edges = [
  {from: 'src', to: 'clc'},
  {from: 'clc', to: 'out'}
];
const longPositions = {
  shared: {x: 500, y: 645, nodeType: 'calc', nodeRole: 'conductor'},
  inp1: {x: 960, y: 110, nodeType: 'input', nodeRole: 'source'},
  inp2: {x: 960, y: 202, nodeType: 'input', nodeRole: 'source'},
  inp3: {x: 960, y: 294, nodeType: 'input', nodeRole: 'source'},
  inp4: {x: 960, y: 386, nodeType: 'input', nodeRole: 'source'},
  inp5: {x: 960, y: 478, nodeType: 'input', nodeRole: 'source'},
  outTop: {x: 1660, y: 110, nodeType: 'output', nodeRole: 'output'},
  outMid: {x: 1660, y: 294, nodeType: 'output', nodeRole: 'output'}
};
const longEdges = [
  {from: 'shared', to: 'outTop'},
  {from: 'shared', to: 'outMid'},
  {from: 'inp1', to: 'outMid'},
  {from: 'inp3', to: 'outMid'}
];
console.log(JSON.stringify({
  simple: edges.map(e => graphEdgePath(e, positions, 280, 64, edges)),
  longTop: graphEdgePath(longEdges[0], longPositions, 280, 64, longEdges),
  longMid: graphEdgePath(longEdges[1], longPositions, 280, 64, longEdges)
}));
"""
    result = subprocess.run(
        [node, "-e", script], capture_output=True, text=True, check=True
    )
    payload = json.loads(result.stdout)
    paths = payload["simple"]
    # src tip is 150 + 140 = 290; clc left concave notch is 500 - 140 + 20 = 380
    assert paths[0].startswith("M 290 110 ")
    assert paths[0].endswith(" 380 110")
    # clc tip is 500 + 140 = 640; out left concave notch is 850 - 140 + 20 = 730
    assert paths[1].startswith("M 640 110 ")
    assert paths[1].endswith(" 730 110")
    # Multi-bend edges must enter concave target notches horizontally at target y.
    for d in (payload["longTop"], payload["longMid"]):
        assert " L " not in d
        coords = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", d)]
        pairs = list(zip(coords[::2], coords[1::2]))
        assert pairs[-4][1] == pairs[-3][1] == pairs[-2][1] == pairs[-1][1]
        assert pairs[-4][0] < 1520 < pairs[-1][0]


def test_load_reactlog_json_marks_isolated_edges():
    data = {
        "log": [
            {
                "action": "define",
                "reactId": "r1",
                "label": "a",
                "type": "reactiveVal",
                "time": 1.0,
            },
            {
                "action": "define",
                "reactId": "r2",
                "label": "b",
                "type": "reactiveVal",
                "time": 1.0,
            },
            {
                "action": "define",
                "reactId": "r3",
                "label": "e",
                "type": "observer",
                "time": 1.0,
            },
            {
                "action": "dependsOn",
                "reactId": "r3",
                "depOnReactId": "r1",
                "isolate": True,
                "time": 2.0,
            },
            {
                "action": "dependsOn",
                "reactId": "r3",
                "depOnReactId": "r2",
                "isolate": False,
                "time": 2.0,
            },
        ]
    }
    out = load_reactlog_json(data)
    assert {(e["from"], e["to"], e.get("isolated", False)) for e in out["edges"]} == {
        ("r1", "r3", True),
        ("r2", "r3", False),
    }


def test_load_reactlog_json_mixed_isolation_on_same_edge_is_not_isolated():
    def dep(isolate: bool, t: float) -> Dict[str, Any]:
        return {
            "action": "dependsOn",
            "reactId": "r2",
            "depOnReactId": "r1",
            "isolate": isolate,
            "time": t,
        }

    out = load_reactlog_json({"log": [dep(True, 1.0), dep(False, 2.0)]})
    assert out["edges"] == [{"from": "r1", "to": "r2"}]


_LIVE_LOG: List[Dict[str, Any]] = [
    {"action": "define", "reactId": "r1", "label": "input.x", "type": "input"},
    {
        "action": "define",
        "reactId": "r2",
        "label": "reactive.effect e",
        "type": "observer",
    },
    {
        "action": "dependsOn",
        "reactId": "r2",
        "depOnReactId": "r1",
        "label": "reactive.effect e",
        "type": "observer",
        "isolate": False,
    },
    {
        "action": "valueChange",
        "reactId": "r1",
        "label": "input.x",
        "type": "input",
        "value": "1",
    },
    {"action": "userMark", "label": "checkpoint", "details": "checkpoint"},
    {
        "action": "valueChange",
        "reactId": "r1",
        "label": "input.x",
        "type": "input",
        "value": "2",
    },
    {
        "action": "invalidateStart",
        "reactId": "r2",
        "label": "reactive.effect e",
        "type": "observer",
    },
    {
        "action": "dependsOnRemove",
        "reactId": "r2",
        "depOnReactId": "r1",
        "label": "reactive.effect e",
        "type": "observer",
        "isolate": False,
    },
]


def _live_log() -> List[Dict[str, Any]]:
    return [
        {"provenance": "observed", "time": 1_700_000_000.0 + i, **entry}
        for i, entry in enumerate(_LIVE_LOG)
    ]


def _live_events() -> List[Dict[str, Any]]:
    return load_reactlog_json({"log": _live_log()})["events"]


def test_load_reactlog_json_invalidate_start_is_an_invalidation():
    ev = next(e for e in _live_events() if e["action"] == "invalidateStart")
    assert ev["status"] == "affected"
    assert ev["details"] == "Invalidated 'reactive.effect e'"
    assert ev["semantic_state"] == "invalidated"


def test_load_reactlog_json_preserves_dependency_removal_endpoints():
    ev = next(e for e in _live_events() if e["action"] == "dependsOnRemove")
    assert (ev["edge_from"], ev["edge_to"]) == ("r1", "r2")
    assert (ev["depOnReactId"], ev["reactId"]) == ("r1", "r2")
    assert ev["details"] == "Removed dependency: 'r1' no longer used by 'r2'"


def test_load_reactlog_json_recorded_inputs_are_sources():
    out = load_reactlog_json({"log": _live_log()})
    node = next(n for n in out["nodes"] if n["id"] == "r1")
    assert (node["role"], node["type"]) == ("source", "input")
    changes = [e for e in out["events"] if e["action"] == "valueChange"]
    assert [(e["node_type"], e["value"]) for e in changes] == [
        ("input", "1"),
        ("input", "2"),
    ]


def test_load_reactlog_json_marks_match_mark_helpers():
    ev = next(e for e in _live_events() if e["action"] == "userMark")
    keys = ("event", "node_label", "node_type", "phase", "provenance", "details")
    assert {k: ev[k] for k in keys} == {
        "event": "userMark",
        "node_label": "\U0001f516 checkpoint",
        "node_type": "mark",
        "phase": "interaction",
        "provenance": "observed",
        "details": "User mark: checkpoint",
    }
    assert ev["mark_wave"]["is_mark"] is True
    assert ev["mark_wave"]["trigger"] == "Bookmark: checkpoint"


def test_saved_r_reactlog_initial_flush_is_init_phase() -> None:
    # R's reactlog also ends the initial flush with `queueEmpty`.
    raw = [
        {"action": "define", "reactId": "r1", "type": "reactiveValuesKey"},
        {"action": "valueChange", "reactId": "r1", "value": "1"},
        {"action": "enter", "reactId": "r2"},
        {"action": "exit", "reactId": "r2"},
        {"action": "queueEmpty"},
        {"action": "valueChange", "reactId": "r1", "value": "2"},
        {"action": "enter", "reactId": "r2"},
    ]
    phases = [e["phase"] for e in load_reactlog_json(raw)["events"]]
    assert phases == ["init"] * 5 + ["interaction"] * 2
    # A phase already in the log wins.
    raw[1]["phase"] = "interaction"
    assert load_reactlog_json(raw)["events"][1]["phase"] == "interaction"


def test_load_reactlog_json_defaults_provenance_to_observed() -> None:
    loaded = load_reactlog_json(
        {
            "log": [
                {"action": "define", "reactId": "r1", "label": "c", "type": "calc"},
                {"action": "enter", "reactId": "r1", "label": "c", "type": "calc"},
            ]
        }
    )
    assert {e["provenance"] for e in loaded["events"]} == {"observed"}
    assert "inferred_events_count" not in loaded


def test_load_reactlog_json_consecutive_init_queue_empty() -> None:
    raw = [
        {"action": "define", "reactId": "r1", "label": "input.x", "type": "input"},
        {
            "action": "valueChange",
            "reactId": "r1",
            "label": "input.x",
            "type": "input",
            "value": "1",
        },
        {"action": "queueEmpty"},
        {"action": "queueEmpty"},
        {
            "action": "valueChange",
            "reactId": "r1",
            "label": "input.x",
            "type": "input",
            "value": "2",
        },
        {"action": "queueEmpty"},
    ]
    loaded = load_reactlog_json(raw)
    phases = [e["phase"] for e in loaded["events"]]
    assert phases == ["init", "init", "init", "init", "interaction", "interaction"]


def test_load_reactlog_json_coalesces_consecutive_invalidations():
    raw = [
        {"action": "define", "reactId": "r1", "label": "x", "type": "reactiveVal"},
        {"action": "define", "reactId": "r2", "label": "calc1", "type": "calc"},
        {"action": "define", "reactId": "r3", "label": "calc2", "type": "calc"},
        {"action": "valueChange", "reactId": "r1", "value": "10"},
        {"action": "invalidateStart", "reactId": "r2", "label": "calc1"},
        {"action": "invalidate", "reactId": "r3", "label": "calc2"},
        {"action": "enter", "reactId": "r2", "label": "calc1"},
        {"action": "exit", "reactId": "r2", "label": "calc1"},
    ]
    loaded = load_reactlog_json(raw)
    events = loaded["events"]
    inval_events = [
        e
        for e in events
        if e.get("action") in ("invalidate", "invalidateStart", "propagate")
    ]
    assert len(inval_events) == 1
    inval = inval_events[0]
    assert inval["invalidated_node_ids"] == ["r2", "r3"]
    assert inval["invalidated_node_labels"] == ["calc1", "calc2"]
    assert inval["details"] == "Invalidated 2 reactive nodes"
    assert inval["semantic_state"] == "invalidated"
    assert inval["status"] == "affected"


def test_reactlog_shared_viewer_bundle_assets_and_r_adapter():
    asset_dir = Path(reactlog.__file__).parent / "assets"
    for name in ("reactlog.js", "reactlog.css", "reactlog.html"):
        asset_path = asset_dir / name
        assert asset_path.is_file()
        assert asset_path.stat().st_size > 0

    r_trace = [
        {
            "action": "define",
            "reactId": "rNoCtxReactId",
            "label": "sentinel",
            "type": "calc",
            "time": 100.0,
        },
        {
            "action": "define",
            "reactId": "r1",
            "label": "input",
            "type": "reactiveValuesAsListAll",
            "time": 100.0,
        },
        {
            "action": "define",
            "reactId": "r2",
            "label": "out",
            "type": "observer",
            "time": 100.0,
        },
        {
            "action": "isolateEnter",
            "session": "s1",
            "time": 100.1,
        },
        {
            "action": "dependsOn",
            "reactId": "r2",
            "depOnReactId": "r1",
            "session": "s1",
            "time": 100.2,
        },
        {
            "action": "isolateExit",
            "session": "s1",
            "time": 100.3,
        },
    ]

    r_trace.extend(
        [
            {"action": "enter", "reactId": "r2", "session": "s1"},
            {"action": "exit", "reactId": "r2", "session": "s1"},
            {"action": "enter", "reactId": "r2", "provenance": "inferred"},
        ]
    )
    loaded = load_reactlog_json(r_trace)
    node_ids = {n["id"] for n in loaded["nodes"]}
    assert "rNoCtxReactId" not in node_ids
    assert node_ids == {"r1", "r2"}
    r1_node = next(n for n in loaded["nodes"] if n["id"] == "r1")
    assert r1_node["role"] == "source"
    assert r1_node["type"] == "input"
    assert loaded["edges"] == [{"from": "r1", "to": "r2", "isolated": True}]
    assert [e["action"] for e in loaded["events"]] == [e["action"] for e in r_trace]
    assert [e["provenance"] for e in loaded["events"][-3:]] == [
        "observed",
        "observed",
        "inferred",
    ]
    html = format_reactlog_html(loaded, "")
    assert "r1" in html and "r2" in html

    node = shutil.which("node")
    if node is not None:
        js_path = json.dumps(str(asset_dir / "reactlog.js"))
        trace_json = json.dumps(r_trace)
        script = f"""
const fs = require("fs");
global.window = {{ addEventListener: () => {{}}, matchMedia: () => ({{ matches: false }}) }};
global.document = {{ addEventListener: () => {{}}, getElementById: () => null, querySelector: () => null, documentElement: {{ getAttribute: () => "dark", setAttribute: () => {{}} }} }};
const reactlogData = {{ nodes: [], edges: [], events: [] }};
const rawAppSource = null;
const code = fs.readFileSync({js_path}, "utf8");
const viewer = (new Function("window", "document", "reactlogData", "rawAppSource", code + "; return ReactlogViewer;"))(global.window, global.document, reactlogData, rawAppSource);
const normalized = viewer.normalizeReactlogData({trace_json});
console.log(JSON.stringify({{ nodes: normalized.nodes, edges: normalized.edges, events: normalized.events }}));
"""
        result = subprocess.run(
            [node, "-e", script], capture_output=True, text=True, check=True
        )
        parsed = json.loads(result.stdout)
        js_node_ids = {n["id"] for n in parsed["nodes"]}
        assert "rNoCtxReactId" not in js_node_ids
        assert js_node_ids == {"r1", "r2"}
        js_r1 = next(n for n in parsed["nodes"] if n["id"] == "r1")
        assert js_r1["role"] == "source"
        assert js_r1["type"] == "input"
        assert parsed["edges"] == loaded["edges"]
        for key in ("action", "provenance", "session", "step"):
            assert [e[key] for e in parsed["events"]] == [
                e[key] for e in loaded["events"]
            ]


def test_saved_report_embeds_trace_and_links_relative_video(tmp_path: Path):
    report_path = tmp_path / "reports" / "demo.html"
    trace = load_reactlog_json(
        [{"action": "define", "reactId": "a", "label": "Count", "type": "input"}]
    )
    html = format_reactlog_html(
        trace,
        source_code="count = 1",
        title="Count & total",
        video_path=str(tmp_path / "recordings" / "demo.webm"),
        html_path=str(report_path),
    )
    assert "Count &amp; total" in html
    assert 'src="../recordings/demo.webm"' in html
    assert 'src="http' not in html
    assert '"reactId": "a"' in html
    assert '["Count"]:::inputClass' in reactlog.format_graph_mermaid(trace)
