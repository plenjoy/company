webpackHotUpdate(0,{

/***/ 692:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(79), RootInstanceProvider = __webpack_require__(87), ReactMount = __webpack_require__(89), React = __webpack_require__(90); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(97);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(106);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(107);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(108);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(109);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _classnames = __webpack_require__(233);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _react = __webpack_require__(90);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactTranslate = __webpack_require__(115);
	
	__webpack_require__(693);
	
	var _rotate = __webpack_require__(1343);
	
	var _rotate2 = _interopRequireDefault(_rotate);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var OrientationSelector = function (_Component) {
	  (0, _inherits3.default)(OrientationSelector, _Component);
	
	  function OrientationSelector(props) {
	    (0, _classCallCheck3.default)(this, OrientationSelector);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (OrientationSelector.__proto__ || (0, _getPrototypeOf2.default)(OrientationSelector)).call(this, props));
	
	    _this.rotatePage = _this.rotatePage.bind(_this);
	    return _this;
	  }
	
	  (0, _createClass3.default)(OrientationSelector, [{
	    key: 'rotatePage',
	    value: function rotatePage(newOrientation) {
	      var _props = this.props,
	          orientation = _props.orientation,
	          changeOrientation = _props.changeOrientation,
	          applyRelativeTemplate = _props.applyRelativeTemplate,
	          boundTrackerActions = _props.boundTrackerActions;
	
	      if (orientation !== newOrientation) {
	        boundTrackerActions.addTracker('SwitchTo' + newOrientation);
	        changeOrientation && changeOrientation({ orientation: newOrientation });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var orientation = this.props.orientation;
	
	      var landscapeButton = (0, _classnames2.default)('landscape-button', {
	        active: orientation === 'Landscape'
	      });
	      var portraitButton = (0, _classnames2.default)('portrait-button', {
	        active: orientation === 'Portrait'
	      });
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'bottons-wrap' },
	        '/*',
	        _react2.default.createElement(
	          'div',
	          {
	            onClick: function onClick() {
	              _this2.rotatePage('Landscape');
	            },
	            className: landscapeButton
	          },
	          'Landscape'
	        ),
	        _react2.default.createElement(
	          'div',
	          {
	            onClick: function onClick() {
	              _this2.rotatePage('Portrait');
	            },
	            className: portraitButton
	          },
	          'Portrait'
	        ),
	        '*/',
	        _react2.default.createElement('img', { src: _rotate2.default })
	      );
	    }
	  }]);
	  return OrientationSelector;
	}(_react.Component);
	
	exports.default = (0, _reactTranslate.translate)('OrientationSelector')(OrientationSelector);
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(117); if (makeExportsHot(module, __webpack_require__(90))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),

/***/ 1343:
/***/ (function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjEyNzYyLjk5OCAyMTQwMyAyMi43MjEgMTUuMDE4Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjM2EzYTNhOwogICAgICB9CgogICAgICAuY2xzLTIsIC5jbHMtMyB7CiAgICAgICAgZmlsbDogbm9uZTsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBzdHJva2U6ICMzYTNhM2E7CiAgICAgICAgc3Ryb2tlLXdpZHRoOiAycHg7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxnIGlkPSJHcm91cF85MiIgZGF0YS1uYW1lPSJHcm91cCA5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTE1NTAuODYxIDIxMzAxKSI+CiAgICA8ZyBpZD0iXzE0NTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyMjQuNTM3IDEwMi40MjEpIHJvdGF0ZSg0KSI+CiAgICAgIDxwYXRoIGlkPSJQYXRoXzM3IiBjbGFzcz0iY2xzLTEiIGQ9Ik0yLjcsMCwwLDEuNzI1LDIuNzE1LDMuNDA5bC0uMDA2LS45NDJhNS4zMjQsNS4zMjQsMCwwLDEsNS4zNSw1LjE2MiwxLjIsMS4yLDAsMCwwLC4wMDYuMTUxbC0uOTM5LjAwNywxLjYxOSwzLjAzMSwxLjYtMy4wNDVMOS40Nyw3Ljc4YzAtLjA5Mi0uMDA1LS4xODMtLjAxMy0uMjc1QTYuOCw2LjgsMCwwLDAsMi43Ljk0OFoiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJSZWN0YW5nbGVfMzQ4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjE2LjE0IDEwNy43OTEpIj4KICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1wYXRoIiBjbGFzcz0iY2xzLTIiIHdpZHRoPSIxMy4zMjgiIGhlaWdodD0iOS4yMjciLz4KICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1wYXRoLTIiIGRhdGEtbmFtZT0iUmVjdGFuZ2xlLXBhdGgiIGNsYXNzPSJjbHMtMyIgd2lkdGg9IjExLjMyOCIgaGVpZ2h0PSI3LjIyNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSAxKSIvPgogICAgPC9nPgogICAgPGcgaWQ9Ikdyb3VwXzkxIiBkYXRhLW5hbWU9Ikdyb3VwIDkxIj4KICAgICAgPHBhdGggaWQ9IlVuaW9uXzMiIGRhdGEtbmFtZT0iVW5pb24gMyIgY2xhc3M9ImNscy0xIiBkPSJNLTc1NDctMjEyODIuNDU3Vi0yMTI5Nmg5LjI3OHY2LjE1MmgtMS44MjJ2LTQuMzNoLTUuNjM5djkuOWgxLjI2MXYxLjgyMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg3NTkuMTQgMjEzOTgpIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"

/***/ })

})
//# sourceMappingURL=0.b146c9faf94222114341.hot-update.js.map