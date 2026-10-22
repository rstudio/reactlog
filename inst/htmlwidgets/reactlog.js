HTMLWidgets.widget({
  name: "reactlog",
  type: "output",
  factory: function (el) {
    var iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    el.appendChild(iframe);

    return {
      renderValue: function (x) {
        iframe.srcdoc = x.html;
      },
      resize: function () {},
    };
  },
});
