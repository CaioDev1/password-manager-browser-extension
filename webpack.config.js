const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const RunChromeExtension = require('webpack-run-chrome-extension')
const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.env.NODE_ENV

const CONFIG = {
   mode: ENV,
   entry: {
      'background': path.resolve(__dirname, "src", "background.ts"),
      'manager': path.resolve(__dirname, "src", "manager.ts"),
      // 'bootstrap.min': path.resolve(__dirname, "public", "styles.bootstrap.css"),
   },
   output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
      /* publicPath: '',
      assetModuleFilename: 'assets/img/[name][ext]', */
      clean: true
   },
   resolve: {
      extensions: [".ts", ".js"],
      alias: {
         'bootstrap': path.resolve(__dirname, 'public', 'styles.bootstrap.css'),
      },
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
         {
            test: /\.(component|main|bootstrap)\.(scss|css)$/,
            use: [
               {
                  loader: 'style-loader',
                  options: {
                     injectType: 'lazyStyleTag',
                     insert: (element, options) => {
                        var parent = options.target

                        parent.appendChild(element)
                      }
                  }
               },
               {loader: 'css-loader'}, //? Converts css to es modules
               {loader: 'sass-loader'} //? Transpiles sass to css
            ],
            exclude: /node_modules/,
         },
         {
            test: /\.(jpe?g|png|gif|svg|jpg)$/,
            type: 'asset/inline',
          }
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [
            {from: path.resolve(__dirname, 'public', 'manifest.json'), to: '.'},
         ]
      }),
      new RunChromeExtension({ //? CHROME AUTOREFRESH PLUGIN
        extensionPath: path.resolve(__dirname, 'dist'),
        startingUrl: 'http://127.0.0.1:5500/index.html'
      })
   ],
}

if(ENV == 'production') {
   CONFIG.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
   }
} else {
   CONFIG.watch = true //? MANDATORY FOR CHROME AUTO REFRSH PLUGIN TO WORK
   CONFIG.devtool = 'cheap-module-source-map' //? AVOIDS EXTENSIONS ERRORS CAUSED BY WEBPACK EVAL()
}

module.exports = CONFIG