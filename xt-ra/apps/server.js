const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');


const devPort = 8000;

const server = new WebpackDevServer(webpack(config), {
  https: true,
  hot: true,
  historyApiFallback: false,
  quiet: false,
  noInfo: false,
  stats: { colors: true }
});


server.listen(devPort, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + devPort);
  console.log('Opening your system browser...');
  open('https://localhost:' + devPort);
});
