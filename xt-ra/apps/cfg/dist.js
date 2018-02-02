const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const VersionFile = require('webpack-version-file-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');

const commonConfig = require('./common');

const product = process.env.product;

const PRODUCT_SRC = path.join(__dirname, '..', product, '/src');
const PRODUCT_DIST = path.join(__dirname, '../dist', product);

const MATERIAL_SRC = path.join(PRODUCT_SRC, '/sources/materials/index.js');

const materialEntry = {
  entry: {
    materials: MATERIAL_SRC
  }
};

const needMaterialEntry = fs.existsSync(MATERIAL_SRC);

module.exports = merge(
  commonConfig,
  {
    entry: {
      app: path.join(PRODUCT_SRC, '/index'),
      i18n: path.join(PRODUCT_SRC, '/i18n/index')
    },
    output: {
      path: PRODUCT_DIST,
      filename: '[name].js'
    },
    cache: false,
    devtool: false,
    plugins: [
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
        caching: true
      }),
      new ExtractPlugin('bundle.css'),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: false
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify('production') },
        __DEVELOPMENT__: false
      }),
      new webpack.NoErrorsPlugin(),
      new VersionFile({
        template: path.join(__dirname, '../version.ejs'),
        outputFile: path.join(PRODUCT_DIST, 'version.json')
      })
    ],
    module: {
      loaders: [
        {
          test: /\.s?css$/,
          loader: ExtractPlugin.extract('style', 'css!postcss!resolve-url!sass?sourceMap')
        },
        {
          test: /\.jsx?$/,
          loaders: ['happypack/loader?id=babel'],
          exclude: /node_modules/
        }
      ]
    }
  },
  needMaterialEntry ? materialEntry : null
);
