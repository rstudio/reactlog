"""Exercise the installed R and Python renderers with the same saved R trace."""

import json
import subprocess
from pathlib import Path

from playwright.sync_api import Page, expect

from reactlog import format_reactlog_html, load_reactlog_json


def test_rendered_reports_replay_the_same_trace(page: Page, tmp_path: Path):
    log = [
        {"action": "define", "reactId": "x", "type": "reactiveVal", "label": "café"},
        {"action": "define", "reactId": "y", "type": "observable", "label": "total"},
        {"action": "invalidateStart", "reactId": "x"},
        {"action": "invalidateStart", "reactId": "y"},
        {"action": "enter", "reactId": "y", "ctxId": 1},
        {"action": "dependsOn", "reactId": "y", "depOnReactId": "x"},
        {"action": "exit", "reactId": "y", "ctxId": 1},
        {"action": "userMark", "label": "checkpoint"},
        {"action": "idle"},
    ]
    for i, event in enumerate(log):
        event["time"] = 1700000000 + i * 0.125
    trace = tmp_path / "trace.json"
    trace.write_text(json.dumps(log), encoding="utf-8")
    subprocess.run(
        ["Rscript", "--vanilla", "-e", """
            log <- reactlog::reactlog_read("trace.json")
            stopifnot(file.copy(reactlog::reactlog_render(log), "r.html"))
            stopifnot(file.copy(reactlog::reactlog_render(log, time = FALSE), "untimed.html"))
        """],
        cwd=tmp_path,
        check=True,
    )
    report = load_reactlog_json(trace.read_text(encoding="utf-8"))
    (tmp_path / "python.html").write_text(format_reactlog_html(report, ""), encoding="utf-8")

    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    snapshots = []
    for name in ("r.html", "python.html", "untimed.html"):
        page.goto((tmp_path / name).as_uri())
        scrubber = page.get_by_role("slider", name="Timeline step scrubber")
        expect(scrubber).to_have_attribute("max", "7")
        expect(page.locator(".timeline-marker.is-mark")).to_have_count(1)
        scrubber.fill("5")
        node = page.locator('.graph-node[data-id="y"]')
        expect(node).to_contain_text("total")
        if name == "untimed.html":
            expect(node).not_to_contain_text("250ms")
        else:
            expect(node).to_contain_text("250ms")
        snapshots.append(page.evaluate("""() => ({
          actions: reactlogData.events.map(e => e.action),
          states: [...graphStateAtStep().states].sort(),
          edges: reactlogData.edges,
          marks: [...document.querySelectorAll('.timeline-marker')].map(m => m.title),
          controls: [...document.querySelectorAll('button[id]')].map(b => b.id),
        })"""))
    assert snapshots[0] == snapshots[1] == snapshots[2]
    assert errors == []
