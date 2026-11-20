from __future__ import annotations

import re
from typing import Literal

import pytest
from playwright.sync_api import Page, expect

from reactlog import format_reactlog_html, load_reactlog_json


def load_graph_report(
    page: Page,
    html: str,
    *,
    wait_until: Literal["load", "domcontentloaded", "networkidle", "commit"] = "load",
) -> None:
    """Open the graph and inspector explicitly for tests of those surfaces."""
    page.set_default_timeout(5000)
    page.set_content(html, wait_until=wait_until)
    page.locator("#btn-settings").click()
    page.locator("#activity-select").select_option("full")
    page.locator("#clientdata-select").select_option("show")
    page.locator("#btn-settings").click()
    page.locator("#btn-toggle-inspector").click()
    page.locator("#event-history").evaluate("el => el.open = true")
    page.locator("#flush-card").evaluate("el => el.open = true")


def test_new_edge_is_highlighted_without_a_moving_dot(page: Page) -> None:
    data = {
        "nodes": [
            {"id": "input:x", "label": "input.x", "type": "input", "role": "source"},
            {
                "id": "output:y",
                "label": "output y",
                "type": "output",
                "role": "observer",
            },
        ],
        "edges": [{"from": "input:x", "to": "output:y"}],
        "events": [
            {"action": "idle", "time": 0},
            {
                "action": "dependsOn",
                "node_id": "output:y",
                "edge_from": "input:x",
                "edge_to": "output:y",
                "time": 1,
            },
            {"action": "idle", "time": 2},
            {"action": "idle", "time": 3},
            {
                "action": "dependsOn",
                "node_id": "output:y",
                "edge_from": "input:x",
                "edge_to": "output:y",
                "isolate": True,
                "time": 4,
            },
        ],
    }
    load_graph_report(page, format_reactlog_html(data, ""))
    page.emulate_media(reduced_motion="no-preference")
    edge = page.locator('.graph-edge[data-from="input:x"][data-to="output:y"]')
    expect(edge).to_have_class(re.compile(r"\bis-inactive\b"))
    scrubber = page.get_by_role("slider", name="Timeline step scrubber")
    scrubber.fill("1")
    expect(edge).to_have_attribute("data-active", "true")
    expect(edge).to_have_attribute("marker-end", "url(#arrow-active)")
    expect(page.locator(".graph-edge-pulse, svg animateMotion")).to_have_count(0)


def _filtered_playback_report() -> str:
    clientdata = "input:.clientdata_output_result_hidden"
    return format_reactlog_html(
        {
            "nodes": [
                {"id": "output:result", "type": "output", "role": "observer"},
                {"id": "output:other", "type": "output", "role": "observer"},
                {"id": clientdata, "type": "input", "role": "source"},
            ],
            "edges": [{"from": clientdata, "to": "output:result"}],
            "events": [
                {"action": "enter", "node_id": "output:result", "time_sec": 0},
                {"action": "valueChange", "node_id": clientdata, "time_sec": 0.2},
                {"action": "valueChange", "node_id": clientdata, "time_sec": 0.4},
                {"action": "exit", "node_id": "output:result", "time_sec": 0.6},
                {"action": "enter", "node_id": "output:other", "time_sec": 0.8},
                {
                    "action": "dependsOn",
                    "edge_from": clientdata,
                    "edge_to": "output:result",
                    "node_id": "output:result",
                    "time_sec": 1,
                },
                {
                    "action": "invalidate",
                    "node_id": "output:other",
                    "invalidated_node_ids": ["output:other", "output:result"],
                    "time_sec": 1.2,
                },
                {"action": "queueEmpty", "time_sec": 1.4},
                {"action": "queueEmpty", "time_sec": 1.6},
                {"action": "queueEmpty", "time_sec": 1.8},
                {"action": "queueEmpty", "time_sec": 2},
                {"action": "exit", "node_id": "output:other", "time_sec": 2.2},
                {"action": "queueEmpty", "time_sec": 2.4},
                {"action": "queueEmpty", "time_sec": 2.6},
                {"action": "queueEmpty", "time_sec": 2.8},
                {"action": "enter", "node_id": "output:result", "time_sec": 3},
            ],
        },
        "",
    )


