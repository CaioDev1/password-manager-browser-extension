const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const RunChromeExtension = require('webpack-run-chrome-extension')

module.exports = {
   mode: "development",
   entry: {
      'background': path.resolve(__dirname, "src", "background.ts"),
      'manager': path.resolve(__dirname, "src", "manager.ts"),
   },
   output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   watch: true, //? MANDATORY FOR CHROME AUTO REFRSH PLUGIN TO WORK
   devtool: 'cheap-module-source-map', //? AVOIDS EXTENSIONS ERRORS CAUSED BY WEBPACK EVAL()
   plugins: [
      new CopyPlugin({
         patterns: [{from: ".", to: ".", globOptions: {absolute: true}, context: "public"}]
      }),
      new RunChromeExtension({ //? CHROME AUTOREFRESH PLUGIN
        extensionPath: path.resolve(__dirname, 'dist')
      })
   ],
};