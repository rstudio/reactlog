
// make sure packages like lodash are not being double stored
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
// visualize the bundle size
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(grunt) {

  var rootDir = __dirname;

  var saveDir = rootDir + '/inst/htmlwidgets/reactlog/';
  var readDir = rootDir + '/srcjs/';

  gruntConfig = {

    webpack: {
      options: {
        mode: "development", // do not take time to shrink files;
        devtool: "source-map", // produce a sibling source map file
        stats: {
          colors: true,
          modules: true,
          reasons: true
        },
        progress: true,
        failOnError: true,
        // optimization: {
        //   minimize: false // uglify the code
        // },
      },
      reactlog: {
        entry: readDir + "index.js",
        output: {
          path: saveDir,
          filename: 'reactlog.js'
        },
        plugins: [
          // new BundleAnalyzerPlugin({
          //   analyzerMode: 'static'
          // }),
          // new DuplicatePackageCheckerPlugin()
        ],
        watch: false,
        module: {
          rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
              loader: "babel-loader"
            }]
          }]
        }
      }
    }

  };

  grunt.loadNpmTasks('grunt-webpack');


  grunt.task.registerTask("webpackSetWatch", "sets 'watch' to true for reactlog webpack task", function() {
    gruntConfig.webpack.reactlog.watch = true
  });


  grunt.initConfig(gruntConfig);

  grunt.registerTask("default", "webpack:reactlog")

};