def test_arrow_keys_skip_events_outside_the_visible_graph(page: Page) -> None:
    page.set_content(_filtered_playback_report())
    scrubber = page.get_by_role("slider", name="Timeline step scrubber")
    play = page.locator("#btn-play")
    play.focus()
    play.press("ArrowRight")
    expect(scrubber).to_have_value("3")

    page.locator("#search-input").fill("id:output:result")
    play.focus()
    for step in (6, 7, 10, 15):
        play.press("ArrowRight")
        expect(scrubber).to_have_value(str(step))
    for step in (10, 7, 6, 3, 0):
        play.press("ArrowLeft")
        expect(scrubber).to_have_value(str(step))

    page.locator("#btn-settings").click()
    page.locator("#clientdata-select").select_option("show")
    page.locator("#btn-settings").click()
    scrubber.press("ArrowRight")
    expect(scrubber).to_have_value("1")


@pytest.mark.parametrize("speed", ["step", "realtime"])
def test_playback_visits_only_visible_graph_events(page: Page, speed: str) -> None:
    page.set_content(_filtered_playback_report())
    page.locator("#search-input").fill("id:output:result")
    page.locator("#btn-settings").click()
    page.locator("#playback-speed-select").select_option(speed)
    page.locator("#btn-settings").click()

    page.evaluate("""() => {
      const label = document.getElementById('step-display');
      window.visitedSteps = [];
      new MutationObserver(() => {
        window.visitedSteps.push(Number(label.textContent.split(' ')[1]));
      }).observe(label, { childList: true });
    }""")
    page.get_by_role("button", name="Play timeline").click()
    expect(page.locator("#scrubber-range")).to_have_value("15")
    expect(page.get_by_role("button", name="Play timeline")).to_be_visible()
    assert page.evaluate("window.visitedSteps") == [3, 6, 7, 10, 15]


@pytest.mark.parametrize(
    ("theme", "mark_color"),
    [
        ("light", "rgb(118, 91, 0)"),
        ("dark", "rgb(249, 223, 101)"),
        ("auto", "rgb(118, 91, 0)"),
    ],
)
def test_timeline_user_mark_highlights_its_call_site(
    page: Page, theme: str, mark_color: str
) -> None:
    code = 'from shiny import reactive\n\nreactive.mark("Check data")\n'
    report = load_reactlog_json(
        {
            "sources": {"app.py": code},
            "entry_file": "app.py",
            "log": [
                {
                    "action": "userMark",
                    "label": "Check data",
                    "source_file": "app.py",
                    "line": 3,
                    "time": 1,
                },
            ],
        }
    )
    page.emulate_media(color_scheme="light")
    page.set_content(format_reactlog_html(report, source_code=code, theme=theme))
    page.get_by_role("tab", name="App code").click()
    marker = page.locator(".timeline-marker.is-mark")
    expect(marker).to_have_css("background-color", mark_color)
    expect(page.locator(".timeline-key .key-mark")).to_have_css(
        "background-color", mark_color
    )
    active = page.locator("#source-panel .source-line.is-active")
    expect(active).to_have_count(1)
    expect(active).to_have_attribute("data-line", "3")
    expect(active.locator(".syntax-string")).to_have_css("color", mark_color)
    expect(page.locator("#source-panel mark")).to_have_count(0)


def reset_graph_view(page: Page) -> None:
    if not page.locator("#btn-reset-view").is_visible():
        page.locator("#btn-settings").click()
    page.locator("#btn-reset-view").click()


