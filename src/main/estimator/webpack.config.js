var app_root = 'src';
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  app_root: app_root,
  entry: [
    'webpack-dev-server/client?http://localhost:8888',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    __dirname + '/' + app_root + '/index.js'
  ],
  output: {
    path: '../resources/static/estimator/js',
    publicPath: 'js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/target/static'
  },
  plugins: [
    new CleanWebpackPlugin(['js/bundle.js'], {
      root: __dirname + '../resources/static',
      verbose: true,
      dry: false // true for simulation
    })
  ]
};
