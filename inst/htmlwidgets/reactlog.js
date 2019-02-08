HTMLWidgets.widget({

  name: 'reactlog',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        // // TODO: code to render the widget, e.g.
        // el.innerText = x.message;

        new Reactlog(el, x.log, x.time);

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