def test_empty_graph_shows_summary_notice(page: Page) -> None:
    reactlog = load_reactlog_json({"log": []})
    reactlog["summary"] = "No session selected."
    page.set_content(format_reactlog_html(reactlog, ""))
    expect(page.locator("#scrubber-range")).to_have_attribute(
        "aria-valuetext", re.compile(r"No session selected\.")
    )
    expect(page.locator("#scrubber-range")).to_be_visible()


def test_r_import_search_preserves_all_nodes(page: Page) -> None:
    raw = [
        {"action": "invalidateStart", "reactId": "r2"},
        {
            "action": "define",
            "reactId": "r1$x",
            "type": "reactiveValuesKey",
            "label": "input$x",
        },
        {
            "action": "define",
            "reactId": "r2",
            "type": "observable",
            "label": "doubled_value",
        },
        {
            "action": "define",
            "reactId": "r3",
            "type": "observer",
            "label": "output$result",
        },
        {"action": "define", "reactId": "r4", "type": "observer", "label": "unrelated"},
        {"action": "dependsOn", "reactId": "r2", "depOnReactId": "r1$x"},
        {"action": "dependsOn", "reactId": "r3", "depOnReactId": "r2"},
        {"action": "dependsOn", "reactId": "r4", "depOnReactId": "r1$x"},
    ]
    load_graph_report(
        page, format_reactlog_html(load_reactlog_json(raw), source_code="")
    )
    # Exercise the separate browser file-import normalizer as well.
    page.evaluate("raw => loadReactlogObject(raw)", raw)
    expect(page.locator('.graph-node[data-id="r1$x"]')).to_have_attribute(
        "data-role", "source"
    )
    expect(page.locator('.graph-node[data-id="r2"]')).to_have_attribute(
        "data-role", "conductor"
    )
    expect(page.locator('.graph-node[data-id="r3"]')).to_have_attribute(
        "data-role", "observer"
    )
    page.locator("#search-input").fill("dblvl")
    expect(page.locator("#search-results button")).to_have_count(1)
    page.locator("#search-input").fill("id:r2")
    page.locator("#search-results button").click()
    expect(page.locator(".graph-node")).to_have_count(3)
    expect(page.locator('.graph-node[data-id="r4"]')).to_have_count(0)
    expect(page.locator("#search-results")).to_be_hidden()
    reset_graph_view(page)
    expect(page.locator(".graph-node")).to_have_count(4)
    page.locator("#search-input").fill("no match xyz")
    expect(page.locator("#search-results")).to_contain_text("0 matches")
    page.locator("#search-input").press("Escape")
    expect(page.locator(".graph-node")).to_have_count(4)


def test_fit_large_graph(page: Page) -> None:
    raw = [
        {
            "action": "define",
            "reactId": f"r{i}",
            "type": "observable",
            "label": f"reactive {i}",
        }
        for i in range(200)
    ]
    load_graph_report(
        page, format_reactlog_html(load_reactlog_json(raw), source_code="")
    )
    reset_graph_view(page)
    bounds = page.evaluate("""() => {
        const svg = document.getElementById('reactlog-svg').getBoundingClientRect();
        const graph = document.getElementById('viewport-g').getBoundingClientRect();
        return {fits: graph.top >= svg.top && graph.bottom <= svg.bottom && graph.left >= svg.left && graph.right <= svg.right, zoom: zoomLevel};
    }""")
    assert bounds["fits"]
    assert bounds["zoom"] < 0.4


