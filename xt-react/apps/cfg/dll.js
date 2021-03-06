const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const args = require('minimist')(process.argv.slice(2));

const product = process.env.product;

const DLL_PATH = path.join(__dirname, '../dist', product, '/assets');

const vendorMap = {
  photobook: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva',
    'react-tooltip',
    'react-cookies',
    'react-touch',
    'exif-js'
  ],
  imagebox: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'react',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-redux',
    'react-select',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'x2js'
  ],
  layout: [
    'babel-polyfill',
    'bootstrap',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'react',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-redux',
    'react-select',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'x2js'
  ],
  myphoto: [
    'babel-polyfill',
    'classnames',
    'isomorphic-fetch',
    'lodash',
    'react',
    'react-dom',
    'mobx',
    'mobx-react',
    'react-waypoint'
  ],
  littlebook: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva',
    'react-tooltip',
    'react-cookies',
    'exif-js'
  ],
  timelinebook: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva',
    'moment'
  ],
  calendar: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva'
  ],
  postercalendar: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva'
  ],
  wallarts: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva'
  ],
  box: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'react',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-redux',
    'react-select',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'x2js'
  ],
  littleprints: [
    'babel-polyfill',
    'classnames',
    'es6-promise',
    'immutable',
    'isomorphic-fetch',
    'lodash',
    'qs',
    'raw-loader',
    'rc-slider',
    'rc-checkbox',
    'react',
    'react-addons-css-transition-group',
    'react-clipboard.js',
    'react-color',
    'react-dom',
    'react-draggable',
    'react-image-crop',
    'react-loader',
    'react-notification-system',
    'react-redux',
    'react-router',
    'react-select',
    'react-tabs',
    'react-translate',
    'redux',
    'redux-actions',
    'redux-logger',
    'redux-thunk',
    'reselect',
    'x2js',
    'dom-helpers',
    'react-lazy-load',
    'hex-rgb',
    'konva',
    'react-konva'
  ]
};

const commonConfig = {
  entry: {
    vendor: vendorMap[product]
  },

  output: {
    path: DLL_PATH,
    filename: '[name].js',
    library: '[name]'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(DLL_PATH, '[name]-manifest.json'),
      name: '[name]'
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules']
  }
};

if (args.env === 'dev') {
  module.exports = merge(commonConfig, {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        __DEVELOPMENT__: true
      })
    ]
  });
} else {
  module.exports = merge(commonConfig, {
    devtool: false,
    plugins: [
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify('production') },
        __DEVELOPMENT__: false
      })
    ]
  });
}
