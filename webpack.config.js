const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const RunChromeExtension = require('webpack-run-chrome-extension')

module.exports = {
   mode: "development",
   entry: {
      'background': path.resolve(__dirname, "src", "background.ts"),
      'manager': path.resolve(__dirname, "src", "manager.ts"),
      'component-declaration': path.resolve(__dirname, "src", "components-declaration.ts"),
   },
   output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
      alias: {
         '@webcomponents/custom-elements': path.resolve('dist', 'extension-dependencies/custom-elements') 
      }
     /*  modules: [
         path.resolve(__dirname, 'node_modules'),
         path.resolve(__dirname, 'dist', 'extension-dependencies'),
      ] */
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
         {
            test: /\.html?$/,
            use: [{
               loader: 'html-loader',
               options: {
                  minimize: true,
               }
            }]
         },
         {
            test: /\.sass$/,
            use: [
               {loader: 'style-loader'},
               {
                  loader: 'css-loader',
                  options: {modules: true}
               },
               {loader: 'sass-loader'}
            ]
         }
      ],
   },
   watch: true, //? MANDATORY FOR CHROME AUTO REFRSH PLUGIN TO WORK
   devtool: 'cheap-module-source-map', //? AVOIDS EXTENSIONS ERRORS CAUSED BY WEBPACK EVAL()
   plugins: [
      new CopyPlugin({
         patterns: [
            {from: ".", to: ".", globOptions: {absolute: true}, context: "public"},
            {from: path.resolve(__dirname, 'node_modules/@webcomponents/'), to: './extension-dependencies'}
         ]
      }),
      new RunChromeExtension({ //? CHROME AUTOREFRESH PLUGIN
        extensionPath: path.resolve(__dirname, 'dist'),
      })
   ],
};