def test_app_box_left_of_modules_and_edges_avoid_input_nodes(page: Page) -> None:
    data = {
        "nodes": [
            {
                "id": "input:filter",
                "label": "filter",
                "type": "input",
                "role": "source",
            },
            {
                "id": "input:island",
                "label": "island",
                "type": "input",
                "role": "source",
            },
            {
                "id": "calc:shared",
                "label": "shared",
                "type": "calc",
                "role": "conductor",
            },
            {
                "id": "input:mod1-x",
                "label": "x",
                "type": "input",
                "role": "source",
                "module": "mod1",
            },
            {
                "id": "input:mod1-y",
                "label": "y",
                "type": "input",
                "role": "source",
                "module": "mod1",
            },
            {
                "id": "output:mod1-plot",
                "label": "plot",
                "type": "output",
                "role": "output",
                "module": "mod1",
            },
            {
                "id": "input:mod2-a",
                "label": "a",
                "type": "input",
                "role": "source",
                "module": "mod2",
            },
            {
                "id": "input:mod2-b",
                "label": "b",
                "type": "input",
                "role": "source",
                "module": "mod2",
            },
            {
                "id": "output:mod2-tbl",
                "label": "tbl",
                "type": "output",
                "role": "output",
                "module": "mod2",
            },
            {
                "id": "input:mod3-m",
                "label": "m",
                "type": "input",
                "role": "source",
                "module": "mod3",
            },
            {
                "id": "output:mod3-sum",
                "label": "sum",
                "type": "output",
                "role": "output",
                "module": "mod3",
            },
        ],
        "edges": [
            {"from": "input:filter", "to": "calc:shared"},
            {"from": "input:island", "to": "calc:shared"},
            {"from": "input:mod1-x", "to": "output:mod1-plot"},
            {"from": "input:mod1-y", "to": "output:mod1-plot"},
            {"from": "calc:shared", "to": "output:mod1-plot"},
            {"from": "input:mod2-a", "to": "output:mod2-tbl"},
            {"from": "input:mod2-b", "to": "output:mod2-tbl"},
            {"from": "calc:shared", "to": "output:mod2-tbl"},
            {"from": "input:mod3-m", "to": "output:mod3-sum"},
            {"from": "calc:shared", "to": "output:mod3-sum"},
        ],
        "events": [{"step": 0, "event": "idle", "time": 0.1}],
    }
    load_graph_report(page, format_reactlog_html(data, ""))

    layout = page.evaluate("""() => {
        const appRect = document.querySelector('.app-box rect').getBoundingClientRect();
        const modRects = Array.from(document.querySelectorAll('.module-box rect'))
            .map(el => el.getBoundingClientRect());
        const allCards = Array.from(document.querySelectorAll('.graph-node'))
            .map(el => ({id: el.dataset.id, role: el.dataset.role, box: el.querySelector('.node-card').getBoundingClientRect()}));
        const paths = Array.from(document.querySelectorAll('.graph-edge'))
            .map(el => ({from: el.dataset.from, to: el.dataset.to, len: el.getTotalLength(), el}));
        const intersections = [];
        for (const p of paths) {
            const targetCard = allCards.find(c => c.id === p.to)?.box;
            for (let i = 1; i < 40; i++) {
                const pt = p.el.getPointAtLength((p.len * i) / 40);
                const ctm = p.el.getScreenCTM();
                const screen = pt.matrixTransform(ctm);
                if (targetCard && screen.x > targetCard.left + 1) {
                    const cy = (targetCard.top + targetCard.bottom) / 2;
                    const t = Math.min(1, Math.abs(screen.y - cy) / (targetCard.height / 2));
                    const notchX = targetCard.left + (targetCard.width * 20 / 280) * (1 - t);
                    if (screen.x > notchX + 1.5) {
                        intersections.push({from: p.from, to: p.to, hit: 'target-fill'});
                    }
                }
                for (const item of allCards) {
                    if (item.id === p.from || item.id === p.to) continue;
                    const card = item.box;
                    if (
                        screen.x > card.left + 2
                        && screen.x < card.right - 2
                        && screen.y > card.top + 2
                        && screen.y < card.bottom - 2
                    ) {
                        intersections.push({from: p.from, to: p.to, hit: item.id});
                    }
                }
            }
        }
        return {
            appRight: appRect.right,
            modLeftMin: Math.min(...modRects.map(r => r.left)),
            intersections,
        };
    }""")
    assert layout["appRight"] < layout["modLeftMin"]
    assert layout["intersections"] == []
