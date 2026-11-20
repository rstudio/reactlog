import re

from playwright.sync_api import Page, expect

from reactlog import format_reactlog_html, load_reactlog_json


def test_python_report_replays_dependency_switch(page: Page) -> None:
    log = [
        {"action": "define", "reactId": "a", "type": "input"},
        {"action": "define", "reactId": "b", "type": "input"},
        {"action": "define", "reactId": "calc", "type": "observable"},
        {"action": "dependsOn", "reactId": "calc", "depOnReactId": "a"},
        {"action": "dependsOnRemove", "reactId": "calc", "depOnReactId": "a"},
        {"action": "dependsOn", "reactId": "calc", "depOnReactId": "b"},
    ]
    report = load_reactlog_json({"trace_version": 1, "log": log})
    assert report["trace_version"] == 1
    page.set_content(format_reactlog_html(report, ""))
    edge_a = page.locator('.graph-edge[data-from="a"][data-to="calc"]')
    edge_b = page.locator('.graph-edge[data-from="b"][data-to="calc"]')

    for step, active in [(3, edge_a), (5, edge_b), (3, edge_a)]:
        page.evaluate("step => seekTo(step)", step)
        expect(active).not_to_have_class(re.compile(r"\bis-inactive\b"))
        expect(edge_b if active is edge_a else edge_a).to_have_class(
            re.compile(r"\bis-inactive\b")
        )
