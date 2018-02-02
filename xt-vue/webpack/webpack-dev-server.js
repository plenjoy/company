var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../config');
var webpackConfig = require('./dev.js');
var path = require('path');
var url = require('url');

var server = new WebpackDevServer(webpack(webpackConfig), {
  contentBase: path.resolve(__dirname, '../'),
  // hot: true,
  historyApiFallback: false,
  quiet: false,
  noInfo: false,
  stats: { colors: true },
  proxy: {
    '/assets': {
      target: url.resolve(config.static.base, config.product.relativePath),
      secure: false
    }
  }
});

server.listen(config.static.port, config.static.host, (err) => {
  if (err) {
    console.log(err);
  }
});
