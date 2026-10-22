import $ from "jquery";

const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);

const alt = isMac ? "Option" : "Alt";
const shift = "Shift";
const ctrl = isMac ? "Cmd" : "Ctrl";
// Mac laptops have no Home / End keys
const home = isMac ? ["Fn", "←"] : ["Home"];
const end = isMac ? ["Fn", "→"] : ["End"];

let comboText = function (keys: string[]): string {
  return keys.join(" + ");
};

// each row: alternative key combos, then the action
type Row = [string[][], string];

const reactlogRows: Row[] = [
  [[["→"], ["Space"]], "Next step"],
  [[["←"]], "Previous step"],
  [
    [
      [shift, "←"],
      [shift, "→"],
    ],
    "Previous / next log entry",
  ],
  [
    [
      [alt, "←"],
      [alt, "→"],
    ],
    "Previous / next output calculation",
  ],
  [
    [
      [alt, shift, "←"],
      [alt, shift, "→"],
    ],
    "Previous / next idle",
  ],
  [[home, end], "Previous / next user mark"],
  [[["s"]], "Focus the search bar"],
  [[["Esc"]], "Leave search; clear highlight and filter"],
  [[["f"]], "Fit the graph to the window"],
  [[["l"]], "Show / hide log entry details"],
];
const shinyRows: Row[] = [
  [[[ctrl, "F3"]], "Open reactlog"],
  [
    [
      [ctrl, shift, "F3"],
      [ctrl, "F4"],
    ],
    "Add a user mark",
  ],
];

let sectionHtml = function (title: string, rows: Row[]): string {
  let body = rows
    .map(
      ([combos, action]) =>
        `<tr><td class="monospaced-pre">${combos.map(comboText).join(" / ")}</td><td>${action}</td></tr>`
    )
    .join("");
  return `<tr><th colspan="2">${title}</th></tr>${body}`;
};

let setup = function (): void {
  $("#shortcutsPopup").html(
    "<table>" +
      sectionHtml("Keyboard shortcuts", reactlogRows) +
      sectionHtml("In the Shiny app", shinyRows) +
      "</table>"
  );

  let wrapper = $("#shortcuts");
  $("#shortcutsButton").on("click", function () {
    wrapper.toggleClass("open");
    $(this).attr("aria-expanded", String(wrapper.hasClass("open")));
    // keep focus off the button so Space / arrow keys still move the graph
    $(this).trigger("blur");
  });

  // navigation button tooltips
  let titles: [string, string, string[]][] = [
    ["prevUserMarkButton", "Previous User Mark", home],
    ["prevIdleButton", "Previous idle", [alt, shift, "←"]],
    ["prevOutputCalcButton", "Previous output calculation", [alt, "←"]],
    ["prevStepButton", "Previous step", ["←"]],
    ["nextStepButton", "Next step", ["→"]],
    ["nextOutputCalcButton", "Next output calculation", [alt, "→"]],
    ["nextIdleButton", "Next idle", [alt, shift, "→"]],
    ["nextUserMarkButton", "Next User Mark", end],
  ];
  titles.forEach(([id, label, keys]) => {
    $(`#${id}`).attr("title", `${label} (${comboText(keys)})`);
  });
};

export { setup };
