const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RunChromeExtension = require('webpack-run-chrome-extension')

module.exports = {
   mode: process.env.NODE_ENV,
   entry: {
      'background': path.resolve(__dirname, "src", "background.ts"),
      'manager': path.resolve(__dirname, "src", "manager.ts"),
   },
   output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
      clean: true
   },
   resolve: {
      extensions: [".ts", ".js"],
      alias: {
         '@webcomponents/custom-elements': path.resolve(__dirname, 'dist', 'extension-dependencies', 'custom-elements'),
         'bootstrap': path.resolve(__dirname, 'dist', 'extension-dependencies', 'bootstrap', 'styles.bootstrap.css'), //'bootstrap/dist/css/styles.bootstrap.css'
      }
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
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
  /*        {
            test: /\.main\.scss$/,
            use: [
               {loader: process.env.NODE_ENV == 'production' ? MiniCssExtractPlugin.loader : 'style-loader'}, //? Injects css to DOM (seems not necessary)
               {loader: 'css-loader'}, //? Converts css to es modules
               {loader: process.env.NODE_ENV != 'production' && 'sass-loader'} //? Transpiles sass to css
            ],
            exclude: /node_modules/,
            // type: 'asset/source',
         }, */
         {
            test: /\.(component|main|bootstrap)\.(scss|css)$/,
            use: [
               {
                  loader: 'style-loader',
                  options: {
                     injectType: 'lazyStyleTag',
                     insert: (element, options) => {
                        var parent = options.target || document.head;
        
                        parent.appendChild(element);
                      }
                  }
               },
               {loader: 'css-loader'}, //? Converts css to es modules
               {loader: process.env.NODE_ENV != 'production' && 'sass-loader'} //? Transpiles sass to css
            ],
            exclude: /node_modules/,
         },
         /* {
            test: /\.css$/,
            exclude: /node_modules/,
            type: 'asset/source'
         }, */
      ],
   },
   watch: true, //? MANDATORY FOR CHROME AUTO REFRSH PLUGIN TO WORK
   devtool: 'cheap-module-source-map', //? AVOIDS EXTENSIONS ERRORS CAUSED BY WEBPACK EVAL()
   plugins: [
      new CopyPlugin({
         patterns: [
            // {from: ".", to: ".", globOptions: {absolute: true}, context: "public"},
            {from: path.resolve(__dirname, 'public', 'manifest.json'), to: '.'},
            {from: path.resolve(__dirname, 'public', 'styles.bootstrap.css'), to: "./extension-dependencies/bootstrap"},
            {from: path.resolve(__dirname, 'node_modules/@webcomponents/'), to: './extension-dependencies'}
         ]
      }),
      new RunChromeExtension({ //? CHROME AUTOREFRESH PLUGIN
        extensionPath: path.resolve(__dirname, 'dist'),
        startingUrl: 'http://127.0.0.1:5500/index.html'
      }),
      new MiniCssExtractPlugin({
         filename: "main.css",
       })
   ],
};