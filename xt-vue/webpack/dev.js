var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var config = require('../config');
var alias = require(path.resolve(config.product.absolutePath, 'alias'));

module.exports = {
  devtool: ['source-map'],

  entry: {
    app: [
      'webpack-dev-server/client?' + config.static.base,
      'webpack/hot/dev-server',
      path.resolve(config.product.absolutePath + '/js/entry.js')
    ],
    vendor: ['jquery', 'vuejs' , 'jcrop', 'slider']
  },

  output: {
    path: path.resolve(__dirname, '../dist/dev', config.product.relativePath, 'js'),
    publicPath: config.static.base,
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Store: 'Store'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(config.product.absolutePath + '/index.html')
    }),
    new WriteFilePlugin()
  ],


  resolve: {
    root: path.resolve(__dirname, '../'),
    extensions: ['', '.js', '.json', '.scss'],
    alias: alias
  }
}
