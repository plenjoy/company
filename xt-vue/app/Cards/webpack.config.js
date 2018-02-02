var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin();
var htmlWepbakcPluginInstance=new HtmlWebpackPlugin({
      template: './index.html',filename:'../a.html'
  });


var chunkPlugin = new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js");

var providePlugin = new webpack.ProvidePlugin({
  $: "jquery",
  jQuery: "jquery",
  "window.jQuery": "jquery",
  Store: "Store"
});
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
// var ExtractTextPlugin = require("extract-text-webpack-plugin"); 

module.exports = {
  //插件项
  plugins: [chunkPlugin, providePlugin],
  // plugins: [commonsPlugin, new ExtractTextPlugin("[name].css")],
  //页面入口文件配置
  entry: {
    app : './js/entry.js',
    vendor: ['jquery', 'vuejs' , 'jcrop', 'slider'],
  },
  //入口文件输出配置
  output: {
    path: './js/',
    filename: '[name].js'   // name是上面entry中设置的key
  },
  // module: {
  //   //加载器配置
  //   loaders: [
  //     { test: /\.css$/, loader: 'style-loader!css-loader' },
  //     { test: /\.js$/, loader: 'jsx-loader?harmony' },
  //     { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
  //     { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
  //   ]
  // },
  //其它解决方案配置
  resolve: {
    root: 'D:/workspace_new/js/h5', //绝对路径
    extensions: ['', '.js', '.json', '.scss'],
    alias: require('./alias.js')
  }
};