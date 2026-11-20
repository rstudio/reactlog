# Reactlog for Python

Replay a saved Shiny trace in a browser. Install the development package from the repository root with `uv pip install ./pkg-py`.

```python
from pathlib import Path

from reactlog import format_reactlog_html, load_reactlog_json

trace = load_reactlog_json(Path("trace.json").read_text(encoding="utf-8"))
html = format_reactlog_html(trace, source_code="", title="My Shiny app")
Path("report.html").write_text(html, encoding="utf-8")
```

Open `report.html` to step through the timeline and inspect dependencies. The file embeds the viewer and the trace. If you supply a session video, keep it alongside the report at the path given to the renderer.

The reader accepts a JSON event array or an object containing a `log` array. Shiny records the trace in the application. This package reads and displays it.

To run the package and browser tests from this directory:

```sh
uv sync --extra dev
uv run --extra dev playwright install chromium
uv run --extra dev python -m pytest
```
