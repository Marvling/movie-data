//

const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

// Host
const host = process.env.HOST || 'localhost';

// Required for babel-preset-react-app
process.env.NODE_ENV = 'development';

module.exports = {
  // experiments: {
  //   // asyncWebAssembly: true,
  //   // buildHttp: true,
  //   // layers: true,
  //   // lazyCompilation: true,
  //   // outputModule: true,
  //   // syncWebAssembly: true,
  //   // topLevelAwait: true,
  // },

//   externals: [
//     'mongodb-client-encryption',
//     'aws4',
//     'saslprep',
//     'kerberos',
//     'snappy',
//     'bson-ext',
// ],

  // Environment mode
  mode: 'development',

  // Entry point of app
  entry: resolveAppPath('src'),

  output: {
    // Development filename output
    filename: 'static/js/bundle.js',
  },

  devServer: {

    // Serve index.html as the base
    // THROWS WRROR, WON'T SERVE
    // contentBase: resolveAppPath('public'),

    // Enable compression
    compress: true,

    // Enable hot reloading
    hot: true,

    host,
    port: 8001,

    // devMiddleware: {
    //   index: true,
    //   mimeTypes: { phtml: 'text/html' },
    //   publicPath: '/publicPathForDevServe',
    //   serverSideRender: true,
    //   writeToDisk: true,
    // },

    // Public path is root of content base
    // THROWS ERROR, WON'T SERVE
    // publicPath: '/',

    proxy: {
      '/api/bypass-example': {
        bypass: (req, res) => res.send({
          mssg: 'proxy server - Message came from bypass property in webpack'
        }),
      },
    },
  },
  
  module: {
    rules: [
      {
        test:  /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: resolveAppPath('src'),
        loader: 'babel-loader',
        options: {
          presets: [
            // Preset includes JSX, TypeScript, and some ESnext features
            require.resolve('babel-preset-react-app'),
          ]
        }

      },
      {
        test:  /\.(csv|txt)$/,
        use: [
            {
              loader: 'file-loader',
              options: {
                name: "[path][name].[ext]",
                emitFile: true,
              }
            },
          ],
      }
    ],
  },

  plugins: [
    // Re-generate index.html with injected script tag.
    // The injected script tag contains a src value of the
    // filename output defined above.
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveAppPath('public/index.html'),
    }),
  ],

};