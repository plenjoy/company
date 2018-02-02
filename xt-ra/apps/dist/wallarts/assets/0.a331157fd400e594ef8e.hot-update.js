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
	        _react2.default.createElement('img', { src: _rotate2.default, className: 'rotate_button' })
	      );
	    }
	  }]);
	  return OrientationSelector;
	}(_react.Component);
	
	exports.default = (0, _reactTranslate.translate)('OrientationSelector')(OrientationSelector);
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(117); if (makeExportsHot(module, __webpack_require__(90))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "index.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ })

})
//# sourceMappingURL=0.a331157fd400e594ef8e.hot-update.js.map