webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var envService = __webpack_require__(6);
	envService.loadDomainUrls();
	var userService = __webpack_require__(8);
	userService.getUserInfo();

	var ProjectService = __webpack_require__(9);
	var UtilParam = __webpack_require__(10);
	var ProjectController = __webpack_require__(23);

	var Vue = __webpack_require__(29);
	// var Raphael = require('raphael');
	// var freeTransform = require('raphaelTransform');
	// var font-awesome = require('font-awesome');
	// var bootstrap = require('bootstrap');
	// var bootstrap-slider = require('bootstrap-slider');
	// var beencss = require('beencss');
	// var jcropcss = require('jcropcss');
	// var appcss = require('appcss');

	// main entry js
	var CompHeader = Vue.extend(__webpack_require__(32));
	Vue.component('as-header', CompHeader);

	var CompImageUpload = Vue.extend(__webpack_require__(33));
	Vue.component('image-upload', CompImageUpload);

	var CompSizeChart = Vue.extend(__webpack_require__(36));
	Vue.component('size-chart', CompSizeChart);

	// var CompImageList = Vue.extend(require('../components/CompImageList.js'));
	// Vue.component('image-list', CompImageList);

	/*var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
	Vue.component('project-item-list', CompProjectItemList);*/

	var CompListTab = Vue.extend(__webpack_require__(37));
	Vue.component('list-tab', CompListTab);

	// var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
	// Vue.component('action-panel', CompActionPanel);

	// var CompOperation = Vue.extend(require('../components/CompOperation.js'));
	// Vue.component('operation-area', CompOperation);

	var CompHandle = Vue.extend(__webpack_require__(40));
	Vue.component('handle', CompHandle);

	var CompBar = Vue.extend(__webpack_require__(41));
	Vue.component('bar-panel', CompBar);

	var CompSubBar = Vue.extend(__webpack_require__(42));
	Vue.component('subbar-panel', CompSubBar);

	var CompPhotoElement = Vue.extend(__webpack_require__(43));
	Vue.component('photo-element', CompPhotoElement);

	var CompTextElement = Vue.extend(__webpack_require__(45));
	Vue.component('text-element', CompTextElement);

	var CompBg = Vue.extend(__webpack_require__(46));
	Vue.component('bg-layer', CompBg);

	// var CompContainer = Vue.extend(require('../components/CompContainer.js'));
	// Vue.component('operation-area', CompContainer);

	var CompDashboard = Vue.extend(__webpack_require__(47));
	Vue.component('dashboard', CompDashboard);

	var CompImageCrop = Vue.extend(__webpack_require__(51));
	Vue.component('image-crop', CompImageCrop);

	var CompOptions = Vue.extend(__webpack_require__(53));
	Vue.component('options-window', CompOptions);

	var CompTextEditor = Vue.extend(__webpack_require__(54));
	Vue.component('text-editor', CompTextEditor);

	var CompMeasureOption = Vue.extend(__webpack_require__(56));
	Vue.component('measure-option', CompMeasureOption);

	var CompOrder = Vue.extend(__webpack_require__(57));
	Vue.component('order-window', CompOrder);

	var CompPreviewHeader = Vue.extend(__webpack_require__(58));
	Vue.component('preview-header', CompPreviewHeader);

	var CompContactUs = Vue.extend(__webpack_require__(59));
	Vue.component('contact-us-window', CompContactUs);

	var CompClone = Vue.extend(__webpack_require__(60));
	Vue.component('clone-window', CompClone);

	var CompPreviewItemList = Vue.extend(__webpack_require__(61));
	Vue.component('preview-item-list', CompPreviewItemList);

	var CompPopup = Vue.extend(__webpack_require__(62));
	Vue.component('pop-up', CompPopup);

	// var CompTrace = Vue.extend(require('../../../commons/components/CompTrace.js'));
	// Vue.component('trace', CompTrace);

	var CompScreenshot = Vue.extend(__webpack_require__(63));
	Vue.component("screenshot",CompScreenshot);


	// var TestCompChild = Vue.extend(require('../components/TestCompChild.js'));
	// Vue.component('child', TestCompChild);
	// var TestCompBase = Vue.extend(require('../components/TestCompBase.js'));
	// Vue.component('base', TestCompBase);

	var CompInnerPreview = Vue.extend(__webpack_require__(64));
	Vue.component('inner-preview', CompInnerPreview);

	var CompCartReturn = Vue.extend(__webpack_require__(65));
	Vue.component('cart-choose-window', CompCartReturn);

	var CompNewProject = Vue.extend(__webpack_require__(66));
	Vue.component('new-project-window', CompNewProject);

	var CompWarnTipElement = Vue.extend(__webpack_require__(67));
	Vue.component('warntip-element', CompWarnTipElement);

	var vm = new Vue({
	    el: '#app',
	    mixins: [
	        __webpack_require__(68),
	        __webpack_require__(69)
	    ],
	    data: {
	        privateStore: {

	        },
	        sharedStore: Store,
	        imageName: ''
	    },
	    computed: {
	    },
	    methods: {
	        // init page
	        init: function() {
	            var specService = __webpack_require__(70);
	            specService.loadLocalSpec();
	            var _this = this,
	                domains = _this.sharedStore.domains
	            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
	            user = _this.sharedStore.userSettings;
	            //prj.product = projectProduct;
	            // prj.type = projectType;
	            // projectSize = projectSize.split('S')[0];
	            // projectSize.indexOf('_') !== -1 ? projectSize = projectSize.split('_')[1] : projectSize;
	            //prj.size = projectSize;
	            // prj.spineThickness = projectSpineThickness;

	            /*prj.product="IB";
	            prj.type="IW";
	            prj.size="8X11";*/

	            // get value from vm params in vm page...
	            // console.log('writting back project common settings');
	            /*prj.projectId = '';
	            prj.userId = '206350';
	            prj.title = 'test_4';*/
	            // if(projectId !== '') {
	            // 	prj.projectId = projectId;
	            // }
	            // else {
	            // 	prj.projectId = initGuid;
	            // };

	            // prj.userId = customerId;
	            // prj.title = projectName;
	            //initGuid=&type=TS&color=Black&category=CLO&size=14X16&webClientId=1&customerID=216851&title=201603221311
	            //initGuid=101003
	            Store.title = decodeURIComponent(UtilParam.getUrlParam("title"));
	            Store.projectId = UtilParam.getUrlParam("initGuid");
	            Store.fromCart = UtilParam.getUrlParam("fromCart");
	            Store.isPreview = UtilParam.getUrlParam("isPreview");
	            Store.previewSource = UtilParam.getUrlParam('source');
	            Store.isFromMyPhoto = UtilParam.getUrlParam("isFromMyPhoto");
	            if (Store.projectId === "") {
	                Store.isNewProject = true;
	                var PrjConstructor = __webpack_require__(14);
	                var Prj = PrjConstructor();

	                Prj.product = UtilParam.getUrlParam("type");
	                Prj.color = UtilParam.getUrlParam("color");
	                Prj.size = '14X16';
	                Prj.measure = this.getDefaultMeasure(Prj.color, Prj.size);
	                Prj.count = 1
	                _this.sharedStore.projectSettings.push(Prj);
	            }

	            if ((!Store.isPreview && user.userId === '') || ((prj && (prj.product === '' || prj.size === '')) && Store.projectId === '')) {
	                // wrong params passed in
	                // redirect
	                alert('Please log in!');
	                window.location = '/';
	                // alert('wrong parameters!');
	            };

	            // get album id by title via ajax
	            if (Store.title !== '') {
	                // call get album id
	                ProjectService.getAlbumId();
	            };

	            if (user.userId !== '' && Store.projectId !== '') {
	                // call get order state
	                if(!Store.isPreview){
	                    ProjectController.getProjectOrderedState(this);
	                }
	                __webpack_require__(9).getProjectInfo();
	            };

	            setInterval(function(){
	                __webpack_require__(8).keepAlive();
	            },1000*60*4);

	        },

	        loadProjectXml: function() {
	            var _this = this,
	                domains = _this.sharedStore.domains
	            prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];

	            if (Store.projectId) {
	                // load project xml
	                ProjectController.getOldProject();
	            } else {
	                // save new project
	                ProjectController.saveNewProject(_this);
	            };
	        },

	        getDefaultMeasure: function(color, size) {
	            var defaultMeasure = 'M';
	            var params = [{ key : 'size', value : size}];
	            var measures = ['S', 'M', 'L', 'XL', 'XXL'];
	            // var measures = require('SpecManage').getOptionsMap('measure', params).split(',');

	            if(Store.disableOptions[color]) {
	                availableMeasures = measures.filter(function(measure) {
	                    return Store.disableOptions[color].options.indexOf(measure) === -1;
	                });

	                if(availableMeasures.indexOf(defaultMeasure) === -1) {
	                    defaultMeasure = availableMeasures[0];
	                }
	            }

	            return defaultMeasure;
	        },
	    },
	    events: {

	    },
	    created: function() {
	        var _this = this;

	        // 获取线上禁用尺寸数据
	        ProjectService.getTshirtDisableOptions();
	        // 获取本地禁用尺寸数据
	        // ProjectService.getLocalTshirtDisableOptions();

	        _this.$watch('sharedStore.watches.isDisableOptionLoaded', function() {
	            _this.init();
	        });

	        // load project xml(or new) when spec done
	        _this.$watch('sharedStore.watches.isSpecLoaded', function() {
	            if (_this.sharedStore.watches.isSpecLoaded) {
	                _this.loadProjectXml();
	            };
	        });

	        // paint canvas when project xml done
	        _this.$watch('sharedStore.watches.isProjectLoaded', function() {
	            if (_this.sharedStore.watches.isProjectLoaded) {
	                // 埋点
	                __webpack_require__(11)({ev: __webpack_require__(13).LoadComplete,isNewProject: Store.isNewProject});
	                //  获取项目 title ；
	                __webpack_require__(9).getTitle();

	                console.log('project xml is OK, notify paint canvas');
	                __webpack_require__(25).initCanvasData();
	                _this.$broadcast('notifyPaint');

	                // 获取 myPhotos 的 图片列表。
	                if(Store.isFromMyPhoto == 'true'){
	                    ProjectController.getMyPhotoImages(_this,Store.userSettings.userId, false);
	                }

	                _this.$broadcast('notifyResetProjectToDefault');
	            };

	        });

	        // watch when project index changed and repaint
	        _this.$watch('sharedStore.currentSelectProjectIndex', function(newIdx, oldIdx) {
	            _this.$broadcast('notifyRepaint', oldIdx);
	        });

	    }
	});

	Store.vm = vm;

	/* system event handles */
	$(window).bind('beforeunload', function() {
	    if(/*Store.isPrjSaved === false && */Store.isPopSave === true && !Store.isPreview) {
	        return 'Unsaved changes(If any) will be discarded. Are you sure to exit?';
	    };

	    Store.isPopSave = true;

	});

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// model -- Store

	// import model Prj
	var ProjectList=[];

	// adding private property



	var Domains = __webpack_require__(2);
	var Spec = __webpack_require__(3);
	module.exports = {
	    isPreview: false,
	    isNewProject: false,
	    previewSource: '',        // '' | 'self' -- client preview, 'share' -- 3rd party share, 'factory' -- factory preview
	    operateMode: 'idle',      // to indicate which operating mode is ON for now
	                              // ''|'idle' -- default, nothing
	                              // 'drag' -- in dragging, drag an element or drag an image
	                              // 'scale' -- in scaling, scale an element
	    isLostFocus: true,
	    isInnerPreviewShow: false,
	    isChangePageShow: false,
	    isPopupShow : false,
	    isImageUploadShow: false,
	    isImageCropShow: false,
	    isOptionsViewShow: false,
	    isTextEditorShow: false,
	    isOrderViewShow: false,
	    isPrjSaved: false,
	    isPopSave: true,
	    isShowHelp:false,
	    isShowClone:false,
	    isEditLayerShow : false,
	    isShowContactUs:false,
	    cancelledUpload : [],
	    currentUploadCount : 0,
	    successfullyUploaded : 0,
	    errorUploaded : 0,
	    currentSuccessUpload : 0,
	    currentErrorUpload : 0,
	    errorUploadedFiles : [],
	    retryId : -1,
	    cancelByX : false,
	    chooseTimes : 0,
	    uploadTimes : 0,
	    filesTotal : 0,
	    filesTotalInQueue: 0, // files to be uploaded total in queue
	    filesCountInQueue: 0, // files uploaded count in queue
	    saveImage : false,    // to indicate if should show image when saving
	    isSizeChartShow : false,

	    projectSettings: ProjectList, // all common project params
	    spec: Spec,
	    domains: Domains,

	    cropImageRatio: 1, // preview image in crop window ratio,  cropImageRatio = preview size / real size
	    selectedPageIdx: 0, // current actived page's index
	    elementDragged: '',

	    dragData: {
	        imageId: '',
	        sourceImageUrl: '',
	        cursorX: 0,     // to indicate what position when user drag the preview image in image list
	        cursorY: 0,
	        isFromList: false
	    },
	    cropParams: {}, // to save temp crop params of selection
	    projects: [],          // to store all projects' breif params
	    pages: [],            // to store the current project pages setting for rendering
	    // canvas: {
	    // 	isInited: false,
	    // 	width: 0,				// canvas width
	    // 	height: 0,			// canvas height
	    // 	ratio: 1,				// view size / real size,  eg. ratio = width / oriWidth
	    // 	oriWidth: 0,		// real size
	    // 	oriHeight: 0,
	    //  oriSpineWidth: 0,
	    // 	bleedings: {},	// bleeding sizes for front end, = bleeding size + wrap size
	    //  realBleedings: {}		// real bleedings for backend
	    // 	selectedIdx: 0,	// the image index in params which was selected
	    // 	paper: '',			// svg paper object
	    // 	params: [],			// all elements params/settings from backend
	    // 	elements: [],		// svg current saved elements params/settings, with extra data
	    // 									// idx, dep, type('image'/'text'), imageUrl(current selected image path)/text, vWidth, vHeight (the view/handler size), cropX, cropY, cropW, cropH(the real crop positions done) ...
	    // 									// fontFamily, fontWeight, fontSize, color(rgba -- >), opacity(0 - 1)
	    // 	trans: [],			// the objects those store transforming
	    //  warns: [],
	    //  outerLine: '',		// to store the outer line element
	    //  bleedingRibbonLeft: '',		// to store the left bleeding element
	    //  bleedingRibbonRight: '',		// to store the right bleeding element
	    //  bleedingRibbonTop: '',		// to store the top bleeding element
	    //  bleedingRibbonBottom: '',		// to store the bottom bleeding element
	    //  spineLeft: '',	// to store the left spine element
	    //  spineRight: '',	// to store the right spine element
	    // 	elementBg: ''		// to store the bg element
	    // },
	    oriImageIds: [], // original valid image ids request from backend those for uploading
	    imageList: [], // all valid images(uploaded) info
	    deleImagelist:[],
	    fontList: [],
	    ctrls: {
	        tcResize: '', // time control of resizing interval
	        lastTranEvent: '',
	        isDragStarted: false,
	        // tranMode: '',   // indicate what mode currently, valid value 'start', 'end'
	        // tranApplyCount: 0     // count how many times 'apply' event occured in sequence
	    },
	    watches: {
	        flagRepaint: false, // vue watch flag of repaint event
	        isSpecLoaded: false,
	        isProjectLoaded: false,
	        isRefreshImage: false,
	        isCropThisImage: false,
	        isChangeThisText: false,
	        isOnDrop: false,
	        isChangeDepthFront: false,
	        isRemoveElement: false,
	        isReplaceImage : false,
	        isDisableOptionLoaded: false
	    },
	    watchData: {
	      changeDepthIdx: '',
	      cropImageIdx: '',
	      removeElementType: '',
	      removeElementIdx: ''
	    },
	    dropData: {
	        ev: '',
	        newAdded: false,        // indicate if it's dropping on 'nothing' so that a new element should be added
	        isBg: false,            // indicate the bg layer for adding background image
	        idx : '',
	        ev : ''
	    },
	    shouldNewImage: false,                //indicate if create image while drop new image on image
	    warnMargin: {
	        left: 30,
	        top: 30,
	        width: 15,
	        height: 15,
	        visible: false,
	        rate: 30
	    },
	    warnSettings : {
	        resizeLimit : 30,
	        resizeWarnMsg : 'beyond resize limit!',
	        warnImageWidth : 10,
	        warnImageHeight: 10,
	        visible : false
	    },
	    uploadProgress: [],
	    webClientId: 1,
	    currentSelectProjectIndex:0,
	    userSettings:{},
	    projectId:'',
	    projectXml:'',
	    title:'',
	    itemListNum:0,
	    fromCart:false,
	    colorOptionList: [
	        { type: 'White', title:'White',backgroundImage: 'assets/img/White-0.png', normalColor: 'assets/img/white-normal.png', pressColor: 'assets/img/white-pressed.png' },
	        { type: 'Black', title:'Black',backgroundImage: 'assets/img/Black-0.png', normalColor: 'assets/img/black-normal.png', pressColor: 'assets/img/black-pressed.png' },
	        { type: 'SportGrey', title:'Sport Grey',backgroundImage: 'assets/img/SportGrey-0.png', normalColor: 'assets/img/grey-normal.png', pressColor: 'assets/img/grey-pressed.png' },
	        { type: 'NavyBlue', title:'Navy Blue',backgroundImage: 'assets/img/NavyBlue-0.png', normalColor: 'assets/img/navy-normal.png', pressColor: 'assets/img/navy-pressed.png' },
	        { type: 'RoyalBlue', title:'Royal Blue',backgroundImage: 'assets/img/RoyalBlue-0.png', normalColor: 'assets/img/royal-normal.png', pressColor: 'assets/img/royal-pressed.png' }
	    ],
	    projectType:'CLO',
	    orderType : 'clothing',
	    isFromMarketplace: false,
	    vm: null,
	    projectInfo:{
	        isOrdered:false,
	        isInCart:false,
	        isInMarket:false
	    },
	    screenshotSize : {
	        width : 200,
	        height : 200
	    },
	    currentImage : '', //store base64 data current image make
	    uploadAcceptType:'image/jpeg,image/x-png,image/png',
	    // uploadAcceptType:'image/*',
	    checkFailed:false,
	    warnTipLimit: 200,
	    warnTipMargin: 5,
	    warnTipBottom: 5,
	    warnTipLeft: 5,
	    disableOptions: []
	};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	
	// model -- Prj
	module.exports = {
		baseUrl: '',						// e.g. http://www.artisanstate.com.d
		uploadUrl: '',					// e.g. http://upload.artisanstate.com.d
		productBaseUrl: '',			// e.g. http://api.artisanstate.com.d
		proxyFontBaseUrl: '',		// e.g. http://www.artisanstate.com.d/api
		portalBaseUrl: '',			// e.g. http://portal.artisanstate.com.d
		layoutTemplateServerBaseUrl: ''	,	// e.g. http://assets.test.artisanstate.s3.amazonaws.com
		assetBaseUrl: '',			//e.g.  http://img96.dev.zno.s3.amazonaws.com
		calendarBaseUrl: '',         //e.g.  http://artisanstate-artwork.s3.amazonaws.com
		backendBaseUrl: ''		//e.g. http://backend.zno.com.d
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports={
		dpi:300,
		imageQualityBufferPercent:30,
		products:[],
		colors:[],
		sizes:[],
		measures:[],
		specXml:''
	}

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Store) {module.exports = {
	    loadDomainUrls: function() {
	        $.ajax({
	            url: '/userid/getEnv?webClientId=1&autoRandomNum=' + __webpack_require__(7).getRandomNum(),
	            type: 'get',
	            async: false
	        }).done(function(dResult) {
	            if (dResult) {

	                Store.domains.baseUrl = $(dResult).find('baseUrl').text().substr(0, $(dResult).find('baseUrl').text().length - 1) || '';
	                Store.domains.proxyFontBaseUrl = Store.domains.baseUrl + '/api';
	                Store.domains.calendarBaseUrl = $(dResult).find('calendarBaseUrl').text().substr(0, $(dResult).find('calendarBaseUrl').text().length - 1) || '';
	                Store.domains.uploadUrl = $(dResult).find('uploadBaseUrl').text().substr(0, $(dResult).find('uploadBaseUrl').text().length - 1) || '';
	                Store.domains.productBaseUrl = $(dResult).find('productBaseURL').text().substr(0, $(dResult).find('productBaseURL').text().length - 1) || '';
	                Store.domains.portalBaseUrl = $(dResult).find('portalBaseURL').text().substr(0, $(dResult).find('portalBaseURL').text().length - 1) || '';
	                Store.domains.layoutTemplateServerBaseUrl = $(dResult).find('layoutTemplateServerBaseUrl').text().substr(0, $(dResult).find('layoutTemplateServerBaseUrl').text().length - 1) || '';
	                Store.domains.backendBaseUrl = $(dResult).find('backendBaseURL').text().substr(0, $(dResult).find('backendBaseURL').text().length - 1) || '';
	            };
	        });
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports={
		getRandomNum:function(){
			return Math.round(Math.random()*10000000000000);
		},

		getInchByPx: function(nPx) {
			nPx = parseFloat(nPx) || 0;

			return nPx / 300;
		},

		getPxByInch: function(nInch) {
			nInch = parseFloat(nInch) || 0;

			return nInch * 300;
		},

		//change MM to Inch
		getInchByMM: function(nMM){
			nMM = parseFloat(nMM) || 0;

			var nPx = parseFloat(nMM * 30 / 2.54);

			return (nPx / 300).toFixed(7)
		},

		// change px into pt
		getPtByPx: function(nPx) {
			nPx = parseFloat(nPx) || 0;

			return nPx / 300 * 72;
		},

		getPxByPt: function(nPt) {
			nPt = parseFloat(nPt) || 0;

			return nPt * 300 / 72;
		},

		getPxByMM: function(nMM) {
			nMM = parseFloat(nMM) || 0;

			return nMM * 30 / 2.54;
		},

		hexToDec : function(hex){
				return parseInt(hex.replace("#",""),16);
		},

		decToHex : function(dec){
			var hex = (dec).toString(16);
			while(hex.length<6){
					hex = "0" + hex;
			}
			return "#" + hex;
		},
		rgbToHsl: function(r, g, b){
	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min){
	        h = s = 0;
	    }else{
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }

	    return [h, s, l];
		},

		// get the view font size fit for screen
		getTextViewFontSize: function(nRealSize) {
			if(nRealSize && nRealSize > 0) {
				var ratio = Store.pages[Store.selectedPageIdx].canvas.ratio;

				var viewSize = parseFloat(nRealSize) * ratio;

				return viewSize;
			}
			else {
				return 0;
			};
		},

		toFixed: function(num, remainDecimal) {
			const str = String(num);
			const dottedIndex = str.indexOf('.');
		
			if (dottedIndex !== -1) {
				// 有一位是点.
				return str.substr(0, dottedIndex + remainDecimal + 1);
			}
		
			return str;
		},

		round: function(num, remainDecimal) {
			if (isNaN(num)) {
				return 0;
			}
		
			// 100, 1000...
			const step = Math.pow(10, 2);
			const v = Math.round(num * step) / step;
		
			return parseFloat(this.toFixed(v, remainDecimal));
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Store) {module.exports = {
	    getUserInfo: function() {
	        $.ajax({
	            url: Store.domains.baseUrl + '/BigPhotoBookServlet/getSessionUserInfo?webClientId=' + Store.webClientId + '&autoRandomNum=' +  __webpack_require__(7).getRandomNum(),
	            type: 'get',
	            dataType: 'xml',
	            async: false
	        }).done(function(specResult) {
	            Store.userSettings.userId = $(specResult).find('user').attr('id');
	            /*if (Store.userSettings.userId.length <= 0&&!Store.isPreview) {
	                alert('Please log in!');
	            }*/
	            Store.userSettings.uploadTimestamp = $(specResult).find('user').find('timestamp').text();
	            Store.userSettings.token = $(specResult).find('user').find('authToken').text();
	            Store.userSettings.userName=$(specResult).find('user').find('firstName').text();
	            Store.userSettings.email=$(specResult).find('user').find('email').text();
	        });
	    },
	    keepAlive:function() {
	        $.ajax({
	            url: Store.domains.baseUrl + '/userid/'+Store.userSettings.userId+'/heartbeat',
	            type: 'get',
	            dataType: 'xml'
	        }).done(function(specResult) {
	        });
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Store) {// var been=require('beenjs');
	module.exports = {
	    loadLocalProject: function() {
	        console.log('projectService');
	        $.ajax({
	            url: './assets/data/tshirt-project.1.0.xml',
	            type: 'get',
	            dataType: 'xml',
	            async: false
	        }).done(function(projectResult) {

	            Store.xml = projectResult;

	        });
	    },
	    insertProject: function(obj,xml) {
	        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
	        Store.projectXml = xml;
	        var encodeimage="";
	        var title = Store.title;
	        var quantity = Store.quantity ?  Store.quantity : 1;
	        var crossSell = Store.mainProjectUid ? 'cart' : '';
	        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR"||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="IPadCase"){
	            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
	        }
	        if(Store.projectType==="CV"||Store.projectType==="FM"){
	            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	            var product = currentProject.product;
	            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: { mainProjectUid:Store.mainProjectUid,crossSell:crossSell,removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey() ,isFromMarketplace : Store.isFromMarketplace, title: title,quantity: quantity }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                console.log('new project successfully' + result);
	                Store.projectId = $(result).find('guid').text() || '';
	                Store.projectXml = result;
	                //require('CanvasController').initCanvasData();
	                Store.watches.isProjectLoaded = true;
	                Store.isNewInsertProject = true;
	                // Store.isPrjSaved=true;
	            } else {
	                //require('CanvasController').initCanvasData();
	                Store.watches.isProjectLoaded = true;
	                if($(result).find('errorCode').text()==="-3"){
	                    //obj.$dispatch('dispatchShowPopup', { type: 'save', status: -2});
	                    obj.$dispatch('dispatchShowProjectChooseWindow');
	                }

	            };
	        });
	    },
	    saveProject: function(obj, xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH,callback) {
	        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
	        var encodeimage="";
	        var title = Store.title;
	        var quantity = Store.quantity ?  Store.quantity : 1;
	        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint"|| Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
	            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
	        }

	        if(Store.projectType==="CV"||Store.projectType==="FM"){
	            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	            var product = currentProject.product;
	            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'xml',
	            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity },
	            error: function(result) {
	                Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
	            }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                Store.projectXml = result;
	                if(callback && typeof callback==="function"){
	                    callback();
	                }else{
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
	                }
	                __webpack_require__(11)({ev: __webpack_require__(13).SaveComplete});
	                Store.isPrjSaved=true;

	            }else if(result && $(result).find('resultData').attr('state') === 'fail'){

	                if($(result).find('code').text()==="201"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
	                    Store.vm.$broadcast('notifyCloseWindow');
	                }else if($(result).find('code').text()==="202"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
	                    Store.vm.$broadcast('notifyCloseWindow');
	                }else if($(result).find('code').text()==="205"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
	                }else{
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
	                }
	            }else {
	                // been.showMsg('Save failed.', 'fail', 'Message',null,null,'ok');
	                obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
	            };
	        });
	    },
	    orderProject: function(obj,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH) {
	        if(!Store.projectId){
	            return;
	        }
	        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
	        var encodeimage="";
	        var title = Store.title;
	        var quantity = Store.quantity ?  Store.quantity : 1;
	        if(Store.projectType==="CV"||Store.projectType==="FM" || Store.projectType === "PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
	            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
	        }
	        if(Store.projectType==="CV"||Store.projectType==="FM"){
	            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	            var product = currentProject.product;
	            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'xml',
	            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity },
	            error: function(result) {
	                Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
	            }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                console.log('save project successfully' + result);
	                console.log('errorCode' + $(result).find('errorCode').text());
	                Store.projectXml = result;
	                Store.isPrjSaved=true;
	                Store.isPopSave = false;
	                window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=' + quantity;
	            }else if(result && $(result).find('resultData').attr('state') === 'fail'){
	                if($(result).find('code').text()==="201"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
	                    Store.vm.$broadcast('notifyCloseWindow');
	                }else if($(result).find('code').text()==="205"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
	                }else{
	                    obj.$dispatch("dispatchShowPopup", { type : 'order', status : -1});
	                }
	            }else {
	                obj.$dispatch("dispatchShowPopup", { type : 'order', status : -1});
	            };
	        });
	    },
	    getShareProject:function(){

	        var _this = this;
	        $.ajax({
	            url: Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId),
	            type: 'get',
	            dataType: 'xml',
	            data: 'webClientId=1'
	        }).done(function(result) {
	            if (result) {
	                //Store.projectXml = (new XMLSerializer()).serializeToString(result);
	                Store.encProjectId = Store.projectId;
	                Store.projectXml = result;
	                Store.title = $(result).find('title').text();
	                Store.projectId = $(result).find('guid').text();
	                Store.projectSettings.length=0;
	                for (var i = 0; i < $(result).find('spec').length; i++) {

	                    var spec = $(result).find('spec').eq(i);

	                    var PrjConstructor = __webpack_require__(14);
	                    var Prj = PrjConstructor();

	                    for (var j = 0; j < spec.find('option').length; j++) {
	                        var option = spec.find('option').eq(j);
	                        Prj[option.attr('id')]=option.attr('value');
	                    };
	                    // value fix for old flex project
	                    if(Prj.category === 'categoryFrame' || Prj.category === 'categoryCanvas' || Prj.category === 'categoryWallarts') {
	                      Prj.metalType = Prj.metalType || 'none';
	                      Prj.finish = Prj.finish || 'none';
	                    };
	                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
	                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
	                        Prj[setting.attr('id')]=setting.attr('value');
	                    }
	                    if($(result).find('frameBoard')){
	                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
	                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
	                    }
	                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
	                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
	                            Store.cardId = $(result).find('card').attr('id');
	                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
	                            Prj.trim= Prj.trim || $(result).find('trim').attr('value');
	                    };
	                    console.log(Prj);

	                    Store.projectSettings.push(Prj);
	                }



	                _this.getAlbumId();
	                //require('CanvasController').initCanvasData();
	                Store.watches.isProjectLoaded = true;
	            }
	        });

	    },
	    getProject: function() {
	        var _this = this;
	        $.ajax({
	            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId,
	            type: 'get',
	            dataType: 'xml',
	            data: 'webClientId=1&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {

	                Store.projectXml = result;
	                Store.title = $(result).find('title').text();
	                Store.projectId = $(result).find('guid').text();
	                Store.projectSettings.length=0;
	                for (var i = 0; i < $(result).find('spec').length; i++) {

	                    var spec = $(result).find('spec').eq(i);

	                    var PrjConstructor = __webpack_require__(14);
	                    var Prj = PrjConstructor();

	                    for (var j = 0; j < spec.find('option').length; j++) {
	                        var option = spec.find('option').eq(j);
	                        Prj[option.attr('id')]=option.attr('value');
	                        if(Prj[option.attr('id')]==="None"){
	                            Prj[option.attr('id')]="none";
	                        }
	                    };
	                    // value fix for old flex project
	                    if(Prj.category === 'categoryFrame' || Prj.category === 'categoryCanvas' || Prj.category === 'categoryWallarts') {
	                      Prj.metalType = Prj.metalType || 'none';
	                      Prj.metalType === 'undefined'? Prj.metalType = 'none': Prj.metalType;
	                      Prj.finish = Prj.finish || 'none';
	                      Prj.finish === 'undefined'? Prj.finish = 'none': Prj.finish;
	                    };
	                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
	                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
	                        Prj[setting.attr('id')]=setting.attr('value');
	                    }
	                    if($(result).find('frameBoard')){
	                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
	                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
	                    }

	                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
	                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
	                            Store.cardId = $(result).find('card').attr('id');
	                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
	                            Prj.trim= Prj.trim ? Prj.trim : $(result).find('trim').attr('value');
	                    };

	                    console.log(Prj);

	                    Store.projectSettings.push(Prj);
	                }

	                if(Store.projectType=="PR"){
	                    if($(result).find('spec')&&$(result).find('spec').length>0){
	                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
	                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
	                        Store.baseProject.size=size;
	                        Store.baseProject.paper=paper;
	                    }else{
	                        Store.baseProject.size='4X6';
	                        Store.baseProject.paper='GP';
	                    }
	                }

	                if(Store.projectType=="flushMountPrint"){
	                    if($(result).find('spec')&&$(result).find('spec').length>0){
	                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
	                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
	                        var surfaceType=$(result).find('spec').eq(0).find('option[id="surfaceType"]').attr("value");
	                        Store.baseProject.size=size;
	                        Store.baseProject.paper=paper;
	                        Store.baseProject.surfaceType=surfaceType;
	                    }else{
	                        Store.baseProject.size='4X6';
	                        Store.baseProject.paper='GP';
	                        Store.baseProject.surfaceType='SS';
	                    }
	                }

	                _this.getAlbumId();
	                //require('CanvasController').initCanvasData();
	                Store.watches.isProjectLoaded = true;

	                //console.log(require("ProjectManage").getFrameBorderAsset());
	            }
	        });


	    },
	    getAlbumId: function() {

	        var _instance = this;

	        $.ajax({
	            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/getAlbumId?albumName=' + encodeURIComponent(Store.title),
	            type: 'get'
	        }).done(function(aResult) {
	            if (aResult && $(aResult).find('resultData').attr('state') === 'success') {
	                Store.userSettings.albumId = $(aResult).find('albumId').text() || '';
	            } else {
	                Store.userSettings.albumId = '';
	                _instance.addOrUpdateAlbum(Store.title);
	            }
	        });
	    },
	    addOrUpdateAlbum: function(title, obj, eventName) {
	        var timestamp = (new Date()).valueOf();
	        $.ajax({
	            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
	            type: 'get',
	            data: 'timestamp=' + timestamp + '&albumId=' + Store.userSettings.albumId + '&albumName=' + title + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {
	                if ($(result).find('resultData').attr('state') == 'success') {
	                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
	                    if (obj)
	                        obj.$dispatch(eventName, false, 'This title already exists, please try again.');

	                } else {

	                    if (obj)
	                        obj.$dispatch(eventName, true, 'This title already exists, please try again.');

	                }
	            }
	        });
	    },
	    handledSaveProject: function(obj,eventName,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH) {
	        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
	        var encodeimage="";
	        var title = Store.title;
	        var quantity = Store.quantity ?  Store.quantity : 1;
	        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
	            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
	        }
	        if(Store.projectType==="CV"||Store.projectType==="FM"){
	            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	            var product = currentProject.product;
	            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'xml',
	            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title, quantity: quantity }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                console.log('save project successfully' + result);
	                Store.projectXml = result;
	                Store.isPrjSaved=true;
	                //been.showMsg('Save success.', 'default', 'Message',null,null,'ok');
	                obj.$dispatch(eventName,'success');

	            } else {

	                if($(result).find('code').text()==="205"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
	                }else{
	                    obj.$dispatch(eventName,'failed');
	                }
	            };
	        });
	    },
	    getProjectOrderedState: function(obj) {
	        $.ajax({

	            url: '/userid/' + Store.userSettings.userId + '/getProjectOrderedState/' + Store.projectId,
	            type: 'get',
	            dataType: 'xml',
	            data: 'webClientId=1&autoRandomNum=' + __webpack_require__(7).getRandomNum()

	        }).done(function(result) {
	            if (result) {

	                Store.userSettings.ordered = $(result).find('ordered').text()=="true"?true:false;
	                Store.checkFailed=$(result).find('checkFailed').text()=="true"?true:false;
	                Store.watches.isProjectOrderedStateLoaded = true;


	                if (Store.userSettings.ordered == "true") {
	                    //obj.$dispatch("dispatchShowPopup", { type : 'isOrder',status:-1});
	                }
	            };
	        });
	    },
	    sentContactUs: function(obj,question, featureRequest, bug,os,browser) {

	        $.ajax({
	            url: Store.domains.baseUrl + '/userid/service/feedback',
	            type: 'post',
	            dataType: 'xml',
	            data: {
	                userId: Store.userSettings.userId,
	                userName: Store.userSettings.userName,
	                userEmail: Store.userSettings.email,
	                sku: '',
	                projectName: Store.title,
	                projectId: Store.projectId,
	                autoRandomNum: __webpack_require__(7).getRandomNum(),
	                webClientId: 1,
	                os: os,
	                browser: browser,
	                question: question,
	                featureRequest: featureRequest,
	                bug: bug
	            }

	        }).done(function(result) {
	            if ($(result).find('resultData').attr('state') == 'success') {
	                obj.$dispatch("dispatchShowPopup", { type : 'contact', status : 0})
	            }else{
	                obj.$dispatch("dispatchShowPopup", { type : 'contact', status : -1})
	            }
	        });
	    },
	    cloneProject:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
	        var _this = this;
	        var encodeimage = '';
	        var timestamp = (new Date()).valueOf();
	        $.ajax({
	            url: '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
	            type: 'get',
	            data: 'timestamp=' + timestamp + '&albumId=&albumName=' + newTitle + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {
	                if ($(result).find('resultData').attr('state') == 'success') {
	                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
	                    var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
	                    var title = Store.title;
	                    var quantity = Store.quantity ?  Store.quantity : 1;
	                    if(Store.projectType==="CV" || Store.projectType==="FM" || Store.projectType === "PHC" || Store.projectType==="IPadCase"){
	                        encodeimage=_this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
	                    }
	                    if(Store.projectType==="CV"||Store.projectType==="FM"){
	                        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	                        var product = currentProject.product;
	                        url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
	                    }
	                    $.ajax({
	                        url: url,
	                        type: 'post',
	                        data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
	                    }).done(function(result) {
	                        if (result && $(result).find('resultData').attr('state') === 'success') {
	                            var successString = 'Clone and saved successfully';
	                            Store.projectId = $(result).find('guid').text() || '';
	                            Store.projectXml = result;
	                            Store.isPrjSaved=true;
	                            //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 , info:successString});
	                            Store.vm.$broadcast('notifyHideCloneWindow');
	                            __webpack_require__(9).getProjectInfo();
	                        } else {
	                            var failedString = 'Clone failed';
	                            Store.title=oldTitle;
	                            Store.vm.$broadcast('notifyShowInvalidTitle',failedString);
	                            //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 , info:failedString});

	                        };
	                    });
	                }else if($(result).find('resultData').attr('state') == 'fail'){
	                    var errorCode = $(result).find('errorCode').text();
	                    var errorString;
	                    Store.title=oldTitle;
	                    if(errorCode === "1"){
	                        errorString= "Title existed, please pick another one.";
	                    }else if(errorCode === "2"){
	                        errorString = "Please input new project name";
	                    }else{
	                        errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
	                    }
	                    Store.vm.$broadcast('notifyShowInvalidTitle',errorString);
	                    //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 ,info:errorString});

	                }
	            }

	        });
	    },
	    getScreenshot:function(){
	        return __webpack_require__(15).convertScreenshotToBase64();
	    },
	    getProjectInfo: function() {
	        if(Store.isPreview && Store.source === 'factory') return;

	        $.ajax({

	            url: Store.domains.baseUrl +'/clientH5/projectInfo/' + Store.projectId + "?" + new Date().getTime(),
	            type: 'get',
	            dataType: 'json'

	        }).done(function(result) {
	            if (result) {
	                Store.projectInfo.isOrdered=result.order===1?true:false;
	                Store.projectInfo.isInCart=result.cart===1?true:false;
	                if(result.market === 1 || result.market === 2){
	                     Store.projectInfo.isInMarket=true;
	                }else{
	                    Store.projectInfo.isInMarket=false;
	                }
	                if((typeof result.market) !== "undefined"){
	                    Store.isShowPostToSale=true;
	                }
	                Store.watches.isProjectInfoLoaded = true;
	                Store.vm.$dispatch('dispatchResetProjectInfo');
	            }
	        });
	    },

	    updateCheckStatus: function(obj) {
	        $.ajax({

	            url: '/userid/'+Store.userSettings.userId+'/submitCheckFailProject/'+Store.projectId+'?isParentBook=false&redirectParentBook=false',
	            type: 'get',
	            dataType: 'xml'
	        }).done(function(result) {
	            if (result) {
	                var code = $(result).find('code').text();
	                if(code==="200"){
	                    Store.checkFailed=false;
	                    if(Store.submitTitle){

	                        Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Thank you for submitting your changes to this ordered "+Store.submitTitle+" project. We will review this "+Store.submitTitle+" project again. If no issue is found, we will proceed with your order processing."});

	                    }else{
	                        Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Thank you for submitting your changes to this ordered frame project. We will review this frame project again. If no issue is found, we will proceed with your order processing."});
	                    }
	                }else{
	                    Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"notifyShowInvalidTitle','Submit failed, please try again or contact us."});

	                }

	            };
	        });
	    },
	    getPhotoPrice:function(product,options,idx){
	        if(Store.isTopPriceShow) return;
	        var isInclude = false;
	        for (var i = 0; i < Store.priceOptions.length; i++) {
	            var key = Store.priceOptions[i].key;
	            var value = Store.priceOptions[i].value;
	            if(key && key == options){
	                isInclude = true;
	                if(value){
	                    Store.projectSettings[idx].price = value;
	                }else{
	                    var idxs = Store.priceOptions[i].idxs;
	                    if(idxs.indexOf(idx) == -1){
	                        Store.priceOptions[i].idxs.push(idx);
	                    }
	                }
	            }
	        }
	        if(!isInclude){
	            var option = {"key":options,"value":"",idxs:[idx]};
	            Store.priceOptions.push(option);
	        }else{
	            return ;
	        }

	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: { product : product,options : options,timestamp : Store.freshTimestamp || 0 },
	            dataType : 'json'
	        }).done(function(result){
	            console.log("getPhotoPrice",options);
	            if(result){
	                if(result.couponId){
	                    Store.projectSettings[idx].price = +result.sPrice;
	                }else{
	                    Store.projectSettings[idx].price = +result.oriPrice;
	                }
	                for (var i = 0; i < Store.priceOptions.length; i++) {
	                    var key = Store.priceOptions[i].key;
	                    var value = Store.priceOptions[i].value;
	                    if(key && key == options){
	                        for (var j = 0; j < Store.priceOptions[i].idxs.length; j++) {
	                            Store.projectSettings[Store.priceOptions[i].idxs[j]].price = Store.projectSettings[idx].price;
	                        }
	                        Store.priceOptions[i].value = Store.projectSettings[idx].price;
	                        Store.priceOptions[i].idxs = [];
	                    }
	                };
	            }else{
	                console.log(result.error);
	            }
	        });
	    },
	    getNewPrintPrice:function(){
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var product = Store.baseProject.product;
	        var options = [];

	        if(!Store.isTopPriceShow) return;

	        optionIds.forEach(function(optionId) {
	            if(optionId !== 'product') {
	                options.push(Store.baseProject[optionId]);
	            }
	        });

	        options = options.filter(function(option) {
	            return option && option !== 'none';
	        });
	        var _this = this;
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: { product : product, options : options.join(','), timestamp : Store.freshTimestamp || 0},
	            dataType : 'json'
	        }).done(function(result){
	            console.log("getNewPrintPrice",options);
	            if(result){
	                Store.photoPrice.oriPrice = +result.oriPrice;
	                Store.photoPrice.sPrice = +result.sPrice;
	                Store.photoPrice.couponId = result.couponId || '';
	                Store.photoPrice.options = result.options || {};
	                Store.priceChange = true;
	            }else{
	                console.log(result.error);
	            }
	        });
	    },
	    getCanvasPrice:function(product,options,userId){
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: { product : product,options : options,userId : userId},
	            dataType : 'json'
	        }).done(function(result){
	            console.log(result);
	            if(result){
	                Store.photoPrice.oriPrice = (result.oriPrice - 0).toFixed(2) - 0;
	                Store.photoPrice.sPrice = (result.sPrice - 0).toFixed(2) - 0;
	                Store.photoPrice.couponId = result.couponId || '';
	                Store.photoPrice.options = result.options || {};

	                Store.priceChange = true;
	            }else{
	                console.log(result.error);
	            }
	        })
	    },
	    getPadPrice:function(product,options,userId){
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: { product : product,options : options,userId : userId},
	            dataType : 'json'
	        }).done(function(result){
	            console.log(result);
	            if(result){
	               if(typeof result.trialPrice !=='undefined'){
	                    Store.photoPrice.trialPrice = +result.trialPrice;
	                }else {
	                    if(result.sPrice>0){
	                        Store.photoPrice.trialPrice = +result.sPrice;
	                    }
	                }
	                Store.photoPrice.oriPrice = +result.oriPrice;
	                Store.priceChange = true;
	            }else{
	                console.log(result.error);
	            }
	        })
	    },
	    getPosterPrice:function(product,options,userId){
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: { product : product,options : options,userId : userId},
	            dataType : 'json'
	        }).done(function(result){
	            console.log(result);
	            if(result){
	               /* if(typeof result.trialPrice !=='undefined'){
	                    Store.photoPrice.trialPrice ="$ "+ (result.trialPrice-0).toFixed(2);
	                }else {
	                    if(result.sPrice>0){
	                        Store.photoPrice.trialPrice ="$ "+ (result.sPrice-0).toFixed(2);
	                    }
	                }
	                Store.photoPrice.oriPrice ="$ "+ result.oriPrice;
	                Store.priceChange = true;*/
	                Store.photoPrice.oriPrice = (result.oriPrice - 0).toFixed(2) - 0;
	                Store.photoPrice.sPrice = (result.sPrice - 0).toFixed(2) - 0;
	                Store.photoPrice.couponId = result.couponId || '';
	                Store.photoPrice.options = result.options || {};

	                Store.priceChange = true;
	            }else{
	                console.log(result.error);
	            }
	        })
	    },
	    getCardsPrice:function(product,options,quantity,rounded,userId){
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/book/price',
	            type: 'get',
	            data: {
	                product : product,
	                options : options
	            },
	            dataType : 'json'
	        }).done(function(result){
	            if(result){
	                var mainPrice = result.data.main;
	                var optionPrice = result.data.options;

	                Store.photoPrice.oriPrice = +mainPrice.oriPrice;
	                Store.photoPrice.sPrice = +mainPrice.sPrice;
	                Store.photoPrice.couponId = mainPrice.couponId || '';
	                Store.photoPrice.options = optionPrice || {};

	                Store.priceChange = true;
	            }else{
	                console.log(result.error);
	            }
	        })
	    },
	    getLMCPrice: function(product, size, shape, options, userId) {
	        $.ajax({
	            url: Store.domains.baseUrl+'/clientH5/product/price',
	            type: 'get',
	            data: {
	                product : product,
	                options : options,
	                userId : userId
	            },
	            dataType : 'json'
	        }).done(function(result){
	            if(result){
	                Store.photoPrice.allSize.push({
	                    size: size,
	                    shape: shape,
	                    oriPrice: result.oriPrice - 0,
	                    sPrice: result.sPrice - 0
	                });

	                Store.priceChange = true;
	            }else{
	                console.log(result);
	            }
	        });
	    },
	    saveRemarkProject : function(successCallback,failedCallback){
	        var xml = __webpack_require__(18).getRemarkProjectXml();
	        var url = Store.domains.portalBaseUrl + '/portal/h5-client/feedBackPrintsRemark.ep';
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: { projectId : Store.projectId, remarkProjectXml : xml, orderNumber : Store.orderNumber,timestamp:Store.timestamp,token:Store.token,pUser:Store.pUser}
	        }).done(function(result) {
	            console.log(result);

	            if(result && $(result).find('resultData').attr('state') === 'success'){
	                successCallback && successCallback();
	                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
	            }else{
	                failedCallback && failedCallback();
	                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});

	            }
	        });
	    },
	    // saveNewPrintRemarkProject : function(successCallback,failedCallback){
	    //     var projectJson = require('JsonProjectManage').getRemarkProjectXml();
	    //     var url = Store.domains.portalBaseUrl + '/portal/h5-client/feedBackPrintsRemark.ep';
	    //     $.ajax({
	    //         url: url,
	    //         type: 'post',
	    //         data: { projectId : Store.projectId, remarkProjectXml : projectJson, orderNumber : Store.orderNumber,timestamp:Store.timestamp,token:Store.token,pUser:Store.pUser}
	    //     }).done(function(result) {
	    //         console.log(result);

	    //         if(result && $(result).find('resultData').attr('state') === 'success'){
	    //             successCallback && successCallback();
	    //             Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
	    //         }else{
	    //             failedCallback && failedCallback();
	    //             Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});

	    //         }
	    //     });
	    // },
	    getPortalProject:function(){

	        var _this = this;
	        $.ajax({
	            url: Store.domains.portalBaseUrl + '/portal/projectProcess/getProjectById.ep?projectId='+ encodeURIComponent(Store.projectId),
	            type: 'get',
	            dataType: 'xml'
	        }).done(function(result) {
	            if (result) {
	                Store.encProjectId = Store.projectId;
	                Store.projectXml = result;
	                Store.title = $(result).find('title').text();
	                Store.projectId = $(result).find('guid').text();
	                Store.projectSettings.length=0;
	                for (var i = 0; i < $(result).find('spec').length; i++) {

	                    var spec = $(result).find('spec').eq(i);

	                    var PrjConstructor = __webpack_require__(14);
	                    var Prj = PrjConstructor();

	                    for (var j = 0; j < spec.find('option').length; j++) {
	                        var option = spec.find('option').eq(j);
	                        Prj[option.attr('id')]=option.attr('value');
	                        if(Prj[option.attr('id')]==="None"){
	                            Prj[option.attr('id')]="none";
	                        }
	                    };
	                    // value fix for old flex project
	                    if(Prj.category === 'categoryFrame' || Prj.category === 'categoryCanvas' || Prj.category === 'categoryWallarts') {
	                      Prj.metalType = Prj.metalType || 'none';
	                      Prj.metalType === 'undefined'? Prj.metalType = 'none': Prj.metalType;
	                      Prj.finish = Prj.finish || 'none';
	                      Prj.finish === 'undefined'? Prj.finish = 'none': Prj.finish;
	                    };
	                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
	                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
	                        Prj[setting.attr('id')]=setting.attr('value');
	                    }
	                    if($(result).find('frameBoard')){
	                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
	                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
	                    }

	                    console.log(Prj);

	                    Store.projectSettings.push(Prj);
	                }
	                if(Store.projectType=="PR"){
	                    if($(result).find('spec')&&$(result).find('spec').length>0){
	                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
	                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
	                        Store.baseProject.size=size;
	                        Store.baseProject.paper=paper;
	                    }else{
	                        Store.baseProject.size='4X6';
	                        Store.baseProject.paper='GP';
	                    }
	                }

	                if(Store.projectType=="flushMountPrint"){
	                    if($(result).find('spec')&&$(result).find('spec').length>0){
	                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
	                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
	                        var surfaceType=$(result).find('spec').eq(0).find('option[id="surfaceType"]').attr("value");
	                        Store.baseProject.size=size;
	                        Store.baseProject.paper=paper;
	                        Store.baseProject.surfaceType=surfaceType;
	                    }else{
	                        Store.baseProject.size='4X6';
	                        Store.baseProject.paper='GP';
	                        Store.baseProject.surfaceType='SS';
	                    }
	                }

	                _this.getAlbumId();
	                //require('CanvasController').initCanvasData();
	                Store.watches.isProjectLoaded = true;
	            }
	        });

	    },
	    getProjectIdByTitle:function(title){
	        var customerId=Store.userSettings.userId;
	        $.ajax({
	            url: Store.domains.baseUrl+'/userid/getProjectUidByTitleAndCid.ep?customerId='+customerId+'&title='+encodeURIComponent(title),
	            type: 'get'
	        }).done(function(result){
	            if (result && $(result).find('resultData').attr('state') === 'success' ) {
	                Store.projectId = $(result).find('projectId').text() || '';
	                Store.vm.$dispatch("dispatchGetProjectIdByTitleSuccess");
	            }
	        });

	    },
	    createProject:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
	        var _this = this;
	        var encodeimage = '';
	        var timestamp = (new Date()).valueOf();
	        $.ajax({
	            url: '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
	            type: 'get',
	            data: 'timestamp=' + timestamp + '&albumId=&albumName=' + newTitle + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {
	                if ($(result).find('resultData').attr('state') == 'success') {
	                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
	                    var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
	                    var title = Store.title;
	                    var quantity = Store.quantity ?  Store.quantity : 1;
	                    if(Store.projectType==="CV"||Store.projectType==="FM"){
	                        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	                        var product = currentProject.product;
	                        url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
	                    }
	                    $.ajax({
	                        url: url,
	                        type: 'post',
	                        data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
	                    }).done(function(result) {
	                        if (result && $(result).find('resultData').attr('state') === 'success') {
	                            var successString = 'Create and saved successfully';
	                            Store.projectId = $(result).find('guid').text() || '';
	                            Store.projectXml = result;
	                            Store.watches.isProjectLoaded = true;
	                            Store.vm.$broadcast('notifyHideNewProjectWindow');
	                            __webpack_require__(9).getProjectInfo();
	                        } else {
	                            var failedString = 'Create failed';
	                            Store.title=oldTitle;
	                            Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',failedString);

	                        };
	                    });
	                }else if($(result).find('resultData').attr('state') == 'fail'){
	                    var errorCode = $(result).find('errorCode').text();
	                    Store.errCode = false;
	                    var errorString;
	                    Store.title=oldTitle;
	                    if(errorCode === "1"){
	                        errorString= "Title existed, please pick another one.";
	                    }else if(errorCode === "2"){
	                        errorString = "Please input new project name";
	                    }else{
	                        errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
	                    }
	                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
	                    //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 ,info:errorString});

	                }
	            }

	        });
	    },
	    createProjectAddOrUpdateAlbum: function(newTitle,oldTitle, success, failed) {
	        var timestamp = (new Date()).valueOf();
	        $.ajax({
	            url: '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
	            type: 'get',
	            data: 'timestamp=' + timestamp + '&albumId=&albumName=' + newTitle + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {
	                if ($(result).find('resultData').attr('state') == 'success') {
	                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
	                   success && success(newTitle);
	                }
	                else if($(result).find('resultData').attr('state') == 'fail'){
	                    var errorCode = $(result).find('errorCode').text();
	                    var errorString;
	                    Store.title=oldTitle;
	                    if(errorCode === "1"){
	                        errorString= "Title existed, please pick another one.";
	                    }else if(errorCode === "2"){
	                        errorString = "Please input new project name";
	                    }else{
	                        errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
	                    }
	                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
	                   failed && failed(newTitle);

	                }
	            }
	        });
	    },
	    createProjectSuccess:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
	        var encodeimage = '';
	        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
	        var title = Store.title;
	        var quantity = Store.quantity ?  Store.quantity : 1;
	        Store.errCode = true;
	        if(Store.projectType==="CV"||Store.projectType==="FM"){
	            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	            var product = currentProject.product;
	            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
	        }
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: __webpack_require__(10).getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
	        }).done(function(result) {
	            if(result){
	                if (result && $(result).find('resultData').attr('state') === 'success') {
	                    var successString = 'Create and saved successfully';
	                    Store.projectId = $(result).find('guid').text() || '';
	                    Store.projectXml = result;
	                    Store.watches.isProjectLoaded = true;
	                    Store.vm.$broadcast('notifyHideNewProjectWindow');
	                    __webpack_require__(9).getProjectInfo();
	                } else {
	                    var failedString = 'Create failed';
	                    Store.title=oldTitle;
	                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',failedString);

	                };
	            }
	        });
	    },
	    getTitle: function() {
	        var _this = this;
	        var url = Store.domains.baseUrl +  '/web-api/customerId/' + Store.userSettings.userId + '/getProjectNameByProjectId';
	        $.ajax({
	            url: url,
	            type: 'get',
	            data: 'projectId=' + Store.projectId + '&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result){
	            if(result){
	                if(result.respCode === '200') {
	                    Store.title = result.projectName;
	                    _this.getAlbumId();
	                }
	            }
	        })
	    },
	    changeProjectTitle: function(title,obj,eventName) {
	        var url = Store.domains.baseUrl +  '/web-api/customerId/' + Store.userSettings.userId + '/updateProjectAndAlbumTitle';
	        $.ajax({
	            url: url,
	            type: 'get',
	            data: 'projectId=' + Store.projectId + '&projectName=' + title
	        }).then(function(result){
	            if(result){
	                if(result.respCode === '200') {
	                    // Store.title = title;
	                    if (obj)
	                        obj.$dispatch(eventName, false, 'This title already exists, please try again.');
	                }else{
	                    if (obj)
	                        obj.$dispatch(eventName, true, 'This title already exists, please try again.');
	                }
	            }
	        })
	    },
	    savePortalCardProject: function(obj,xml,callback) {
	        Store.projectXml = xml;
	        var timestamp = (new Date()).valueOf();
	        var url = Store.domains.baseUrl +  '/card-template/save.ep';
	        $.ajax({
	            url: url,
	            type: 'post',
	            data: {projectXml: xml,autoRandomNum:timestamp,webClientId: 1 }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                Store.projectId = $(result).find('guid').text() || '';
	                Store.projectXml = result;
	                Store.watches.isProjectLoaded = true;
	                if(callback && typeof callback==="function"){
	                    callback();
	                }else{
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
	                }
	            } else {
	                Store.watches.isProjectLoaded = true;
	                if($(result).find('code').text()==="300"){
	                    // obj.$dispatch('dispatchShowProjectChooseWindow');
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -5});
	                }

	            };
	        });
	    },
	    getCardPortalProject: function() {
	        var _this = this;
	        $.ajax({
	            url: Store.domains.baseUrl + '/card-template/get.ep',
	            type: 'get',
	            dataType: 'xml',
	            data: 'initGuid='+Store.projectId+'&webClientId=1&autoRandomNum=' + __webpack_require__(7).getRandomNum()
	        }).done(function(result) {
	            if (result) {
	                Store.projectXml = result;
	                Store.title = $(result).find('title').text();
	                Store.projectId = $(result).find('guid').text();
	                Store.projectSettings.length=0;
	                for (var i = 0; i < $(result).find('spec').length; i++) {
	                    var spec = $(result).find('spec').eq(i);
	                    var PrjConstructor = __webpack_require__(14);
	                    var Prj = PrjConstructor();

	                    for (var j = 0; j < spec.find('option').length; j++) {
	                        var option = spec.find('option').eq(j);
	                        Prj[option.attr('id')]=option.attr('value');
	                        if(Prj[option.attr('id')]==="None"){
	                            Prj[option.attr('id')]="none";
	                        }
	                    };
	                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
	                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
	                        Prj[setting.attr('id')]=setting.attr('value');
	                    }
	                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
	                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
	                            Store.cardId = $(result).find('card').attr('id');
	                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
	                            Prj.trim= Prj.trim ? Prj.trim : $(result).find('trim').attr('value');
	                    };
	                    Store.projectSettings.push(Prj);
	                }
	                _this.getAlbumId();
	                Store.watches.isProjectLoaded = true;
	            }
	        });
	    },
	    submitPortalCardProject: function(obj, xml){
	        var url = Store.domains.baseUrl + '/card-template/submit.ep';
	        $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'xml',
	            data: { encodeimage1:Store.encodeImage1,encodeimage2: Store.encodeImage2,projectXml: xml,webClientId:1 ,autoRandomNum:__webpack_require__(7).getRandomNum() }
	        }).done(function(result) {
	            if (result && $(result).find('resultData').attr('state') === 'success') {
	                Store.projectXml = result;
	                // if(callback && typeof callback==="function"){
	                //     callback();
	                // }else{
	                //     obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
	                // }
	                Store.isPrjSaved=true;
	                Store.vm.$dispatch('dispatchShowPopup', { type: 'save', status: 1});

	            }else if(result && $(result).find('resultData').attr('state') === 'fail'){

	                if($(result).find('code').text()==="201"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
	                    Store.vm.$broadcast('notifyCloseWindow');
	                }else if($(result).find('code').text()==="202"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
	                    Store.vm.$broadcast('notifyCloseWindow');
	                }else if($(result).find('code').text()==="205"){
	                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
	                }else{
	                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
	                }
	            }else {
	                // been.showMsg('Save failed.', 'fail', 'Message',null,null,'ok');
	                obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
	            };
	        });
	    },
	    getMainProject: function(obj, projectId,encImageId,shouldApplyImages){
	        var url = Store.domains.baseUrl + '/clientH5/project/imageInfo';
	        $.ajax({
	            url: url,
	            type: 'get',
	            dataType: 'json',
	            data: { projectId:projectId,autoRandomNum:__webpack_require__(7).getRandomNum() }
	        }).done(function(result) {
	            if (result && result.errorCode === '1') {
	                var sJson = '', sXml = '', imgId = '';

	                try {
	                    sJson = JSON.parse(result.data);
	                } catch(e) {
	                    sXml = __webpack_require__(19).stringToXml(result.data);
	                }

	                if(sXml) {
	                    var imgCount = $(sXml).find('images').find('image').length;
	                    Store.imageList = [];
	                    if (imgCount > 0) {
	                        for (var i = 0; i < imgCount; i++) {
	                            var id=$(sXml).find('images').find('image').eq(i).attr('id');
	                            var encId=$(sXml).find('images').find('image').eq(i).attr('encImgId') || '';
	                            Store.imageList.push({
	                                id: id,
	                                guid: $(sXml).find('images').find('image').eq(i).attr('guid') || '',
	                                // url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
	                                encImgId: encId,
	                                url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(sXml).find('images').find('image').eq(i).attr('encImgId') + '&rendersize=fit' + __webpack_require__(10).getSecurityString(),
	                                name: decodeURIComponent($(sXml).find('images').find('image').eq(i).attr('name')) || '',
	                                width: parseFloat($(sXml).find('images').find('image').eq(i).attr('width')) || 0,
	                                height: parseFloat($(sXml).find('images').find('image').eq(i).attr('height')) || 0,
	                                shotTime: $(sXml).find('images').find('image').eq(i).attr('shotTime') || '',
	                                usedCount: 0
	                            });
	                            if(encImageId&&encodeURIComponent(encImageId)===encId){
	                                imgId=id;
	                            }

	                        };
	                    };
	                } else if(sJson) {
	                    var imgCount = sJson.length;
	                    Store.imageList = [];
	                    if (imgCount > 0) {
	                        for (var i = 0; i < imgCount; i++) {
	                            Store.imageList.push({
	                                id: sJson[i].id.toString() || '',
	                                guid: sJson[i].guid || '',
	                                // url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
	                                encImgId: sJson[i].encImgId || '',
	                                url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + sJson[i].encImgId + '&rendersize=fit' + __webpack_require__(10).getSecurityString(),
	                                name: decodeURIComponent(sJson[i].name) || '',
	                                width: parseFloat(sJson[i].width) || 0,
	                                height: parseFloat(sJson[i].height) || 0,
	                                shotTime: sJson[i].shotTime || '',
	                                usedCount: 0
	                            });
	                            if(encImageId&&encodeURIComponent(encImageId)===sJson[i].encImgId){
	                                imgId=sJson[i].id.toString();
	                            }

	                        };
	                    };
	                }

	                if(imgId){
	                    obj.$dispatch('dispatchSingleImageUploadComplete',imgId);
	                } else if(shouldApplyImages) {
	                    Store.vm.$broadcast("notifyAddMyPhotosIntoPages", Store.imageList);
	                }

	            }else{

	            }
	        });
	    },
	    getMyPhotoImages: function(obj, userId, shouldApplyImages){
	        var url = Store.domains.baseUrl + '/web-api/customer/getMyPhotosInfo';
	        $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'json',
	            data: { customerId:userId,autoRandomNum:__webpack_require__(7).getRandomNum() }
	        }).done(function(result){
	            if (result && result.errorCode === '1' && result.data) {
	                var imageList = JSON.parse(result.data);
	                var formedImageList = [];

	                // 如果有最大图片限制
	                if(Store.maxPageNum && imageList.length > Store.maxPageNum) {
	                    imageList.length = Store.maxPageNum;
	                }

	                imageList.forEach(function(img) {
	                    var newItem = {
	                        id: String(img.id),
	                        guid: img.guid,
	                        encImgId: img.encImgId,
	                        url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + img.encImgId + __webpack_require__(10).getSecurityString() + '&rendersize=fit',
	                        name: img.name,
	                        width: img.width,
	                        height: img.height,
	                        shotTime: img.shotTime,
	                        orientation: !isNaN(+img.orientation) ? +img.orientation : 0,
	                        previewUrl: '',
	                        usedCount: 0
	                    };
	                    formedImageList.push(newItem);
	                    Store.imageList.push(newItem);
	                    __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"UtilImage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).getBlobImagePreviewUrl(Store.imageList.length - 1);
	                });
	                if(shouldApplyImages) {
	                    Store.vm.$broadcast("notifyAddMyPhotosIntoPages", formedImageList);
	                }
	            }
	        });
	    },

	    getTshirtDisableOptions: function() {
	        var url = Store.domains.baseUrl + '/clientH5/getTshirtOffLine';
	        var userId = Store.userSettings.userId;

	        $.ajax({
	            url: url,
	            type: 'get',
	            dataType: 'json',
	            data: {
	                customerId: userId,
	                autoRandomNum: __webpack_require__(7).getRandomNum()
	            }
	        }).done(function(result) {
	            if(result) {
	                var disableArray = result.disable;
	                var disableOptions = {};
	                var allMeasures = ['S', 'M', 'L', 'XL', 'XXL'];

	                // 整理disableArray数据，组装成disableOptions键值对数组
	                disableArray.forEach(function(disableItem) {
	                    var color = disableItem.color;
	                    var value = disableItem.measure;

	                    // 如果键值对选项不存在，就新建一个
	                    if(!disableOptions[color]) {
	                        disableOptions[color] = new Object();
	                        disableOptions[color].options = new Array();
	                        disableOptions[color].isAllDisabled = false;
	                    }

	                    disableOptions[color].options.push(value);

	                    // 如果disableOptions的数量大于等于所有尺寸的数量，就附加该颜色全部禁止的标记
	                    if(disableOptions[color].options.length >= allMeasures.length) {
	                        disableOptions[color].isAllDisabled = true;
	                    }
	                });

	                // 存储禁用尺寸，并且初始化第一件Tshirt，尺寸改为非禁用尺寸
	                Store.disableOptions = disableOptions;
	            }
	            Store.watches.isDisableOptionLoaded = true;
	        });
	    },
	    getLocalTshirtDisableOptions: function() {
	        var url = './assets/data/disableTshirt.json';
	        var userId = Store.userSettings.userId;

	        $.ajax({
	            url: url,
	            type: 'get',
	            dataType: 'json',
	            data: {
	                customerId: userId,
	                autoRandomNum: __webpack_require__(7).getRandomNum()
	            }
	        }).done(function(result) {
	            if(result) {
	                var disableArray = result.disable;
	                var disableOptions = {};
	                var allMeasures = ['S', 'M', 'L', 'XL', 'XXL'];

	                // 整理disableArray数据，组装成disableOptions键值对数组
	                disableArray.forEach(function(disableItem) {
	                    var color = disableItem.color;
	                    var value = disableItem.measure;

	                    // 如果键值对选项不存在，就新建一个
	                    if(!disableOptions[color]) {
	                        disableOptions[color] = new Object();
	                        disableOptions[color].options = new Array();
	                        disableOptions[color].isAllDisabled = false;
	                    }

	                    disableOptions[color].options.push(value);

	                    // 如果disableOptions的数量大于等于所有尺寸的数量，就附加该颜色全部禁止的标记
	                    if(disableOptions[color].options.length >= allMeasures.length) {
	                        disableOptions[color].isAllDisabled = true;
	                    }
	                });

	                // 存储禁用尺寸，并且初始化第一件Tshirt，尺寸改为非禁用尺寸
	                Store.disableOptions = disableOptions;
	                Store.watches.isDisableOptionLoaded = true;
	            }
	        });
	    },

	  deleteImageList:function(callback){
	     var urlAlbumId = Store.userSettings.albumId;
	     var url = Store.domains.baseUrl + '/web-api/album/deleteImages'
	     if(Store.deleImagelist && Store.deleImagelist.length >0){
	         $.ajax({
	            url: url,
	            type: 'post',
	            dataType: 'json',
	            data: {

	                     data: JSON.stringify({
	                       albumId: urlAlbumId,
	                       images: Store.deleImagelist
	                    })
	            }
	        }).done(
	           function(res){
	              Store.deleImagelist=[],
	              callback && callback()
	           }
	        )
	     }else{
	         callback && callback()
	     }

	  }


	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {

	    getUrlParam: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) return unescape(r[2]);
	        return "";
	    },
	    getRequestKey:function(){
	    	var myDate = new Date();
			return 'web-h5|1|XML|'+myDate.getTime();
	    },
	    getJSONRequestKey:function(){
	    	var myDate = new Date();
			return 'web-h5|1|JSON|'+myDate.getTime();
	    },
	    getSecurityString: function() {
	        var customerId = Store.userSettings.userId || '';
	        var token = Store.userSettings.token;
	        var timestamp = Store.userSettings.uploadTimestamp;
	        var encProjectId = Store.encProjectId || '';

	        if(customerId == '-1') {
	            customerId = '';
	        }

	        return '&customerId=' + customerId + '&token=' + token + '&timestamp=' + timestamp + '&encProjectId=' + encodeURIComponent(encProjectId);
	    }

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = function(params){
	  var i=0,len=0;
	  // console.log("traceParams",params);
	  var prj = Store.projectSettings[Store.currentSelectProjectIndex];
	  var product = prj && prj.product;
	  if(typeof(product) == "undefined"){
	    switch(Store.projectType){
	      case 'PR':
	        product = 'print';
	      break;
	      case 'flushMountPrint':
	        product = 'flushMountPrint';
	      break;
	      default:
	        product = Store.projectType;
	      break;
	    }
	  }
	  var data = "H5_" + product+ "," + Store.projectId + ",";
	  for(var index in params){
	    len++;
	  }
	  for(var index in params){
	    if(index==='ev'){
	      data += params[index];
	    }else{
	      data += index + "=" + params[index];
	    }
	    if(i++<len-1){
	      data += ",";
	    }
	  }
	  var tracker=__webpack_require__(12);
	  tracker.go($.trim(data,","));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	(function (global, factory) {
	    // commonjs
	    if (true) {
	        module.exports = factory();
	    } else if (typeof define === 'function' && define.amd) {
	        // amd
	        define(factory);
	    } else {
	        // 直接使用
	        global.tracker = global.tracker || factory();
	    }
	}(this, function () {
	    'use strict';

	    /**
	     * 获取cookie里指定key的值.
	     * @param key 键的名称
	     */
	    function getCookieDate(key) {
	        var value = null;
	        var aCookie = document.cookie.split(";");
	        if(aCookie){
	            for (var i = 0; i < aCookie.length; i++) {
	                var aCrumb = aCookie[i].split("=");
	                if (aCrumb.length>1 && key == aCrumb[0]) {
	                    value = unescape(aCrumb[1]);
	                    break;
	                }
	            }
	        }
	        
	        return value;
	    }

	    /**
	     * 上传日志到日志服务器.
	     * @param data
	     * @param session
	     * @param uid
	     */
	    function goTracker(data, session, uid, completed, failed) {
	        var hostName = window.location.hostname + "";
	        
	        var session = session || getCookieDate(' JSESSIONID') || getCookieDate('JSESSIONID');
	        var asUid = uid || getCookieDate(' AS_UID') || getCookieDate('AS_UID');
	        data = session + "," + asUid + "," + new Date().getTime() + "," + data;

	        var logUrl = "https://venus.zno.com/b.htm"+"?"+data;
	        if (hostName != "www.zno.com") {
	            logUrl = "https://log.zno.com.t/b.htm"+"?"+data;
	        }
	        // 调用ajax, 上传日志信息.
	        get(logUrl, completed, failed);
	    }

	    /**
	     * 通过XMLHttpRequest对象, 发送ajax请求.
	     * @param url request的请求地址
	     * @param data 要发送的对象
	     * @param completed 发送成功后的回调
	     * @param failed 发送失败时的回调.
	     */
	    function get(url, completed, failed) {
	        var request = new XMLHttpRequest();

	        // 请求完成时的回调.
	        request.onload = function (ev) {
	            if (completed && typeof (completed) === 'function') {
	                completed(ev || window.event);
	            }
	        };

	        // 请求失败时的回调.
	        request.onerror = function (ev) {
	            if (failed && typeof (failed) === 'function') {
	                failed(ev || window.event);
	            }
	        };

	        request.open('GET', url);
	        request.send();
	    }

	    return {
	        go: goTracker
	    };
	}));

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = {
	  AddText: "AddText",                     //  点击添加 文本
	  LoadComplete: "LoadComplete",           //  项目加载 完成
	  CompleteTextEdit: "CompleteTextEdit",   //  文本编辑 文成点击  done 按钮
	  ClickToForm: "ClickToForm",             //  点击气泡 进入文本编辑区

	  ClickChangeAll: "ClickChangeAll",            //  print 产品 点击 修改所有的 统一参数
	  ClickEditPrint: "ClickEditPrint",            //  print 产品 点击 编辑单张 print
	  ClickDeletePrint: "ClickDeletePrint",        //  print 产品 点击 删除该张 print
	  ClickDuplicatePrint: "ClickDuplicatePrint",  //  print 产品 点击 复制该张 print
	  ClickReplacePrint: "ClickReplacePrint",      //  print 产品 点击 替换该张 print

	  ChangeSize: "ChangeSize",               // option 选项中 修改 项目尺寸
	  ChangePaper: "ChangePaper",             // option 选项中 修改 项目纸张
	  ChangeTrimStyle: "ChangeTrimStyle",     // option 选项中 修改 圆角 （cards）
	  ChangeiPadmodel: "ChangeiPadmodel",     // option 选项中 修改 padCase 类型

	  ClickSave: 'ClickSave',                 // 点击 save
	  ClickExit: 'ClickExit',                 // 点击 exit
	  ClickOrder: 'ClickOrder',               // 点击 order
	  ClickPreview: "ClickPreview",           // 点击 preview
	  ClickCropImage: "ClickCropImage",       // 点击 裁切图片 按钮
	  ClickRotateImage: "ClickRotateImage",   // 点击 旋转图片 按钮
	  ClickRemoveImage: "ClickRemoveImage",   // 点击 移除图片 按钮
	  ClickMoveTextToCenter: "ClickMoveTextToCenter",     // 点击将文本居中的按钮（Tshirt）
	  ClickMoveImageToCenter: "ClickMoveImageToCenter",   // 点击将图片居中的按钮（Tshirt）

	  ClickReset: "ClickReset",
	  ClickRemove: "ClickRemove",
	  ClickAddText: "ClickAddText",
	  ClickResetConfirm: "ClickResetConfirm",

	  ClickFrontCover: "ClickFrontCover",                 // 点击切换到封面
	  ClickBackCover: "ClickBackCover",                   // 点击切换到背面
	  ClickPreviousPage: "ClickPreviousPage",             // 点击切换上一页
	  ClickNextPage: "ClickNextPage",                     // 点击切换下一页

	  ClickOptionTab: "ClickOptionTab",
	  ClickImagesTab: "ClickImagesTab",
	  ClickLayoutTab: "ClickLayoutTab",
	  ClickDecorationTab: "ClickDecorationTab",
	  ClickFormTab: "ClickFormTab",

	  SwitchSide: "SwitchSide",
	  SwitchSideInPreview: "SwitchSideInPreview",
	  SwitchOrientation: "SwitchOrientation",
	  ImageLoadFail: "ImageLoadFail",
	  DragPhotoToPage: "DragPhotoToPage",
	  ChangeSort: "ChangeSort",
	  ChangeHideUsed: "ChangeHideUsed",
	  CheckPrice: "CheckPrice",
	  SaveComplete: "SaveComplete",
	  SwitchBlocks: "SwitchBlocks",
	  SwitchBlocksInPreview: "SwitchBlocksInPreview",
	  RemoveBlock: "RemoveBlock",
	  SwitchBlocksByNav: "SwitchBlocksByNav",
	  AddBlock: "AddBlock",
	  ClickAddPhotos: "ClickAddPhotos",                  // LMC点击Add Photos
	  ClickDeleteCanvas: "ClickDeleteCanvas",
	  SwitchSize: "SwitchSize",
	  StartUploadEachPhoto: "StartUploadEachPhoto",
	  CompleteUploadEachPhoto: "CompleteUploadEachPhoto",

	  AddPhotos: "AddPhotos",                            // 点击 AddPhotos 上传图片的按钮
	  ClickCloudUploadImage: "ClickCloudUploadImage",    // 点击 云朵上传 图片的按钮
	  FinishPhotoSelect: "FinishPhotoSelect",            // 用户 选择图片完成点击开始上传按钮
	  AddMorePhotos: "AddMorePhotos",                    // 用户上传过程中 点击 addMore 添加更多图片的按钮
	  StartUpload: "StartUpload",                        // 代码开始执行上传图片
	  UploadComplete: "UploadComplete",                  // 图片上传完成
	  CloseMonitor: "CloseMonitor",                      // 关闭上传图片的窗口
	  CancelSingleFile: "CancelSingleFile",              // 单张图片上传过程中点击取消
	  CancelAllFilesClicked: "CancelAllFilesClicked",    // 多图上传过程中点击了 cancel all 按钮
	  CancelAllFilesByXClicked: "CancelAllFilesByXClicked",    // 多图上传过程中点击了 上传图片右上角的关闭按钮并在弹出的确认框中点击确认取消当前图片上传。
	  CheckIncompleteFields: "CheckIncompleteFields",    // 校验发现未填完整text form信息提示
	  CheckIncompleteFieldsContinue: "CheckIncompleteFieldsContinue",   // 未填完整text form数据提示后点击continue
	  CheckIncompleteFieldsCancel: "CheckIncompleteFieldsCancel",  // 未填完整text form数据提示后点击Cancel
	  ModifyPhotoFrame: "ModifyPhotoFrame",
	  ModifyTextFrame: "ModifyTextFrame",
	  RemovePhotoFrame: "RemovePhotoFrame",
	  RemoveTextFrame: "RemoveTextFrame",
	  UpgradeOption: "UpgradeOption"
	}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	
	// model -- Prj
	module.exports = function() {
		return {
			projectId: '',
			userId: '',
			albumId: '',
			token: '',
			uploadTimestamp: '',
			title: 'test-tshirt',
			projectXml:'',
			ordered:'',
			tplGuid : '',
			price:0
		}
		
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var DrawManage = __webpack_require__(16);
	module.exports = {
		convertScreenshotToBase64 : function(){
			return DrawManage.resizeImage("screenshot",Store.screenshotSize.width,Store.screenshotSize.height);
		}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		drawImage('canvas', 'a.jpg', 0, 0,loaded,500,500);画图片

		function loaded() {
	        drawLine('canvas', 'red', 0, 0, 200, 200, 20);画线
	        drawText('canvas', 'woeqtwqoe', 0, 0, "red", "50px", "Georgia");画文字
	        drawRect('canvas', 'orange', 0, 0, 200, 200, true, 2);画矩形
	        drawCircular('canvas', 'gray', 100, 100, 100, true, 5);画圆形
			drawDashLine('canvas', 'black', 0, 0, 200, 200, 1, 3);画虚线
	    }
	*/

	module.exports = {
		drawImage:function(canvas_id,url,x,y,loadedImageFunction,width,height,sx,sy,sw,sh){
			var c = document.getElementById(canvas_id);
	    	var cxt = c.getContext("2d");
			var img = new Image();
	    	img.src = url;
	    	img.onload = function(event) {
	    		if(width&&height){
	                if(sx){
	                    cxt.drawImage(img,sx,sy,sw,sh, x, y, width, height);
	                }else{
	                    cxt.drawImage(img, x, y, width, height);
	                }
	    		}else{
	    			cxt.drawImage(img, x, y);
	    		}
	    		if(loadedImageFunction){
	            	loadedImageFunction();
	            }
	    	}
	        img.onerror= function(){
	            __webpack_require__(11)({ev: __webpack_require__(13).ImageLoadFail,imageUrl: url});
	        };
		},
	    createRotateElementCanvas: function(oriSourceCanvas, rotate) {
	        // 声明两个中间canvas，一个是存储根据旋转放大后尺寸的canvas(未旋转)，一个是存储旋转后的最终canvas，防止在同一canvas上操作造成叠影
	        var sourceScaleCanvas = document.createElement("canvas"),
	            sourceScaleCtx = sourceScaleCanvas.getContext("2d");
	        var sourceRotateCanvas = document.createElement("canvas"),
	            sourceRotateCtx = sourceRotateCanvas.getContext("2d");

	        // 获取旋转后的放大尺寸
	        var sCanvasSize = this.getCanvasRotateSize(oriSourceCanvas, rotate);

	        // 放大canvas和旋转canvas的尺寸设置，如果旋转后的尺寸要比原来的小，则使用原来的尺寸
	        sourceScaleCanvas.width = sCanvasSize.width < oriSourceCanvas.width ? oriSourceCanvas.width : sCanvasSize.width;
	        sourceScaleCanvas.height = sCanvasSize.height < oriSourceCanvas.height ? oriSourceCanvas.height : sCanvasSize.height;
	        sourceRotateCanvas.width = sCanvasSize.width < oriSourceCanvas.width ? oriSourceCanvas.width : sCanvasSize.width;
	        sourceRotateCanvas.height = sCanvasSize.height < oriSourceCanvas.height ? oriSourceCanvas.height : sCanvasSize.height;

	        // 获取canvas尺寸的中心点，即中点
	        var xpos = sCanvasSize.width > oriSourceCanvas.width ? sCanvasSize.width / 2 : oriSourceCanvas.width / 2;
	        var ypos = sCanvasSize.height > oriSourceCanvas.height ? sCanvasSize.height / 2 : oriSourceCanvas.height / 2;
	        // 如果放大canvas的顶点如果小于0，则表示尺寸比原来小，保持为0
	        var top = xpos - oriSourceCanvas.width / 2 < 0 ? 0 : xpos - oriSourceCanvas.width / 2;
	        var left = ypos - oriSourceCanvas.height / 2 < 0 ? 0 : ypos - oriSourceCanvas.height / 2;

	        // 清空canvas，为了修复bug ASH-5178
	        sourceScaleCtx.clearRect(0, 0, sourceScaleCanvas.width, sourceScaleCanvas.height);
	        sourceRotateCtx.clearRect(0, 0, sourceRotateCanvas.width, sourceRotateCanvas.height);

	        // 原图片做中心旋转
	        sourceScaleCtx.drawImage(oriSourceCanvas, top, left);
	        sourceRotateCtx.translate(xpos, ypos);
	        sourceRotateCtx.rotate(rotate * Math.PI / 180);
	        sourceRotateCtx.translate(-xpos, -ypos);
	        sourceRotateCtx.drawImage(sourceScaleCanvas, 0, 0);

	        // 返回中心旋转canvas
	        return sourceRotateCanvas;
	    },
	    drawRotateCanvas: function(options){
	        // 解options
	        var tarCanvasId = options.tarCanvasId,
	            sourceCanvasId = options.sourceCanvasId,
	            x = options.x,
	            y = options.y,
	            width = options.width,
	            height = options.height,
	            sx = options.sx,
	            sy = options.sy,
	            sw = options.sw,
	            sh = options.sh,
	            rotate = parseInt(options.rotate) || 0;

	        var tarCanvas = document.getElementById(tarCanvasId),
	            tarCtx = tarCanvas.getContext("2d"),
	            sourceCanvas = document.getElementById(sourceCanvasId);

	        if(sourceCanvas){
	            var sourceCtx = sourceCanvas.getContext("2d");
	            var rotateCanvas = this.createRotateElementCanvas(sourceCanvas, rotate);
	            var sx = sx || 0,
	                sy = sy || 0,
	                sw = sw || rotateCanvas.width,
	                sh = sh || rotateCanvas.height,
	                x = x || 0,
	                y = y || 0,
	                w = width || rotateCanvas.width,
	                h = height || rotateCanvas.height;

	            if(sw > 0 && sh > 0) {
	                x = x - (rotateCanvas.width - sourceCanvas.width) / 2;
	                y = y - (rotateCanvas.height - sourceCanvas.height) / 2;
	                tarCtx.drawImage(rotateCanvas,sx,sy,sw,sh,x,y,w,h);
	            };
	        }
	    },
	    drawCanvas : function(tarCanvasId,sourceCanvasId,x,y,width,height,sx,sy,sw,sh){
	        var tarCanvas = document.getElementById(tarCanvasId),
	            tarCtx = tarCanvas.getContext("2d"),
	            sourceCanvas = document.getElementById(sourceCanvasId);

	        if(sourceCanvas){
	            var sourceCtx = sourceCanvas.getContext("2d"),
	                sx = sx || 0,
	                sy = sy || 0,
	                sw = sw || sourceCanvas.width,
	                sh = sh || sourceCanvas.height,
	                x = x || 0,
	                y = y || 0,
	                w = width || sourceCanvas.width,
	                h = height || sourceCanvas.height;

	            if(sw > 0 && sh > 0) {
	                tarCtx.drawImage(sourceCanvas,sx,sy,sw,sh,x,y,w,h);
	            };
	        }
	    },
		drawText:function(canvas_id,text,x,y,color,fontSize,fontFamily){
			var c = document.getElementById(canvas_id);
	    	var cxt = c.getContext("2d");
	    	cxt.textBaseline="top";
	    	var oldColor=cxt.fillStyle;
	    	cxt.fillStyle=color;
	    	cxt.font=fontSize+" "+fontFamily;
			cxt.fillText(text,x,y);
	    	cxt.fillStyle=oldColor;
		},
		drawLine:function(canvas_id,color,fromX,fromY,toX,toY,lineWidth){
			var c = document.getElementById(canvas_id);
	    	var cxt = c.getContext("2d");
	    	var oldColor=cxt.strokeStyle;
	    	cxt.strokeStyle=color;
	    	var oldLineWidth=cxt.lineWidth;
	    	if(lineWidth){
	    		cxt.lineWidth=lineWidth;
	    	}else{
	    		cxt.lineWidth=1;
	    	}

			cxt.beginPath();
	    	cxt.moveTo(fromX, fromY);
	        cxt.lineTo(toX, toY);
	        cxt.closePath();
	        cxt.stroke();
	        cxt.strokeStyle=oldColor;
	        cxt.lineWidth=oldLineWidth;
		},
		drawDashedLine:function(canvas_id, color, fromX, fromY, toX, toY, lineWidth, dashLen){
			var c = document.getElementById(canvas_id);
	        var cxt = c.getContext("2d");
	        var oldColor = cxt.strokeStyle;
	        cxt.strokeStyle = color;
	        var oldLineWidth = cxt.lineWidth;
	        if (lineWidth) {
	            cxt.lineWidth = lineWidth;
	        } else {
	            cxt.lineWidth = 1;
	        }
	        if(!dashLen){
	        	dashLen=5;
	        }
	        cxt.beginPath();
	        var beveling = this.getBeveling(toX-fromX,toY-fromY);
		    var num = Math.floor(beveling/dashLen);

	        var x1,y1,x2,y2;
			for(var i = 0 ; i < num; i++)
			{
	            x1=fromX+(toX-fromX)/num*i;
	            y1=fromY+(toY-fromY)/num*i;
	            x2=fromX+(toX-fromX)/num*(i+1);
	            y2=fromY+(toY-fromY)/num*(i+1);
				cxt[i%2 == 0 ? 'moveTo' : 'lineTo'](fromX+(toX-fromX)/num*i,fromY+(toY-fromY)/num*i);
			}
	        if(num%2 != 0){
	            cxt['lineTo'](x2,y2);
	        }

	        cxt.closePath();
	        cxt.stroke();
	        cxt.strokeStyle = oldColor;
	        cxt.lineWidth = oldLineWidth;
		},
		getBeveling:function(x, y) {
	        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	    },
		drawRect:function(canvas_id,color,x,y,width,height,isStroke,lineWidth){
			var c = document.getElementById(canvas_id);
	    	var cxt = c.getContext("2d");
	    	if(isStroke){

	    		var oldLineWidth=cxt.lineWidth;
		    	if(lineWidth){
		    		cxt.lineWidth=lineWidth;
		    	}else{
		    		cxt.lineWidth=1;
		    	}
	    		var oldColor=cxt.strokeStyle;
		    	cxt.strokeStyle=color;
				cxt.beginPath();
		    	cxt.moveTo(x, y);
		        cxt.strokeRect(x,y,width,height);
		        cxt.closePath();
		        cxt.stroke();
		        cxt.strokeStyle=oldColor;
		        cxt.lineWidth=oldLineWidth;
	    	}else{
	    		var oldColor=cxt.fillStyle;
		    	cxt.fillStyle=color;
				cxt.beginPath();
		    	cxt.moveTo(x, y);
		        cxt.fillRect(x,y,width,height);
		        cxt.closePath();
		        cxt.fillStyle=oldColor;
	    	}
		},
		drawCircular:function(canvas_id, color, x, y, width, isStroke, lineWidth){
			var c = document.getElementById(canvas_id);
	        var cxt = c.getContext("2d");
	        if (isStroke) {

	        	var oldLineWidth = cxt.lineWidth;
		        if (lineWidth) {
		            cxt.lineWidth = lineWidth;
		        } else {
		            cxt.lineWidth = 1;
		        }
		        var oldColor = cxt.strokeStyle;
		        cxt.strokeStyle = color;
		        cxt.moveTo(x, y);
		        cxt.beginPath();
		        cxt.arc(x, y, width,0,Math.PI*2);
		        cxt.closePath();
		        cxt.stroke();
		        cxt.strokeStyle = oldColor;
				cxt.lineWidth = oldLineWidth;
			}else{

				var oldColor = cxt.fillStyle;
	            cxt.fillStyle = color;

	            cxt.moveTo(x, y);
	            cxt.beginPath();
	            cxt.arc(x, y, width,0,Math.PI*2);
	            cxt.closePath();
	            cxt.fill();
	            cxt.fillStyle = oldColor;
	        }
		},

	    clear:function(canvas_id,x,y,w,h){
	        var c=document.getElementById(canvas_id),
	            ctx=c.getContext("2d"),
	            x = x || 0,
	            y = y || 0,
	            w = w || c.width,
	            h = h || c.height;
	        ctx.clearRect(x,y,w,h);
	    },
	    getImageData:function(canvas_id,x,y,w,h){
	        var c=document.getElementById(canvas_id),
	            ctx=c.getContext("2d")
	            x = x || 0,
	            y = y || 0,
	            w = w || c.width,
	            h = h || c.height;
	        return ctx.getImageData(x,y,w,h);
	    },
	    fillImageData:function(canvas_id,imgData,x,y,w,h){
	        var c=document.getElementById(canvas_id),
	            ctx=c.getContext("2d"),
	            w = w || c.width,
	            h = h || c.height,
	            x = x || 0,
	            y = y || 0;
	        ctx.putImageData(imgData,x,y,0,0,w,h);
	    },
	    createImageData : function(canvas_id,w,h){
	        var c=document.getElementById(canvas_id),
	            ctx=c.getContext("2d"),
	            w = w || c.width,
	            h = h || c.height;
	        return ctx.createImageData(w,h);
	    },
	    getClient : function(canvas_id){
	        var c = document.getElementById(canvas_id);
	        return {
	            width : c.width,
	            height : c.height,
	            context : c.getContext("2d")
	        }
	    },
	    imageDataVRevert : function(sourceData,newData){ //pixel vertical revert
	        for(var i=0,h=sourceData.height;i<h;i++){
	            for(j=0,w=sourceData.width;j<w;j++){
	                newData.data[i*w*4+j*4+0] = sourceData.data[(h-i)*w*4+j*4+0];
	                newData.data[i*w*4+j*4+1] = sourceData.data[(h-i)*w*4+j*4+1];
	                newData.data[i*w*4+j*4+2] = sourceData.data[(h-i)*w*4+j*4+2];
	                newData.data[i*w*4+j*4+3] = sourceData.data[(h-i)*w*4+j*4+3];
	            }
	        }
	        return newData;
	    },
	    imageDataHRevert : function(sourceData,newData){ //pixel horizontal revert
	        for(var i=0,h=sourceData.height;i<h;i++){
	            for(j=0,w=sourceData.width;j<w;j++){
	                newData.data[i*w*4+j*4+0] = sourceData.data[i*w*4+(w-j)*4+0];
	                newData.data[i*w*4+j*4+1] = sourceData.data[i*w*4+(w-j)*4+1];
	                newData.data[i*w*4+j*4+2] = sourceData.data[i*w*4+(w-j)*4+2];
	                newData.data[i*w*4+j*4+3] = sourceData.data[i*w*4+(w-j)*4+3];
	            }
	        }
	        return newData;
	    },
	    canvasToBase64 : function(canvas_id){
	        var canvas = document.getElementById(canvas_id);
	        return canvas.toDataURL("image/jpeg");
	    },
	    wrapBorder : function(canvas_id,direction,length){ //pixel beveling
	        var canvas = document.getElementById(canvas_id),
	            tmpCanvas = document.createElement("canvas"),
	            tctx = tmpCanvas.getContext("2d"),
	            W = canvas.width,
	            H = canvas.height,
	            length = length || 0.5, // <=0.5
	            direction = direction || 'right',
	            params = {'top':[1,0,-length,length,0,H/2],'right':[-length,length,0,1,W/2,-W/2]};
	        if(W>H){
	            tmpCanvas.width = W + H / 2;
	            tmpCanvas.height = H;
	        }else{
	            tmpCanvas.width = W;
	            tmpCanvas.height = H + W / 2;
	        }
	        CanvasRenderingContext2D.prototype.transform.apply(tctx,params[direction]);
	        if(W>H){
	            tctx.drawImage(canvas,H/2,0);
	        }else{
	            tctx.drawImage(canvas,0,W/2);
	        }
	        return tctx.getImageData(0,0,tmpCanvas.width,tmpCanvas.height);
	    },
	    setSize : function(canvas_id,setting){
	        var canvas = document.getElementById(canvas_id);
	        setting.width && (canvas.width=setting.width);
	        setting.height && (canvas.height=setting.height);
	    },
	    fillEmptyDataWithColor : function(imgData,rgb,width,height){
	        for(var i=0;i<imgData.width*imgData.height;i++){
	            if(imgData.data[4*i+3]===0){
	                imgData.data[4*i] = rgb.r;
	                imgData.data[4*i+1] = rgb.g;
	                imgData.data[4*i+2] = rgb.b;
	                imgData.data[4*i+3] = 255;
	            }
	        }
	        return imgData;
	    },
	    replaceColor : function(imageData,x,y,sourceColor,w,h,replaceColor){ //replace or delete color in area
	        var x = ~~(x || 0),
	            y = ~~(y || 0),
	            w = x + w || imageData.width,
	            h = y + h || imageData.height;
	        if(x<0 || y<0 || w>imageData.width || h>imageData.height){
	            throw new Error("error params!");
	        }
	        for(var j=y;j<h;j++){
	            for(var i=x;i<w;i++){
	                var index = j * imageData.width + i,
	                    r = imageData.data[4*index],
	                    g = imageData.data[4*index+1],
	                    b = imageData.data[4*index+2];
	                if(r==sourceColor.r && g==sourceColor.g && b==sourceColor.b){
	                    if(replaceColor){
	                        imageData.data[4*index] = replaceColor.r;
	                        imageData.data[4*index+1] = replaceColor.g;
	                        imageData.data[4*index+2] = replaceColor.b;
	                        imageData.data[4*index+3] = 255;
	                    }else{
	                        imageData.data[4*index+3] = 0;
	                    }
	                }
	            }
	        }
	        return imageData;
	    },
	    resizeImage : function(canvasId,w,h){
	        var canvas = document.getElementById(canvasId),
	            ctx = canvas.getContext("2d"),
	            tmpCanvas = document.createElement("canvas"),
	            tctx = tmpCanvas.getContext("2d"),
	            w = w || canvas.width,
	            h = h || canvas.height;
	        if(w !== canvas.width || h !== canvas.height){
	            var ratio;
	            if(w>h){
	                ratio = canvas.width / w;
	                h = canvas.height / ratio;
	            }else if(w===h){
	                if(canvas.width>canvas.height){
	                    ratio = canvas.width / w;
	                    h = canvas.height / ratio;
	                }else{
	                    ratio = canvas.height / h;
	                    w = canvas.width / ratio;
	                }
	            }else{
	                ratio = canvas.height / h;
	                w = canvas.width / ratio;
	            }
	        }
	        tmpCanvas.width = w;
	        tmpCanvas.height = h;
	        tctx.drawImage(canvas,0,0,w,h);
	        return tmpCanvas.toDataURL("image/png");
	    },
	    getCanvasRotateSize: function(canvas, rotateDeg) {
	        var points = this.getCanvasRotatePoint(canvas, rotateDeg);
	        var maxX = 0, maxY = 0;

	        points.forEach(function(point) {
	            maxX = point.x > maxX ? point.x : maxX;
	            maxY = point.y > maxY ? point.y : maxY;
	        });

	        return {
	            width: maxX * 2,
	            height: maxY * 2
	        }
	    },
	    getCanvasRotatePoint: function(canvas, rotateDeg) {
	        var canvasRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
	        var posX = 1, posY = 1, offsetDeg = 0, points = [];

	        for(var i = 0; i < 4; i++) {
	            switch (i) {
	                case 0: posX = -1; posY = 1; offsetDeg = 360; break;
	                case 1: posX = 1; posY = 1; offsetDeg = 0; break;
	                case 2: posX = 1; posY = -1; offsetDeg = 180; break;
	                case 3: posX = -1; posY = -1; offsetDeg = 180; break;
	            }

	            var oriPoint = {
	                x: canvas.width / 2 * posX,
	                y: canvas.height / 2 * posY
	            }
	            var oriPoint2CenterDeg = Math.atan(oriPoint.y / oriPoint.x) / Math.PI * 180 + offsetDeg;
	            var point2CenterRadian = (oriPoint2CenterDeg + rotateDeg) / 180 * Math.PI;

	            points.push({
	                x: Math.cos(point2CenterRadian) * canvasRadius,
	                y: Math.sin(point2CenterRadian) * canvasRadius
	            })
	        }

	        return points;
	    },
	    // 这是给 flushMountPrint 增加的 画圆角和 画额外阴影的方法。通用性不一定好。
	    drawBorderRadius: function(canvasId,radius,fillColor){
	        var canvas = document.getElementById(canvasId),
	            ctx = canvas.getContext("2d"),
	            width = canvas.width || 0,
	            height = canvas.height || 0;
	            // 左上圆角
	            ctx.fillStyle= fillColor || "#fff";
	            ctx.beginPath();
	            ctx.moveTo(0,0);           // 创建开始点
	            ctx.lineTo(radius,0);          // 创建水平线
	            ctx.arcTo(0,0,0,radius,radius); // 创建弧
	            ctx.lineTo(0,0);         // 创建垂直线
	            ctx.fill();
	            ctx.closePath();
	            // 右上圆角
	            // ctx.fillStyle= "red";
	            ctx.beginPath();
	            ctx.moveTo(width,0);           // 创建开始点
	            ctx.lineTo(width-radius,0);          // 创建水平线
	            ctx.arcTo(width,0,width,radius,radius); // 创建弧
	            ctx.lineTo(width,0);         // 创建垂直线
	            ctx.fill();
	            ctx.closePath();
	            // 左下圆角
	            ctx.beginPath();
	            ctx.moveTo(0,height);           // 创建开始点
	            ctx.lineTo(0,height-radius);          // 创建水平线
	            ctx.arcTo(0,height,radius,height,radius); // 创建弧
	            ctx.lineTo(0,height);         // 创建垂直线
	            ctx.fill();
	            ctx.closePath();
	            // 右下圆角
	            ctx.fillStyle= fillColor || "black";
	            ctx.beginPath();
	            ctx.moveTo(width,height);           // 创建开始点
	            ctx.lineTo(width-radius,height);          // 创建水平线
	            ctx.arcTo(width,height,width,height-radius,radius); // 创建弧
	            ctx.lineTo(width,height);         // 创建垂直线
	            ctx.fill();
	            ctx.closePath();

	            ctx.fillStyle= fillColor || "rgba(0,0,0,0.6)";
	            ctx.beginPath();
	            ctx.moveTo(width-radius,0);
	            ctx.arcTo(width,0,width,radius,radius);
	            ctx.lineTo(width,radius/3);
	            ctx.lineTo(width-radius,0);
	            ctx.fill();
	            ctx.closePath();

	    },
	    resizeImageWithShadow: function(canvasId,w,h,radiu){
	        var canvas = document.getElementById(canvasId),
	            ctx = canvas.getContext("2d"),
	            tmpCanvas = document.createElement("canvas"),
	            tctx = tmpCanvas.getContext("2d"),
	            w = canvas.width,
	            h = canvas.height;

	        var tmpCanvasWidth = w + 20;
	        var tmpCanvasHeight = h + 20;
	        // radiu = radiu / ratio;
	        tmpCanvas.width = tmpCanvasWidth;
	        tmpCanvas.height = tmpCanvasHeight;
	        tctx.fillStyle = 'white';
	        tctx.fillRect(0,0,tmpCanvasWidth,tmpCanvasHeight);
	        tctx.shadowBlur=1;
	        tctx.shadowOffsetX=3;
	        tctx.shadowOffsetY=2;
	        tctx.fillStyle="black";
	        tctx.shadowColor="rgba(0,0,0,0.8)";
	       // tctx.fillStyle="rgba(0,0,0,0.8)";
	        tctx.beginPath();
	        tctx.moveTo(10+radiu,tmpCanvasHeight-10);
	        tctx.arcTo(10,tmpCanvasHeight-10,10,tmpCanvasHeight-10-radiu,radiu);
	        tctx.lineTo(10+radiu,10);
	        tctx.arcTo(tmpCanvasWidth-10,10,tmpCanvasWidth-10,10+radiu/2,radiu);
	        tctx.lineTo(tmpCanvasWidth-10,tmpCanvasHeight-10-radiu);
	        tctx.arcTo(tmpCanvasWidth-10,tmpCanvasHeight-10,tmpCanvasWidth-10-radiu,tmpCanvasHeight-10,radiu);
	        tctx.lineTo(10+radiu/1.5,tmpCanvasHeight-10);
	        tctx.fill();
	        tctx.closePath();
	        tctx.shadowBlur=0;
	        tctx.shadowColor="transparents";
	        tctx.shadowOffsetX=0;
	        tctx.shadowOffsetY=0;
	        tctx.drawImage(canvas,10,10,w,h);

	        return tmpCanvas.toDataURL("image/png");
	    },
	    replaceColorOutOfArea: function(imageData,x,y,sourceColor,w,h,replaceColor,replaceTransparentColor,type) {
	        var x = ~~(x || 0),
	            y = ~~(y || 0),
	            w = x + w || imageData.width,
	            h = y + h || imageData.height,
	            canvasWidth = imageData.width,
	            canvasHeight = imageData.height;
	        if(x<0 || y<0 || w>imageData.width || h>imageData.height){
	            throw new Error("error params!");
	        }
	        for(var j=0;j<canvasHeight;j++){
	            for(var i=0;i<canvasWidth;i++){
	                var rowInArea = true,
	                    columnInArea = true;
	                // 判断圆形抠图还是矩形抠图
	                switch(type) {
	                    case 'Round':
	                        var centerX = (w + x) / 2,
	                            centerY = (h + y) / 2,
	                            distance = (w - x) / 2;
	                        rowInArea = columnInArea = Math.sqrt(Math.pow((i - centerX), 2) + Math.pow((j - centerY), 2)) < distance;
	                        break;
	                    case 'Square':
	                    default:
	                        rowInArea = i >= x && i < w;
	                        columnInArea = j >= y && j < h;
	                        break;
	                }
	                var index = j * imageData.width + i,
	                    r = imageData.data[4*index],
	                    g = imageData.data[4*index+1],
	                    b = imageData.data[4*index+2],
	                    a = imageData.data[4*index+3];
	                if(replaceTransparentColor && a !== 255) {
	                    imageData.data[4*index+3] = 255;
	                }
	                if(rowInArea && columnInArea) {
	                    if(replaceTransparentColor && a !== 255) {
	                        imageData.data[4*index] = replaceTransparentColor.r;
	                        imageData.data[4*index+1] = replaceTransparentColor.g;
	                        imageData.data[4*index+2] = replaceTransparentColor.b;
	                        imageData.data[4*index+3] = 255;
	                    }
	                    continue;
	                }
	                var isRMatched = r > sourceColor.r -10 && r < sourceColor.r + 10;
	                var isGMatched = g > sourceColor.g -10 && g < sourceColor.g + 10;
	                var isBMatched = b > sourceColor.b -10 && b < sourceColor.b + 10;
	                if(isRMatched && isGMatched && isBMatched){
	                    if(replaceColor){
	                        imageData.data[4*index] = replaceColor.r;
	                        imageData.data[4*index+1] = replaceColor.g;
	                        imageData.data[4*index+2] = replaceColor.b;
	                        imageData.data[4*index+3] = 255;
	                    }else{
	                        imageData.data[4*index+3] = 0;
	                    }
	                }
	            }
	        }
	        return imageData;
	    }
	}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var specXml = Store.spec.specXml;
	module.exports = {
	    getVersion:function(){
	        return $(specXml).find("product-spec").attr('version');
	    },
	    getDPI: function() {
	        return parseInt($(specXml).find("dpi").text());
	    },
	    getImageQualityBufferPercent: function() {
	        return parseInt($(specXml).find("imageQualityBufferPercent").text());
	    },
	    //通过类型获取option的值
	    getOptions: function(type) {
	        var options = $(specXml).find('optionGroup[id=' + type + ']').find('option');
	        var array = [];
	        for (var i = 0; i < options.length; i++) {
	            var o = {};
	            var names = options.eq(i).get(0).attributes;
	            for (var j = 0; j < names.length; j++) {
	                o[names[j].name] = names[j].value;
	            }
	            var title = options.eq(i).find('title').text();
	            if (title != "") {
	                o['title'] = title;
	            }

	            array.push(o);
	        };
	        return array;
	    },
	    //通过类型和参数获取option map的值
	    //paramsList是对象数组，对象key为type，value为相关id
	    getOptionsMap: function(type, paramsList) {
	        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
	        if(value){
	        	return value.attr('value');
	        }else{
	        	return null;
	        }

	    },
	    //通过类型和参数获取默认属性defaultValue的值
	    getOptionsMapDefaultValue:function(type,paramsList){
	        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
	        if(value){
	            return value.attr('defaultValue');
	        }else{
	            return null;
	        }
	    },
	    //通过类型和参数获取parameter的值
	    //paramsList是对象数组，对象key为type，value为相关id
	    getParameter: function(type, paramsList) {
	        var parameterMapKeyPattern = $(specXml).find('parameter[id=' + type + ']').attr('keyPattern').toString();
	        var parameterMaps = $(specXml).find('parameter[id=' + type + ']').find('entry');

	        var value=this.getIsPattern(parameterMapKeyPattern,parameterMaps,paramsList);
	        if(value){
	        	var object = {};
	            var names = value.get(0).attributes;
	            for (var j = 0; j < names.length; j++) {
	                object[names[j].name] = names[j].value;
	            }

	        	return object;
	        }else{
	        	return null;
	        }


	    },
	    getVariable:function(type, paramsList) {
	        var variableKeyPattern = $(specXml).find('variable[id=' + type + ']').attr('keyPattern').toString();
	        var variableMaps = $(specXml).find('variable[id=' + type + ']').find('entry');

	        var value=this.getIsPattern(variableKeyPattern,variableMaps,paramsList);
	        if(value){
	        	var object = {};
	            var names = value.get(0).attributes;
	            for (var j = 0; j < names.length; j++) {
	                object[names[j].name] = names[j].value;
	            }

	        	return object;
	        }else{
	        	return null;
	        }


	    },
	    //传入的参数是否匹配
	    getIsPattern:function(optionMapKeyPattern,optionMaps,paramsList){
	    	var keyPatternList = optionMapKeyPattern.split("-");
	        //if(paramsList.length===keyPatternList.length){
	        for (var i = 0; i < optionMaps.length; i++) {
	            var key = optionMaps.eq(i).attr("key");
	            var targetKeyPatternList = key.split("-");
	            var value = optionMaps.eq(i);
	            var isPatterns = [];
	            for (var j = 0; j < targetKeyPatternList.length; j++) {
	                var id = keyPatternList[j];
	                var target = targetKeyPatternList[j];
	                if (target === "*") {
	                    isPatterns.push(true);
	                } else {
	                    for (var k = 0; k < paramsList.length; k++) {
	                        if (paramsList[k].key === id) {
	                            var isArrayTarget = /\[/.test(target);
	                            var paramValue = paramsList[k].value;
	                            if (isArrayTarget) {
	                                var targetArray = target.substr(1,target.length -2).split(',');
	                                var trimedTargetArray = targetArray.map(function(item){return item.trim()});
	                                if(trimedTargetArray.indexOf(paramValue) !== -1) {
	                                    isPatterns.push(true);
	                                }
	                            } else {
	                                if (target === paramValue) {
	                                    isPatterns.push(true);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	            var isPattern = true;
	            for (var n = 0; n < isPatterns.length; n++) {
	                if (isPatterns[n] === false) {
	                    isPattern = false;
	                }
	            }
	            if (isPatterns.length === keyPatternList.length && isPattern) {
	                return value;
	            }
	        }
	        return null;
	        /*}else{
	        	return false;
	        }*/
	    },
	    //获取所有option的id列表
	    getOptionIds:function(){
	    	var list=[];
	    	var optionGroup = $(specXml).find('optionGroup');
	    	for (var i = 0; i < optionGroup.length; i++) {
	    		list.push(optionGroup.eq(i).attr('id'));
	    	}
	    	return list;
	    },
	    //获取所有option map的id列表
	    getOptionMapIds:function(){
	    	var list=[];
	    	var option = $(specXml).find("configurableOptionMap").find('optionMap');
	    	for (var i = 0; i < option.length; i++) {
	    		list.push(option.eq(i).attr('id'));
	    	}
	    	return list;
	    },
	    //通过id获取optionMap
	    getOptionMapById:function(id){

	        return $(specXml).find("configurableOptionMap").find('optionMap[id=' + id + ']').find('entry');
	    },
	    getCategoryByProduct:function(product){
	        var entrys=this.getOptionMapById('product');
	        for (var i = 0; i < entrys.length; i++) {
	            var values=entrys.eq(i).attr('value');
	            var valueArray=values.split(',');
	            for (var j = 0; j < valueArray.length; j++) {
	                if(valueArray[j]===product){
	                    return entrys.eq(i).attr('key');
	                }
	            }
	        }

	        return 'none';
	    },
	    //通过option map的id获取keypattern
	    getOptionMapKeyPatternById:function(type){
	    	return $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();;
	    },
	    //获取所有Parameter的id列表
	    getParameterIds:function(){
	    	var list=[];
	    	var option = $(specXml).find('parameter');
	    	for (var i = 0; i < option.length; i++) {
	    		list.push(option.eq(i).attr('id'));
	    	}
	    	return list;
	    },
	    //通过Parameter的id获取keypattern
	    getParameterKeyPatternById:function(type){
	    	return $(specXml).find('parameter[id=' + type + ']').attr('keyPattern').toString();;
	    },

	    //通过Parameter的id获取keypattern
	    getVariableKeyPatternById:function(type){
	        return $(specXml).find('variable[id=' + type + ']').attr('keyPattern').toString();;
	    },

	    getDisableOptionsMap: function(type, paramsList) {
	        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
	            var optionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	            var optionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	            var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
	            if(value){
	                return value.attr('value');
	            }else{
	                return null;
	            }
	        }else{
	            return null;
	        }


	    },
	    getDisableOptionMapKeyPatternById:function(type){
	        try {
	            return $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	        } catch(e) {
	            return '';
	        }
	    },
	    getDisableOptionIds:function(){
	        var list=[];
	        var option = $(specXml).find("disableOptionMap").find('optionMap');
	        for (var i = 0; i < option.length; i++) {
	            list.push(option.eq(i).attr('id'));
	        }
	        return list;
	    },
	    getDisableOptionValues:function(product){
	        var list=[];
	        var option = $(specXml).find("disableOptionMap").find('optionMap').find('entry');
	        for (var i = 0; i < option.length; i++) {
	            if(option.eq(i).attr('key').indexOf(product)!=-1){
	                list.push(option.eq(i).attr('value'));
	            }
	            
	        }
	        return list;
	    },
	    getAllSize : function(){
	        var type = 'size',
	            keyPatterns = this.getOptionMapKeyPatternById(type).split("-"),
	            params = [],
	            res;
	        var item = { key : 'product', value : 'print'};
	        params.push(item);
	        return this.getOptionsMap(type,params).split(",");
	    },
	    getAllPaper : function(size){
	        var type = 'paper',
	            keyPatterns = this.getOptionMapKeyPatternById(type).split("-"),
	            params = [],
	            res,
	            currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var item = { key : 'size', value : size};
	        params.push(item);
	        return this.getOptionsMap(type,params).split(",");
	    },
	    getElementById: function (id) {
	        return $(specXml).find('#' + id);
	    },
	    getOptionNameById: function(type, id) {
	        var options = this.getOptions(type);
	        var itemName = '';
	        options.some(function(item){
	            if(item.id === id) {
	                itemName = item.name || item.title;
	                return true;
	            }
	        });
	        return itemName;
	    },
	    getAvailableOptions : function(type, resetParams, idx){
	        var paramsList = __webpack_require__(18).getParamsList(idx);
	        resetParams = resetParams || [];

	        if(!Array.isArray(resetParams)) {
	            resetParams = [resetParams];
	        }

	        paramsList = paramsList.map(function(paramObj) {

	            // 用filter代替find方法
	            var resetParam = resetParams.filter(function(resetParamObj) {
	                return resetParamObj.key === paramObj.key;
	            });

	            if(resetParam.length > 0) {
	                paramObj = resetParam[0];
	            }

	            return paramObj;
	        });
	        return this.getOptionsMap(type, paramsList).split(",");
	    },
	    isDisableOptionShow: function(type, paramsList, optionId) {
	        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
	            var optionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	            var optionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	            var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);
	            
	            if(value) {
	                var resArray = value.attr('value').split(",");
	                return resArray && resArray.indexOf(optionId) !== -1 ? value.attr('isShow') === 'true' : false;
	            }else{
	                return false;
	            }
	        }else{
	            return false;
	        }
	    },
	    // for blank card. 如果有defaultOption
	    getOptionsMapDefaultValueWithoutDisableOption:function(type,paramsList){
	        var optionMapKeyPattern = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	        var optionMaps = $(specXml).find("configurableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	        var value=this.getIsPattern(optionMapKeyPattern,optionMaps,paramsList);

	        if($(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern')){
	            var disableOptionMapKeyPattern = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').attr('keyPattern').toString();
	            var disableOptionMaps = $(specXml).find("disableOptionMap").find('optionMap[id=' + type + ']').find('entry');
	            var disableValue = this.getIsPattern(disableOptionMapKeyPattern, disableOptionMaps, paramsList);
	        }

	        if(disableValue && value && value.attr('defaultValue') === disableValue.attr('value')) {
	            var filteredValue = value.attr('value').split(',').filter(function(valueItem) {
	                return valueItem !== disableValue.attr('value');
	            });

	            return filteredValue[0];
	        } else if(value) {
	            return value.attr('defaultValue');
	        } else {
	            return null;
	        }
	    },
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = {

	    getFrameBaseSize: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var size = currentProject.size;
	        var sizeObject = __webpack_require__(17).getParameter('frameBaseSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.width = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	        } else {
	            object.width = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	        }

	        return object;
	    },
	    getCanvasBorderThickness: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var canvasBorderSize = currentProject.canvasBorderSize;
	        var sizeObject = __webpack_require__(17).getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'canvasBorderSize', value: canvasBorderSize }, { key: 'frameStyle', value: frameStyle }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }

	        return object;
	    },
	    getFrameBorderThickness: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var sizeObject = __webpack_require__(17).getParameter('frameBorderThickness', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }

	        return object;
	    },
	    getBleed: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var frameStyle = currentProject.frameStyle;
	        var sizeObject = __webpack_require__(17).getParameter('bleed', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }
	        return object;
	    },
	    getBoardInFrame: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var size = currentProject.size;
	        var sizeObject = __webpack_require__(17).getParameter('boardInFrame', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }
	        return object;
	    },
	    getBoardInMatting: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var matte = currentProject.matte;
	        var frameStyle = currentProject.frameStyle;
	        var sizeObject = __webpack_require__(17).getParameter('boardInMatting', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }
	        return object;
	    },
	    getMatteSize: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var size = currentProject.size;
	        var matte = currentProject.matte;
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var sizeObject = __webpack_require__(17).getParameter('matteSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }
	        return object;
	    },
	    getMatteStyleColor: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var matteStyle = currentProject.matteStyle;
	        var sizeObject = __webpack_require__(17).getParameter('matteStyleColor', [{ key: 'matteStyle', value: matteStyle }]);
	        if (sizeObject && sizeObject.color === "0") {
	            return 0;
	        } else {
	            return 16777215;
	        }
	    },
	    getInitProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getBaseInfoXml();
	        var option = this.getOptionXml();
	        var frameBoard = this.getFrameBoardXml();
	        var matteLayer = this.getMatteLayerXml();
	        var photoLayer = this.getPhotoLayerXml();
	        var elements = this.getIntiElementXml();
	        var images = this.getImagesXml();

	        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
	        ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
	        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getCurrentProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getBaseInfoXml();
	        var option = this.getOptionXml();
	        var frameBoard = this.getFrameBoardXml();
	        var matteLayer = this.getMatteLayerXml();
	        var photoLayer = this.getPhotoLayerXml();
	        var elements = this.getElementsXml();
	        var images = this.getImagesXml();

	        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
	        if (currentProject.matte !== "none") {
	            ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
	        }
	        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getOptionXml: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var s = '<spec version="' + __webpack_require__(17).getVersion() + '">';

	        var optionIds = __webpack_require__(17).getOptionIds();
	        for (var i = 0; i < optionIds.length; i++) {
	            s += '<option id="' + optionIds[i] + '" value="' + currentProject[optionIds[i]] + '"/>';
	        };

	        s += '</spec>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getElementsXml: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var currentCanvas = Store.pages[index].canvas;
	        var elememts = currentCanvas.params;
	        var s = '<elements>';

	        for (var i = 0; i < elememts.length; i++) {

	            var x = elememts[i].x;
	            var y = elememts[i].y;
	            var width = elememts[i].width;
	            var height = elememts[i].height;
	            var px = x / currentCanvas.oriWidth;
	            var py = y / currentCanvas.oriHeight;
	            var ph = height / currentCanvas.oriHeight;
	            var pw = width / currentCanvas.oriWidth;
	            var rot = elememts[i].rotate;
	            var dep = elememts[i].dep;
	            var imageid = elememts[i].imageId;
	            var imgRot = elememts[i].imageRotate;
	            var imgFlip = false;
	            var cropPX = parseFloat(elememts[i].cropPX),
	                cropPY = parseFloat(elememts[i].cropPY),
	                cropPW = parseFloat(elememts[i].cropPW),
	                cropPH = parseFloat(elememts[i].cropPH);
	            console.log(elememts[i]);
	            if (elememts[i].elType === 'text') {

	                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[i].fontColor + '" fontSize="' + parseFloat(elememts[i].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[i].fontFamily) + '" fontWeight="' + elememts[i].fontWeight + '" textAlign="' + elememts[i].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[i].text) + ']]></element>';

	            } else if (elememts[i].elType === 'logo') {

	                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX.toString() + '" cropLUY="' + cropPY.toString() + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH).toString() + '" />';

	            } else if (elememts[i].elType === 'image') {

	                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX.toString() + '" cropLUY="' + cropPY.toString() + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH).toString() + '" />';
	            }

	        }
	        s += '</elements>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getIntiElementXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhotoLayer();

	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        var s = '<elements>' +
	            /*            '<element type="PhotoElement" x="0" y="0" width="' + width + '" height="' + height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +
	             */
	            '</elements>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getBaseInfoXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var s = '<project schemaVersion="2.0" clientId="web-h5">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description></description>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<uiSetting>' +
	            '<templateStrip>' +
	            '<showTemplatePanel>false</showTemplatePanel>' +
	            '<autoLayout>false</autoLayout>' +
	            '</templateStrip>' +
	            '</uiSetting>' +
	            '<photoFrame>' +
	            '</photoFrame>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getFrameBoardXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var rotated = currentProject.rotated;

	        var frameBaseSize = this.getFrameBaseSize();


	        var frameBorderThickness = this.getFrameBorderThickness();
	        var frameBorderThicknessTop = frameBorderThickness.top;
	        var frameBorderThicknessBottom = frameBorderThickness.bottom;
	        var frameBorderThicknessLeft = frameBorderThickness.left;
	        var frameBorderThicknessRight = frameBorderThickness.right;

	        var canvasBorderThickness = this.getCanvasBorderThickness();
	        var canvasBorderThicknessTop = canvasBorderThickness.top;
	        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
	        var canvasBorderThicknessLeft = canvasBorderThickness.left;
	        var canvasBorderThicknessRight = canvasBorderThickness.right;

	        var boardInFrame = this.getBoardInFrame();
	        var boardInFrameTop = boardInFrame.top;
	        var boardInFrameBottom = boardInFrame.bottom;
	        var boardInFrameLeft = boardInFrame.left;
	        var boardInFrameRight = boardInFrame.right;

	        var boardInMatting = this.getBoardInMatting();
	        var boardInMattingTop = boardInMatting.top;
	        var boardInMattingBottom = boardInMatting.bottom;
	        var boardInMattingLeft = boardInMatting.left;
	        var boardInMattingRight = boardInMatting.right;

	        var width = frameBaseSize.width + canvasBorderThicknessLeft + canvasBorderThicknessRight;
	        var height = frameBaseSize.height + canvasBorderThicknessTop + canvasBorderThicknessBottom;
	        var borderColor = Store.bgColor + "";
	        if (isNaN(borderColor)) {
	            borderColor = "0";
	        }
	        var s = '<frameBoard rotated="' + rotated + '" height="' + height + '" width="' + width + '" frameBorderThicknessTop="' + frameBorderThicknessTop + '" frameBorderThicknessBottom="' + frameBorderThicknessBottom + '" frameBorderThicknessLeft="' + frameBorderThicknessLeft + '" frameBorderThicknessRight="' + frameBorderThicknessRight + '" canvasBorderThicknessTop="' + canvasBorderThicknessTop + '" canvasBorderThicknessBottom="' + canvasBorderThicknessBottom + '" canvasBorderThicknessLeft="' + canvasBorderThicknessLeft + '" canvasBorderThicknessRight="' + canvasBorderThicknessRight + '" boardInFrameTop="' + boardInFrameTop + '" boardInFrameBottom="' + boardInFrameBottom + '" boardInFrameLeft="' + boardInFrameLeft + '" boardInFrameRight="' + boardInFrameRight + '" boardInMattingTop="' + boardInMattingTop + '" boardInMattingBottom="' + boardInMattingBottom + '" boardInMattingLeft="' + boardInMattingLeft + '" boardInMattingRight="' + boardInMattingRight + '" canvasBorderColor="' + borderColor + '"></frameBoard>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getMatteLayerXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var id = currentProject.matte;
	        var color = this.getMatteStyleColor();

	        var matteSize = this.getMatteSize();
	        var matteTop = matteSize.top;
	        var matteBottom = matteSize.bottom;
	        var matteLeft = matteSize.left;
	        var matteRight = matteSize.right;
	        var s = '<matteLayer id="' + id + '" x="0" y="0" px="0" py="0" matteTop="' + matteTop + '" matteBottom="' + matteBottom + '" matteLeft="' + matteLeft + '" matteRight="' + matteRight + '" depth="1" color="' + color + '"/>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPhotoLayerXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhotoLayer();

	        var bleed = this.getBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var x = photoLayer.x;
	        var y = photoLayer.y;
	        var px = photoLayer.px;
	        var py = photoLayer.py;
	        var pw = photoLayer.pw;
	        var ph = photoLayer.ph;
	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        console.log('color', Store.bgColor);
	        var tplGuid = currentProject.tplGuid;
	        var tplSuitId = currentProject.tplSuitId;
	        var s = '';
	        if (tplGuid && tplSuitId) {

	            s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '" tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '"></photosLayer>';

	        } else {
	            s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '"></photosLayer>';

	        }
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getImagesXml: function() {
	        var s = '<images>';
	        for (i = 0; i < Store.imageList.length; i++) {
	            var orientationAttr = !isNaN(Store.imageList[i].orientation) ? 'orientation="' + Store.imageList[i].orientation + '" ' : '';

	            s += '<image id="' + Store.imageList[i].id + '" guid="' + Store.imageList[i].guid + '" encImgId="' + Store.imageList[i].encImgId + '" order="' + i + '" name="' + encodeURIComponent(Store.imageList[i].name) + '" width="' + Store.imageList[i].width + '" height="' + Store.imageList[i].height + '" shotTime="' + Store.imageList[i].shotTime + '" ' + orientationAttr +'/>';
	        };
	        s += '</images>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPhotoLayer: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var object = {};
	        var rotated = currentProject.rotated;

	        var frameBaseSize = this.getFrameBaseSize();

	        var frameBorderThickness = this.getFrameBorderThickness();
	        var frameBorderThicknessTop = frameBorderThickness.top;
	        var frameBorderThicknessBottom = frameBorderThickness.bottom;
	        var frameBorderThicknessLeft = frameBorderThickness.left;
	        var frameBorderThicknessRight = frameBorderThickness.right;

	        var canvasBorderThickness = this.getCanvasBorderThickness();
	        var canvasBorderThicknessTop = canvasBorderThickness.top;
	        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
	        var canvasBorderThicknessLeft = canvasBorderThickness.left;
	        var canvasBorderThicknessRight = canvasBorderThickness.right;

	        var boardInFrame = this.getBoardInFrame();
	        var boardInFrameTop = boardInFrame.top;
	        var boardInFrameBottom = boardInFrame.bottom;
	        var boardInFrameLeft = boardInFrame.left;
	        var boardInFrameRight = boardInFrame.right;

	        var boardInMatting = this.getBoardInMatting();
	        var boardInMattingTop = boardInMatting.top;
	        var boardInMattingBottom = boardInMatting.bottom;
	        var boardInMattingLeft = boardInMatting.left;
	        var boardInMattingRight = boardInMatting.right;

	        var bleed = this.getBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var matte = currentProject.matte;
	        var product = currentProject.product;
	        var frameStyle = currentProject.frameStyle;
	        var sizeObject = __webpack_require__(17).getParameter('matteSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);

	        var matteTop = parseInt(sizeObject.top);
	        var matteBottom = parseInt(sizeObject.bottom);
	        var matteLeft = parseInt(sizeObject.left);
	        var matteRight = parseInt(sizeObject.right);

	        var floatBgSize = __webpack_require__(17).getParameter('floatBgSize', [{ key: 'product', value: product }, { key: 'size', value: size }]);
	        var floatBgTop = floatBgSize ? parseInt(floatBgSize.top) : 0;
	        var floatBgLeft = floatBgSize ? parseInt(floatBgSize.left) : 0;
	        var floatBgRight = floatBgSize ? parseInt(floatBgSize.right) : 0;
	        var floatBgBottom = floatBgSize ? parseInt(floatBgSize.bottom) : 0;

	        var baseWidth = frameBaseSize.width + canvasBorderThicknessLeft + canvasBorderThicknessRight;
	        var baseHeight = frameBaseSize.height + canvasBorderThicknessTop + canvasBorderThicknessBottom;

	        var x = 0;
	        var y = 0;
	        var width = 0;
	        var height = 0;
	        if (currentProject.rotated) {
	            x = matteBottom - bleedBottom - boardInMattingBottom + floatBgBottom /*- canvasBorderThicknessBottom*/ ;
	            y = matteLeft - bleedLeft - boardInMattingLeft + floatBgLeft /*- canvasBorderThicknessLeft*/ ;
	            width = baseWidth + bleedTop + bleedBottom - matteTop - matteBottom + boardInMattingTop + boardInMattingBottom - floatBgTop - floatBgBottom;
	            height = baseHeight + bleedLeft + bleedRight - matteLeft - matteRight + boardInMattingLeft + boardInMattingRight - floatBgLeft - floatBgRight;
	        } else {
	            x = matteLeft - bleedLeft - boardInMattingLeft + floatBgLeft /*- canvasBorderThicknessLeft*/ ;
	            y = matteTop - bleedTop - boardInMattingTop + floatBgTop /*- canvasBorderThicknessTop*/ ;
	            width = baseWidth + bleedLeft + bleedRight - matteLeft - matteRight + boardInMattingLeft + boardInMattingRight - floatBgLeft - floatBgRight;
	            height = baseHeight + bleedTop + bleedBottom - matteTop - matteBottom + boardInMattingTop + boardInMattingBottom - floatBgTop - floatBgBottom;
	        }
	        var px = x / baseWidth;
	        var py = y / baseHeight;
	        var pw = width / baseWidth;
	        var ph = height / baseHeight;

	        object.x = x;
	        object.y = y;
	        object.width = width;
	        object.height = height;
	        object.px = px;
	        object.py = py;
	        object.pw = pw;
	        object.ph = ph;

	        return object;
	    },

	    getFrameBorderAsset: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        return __webpack_require__(17).getVariable('frameBorderAsset', [{ key: 'product', value: currentProject.product }, { key: 'color', value: currentProject.color }]);
	    },
	    isSupportMatte: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var matte = __webpack_require__(17).getVariable('availableOperation', [{ key: 'product', value: currentProject.product }, { key: 'frameStyle', value: currentProject.frameStyle }]);
	        return matte.supportMatte === "true" ? true : false;
	    },
	    isSupportGlass: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var matte = __webpack_require__(17).getVariable('availableOperation', [{ key: 'product', value: currentProject.product }, { key: 'frameStyle', value: currentProject.frameStyle }]);
	        return matte.supportGlassStyle === "true" ? true : false;
	    },

	    //poster产品

	    getBaseSize: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var sizeObject = __webpack_require__(17).getParameter('baseSize', [{ key: 'product', value: product }, { key: 'size', value: size }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.width = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	        } else {
	            object.width = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	        }
	        return object;
	    },
	    getPageBleed: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var sizeObject = __webpack_require__(17).getParameter('pageBleed', [{ key: 'product', value: product }, { key: 'size', value: size }]);
	        var object = {};
	        var rotated = currentProject.rotated;
	        if (rotated) {
	            object.top = parseInt(sizeObject.left);
	            object.bottom = parseInt(sizeObject.right);
	            object.left = parseInt(sizeObject.top);
	            object.right = parseInt(sizeObject.bottom);
	        } else {
	            object.top = parseInt(sizeObject.top);
	            object.bottom = parseInt(sizeObject.bottom);
	            object.left = parseInt(sizeObject.left);
	            object.right = parseInt(sizeObject.right);
	        }
	        return object;
	    },
	    getProuctCode: function() {
	        var length = Store.projectSettings.length;
	        var str = '|';
	        for (var i = 0; i < length; i++) {
	            var product = Store.projectSettings[i].product;
	            if (str.indexOf("|" + product + "|") < 0) {
	                str += product + '|';
	            };
	        }
	        return str.substring(1, str.length - 1);
	    },
	    getPosterBaseInfoXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var s = '<project schemaVersion="3.0" createAuthor="web-h5|1.0|1" clientId="web-h5" productCode="' + this.getProuctCode() + '" categoryCode="' + Store.category + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<products>' +
	            '</products>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },

	    getPosterInitProjectXml: function() {

	        var base = this.getPosterBaseInfoXml();
	        // var product=this.getInitProductXml();
	        var product = this.getInitPosterXml();
	        var images = this.getImagesXml();

	        ($(base).find('products')).append(product.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getInitPosterXml: function() {
	        var s = '';
	        var projectLength = Store.projectSettings.length;
	        for (var i = 0; i < projectLength; i++) {
	            var currentProject = Store.projectSettings[i];
	            s += '<product type="' + currentProject.product + '">';
	            var option = this.getOptionXml(i);
	            s += __webpack_require__(19).xmlToString(option);
	            s += '<productSetting/>';
	            s += '<contents>';
	            var contentXml = this.getInitPosterContentXml();
	            s += __webpack_require__(19).xmlToString(contentXml);
	            s += '</contents>';
	            s += '</product>';
	        }
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getInitPosterContentXml: function() {
	        var currentProject = Store.projectSettings[0];
	        var content = this.getContent(0);
	        var rotated = currentProject.rotated;
	        var tplGuid = "null";
	        var tplSuitId = "null";
	        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
	        s += "<elememts>";
	        s += '<element type="PhotoElement" x="0" y="0" width="' + content.width + '" height="' + content.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />';
	        s += "</elememts>";
	        s += '</content>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPosterCurrentProjectXml: function() {

	        var base = this.getPosterBaseInfoXml();
	        var product = this.getProductXml();
	        var images = this.getImagesXml();

	        ($(base).find('products')).append(product.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getContent: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var object = {};
	        var rotated = currentProject.rotated;

	        var baseSize = this.getBaseSize();

	        var baseWidth = baseSize.width;
	        var baseHeight = baseSize.height;

	        var bleed = this.getPageBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;


	        var width = baseWidth + bleedLeft + bleedRight;
	        var height = baseHeight + bleedTop + bleedBottom;

	        var object = {};
	        object.width = width;
	        object.height = height;
	        object.bleedTop = bleedTop;
	        object.bleedBottom = bleedBottom;
	        object.bleedLeft = bleedLeft;
	        object.bleedRight = bleedRight;

	        return object;
	    },
	    getProductXml: function() {
	        var s = '';
	        var projectLength = Store.projectSettings.length;
	        for (var i = 0; i < projectLength; i++) {
	            var currentProject = Store.projectSettings[i];
	            s += '<product type="' + currentProject.product + '">';
	            var option = this.getOptionXml(i);
	            s += __webpack_require__(19).xmlToString(option);
	            s += '<productSetting/>';
	            s += '<contents>';
	            var contentXml = this.getContentXml(i);
	            s += __webpack_require__(19).xmlToString(contentXml);
	            s += '</contents>';
	            s += '</product>';
	        }
	        return __webpack_require__(19).stringToXml(s);

	    },
	    getInitProductXml: function() {
	        var s = '';
	        var projectLength = Store.projectSettings.length;
	        for (var i = 0; i < projectLength; i++) {
	            var currentProject = Store.projectSettings[i];
	            s += '<product type="' + currentProject.product + '">';
	            var option = this.getOptionXml(i);
	            s += __webpack_require__(19).xmlToString(option);
	            s += '<productSetting/>';
	            s += '<contents>';
	            var contentXml = this.getInitContentXml();
	            s += __webpack_require__(19).xmlToString(contentXml);
	            s += '</contents>';
	            s += '</product>';
	        }
	        return __webpack_require__(19).stringToXml(s);

	    },
	    getContentXml: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var content = this.getContent(index);
	        var rotated = currentProject.rotated;
	        var tplGuid = currentProject.tplGuid;
	        var tplSuitId = currentProject.tplSuitId;
	        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
	        var elements = this.getElementsXml(index);
	        s += __webpack_require__(19).xmlToString(elements);
	        s += '</content>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getInitContentXml: function() {
	        var currentProject = Store.projectSettings[0];
	        var content = this.getContent(0);
	        var rotated = currentProject.rotated;
	        var tplGuid = "null";
	        var tplSuitId = "null";
	        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
	        s += "<elememts>";
	        s += "</elememts>";
	        s += '</content>';
	        return __webpack_require__(19).stringToXml(s);
	    },

	    //Phone Case产品

	    getPhonecaseBaseSize: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index],
	            product = currentProject.product,
	            deviceType = currentProject.deviceType,
	            dpi = __webpack_require__(17).getDPI(),
	            sizeObject = __webpack_require__(17).getParameter('baseSizeInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
	            object = {};
	        object.width = sizeObject.width * dpi;
	        object.height = sizeObject.height * dpi;
	        return object;
	    },

	    getPhonecaseSide: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index],
	            product = currentProject.product,
	            deviceType = currentProject.deviceType,
	            dpi = __webpack_require__(17).getDPI(),
	            sizeObject = __webpack_require__(17).getParameter('sideInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
	            object = {};
	        object.top = sizeObject.top * dpi;
	        object.bottom = sizeObject.bottom * dpi;
	        object.left = sizeObject.left * dpi;
	        object.right = sizeObject.right * dpi;
	        return object;
	    },

	    getPhonecaseEdge: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index],
	            product = currentProject.product,
	            deviceType = currentProject.deviceType,
	            dpi = __webpack_require__(17).getDPI(),
	            sizeObject = __webpack_require__(17).getParameter('edgeInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
	            object = {};
	        object.top = sizeObject.top * dpi;
	        object.bottom = sizeObject.bottom * dpi;
	        object.left = sizeObject.left * dpi;
	        object.right = sizeObject.right * dpi;
	        return object;
	    },

	    getPhonecaseBleed: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index],
	            product = currentProject.product,
	            deviceType = currentProject.deviceType,
	            dpi = __webpack_require__(17).getDPI(),
	            sizeObject = __webpack_require__(17).getParameter('bleedInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
	            object = {};
	        object.top = sizeObject.top * dpi;
	        object.bottom = sizeObject.bottom * dpi;
	        object.left = sizeObject.left * dpi;
	        object.right = sizeObject.right * dpi;
	        return object;
	    },

	    getPhonecaseForeground: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index],
	            product = currentProject.product,
	            deviceType = currentProject.deviceType,
	            sizeObject = __webpack_require__(17).getVariable('foreground', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
	            object = {};
	        object.width = sizeObject.width;
	        object.height = sizeObject.height;
	        object.top = sizeObject.paddingTop;
	        object.right = sizeObject.paddingRight;
	        object.left = sizeObject.paddingLeft;
	        object.bottom = sizeObject.paddingBottom;
	        return object;
	    },

	    getPhonecaseBaseInfoXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var s = '<project schemaVersion="2.0" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.product + '" productType="' + Store.projectType + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<endpointToken></endpointToken>' +
	            '<phoneCase>' +
	            '</phoneCase>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },

	    getPhonecasePhotoLayerXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhonecasePhotoLayer();

	        var bleed = this.getPhonecaseBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var x = photoLayer.x;
	        var y = photoLayer.y;
	        var px = photoLayer.px;
	        var py = photoLayer.py;
	        var pw = photoLayer.pw;
	        var ph = photoLayer.ph;
	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        console.log('color', Store.bgColor);
	        var s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '"></photosLayer>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPhonecasePhotoLayer: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var object = {};

	        var BaseSize = this.getPhonecaseBaseSize();

	        var baseWidth = BaseSize.width;
	        var baseHeight = BaseSize.height;

	        var side = this.getPhonecaseSide();
	        var sideTop = side.top;
	        var sideBottom = side.bottom;
	        var sideLeft = side.left;
	        var sideRight = side.right;

	        var edge = this.getPhonecaseEdge();
	        var edgeTop = edge.top;
	        var edgeBottom = edge.bottom;
	        var edgeLeft = edge.left;
	        var edgeRight = edge.right;

	        var bleed = this.getPhonecaseBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var x = 0;
	        var y = 0;
	        var width = 0;
	        var height = 0;
	        x = -(sideLeft + edgeLeft + bleedLeft);
	        y = -(sideTop + edgeTop + bleedTop);
	        width = baseWidth + sideLeft + sideRight + edgeLeft + edgeRight + bleedLeft + bleedRight;
	        height = baseHeight + sideTop + sideBottom + edgeTop + edgeBottom + bleedTop + bleedBottom;
	        var px = x / baseWidth;
	        var py = y / baseHeight;
	        var pw = width / baseWidth;
	        var ph = height / baseHeight;

	        object.x = x;
	        object.y = y;
	        object.width = width;
	        object.height = height;
	        object.px = px;
	        object.py = py;
	        object.pw = pw;
	        object.ph = ph;

	        return object;
	    },
	    getPhonecaseInitProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPhonecaseBaseInfoXml();
	        var option = this.getOptionXml();
	        var face = this.getFaceXml();
	        var photoLayer = this.getPhonecasePhotoLayerXml();
	        var elements = this.getPhonecaseInitElemntsXml();
	        var images = this.getImagesXml();

	        ($(base).find('phoneCase')).append(option.firstChild.cloneNode(true));
	        ($(base).find('phoneCase')).append(face.firstChild.cloneNode(true));
	        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getPhonecaseCurrentProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPhonecaseBaseInfoXml();
	        var option = this.getOptionXml();
	        var face = this.getFaceXml();
	        var photoLayer = this.getPhonecasePhotoLayerXml();
	        var elements = this.getElementsXml();
	        var images = this.getImagesXml();

	        ($(base).find('phoneCase')).append(option.firstChild.cloneNode(true));
	        ($(base).find('phoneCase')).append(face.firstChild.cloneNode(true));
	        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },

	    getPhonecaseInitElemntsXml: function() {
	        var photolayer = this.getPhonecasePhotoLayer();
	        var s = '<elements>';
	        var x = 0;
	        var y = 0;
	        var width = photolayer.width;
	        var height = photolayer.height;
	        var px = x / photolayer.width;
	        var py = y / photolayer.height;
	        var ph = height / photolayer.height;
	        var pw = width / photolayer.width;
	        var rot = 0;
	        var dep = 0;
	        var imageid = '';
	        var imgRot = false;
	        var imgFlip = false;
	        var cropPX = 0,
	            cropPY = 0,
	            cropPW = 1,
	            cropPH = 1;
	        s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
	        s += '</elements>';
	        return __webpack_require__(19).stringToXml(s);
	    },

	    getFaceXml: function() {
	        var BaseSize = this.getPhonecaseBaseSize();
	        var baseWidth = BaseSize.width;
	        var baseHeight = BaseSize.height;

	        var side = this.getPhonecaseSide();
	        var sideTop = side.top;
	        var sideBottom = side.bottom;
	        var sideLeft = side.left;
	        var sideRight = side.right;

	        var edge = this.getPhonecaseEdge();
	        var edgeTop = edge.top;
	        var edgeBottom = edge.bottom;
	        var edgeLeft = edge.left;
	        var edgeRight = edge.right;
	        var s = '';
	        var projectLength = Store.projectSettings.length;
	        for (var i = 0; i < projectLength; i++) {
	            var currentProject = Store.projectSettings[i];
	            s += '<face width="' + baseWidth + '" height="' + baseHeight + '" sideLeft="' + sideLeft + '" sideTop="' + sideTop + '" sideRight="' + sideRight + '" sideBottom="' + sideBottom + '" edgeLeft="' + edgeLeft + '" edgeTop="' + edgeTop + '" edgeRight="' + edgeRight + '" edgeBottom="' + edgeBottom + '">';
	            s += '</face>';
	        }
	        return __webpack_require__(19).stringToXml(s);
	    },

	    getPhonecaseContent: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var object = {};

	        var baseSize = this.getPhonecaseBaseSize();

	        var baseWidth = baseSize.width;
	        var baseHeight = baseSize.height;

	        var side = this.getPhonecaseSide();
	        var sideTop = side.top;
	        var sideBottom = side.bottom;
	        var sideLeft = side.left;
	        var sideRight = side.right;

	        var edge = this.getPhonecaseEdge();
	        var edgeTop = edge.top;
	        var edgeBottom = edge.bottom;
	        var edgeLeft = edge.left;
	        var edgeRight = edge.right;

	        var bleed = this.getPhonecaseBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var foreground = this.getPhonecaseForeground();

	        var width = baseWidth + bleedLeft + bleedRight + edgeLeft + edgeRight + sideLeft + sideRight;
	        var height = baseHeight + bleedTop + bleedBottom + edgeTop + edgeBottom + sideTop + sideBottom;

	        var realWidth = foreground.width - foreground.left - foreground.right;
	        var realHeight = foreground.height - foreground.top - foreground.bottom;

	        var ratio = baseWidth / realWidth;
	        var bgWidth = foreground.width * ratio;
	        var bgHeight = foreground.height * ratio;

	        object.bgWidth = bgWidth;
	        object.bgHeight = bgHeight;
	        object.width = width;
	        object.height = height;
	        object.x = foreground.left * ratio - bleedLeft - sideLeft - edgeLeft;
	        object.y = foreground.top * ratio - bleedTop - sideTop - edgeTop;
	        object.bleedTop = bleedTop;
	        object.bleedBottom = bleedBottom;
	        object.bleedLeft = bleedLeft;
	        object.bleedRight = bleedRight;
	        object.sideTop = sideTop;
	        object.sideBottom = sideBottom;
	        object.sideLeft = sideLeft;
	        object.sideRight = sideRight;
	        object.edgeTop = edgeTop;
	        object.edgeBottom = edgeBottom;
	        object.edgeLeft = edgeLeft;
	        object.edgeRight = edgeRight;
	        return object;
	    },

	    //WallArts
	    getWallArtsInitProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getBaseInfoXml();
	        var option = this.getOptionXml();
	        var frameBoard = this.getFrameBoardXml();
	        var matteLayer = this.getMatteLayerXml();
	        var photoLayer = this.getPhotoLayerXml();
	        var elements = this.getWallArtsIntiElementXml();
	        var images = this.getImagesXml();

	        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
	        ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
	        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getWallArtsIntiElementXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhotoLayer();

	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        var s = '<elements>' +
	            '<element type="PhotoElement" x="0" y="0" width="' + width + '" height="' + height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +
	            '</elements>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPrintInitProjectXml: function() {
	        return __webpack_require__(19).xmlToString(this.getPrintInitXml());
	    },
	    getPrintInitXml: function() {

	        var s = '<project schemaVersion="1" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.baseProject.product + '" productType="' + Store.projectType + '" baseSize="' + Store.baseProject.size + '" basePaper="' + Store.baseProject.paper + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<endpointToken></endpointToken>' +
	            '<prints>' +
	            '</prints>' +
	            '<images>' +
	            '</images>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);

	    },
	    getPrintBaseProjectXml: function() {
	        var s = '<project schemaVersion="1" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.baseProject.product + '" productType="' + Store.projectType + '" baseSize="' + Store.baseProject.size + '" basePaper="' + Store.baseProject.paper + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<endpointToken></endpointToken>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPrintProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPrintBaseProjectXml();
	        var content = this.getPrintContentXml();
	        var images = this.getImagesXml();

	        ($(base).find('project')).append(content.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getPrintContentXml: function() {

	        var currentProjects = Store.projectSettings;
	        var currentPages = Store.pages;
	        var s = "";
	        s += '<prints>';
	        for (var i = 0; i < currentPages.length; i++) {
	            var currentCanvas = currentPages[i].canvas;
	            var elememts = currentCanvas.params;
	            var currentProject = currentProjects[i];

	            s += '<print id="' + __webpack_require__(20).guid() + '" quantity="' + currentProject.quantity + '" imageId="' + elememts[0].imageId + '">';
	            s += '<spec version="' + __webpack_require__(17).getVersion() + '">';
	            s += '<option id="paper" value="' + currentProject.paper + '"/>';
	            s += '<option id="size" value="' + currentProject.size + '"/>';
	            if (typeof(currentProject.surfaceType) != 'undefined' && currentProject.surfaceType !== 'undefined') {
	                s += '<option id="surfaceType" value="' + currentProject.surfaceType + '"/>';
	            }

	            s += '</spec>';
	            var baseSize = this.getPrintBaseSize({ 'size': currentProject.size, 'rotated': currentProject.rotated });
	            var bleed = this.getPrintBleed(currentProject.size);
	            var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
	            var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';
	            s += '<content id="' + __webpack_require__(20).guid() + '" width="' + baseSize.width + '" height="' + baseSize.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" borderLength="' + borderLength + '" borderColor="' + borderColor + '">';
	            s += '<elements>';
	            var x = elememts[0].x;
	            var y = elememts[0].y;
	            var width = elememts[0].width;
	            var height = elememts[0].height;
	            var px = x / currentCanvas.oriWidth;
	            var py = y / currentCanvas.oriHeight;
	            var ph = height / currentCanvas.oriHeight;
	            var pw = width / currentCanvas.oriWidth;
	            var rot = elememts[0].rotate;
	            var dep = elememts[0].dep;
	            var imageid = elememts[0].imageId;
	            var imgRot = elememts[0].imageRotate;
	            var imgFlip = false;
	            var cropPX = elememts[0].cropPX,
	                cropPY = elememts[0].cropPY,
	                cropPW = elememts[0].cropPW,
	                cropPH = elememts[0].cropPH;
	            if (elememts[0].elType === 'text') {

	                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[0].fontColor + '" fontSize="' + parseFloat(elememts[0].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[0].fontFamily) + '" fontWeight="' + elememts[0].fontWeight + '" textAlign="' + elememts[0].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[0].text) + ']]></element>';

	            } else if (elememts[0].elType === 'logo') {

	                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';

	            } else if (elememts[0].elType === 'image') {

	                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
	            }

	            s += '</elements>';
	            s += '</content>';
	            s += '</print>';
	        };
	        s += '</prints>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getRemarkProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPrintBaseProjectXml();
	        var content = this.getRemarkContentXml();
	        var images = this.getImagesXml();

	        ($(base).find('project')).append(content.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getRemarkContentXml: function() {
	        var currentProjects = Store.projectSettings;
	        var currentPages = Store.pages;
	        var remarkPages = [];
	        for (var i = 0; i < currentProjects.length; i++) {
	            if (Store.selectedSize) {
	                if (Store.selectedPaper) {
	                    if (currentProjects[i].size === Store.selectedSize && currentProjects[i].paper === Store.selectedPaper) {
	                        remarkPages.push(currentPages[i]);
	                        remarkPages[remarkPages.length - 1].oid = i;
	                    }
	                } else {
	                    if (currentProjects[i].size === Store.selectedSize) {
	                        remarkPages.push(currentPages[i]);
	                        remarkPages[remarkPages.length - 1].oid = i;
	                    }
	                }
	            } else {
	                if (Store.selectedPaper) {
	                    if (currentProjects[i].paper === Store.selectedPaper) {
	                        remarkPages.push(currentPages[i]);
	                        remarkPages[remarkPages.length - 1].oid = i;
	                    }
	                }
	            }
	        }
	        if (remarkPages.length === 0) {
	            remarkPages = currentPages;
	            for (var i = 0; i < remarkPages.length; i++) {
	                remarkPages[i].oid = i;
	            }
	        }
	        var s = "";
	        s += '<prints>';
	        for (var i = 0; i < remarkPages.length; i++) {
	            var currentCanvas = remarkPages[i].canvas;
	            var elememts = currentCanvas.params;
	            var currentProject = currentProjects[remarkPages[i].oid];

	            s += '<print id="' + remarkPages[i].guid + '" quantity="' + currentProject.quantity + '" imageId="' + elememts[0].imageId + '">';
	            s += '<spec version="' + __webpack_require__(17).getVersion() + '">';
	            s += '<option id="paper" value="' + currentProject.paper + '"/>';
	            s += '<option id="size" value="' + currentProject.size + '"/>';
	            if (typeof(currentProject.surfaceType) != 'undefined' && currentProject.surfaceType !== 'undefined') {
	                s += '<option id="surfaceType" value="' + currentProject.surfaceType + '"/>';
	            }
	            s += '</spec>';
	            var baseSize = this.getPrintBaseSize({ 'size': currentProject.size, 'rotated': currentProject.rotated });
	            var bleed = this.getPrintBleed(currentProject.size);
	            var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
	            var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';
	            s += '<content id="' + currentCanvas.guid + '" width="' + baseSize.width + '" height="' + baseSize.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" borderLength="' + borderLength + '" borderColor="' + borderColor + '">';
	            s += '<elements>';
	            var x = elememts[0].x;
	            var y = elememts[0].y;
	            var width = elememts[0].width;
	            var height = elememts[0].height;
	            var px = x / currentCanvas.oriWidth;
	            var py = y / currentCanvas.oriHeight;
	            var ph = height / currentCanvas.oriHeight;
	            var pw = width / currentCanvas.oriWidth;
	            var rot = elememts[0].rotate;
	            var dep = elememts[0].dep;
	            var imageid = elememts[0].imageId;
	            var imgRot = elememts[0].imageRotate;
	            var imgFlip = false;
	            var cropPX = elememts[0].cropPX,
	                cropPY = elememts[0].cropPY,
	                cropPW = elememts[0].cropPW,
	                cropPH = elememts[0].cropPH;
	            if (elememts[0].elType === 'text') {

	                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[0].fontColor + '" fontSize="' + parseFloat(elememts[0].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[0].fontFamily) + '" fontWeight="' + elememts[0].fontWeight + '" textAlign="' + elememts[0].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[0].text) + ']]></element>';

	            } else if (elememts[0].elType === 'logo') {

	                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';

	            } else if (elememts[0].elType === 'image') {

	                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
	            }

	            s += '</elements>';
	            s += '</content>';
	            s += '</print>';
	        };
	        s += '</prints>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPrintBaseSize: function(param) {
	        var size, rotated;
	        if (!param.size) {
	            size = Store.baseProject.size;
	        } else {
	            size = param.size;
	        }
	        if (!param.rotated) {
	            rotated = false;
	        } else {
	            rotated = param.rotated;
	        }
	        var sizeObject = __webpack_require__(17).getParameter('printsBaseSize', [{ key: 'product', value: 'print' }, { key: 'size', value: size }]);
	        var object = {};
	        if (rotated) {
	            object.width = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	        } else {
	            object.width = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	            object.height = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	        }
	        return object;
	    },
	    getPrintBleed: function(size) {
	        if (!size) {
	            size = Store.baseProject.size;
	        }
	        var sizeObject = __webpack_require__(17).getParameter('bleed', [{ key: 'size', value: size }]);
	        var object = {};
	        object.top = parseInt(sizeObject.left);
	        object.bottom = parseInt(sizeObject.right);
	        object.left = parseInt(sizeObject.top);
	        object.right = parseInt(sizeObject.bottom);
	        return object;
	    },


	    //  cards 产品
	    getCardSpread: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var object = {};

	        var baseSize = this.getCardBaseSize();

	        var baseWidth = baseSize.width;
	        var baseHeight = baseSize.height;

	        var bleed = this.getPageBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var width = baseWidth + bleedLeft + bleedRight;
	        var height = baseHeight + bleedTop + bleedBottom;

	        var object = {};
	        object.width = width;
	        object.height = height;
	        object.bleedTop = bleedTop;
	        object.bleedBottom = bleedBottom;
	        object.bleedLeft = bleedLeft;
	        object.bleedRight = bleedRight;

	        return object;
	    },
	    getCardBaseSize: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var product = currentProject.product;
	        var size = currentProject.size;
	        var format = currentProject.format;
	        var orientation = currentProject.orientation;
	        var sizeObject = __webpack_require__(17).getParameter('baseSize',[{key:'product',value:product},{key:'size',value:size},{key:'orientation',value:orientation},{key:'format',value:format}]);
	        var object = {};

	        object.width = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	        object.height = sizeObject.heightInInch * __webpack_require__(17).getDPI();

	        return object;
	    },
	    getCardCurrentProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getCardsBaseProjectXml();
	        var content = this.getCardsContentXml();
	        var images = this.getImagesXml();
	        var decorations = this.getDecorationXml();

	        ($(base).find('project')).append(content.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));
	        ($(base).find('project')).append(decorations.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getCardsBaseProjectXml: function() {
	        if (Store.isPortal) { Store.deletedPhoto = 'false' }
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var s = '<project schemaVersion="1" clientId="web-h5" productType="' + currentProject.product + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<deletedPhoto>' + Store.deletedPhoto + '</deletedPhoto>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getCardsContentXml: function() {
	        var projectLength = Store.projectSettings.length;
	        var s = '<card id="' + Store.cardId + '">';
	        for (var i = 0; i < projectLength; i++) {
	            var currentProject = Store.projectSettings[i];
	            var option = this.getOptionXml(i);
	            s += __webpack_require__(19).xmlToString(option);
	            var contentXml = this.getCardContentXml(i);
	            s += __webpack_require__(19).xmlToString(contentXml);
	            var cardSetting = this.getCardSettingXml(i);
	            s += __webpack_require__(19).xmlToString(cardSetting);
	        }
	        s += '</card>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getCardSettingXml: function(index) {
	        var s = ' <cardSetting >';
	        s += '<styleId value="' + Store.cardSetting.styleId + '"/>';
	        s += '<festival value="' + Store.cardSetting.festival + '"/>';
	        if(Store.templateGuid) {
	            s += '<templateGuid value="' + Store.templateGuid + '"/>';
	        }
	        s += '</cardSetting>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getCardContentXml: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        };
	        var currentProject = Store.projectSettings[index];
	        var pages = Store.pages;
	        var bleed = this.getPageBleed();
	        var s = '<spreads>';
	        var content = this.getCardSpread(index);
	        for (var j = 0; j < pages.length; j++) {
	            var currentPage = pages[j];
	            s += '<spread id="' + currentPage.id + '" width="' + currentPage.width + '" height="' + currentPage.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" type="' + currentPage.type + '" month="0" year="0" tplGuid="' + currentPage.tplGuid + '" pageNumber="' + currentPage.pageNumber + '" styleId="' + currentPage.styleId + '" styleItemId="' + currentPage.styleItemId + '" w="' + currentPage.width + '" h="' + currentPage.height + '">'
	            var elements = this.getCardElementsXml(j);
	            s += __webpack_require__(19).xmlToString(elements);
	            s += '</spread>';
	        }
	        s += '</spreads>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getCardElementsXml: function(index) {
	        if (!index) {
	            index = Store.currentSelectProjectIndex;
	        }
	        var currentProject = Store.projectSettings[index];
	        var currentCanvas = Store.pages[index].canvas;
	        var elememts = currentCanvas.params;
	        var s = '<elements>';

	        for (var i = 0; i < elememts.length; i++) {
	            var index = elememts[i].index ? ' index="' + elememts[i].index + '" ' : '';
	            var x = elememts[i].x;
	            var y = elememts[i].y;
	            var width = elememts[i].width;
	            var height = elememts[i].height;
	            var px = x / currentCanvas.oriWidth;
	            var py = y / currentCanvas.oriHeight;
	            var ph = height / currentCanvas.oriHeight;
	            var pw = width / currentCanvas.oriWidth;
	            var rot = elememts[i].rotate;
	            var dep = elememts[i].dep;
	            var imageid = elememts[i].imageId;
	            var imgRot = elememts[i].imageRotate;
	            var imgFlip = false;
	            var cropPX = elememts[i].cropPX,
	                cropPY = elememts[i].cropPY,
	                cropPW = elememts[i].cropPW,
	                cropPH = elememts[i].cropPH;
	            var decorationid = elememts[i].decorationid;
	            var decorationtype = elememts[i].decorationtype;
	            var styleGuid = elememts[i].styleGuid;
	            var styleId = elememts[i].styleId;
	            var styleItemId = elememts[i].styleItemId;
	            var styleImageId = elememts[i].styleImageId;
	            var isFamilyName = elememts[i].isFamilyName || "false";
	            var textAlign = elememts[i].textAlign || "left";
	            var textVAlign = elememts[i].textVAlign || "top";
	            var lineSpacing = elememts[i].lineSpacing || "1";
	            var fontColor = elememts[i].fontColor;
	            fontColor = (typeof(fontColor) == 'string' && fontColor.indexOf('#') > -1) ? __webpack_require__(7).hexToDec(fontColor) : fontColor;

	            var addtionalAttrKeys = ['tagName', 'tagType', 'mandatory', 'constant', 'isEdit', 'isDisableRemind', 'order'];
	            var addtionalAttrValues = [];
	            addtionalAttrKeys.forEach(function(item) {
	                if (item in elememts[i] && ((typeof elememts[i][item]) != 'undefined') && elememts[i][item] != 'undefined') {
	                    addtionalAttrValues.push(' ' + item + '="' + elememts[i][item] + '"');
	                }
	            });
	            var addtionalAttrString = addtionalAttrValues.join('');

	            if (elememts[i].elType === 'style') {

	                s += '<element type="CalendarStyleElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" styleId ="' + styleId + '" styleItemId ="' + styleItemId + '" styleGuid ="' + styleGuid + '" imageId="' + styleImageId + '"' + index + ' />';

	            } else if (elememts[i].elType === 'text') {

	                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + fontColor + '" fontSize="' + parseFloat(elememts[i].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[i].fontFamily) + '" fontWeight="' + elememts[i].fontWeight + '" textAlign="' + textAlign + '" textVAlign="' + textVAlign + '" lineSpacing="' + lineSpacing + '" isFamilyName="' + isFamilyName + '"' + addtionalAttrString + index + ' ><![CDATA[' + encodeURIComponent(elememts[i].text) + ']]></element>';

	            } else if (elememts[i].elType === 'image') {

	                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"' + index + ' />';
	            } else if (elememts[i].elType === 'decoration') {
	                if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height))
	                    s += '<element type="DecorationElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" decorationid="' + decorationid + '" decorationtype="' + decorationtype + '"' + index + ' />';
	            }
	        }
	        s += '</elements>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getDecorationXml: function() {
	        var s = '<decorations>';
	        for (var i = 0; i < Store.allDecorationList.length; i++) {
	            if (Store.allDecorationList[i].count) {
	                var item = Store.allDecorationList[i];
	                s += '<decoration guid="' + item.guid + '" name="' + item.name + '" type="' + item.type + '" count="' + item.count + '" displayRatio="' + item.displayRatio + '" width="' + item.width + '" height="' + item.height + '"/>'
	            }
	        };
	        s += '</decorations>';
	        return __webpack_require__(19).stringToXml(s);
	    },
	    getCardInitXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        Store.cardId = __webpack_require__(20).guid();
	        var s = '<project schemaVersion="1" clientId="web-h5" productType="' + currentProject.product + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<deletedPhoto>false</deletedPhoto>' +
	            '<card id="' + Store.cardId + '">' +
	            '<spec version="1.0">' +
	            '<option id="size" value="' + currentProject.size + '"/>' +
	            '<option id="paper" value="' + currentProject.paper + '"/>' +
	            '<option id="product" value="' + currentProject.product + '"/>' +
	            '<option id="orientation" value="' + currentProject.orientation + '"/>' +
	            '<option id="trim" value="' + currentProject.trim + '"/>' +
	            '</spec>'
	        var contentString = this.getCardContentInitString()
	        s += contentString;
	        s += '<cardSetting>' +
	            '<styleId value="' + Store.styleId + '"/>' +
	            '<festival value="' + Store.festival + '"/>' +
	            '</cardSetting>' +
	            '</card>' +
	            '<images></images>' +
	            '<decorations></decorations>' +
	            '</project>';
	        return s;
	    },
	    getCardContentInitString: function() {
	        var product = Store.projectSettings[Store.currentSelectProjectIndex].product;
	        var spread = this.getCardSpread();
	        var spread = __webpack_require__(18).getCardSpread();
	        var orientation = Store.projectSettings[Store.selectedIdx].orientation;
	        var product = Store.projectSettings[Store.selectedIdx].product;
	        var coverWidth = product === "FD" && orientation == "PO" ? spread.width / 2 : spread.width;
	        var coverHeight = product === "FD" && orientation == "LA" ? spread.height / 2 : spread.height;
	        var s = '<spreads>';
	        s += '<spread id="'+__webpack_require__(20).guid()+'" width="'+ coverWidth +'" height="'+ coverHeight +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="frontPage" month="0" year="0" tplGuid="null" pageNumber="0" styleId="'+ Store.styleId +'" styleItemId="0" w="'+ coverWidth +'" h="'+ coverHeight +'">' +
	                '<elements>' +
	                    (!Store.isBlankCard ?
	                    '<element type="CalendarStyleElement" x="0" y="0" width="'+ coverWidth +'" height="'+ coverHeight +'" px="0" py="0" pw="1" ph="1" rot="0" dep="-999" styleId="'+ Store.styleId +'" styleItemId="0" styleGuid="'+ Store.styleGuid +'" imageId="0" />' : '')+
	                '</elements>' +
	              '</spread>' +
	              '<spread id="'+__webpack_require__(20).guid()+'" width="'+ coverWidth +'" height="'+ coverHeight +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="backPage" month="0" year="0" tplGuid="null" pageNumber="1" styleId="'+ Store.styleId +'" styleItemId="1" w="'+ coverWidth +'" h="'+ coverHeight +'">' +
	                '<elements>' +
	                    (!Store.isBlankCard ?
	                    '<element type="CalendarStyleElement" x="0" y="0" width="'+ coverWidth +'" height="'+ coverHeight +'" px="0" py="0" pw="1" ph="1" rot="0" dep="-999" styleId="'+ Store.styleId +'" styleItemId="1" styleGuid="'+ Store.styleGuid +'" imageId="1" />' : '')+
	                '</elements>' +
	              '</spread>'
	        if( product === "FD" ){
	            s += '<spread id="'+__webpack_require__(20).guid()+'" width="'+ spread.width +'" height="'+ spread.height +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="insidePage" month="0" year="0" tplGuid="null" pageNumber="2" styleId="'+ Store.styleId +'" styleItemId="2" w="'+ spread.width +'" h="'+ spread.height +'">' +
	                    '<elements>' +
	                    '</elements>' +
	                  '</spread>'
	        }
	        s += '</spreads>';
	        return s;
	    },
	    getPadcaseBaseInfoXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var product = currentProject.product;
	        var s = '<project schemaVersion="2.0" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.product + '" productType="' + Store.projectType + '">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan>' + Store.userSettings.userName + '</artisan>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate></createdDate>' +
	            '<updatedDate></updatedDate>' +
	            '<endpointToken></endpointToken>' +
	            '<padCase>' +
	            '</padCase>' +
	            '</project>';

	        return __webpack_require__(19).stringToXml(s);
	    },
	    getPadcaseInitProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPadcaseBaseInfoXml();
	        var option = this.getOptionXml();
	        var face = this.getFaceXml();
	        var photoLayer = this.getPhonecasePhotoLayerXml();
	        var elements = this.getPhonecaseInitElemntsXml();
	        var images = this.getImagesXml();

	        ($(base).find('padCase')).append(option.firstChild.cloneNode(true));
	        ($(base).find('padCase')).append(face.firstChild.cloneNode(true));
	        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    getPadcaseCurrentProjectXml: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var base = this.getPadcaseBaseInfoXml();
	        var option = this.getOptionXml();
	        var face = this.getFaceXml();
	        var photoLayer = this.getPhonecasePhotoLayerXml();
	        var elements = this.getElementsXml();
	        var images = this.getImagesXml();

	        ($(base).find('padCase')).append(option.firstChild.cloneNode(true));
	        ($(base).find('padCase')).append(face.firstChild.cloneNode(true));
	        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
	        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
	        ($(base).find('project')).append(images.firstChild.cloneNode(true));

	        return __webpack_require__(19).xmlToString(base);
	    },
	    // 获取当前项目的projectSettings，如果当前项目不存在，获取baseProject的settings
	    getProjectSettings: function(idx) {
	        var projectSettings = {};
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var currentProject = Store.projectSettings[idx || Store.currentSelectProjectIndex];

	        if (!currentProject) {
	            currentProject = Store.baseProject;
	        }

	        var projectSettingKeys = Object.keys(currentProject).filter(function(projectKey) {
	            return optionIds.some(function(optionId) {
	                return projectKey === optionId;
	            });
	        });

	        projectSettingKeys.forEach(function(settingKey) {
	            projectSettings[settingKey] = currentProject[settingKey];
	        });

	        return projectSettings;
	    },
	    // 获取当前项目的paramsList
	    getParamsList: function(idx) {
	        var projectSettings = this.getProjectSettings(idx);

	        return Object.keys(projectSettings).map(function(settingKey) {
	            return {
	                key: settingKey,
	                value: projectSettings[settingKey]
	            }
	        });
	    },
	    getSizedBgBorderParams: function(canvasId) {
	        var canvasDom = document.getElementById(canvasId);
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        var foreground = currentCanvas.foreground;
	        var oriBgWidth = currentCanvas.oriBgWidth;
	        var oriBgHeight = currentCanvas.oriBgHeight;
	        var oriWidth = currentCanvas.oriWidth;
	        var oriHeight = currentCanvas.oriHeight;
	        var ratio = canvasDom.width / oriBgWidth;
	        var replaceX = Math.floor(foreground.left * ratio);
	        var replaceY = Math.floor(foreground.top * ratio);
	        var replaceWidth = Math.floor(oriWidth * ratio);
	        var replaceHeight = Math.floor(oriHeight * ratio);

	        return {
	            x: replaceX,
	            y: replaceY,
	            width: replaceWidth,
	            height: replaceHeight
	        }
	    },
	    getWallArtsCurrentProjectJson: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };
	        specObject.orientation = currentProject['rotated'] ? 'Landscape' : 'Portrait';
	        var defaultPages = [this.getWallartsPages()];
	        var json = {
	            project: {
	                "version": specVersion,
	                "clientId": "web-h5",
	                "createAuthor": "web-h5|1.1|1",
	                "userId": Store.userSettings.userId,
	                "artisan": Store.userSettings.userName,
	                "title": Store.title,
	                "updatedDate": __webpack_require__(21).formatDateTime(new Date()),
	                "createdDate": __webpack_require__(21).formatDateTime(new Date()),
	                "guid": Store.projectId,
	                "summary": {
	                    "defaultSetting": specObject
	                },
	                "pages": defaultPages,
	                "images": this.getImages()

	            }
	        }

	        return json;
	    },
	    getWallArtsInitProjectJson: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };
	        specObject.orientation = 'Landscape';
	        var defaultPages = [this.getWallartsPages(true)];
	        var json = {
	            project: {
	                "version": specVersion,
	                "clientId": "web-h5",
	                "createAuthor": "web-h5|1.1|1",
	                "userId": Store.userSettings.userId,
	                "artisan": Store.userSettings.userName,
	                "title": Store.title,
	                "updatedDate": __webpack_require__(21).formatDateTime(new Date()),
	                "createdDate": __webpack_require__(21).formatDateTime(new Date()),
	                "guid": Store.projectId,
	                "summary": {
	                    "defaultSetting": specObject
	                },
	                "pages": defaultPages,
	                "images": []

	            }
	        }

	        return json;
	    },
	    getWallartsPages: function(isInit) {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhotoLayer();

	        var bleed = this.getBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var x = photoLayer.x;
	        var y = photoLayer.y;

	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        var tplGuid = currentProject.tplGuid;
	        var tplSuitId = currentProject.tplSuitId;
	        var frameBaseSize = this.getFrameBaseSize();


	        var frameBorderThickness = this.getFrameBorderThickness();
	        var frameBorderThicknessTop = frameBorderThickness.top;
	        var frameBorderThicknessBottom = frameBorderThickness.bottom;
	        var frameBorderThicknessLeft = frameBorderThickness.left;
	        var frameBorderThicknessRight = frameBorderThickness.right;

	        var canvasBorderThickness = this.getCanvasBorderThickness();
	        var canvasBorderThicknessTop = canvasBorderThickness.top;
	        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
	        var canvasBorderThicknessLeft = canvasBorderThickness.left;
	        var canvasBorderThicknessRight = canvasBorderThickness.right;

	        var boardInFrame = this.getBoardInFrame();
	        var boardInFrameTop = boardInFrame.top;
	        var boardInFrameBottom = boardInFrame.bottom;
	        var boardInFrameLeft = boardInFrame.left;
	        var boardInFrameRight = boardInFrame.right;

	        var boardInMatting = this.getBoardInMatting();
	        var boardInMattingTop = boardInMatting.top;
	        var boardInMattingBottom = boardInMatting.bottom;
	        var boardInMattingLeft = boardInMatting.left;
	        var boardInMattingRight = boardInMatting.right;

	        var borderColor = Store.bgColor + "";

	        var color = this.getMatteStyleColor();

	        var matteSize = this.getMatteSize();
	        var matteTop = matteSize.top;
	        var matteBottom = matteSize.bottom;
	        var matteLeft = matteSize.left;
	        var matteRight = matteSize.right;
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };
	        var elements;
	        if (isInit) {
	            elements = [
	                {
	                    type: "PhotoElement",
	                    x: "0",
	                    y: "0",
	                    width: width,
	                    height: height,
	                    px: "0",
	                    py: "0",
	                    pw: "1",
	                    ph: "1",
	                    rot: "0",
	                    dep: "0",
	                    imageid: "",
	                    imgRot: "0",
	                    imgFlip: false,
	                    cropLUX: "0",
	                    cropLUY: "0",
	                    cropRLX: "1",
	                    cropRLY: "1"
	                }
	            ];
	        } else {
	            elements = __webpack_require__(22).getElements();
	        }
	        if(currentProject.product.indexOf('table_')> -1){
	            return {
	                "id": __webpack_require__(20).guid(),
	                "width": width,
	                "height": height,
	                "bgColor": "#FFFFFF",
	                "type": "Page",
	                "bleed": {
	                    "top": bleedTop,
	                    "bottom": bleedBottom,
	                    "left": bleedLeft,
	                    "right": bleedRight
	                },
	                "elements": elements,
	                "backend": {
	                    "isPrint": true,
	                    "slice": false
	                },
	                "quantity": 1,
	                "spec":specObject,
	                "frameBorder": {
	                    "left": frameBorderThicknessLeft,
	                    "top": frameBorderThicknessTop,
	                    "right": frameBorderThicknessRight,
	                    "bottom": frameBorderThicknessBottom
	                },
	                "borderInFrame": {
	                    "left": boardInFrameLeft,
	                    "top": boardInFrameTop,
	                    "right": boardInFrameRight,
	                    "bottom": boardInFrameBottom
	                }
	            }
	        }else{
	            return {
	                "id": __webpack_require__(20).guid(),
	                "width": width,
	                "height": height,
	                "bgColor": "#FFFFFF",
	                "type": "Page",
	                "bleed": {
	                    "top": bleedTop,
	                    "bottom": bleedBottom,
	                    "left": bleedLeft,
	                    "right": bleedRight
	                },
	                "elements": elements,
	                "backend": {
	                    "isPrint": true,
	                    "slice": false
	                },
	                "quantity": 1,
	                "spec":specObject,
	                "frameBorder": {
	                    "left": frameBorderThicknessLeft,
	                    "top": frameBorderThicknessTop,
	                    "right": frameBorderThicknessRight,
	                    "bottom": frameBorderThicknessBottom
	                },
	                "borderInFrame": {
	                    "left": boardInFrameLeft,
	                    "top": boardInFrameTop,
	                    "right": boardInFrameRight,
	                    "bottom": boardInFrameBottom
	                },
	                "boardInMatting": {
	                    "left": boardInMattingLeft,
	                    "top": boardInMattingTop,
	                    "right": boardInMattingRight,
	                    "bottom": boardInMattingBottom
	                },
	                "matteLayer": {
	                    "x": 0,
	                    "y": 0,
	                    "px": 0,
	                    "py": 0,
	                    "left": matteLeft,
	                    "right": matteRight,
	                    "top": matteTop,
	                    "bottom": matteBottom,
	                    "color": color,
	                    "depth": 1
	                },
	                "canvasBorder": {
	                    "left": canvasBorderThicknessLeft,
	                    "top": canvasBorderThicknessTop,
	                    "right": canvasBorderThicknessRight,
	                    "bottom": canvasBorderThicknessBottom,
	                    "color": borderColor
	                }
	            }

	        }
	        
	    },
	    getImages: function() {
	        var images = [];
	        for(var i = 0; i < Store.imageList.length; i++) {
	          var item = Store.imageList[i];
	          images.push({
	            id: item.id,
	            guid: item.guid,
	            encImgId: item.encImgId,
	            order: i,
	            name: encodeURIComponent(item.name),
	            width: item.width,
	            height: item.height,
	            shotTime: item.shotTime,
	            orientation: item.orientation
	          });
	        }
	        return images;
	    },
	    getPhonecaseCurrentProjectJson: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };
	        var defaultPages = [this.getPhoneCasePages()];
	        var json = {
	            project: {
	                "version": specVersion,
	                "clientId": "web-h5",
	                "createAuthor": "web-h5|1.1|1",
	                "userId": Store.userSettings.userId,
	                "artisan": Store.userSettings.userName,
	                "title": Store.title,
	                "updatedDate": __webpack_require__(21).formatDateTime(new Date()),
	                "createdDate": __webpack_require__(21).formatDateTime(new Date()),
	                "guid": Store.projectId,
	                "summary": {
	                    "defaultSetting": specObject
	                },
	                "pages": defaultPages,
	                "images": this.getImages()

	            }
	        }

	        return json;
	    },
	    getPhonecaseInitProjectJson: function() {
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };
	        var defaultPages = [this.getPhoneCasePages(true)];
	        var json = {
	            project: {
	                "version": specVersion,
	                "clientId": "web-h5",
	                "createAuthor": "web-h5|1.1|1",
	                "userId": Store.userSettings.userId,
	                "artisan": Store.userSettings.userName,
	                "title": Store.title,
	                "updatedDate": __webpack_require__(21).formatDateTime(new Date()),
	                "createdDate": __webpack_require__(21).formatDateTime(new Date()),
	                "guid": Store.projectId,
	                "summary": {
	                    "defaultSetting": specObject
	                },
	                "pages": defaultPages,
	                "images": []

	            }
	        }

	        return json;
	    },
	    getPhoneCasePages: function(isInit) {

	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var photoLayer = this.getPhonecasePhotoLayer();

	        var bleed = this.getPhonecaseBleed();
	        var bleedTop = bleed.top;
	        var bleedBottom = bleed.bottom;
	        var bleedLeft = bleed.left;
	        var bleedRight = bleed.right;

	        var x = photoLayer.x;
	        var y = photoLayer.y;
	        var px = photoLayer.px;
	        var py = photoLayer.py;
	        var pw = photoLayer.pw;
	        var ph = photoLayer.ph;
	        var width = photoLayer.width;
	        var height = photoLayer.height;
	        var optionIds = __webpack_require__(17).getOptionIds();
	        var specObject = {};
	        for (var i = 0; i < optionIds.length; i++) {
	            specObject[optionIds[i]] = currentProject[optionIds[i]];
	        };

	        var elements;
	        if (isInit) {
	            elements = [
	                {
	                    type: "PhotoElement",
	                    x: "0",
	                    y: "0",
	                    width: width,
	                    height: height,
	                    px: "0",
	                    py: "0",
	                    pw: "1",
	                    ph: "1",
	                    rot: "0",
	                    dep: "0",
	                    imageid: "",
	                    imgRot: "0",
	                    imgFlip: false,
	                    cropLUX: "0",
	                    cropLUY: "0",
	                    cropRLX: "1",
	                    cropRLY: "1"
	                }
	            ];
	        } else {
	            elements = __webpack_require__(22).getElements();
	        }
	        
	        return {
	            "id": __webpack_require__(20).guid(),
	            "width": width,
	            "height": height,
	            "bgColor": "#FFFFFF",
	            "type": "Page",
	            "bleed": {
	                "top": bleedTop,
	                "bottom": bleedBottom,
	                "left": bleedLeft,
	                "right": bleedRight
	            },
	            "elements": elements,
	            "backend": {
	                "isPrint": true,
	                "slice": false
	            },
	            "quantity": 1,
	            "spec": specObject
	        }

	        
	        
	    }

	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {module.exports={

	    xmlToString:function(doc){
	    	
	           
	        return  new XMLSerializer().serializeToString(doc);
	       
	    },
	    stringToXml:function(s){
	        /*if("ActiveXObject" in window){
	            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	            xmlDoc.async = false;
	            xmlDoc.loadXML(s);
	        }else{
	            parser = new DOMParser();
	            xmlDoc = parser.parseFromString( s,"text/xml") ;
	        }*/

	        var xml = $.parseXML(s); 
	        return xml;
	    }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
		getIsShowProjectInfoView:function(){
			var bool=false;
			if(Store.checkFailed){
				return false;
			}
			if(Store.projectInfo.isInCart||Store.projectInfo.isOrdered||Store.projectInfo.isInMarket){
				bool = true;
			}
			if(Store.fromCart&&Store.projectInfo.isInCart&&!Store.projectInfo.isOrdered){
				bool = false;
			}
			return bool;
		},
		getProjectInfoViewText:function(){
			if(!Store.projectInfo.isInMarket){
				return 'Your current project was already ordered or added to cart. You need to save your additional changes into a new project.';
			}else{
				return 'This item was already posted to sale. You need to save your additional changes into a new project.';
			}
		},
		getProjectOrderText: function(){
			if(!Store.projectInfo.isOrdered){
				return 'Please select at least one image before placing your order.';
			}
		},
		checkInvalid:function(value){
	    	return(/^[a-zA-Z 0-9\d_\s\-]+$/.test(value));
	        //return(/^[A-Za-z0-9_@ \-`~!#$$%^&*\(\)+=\]\[\{\}|\\;':",.\>\<?)\/]+$/.test(value));
		},
		guid:function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	  },
	  getQueryString: function (parameters) {
	    var qs = '';
	    for(var key in parameters) {
	      var value = parameters[key];
	      qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
	    }
	    if (qs.length > 0){
	      qs = qs.substring(0, qs.length-1); //chop off last "&"
	    }
	    return qs;
	  },
	  getEncImgId: function (imageId) {
	    return Store.imageList.filter(function (image) {
	      return image.id === imageId;
	    })[0].encImgId;
	  },
	  isIncludeDisableOption:function(){

	  	var SpecManage = __webpack_require__(17);
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	    var product = currentProject.product;
	    var tempOptions = SpecManage.getDisableOptionValues(product);
	    var disableOptionValues=[];
	    tempOptions.forEach(function(value,index,array){
	      disableOptionValues=disableOptionValues.concat(value.split(','));
	　　});
	    for(var value in tempOptions){
	      console.log(value);
	    }
	    var bool=false;
	    for(var key in currentProject){
	      if(disableOptionValues.indexOf(currentProject[key])!=-1){
	        return true;
	      }
	    }
	    return false;
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = {
	  formatDate: function(date) {
	    var d = new Date(date);
	    var year = d.getFullYear();
	    var month = String(d.getMonth() + 1);
	    var day = String(d.getDate());

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	  },

	  formatTime: function(date) {
	    var d = new Date(date);
	    var hours = String(d.getHours());
	    var minutes = String(d.getMinutes());
	    var seconds = String(d.getSeconds());

	    if (hours.length < 2) hours = '0' + hours;
	    if (minutes.length < 2) minutes = '0' + minutes;
	    if (seconds.length < 2) seconds = '0' + seconds;

	    return [hours, minutes, seconds].join(':');
	  },

	  formatDateTime: function(date) {
	    if (!date) return '';
	    return this.formatDate(date) + " " + this.formatTime(date);
	  }
	}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var UtilDateFormat = __webpack_require__(21);

	module.exports = {
	  initProjectJson: function() {
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	    var specObject = {};
	    for (var i = 0; i < optionIds.length; i++) {
	      specObject[optionIds[i]] = currentProject[optionIds[i]];
	    };
	    var defaultPages = [this.initPage()];
	    return {
	      project: {
	        guid: '',
	        version: specVersion,
	        clientId: 'web-h5',
	        createAuthor: 'web-h5|1.1|1',
	        userId: Store.userSettings.userId,
	        artisan: Store.userSettings.userName,
	        createdDate: UtilDateFormat.formatDateTime(new Date()),
	        updatedDate: UtilDateFormat.formatDateTime(new Date()),
	        summary: {
	        },
	        spec: specObject,
	        pages: defaultPages,
	        images: []
	      }
	    };
	  },

	  initNewPrintProjectJson: function() {
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	    var defaultSetting = {};
	    var defaultPages = [];
	    for (var i = 0; i < optionIds.length; i++) {
	      defaultSetting[optionIds[i]] = currentProject[optionIds[i]];
	    };
	    return {
	      project: {
	        version: specVersion,
	        clientId: 'web-h5',
	        createAuthor: 'web-h5|1.1|1',
	        userId: Store.userSettings.userId,
	        artisan: Store.userSettings.userName,
	        createdDate: UtilDateFormat.formatDateTime(new Date()),
	        updatedDate: UtilDateFormat.formatDateTime(new Date()),
	        summary: {
	          defaultSetting: defaultSetting
	        },
	        pages: defaultPages,
	        images: []
	      }
	    };
	  },

	  getCurrentProjectJson: function() {
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	    var specObject = {};
	    for (var i = 0; i < optionIds.length; i++) {
	      specObject[optionIds[i]] = currentProject[optionIds[i]];
	    };
	    var pages = this.getPages();
	    var images = this.getImages();
	    return {
	      project: {
	        guid: Store.projectId,
	        version: specVersion,
	        clientId: 'web-h5',
	        createAuthor: 'web-h5|1.1|1',
	        userId: Store.userSettings.userId,
	        artisan: Store.userSettings.userName,
	        createdDate: Store.createdDate,
	        updatedDate: UtilDateFormat.formatDateTime(new Date()),
	        summary: {
	        },
	        spec: specObject,
	        pages: pages,
	        images: images
	      }
	    };
	  },
	  getSkuJson: function() {
	    var userSettings = Store.userSettings;
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

	    var skuJson = {
	      project: {
	        "version": specVersion,
	        "clientId": "web-h5",
	        "createAuthor": "web-h5|1.1|1",
	        "userId": userSettings.userId,
	        "artisan": userSettings.userName,
	      }
	    };
	    for (var i = 0; i < optionIds.length; i++) {
	      skuJson['project'][optionIds[i]] = currentProject[optionIds[i]];
	    };
	    return skuJson;
	  },
	  getBaseSize: function(pageIdx) {
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var paramArray = [];
	    optionIds.forEach(function(optionId) {
	      paramArray.push({key: optionId, value: currentProject[optionId]});
	    });
	    var sizeObject = __webpack_require__(17).getParameter('baseSizeInInch', paramArray);

	    return {
	      width: sizeObject.width * __webpack_require__(17).getDPI(),
	      height: sizeObject.height * __webpack_require__(17).getDPI()
	    };
	  },
	  getBleedSize: function(pageIdx) {
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var DPI = __webpack_require__(17).getDPI();
	    var size = currentProject.size;
	    var product = currentProject.product;
	    var bleedObject = __webpack_require__(17).getParameter('bleedInInch', [{ key: 'product', value: product }, { key: 'size', value: size }]);

	    return {
	      top: bleedObject.top * DPI,
	      right: bleedObject.right * DPI,
	      bottom: bleedObject.bottom * DPI,
	      left: bleedObject.left * DPI
	    }
	  },
	  getLMCBaseSize: function(pageIdx) {
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var size = currentProject.size;
	    var product = currentProject.product;
	    var frameStyle = currentProject.frameStyle;
	    var orientation = currentProject.orientation;
	    var sizeObject = __webpack_require__(17).getParameter('frameBaseSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle },{ key: 'size', value: size },{ key: 'orientation', value: orientation }]);

	    return {
	      width: parseFloat(sizeObject.widthInInch) * __webpack_require__(17).getDPI(),
	      height: parseFloat(sizeObject.heightInInch) * __webpack_require__(17).getDPI()
	    };
	  },
	  getLMCBleedSize: function(pageIdx) {
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var size = currentProject.size;
	    var product = currentProject.product;
	    var bleedObject = __webpack_require__(17).getParameter('bleed', [{ key: 'product', value: product }, { key: 'size', value: size }]);

	    return {
	      top: parseFloat(bleedObject.top),
	      right: parseFloat(bleedObject.right),
	      bottom: parseFloat(bleedObject.bottom),
	      left: parseFloat(bleedObject.left)
	    }
	  },
	  getLMCCanvasBorder:function(pageIdx){
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var size = currentProject.size;
	    var product = currentProject.product;
	    var size = currentProject.size;
	    var canvasBorderSize = currentProject.canvasBorderSize;
	    var canvasBorderObject = __webpack_require__(17).getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'size', value: size } , { key: 'canvasBorderSize', value: canvasBorderSize } ]);

	    return {
	      top: parseFloat(canvasBorderObject.top),
	      right: parseFloat(canvasBorderObject.right),
	      bottom: parseFloat(canvasBorderObject.bottom),
	      left: parseFloat(canvasBorderObject.left)
	    }
	  },
	  getCanvasBorder: function() {
	    // var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    // var currentProject = Store.projectSettings[useIndex];
	    // var size = currentProject.size;
	    // var product = currentProject.product;
	    // var frameStyle = currentProject.frameStyle;
	    // var canvasBorderSize = currentProject.canvasBorderSize;
	    // var canvasBorderObject = require('SpecManage').getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle } , { key: 'canvasBorderSize', value: canvasBorderSize } ]);

	    return {
	      top: 0,
	      right: 0,
	      bottom: 0,
	      left: 0
	    }
	  },
	  getLMCPhotoLayer: function(pageIdx) {
	      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	      var currentProject = Store.projectSettings[useIndex];
	      var orientation = currentProject.orientation;
	      var object = {};

	      var frameBaseSize = this.getLMCBaseSize(useIndex);

	      var canvasBorderThickness = this.getLMCCanvasBorder(useIndex);
	      var canvasBorderThicknessTop = canvasBorderThickness.top;
	      var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
	      var canvasBorderThicknessLeft = canvasBorderThickness.left;
	      var canvasBorderThicknessRight = canvasBorderThickness.right;



	      var bleed = this.getLMCBleedSize(useIndex);
	      var bleedTop = bleed.top;
	      var bleedBottom = bleed.bottom;
	      var bleedLeft = bleed.left;
	      var bleedRight = bleed.right;

	      var baseWidth = frameBaseSize.width+canvasBorderThicknessLeft+canvasBorderThicknessRight;
	      var baseHeight = frameBaseSize.height+canvasBorderThicknessTop+canvasBorderThicknessBottom;

	      var x = 0;
	      var y = 0;
	      var width = 0;
	      var height = 0;
	      if (currentProject.orientation === 'Portrait') {
	          x = -bleedBottom;
	          y = -bleedLeft;
	          width = baseWidth + bleedTop + bleedBottom ;
	          height = baseHeight + bleedLeft + bleedRight ;
	      } else {
	          x = -bleedLeft;
	          y = -bleedTop;
	          width = baseWidth + bleedLeft + bleedRight;
	          height = baseHeight + bleedTop + bleedBottom;
	      }
	      var px = x / width;
	      var py = y / height;
	      var pw = width / width;
	      var ph = height / height;

	      object.x = x;
	      object.y = y;
	      object.width = width;
	      object.height = height;
	      object.px = px;
	      object.py = py;
	      object.pw = pw;
	      object.ph = ph;

	      return object;
	  },
	  getLMCDefaultElement: function(pageIdx) {
	      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	      var photoLayer=this.getLMCPhotoLayer(useIndex);
	      var canvasBorder=this.getLMCCanvasBorder(useIndex);
	      var bleed=this.getLMCBleedSize(useIndex);
	      var x=bleed.left+canvasBorder.left;
	      var y=bleed.top+canvasBorder.top;
	      var width=photoLayer.width-canvasBorder.left-canvasBorder.right-bleed.left-bleed.right;
	      var height=photoLayer.height-canvasBorder.top-canvasBorder.bottom-bleed.top-bleed.bottom;
	      return {
	          "id": __webpack_require__(20).guid(),
	          "type": "PhotoElement",
	          "elType": "image",
	          "x": x,
	          "y": y,
	          "width": width,
	          "height": height,
	          "px": x/photoLayer.width,
	          "py": y/photoLayer.height,
	          "pw": width/photoLayer.width,
	          "ph": height/photoLayer.height,
	          "imgFlip": false,
	          "rot": 0,
	          "imgRot": 0,
	          "encImgId": "",
	          "imageid": "",
	          "dep": 0,
	          "cropLUX": 0,
	          "cropLUY": 0,
	          "cropRLX": 1,
	          "cropRLY": 1,
	          "lastModified": UtilDateFormat.formatDateTime(new Date())
	      }

	  },
	  getDefaultElement: function(pageWith, pageHeight) {

	      return {
	          "id": __webpack_require__(20).guid(),
	          "type": "PhotoElement",
	          "elType": "image",
	          "x": 0,
	          "y": 0,
	          "width": pageWith,
	          "height": pageHeight,
	          "px": 0,
	          "py": 0,
	          "pw": 1,
	          "ph": 1,
	          "imgFlip": false,
	          "rot": 0,
	          "imgRot": 0,
	          "encImgId": "",
	          "imageid": "",
	          "dep": 0,
	          "cropLUX": 0,
	          "cropLUY": 0,
	          "cropRLX": 1,
	          "cropRLY": 1,
	          "lastModified": UtilDateFormat.formatDateTime(new Date())
	      }
	  },
	  initPage: function() {
	    var baseSize = this.getBaseSize();
	    var bleedSize = this.getBleedSize();
	    var pageWith = baseSize.width + bleedSize.left + bleedSize.right;
	    var pageHeight = baseSize.height + bleedSize.top + bleedSize.right;
	    var defaultElements = [this.getDefaultElement(pageWith, pageHeight)];
	    return {
	      "id": __webpack_require__(20).guid(),
	      "width": pageWith,
	      "height": pageHeight,
	      "type": "Page",
	      "bleed": bleedSize,
	      "elements": defaultElements,
	      "backend": {
	          "isPrint": true
	      }
	    }
	  },
	  getPhotoLayer: function(pageIdx) {
	    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
	    var currentProject = Store.projectSettings[useIndex];
	    var orientation = currentProject.orientation;

	    var baseSize = this.getBaseSize(useIndex);
	    var bleedSize = this.getBleedSize();
	    var pageWith = baseSize.width + bleedSize.left + bleedSize.right;
	    var pageHeight = baseSize.height + bleedSize.top + bleedSize.right;

	    var x = 0;
	    var y = 0;
	    var width = 0;
	    var height = 0;
	    if (currentProject.orientation === 'Portrait') {
	        x = -bleedSize.bottom;
	        y = -bleedSize.left;
	        width = baseSize.width + bleedSize.left + bleedSize.right;
	        height = baseSize.height + bleedSize.top + bleedSize.right;
	    } else {
	        x = -bleedSize.left;
	        y = -bleedSize.top;
	        width = baseSize.width + bleedSize.left + bleedSize.right;
	        height = baseSize.height + bleedSize.top + bleedSize.right;
	    }

	    return {
	      x: x,
	      y: y,
	      width: width,
	      height: height,
	      px: x / baseSize.width,
	      py: y / baseSize.height,
	      pw: width / baseSize.width,
	      ph: height / baseSize.height
	    }
	  },
	  getPages: function() {
	    var pages = [];
	    var bleedSize = this.getBleedSize();
	    var photoLayer = this.getPhotoLayer();
	    var pageWith = photoLayer.width;
	    var pageHeight = photoLayer.height;
	    var elements = this.getElements();

	    for(var i = 0; i < Store.pages.length; i++ ) {
	        pages.push({
	          "width": pageWith,
	          "height": pageHeight,
	          "type": "Page",
	          "bleed": bleedSize,
	          "elements": this.getElements(i),
	          "backend": {
	            "isPrint": true
	          }
	        })
	    }
	    return pages;
	  },
	  getImages: function() {
	    var images = [];
	    for(var i = 0; i < Store.imageList.length; i++) {
	      var item = Store.imageList[i];
	      images.push({
	        id: item.id,
	        guid: item.guid,
	        encImgId: item.encImgId,
	        order: i,
	        name: encodeURIComponent(item.name),
	        width: item.width,
	        height: item.height,
	        shotTime: item.shotTime,
	        orientation: item.orientation
	      });
	    }
	    return images;
	  },
	  getElements: function(index) {
	    var useIndex = (typeof index !== 'undefined') ? index : Store.currentSelectProjectIndex;
	    // if(!index){
	    //   index=Store.currentSelectProjectIndex;
	    // }
	    var currentProject = Store.projectSettings[useIndex];
	    var currentCanvas = Store.pages[useIndex].canvas;
	    var elements = currentCanvas.params;
	    var outputElements = [];

	    for (var i = 0; i < elements.length; i++) {
	      var currentElement = elements[i];
	      var elementObj = {
	        x: currentElement.x,
	        y: currentElement.y,
	        px: currentElement.x / currentCanvas.oriWidth,
	        py: currentElement.y / currentCanvas.oriHeight,
	        width: currentElement.width,
	        height: currentElement.height,
	        pw: currentElement.width / currentCanvas.oriWidth,
	        ph: currentElement.height / currentCanvas.oriHeight,
	        dep: currentElement.dep,
	        rot: currentElement.rotate
	      };
	      switch(currentElement.elType) {
	        case 'text':
	          {
	            elementObj.type = "TextElement";
	            elementObj.color = currentElement.fontColor;
	            elementObj.text = encodeURIComponent(currentElement.text);
	            elementObj.fontWeight = currentElement.fontWeight;
	            elementObj.textAlign = currentElement.textAlign;
	            elementObj.fontFamily = encodeURIComponent(currentElement.fontFamily);
	            elementObj.fontSize = parseFloat(currentElement.fontSize)  / currentCanvas.oriHeight;
	          }
	          break;
	        case 'image':
	          {
	            var encImgId = currentElement.encImgId;
	            if (!encImgId) {
	              Store.imageList.some(function(img){
	                if(img.id == currentElement.imageId) {
	                  encImgId = img.encImgId;
	                  return true;
	                }
	              })
	            }
	            elementObj.type = "PhotoElement";
	            elementObj.imageid = currentElement.imageId;
	            elementObj.encImgId = encImgId;
	            elementObj.imgRot = currentElement.imageRotate;
	            elementObj.imgFlip = false;
	            elementObj.cropLUX = parseFloat(currentElement.cropPX).toString();
	            elementObj.cropLUY = parseFloat(currentElement.cropPY).toString();
	            elementObj.cropRLX = (parseFloat(currentElement.cropPX) + parseFloat(currentElement.cropPW)).toString();
	            elementObj.cropRLY = (parseFloat(currentElement.cropPY) + parseFloat(currentElement.cropPH)).toString();
	            elementObj.style = {
	              brightness: currentElement.style && currentElement.style.brightness ? currentElement.style.brightness : 0,
	              "effectId": 0,
	              "opacity": 100
	            }
	            elementObj.border = {
	              size: 0,
	              "color": "#000000",
	              "opacity": 100
	            }
	          }
	          break;
	      }
	      outputElements.push(elementObj);
	    }
	    return outputElements;
	  },

	  getPrintBaseSize:function(params){
	    var rotated = false;
	    var paramsList = __webpack_require__(18).getParamsList();
	    if(params.size){
	        paramsList = paramsList.map(function(param) {
	            if(param.key === 'size') {
	                param.value = params.size;
	            }

	            return param;
	        });
	    }
	    if(params.rotated){
	        rotated = params.rotated;
	    }
	    var sizeObject = __webpack_require__(17).getParameter('baseSizeInInch', paramsList);
	    var object = {};
	    if (rotated) {
	        object.width = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	        object.height = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	    } else {
	        object.width = sizeObject.widthInInch * __webpack_require__(17).getDPI();
	        object.height = sizeObject.heightInInch * __webpack_require__(17).getDPI();
	    }
	    return object;
	  },

	  getPrintBleed: function(params) {
	    var rotated = false;
	    var DPI = __webpack_require__(17).getDPI();
	    var paramsList = __webpack_require__(18).getParamsList();

	    paramsList = paramsList.map(function(param) {
	        if(param.key === 'size') {
	            if(params && params.size){
	                param.value = params.size;
	            } else {
	                param.value = Store.baseProject.size;
	            }
	        }

	        return param;
	    });

	    if(params.rotated){
	        rotated = params.rotated;
	    }

	    var sizeObject = __webpack_require__(17).getParameter('bleedInInch', paramsList);
	    var object = {};
	    object.top = parseInt(sizeObject.top * DPI);
	    object.bottom = parseInt(sizeObject.bottom * DPI);
	    object.left = parseInt(sizeObject.left * DPI);
	    object.right = parseInt(sizeObject.right * DPI);

	    if(rotated) {
	      object.top = parseInt(sizeObject.left * DPI);
	      object.bottom = parseInt(sizeObject.right * DPI);
	      object.left = parseInt(sizeObject.top * DPI);
	      object.right = parseInt(sizeObject.bottom * DPI);
	    }
	    return object;
	  },

	  getPrintCornerRadius: function(params) {
	    var DPI = __webpack_require__(17).getDPI();
	    var paramsList = __webpack_require__(18).getParamsList();

	    paramsList = paramsList.map(function(param) {
	        if(param.key === 'size') {
	            if(params && params.size){
	                param.value = params.size;
	            } else {
	                param.value = Store.baseProject.size;
	            }
	        }

	        return param;
	    });

	    var cornerRadius = __webpack_require__(17).getParameter('cornerRadiusInInch', paramsList).value;
	    cornerRadius = (cornerRadius - 0) * DPI;

	    return cornerRadius;
	  },

	  getNewPrintCurrentProjectJson: function() {
	    var optionIds = __webpack_require__(17).getOptionIds();
	    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
	    var defaultSetting = {};
	    for (var i = 0; i < optionIds.length; i++) {
	      defaultSetting[optionIds[i]] = Store.baseProject[optionIds[i]];
	    };
	    var pages = this.getNewPrintPages();
	    var images = this.getImages();
	    return {
	      project: {
	        guid: Store.projectId,
	        version: specVersion,
	        clientId: 'web-h5',
	        createAuthor: 'web-h5|1.1|1',
	        userId: Store.userSettings.userId,
	        artisan: Store.userSettings.userName,
	        createdDate: Store.createdDate,
	        updatedDate: UtilDateFormat.formatDateTime(new Date()),
	        summary: {
	          defaultSetting: defaultSetting
	        },
	        pages: pages,
	        images: images
	      }
	    };
	  },

	  getNewPrintPages: function() {
	    var pages = [];
	    var currentProjects = Store.projectSettings;
	    var currentPages = Store.pages;
	    var optionIds = __webpack_require__(17).getOptionIds();

	    for (var i = 0 ;i < currentPages.length; i++) {
	      var currentCanvas = currentPages[i].canvas;
	      var elements = this.getNewPrinteElements(currentCanvas, currentCanvas.params);
	      var currentProject = currentProjects[i];

	      var pageId = currentPages[i].guid || __webpack_require__(20).guid();
	      var quantity = currentProject.quantity;
	      var specVersion = __webpack_require__(17).getVersion();
	      var specObject = {};
	      var type = 'Print';
	      for (var j = 0; j < optionIds.length; j++) {
	        specObject[optionIds[j]] = currentProject[optionIds[j]];
	      };
	      specObject.quantity = quantity;

	      var baseSize=this.getPrintBaseSize({size: currentProject.size, rotated: currentProject.rotated});
	      var bleed = this.getPrintBleed({size: currentProject.size, rotated: currentProject.rotated});
	      var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
	      var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';

	      pages.push({
	        id: pageId,
	        spec: specObject,
	        width: baseSize.width + bleed.left + bleed.right,
	        height: baseSize.height + bleed.top + bleed.bottom,
	        type: type,
	        bleed: bleed,
	        border: {
	          color: borderColor,
	          size: borderLength
	        },
	        elements: elements,
	        backend: {
	          isPrint: true
	        }
	      });
	    }

	    return pages;
	  },

	  getNewPrinteElements: function(currentCanvas, params) {
	    var elements = params.map(function(param) {

	      var id = param.guid || __webpack_require__(20).guid();
	      var x = param.x;
	      var y = param.y;
	      var width = param.width;
	      var height = param.height;
	      var px = x / currentCanvas.oriWidth;
	      var py = y / currentCanvas.oriHeight;
	      var ph = height / currentCanvas.oriHeight;
	      var pw = width / currentCanvas.oriWidth;
	      var rot = param.rotate;
	      var dep = param.dep;
	      var imageid = param.imageId;
	      var imgRot = param.imageRotate;
	      var imgFlip = false;
	      var cropPX = param.cropPX,
	          cropPY = param.cropPY,
	          cropPW = param.cropPW,
	          cropPH = param.cropPH;
	      var brightness = param.style && param.style.brightness ? param.style.brightness : 0;

	      var theImage = Store.imageList.filter(function(image) {
	        return image.id === param.imageId;
	      });

	      var element = {
	        id: id,
	        x: x,
	        y: y,
	        width: width,
	        height: height,
	        px: px,
	        py: py,
	        pw: pw,
	        ph: ph,
	        rot: rot,
	        dep: dep
	      }
	      if(param.elType==='text'){
	        element.type = 'TextElement';
	        element.color = param.fontColor;
	        element.fontSize = parseFloat(param.fontSize) / currentCanvas.oriHeight;
	        element.fontFamily = encodeURIComponent(param.fontFamily);
	        element.fontWeight = param.fontWeight;
	        element.textAlign = param.textAlign;
	        element.text = encodeURIComponent(param.text);
	      }else if(param.elType==='logo'){
	        element.type = 'LogoElement';

	      }else if(param.elType==='image'){
	        element.type = 'PhotoElement';
	        element.imageid = imageid;
	        element.imgFlip = imgFlip;
	        element.imgRot = imgRot;
	        element.encImgId = theImage.length ? theImage[0].encImgId : '';
	        element.cropLUX = cropPX;
	        element.cropLUY = cropPY;
	        element.cropRLX = (cropPX + cropPW);
	        element.cropRLY = (cropPY + cropPH);
	        element.style = {
	          brightness: brightness,
	          effectId: 0,
	          opacity: 100
	        };
	        element.border = {
	          "size": 0,
	          "color": "#000000",
	          "opacity": 100
	        }
	      }

	      return element;
	    });

	    return elements;
	  },
	  getNewPrintSkuJson: function(projectJson) {
	    var projects = projectJson.project.pages;
	    var specVersion = projectJson.project.version;
	    var clientId = projectJson.project.clientId;
	    var createAuthor = projectJson.project.createAuthor;
	    var userId = projectJson.project.userId;
	    var artisan = projectJson.project.artisan;
	    var skuJson = {};

	    var defaultSetting = projectJson.project.summary.defaultSetting;
	    var isLittlePrintBox = defaultSetting ? defaultSetting.product === 'LPP' : false;
	    var isLSCProduct = defaultSetting ? defaultSetting.product === 'LSC' : false;

	    var optionIds = __webpack_require__(17).getOptionIds();

	    if(projects.length === 0) {
	      defaultSetting.id = 'defaultSetting';
	      defaultSetting.version = specVersion;
	      defaultSetting.clientId = clientId;
	      defaultSetting.createAuthor = createAuthor;
	      defaultSetting.userId = userId;
	      defaultSetting.artisan = artisan;
	      defaultSetting.quantity = 1;

	      skuJson = {
	        defaultSetting: defaultSetting
	      };
	    }

	    projects.forEach(function(project) {
	      if((isLittlePrintBox || isLSCProduct) && Object.keys(skuJson).length > 0) return;

	      skuJson[project.id] = {
	        id: project.id,
	        version: specVersion,
	        clientId: clientId,
	        createAuthor: createAuthor,
	        userId: userId,
	        artisan: artisan,
	        quantity: project.spec ? project.spec.quantity : 1
	      };

	      for (var i = 0; i < optionIds.length; i++) {
	        skuJson[project.id][optionIds[i]] = project.spec[optionIds[i]];
	      };
	    });

	    return skuJson;
	  },

	  getNewPrintRemarkPages: function() {
	    var currentProjects = Store.projectSettings;
	    var currentPages = Store.pages;
	    var remarkPages = [];
	    var pages = [];
	    var optionIds = __webpack_require__(17).getOptionIds();

	    for(var i=0;i<currentProjects.length;i++){
	      if(Store.selectedSize){
	        if(Store.selectedPaper){
	          if(currentProjects[i].size===Store.selectedSize && currentProjects[i].paper===Store.selectedPaper){
	            remarkPages.push(currentPages[i]);
	            remarkPages[remarkPages.length-1].oid = i;
	          }
	        }else{
	          if(currentProjects[i].size===Store.selectedSize){
	            remarkPages.push(currentPages[i]);
	            remarkPages[remarkPages.length-1].oid = i;
	          }
	        }
	      }else{
	        if(Store.selectedPaper){
	          if(currentProjects[i].paper===Store.selectedPaper){
	            remarkPages.push(currentPages[i]);
	            remarkPages[remarkPages.length-1].oid = i;
	          }
	        }
	      }
	    }
	    if(remarkPages.length===0){
	      remarkPages = currentPages;
	      for(var i=0;i<remarkPages.length;i++){
	        remarkPages[i].oid = i;
	      }
	    }

	    for (var i = 0 ;i <remarkPages.length; i++) {
	      var currentCanvas=remarkPages[i].canvas;
	      var elements = this.getNewPrinteElements(currentCanvas, currentCanvas.params);
	      var currentProject=currentProjects[remarkPages[i].oid];

	      var pageId = remarkPages[i].guid || __webpack_require__(20).guid();
	      var quantity = currentProject.quantity;
	      var specVersion = __webpack_require__(17).getVersion();
	      var specObject = {};
	      var type = 'Print';
	      for (var j = 0; j < optionIds.length; j++) {
	        specObject[optionIds[j]] = currentProject[optionIds[j]];
	      };

	      specObject.quantity = quantity;

	      var baseSize=this.getPrintBaseSize({size: currentProject.size, rotated: currentProject.rotated});
	      var bleed = this.getPrintBleed({size: currentProject.size});
	      var borderLength = remarkPages[i].canvas.borderLength ? remarkPages[i].canvas.borderLength : 0;
	      var borderColor = remarkPages[i].canvas.borderColor ? remarkPages[i].canvas.borderColor : 'none';

	      if(quantity) {
	        pages.push({
	          id: pageId,
	          spec: specObject,
	          width: baseSize.width,
	          height: baseSize.height,
	          type: type,
	          quantity: quantity,
	          bleed: bleed,
	          border: {
	            color: borderColor,
	            size: borderLength
	          },
	          elements: elements,
	          backend: {
	            isPrint: true
	          }
	        });
	      }
	    };

	    return pages;
	  },

	  getNewPrintRemarkProject : function(){
	        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	        var projectJson = this.getNewPrintCurrentProjectJson();
	        var pages = this.getNewPrintRemarkPages();
	        var images = this.getImages();

	        projectJson.project.pages = pages;
	        projectJson.project.images = images;

	        return projectJson;
	  },

	  getWallartsSkuJson: function(projectJson) {
	    var projects = projectJson.project.pages;
	    var specVersion = projectJson.project.version;
	    var clientId = projectJson.project.clientId;
	    var createAuthor = projectJson.project.createAuthor;
	    var userId = projectJson.project.userId;
	    var artisan = projectJson.project.artisan;
	    var skuJson = {};

	    var defaultSetting = projectJson.project.summary.defaultSetting;
	    var isLittlePrintBox = defaultSetting ? defaultSetting.product === 'LPP' : false;
	    var isLSCProduct = defaultSetting ? defaultSetting.product === 'LSC' : false;

	    var optionIds = __webpack_require__(17).getOptionIds();

	    defaultSetting.id = projects[0].id;
	    defaultSetting.version = specVersion;
	    defaultSetting.clientId = clientId;
	    defaultSetting.createAuthor = createAuthor;
	    defaultSetting.userId = userId;
	    defaultSetting.artisan = artisan;
	    defaultSetting.quantity = 1;

	    skuJson[projects[0].id] = defaultSetting
	    return skuJson;
	  },
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    initProjectXml: function() {
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        console.log(specData);
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var xml = '<project clientId="web-h5" createAuthor="web-h5|1.0|1">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan/>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate/>' +
	            '<updatedDate></updatedDate>' +
	            '<tshirts>' +
	            '<tshirt id="tshirt-1">' +
	            '<spec version="1.0">' +
	            '<option id="product" value="' + Store.projectSettings[Store.currentSelectProjectIndex].product + '" />' +
	            '<option id="color" value="' + Store.projectSettings[Store.currentSelectProjectIndex].color + '" />' +
	            '<option id="size" value="' + Store.projectSettings[Store.currentSelectProjectIndex].size + '" />' +
	            '<option id="measure" value="' + Store.projectSettings[Store.currentSelectProjectIndex].measure + '" />' +
	            '</spec>' +
	            '<tshirtSetting>' +
	            '<setting id="count" value="1" />' +
	            '<setting id="pages" value="true,false"/>'+
	            '</tshirtSetting>' +
	            '<contents>' +
	            '<content type="front" width="' + base.width + '" hight="' + base.height + '">' +
	            '<elements>' +
	           /* '<element type="PhotoElement" elType="image" x="0" y="0" width="' + base.width + '" height="' + base.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
	            /*'<element type="LogoElement"  elType="logo" x="' + logo.x + '" y="' + logo.y + '" width="' + logo.width + '" height="' + logo.height + '" px="' + logo.x / base.width + '" py="' + logo.y / base.height + '" pw="' + logo.width / base.width + '" ph="' + logo.height / base.height + '" rot="0" dep="1" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
	            '</elements>' +
	            '</content>' +
	            '<content type="back" width="' + base.width + '" hight="' + base.height + '">' +
	            '<elements>' +
	            /*'<element type="PhotoElement" elType="image" x="0" y="0" width="' + base.width + '" height="' + base.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
	            '</elements>' +
	            '</content>' +
	            '</contents>' +
	            '</tshirt>' +
	            '</tshirts>' +
	            '<images/>' +
	            '</project>';
	        return xml;
	    },
	    getCurrentProjectXml: function() {
	        __webpack_require__(25).syncProjectData();
	        console.log(Store.currentSelectProjectIndex);
	        console.log(Store.projectSettings[Store.currentSelectProjectIndex].product);
	        console.log(Store.projectSettings[Store.currentSelectProjectIndex].size);
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        console.log(specData);
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var xml = '<project clientId="web-h5" createAuthor="web-h5|1.0|1">' +
	            '<guid>' + Store.projectId + '</guid>' +
	            '<userId>' + Store.userSettings.userId + '</userId>' +
	            '<artisan/>' +
	            '<title><![CDATA[' + Store.title + ']]></title>' +
	            '<description/>' +
	            '<createdDate/>' +
	            '<updatedDate></updatedDate>' +
	            '<tshirts>';

	        var projects = Store.projectSettings;
	        for (var i = 0; i < projects.length; i++) {
	            var projectItem = projects[i];
	            xml += '<tshirt id="tshirt-' + i + '">' +
	                '<spec version="1.0">' +
	                '<option id="product" value="' + projectItem.product + '" />' +
	                '<option id="color" value="' + projectItem.color + '" />' +
	                '<option id="size" value="' + projectItem.size + '" />' +
	                '<option id="measure" value="' + projectItem.measure + '" />' +
	                '</spec>' +
	                '<tshirtSetting>' +
	                '<setting id="count" value="' + projectItem.count + '" />';
	            var hasFront=false;
	            var frontPage=Store.projects[i].pages[0];
	            for (var u = 0; u < frontPage.canvas.params.length; u++) {
	                //if (backPage.canvas.elements[u] != undefined) {
	                    var ele = frontPage.canvas.params[u];
	                    if (ele.elType === 'logo' || ele.elType === 'image') {
	                        if(ele.imageId!=""){
	                            hasFront=true;
	                        }
	                    }else if(ele.elType === 'text'){
	                        hasFront=true;
	                    }
	                //}
	            }
	            var hasBack=false;
	            var backPage=Store.projects[i].pages[1];
	            for (var u = 0; u < backPage.canvas.params.length; u++) {
	                //if (backPage.canvas.elements[u] != undefined) {
	                    var ele = backPage.canvas.params[u];
	                    if (ele.elType === 'logo' || ele.elType === 'image') {
	                        if(ele.imageId!=""){
	                            hasBack=true;
	                        }
	                    }else if(ele.elType === 'text'){
	                        hasBack=true;
	                    }
	                //}
	            }
	            xml += '<setting id="pages" value="' + hasFront + ','+hasBack+'" />';
	            xml +='</tshirtSetting>' +
	                '<contents>';
	            var pages = Store.projects[i].pages;
	            for (var k = 0; k < pages.length; k++) {
	                var type = (k === 0) ? 'front' : 'back';
	                xml += '<content type="' + type + '" width="' + base.width + '" hight="' + base.height + '">';
	                var content = pages[k].canvas;
	                xml += '<elements>';
	                for (var j = 0; j < content.params.length; j++) {

	                    //if (content.elements[j] == undefined) {
	                        console.log('spread which not inited');
	                        var el = content.params[j];

	                        var W = el.width,
	                            H = el.height,
	                            OX = el.x,
	                            OY = el.y;

	                        var px = OX / content.oriWidth,
	                            py = OY / content.oriHeight,
	                            pw = W / content.oriWidth,
	                            ph = H / content.oriHeight,
	                            rot = el.rotate;

	                        if (content.params[j].elType === 'logo' || content.params[j].elType === 'image') {
	                            var cropPX = el.cropPX,
	                                cropPY = el.cropPY,
	                                cropPW = el.cropPW,
	                                cropPH = el.cropPH;

	                            cropPX < 0 ? cropPX = 0 : cropPX;
	                            cropPX > 1 ? cropPX = 1 : cropPX;
	                            cropPY < 0 ? cropPY = 0 : cropPY;
	                            cropPY > 1 ? cropPY = 1 : cropPY;
	                            cropPW < 0 ? cropPW = 0 : cropPW;
	                            cropPW > 1 ? cropPW = 1 : cropPW;
	                            cropPH < 0 ? cropPH = 0 : cropPH;
	                            cropPH > 1 ? cropPH = 1 : cropPH;
	                        };


	                    if (content.params[j].elType === 'text') {

	                        xml += '<element type="TextElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" color="' + el.fontColor + '" fontSize="' + parseFloat(el.fontSize) / content.oriHeight + '" fontFamily="' + encodeURIComponent(el.fontFamily) + '" fontWeight="' + el.fontWeight + '" textAlign="' + el.textAlign + '" >' + encodeURIComponent(el.text) + '</element>';
	                    } else if (content.params[j].elType === 'logo') {
	                        xml += '<element type="LogoElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" imageid="' + el.imageId + '" imgRot="' + (el.imageRotate || 0) + '" imgFlip="false" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"/>';

	                    } else {
	                        // image element
	                        xml += '<element type="PhotoElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" imageid="' + el.imageId + '" imgRot="' + (el.imageRotate || 0) + '" imgFlip="false" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"/>';
	                    };

	                }
	                xml += '</elements>';
	                xml += '</content>';

	            }


	            xml += '</contents>' +
	                '</tshirt>';
	        }
	        xml += '</tshirts>' +
	            '<images>';
	            for(i = 0; i < Store.imageList.length; i++) {
	                    xml += '<image id="'+ Store.imageList[i].id +'" guid="'+ Store.imageList[i].guid +'" encImgId="'+ Store.imageList[i].encImgId +'" order="'+ i +'" name="'+ encodeURIComponent(Store.imageList[i].name) +'" width="'+ Store.imageList[i].width +'" height="'+ Store.imageList[i].height +'" shotTime="'+ Store.imageList[i].shotTime +'"/>';
	                };
	        xml +='</images>'+
	            '</project>';
	        return xml;
	    },
	    saveNewProject: function(obj) {
	        var xml = this.initProjectXml();
	        Store.projectXml = xml;
	        console.log(Store.projectXml);
	        //require('CanvasController').initCanvasData();
	        //Store.watches.isProjectLoaded = true;
	        __webpack_require__(9).insertProject(obj,xml);
	    },
	    saveOldProject: function(obj,callback) {
	        var xml = this.getCurrentProjectXml();
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var thumbnailPX=base.x/background.width;
	        var thumbnailPY=base.y/background.height;
	        var thumbnailPW=base.width/background.width;
	        var thumbnailPH=base.height/background.height;
	        if(callback && typeof callback==="function"){
	            __webpack_require__(9).saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH,callback);
	        }else{
	            __webpack_require__(9).saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
	        }
	    },
	    handledSaveOldProject: function(obj,eventName) {
	        var xml = this.getCurrentProjectXml();
	        console.log(xml);
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var thumbnailPX=base.x/background.width;
	        var thumbnailPY=base.y/background.height;
	        var thumbnailPW=base.width/background.width;
	        var thumbnailPH=base.height/background.height;
	        __webpack_require__(9).handledSaveProject(obj,eventName,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
	    },
	    getOldProject: function() {
	        if(Store.isPreview){
	            __webpack_require__(9).getShareProject();
	        }else{
	            __webpack_require__(9).getProject();
	        }

	    },
	    getProjectOrderedState: function(obj) {
	        __webpack_require__(9).getProjectOrderedState(obj);
	    },
	    addOrUpdateAlbum: function(title, dispatchObj, dispatchEventName) {
	        __webpack_require__(9).addOrUpdateAlbum(title, dispatchObj, dispatchEventName);
	    },
	        changeProjectTitle: function(title, dispatchObj, dispatchEventName) {
	        __webpack_require__(9).changeProjectTitle(title, dispatchObj, dispatchEventName);
	    },
	    newProject:function(color,measure,count){
	        var PrjConstructor = __webpack_require__(14);
	        var project = PrjConstructor();
	        project.product = 'TS';
	        project.color = color;
	        project.size = '14X16';
	        project.measure = measure;
	        project.count = count;
	        return project;
	    },
	    orderProject: function(obj) {
	        var xml = this.getCurrentProjectXml();
	        console.log(xml);
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var thumbnailPX=base.x/background.width;
	        var thumbnailPY=base.y/background.height;
	        var thumbnailPW=base.width/background.width;
	        var thumbnailPH=base.height/background.height;
	        __webpack_require__(9).orderProject(obj,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
	    },

	    cloneProject: function(obj,title) {
	        var oldTitle=Store.title;
	        Store.title=title;

	        var xml = this.getCurrentProjectXml();
	        var specData = __webpack_require__(24).analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	        var base = specData.base;
	        var background = specData.background;
	        var logo = specData.logo;
	        var thumbnailPX=base.x/background.width;
	        var thumbnailPY=base.y/background.height;
	        var thumbnailPW=base.width/background.width;
	        var thumbnailPH=base.height/background.height;
	        __webpack_require__(9).cloneProject(obj,oldTitle,title,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);

	    },

	    createProject: function(obj,title) {
	        var oldTitle=Store.title;
	        Store.title=title;
	        var PrjConstructor = __webpack_require__(14);
	        var Prj = PrjConstructor();
	        var UtilParam = __webpack_require__(10);
	        Prj.product = UtilParam.getUrlParam("type");
	        Prj.color = UtilParam.getUrlParam("color");
	        Prj.size = '14X16';
	        Prj.measure = 'M';
	        Prj.count = 1;
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        var ll=currentCanvas.params.length;
	        for(var v=0;v<ll;v++){
	            Store.vm.$broadcast('notifyRemoveImage',0);
	        }
	        currentCanvas.params.length=0;
	        Store.projectSettings.length=0;
	        Store.projects.length=0;
	        Store.imageList.length=0;
	        Store.projectSettings.push(Prj);
	        var xml = this.initProjectXml();
	        Store.projectXml = xml;
	        var thumbnailPX=0;
	        var thumbnailPY=0;
	        var thumbnailPW=1;
	        var thumbnailPH=1;
	        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
	        __webpack_require__(9).createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);

	    },
	    getMyPhotoImages:function(obj,userId){
	        __webpack_require__(9).getMyPhotoImages(obj,userId);
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = {
	    analyseSpec: function(obj) {
			//console.log(obj);
	        if (obj && obj.size && obj.product /*&& obj.color && obj.measure*/) {
	        	//console.log(obj.size,obj.product);
	        	var size=obj.size;
	        	var product=obj.product;
	        	var color=obj.color;
	        	var measure=obj.measure;

	        	var baseX=0;
	        	var baseY=0;
	        	var baseWidth=0;
	        	var baseHeight=0;
	        	var backgroundWidth=0;
	        	var backgroundHeight=0;
	        	var logoX=0;
	        	var logoY=0;
	        	var logoWidth=0;
	        	var logoHeight=0;

	        	var parser = new DOMParser();
				//var specXml = parser.parseFromString(Store.spec.specXml, "text/xml"); 
				var specXml = Store.spec.specXml;
				var baseSizeEntry = $(specXml).find('parameter[id="baseSize"]').find('entry');
		        for (var i = 0; i < baseSizeEntry.length; i++) {
		            if(baseSizeEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {
		            	baseX=baseSizeEntry.eq(i).attr('x');
		            	baseY=baseSizeEntry.eq(i).attr('y');
		            	baseWidth=baseSizeEntry.eq(i).attr('widthInInch')*300;
		            	baseHeight=baseSizeEntry.eq(i).attr('heightInInch')*300;
		            	break;
		            }
		        };
		        var backgroundEntry = $(specXml).find('parameter[id="backgroundSize"]').find('entry');
		        for (var i = 0; i < backgroundEntry.length; i++) {
		            if(backgroundEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {
		            	
		            	backgroundWidth=backgroundEntry.eq(i).attr('width');
		            	backgroundHeight=backgroundEntry.eq(i).attr('height');
		            	break;
		            }
		        };
		        var logoEntry = $(specXml).find('parameter[id="logoArea"]').find('entry');
		        for (var i = 0; i < logoEntry.length; i++) {
		            if(logoEntry.eq(i).attr('key').indexOf(product+"-"+size) !== -1) {
		            	logoX=logoEntry.eq(i).attr('x');
		            	logoY=logoEntry.eq(i).attr('y');
		            	logoWidth=logoEntry.eq(i).attr('width');
		            	logoHeight=logoEntry.eq(i).attr('height');
		            	break;
		            }
		        };
		        var base={x:parseFloat(baseX),y:parseFloat(baseY),width:parseFloat(baseWidth),height:parseFloat(baseHeight)};
		        var background={width:parseFloat(backgroundWidth),height:parseFloat(backgroundHeight)};
		        var logo={x:parseFloat(logoX),y:parseFloat(logoY),width:parseFloat(logoWidth),height:parseFloat(logoHeight)};
		        console.log(base);
		        console.log(background);
		        console.log(logo);
	        	return {
	        		base: base,
	        		background: background,
	        		logo: logo
	        	};
	        }
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {
	var UtilMath = __webpack_require__(7);
	var ImageListManage = __webpack_require__(26);
	var ParamsManage = __webpack_require__(27);
	var ProjectManage = __webpack_require__(18);
	var SpecController = __webpack_require__(24);
	var WarnController = __webpack_require__(28);

	var Vue = __webpack_require__(29);
	var CompPhotoElement = Vue.component('photo-element');
	var CompTextElement = Vue.component('text-element');

	module.exports = {
		createElement: function(idx, obj) {
			// this.initElement(idx, obj);
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.params[idx].elType === 'text') {
				var el = new CompTextElement();
			}
			else {
				var el = new CompPhotoElement();
			};
			// el.$set('url','../../static/img/close-normal.svg');
			// el.$set('result',this.bindValues[i]);
			el.init(idx);
			el.$mount().$appendTo("#container");

			currentCanvas.elements.push(el);
		},

		editElement: function(idx, obj) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// remove trash canvas element
			currentCanvas.elements[idx].$destroy(true);

			if(currentCanvas.params[idx].elType === 'text') {
				var el = new CompTextElement();
			}
			else {
				var el = new CompPhotoElement();
			};
			// el.$set('url','../../static/img/close-normal.svg');
			// el.$set('result',this.bindValues[i]);
			el.init(idx);
			el.$mount().$appendTo("#container");

			currentCanvas.elements.splice(idx, 1, el);
		},

		deleteElement: function(idx, obj) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			currentCanvas.elements[idx].$destroy(true);
			currentCanvas.elements.splice(idx, 1);

		},

		// refreshEvents : function(idx){
		// 	var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		// 	// refresh handles, trans, events
		// 	for(var i = idx,l = currentCanvas.elements.length; i < l; i++) {
		// 		console.info(currentCanvas.elements[i])
		// 		currentCanvas.elements[i].undblclick();
		// 		currentCanvas.elements[i].unclick();
		// 		this.initElementHandles(i);
		// 		currentCanvas.trans[i].unplug();
		// 		this.initElementTransform(i);
		// 		$('#element-' + i).removeAttr('ondragover');
		// 		$('#element-' + i).removeAttr('ondrop');
		// 		var element = document.getElementById('element-' + i);
		// 		element.ondragover = null;
		// 		element.ondrop = null;
		// 		this.initElementDragEvent(i);
		// 	};
		// },

		// init new element
		// initElement: function(idx, obj) {
		// 	// init data and draw element
		// 	this.initElementData(idx);
		//
		// 	if(!Store.isPreview) {
		// 		// set handlers
		// 		this.initElementHandles(idx);
		//
		// 		// set transforms
		// 		this.initElementTransform(idx, obj);
		//
		// 		// add dragging evnets
		// 		this.initElementDragEvent(idx);
		//
		// 		// add warn tips
		// 		this.initWarnTip(idx);
		// 	};
		// },

		// prepare canvas element data model
		initElementData: function(idx) {
			console.log('index is ' + idx + ' in initElementData');
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
				// add image element
				var loadImageUrl = '../../static/img/blank.png';
				// var loadImageUrl = '';
	      var imageId = currentCanvas.params[idx].imageId;
				if(imageId !== '') {
					// already initialized, read old cropped image
					var px = currentCanvas.params[idx].cropPX,
							py = currentCanvas.params[idx].cropPY,
							pw = currentCanvas.params[idx].cropPW,
							ph = currentCanvas.params[idx].cropPH,
							width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
							height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

	        var UtilProject = __webpack_require__(20);
	        var encImgId = UtilProject.getEncImgId(imageId);
	        var qs = UtilProject.getQueryString({
	          encImgId: encImgId,
	          px: px,
	          py: py,
	          pw: pw,
	          ph: ph,
	          width: Math.round(width),
	          height: Math.round(height),
	          rotation: currentCanvas.params[idx].imageRotate
	        });
					loadImageUrl = '/imgservice/op/crop?' + qs;
				};

				currentCanvas.elements.$set(idx, currentCanvas.paper.image(loadImageUrl, currentCanvas.params[idx].x * currentCanvas.ratio, currentCanvas.params[idx].y * currentCanvas.ratio, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio));
			}
			else if(currentCanvas.params[idx].elType === 'text') {
				var fontViewSize = Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[idx].fontSize));
	      var fontUrl = '../../static/img/blank.png';

	      if(fontViewSize > 0) {
	      	if(currentCanvas.params[idx].text === '') {
						if(Store.isPreview) {
							fontUrl = '../../static/img/blank.png';
						}
						else {
							fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
						};
	      	}
	      	else {
	      	  fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(currentCanvas.params[idx].text)+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
	      	};
	      }
	      else {
	      	fontUrl = '../../static/img/blank.png';
	      };

	      currentCanvas.elements.$set(idx, currentCanvas.paper.image(fontUrl, currentCanvas.params[idx].x * currentCanvas.ratio, currentCanvas.params[idx].y * currentCanvas.ratio, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio));

	      currentCanvas.elements[idx].fontFamily = currentCanvas.params[idx].fontFamily;
	      currentCanvas.elements[idx].fontSize = currentCanvas.params[idx].fontSize;
	      currentCanvas.elements[idx].fontWeight = currentCanvas.params[idx].fontWeight;
	      currentCanvas.elements[idx].textAlign = currentCanvas.params[idx].textAlign;
	      currentCanvas.elements[idx].fontColor = currentCanvas.params[idx].fontColor;
	      currentCanvas.elements[idx].text = currentCanvas.params[idx].text;
	    };
			currentCanvas.elements[idx].node.id = 'element-' + idx;

			// record the dep value and index value, current visual width, height
			currentCanvas.elements[idx].elType = currentCanvas.params[idx].elType;
	    currentCanvas.elements[idx].idx = idx;
	    currentCanvas.elements[idx].dep = currentCanvas.params[idx].dep;
	    console.log('set element '+ idx +' dep into ' + currentCanvas.params[idx].dep + ' now');
	    currentCanvas.elements[idx].vWidth = currentCanvas.params[idx].width * currentCanvas.ratio;
	    currentCanvas.elements[idx].vHeight = currentCanvas.params[idx].height * currentCanvas.ratio;
	    currentCanvas.elements[idx].sourceImageUrl = currentCanvas.params[idx].url || '';
	    currentCanvas.elements[idx].imageId = currentCanvas.params[idx].imageId || '';
	    currentCanvas.elements[idx].imageRotate = currentCanvas.params[idx].imageRotate || 0;

	    // get image detail
	    var imageDetail = ImageListManage.getImageDetail(currentCanvas.elements[idx].imageId);

	    if(imageDetail) {
	    	currentCanvas.elements[idx].imageGuid = imageDetail.guid;
	    	currentCanvas.elements[idx].imageWidth = imageDetail.width;
	    	currentCanvas.elements[idx].imageHeight = imageDetail.height;

	    	if(Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
	    		// rotated specially
	    		var cWidth = currentCanvas.elements[idx].imageHeight,
	    				cHeight = currentCanvas.elements[idx].imageWidth;
	    	}
	    	else {
	    		var cWidth = currentCanvas.elements[idx].imageWidth,
	    				cHeight = currentCanvas.elements[idx].imageHeight;
	    	};
	    	// adding the crop settings to element
	    	currentCanvas.elements[idx].cropX = cWidth * currentCanvas.params[idx].cropPX;
	    	currentCanvas.elements[idx].cropY = cHeight * currentCanvas.params[idx].cropPY;
	    	currentCanvas.elements[idx].cropW = cWidth * currentCanvas.params[idx].cropPW;
	    	currentCanvas.elements[idx].cropH = cHeight * currentCanvas.params[idx].cropPH;
	    }
	    else {
	    	currentCanvas.elements[idx].imageGuid = '';
	    	currentCanvas.elements[idx].imageWidth = '';
	    	currentCanvas.elements[idx].imageHeight = '';

	    	currentCanvas.elements[idx].cropX = 0;
	    	currentCanvas.elements[idx].cropY = 0;
	    	currentCanvas.elements[idx].cropW = 1;
	    	currentCanvas.elements[idx].cropH = 1;
	    };

		},



		// init element handles
		initElementHandles: function(idx) {
			var _this = this;
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// if(idx > 0) {

				// set double click handle
	      if(currentCanvas.elements[idx].elType === 'text') {
	        currentCanvas.elements[idx]
	        	.dblclick(function() {
	            // var that = this;
	            // _this.$dispatch('dispatchModifyText', that.idx);
	            Store.watches.isChangeThisText = true;
	        });
	      }
	      else {
	      	currentCanvas.elements[idx]
	      		.dblclick(function() {
	      	    Store.watches.isCropThisImage = true;
	      	});
	      };

		    // set handle of clicking
		    currentCanvas.elements[idx]
		    	.attr({ cursor: 'move' })
		    	// .mouseover(function() {
		    	// 	// show bbox
		    	// 	currentCanvas.trans[idx].setOpts({ draw: ['bbox'] });
		    	// })
		    	// .mouseout(function() {
		    	// 	// hide bbox
		    	// 	currentCanvas.trans[idx].setOpts({ draw: false });
		    	// })
		    	.click(function() {
						// console.log('clicked');
			    	var that = this;

			    	_this.changeClickDepth({ idx: that.idx });
				  });
	    // }
	    // else if(idx === 0) {
		  //   currentCanvas.elements[idx]
		  //   	// .attr({ cursor: 'move' })
		  //   	.click(function() {
			 //    	var that = this;
			 //    	// that.toFront();

			 //    	// save the selected image index into store
			 //    	currentCanvas.selectedIdx = that.idx;
			 //    	_this.highlightSelection();

				//   	// // change the dep value after toFront
				//   	// for(var j = 0;j < currentCanvas.elements.length; j++) {
				//   	// 	if(currentCanvas.elements[j].dep > that.dep ) {
				//   	// 		currentCanvas.elements[j].dep--;
				//   	// 	};
		  // 			// };
		  // 			// that.dep = currentCanvas.elements.length - 1;

				//   	// // apply the change
				//   	// currentCanvas.trans[that.idx].apply();
				//   });
	    // };
		},

		// init element transforms
		initElementTransform: function(idx, obj) {
			var _this = this;
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	    // prepare options
	    if(currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
	    	var options = {
	    		drag: ['self'],
	    		rotate: false,
	    		scale: ['bboxCorners'],
			  	keepRatio: true,
				  snap: { rotate: 1, scale: 1, drag: 1 },
				  // draw: ['bbox'],
				  draw: false,
				  range: { scale: [0, 99999] },
				  idx: idx
	    	};
	    }
	    else if(currentCanvas.params[idx].elType === 'text') {
	    	var options = {
	    		drag: ['self'],
	        rotate: false,
				  scale: ['bboxCorners'],
				  keepRatio: true,
				  snap: { rotate: 0, scale: 1, drag: 1 },
				  draw: false,
				  range: { scale: [0, 99999] },
				  idx: idx

	    	};
	    };

	    // if(idx > 0) {
		    // Add freeTransform with options and callback
			  currentCanvas.trans.$set(idx, currentCanvas.paper.freeTransform(currentCanvas.elements[idx], options, function(img, events) {
			    // console.log(img.attrs);
			    // console.log(events);
			    if(events[0] === 'scale start' || events[0] === 'rotate start') {
						Store.ctrls.tranMode = 'start';
						Store.ctrls.tranApplyCount = 0;
			    	// _this.changeClickDepth({ idx: img.opts.idx });
			    	_this.showSpineLines();
						WarnController.deleteElement(idx);

		    		$('#element-' + idx).css('opacity',0.2);
			    }
			    else if(events[0] === 'drag start' || (Store.ctrls.tranMode === 'end' && Store.ctrls.tranApplyCount >= 3)) {
						console.log('drag start');
			    	Store.ctrls.isDragStarted = true;
						Store.ctrls.tranMode = 'start';
						Store.ctrls.tranApplyCount = 0;
			    	// Store.ctrls.lastTranEvent = '';

			    	_this.showSpineLines();
			    	// console.log(currentCanvas.elements,currentCanvas.warns)
			    	// console.log(currentCanvas, currentCanvas.warns[idx]);
		    		WarnController.deleteElement(idx);

			    }
			    else if(events[0] === 'drag end' || (Store.ctrls.isDragStarted && events[0] === 'apply' && Store.ctrls.lastTranEvent === 'init')) {
			    	console.log('drag end');
			    	// console.info('index'+idx);
			    	Store.ctrls.isDragStarted = false;
						Store.ctrls.tranMode = 'end';
						Store.ctrls.tranApplyCount = 0;
			    	Store.ctrls.lastTranEvent = '';
			    	_this.changeClickDepth({ idx: img.opts.idx });
			    	_this.hideSpineLines();
			    	if(currentCanvas.warns[idx] && currentCanvas.warns[idx].isActive){
			    		WarnController.createElement(idx);
			    	}
			    	// WarnController.showBeforeElements();
			    	// console.info('index'+idx)

						var params = __webpack_require__(27).getParamsValueByElement(idx);

			    	if(params.x<-params.width||params.y<-params.height||params.x>currentCanvas.oriWidth||params.y>currentCanvas.oriHeight){
			    		console.info(params);
			    		params.x=0;
			    		params.y=0;
			    		if(params.elType==="text"){
			    			var TextController = __webpack_require__(30);
			    			TextController.editText(params,idx);
			    		}else if(params.elType==="image"||params.elType==="logo"){
			    			var ImageController = __webpack_require__(31);
			    			ImageController.editImage(params,idx);
			    		}

			    	}
			    }
			    else if(events[0] === 'scale end' || events[0] === 'rotate end') {
			    	// console.log('should sync params now');
						Store.ctrls.tranMode = 'end';
						Store.ctrls.tranApplyCount = 0;

			    	var newParams = ParamsManage.getCropParamsByElement(img.opts.idx);

			    	if(currentCanvas.params[img.opts.idx].elType === 'text') {
			    		console.log('resize text');
			    		if(newParams.fontSize < UtilMath.getPxByInch(0.3)) {
			    			newParams.fontSize = UtilMath.getPxByInch(0.3);
			    		}
			    		else if(newParams.fontSize > UtilMath.getPxByInch(16)) {
			    			newParams.fontSize = UtilMath.getPxByInch(16);
			    		};
			    		obj.editText(newParams, img.opts.idx);
			    	}
			    	else {
	  					currentCanvas.params.splice(img.opts.idx, 1, newParams);
	  					_this.editElement(img.opts.idx);
	  					_this.highlightSelection(img.opts.idx);
	  					_this.spineLinesToTop();
	  					_this.hideSpineLines();
			    	};

			    }
			    else if(Store.ctrls.tranMode === 'end' && events[0] === 'apply') {
						if(Store.ctrls.lastTranEvent === 'apply') {
							Store.ctrls.tranApplyCount++;
							console.log('apply count:', Store.ctrls.tranApplyCount);
						}
						else {
							Store.ctrls.tranApplyCount = 0;
						};
			    }


			    // showLegendText(img.opts.idx);

			    // save the tran event for back up
			    Store.ctrls.lastTranEvent = events[0] || '';
			  }));

				currentCanvas.trans[idx].attrs.rotate = currentCanvas.params[idx].rotate;
				// currentCanvas.trans[idx].hideHandles();
				currentCanvas.trans[idx].apply();
	    // }
	    // else {
	    // 	// set bg element's tran into nothing
	    // 	currentCanvas.trans.$set(idx, '');
	    // };
		},

		// init element dragging events
		initElementDragEvent: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		  // add dragging event listeners to image
		  if(currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
		  	// ## in fact, this code only valid for added images because background was covered by bleeding layer, the real event for background is binded on bleeding layer

		  	if(navigator.userAgent.indexOf('Trident') !== -1) {
		  		// fit for IE
		  		// on dragging over
		  		$('#element-' + idx).attr('ondragover', 'event.preventDefault();');

		  		// on dropping
					$('#element-' + idx).attr('ondrop', 'asFn.fnOndrop(event);');
		  	}
		  	else {
		  		// on dragging over
		  		document.getElementById('element-' + idx).ondragover = function(ev) {
		  			ev.preventDefault();
		  		};

		  		document.getElementById('element-' + idx).ondrop = function(ev) {
		  			var obj = { ev: ev, newAdded: false, isBg: false };
		  			Store.dropData.ev = obj.ev;
		  			Store.dropData.newAdded = obj.newAdded;
		  			Store.dropData.isBg = obj.isBg;

		  			// _this.handleOndrop(obj);
		  			Store.dropData.ev = ev;
		  			Store.watches.isOnDrop = true;
		  		};
		  	};


				// document.getElementById('element-' + idx).ondrop = function(ev) {
				// 	ev.preventDefault();

				// 	var imageId = store.dragData.imageId,
				// 			sourceImageUrl = store.dragData.sourceImageUrl,
				// 			// imageId = ev.dataTransfer.getData('imageId'),
				// 			// sourceImageUrl = ev.dataTransfer.getData('sourceImageUrl'),
				// 			// imageWidth = ev.dataTransfer.getData('imageWidth'),
				// 			// imageHeight = ev.dataTransfer.getData('imageHeight'),
				// 			idx = parseInt(ev.target.id.split('-')[1]);

				// 	currentCanvas.elements[idx].imageId = imageId;

				// 	var imageDetail = ImageListManage.getImageDetail(imageId);

				// 	if(imageDetail) {
				// 		currentCanvas.elements[idx].imageGuid = imageDetail.guid;
				// 		currentCanvas.elements[idx].imageWidth = imageDetail.width;
				// 		currentCanvas.elements[idx].imageHeight = imageDetail.height;
				// 	};

				// 	var defaultCrops = UtilCrop.getDefaultCrop(currentCanvas.elements[idx].imageWidth, currentCanvas.elements[idx].imageHeight, currentCanvas.elements[idx].vWidth, currentCanvas.elements[idx].vHeight);

				// 	var px = defaultCrops.px,
				// 			py = defaultCrops.py,
				// 			pw = defaultCrops.pw,
				// 			ph = defaultCrops.ph,
				// 			width = currentCanvas.elements[idx].vWidth / pw,
				// 			height = currentCanvas.elements[idx].vHeight / ph;

				// 	// adding the crop settings to element
				// 	currentCanvas.elements[idx].cropX = imageDetail.width * px;
				// 	currentCanvas.elements[idx].cropY = imageDetail.height * py;
				// 	currentCanvas.elements[idx].cropW = imageDetail.width * pw;
				// 	currentCanvas.elements[idx].cropH = imageDetail.height * ph;

				// 	currentCanvas.elements[idx].imageRotate = 0;

				// 	$('#element-' + idx).attr('href', '/imgservice/op/crop?imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(width) + '&height=' + Math.round(height));
				// 	// $.ajax({
				// 	// 	url: '/imgservice/op/crop',
				// 	// 	type: 'get',
				// 	// 	data: 'imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(width) + '&height=' + Math.round(height)
				// 	// }).done(function(result) {
				// 	// 	$('#element-0').attr('href', result);
				// 	// });
				// 	// var newImageSize = _this.stecheTo(imageWidth, imageHeight, currentCanvas.elements[idx].vWidth, currentCanvas.elements[idx].vHeight);

				// 	// front-end testing
				// 	// $('#element-0').attr('href', store.elementDragged.attributes.src.value);

				// 	currentCanvas.elements[idx].sourceImageUrl = sourceImageUrl;

				// 	ImageListManage.freshImageUsedCount();
				// 	_this.freshImageList();
				// };
		  };
		},

		// init warn tip
		initWarnTip: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			var imageDetail = ImageListManage.getImageDetail(currentCanvas.elements[idx].imageId);
	    // paint warn tip
	    currentCanvas.warns[idx] = {
	    	isActive: false,
	    	el: ''
	    };
	    if((currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') && imageDetail) {
		    var cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
		    	cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH;
		    console.log(imageDetail.width)
		    var params = __webpack_require__(27).getParamsValueByElement(idx);
		    var scaleW = params.width / cropWidth,
		    	scaleH = params.height / cropHeight,
		    	scale = Math.max(scaleW, scaleH);
		    console.log(scale)

		    if(scale>Store.warnSettings.resizeLimit){
		    	WarnController.createElement(idx);
		    }else{
		    	WarnController.deleteElement(idx);
		    	currentCanvas.warns[idx].isActive = false;
		    }
			}
			// WarnController.showBeforeElements();
		},

		createBackLayer: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			currentCanvas.elementBg = currentCanvas.paper.rect(0.5, 0.5, currentCanvas.width, currentCanvas.height);
			currentCanvas.elementBg.attr({ fill: 'rgba(255, 255, 255, 0)', stroke: 'rgba(10, 10, 10, 0)' });
			currentCanvas.elementBg.node.id = 'element-bg';
		},

		// create bleedings
		createBleeding: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			var bleedingRibbonLeft = currentCanvas.paper.rect(0, 0, currentCanvas.bleedings.left * currentCanvas.ratio, currentCanvas.height);
			bleedingRibbonLeft.attr({ fill: 'rgba(255, 255, 255, .6)', stroke: 'rgba(255, 255, 255, 0)' });
			var bleedingRibbonTop = currentCanvas.paper.rect(currentCanvas.bleedings.left * currentCanvas.ratio, 0, (currentCanvas.oriWidth - currentCanvas.bleedings.left - currentCanvas.bleedings.right) * currentCanvas.ratio, currentCanvas.bleedings.top * currentCanvas.ratio);
			bleedingRibbonTop.attr({ fill: 'rgba(255, 255, 255, .6)', stroke: 'rgba(255, 255, 255, .2)' });
			var bleedingRibbonBottom = currentCanvas.paper.rect(currentCanvas.bleedings.left * currentCanvas.ratio, (currentCanvas.oriHeight - currentCanvas.bleedings.bottom) * currentCanvas.ratio, (currentCanvas.oriWidth - currentCanvas.bleedings.left - currentCanvas.bleedings.right) * currentCanvas.ratio, currentCanvas.bleedings.bottom * currentCanvas.ratio);
			bleedingRibbonBottom.attr({ fill: 'rgba(255, 255, 255, .6)', stroke: 'rgba(255, 255, 255, 0.2)' });
			var bleedingRibbonRight = currentCanvas.paper.rect((currentCanvas.oriWidth - currentCanvas.bleedings.right) * currentCanvas.ratio, 0, currentCanvas.bleedings.right * currentCanvas.ratio, currentCanvas.height);
			bleedingRibbonRight.attr({ fill: 'rgba(255, 255, 255, .6)', stroke: 'rgba(255, 255, 255, 0)' });

			var bleedingInner = currentCanvas.paper.rect(currentCanvas.bleedings.left * currentCanvas.ratio, currentCanvas.bleedings.top * currentCanvas.ratio, (currentCanvas.oriWidth - currentCanvas.bleedings.left - currentCanvas.bleedings.right) * currentCanvas.ratio, (currentCanvas.oriHeight - currentCanvas.bleedings.top - currentCanvas.bleedings.bottom) * currentCanvas.ratio);
			bleedingInner.attr({ fill: 'rgba(255, 255, 255, 0)', stroke: '#646464' });
			bleedingInner.node.id = 'element-bg';
		},

		// create outer line
		createOuterLine: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			currentCanvas.outerLine = currentCanvas.paper.path('M0.5 0.5L' + (currentCanvas.width) + ' 0.5L' + (currentCanvas.width) + ' ' + (currentCanvas.height) + 'L0.5 ' + (currentCanvas.height) + 'L0.5 0.5');
			currentCanvas.outerLine.attr({ stroke: '#7b7b7b' });
		},

		// create inner line (e.g. for logo area)
		createInnerLine: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
					prj = Store.projectSettings[Store.currentSelectProjectIndex];

			var specData = SpecController.analyseSpec({ size: prj.size, product: prj.product});
			var logoX = specData.logo.x * currentCanvas.ratio,
					logoY = specData.logo.y * currentCanvas.ratio,
					logoWidth = specData.logo.width * currentCanvas.ratio,
					logoHeight = specData.logo.height * currentCanvas.ratio;

			currentCanvas.innerLine = currentCanvas.paper.path('M'+ logoX +' '+ logoY +'L' + (logoX + logoWidth) + ' '+ logoY +'L' + (logoX + logoWidth) + ' ' + (logoY + logoHeight) + 'L'+ logoX +' ' + (logoY + logoHeight) + 'L'+ logoX +' '+ logoY);
			currentCanvas.innerLine.attr({ stroke: '#7b7b7b', 'stroke-dasharray': '-' });
		},

		// create inner line
		createCenterLine: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
					centerX = currentCanvas.width / 2;

	  	// NOTE: we think when center line exists, spine lines do not, thus we use spineLeft element instead
	  	currentCanvas.spineLeft = currentCanvas.paper.path('M'+ centerX +' 0L' + centerX + ' '+ currentCanvas.height);
	  	currentCanvas.spineLeft.attr({ stroke: '#7b7b7b', 'stroke-dasharray': '-' });
		},

		// create spine lines
		createSpineLine: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// NOTE: for now, we think spine cannot be 0 width and must be in cover page
			if(currentCanvas.oriSpineWidth !== 0) {
				var spineWidth = currentCanvas.oriSpineWidth * currentCanvas.ratio,
						spineLeftX = (currentCanvas.width - spineWidth) / 2,
						spineRightX = spineLeftX + spineWidth;

				currentCanvas.spineLeft = currentCanvas.paper.path('M' + spineLeftX + ' 0L' + spineLeftX + ' ' + currentCanvas.height);
				currentCanvas.spineLeft.attr({ stroke: '#646464', 'stroke-dasharray': '-' });
				currentCanvas.spineRight = currentCanvas.paper.path('M' + spineRightX + ' 0L' + spineRightX + ' ' + currentCanvas.height);
				currentCanvas.spineRight.attr({ stroke: '#646464', 'stroke-dasharray': '-' });
			};
		},

		hCenterElement: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			var canvasWidth =currentCanvas.width;
			var canvasHeight=currentCanvas.height;
			var elementWidth = currentCanvas.params[idx].width*currentCanvas.ratio;
			var elementHeight = currentCanvas.params[idx].height*currentCanvas.ratio;

			currentCanvas.params[idx].x=(canvasWidth-elementWidth)/2/currentCanvas.ratio;
		},

		changeClickDepth: function(oParams) {
			if(oParams && oParams.idx != undefined) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				// save the selected image index into store
	    	currentCanvas.selectedIdx = oParams.idx;
	    	// currentCanvas.elements[oParams.idx].toFront();
	    	// console.log('click ON - set element ' + oParams.idx + ' to front');

		  	// change the dep value after toFront
		  	this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.elements.length - 1 })
		  	this.freshElementDepth();
	      // this.spineLinesToTop();

		  	// apply the change
		  	currentCanvas.trans[oParams.idx].apply();

		  	this.highlightSelection(oParams.idx);
			};
		},

		sendToBack: function(oParams) {
			if(oParams && oParams.idx != undefined) {
				// var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
				//
				// currentCanvas.selectedIdx = currentCanvas.elements.length - 1;
				// currentCanvas.elements[oParams.idx].toBack();

				this.changeDepthValue({ idx: oParams.idx, targetDepth: 0 });
				// this.freshElementDepth();

				// if(currentCanvas.elementBg) {
				// 	currentCanvas.elementBg.toBack();
				// };

				// this.spineLinesToTop();

				// currentCanvas.trans[oParams.idx].apply();
				//
				// this.blurSelection(oParams.idx);
				// console.log('after apply', currentCanvas.elements[oParams.idx], currentCanvas.trans[oParams.idx]);
			};
		},

		sendToFront: function(oParams) {
			if(oParams && oParams.idx != undefined) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params.length-1 });
			};
		},

		bringBackward : function(oParams){
			if(oParams && oParams.idx != undefined) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				if(currentCanvas.params[oParams.idx].dep > 0) {
					this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params[oParams.idx].dep-1 });
				};

			};
		},

		bringForward : function(oParams){
			if(oParams && oParams.idx != undefined) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				if(currentCanvas.params[oParams.idx].dep < currentCanvas.params.length-1) {
					this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params[oParams.idx].dep+1 });
				};

			};
		},

		// change the dep value we hold for further depth controlling
		changeDepthValue: function(oParams) {
			if(oParams && oParams.idx != undefined && oParams.targetDepth != undefined) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						currentDepth = currentCanvas.params[oParams.idx].dep,
						targetDepth = oParams.targetDepth;

				if(targetDepth === currentDepth) {
					return;
				}
				else if(targetDepth > currentDepth) {
					// pop up
					for(var i = 0; i < currentCanvas.params.length; i++) {
						if(currentCanvas.params[i].dep > currentDepth && currentCanvas.params[i].dep <= targetDepth) {
							currentCanvas.params[i].dep--;
						};
					};
					currentCanvas.params[oParams.idx].dep = targetDepth;
				}
				else {
					// sink down
					for(var i = 0; i < currentCanvas.params.length; i++) {
						if(currentCanvas.params[i].dep < currentDepth && currentCanvas.params[i].dep >= targetDepth) {
							currentCanvas.params[i].dep++;
						};
					};
					currentCanvas.params[oParams.idx].dep = targetDepth;
				};
			};
		},

		// change real elements' depth by depth value we have
		freshElementDepth: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// NOTE: we loop all elements and pick out dep value to push into a new array
			// Then we sort this new array, next, we can change element(by index) to top for each of them in sequence
			// e.g. index --  0  1  2  3
			// their depth--  2  3  0  1
			// after sorting the new array is like [{idx: 2, dep: 0}, {idx: 3, dep: 1}, {idx: 0, dep: 2}, {idx: 1, dep: 3}]
			var depthAry = [];
			for(var i = 0; i < currentCanvas.elements.length; i++) {
				depthAry.push({
					idx: i,
					dep: currentCanvas.elements[i].dep
				});
			};
			// sort array by depth value ASC
			depthAry.sort(function(a, b) { return a.dep - b.dep });
			// now change the depth(we only need to change depth from second one, leave the first on bottom...)
			for(i = 1; i < depthAry.length; i++) {
				currentCanvas.elements[depthAry[i].idx].toFront();

				// warn tip toFront
				if(currentCanvas.warns[depthAry[i].idx] && currentCanvas.warns[depthAry[i].idx].el) {
					currentCanvas.warns[depthAry[i].idx].el.toFront();
				};
			};
			// WarnController.showBeforeElements();

			this.spineLinesToTop();
		},

		// fresh depth
		freshDepth: function(removedIdx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
					fromDepth = currentCanvas.params[removedIdx].dep;

			for(var i = 0; i < currentCanvas.params.length; i++) {
				if(currentCanvas.params[i].dep > fromDepth) {
					currentCanvas.params[i].dep--;
				};
			};
		},

		// fresh index
		freshIdx: function(fromIdx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			for(var i = 0; i < currentCanvas.elements.length; i++) {
				if(currentCanvas.elements[i].idx > fromIdx) {
					currentCanvas.elements[i].idx--;

					// for now, we need to change the dom element id as well
					currentCanvas.elements[i].node.id = 'element-' + (i - 1);
					// $('#element-'+ i).attr('id', 'element-' + (i - 1));
				};
			};
		},

		// make spine lines always top
		spineLinesToTop: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.innerLine !== '') {
				currentCanvas.innerLine.toFront();
			};
			if(currentCanvas.spineLeft !== '') {
				currentCanvas.spineLeft.toFront();
			};
			if(currentCanvas.spineRight !== '') {
				currentCanvas.spineRight.toFront();
			};
		},

		showSpineLines: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.outerLine !== '') {
				currentCanvas.outerLine.show();
			};
			if(currentCanvas.innerLine !== '') {
				currentCanvas.innerLine.show();
			};
			if(currentCanvas.spineLeft !== '') {
				currentCanvas.spineLeft.show();
			};
			if(currentCanvas.spineRight !== '') {
				currentCanvas.spineRight.show();
			};
		},

		hideSpineLines: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.outerLine !== '') {
				currentCanvas.outerLine.hide();
			};
			if(currentCanvas.innerLine !== '') {
				currentCanvas.innerLine.hide();
			};
			if(currentCanvas.spineLeft !== '') {
				currentCanvas.spineLeft.hide();
			};
			if(currentCanvas.spineRight !== '') {
				currentCanvas.spineRight.hide();
			};
		},

		// highlight selection
		highlightSelection: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			idx ? idx : idx = currentCanvas.selectedIdx;

			for(var i = 0; i < currentCanvas.trans.length; i++) {
				currentCanvas.trans[i].setOpts({ draw: false });
			};

			if(currentCanvas.elements[idx].elType === 'image' || currentCanvas.elements[idx].elType === 'logo') {
				var options = {
	    		drag: ['self'],
	    		rotate: false,
	    		scale: ['bboxCorners'],
			  	keepRatio: false,
				  snap: { rotate: 1, scale: 1, drag: 1 },
				  draw: ['bbox'],
				  // draw: false,
				  range: { scale: [0, 99999] },
				  idx: idx
	    	};
			}
			else {
				var options = {
	    		drag: ['self'],
	        rotate: false,
				  // scale: false,
				  scale: ['bboxCorners'],
				  keepRatio: true,
				  snap: { rotate: 0, scale: 1, drag: 1 },
				  draw: ['bbox'],
				  range: { scale: [0, 99999] },
				  idx: idx

				  // rotate: [],
	     //    // keepRatio: true,
				  // scale: [],
				  // snap: { rotate: 0, scale: 0, drag: 1 },
				  // draw: 'bbox',
				  // drag: 'self',
				  // idx: idx
	    	};
			};
			currentCanvas.trans[idx].setOpts(options);
			currentCanvas.trans[idx].apply();

			// fix bbox style
			if(true) {
				$('rect.handle.bbox.index-0').css('cursor', 'nw-resize');
				$('rect.handle.bbox.index-1').css('cursor', 'ne-resize');
				$('rect.handle.bbox.index-2').css('cursor', 'se-resize');
				$('rect.handle.bbox.index-3').css('cursor', 'sw-resize');
			};

		},

		blurSelection: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			idx ? idx : idx = currentCanvas.selectedIdx;

			currentCanvas.trans[idx].setOpts({ draw: false });
		},

		// get default positions about new element based on where user dropped element
		// NOTE: this function provides REAL params, not view params
		getDefaultNewElementPosition: function(oData) {
			if(oData) {
				oData.x = oData.x || 0;
				oData.y = oData.y || 0;

				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						fullWidth = currentCanvas.width / currentCanvas.ratio,
						fullHeight = currentCanvas.height / currentCanvas.ratio,
						limitedWidth = limitedHeight = 150 / currentCanvas.ratio,
						targetX = oData.x / currentCanvas.ratio,
						targetY = oData.y / currentCanvas.ratio;
				// get the suitable element width and height
				var imageId = Store.dragData.imageId,
						imageDetail = ImageListManage.getImageDetail(imageId),
						elWidth, elHeight;

				// check if user drop image into logo area(in cover page, page index 0)
				if(Store.selectedPageIdx === 0 && this.isInLogoArea(targetX, targetY)) {
					// fit image into logo area(meet type)
					var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
					var logoData = specData.logo;

					if(imageDetail) {
						elWidth = imageDetail.width;
						elHeight = imageDetail.height;
					}
					else {
						// some errors occured... but to be robust, we consider it and set the new element width, height based on logo width, logo height
						elWidth = logoData.width;
						elHeight = logoData.height;
					};

					// fix element width, height value
					var divElement = elWidth / elHeight,
							divLogo = logoData.width / logoData.height;
					if(divElement >= divLogo) {
						// width will meet the limit at first
						var resizeRatio = logoData.width / elWidth;

						elWidth = elWidth * resizeRatio;
						elHeight = elHeight * resizeRatio;
					}
					else {
						// height will meet the limit at first
						var resizeRatio = logoData.height / elHeight;

						elWidth = elWidth * resizeRatio;
						elHeight = elHeight * resizeRatio;
					};

					// get element x, y positions by resized elWidth, elHeight
					var elX = logoData.x + (logoData.width - elWidth) / 2,
							elY = logoData.y + (logoData.height - elHeight) / 2;

					return {
						x: elX,
						y: elY,
						width: elWidth,
						height: elHeight
					};
				}
				else {
					// normal case
					if(imageDetail) {
						elWidth = imageDetail.width;
						elHeight = imageDetail.height;
					}
					else {
						// some errors occured... but to be robust, we consider it and set the new element width, height based on fullWidth, fullHeight
						elWidth = fullWidth / 3;
						elHeight = fullHeight / 3;
					};

					// fix element width, height value
					var divElement = elWidth / elHeight,
							// divCanvas = fullWidth / fullHeight;
							divCanvas = limitedWidth / limitedHeight;
					if(divElement >= divCanvas) {
						// width will meet the limit at first
						var resizeRatio = limitedWidth / elWidth;
					}
					else {
						// height will meet the limit at first
						var resizeRatio = limitedHeight / elHeight;
					};
					elWidth *= resizeRatio;
					elHeight *= resizeRatio;
					// if(divElement >= divCanvas) {
					// 	// width will meet the limit at first
					// 	if(elWidth > (fullWidth * 4 / 5)) {
					// 		// width is too large, resize by width
					// 		var resizeRatio = (fullWidth * 4 / 5) / elWidth;
					//
					// 		elWidth = elWidth * resizeRatio;
					// 		elHeight = elHeight * resizeRatio;
					// 	};
					// }
					// else {
					// 	// height will meet the limit at first
					// 	if(elHeight > (fullHeight * 4 / 5)) {
					// 		// height is too large, resize by height
					// 		var resizeRatio = (fullHeight * 4 / 5) / elHeight;
					//
					// 		elWidth = elWidth * resizeRatio;
					// 		elHeight = elHeight * resizeRatio;
					// 	};
					// };

					// // fix element x, y positions if needed (e.g. the target position is too close to the edges of canvas)
					// // NOTE: in fact, this situation only happens next to right, bottom edge
					// if(targetX > (fullWidth * 19 / 20)) {
					// 	targetX -= fullWidth / 20;
					// };
					// if(targetY > (fullHeight * 19 / 20)) {
					// 	targetY -= fullHeight / 20;
					// };
					var fixedX = Store.dragData.cursorX / currentCanvas.ratio,
							fixedY = Store.dragData.cursorY / currentCanvas.ratio;
					console.log(fixedX, fixedY);
					targetX -= fixedX;
					targetY -= fixedY;

					return {
						x: targetX,
						y: targetY,
						width: elWidth,
						height: elHeight
					};
				};
			}
			else {
				return {
					x: 0,
					y: 0,
					width: 300,
					height: 300
				};
			};
		},

	  // check if position is in logo area(in real size)
		isInLogoArea: function(targetX, targetY) {
			if(targetX != null && targetY != null) {
				var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
				var logoData = specData.logo;

				if(targetX >= logoData.x && targetX <= (logoData.x + logoData.width) && targetY >= logoData.y && targetY <= (logoData.y + logoData.height)) {
					// in logo area
					return true;
				}
				else {
					return false;
				};
			}
			else {
				return false;
			};
		},

		// init canvas data -- main
		initCanvasData: function() {
			if(Store.projectSettings && Store.projectXml) {
				var sXml = Store.projectXml;
				this.initImageList(sXml);
				this.initProject(sXml);

				// set page as cover page defaultly
				Store.selectedPageIdx = 0;
			};
		},

		// init image list
		initImageList: function(sXml) {
			if(sXml) {
				var imgCount = $(sXml).find('images').find('image').length;

				Store.imageList = [];
				if(imgCount > 0) {
					for(var i = 0; i < imgCount; i++) {
						Store.imageList.push({
							id: $(sXml).find('images').find('image').eq(i).attr('id'),
							guid: $(sXml).find('images').find('image').eq(i).attr('guid') || '',
							// url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
							encImgId: decodeURIComponent($(sXml).find('images').find('image').eq(i).attr('encImgId')) || '',
							url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(sXml).find('images').find('image').eq(i).attr('encImgId') + '&rendersize=fit',
							name: $(sXml).find('images').find('image').eq(i).attr('name'),
							width: parseFloat($(sXml).find('images').find('image').eq(i).attr('width')) || 0,
							height: parseFloat($(sXml).find('images').find('image').eq(i).attr('height')) || 0,
							shotTime: $(sXml).find('images').find('image').eq(i).attr('shotTime') || '',
							usedCount: 0
						});
					};
				};
			};
		},

		// init page
		initProject: function(sXml) {
			if(sXml) {
				for(var k = 0; k < $(sXml).find('tshirt').length; k++) {
					var prj = Store.projectSettings[k];
					var specData = SpecController.analyseSpec({ size: prj.size, product: prj.product});

					Store.projects[k] = {};
					Store.projects[k].pages = [];
					for(var i = 0; i < $(sXml).find('tshirt').eq(k).find('content').length; i++) {
						Store.projects[k].pages.push({
							type: $(sXml).find('tshirt').eq(k).find('content').eq(i).attr('type') || '',
							name: '',
							canvas: {
								// isInited: false,
								// width: 0,				// canvas width
								// height: 0,			// canvas height
								// x: 0,
								// y: 0,
								// bgWidth: 0,
								// bgHeight: 0,
								// ratio: 1,				// view size / real size,  eg. ratio = width / oriWidth
								oriWidth: 0,		// real size
								oriHeight: 0,
								oriX: 0,
								oriY: 0,
								oriBgWidth: 0,
								oriBgHeight: 0,
								oriSpineWidth: 0,
								// bleedings: {},	// bleeding sizes
								realBleedings: {},
								frameBaseSize: {},
								frameBorderThickness: {},
								boardInFrame: {},
								boardInMatting: {},
								mattingSize: {},
								expendSize: {},
								photoLayer: {},
								// selectedIdx: 0,	// the image index in params which was selected
								// paper: '',			// svg paper object
								params: [],			// all elements params/settings from backend
								// elements: [],		// svg current saved elements params/settings, with extra data
																// idx, dep, type('image'/'text'), imageUrl(current selected image path)/text, vWidth, vHeight (the view/handler size), cropX, cropY, cropW, cropH(the real crop positions done) ...
																// fontFamily, fontWeight, fontSize, color(rgba -- >), opacity(0 - 1)
								// trans: [],			// the objects those store transforming
								// outerLine: '',		// to store the outer line element
								// innerLine: '',		// to store the inner line element
								// bleedingRibbonLeft: '',		// to store the left bleeding element
								// bleedingRibbonRight: '',		// to store the right bleeding element
								// bleedingRibbonTop: '',		// to store the top bleeding element
								// bleedingRibbonBottom: '',		// to store the bottom bleeding element
								// spineLeft: '',	// to store the left spine element
								// spineRight: '',	// to store the right spine element
								// elementBg: ''		// to store the bg element
							}
						});

						var currentCanvas = Store.projects[k].pages[i].canvas;

						// front
						if(Store.projects[k].pages[i].type === 'coverPage' || i === 0) {
							currentCanvas.oriWidth = specData.base.width;
							currentCanvas.oriHeight = specData.base.height;
							currentCanvas.oriX = specData.base.x;
							currentCanvas.oriY = specData.base.y;
							currentCanvas.oriBgWidth = specData.background.width;
							currentCanvas.oriBgHeight = specData.background.height;
						}
						else {
							// back
							currentCanvas.oriWidth = specData.base.width;
							currentCanvas.oriHeight = specData.base.height;
							currentCanvas.oriX = specData.base.x;
							currentCanvas.oriY = specData.base.y;
							currentCanvas.oriBgWidth = specData.background.width;
							currentCanvas.oriBgHeight = specData.background.height;
						};

						// get elements' size params
						var paramsCount = $(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').length;
						for(var j = 0; j < paramsCount; j++) {
							var imgId = $(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('imageid') || '',
									imageDetail = ImageListManage.getImageDetail(imgId),
									sourceImageUrl = '';

							imageDetail !== '' ? sourceImageUrl = Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid='+ imageDetail.encImgId +'&rendersize=fit' : sourceImageUrl;
							var ox = parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('x')) || 0,
									oy = parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('y')) || 0,
									ow = parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('width')) || 0,
									oh = parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('height')) || 0;
							// var shiftedValue = ParamsManage.getShiftValue(currentCanvas);
							// var newPosition = ParamsManage.getShiftPosition(ox, oy, ow, oh, shiftedValue.x, shiftedValue.y);
							var elType = '';
							if($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('type') === 'LogoElement') {
								elType = 'logo';
							}
							else if($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('type') === 'PhotoElement') {
								elType = 'image';
							}
							else if($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('type') === 'TextElement') {
								elType = 'text';
							};

							currentCanvas.params.push({
								id: j,
								elType: elType,
								// url: sourceImageUrl,
								url: '',
								isRefresh: false,
								text: decodeURIComponent($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).text()) || '',
								x: ox,
								y: oy,
								width: ow,
								height: oh,
								rotate: parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('rot')),
								dep: parseInt($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('dep')),
								imageId: imgId,
								imageGuid: imageDetail.guid || '',
								imageWidth: imageDetail.width || '',
								imageHeight: imageDetail.height || '',
								imageRotate: parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('imgRot')) || 0,
								// imageFlip: ,
								cropPX: parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropLUX')) || 0,
								cropPY: parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropLUY')) || 0,
								cropPW: (parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropRLX')) - parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropLUX'))) || 1,
								cropPH: (parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropRLY')) - parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('cropLUY'))) || 1,
								fontFamily: decodeURIComponent($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('fontFamily')) || '',
								fontSize: currentCanvas.oriHeight * parseFloat($(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('fontSize') || 0),
								fontWeight: $(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('fontWeight') || '',
								textAlign: $(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('textAlign') || '',
								fontColor: $(sXml).find('tshirt').eq(k).find('content').eq(i).find('element').eq(j).attr('color') || ''
							});
						};
					};
				};

			};
		},

		// load project params into pages setting
		loadProjectIntoPages: function(idx) {
			idx != undefined && idx != null ? idx : idx = Store.currentSelectProjectIndex;
			Store.pages = [];

			var pickedProject = Store.projects[idx];

			for(var i = 0; i < pickedProject.pages.length; i++) {
				Store.pages.push({
					type: pickedProject.pages[i].type || '',
					name: '',
					canvas: {
						isInited: false,
						width: 0,				// canvas width
						height: 0,			// canvas height
						x: 0,
						y: 0,
						bgWidth: 0,
						bgHeight: 0,
						ratio: 1,				// view size / real size,  eg. ratio = width / oriWidth
						oriWidth: pickedProject.pages[i].canvas.oriWidth,		// real size
						oriHeight: pickedProject.pages[i].canvas.oriHeight,
						oriX: pickedProject.pages[i].canvas.oriX,
						oriY: pickedProject.pages[i].canvas.oriY,
						oriBgWidth: pickedProject.pages[i].canvas.oriBgWidth,
						oriBgHeight: pickedProject.pages[i].canvas.oriBgHeight,
						oriSpineWidth: pickedProject.pages[i].canvas.oriSpineWidth,
						bleedings: {},	// bleeding sizes
						realBleedings: pickedProject.pages[i].canvas.realBleedings,
						frameBaseSize: pickedProject.pages[i].canvas.frameBaseSize,
						frameBorderThickness: pickedProject.pages[i].canvas.frameBorderThickness,
						boardInFrame: pickedProject.pages[i].canvas.boardInFrame,
						boardInMatting: pickedProject.pages[i].canvas.boardInMatting,
						mattingSize: pickedProject.pages[i].canvas.mattingSize,
						expendSize: pickedProject.pages[i].canvas.expendSize,
						photoLayer: pickedProject.pages[i].canvas.photoLayer,
						selectedIdx: 0,	// the image index in params which was selected
						// paper: '',			// svg paper object
						params: pickedProject.pages[i].canvas.params.slice(0),			// all elements params/settings from backend
						elements: [],		// svg current saved elements params/settings, with extra data
														// idx, dep, type('image'/'text'), imageUrl(current selected image path)/text, vWidth, vHeight (the view/handler size), cropX, cropY, cropW, cropH(the real crop positions done) ...
														// fontFamily, fontWeight, fontSize, color(rgba -- >), opacity(0 - 1)
						// trans: [],			// the objects those store transforming
						// warns: [],			// the objects those store warn elements
						outerLine: '',		// to store the outer line element
						innerLine: '',		// to store the inner line element
						bleedingRibbonLeft: '',		// to store the left bleeding element
						bleedingRibbonRight: '',		// to store the right bleeding element
						bleedingRibbonTop: '',		// to store the top bleeding element
						bleedingRibbonBottom: '',		// to store the bottom bleeding element
						spineLeft: '',	// to store the left spine element
						spineRight: '',	// to store the right spine element
						elementBg: ''		// to store the bg element
					}
				});
			};
		},

		// sync project data
		syncProjectData: function(nProjectIdx) {
			// target is sync pages setting back into project params
			nProjectIdx != undefined && nProjectIdx != null ? nProjectIdx : nProjectIdx = Store.currentSelectProjectIndex;

			for(var j = 0; j < Store.pages.length; j++) {
				var currentCanvas = Store.pages[j].canvas;

				// if(currentCanvas.elements.length == 0 && currentCanvas.params.length > 0) {
				// 	// meet a page which not inited yet
				// 	// do nothing
				// }
				// else {
				// 	// reset trash params values
				// 	currentCanvas.params = [];
				//
				// 	for(var i = 0; i < currentCanvas.elements.length; i++) {
				// 		var newParams = ParamsManage.getParamsValueByElement(i, j);
				//
				// 		currentCanvas.params.push(newParams);
				// 	};
				// };

				// Store.projects[nProjectIdx].pages[Store.selectedPageIdx].canvas.params = [];
				// Store.projects[nProjectIdx].pages[Store.selectedPageIdx].canvas.params = currentCanvas.params.slice(0);

				// NOTE: for t-shirt, we need to sync data into ALL project params
				for(i = 0; i < Store.projectSettings.length; i++) {
					if(i > Store.projects.length - 1) {
						// missing a new added project
						this.createProjectData();
					}
					else {
						Store.projects[i].pages[j].canvas.params = [];
						Store.projects[i].pages[j].canvas.params = currentCanvas.params.slice(0);
					};
				};
			};

		},

		createProjectData: function() {
			Store.projects.push(Store.projects[0]);
		},

		freshPageData: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			currentCanvas.frameBaseSize = ProjectManage.getFrameBaseSize();
			currentCanvas.frameBorderThickness = ProjectManage.getFrameBorderThickness();
			currentCanvas.realBleedings = ProjectManage.getBleed();
			currentCanvas.boardInFrame = ProjectManage.getBoardInFrame();
			currentCanvas.boardInMatting = ProjectManage.getBoardInMatting();
			currentCanvas.mattingSize = ProjectManage.getMatteSize();
			currentCanvas.photoLayer = ProjectManage.getPhotoLayer();

			currentCanvas.expendSize = { top: currentCanvas.frameBorderThickness.top - currentCanvas.boardInFrame.top, right: currentCanvas.frameBorderThickness.right - currentCanvas.boardInFrame.right, bottom: currentCanvas.frameBorderThickness.bottom - currentCanvas.boardInFrame.bottom, left: currentCanvas.frameBorderThickness.left - currentCanvas.boardInFrame.left };


			currentCanvas.oriWidth = currentCanvas.photoLayer.width;
			currentCanvas.oriHeight = currentCanvas.photoLayer.height;
			currentCanvas.oriBgWidth = currentCanvas.frameBaseSize.width;
			currentCanvas.oriBgHeight = currentCanvas.frameBaseSize.height;
			currentCanvas.oriX = currentCanvas.photoLayer.x;
			currentCanvas.oriY = currentCanvas.photoLayer.y;
		},

	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {

	module.exports = {
		// get image detail
		getImageDetail: function(sImageId) {
			if(sImageId) {
				for(var i = 0; i < Store.imageList.length; i++) {
					if(Store.imageList[i].id === sImageId) {
						return Store.imageList[i];
					};
				};
			}
			else {
				return '';
			};
		},

		// fresh image used count
		freshImageUsedCount: function() {
			// var _this = this,
			// 		store = _this.sharedStore;

			// count image used
			var usedIdAry = [],				// [ 'id1', 'id2', ... ]
					usedCountAry = [];		// [ 1, 2, ... ]
			for(var i = 0; i < Store.pages.length; i++) {
				var currentCanvas = Store.pages[i].canvas;

				for(var j = 0; j < currentCanvas.params.length; j++) {
					if(currentCanvas.elements[j] && currentCanvas.elements[j].imageId != undefined && currentCanvas.elements[j].imageId !== '') {
						// inited, fetch data based on elements
						var el = currentCanvas.elements[j];
					}
					else {
						// not inited, fetch data based on params
						var el = currentCanvas.params[j];
					};

					// used image !
					if(el.imageId && el.imageId !== '') {
						if($.inArray(el.imageId, usedIdAry) === -1) {
							// new image id
							usedIdAry.push(el.imageId);
							usedCountAry.push(1);
						}
						else {
							// image id used already, count ++
							var idx = $.inArray(el.imageId, usedIdAry);

							usedCountAry[idx]++;
						};
					};
				};
			};

			// init image list
			for(i = 0; i < Store.imageList.length; i++) {
				Store.imageList[i].usedCount = 0;

				// check if used
				for(j = 0; j < usedIdAry.length; j++) {
					if(usedIdAry[j] === Store.imageList[i].id) {
						Store.imageList[i].usedCount = usedCountAry[j];
						break;
					};
				};
			};

		},
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var UtilMath = __webpack_require__(7);

	//
	module.exports = {
	    // calculate new params value by element
	    getParamsValueByElement: function(idx, nPageIdx) {
	        nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
	        var currentCanvas = Store.pages[nPageIdx].canvas;

	        if (idx != undefined && idx != null) {
	            // pass in element idx
	            // if(i === 0) {
	            // 	// background image, no trans, with different data model from those with trans
	            // 	var W = currentCanvas.elements[i].attrs.width / currentCanvas.ratio,
	            // 			H = currentCanvas.elements[i].attrs.height / currentCanvas.ratio,
	            // 			OX = currentCanvas.elements[i].attrs.x / currentCanvas.ratio,
	            // 			OY = currentCanvas.elements[i].attrs.y / currentCanvas.ratio,
	            // 			ROT = 0;
	            // }
	            // else {
	            // if(currentCanvas.elType === 'text') {
	            // 	// text element use view width and height
	            // 	var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
	            // 			hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
	            // 			W = wDot,
	            // 			H = hDot;
	            // }
	            // else {
	            var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
	                hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
	                W = wDot / currentCanvas.ratio,
	                H = hDot / currentCanvas.ratio;
	            // };
	            var OX = (currentCanvas.trans[idx].attrs.x + currentCanvas.trans[idx].attrs.translate.x - (wDot - currentCanvas.trans[idx].attrs.size.x) / 2) / currentCanvas.ratio,
	                OY = (currentCanvas.trans[idx].attrs.y + currentCanvas.trans[idx].attrs.translate.y - (hDot - currentCanvas.trans[idx].attrs.size.y) / 2) / currentCanvas.ratio,
	                ROT = currentCanvas.trans[idx].attrs.rotate;
	            // };

	            if (Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
	                // special rotate
	                var cWidth = currentCanvas.elements[idx].imageHeight,
	                    cHeight = currentCanvas.elements[idx].imageWidth;
	            } else {
	                var cWidth = currentCanvas.elements[idx].imageWidth,
	                    cHeight = currentCanvas.elements[idx].imageHeight;
	            };

	            // calculate font size again
	            if (currentCanvas.elements[idx].elType === 'text') {
	                var finalFontSize = currentCanvas.elements[idx].fontSize * currentCanvas.trans[idx].attrs.scale.x;
	            } else {
	                var finalFontSize = currentCanvas.elements[idx].fontSize;
	            };

	            return {
	                elType: currentCanvas.elements[idx].elType,
	                url: currentCanvas.elements[idx].sourceImageUrl,
	                text: currentCanvas.elements[idx].text,
	                x: OX,
	                y: OY,
	                width: W,
	                height: H,
	                rotate: ROT,
	                dep: currentCanvas.elements[idx].dep,
	                imageId: currentCanvas.elements[idx].imageId,
	                imageRotate: currentCanvas.elements[idx].imageRotate || 0,
	                cropPX: currentCanvas.elements[idx].cropX / cWidth || 0,
	                cropPY: currentCanvas.elements[idx].cropY / cHeight || 0,
	                cropPW: currentCanvas.elements[idx].cropW / cWidth || 1,
	                cropPH: currentCanvas.elements[idx].cropH / cHeight || 1,
	                fontFamily: currentCanvas.elements[idx].fontFamily || '',
	                fontSize: parseFloat(finalFontSize) || '',
	                fontWeight: currentCanvas.elements[idx].fontWeight || '',
	                textAlign: currentCanvas.elements[idx].textAlign || '',
	                fontColor: currentCanvas.elements[idx].fontColor || ''
	            };
	        } else {
	            // no idx
	            return '';
	        };
	    },

	    getCropParamsByElement: function(idx, nPageIdx) {
	        nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
	        var currentCanvas = Store.pages[nPageIdx].canvas;

	        if (idx != undefined && idx != null) {
	            var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
	                hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
	                W = wDot / currentCanvas.ratio,
	                H = hDot / currentCanvas.ratio;
	            var OX = (currentCanvas.trans[idx].attrs.x + currentCanvas.trans[idx].attrs.translate.x - (wDot - currentCanvas.trans[idx].attrs.size.x) / 2) / currentCanvas.ratio,
	                OY = (currentCanvas.trans[idx].attrs.y + currentCanvas.trans[idx].attrs.translate.y - (hDot - currentCanvas.trans[idx].attrs.size.y) / 2) / currentCanvas.ratio,
	                ROT = currentCanvas.trans[idx].attrs.rotate;

	            if (Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
	                // special rotate
	                var cWidth = currentCanvas.elements[idx].imageHeight,
	                    cHeight = currentCanvas.elements[idx].imageWidth;
	            } else {
	                var cWidth = currentCanvas.elements[idx].imageWidth,
	                    cHeight = currentCanvas.elements[idx].imageHeight;
	            };

	            // calculate font size again
	            if (currentCanvas.elements[idx].elType === 'text') {
	                var finalFontSize = currentCanvas.elements[idx].fontSize * currentCanvas.trans[idx].attrs.scale.x;
	            } else {
	                var finalFontSize = currentCanvas.elements[idx].fontSize;
	            };

	            var cropPX = currentCanvas.elements[idx].cropX/cWidth;
	  			var cropPY = currentCanvas.elements[idx].cropY/cHeight;
	  			var cropPW = currentCanvas.elements[idx].cropW/cWidth;
	  			var cropPH = currentCanvas.elements[idx].cropH/cHeight;

	            var width = W;
	            var height = H;
	            var cropLUX = cropPX;
	            var cropRLX = cropPX + cropPW;
	            var cropLUY = cropPY;
	            var cropRLY = cropPY + cropPH;
	            var viewRatio = height / width;
	            var photoImageW = cWidth;
	            var photoImageH = cHeight;
	            var oldHWAspectRatio = (cropRLY - cropLUY) / (cropRLX - cropLUX);
	            var cropCenterX = cropLUX + (cropRLX - cropLUX) / 2;
	            var cropCenterY = cropLUY + (cropRLY - cropLUY) / 2;
	            var oldCropX = cropLUX * photoImageW;
	            var oldCropY = cropLUY * photoImageH;
	            var oldCropW = (cropRLX - cropLUX) * photoImageW;
	            var oldCropH = (cropRLY - cropLUY) * photoImageH;
	            var oldCropCenterX = cropCenterX * photoImageW;
	            var oldCropCenterY = cropCenterY * photoImageH;

	            var cropUnitsPercentX = (cropRLX - cropLUX) * photoImageW / width;
				var cropUnitsPercentY = (cropRLY - cropLUY) * photoImageH / height;


	            /*var newCropW;
	            var newCropH;

	            if (viewRatio > oldHWAspectRatio) {
	                newCropH = oldCropH * photoImageH;
	                newCropW = newCropH / viewRatio;
	            } else {
	                newCropW = oldCropW * photoImageW;
	                newCropH = viewRatio * newCropW;
	            }

	            if (newCropW > photoImageW) {
	                newCropW = photoImageW;
	            }
	            if (newCropH > photoImageH) {
	                newCropH = photoImageH;
	            }

	            var resultX;
	            var resultY;
	            var resultW;
	            var resultH;
	            if (newCropW * viewRatio > newCropH) {
	                resultH = newCropH;
	                resultW = newCropH / viewRatio;
	            } else {
	                resultW = newCropW;
	                resultH = newCropW * viewRatio;
	            }

	            resultX = oldCropCenterX - resultW / 2;
	            resultX = resultX > 0 ? resultX : 0;
	            if (resultX + resultW > photoImageW) {
	                resultX = resultX - (resultX + resultW - photoImageW);
	                resultX = resultX > 0 ? resultX : 0;
	            }

	            resultY = oldCropCenterY - resultH / 2;
	            resultY = resultY > 0 ? resultY : 0;
	            if (resultY + resultH > photoImageH) {
	                resultY = resultY - (resultY + resultH - photoImageH);
	                resultY = resultY > 0 ? resultY : 0;
	            }
	            var resultCropLUX = resultX / photoImageW;
	            var resultCropLUY = resultY / photoImageH;
	            var resultCropRLX = (resultX + resultW) / photoImageW;
	            var resultCropRLY = (resultY + resultH) / photoImageH;*/

	            var newCropW = width * cropUnitsPercentX;
					var newCropH = height * cropUnitsPercentY;
					if(newCropW > photoImageW){
						newCropW = photoImageW;
					}
					if(newCropH > photoImageH){
						newCropH = photoImageH;
					}

					var resultX;
					var resultY;
					var resultW;
					var resultH;
					if(newCropW * viewRatio > newCropH){
						resultH = newCropH;
						resultW = newCropH / viewRatio;
					}else{
						resultW = newCropW;
						resultH = newCropW * viewRatio;
					}

					resultX = oldCropCenterX - resultW/2;
					resultX = resultX > 0 ? resultX : 0;
					if(resultX + resultW > photoImageW){
						resultX = resultX - (resultX + resultW - photoImageW);
						resultX = resultX > 0 ? resultX : 0;
					}

					resultY = oldCropCenterY - resultH/2;
					resultY = resultY > 0 ? resultY : 0;
					if(resultY + resultH > photoImageH){
						resultY = resultY - (resultY + resultH - photoImageH);
						resultY = resultY > 0 ? resultY : 0;
					}

	            var object = {
	                elType: currentCanvas.elements[idx].elType,
	                url: currentCanvas.elements[idx].sourceImageUrl,
	                text: currentCanvas.elements[idx].text,
	                x: OX,
	                y: OY,
	                width: W,
	                height: H,
	                rotate: ROT,
	                dep: currentCanvas.elements[idx].dep,
	                imageId: currentCanvas.elements[idx].imageId,
	                imageRotate: currentCanvas.elements[idx].imageRotate || 0,
	                cropPX: resultX / photoImageW|| 0,
	                cropPY: resultY / photoImageH|| 0,
	                cropPW: resultW / photoImageW|| 1,
	                cropPH: resultH / photoImageH|| 1,
	                fontFamily: currentCanvas.elements[idx].fontFamily || '',
	                fontSize: parseFloat(finalFontSize) || '',
	                fontWeight: currentCanvas.elements[idx].fontWeight || '',
	                textAlign: currentCanvas.elements[idx].textAlign || '',
	                fontColor: currentCanvas.elements[idx].fontColor || ''
	            };
	            return object;
	        } else {
	            return '';
	        };
	    },

	    // get final cropped image url by crop params
	    getCropImageUrl: function(idx, nPageIdx, ratio) {
	      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
	      var currentCanvas = Store.pages[nPageIdx].canvas;
	      var viewRatio = ratio ? ratio : currentCanvas.ratio;

	  		if(idx != undefined && idx != null && (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo' || currentCanvas.params[idx].elType === 'PhotoElement')) {
	  			var loadImageUrl = '../../static/img/blank.png';
	  			// var loadImageUrl = '';
	  			if(currentCanvas.params[idx].imageId !== '') {
	  				// already initialized, read old cropped image
	  				var currentElement = currentCanvas.params[idx],
	              px = Math.abs(currentElement.cropPX.toFixed(8)),
	  						py = Math.abs(currentElement.cropPY.toFixed(8)),
	  						pw = Math.abs(currentElement.cropPW.toFixed(8)),
	  						ph = Math.abs(currentElement.cropPH.toFixed(8)),
	  						width = currentElement.width * viewRatio / pw,
	  						height = currentElement.height * viewRatio / ph,
	              brightness = currentElement.style && currentElement.style.brightness ? currentElement.style.brightness : 0;

	          var UtilProject = __webpack_require__(20);
	          var encImgId = UtilProject.getEncImgId(currentCanvas.params[idx].imageId);
	          var qs = UtilProject.getQueryString({
	            encImgId: encImgId,
	            px: px,
	            py: py,
	            pw: pw,
	            ph: ph,
	            width: Math.ceil(width),
	            height: Math.ceil(height),
	            rotation: currentCanvas.params[idx].imageRotate,
	            brightness: brightness
	          });

	  				loadImageUrl = '/imgservice/op/crop?' + qs + __webpack_require__(10).getSecurityString();
	  			};

	  			return loadImageUrl;
	  		}
	      else {
	        return '';
	      };
	    },
	    getCropDecorationUrl: function(idx,nPageIdx){
	      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
	      var currentCanvas = Store.pages[nPageIdx].canvas;

	      if(idx != undefined && idx != null && (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'decoration' || currentCanvas.params[idx].elType === 'logo' || currentCanvas.params[idx].elType === 'DecorationElement')) {
	        var loadDecorationUrl = '../../static/img/blank.png';
	        // var loadDecorationUrl = '';
	        if(currentCanvas.params[idx].decorationid !== '' ) {
	          // already initialized, read old cropped image
	          // var px = currentCanvas.params[idx].cropPX,
	          //     py = currentCanvas.params[idx].cropPY,
	          //     pw = currentCanvas.params[idx].cropPW,
	          //     ph = currentCanvas.params[idx].cropPH,
	          //     width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
	          //     height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;
	          var imageGuid = currentCanvas.params[idx].decorationid;
	          loadDecorationUrl = Store.domains.baseUrl+'/artwork/png/1000/'+imageGuid+'.png';
	        };

	        return loadDecorationUrl;
	      }
	      else {
	        return '';
	      };
	    },

	    // get final font image by params
	    getFontImageUrl: function() {

	    },

	    //
	  	getShiftValue: function(currentCanvas, nPageIdx) {
	      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
	      currentCanvas = currentCanvas || Store.pages[nPageIdx].canvas;
	      // var currentCanvas = Store.pages[nPageIdx].canvas;

	  		if(Store.project2.matte !== 'none') {
	        var shiftedX = -1 * (currentCanvas.boardInMatting.left + currentCanvas.realBleedings.left);
	  			var shiftedY = -1 * (currentCanvas.boardInMatting.top + currentCanvas.realBleedings.top);
	        var shiftedXDot = -1 * (currentCanvas.boardInMatting.right + currentCanvas.realBleedings.right);
	  			var shiftedYDot = -1 * (currentCanvas.boardInMatting.bottom + currentCanvas.realBleedings.bottom);
	  		}
	  		else {
	  			// without matting
	  			var shiftedX = -1 * (currentCanvas.boardInFrame.left + currentCanvas.realBleedings.left);
	  			var shiftedY = -1 * (currentCanvas.boardInFrame.top + currentCanvas.realBleedings.top);
	        var shiftedXDot = -1 * (currentCanvas.boardInFrame.right + currentCanvas.realBleedings.right);
	  			var shiftedYDot = -1 * (currentCanvas.boardInFrame.bottom + currentCanvas.realBleedings.bottom);
	  		};

	      return {
	        x: shiftedX,
	        y: shiftedY,
	        xDot: shiftedXDot,    // shifted x, y on the other side( right , bottom)
	        yDot: shiftedYDot
	      };
	  	},

	    // get fixed positions by shifting 获取迁移坐标系新位置
	  	getShiftPosition: function(oriX, oriY, oriWidth, oriHeight, shiftX, shiftY) {
	  		if(oriX != null && oriY != null && oriWidth != null && oriHeight != null) {
	  			shiftX = shiftX || 0;
	  			shiftY = shiftY || 0;

	  			var newX = oriX + shiftX,
	  					newY = oriY + shiftY;

	  			return {
	  				x: newX,
	  				y: newY,
	  				width: oriWidth,
	  				height: oriHeight
	  			};
	  		}
	  		else {
	  			return {
	  				x: 0,
	  				y: 0,
	  				width: 0,
	  				height: 0
	  			};
	  		};
	  	},

	  	getUnshiftPosition: function(idx) {
	      if(idx != undefined && idx != null) {
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	        var shiftX = -1 * this.getShiftValue().x,
	            shiftY = -1 * this.getShiftValue().y,
	            shiftXDot = -1 * this.getShiftValue().xDot,
	            shiftYDot = -1 * this.getShiftValue().yDot;

	        var x = currentCanvas.params[idx].x || 0,
	            y = currentCanvas.params[idx].y || 0,
	            w = currentCanvas.params[idx].width || 0,
	            h = currentCanvas.params[idx].height || 0,
	            fullW = currentCanvas.oriWidth || 0,
	            fullH = currentCanvas.oriHeight || 0,
	            px, py, pw, ph;
	        //     px = parseFloat(currentCanvas.params[idx].px) || 0,
	        //     py = parseFloat(currentCanvas.params[idx].py) || 0,
	        //     pw = parseFloat(currentCanvas.params[idx].pw),
	        //     ph = parseFloat(currentCanvas.params[idx].ph);

	        // fix values
	        x += shiftX;
	        y += shiftY;
	        px = x / (fullW + shiftX + shiftXDot);
	        py = y / (fullH + shiftY + shiftYDot);
	        pw = w / (fullW + shiftX + shiftXDot);
	        ph = h / (fullH + shiftY + shiftYDot);
	        px < 0 ? px = 0 : px;
	        px > 1 ? px = 1 : px;
	        py < 0 ? py = 0 : py;
	        py > 1 ? py = 1 : py;
	        pw < 0 ? pw = 0 : pw;
	        pw > 1 ? pw = 1 : pw;
	        ph < 0 ? ph = 0 : ph;
	        ph > 1 ? ph = 1 : ph;

	        return {
	          x: x,
	          y: y,
	          px: px,
	          py: py,
	          pw: pw,
	          ph: ph
	        };
	      }
	      else {
	        console.fail('idx is invalid in getUnshiftPosition() [ParamsManage]')
	        return '';
	      };
	    },

	    getIndexById: function(id,pageIdx) {
	      var pageIdx = pageIdx || Store.selectedPageIdx;
	      if(id != undefined && id != null && id !== '') {
	        var currentCanvas = Store.pages[pageIdx].canvas;

	        for(var i = 0; i < currentCanvas.params.length; i++) {
	          if(currentCanvas.params[i].id === id) {
	            return i;
	          };
	        };

	        // loop ends and no matching
	        return -1;
	      }
	      else {
	        // wrong
	        return -1;
	      };
	    },

	    getIndexByDep: function(dep) {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      for(var i = 0; i < currentCanvas.params.length; i++) {
	        if(currentCanvas.params[i].dep === dep) {
	          return i;
	        };
	      };

	      return 0;
	    },

	    getFrontElementIndex: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      // for the front element, it's depth is the same with params count - 1
	      return this.getIndexByDep(currentCanvas.params.length - 1);
	    },

	    // NOTE: this function provides VIEW size, only valid for marketplace seller flow product for now
	    getBorderHiddenSize: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      var leftLimit = topLimit = rightLimit = bottomLimit = 0;

	      if(Store.isCanvas) {
	        // canvas
	        leftLimit = (currentCanvas.canvasBordeThickness.left + currentCanvas.realBleedings.left) * currentCanvas.ratio;
	        rightLimit = (currentCanvas.canvasBordeThickness.right + currentCanvas.realBleedings.right) * currentCanvas.ratio;
	        topLimit = (currentCanvas.canvasBordeThickness.top + currentCanvas.realBleedings.top) * currentCanvas.ratio;
	        bottomLimit = (currentCanvas.canvasBordeThickness.bottom + currentCanvas.realBleedings.bottom) * currentCanvas.ratio;
	      }
	      else {
	        // frame
	        var frameBoardWidth = currentCanvas.frameBaseSize.width * currentCanvas.ratio,    // board的宽度
	            frameBoardHeight = currentCanvas.frameBaseSize.height * currentCanvas.ratio,
	            frameLeft = Math.abs(currentCanvas.x),    // 照片板超出board的左部的尺寸
	            frameTop = Math.abs(currentCanvas.y);

	        // prepare leftLimit, rightLimit
	        if(currentCanvas.width > frameBoardWidth) {
	          // photoLayer比较大
	          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
	            // 有matte的情况
	            leftLimit = frameLeft + currentCanvas.boardInMatting.left * currentCanvas.ratio;
	            rightLimit = currentCanvas.width - frameBoardWidth - frameLeft + currentCanvas.boardInMatting.right * currentCanvas.ratio;
	          }
	          else {
	            // 没matte的情况
	            leftLimit = frameLeft + currentCanvas.boardInFrame.left * currentCanvas.ratio;
	            rightLimit = currentCanvas.width - frameBoardWidth - frameLeft + currentCanvas.boardInFrame.right * currentCanvas.ratio;
	          };
	        }
	        else {
	          // frameBoard比较大
	          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
	            // 有matte的情况
	            leftLimit = currentCanvas.boardInMatting.left * currentCanvas.ratio + currentCanvas.realBleedings.left * currentCanvas.ratio;
	            rightLimit = currentCanvas.boardInMatting.right * currentCanvas.ratio + currentCanvas.realBleedings.right * currentCanvas.ratio;
	          }
	          else {
	            // 没matte的情况
	            leftLimit = currentCanvas.boardInFrame.left * currentCanvas.ratio + currentCanvas.realBleedings.left * currentCanvas.ratio;
	            rightLimit = currentCanvas.boardInFrame.right * currentCanvas.ratio + currentCanvas.realBleedings.right * currentCanvas.ratio;
	          };
	        };

	        // prepare topLimit, bottomLimit
	        if(currentCanvas.height > frameBoardHeight) {
	          // photoLayer比较大
	          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
	            // 有matte的情况
	            topLimit = frameTop + currentCanvas.boardInMatting.top * currentCanvas.ratio;
	            bottomLimit = currentCanvas.height - frameBoardHeight - frameTop + currentCanvas.boardInMatting.bottom * currentCanvas.ratio;
	          }
	          else {
	            // 没matte的情况
	            topLimit = frameTop + currentCanvas.boardInFrame.top * currentCanvas.ratio;
	            bottomLimit = currentCanvas.height - frameBoardHeight - frameTop + currentCanvas.boardInFrame.bottom * currentCanvas.ratio;
	          };
	        }
	        else {
	          // frameBoard比较大
	          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
	            // 有matte的情况
	            topLimit = currentCanvas.boardInMatting.top * currentCanvas.ratio + currentCanvas.realBleedings.top * currentCanvas.ratio;
	            bottomLimit = currentCanvas.boardInMatting.bottom * currentCanvas.ratio + currentCanvas.realBleedings.bottom * currentCanvas.ratio;
	          }
	          else {
	            // 没matte的情况
	            topLimit = currentCanvas.boardInFrame.top * currentCanvas.ratio + currentCanvas.realBleedings.top * currentCanvas.ratio;
	            bottomLimit = currentCanvas.boardInFrame.bottom * currentCanvas.ratio + currentCanvas.realBleedings.bottom * currentCanvas.ratio;
	          };
	        };
	      };

	      return {
	        left: leftLimit,
	        top: topLimit,
	        right: rightLimit,
	        bottom: bottomLimit
	      };
	    },
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var UtilMath = __webpack_require__(7);
	var ImageListManage = __webpack_require__(26);
	var ParamsManage = __webpack_require__(27);
	var SpecController = __webpack_require__(24);

	module.exports = {
		createElement : function(idx){
			this.initElement(idx);
		},
		editElement : function(idx){
			this.deleteElement(idx);
			this.initElement(idx);
		},
		deleteElement : function(idx){
			// console.log('delete warn', idx);
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			if(currentCanvas.warns[idx]){
			 currentCanvas.warns[idx].el && currentCanvas.warns[idx].el.remove();
			 currentCanvas.warns[idx].el = '';
			}
			// this.showBeforeElements();
		},
		initElement : function(idx){
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
			 	warnTipUrl = '../../static/img/warn_big_icon.png',
			 	params = __webpack_require__(27).getParamsValueByElement(idx);

			currentCanvas.warns[idx].isActive = true;
			currentCanvas.warns[idx].el = currentCanvas.paper.image(warnTipUrl, params.x * currentCanvas.ratio + 5, (params.y + params.height) * currentCanvas.ratio - 15,Store.warnSettings.warnImageWidth,Store.warnSettings.warnImageHeight);
			currentCanvas.warns[idx].el.node.id = 'warn-tip-' + idx;
			var title = document.createElementNS("http://www.w3.org/2000/svg","title"),
				text = document.createTextNode(Store.warnSettings.resizeWarnMsg);
			title.appendChild(text);
			document.getElementById('warn-tip-' + idx).appendChild(title);
		},
		showBeforeElements : function(){
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,warns = currentCanvas.warns;
			warns.map(function(warn){
				warn.el && warn.el.toFront();
			})
		},
		refreshLaterTips : function(idx){
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			for(var i=idx,l=currentCanvas.warns.length;i<l;i++){
				if(currentCanvas.warns[i] && currentCanvas.warns[i].isActive){
					currentCanvas.warns[i].el.node.id = 'warn-tip-' + i;
					// this.deleteElement(i);
					// this.initElement(i);
				}
			}
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {

	var UtilMath = __webpack_require__(7);
	var CanvasController = __webpack_require__(25);
	// controller -- text
	module.exports = {

		createText: function(oData) {
			var _this = this;

			if(oData) {
				// prepare text image width and height
				var fontViewSize = Math.round(UtilMath.getTextViewFontSize(oData.fontSize));
				if(fontViewSize > 0) {
				  // valid text size
				  var img = new Image();
				  if(oData.text === '') {
				    img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
				  }
				  else {
				    img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(oData.text)+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
				  };

				  if(img.complete) {
				    _this.addTextInParams(oData, img.width, img.height);
				    return;
				  }
				  img.onload = function () {
				    _this.addTextInParams(oData, img.width, img.height);
				  };
				}
				else {
				  // invalid text size
				  // NOTE: we create a very small size text image for text which cannot display on screen(to keep an element in canvas anyhow)
				  _this.addTextInParams(oData, 1, 1);
				};


			};
		},

		editText: function(oData, idx) {
			var _this = this;

			if(oData && idx != undefined && idx != null) {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      var fontViewSize = Math.round(UtilMath.getTextViewFontSize(oData.fontSize));
	      if(fontViewSize > 0) {
	        // valid text size
	        var img = new Image();
	        if(oData.text === '') {
	          img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
	        }
	        else {
	          img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(oData.text)+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
	        };

	        if(img.complete) {
	          _this.changeTextInParams(oData, img.width, img.height, idx);
	          return;
	        }
	        img.onload = function () {
	          _this.changeTextInParams(oData, img.width, img.height, idx);
	        };
	      }
	      else {
	        // invalid text size
	        // NOTE: we create a very small size text image for text which cannot display on screen(to keep an element in canvas anyhow)
	        _this.changeTextInParams(oData, 1, 1, idx);
	      };
			};

		},

		deleteText: function(idx) {
			if(idx != undefined && idx != null) {
				this.removeTextFromParams(idx);
				Store.vm.$broadcast('notifyRefreshScreenshot');
			};
		},

		// update params
		addTextInParams: function(oData, nImageWidth, nImageHeight) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			var element_index = currentCanvas.params.length;

			oData.width = nImageWidth / currentCanvas.ratio;
			oData.height = nImageHeight  / currentCanvas.ratio;
			oData.dep = element_index;

			currentCanvas.params.push(oData);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.push(oData);
			// };

			// NOTE: for item which last added, its' index is the same with depth
			this.createTextElement(element_index);
		},

		changeTextInParams: function(oData, nImageWidth, nImageHeight, idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			oData.width = nImageWidth  / currentCanvas.ratio;
			oData.height = nImageHeight  / currentCanvas.ratio;

			currentCanvas.params.splice(idx, 1, oData);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.splice(idx, 1, oData);
			// };

			// NOTE: for item which last added, its' index is the same with depth
			this.editTextElement(idx);
		},

		removeTextFromParams: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// fresh depth
			CanvasController.freshDepth(idx);
			
			currentCanvas.params.splice(idx, 1);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.splice(idx, 1);
			// };

			this.deleteTextElement(idx);
		},

		// create text element in canvas
		createTextElement: function(idx) {
			var _this = this;
			CanvasController.createElement(idx, _this);
	    CanvasController.spineLinesToTop();
		},

		editTextElement: function(idx) {
			var _this = this;
			CanvasController.editElement(idx, _this);
	    CanvasController.spineLinesToTop();
		},

		deleteTextElement: function(idx) {
			var _this = this;
			CanvasController.deleteElement(idx, _this);
	    CanvasController.spineLinesToTop();
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	var CanvasController = __webpack_require__(25);
	// controller -- image
	module.exports = {

		createImage: function(oData) {
			if(oData) {
				this.addImageInParams(oData);
			};
		},

		editImage: function(oData, idx) {
			if(oData && idx != undefined && idx != null) {
	      this.changeImageInParams(oData, idx);
			};

		},

		deleteImage: function(idx) {
			if(idx != undefined && idx != null) {
				this.removeImageFromParams(idx);
				Store.vm.$broadcast('notifyRefreshScreenshot');
			};
		},

		// update params
		addImageInParams: function(oData) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			var element_index = currentCanvas.params.length;

			currentCanvas.params.push(oData);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;
			// 	var element_index = currentCanvas.params.length;

			// 	currentCanvas.params.push(oData);
			// };

			// NOTE: for item which last added, its' index is the same with depth
			this.createImageElement(element_index);
		},

		changeImageInParams: function(oData, idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			currentCanvas.params.splice(idx, 1, oData);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.splice(idx, 1, oData);
			// };

			// NOTE: for item which last added, its' index is the same with depth
			this.editImageElement(idx);
		},

		removeImageFromParams: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			// fresh depth
			CanvasController.freshDepth(idx);

			currentCanvas.params.splice(idx, 1);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.splice(idx, 1);
			// };

			this.deleteImageElement(idx);
		},

		// create image element in canvas
		createImageElement: function(idx) {
			CanvasController.createElement(idx);
	    CanvasController.spineLinesToTop();
		},

		editImageElement: function(idx) {
			CanvasController.editElement(idx);
	    CanvasController.spineLinesToTop();
		},

		deleteImageElement: function(idx) {
			CanvasController.deleteElement(idx);
	    CanvasController.spineLinesToTop();
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = {
	    mixins: [
	        __webpack_require__(9)
	    ],
	    // template: '#t-header',
	    // fit for IE10, IE11, <template> not supported in html, thus put it here
	    template: '<div class="bed-header" v-on:click="blurFocus">' +
	        '<div style="display: inline-block; height: 50px;">' +
	        '<div id="logo" v-on:click="handleLogoClicked()" style="margin-left: 40px;float: left;cursor: pointer;width:100px;" title="Home"><img src="../../static/img/new-logo.svg" height="15" draggable="false" alt="Logo" style="margin: 20px 20px 10px 0;" /></div>' +
	        '<pre class="box-title" style="float: left;">' +
	        '{{ sharedStore.title }}' +
	        '</pre>' +
	        '</div>' +
	        '<div style="float: right; height: 48px;margin-top: 2px;">' +
	        '<span class="menu-item" v-on:click="handleOptions()" style="height: 48px;line-height: 48px;margin-right: 40px;">Options</span>' +
	        /*'<span class="menu-item" v-on:click="handleDownloadSpec()" style="height: 48px;line-height: 48px;margin-right: 40px;">Spec</span>' +
	        '<span class="menu-item" v-on:click="handleHelp()" style="height: 48px;line-height: 48px;margin-right: 40px;">Help</span>' +*/
	        '<span class="menu-item" v-on:click="handlePreview()" style="height: 48px;line-height: 48px;margin-right: 40px;">Preview</span>' +
	        '<span v-show="!sharedStore.fromCart" id="saveButton" class="menu-item" v-on:click="handleSave()" style="height: 48px;line-height: 48px;margin-right: 40px;">Save</span>' +
	        '<span id="orderButton" class="menu-item" v-on:click="handleOrder()" style="height: 48px;line-height: 48px;margin-right: 40px;">{{orderLabel}}</span>' +
	        '</div>' +
	        '<div v-on:click="handleHideHelp()" v-show="sharedStore.isShowHelp" style="position: fixed;width: 100%;height: 100%;top: 0px;" v-bind:style="{zIndex: windowZindex-2}"></div>'+
	        /*'<div class="help-popup" v-show="sharedStore.isShowHelp" v-bind:style="{zIndex: windowZindex-1}">' +
	        '<span class="poptip-arrow-top" style="left:50%;"><em class="poptip-arrow-top-em">◆</em><i class="poptip-arrow-top-i">◆</i></span>' +
	        '<div class="help-item" v-on:click="handleFAQ()">FAQ</div>' +
	        '<div class="help-item" style="margin-top: 0px;" v-on:click="handleContactUs()">Contact Us</div>' +

	        '</div>' +*/
	        '</div>',
	    data: function() {
	        return {
	            privateStore: {},
	            sharedStore: Store
	        };
	    },
	    computed: {

	        // product text, e.g.  Image Box
	        productText: function() {
	            switch (this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product) {
	                case 'TS':
	                    return 'T-Shirt';
	                default:
	                    return '[ERR PRODUCT]';
	            };
	        },
	        orderLabel: function() {
	            if (this.sharedStore.fromCart||this.sharedStore.checkFailed) {
	                return 'Submit';
	            } else {
	                return 'Order';
	            }
	        },
	        windowZindex: function() {
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	                    elementTotal = currentCanvas.params.length || 0;

	            return (elementTotal + 10) * 100;
	        },
	    },
	    methods: {
	        handleFAQ: function() {
	            window.open("/support.html#/Software", "_blank");
	            this.sharedStore.isShowHelp = false;
	        },
	        handleContactUs: function() {
	            this.$dispatch('dispatchShowContactUsWindow');
	            this.sharedStore.isShowHelp = false;
	        },
	        handleHelp: function() {
	            this.sharedStore.isShowHelp = !this.sharedStore.isShowHelp;
	        },
	        handleDownloadSpec: function() {
	        	Store.isPopSave=false;
	            window.open("assets/data/14X16SPEC_TS.zip", "_parent");
	        },
	        handleLogoClicked: function() {
	            this.$dispatch("dispatchShowPopup", { type: 'logo', status: -1 });
	        },

	        // handle preview
	        handlePreview: function() {
	            var _this = this;
	            if(__webpack_require__(20).getIsShowProjectInfoView()){
	                // Store.isPopSave=false;
	                // var url = "preview.html?initGuid=" + Store.projectId + "&isPreview=true";
	                // var a = document.createElement('a');
	                // a.setAttribute('href', url);
	                // a.setAttribute('target', '_blank');
	                // a.setAttribute('id', 'preview_a');
	                // if (!document.getElementById('preview_a')) {
	                //     document.body.appendChild(a);
	                // }
	                // a.click();
	                Store.isInnerPreviewShow = true;
	            }else{
	                __webpack_require__(23).handledSaveOldProject(this, 'dispatchPreviewSave');
	            }
	            __webpack_require__(11)({ev: __webpack_require__(13).ClickPreview});
	        },

	        // handle save data
	        handleSave: function(isNew, isRedirect, isDisableMsg) {
	            var _this = this;
	            if(__webpack_require__(20).getIsShowProjectInfoView()){
	                var text=__webpack_require__(20).getProjectInfoViewText();
	                this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});

	            }else{
	                __webpack_require__(23).saveOldProject(_this,__webpack_require__(9).deleteImageList);
	            }
	            __webpack_require__(11)({ev: __webpack_require__(13).ClickSave});
	        },

	        // handle order(add to cart)
	        handleOrder: function() {
	            if(Store.checkFailed){
	                 __webpack_require__(23).saveOldProject(_this,function(){
	                    __webpack_require__(9).updateCheckStatus();
	                });
	            }else{
	                if(__webpack_require__(20).getIsShowProjectInfoView()){
	                    var text=__webpack_require__(20).getProjectInfoViewText();
	                    this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});
	                }else{
	                    this.$dispatch('dispatchShowOrderWindow');
	                }
	            }
	        },

	        handleOptions: function() {
	            this.$dispatch('dispatchShowOptionWindow');
	        },
	        handleHideHelp:function(){
	            this.sharedStore.isShowHelp = false;
	        },

	        blurFocus: function() {
	          this.$dispatch('dispatchClearScreen');
	          // this.sharedStore.isLostFocus = true;
	        },
	    },
	    events: {
	        notifyPreviewSave: function(result) {
	            console.log("save-" + result);
	            if (result === "success") {
	                //window.open("preview.html?initGuid=" + Store.projectId + "&isPreview=true", "_blank");
	                // Store.isPopSave=false;
	                // var url = "preview.html?initGuid=" + Store.projectId + "&isPreview=true";
	                // var a = document.createElement('a');
	                // a.setAttribute('href', url);
	                // a.setAttribute('target', '_blank');
	                // a.setAttribute('id', 'preview_a');
	                // if (!document.getElementById('preview_a')) {
	                //     document.body.appendChild(a);
	                // }
	                // a.click();
	                Store.isInnerPreviewShow = true;
	            } else {
	                this.$dispatch('dispatchShowPopup', { type: 'save', status: -1 });
	            }

	        },
	        notifyResetProjectInfo:function(isShow){
	            if(isShow){
	                $('#saveButton').css('pointer-events','auto');
	                $('#saveButton').css('opacity',1);
	                $('#orderButton').css('pointer-events','auto');
	                $('#orderButton').css('opacity',1);
	            }else{
	                $('#saveButton').css('pointer-events','none');
	                $('#saveButton').css('opacity',0.4);
	                $('#orderButton').css('pointer-events','none');
	                $('#orderButton').css('opacity',0.4);
	            }

	        }
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {// component -- CompImageUpload
	module.exports = {
		// template: '#t-image-upload',
		template: '<div class="bed-image-upload" v-show="sharedStore.isImageUploadShow">' +
		 // v-show="sharedStore.isImageUploadShow
								'<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
								'<div class="box-image-upload" v-bind:style="{ zIndex: windowZindex }" style="width:655px;height:480px;">' +
									'<div style="height: 40px:line-height: 40px;">' +
										// '<div v-on:click="hideImageUpload()" style="width: 40px;height: 40px;line-height: 40px;margin-left: 585px;font-size: 20px;text-align: center;cursor: pointer;" title="close"><i class="fa fa-close"></i></div>' +
										'<div style="width: 40px;height: 40px;margin-left: 600px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideImageUpload(true)" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 14px; cursor: pointer;" /></div>' +
									'</div>' +
									'<div style="margin: 0 40px;position:relative;">' +
										'<div class="font-title t-left">Upload Images</div>' +
										'<div v-show="isWarnMessageShow && !(sharedStore.maxPageNum && !sharedStore.isUploading)" class="font-light" style="position:absolute;top: 33px;font-size:12px;color:#de3418;">{{warnMessage}}</div>'+
									'</div>' +
									'<div style="margin: 30px 40px 0;">' +
										'<div class="upload-row-title">' +
											'<span class="upload-status-head">File</span>' +
											'<span class="upload-status-sub">File Progress</span>' +
										'</div>' +
									'</div>' +
									'<div id="box-upload-list" style="margin: 0 20px 0 40px;height: 230px; overflow: auto;position:relative;">' +
									// '<div id="box-upload-list" style="margin: 0 40px;height: 220px; overflow-y: scroll;">' +
									'</div>' +
									'<div style="margin: 24px 40px;height:40px;position:relative;">' +
										'<div style="float:left;line-height:38px;">'+
											'<span class="font-normal" style="font-size:12px;color:#7B7B7B;">{{sharedStore.successfullyUploaded}} Complete</span>' +
											'<span style="margin-left: 15px;color:#de3418;font-size:12px;" v-show="sharedStore.errorUploaded">{{sharedStore.errorUploaded}} Failed</span>' +
										'</div>'+
										'<div v-show="sharedStore.maxPageNum && !sharedStore.isUploading && sharedStore.maxPageNum > sharedStore.pages.length" style="position:absolute;right:1px;top:-30px;background-color:#3a3a3a;color:#fff;font-size:12px;padding:4px 10px;box-shadow:0 2px 4px 0 rgba(0,0,0,.13);">'+
											'{{remainTip}}'+
											'<div style="position:absolute;width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:5px solid #3a3a3a;left:78%;bottom:-5px;transform:translateX(-50%);"></div>'+
										'</div>'+
										'<div style="float:right;">' +
											'<div class="button-white t-center" :style="addMoreStyle" v-on:click="handleUploadClick(true)" style="width: 160px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">Add More Photos</div>' +
											// '<div class="button t-center" v-on:click="handleSaveAndHideUpload()" style="width: 160px;height: 40px;line-height: 40px;margin-left: 23px;display: inline-block;font-size: 14px;">Cancel All</div>' +
										'</div>' +
										'<input type="file" name="" id="multi-files" multiple accept="{{sharedStore.uploadAcceptType}}" v-on:change="handleDoUpload()" style="display: none;" />' +
										'<input type="file" name="" id="single-files"  accept="image/*" v-on:change="handleDoUpload()" style="display: none;" />' +
										// '<input type="file" name="" id="single-files" multiple accept="{{sharedStore.uploadAcceptType}}" v-on:change="handleDoUpload()" style="display: none;" />' +

									'</div>' +
								'</div>' +
							'</div>',
		data: function() {
			return {
				privateStore: {
					els: '',
					uploadWindowParams: {
						width: 655,
						height: 480,
						selector: '.box-image-upload'
					},
					uploadParams: {
						fileSelector: '#multi-files'
					},
					firstUpload : false,
					single : null
				},
				sharedStore: Store,
				isWarnMessageShow: false
			};
		},
		computed: {
			windowZindex: function() {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						elementTotal = currentCanvas.params.length || 0;

				return (elementTotal + 10) * 100;
			},
			warnMessage: function(){
				return 'You can only upload '+ Store.maxPageNum +' images per pack in total.';
			},
			remainTip: function() {
				return 'Still need to upload '+ (Store.maxPageNum - Store.pages.length) +' photo(s), click here to continue';
			},
			addMoreStyle: function() {
				var isDisabled = this.sharedStore.maxPageNum && (this.sharedStore.isUploading || this.sharedStore.maxPageNum <= this.sharedStore.pages.length)
				return {
					color: isDisabled ? '#ccc' : '#000',
					borderColor: isDisabled ? '#ccc' : 'rgba(203, 203, 203, 1)',
					cursor: isDisabled ? 'not-allowed' : 'pointer'
				}
			}
		},
		methods: {

			// show image upload box
			showImageUpload: function() {
				var UtilWindow = __webpack_require__(34);

				UtilWindow.setPopWindowPosition(this.privateStore.uploadWindowParams);
				this.sharedStore.isImageUploadShow = true;
			},

			// do hiding image upload box
			hideImageUpload: function(isFromCancel, isAutoHide) {
				if(!isFromCancel){
					Store.cancelByX = true;
				}
				if(this.sharedStore.filesCountInQueue+this.sharedStore.errorExt >= this.sharedStore.filesTotalInQueue) {
					// all files uploaded
					$(this.privateStore.uploadParams.fileSelector).val('');
					this.sharedStore.isImageUploadShow = false;
					Store.isUploading = false;
					if(isFromCancel){
						__webpack_require__(11)({ev: __webpack_require__(13).CloseMonitor,auto: !!isAutoHide});
					}
				}
				else {
					this.$dispatch("dispatchShowPopup", { type: 'cancelUpload', status: -1 });
					// // files not uploaded yet
					// if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
					// 	// for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
					// 	// 	if(this.sharedStore.uploadProgress!=='Done'){
					// 	// 		this.cancelItem(i);
					// 	// 	}
					// 	// }
					// 	this.sharedStore.isImageUploadShow = false;
					// 	return true;
					// }
					// else {
					// 	return false;
					// };
				};
				this.isWarnMessageShow = false;
			},

			// handle upload button click
			handleUploadClick: function(noClear,isSingle) {
				if(this.sharedStore.maxPageNum && (this.sharedStore.isUploading || (this.sharedStore.maxPageNum <= this.sharedStore.pages.length) &&　!(typeof(Store.watchData.replacePageId) == "number")))return;
				// if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
					// reset trush DOM at first

					if(!noClear){
						this.resetImageUploadDom();
						Store.uploadProgress.length = 0;
						Store.successfullyUploaded = 0;
						Store.errorUploaded = 0;
						Store.cancelledUpload.length = 0;
						Store.oriImageIds = [];
						Store.oriImageNames = [];
						Store.currentUploadCount = 0;
						Store.filesTotal = 0;
						Store.prevFilesTotal = [];
						Store.prevFilesTotal = 0;
						Store.filesTotalInQueue = 0;
						Store.filesCountInQueue = 0;
					}else{
						__webpack_require__(11)({ev: __webpack_require__(13).AddMorePhotos});
					}
					Store.currentSuccessUpload = 0;
					Store.currentErrorUpload = 0;
					Store.errorExt = 0;
					$(this.privateStore.uploadParams.fileSelector).val('');
					if(isSingle || this.privateStore.single){
						this.privateStore.uploadParams.fileSelector = "#single-files";
						$('#single-files').trigger('click');
						// this.privateStore.single = true;
					}else{
						this.privateStore.uploadParams.fileSelector = "#multi-files";
						$('#multi-files').trigger('click');
					}
				// }
				// else {
				// 	this.$dispatch("dispatchShowPopup", { type : 'upload', status : -1})
				// };

			},

			handleDoUpload: function() {
				var UploadService = __webpack_require__(35),
					files = document.querySelector(this.privateStore.uploadParams.fileSelector).files;
				if(files.length){
					// 如果产品有最大张数张数限制的时候， 显示已经移除多余文件的提示语。
					if(Store.maxPageNum && (Store.pages.length + files.length > Store.maxPageNum) &&　!(typeof(Store.watchData.replacePageId) == "number")) {
							this.isWarnMessageShow = true;
					}

					__webpack_require__(11)({ev: __webpack_require__(13).FinishPhotoSelect,chooseTimes:++Store.chooseTimes,chooseCount:files.length});
					if(this.privateStore.firstUpload){
						UploadService(this, this.privateStore.uploadParams,true);
						this.privatedStore.firstUpload = false;
					}else{
						UploadService(this, this.privateStore.uploadParams);
					}
					this.sharedStore.startUploadTime = new Date();
					__webpack_require__(11)({ev: __webpack_require__(13).StartUpload,uploadCount:files.length});
					this.sharedStore.isUploading = true;
				}
				this.showImageUpload();
			},

			// handle save and hide upload box
			handleSaveAndHideUpload: function(isAutoHide) {
				if(this.sharedStore.filesCountInQueue >= this.sharedStore.filesTotalInQueue) {
					// all files uploaded
					//TODO:
					this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

					if(this.sharedStore.maxPageNum && this.sharedStore.pages.length < this.sharedStore.maxPageNum){
						return;
					}

					this.hideImageUpload(true, isAutoHide);

					Store.cancelByX = false;

					// Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");

					Store.isLostFocus = true;
					setTimeout(function(){
							Store.watchData.replacePageId = null;
					})
				}
				else {
					// files not uploaded yet
					// if(window.confirm('Undeliveried images will be lost if you stop uploading, would you like to continue?')) {
					// 	this.sharedStore.filesTotalInQueue = 0;
					// 	this.sharedStore.filesCountInQueue = 0;
					// 	// TODO:
					// 	this.$dispatch('dispatchSaveProject', true);	// isDisableMsg

					// 	this.hideImageUpload(true);
					// 	return true;
					// }
					// else {
					// 	return false;
					// };
					Store.vm.$broadcast("notifyShowPopup",{type:"cancelUpload",status:-1});
				};
			},

			refreshImageUploadDom : function(){
				$("#box-upload-list").find(".new-add-upload-row").remove();
				for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
					if(!this.sharedStore.uploadProgress[i] || !this.sharedStore.uploadProgress[i].percent){
						continue;
					}
					this.initImageUploadDom(i,this.getImageName(this.sharedStore.uploadProgress[i].imgId));
					if(this.sharedStore.uploadProgress[i].percent==="Done"){
						$("#delete-"+i).hide();
					}
					if(this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0 || (this.sharedStore.uploadProgress[i].info && this.sharedStore.uploadProgress[i].info.toString().indexOf("Failed")>=0)){
						$('#retry-'+i).show();
						$('#progress-c-'+i).hide();
						$("#delete-"+i).hide();
						$("#status-"+i).css("width","310")
					}
				}
			},
			getImageName : function(imgId){
				for(var i=0;i<Store.oriImageNames.length;i++){
					var item = Store.oriImageNames[i];
					if(item.imgId===imgId){
						return item.filename;
					}
				}
			},
			// init image upload dom
			initImageUploadDom: function(idx, sFileName) {
				var displayFileName = sFileName;
				// remove subfix
				// displayFileName = displayFileName.substr(0, displayFileName.length - 4);

				if(displayFileName.length > 15) {
					displayFileName = displayFileName.substr(0, 12) + '...' + displayFileName.substr(displayFileName.length - 3);
				};

				if(idx < 5) {
					// use old inited dom
					$('#upload-row-item-' + idx + ' .upload-status-head').text(displayFileName).attr('title', sFileName);

					var statusCont = '<span id="progress-c-'+idx+'" style="display: inline-block;position:relative;vertical-align:middle; top: 0; left: 10px;width: 341px;height: 10px; border-radius: 5px; background-color: white;">' +
															'<span id="progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
														'</span>' +
														'<span id="status-'+ idx +'" style="position: relative;vertical-align: middle; left: 26px;display:inline-block;;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">0%</span>'+
														'<span id="error-tip-'+idx+'"></span>'+
														'<div style="display:none;position:absolute;right:7px;top:0;text-decoration:none;color:#de3418;" class="upload-retry" id="retry-'+idx+'">Failed</div>';
														// '<img src="../../static/img/close-normal.svg" width="10" height="10" alt="Delete" title="Delete" style="margin-top: 24px;margin-left: 25px;cursor: pointer;position:absolute;top:-10px;right:7px;" class="cancel-progress" id="delete-'+idx+'">';
					$('#upload-row-item-' + idx + ' .upload-status-sub').html(statusCont);
				}
				else {
					// append new dom
					var uploadStatusCont =	'<div class="upload-row-item new-add-upload-row" style="overflow:hidden;" id="upload-row-item-'+ idx +'">' +
																		'<span class="upload-status-head" style="float:left;display:inherit;" title="'+ sFileName +'">'+ displayFileName +'</span>' +
																		'<span class="upload-status-sub" style="position:relative;">' +
																			'<span id="progress-c-'+idx+'" style="display: inline-block;vertical-align:middle;position:relative; top: 0; left: 10px;width: 341px;height: 10px; border-radius: 5px; background-color: white;">' +
																				'<span id="progress-'+ idx +'" style="display: inline-block;width: 1px; height: 10px; border-radius: 5px; background-color: #ccc;">&nbsp;</span>' +
																			'</span>' +
																			'<span id="status-'+ idx +'" style="position: relative;vertical-align: middle; left: 26px;display:inline-block;;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">0%</span>' +
																			'<span id="error-tip-'+idx+'"></span>'+
																			'<div style="display:none;position:absolute;right:7px;top:0;text-decoration:none;color:#de3418;" class="upload-retry" id="retry-'+idx+'">Failed</div>'+
																			// '<img src="../../static/img/close-normal.svg" class="cancel-progress" width="10" height="10" alt="Delete" title="Delete" style="margin-top: 24px;margin-left: 25px;cursor: pointer;position:absolute;top:-10px;right:7px;" id="delete-'+idx+'">' +
																		'</span>' +
																	'</div>';
					$('#box-upload-list').append(uploadStatusCont);
				};
			},

			// reset image upload dom
			resetImageUploadDom: function() {
				var cont = '';

				for(var i = 0; i < 5; i++) {
					cont += '<div class="upload-row-item" style="overflow:hidden;" id="upload-row-item-'+ i +'">' +
										'<span class="upload-status-head" style="float:left;display:inherit;">&nbsp</span>' +
										'<span class="upload-status-sub" style="position:relative;">' +
											'&nbsp' +
										'</span>' +
									'</div>';
				};

				$('#box-upload-list').html(cont);

				// clear trash files
				$('#multi-files').val('');

				// reset files count
				this.sharedStore.filesTotalInQueue = 0;
				this.sharedStore.filesCountInQueue = 0;
			},

			// update progress
			updateUploadProgress: function() {
				for(var i = 0; i < this.sharedStore.uploadProgress.length; i++) {
					if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent === 'Done') {
						$('#status-' + i).text('Done').css('color','#7a7a7a');
						$('#progress-' + i).css('width', 341).css('background-color', '#393939').attr('title', '');
						// if(["PR","PO","CLO"].indexOf(Store.projectType)<0){
						if(["PR","CLO","flushMountPrint", "LSC"].indexOf(Store.projectType)<0){

							if(Store.pages && Store.pages[Store.selectedPageIdx].canvas){
								var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
								if( currentCanvas.params.length && currentCanvas.params[currentCanvas.selectedIdx] && currentCanvas.params[currentCanvas.selectedIdx].elType ==="image" && currentCanvas.params[currentCanvas.selectedIdx].imageId===''){
									this.$dispatch('dispatchSingleImageUploadComplete',Store.oriImageIds[i]);
								}
								if(Store.projectType === 'CR'){
									var photoElementCount = 0;
									var imageid = '';
									var indexId = 0;
									// 获取当前页的 photoElement数量 和 imageid
									for(var j =0; j < currentCanvas.params.length;j++){
										if (currentCanvas.params[j].elType === 'image') {
											photoElementCount ++;
											imageid = currentCanvas.params[j].imageId;
											indexId=currentCanvas.params[j].id;
										};
									}
									if(photoElementCount === 1 && !imageid){
										currentCanvas.selectedIdx=indexId;
										this.$dispatch('dispatchSingleImageUploadComplete',Store.oriImageIds[i]);
									}
								}
							}
						}

						if(this.sharedStore.uploadProgress[i].successUploadAt === 0) {
							this.sharedStore.uploadProgress[i].successUploadAt = new Date().getTime();
							this.trackPhotoFinishUpload(this.sharedStore.uploadProgress[i]);
						}
					}
					else if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent === 'Error') {
						$('#status-' + i).text('Error').css('color','#7a7a7a');
						$('#progress-' + i).css('width', 341).css('background-color', '#de3418').attr('title', this.sharedStore.uploadProgress[i].info);
					}
					else if(this.sharedStore.uploadProgress[i]){
						if(this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0 || (this.sharedStore.uploadProgress[i].info && this.sharedStore.uploadProgress[i].info.toString().indexOf("Failed")>=0)){
							$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent).css('color','#de3418').css("width","310").css('left','10px').css('font-size','12px').css('font-style','italic').attr('title', this.sharedStore.uploadProgress[i].info);
							// $('#progress-' + i).css('width', 341).css('background-color','#de3418').attr('title', this.sharedStore.uploadProgress[i].info);
						}else{
							if(this.sharedStore.uploadProgress[i].startUploadAt === 0) {
								this.sharedStore.uploadProgress[i].startUploadAt = new Date().getTime();
								this.trackPhotoStartUpload(this.sharedStore.uploadProgress[i]);
							}
							$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent + '%').css('color','#7a7a7a');;
							$('#progress-' + i).css('width', this.sharedStore.uploadProgress[i].percent * 3.41).css('background-color', '#ccc');
						}
					}
					// else if(this.sharedStore.uploadProgress[i] && this.sharedStore.uploadProgress[i].percent.toString().indexOf("Only")>=0) {
					// 	$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent).css('color','#de3418').css("width","310").css('left','10px').css('font-size','12px').css('font-style','italic').attr('title', this.sharedStore.uploadProgress[i].info);
					// 	$('#progress-' + i).css('width', 341).css('background-color','#de3418').attr('title', this.sharedStore.uploadProgress[i].info);

					// }
					// else if(this.sharedStore.uploadProgress[i]) {
					// 	$('#status-' + i).text(this.sharedStore.uploadProgress[i].percent + '%').css('color','#7a7a7a');;
					// 	$('#progress-' + i).css('width', this.sharedStore.uploadProgress[i].percent * 3.41).css('background-color', '#ccc');
					// };
				};
			},
			trackPhotoStartUpload: function(uploadProgress) {
				var photoName = uploadProgress.file.name;
				var photoSize = uploadProgress.file.size;
				var startUploadAt = uploadProgress.startUploadAt;
				var product = '';

				if(Store.projectSettings.length) {
					product = Store.projectSettings[0].product;
				} else {
					product = Store.baseProject && Store.baseProject.product;
				}

				__webpack_require__(11)({
					ev: __webpack_require__(13).StartUploadEachPhoto,
					product: product,
					startUploadAt: startUploadAt,
					photoName: photoName,
					photoSize: photoSize
				});
			},
			trackPhotoFinishUpload: function (uploadProgress) {
				var photoName = uploadProgress.file.name;
				var photoSize = uploadProgress.file.size;
				var startUploadAt = uploadProgress.startUploadAt;
				var successUploadAt = uploadProgress.successUploadAt;
				var product = '';
				
				if(Store.projectSettings.length) {
					product = Store.projectSettings[0].product;
				} else {
					product = Store.baseProject && Store.baseProject.product;
				}

				__webpack_require__(11)({
					ev: __webpack_require__(13).CompleteUploadEachPhoto,
					product: product,
					successUploadAt: successUploadAt,
					photoName: photoName,
					photoSize: photoSize,
					uploadSpend: successUploadAt - startUploadAt
				});
			},
			isWindowOpen:function(){
				return Store.isImageUploadShow;
			},
			cancelItem : function(id){
				if(Store.cancelledImgIds.indexOf(Store.oriImageIds[id])<0){
					Store.cancelledUpload.push(id);
					Store.cancelledImgIds.push(Store.oriImageIds[id]);
				}
				$("#upload-row-item-"+id).hide();
				if(this.sharedStore.uploadProgress[id].xhr){
					this.sharedStore.uploadProgress[id].xhr.abort();
				}

				this.sharedStore.filesCountInQueue++;
				if(Store.cancelledUpload.length===Store.filesTotal){
					this.sharedStore.uploadProgress.length = 0;
					this.handleSaveAndHideUpload();
					this.sharedStore.isUploading = false;
					Store.vm.$broadcast("notifyHidePopup");
				}
			}
		},
		events: {
			// notify show image upload window
			notifyShowImageUpload: function(isSingle) {
				// this.showImageUpload();
				this.handleUploadClick(null,isSingle);
			},
			notifyCancelItem : function(id){
				this.cancelItem(id);
			}
		},
		created: function() {
			var _this = this;
			_this.$watch('sharedStore.uploadProgress', _this.updateUploadProgress, { deep: true });
		},
		ready : function(){
			var _this = this;
			Store.cancelledImgIds = [];
			// $("#box-upload-list").on("click",".cancel-progress",function(){
			// 	var __this = $(this),
			// 		id = __this.attr("id").match(/delete-(\d*)/)[1];
			// 	_this.cancelItem(id);
			// 	require('trackerService')({ev: require('trackerConfig').CancelSingleFile});
			// })
			// $("#box-upload-list").on("click",".upload-retry",function(){
			// 	Store.moveTop = 0;
			// 	var __this = $(this),
			// 		id = __this.attr("id").match(/retry-(\d*)/)[1],
			// 		UploadService = require('UploadService');
			// 	$("#progress-c-"+id).show();
			// 	$("#delete-"+id).show();
			// 	$("#status-"+id).css("width","auto");
			// 	$("#retry-"+id).hide();
			// 	Store.errorUploaded--;
			// 	Store.retryId = +id;
			// 	Store.uploadProgress[Store.retryId].percent = 0;
			// 	UploadService(_this, _this.privateStore.uploadParams);
			// })
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Store) {
	module.exports = {

		// handle box position ( center ) before showing it
		setPopWindowPosition: function(oParams) {
			if(oParams && oParams.width && oParams.height && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newLeft = (width - oParams.width)/2  > 0 ? (width - oParams.width)/2 : 0 ,
				    newTop = (height - oParams.height)/2 > 0 ? (height - oParams.height)/2 : 0;

				$(oParams.selector).css('left', newLeft).css('top', newTop);
			};
		},

		// init image list size
		initImageListSize: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 208;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},

		initImageListSizeWithCards: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 40 - 34 - 41 - 28 - 20 - 3 - 36;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},

		initImageListSizeWithWallArts: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 215 + 40;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},


		initImageListSizeWithCase: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 234;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},
		initImageListSizeWithPadCase: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 240;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},
		initImageListSizeWithLRB: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 40 - 35 - 10 - 32 - 10;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},
		initDecorationListSize: function(oParams) {
			if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 208;

				newHeight = newHeight < 200 ? 200 : newHeight;

				$(oParams.selector).css('height', newHeight);
			};
		},
		// init tshirt project item list size
		getProjectListSize: function(oParams) {
			// if(oParams && oParams.selector) {
				var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				    newHeight = height - 122;

				newHeight = newHeight < 200 ? 200 : newHeight;

				// $(oParams.selector).css('height', newHeight);
				return newHeight;
			// };
		},

		// get canvas box limit
		getBoxLimit: function(listTabWidth) {
			listTabWidth = listTabWidth || 340;
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width - listTabWidth - 20,
					boxHeight = height - 50 - 2 - 80 * 2;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},

		getCardBoxLimit: function(listTabWidth, offsetBottom) {
			listTabWidth = listTabWidth || 340;
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width - listTabWidth - 20,
					boxHeight = height - 38 * 2 - 60 - 80 - 20 - offsetBottom;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},

		getBoxLimitWithCase : function(){
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width - 280 - 20 - 30 * 2,			// list tab, scroll, margin
					boxHeight = height - 50 - 30 - 2 - 150;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},


		getBoxBgSize : function(){
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width - 340 - 20,
					boxHeight = height - 50 - 2;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},

		// get preview canvas box limit
		getPreviewBoxLimit: function(isWithoutBottomPanel) {
			isWithoutBottomPanel = isWithoutBottomPanel || false;
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width - 50,
					boxHeight = height - 30 - 60;

			isWithoutBottomPanel ? boxHeight: boxHeight -= 80;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},

		// get canvas box limit with template
		getBoxLimitWithTmpl: function() {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - 340 - 20 - 30 * 2,   // imagelist, scroll bar, margin
				boxHeight = height - 50 - 2 - 80 * 2;	// header, kept space, action panel

			// check if app is with template
			if(Store.isWithTemplate) {
				boxHeight -= 40;
				if(Store.isChangeTmplExpanded) {
					boxHeight -= 155;
				};
			};

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},

		getOptionHeight : function(){
			var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

			return height - 80 - 60 -4;
		},

		getWallArtsOptionHeight : function(){
			var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

			return height - 50 - 44 - 2;
		},

		getCardsOptionHeight : function(){
			var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

			return height - 41 - 35 - 36;
		},

		getPhoneCaseOptionHeight : function(){
			var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
			
			return height - 80 - 60 -4;
		},

		getPadCaseOptionHeight : function(){
			var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
			console.log(height - 80 - 200);
			return height - 80 - 90;
		},

		getPrintBoxLimit : function(){
			if(Store.limitWidth) {
				return {
					width: Store.limitWidth,
					height: Store.limitWidth
				}
			}

			var width = screen.availWidth,
			perWidth = (width - 6*40 - 2 * 30 - 6*5) / 6 - 20;
			// perWidth = perWidth < 235 ? 235 : (perWidth-20);
			perWidth = perWidth < 235 ? 235 : perWidth;
			return {
				width: perWidth,
				height : perWidth
			}
		},

		getPrintPreviewBoxLimit: function() {
			var width = screen.availWidth,
				perWidth = (width - 4*20 - 2 * 50) / 4;
			perWidth = perWidth >=458 ? 458 : perWidth - 20;
			perWidth = perWidth < 235 ? 235 : perWidth;
			return {
				width: perWidth,
				height : perWidth
			}
		},
		getCenterPreviewBoxLimit: function(isWithoutBottomPanel) {
			isWithoutBottomPanel = isWithoutBottomPanel || false;
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = width,
					boxHeight = height - 30 - 60;

			isWithoutBottomPanel ? boxHeight: boxHeight -= 80;

			boxWidth > 0 ? boxWidth : boxWidth = 0;
			boxHeight > 0 ? boxHeight : boxHeight = 0;
			return { width: boxWidth, height: boxHeight };
		},
		// 获取盒子的宽高。宽高需要去除的值外部传入。
		getBoxWH: function(desWidth, desHeight) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
					height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
					boxWidth = desWidth ? (width - desWidth) : width,
					boxHeight = desHeight ? (height - desHeight) : height;

					boxWidth > 0 ? boxWidth : boxWidth = 0;
					boxHeight > 0 ? boxHeight : boxHeight = 0;
					return { width: boxWidth, height: boxHeight };
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {// do uploading
	module.exports = function(_this, oParams,firstUpload) {
		if(_this && oParams && oParams.fileSelector) {
			var fileEl = document.querySelector(oParams.fileSelector),
					files = fileEl.files;
			files = Array.prototype.slice.call(files);
			files.sort(function(item){
				// 是否是图片文件
				var isImageFile =
					item.name.toLowerCase().indexOf('.jpeg') !== -1 ||
					item.name.toLowerCase().indexOf('.png') !== -1 ||
					item.name.toLowerCase().indexOf('.jpg') !== -1;
				// 计算文件大小MB
				var fileSizeMB = item.size / (1024 * 1024);
				
				// 如果不是文件图片或者文件大小超过100MB的或者为0MB的，排序放前
				if(isImageFile && fileSizeMB < 100 && fileSizeMB !== 0){
					return true;
				}
				return false;
			})
			if(Store.retryId>=0){
				files = [];
				files.push(Store.errorUploadedFiles[Store.errorUploadedFiles.length-1-Store.retryId]);
			}

			// 如果产品有最大张数张数限制的时候， 上传的文件多余所需文件时，自动移除多余的图片。
			if(Store.maxPageNum && (Store.pages.length + files.length > Store.maxPageNum) &&　!(typeof(Store.watchData.replacePageId) == "number")) {
					files.length = Store.maxPageNum - Store.pages.length;
			}

			if(files.length > 0) {
				// request valid image ids before upload
				$.ajax({
					url: Store.domains.uploadUrl + '/upload/UploadServer/GetBatchImageIds',
					type: 'get',
					// dataType: '',
					data: 'imageIdCount=' + files.length + '&timestamp=' + Date.now(),
					error: function(result) {
						Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
					}
				}).done(function(idResult) {
					if(idResult) {
						var xmlStr = idResult,
								idCount = $(xmlStr).find('id').length;
						if(Store.retryId<0){
							Store.prevFilesTotal = Store.filesTotal;
							Store.filesTotal = Store.filesTotal ? Store.filesTotal + idCount : idCount;
						}
						for(var i = 0; i < idCount; i++) {
							// change the count and total
							Store.filesTotalInQueue = idCount;
							Store.filesCountInQueue = 0;

							var currentId = $(xmlStr).find('id').eq(i).text();
							// save into Store as backup
							var xhr = new XMLHttpRequest();
							if(Store.retryId<=0){
								Store.oriImageIds.push(currentId);
								Store.uploadProgress.push({ percent: 0, imgId : currentId,xhr : xhr });
							}

							// 是否是图片文件
							var isImageFile =
								files[i].name.toLowerCase().indexOf('.jpeg') !== -1 ||
								files[i].name.toLowerCase().indexOf('.png') !== -1 ||
								files[i].name.toLowerCase().indexOf('.jpg') !== -1;
							// 计算文件大小MB
							var fileSizeMB = files[i].size / (1024 * 1024);

							// 如果是图片文件，并且小于100MB，不等于0MB
							if(isImageFile && fileSizeMB < 100 && fileSizeMB !== 0){
								// upload image and save image info
							(function(i,currentId,xhr) {
								// if(files[i].type.indexOf('jpeg') === -1 && files[i].type.indexOf('png') === -1) {
								// 	// invalid
								// };

								var formData = new FormData();

								formData.append('uid', Store.userSettings.userId);
								formData.append('timestamp', Store.userSettings.uploadTimestamp);
								formData.append('token', Store.userSettings.token);
								formData.append('albumId', Store.userSettings.albumId);
								formData.append('albumName', Store.title);
								var file = files[i];
								formData.append('Filename', file.name);
								formData.append('filename', file);

								Store.oriImageNames.push({filename:file.name,imgId:currentId});

								var	url = Store.domains.uploadUrl + '/upload/UploadServer/uploadImg?imageId=' + currentId;

								var index = i;
								if(!firstUpload){
									index += Store.prevFilesTotal;
								}
								if(Store.retryId>=0){
									index = Store.retryId;
								}

								// $('#progress-' + i).attr('title', '');
								xhr.upload.onprogress = function(event) {
									if(event.loaded && event.total) {
										// browser support XHR load progress
										if(_this.isWindowOpen()) {
											var loaded = event.loaded,
													total = event.total,
													percent = Math.floor(loaded / total * 100);
											percent >= 99 && (percent = 99);
											console.log('percent',percent,i);
											for(var j=0;j<Store.uploadProgress.length;j++){
												var item = Store.uploadProgress[j];
												if(item.imgId===currentId){
													index = j;
													break;
												}
											}
											
											var startUploadAt = Store.uploadProgress[index].startUploadAt || 0;
											var successUploadAt = Store.uploadProgress[index].successUploadAt || 0;
											Store.uploadProgress.$set(index, { percent: percent, imgId : currentId, xhr : xhr, file: file, startUploadAt: startUploadAt });
											// Store.uploadProgress[i].percent = percent;

											// $('#status-' + i).text(percent + '%');
											// $('#progress-' + i).css('width', percent * 3).css('background-color', '#ccc');
										}
										else {
											// user closed upload window, abandon xhr handles
											xhr.onload = null;
											xhr.error = null;
											xhr.upload.onprogress = null;
										};
									}
									else {
										// XHR load progress not supported
										// TODO:  use wave progress?
									};
								};
								xhr.onreadystatechange = function() {
									if(xhr.readyState == 4){
										//上传图片过大时，处理方法
										if (xhr.status == 413) {
										// console.log("upload complete");
										// console.log(xhr);
										// console.log("response: " + xhr.responseText);

											Store.errorUploaded++;
											Store.filesCountInQueue ++;
											Store.errorExt++;
											// console.log("errorExt",Store.errorExt);
											Store.uploadProgress.$set(index, { percent: "File exceeds maximum size of 100M",imgId : currentId, info: "Failed: File exceeds maximum size of 100M" || 'Upload failed!' });
											$('#retry-'+index).show();
											$('#progress-c-'+index).hide();
											$("#delete-"+index).hide();
											var errorItem = Store.uploadProgress.splice(index,1);
											Store.uploadProgress.unshift(errorItem[0]);
											if(Store.filesCountInQueue==idCount){
												Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
												Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
												Store.isLostFocus = true;
											}
											_this.refreshImageUploadDom();

								 		}
									}

								}
								xhr.onload = function(event) {
									var result = this.responseText;
									console.log(result);
									if(Store.cancelledImgIds.indexOf($(result).find('id').text())>=0){
										return;
									}
									// console.log('upload' + i + ' successfully!');
									Store.filesCountInQueue ++;
									for(var j=0;j<Store.uploadProgress.length;j++){
										var item = Store.uploadProgress[j];
										if(item.imgId===currentId){
											index = j;
											break;
										}
									}

									if(result && result.indexOf('state="success"') !== -1) {
										console.log('done');
										var startUploadAt = Store.uploadProgress[index].startUploadAt || 0;
										var successUploadAt = Store.uploadProgress[index].successUploadAt || 0;
										Store.uploadProgress.$set(index, { percent: 'Done',imgId : currentId, xhr : xhr, file: file, startUploadAt: startUploadAt, successUploadAt: successUploadAt });

										$("#delete-"+index).hide();
										Store.currentUploadCount++;

										Store.successfullyUploaded++;
										Store.currentSuccessUpload++;
										if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
											var spendTime = -1;
											if(Store.startUploadTime){
													spendTime = new Date - Store.startUploadTime;
													Store.startUploadTime = 0;
											}
											Store.isUploading = false;
											__webpack_require__(11)({ev: __webpack_require__(13).UploadComplete,uploadTimes:++Store.uploadTimes,success:Store.currentSuccessUpload,failed:Store.currentErrorUpload,spendTime: spendTime});
										}
										if(Store.retryId>=0){
											Store.errorUploaded--;
										}
										// $('#status-' + i).text('Done');
										// $('#progress-' + i).css('width', 300).css('background-color', '#393939');
										Store.imageList.push({
											id: $(result).find('id').text(),
											guid: $(result).find('guid').text() || '',
											// url: asFn.getImageUrl($(result).find('id').text()),
											encImgId: $(result).find('encImgId').text() || '',
											url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + __webpack_require__(10).getSecurityString() + '&rendersize=fit',
											name: $(result).find('name').text(),
											width: parseFloat($(result).find('width').text()) || 0,
											height: parseFloat($(result).find('height').text()) || 0,
											shotTime: $(result).find('shotTime').text()	|| '',
											createTime: file.lastModified,
											uploadTime: new Date($(result).find('insertTime').text()).valueOf() || 0,
											orientation: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"UtilImage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).getExifDegree($(result).find('exifOrientation').text()),
											usedCount: 0,
											previewUrl: ''
										});

										__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"UtilImage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).getBlobImagePreviewUrl(Store.imageList.length - 1);

										if(typeof(Store.newUploadedImg) == "undefined"){
											Store.newUploadedImg=[];
										}
										Store.newUploadedImg.push({
											id: $(result).find('id').text(),
											guid: $(result).find('guid').text() || '',
											// url: asFn.getImageUrl($(result).find('id').text()),
											encImgId: $(result).find('encImgId').text() || '',
											url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(result).find('encImgId').text() + __webpack_require__(10).getSecurityString() + '&rendersize=fit',
											name: $(result).find('name').text(),
											width: parseFloat($(result).find('width').text()) || 0,
											height: parseFloat($(result).find('height').text()) || 0,
											shotTime: $(result).find('shotTime').text()	|| '',
											createTime: file.lastModified,
											uploadTime: new Date($(result).find('insertTime').text()).valueOf() || 0,
											orientation: __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"UtilImage\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).getExifDegree($(result).find('exifOrientation').text()),
											usedCount: 0,
											previewUrl: ''
										});

										Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");

										if(Store.successfullyUploaded==Store.filesTotal){
											_this.handleSaveAndHideUpload(true);
											Store.vm.$broadcast("notifyHidePopup");
											// require('trackerService')({ev: require('trackerConfig').CloseMonitor,auto:true});
										}
										// else if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
										// 	Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
										// }
										// vm.broadcastImageList();
										// Store.watches.flagImageList = true;
										Store.retryId = -1;
										console.log(Store.imageList);
										_this.$dispatch('dispatchImageList');
										// TEST: display image testing

									}
									else if(result && result.indexOf('state="fail"') !== -1) {
										if(Store.cancelledImgIds.indexOf($(result).find('id').text())>=0){
											if(Store.retryId>=0){
												Store.retryId = -1;
											}
											return;
										}
										Store.errorUploaded++;
										if(Store.retryId<0){
											Store.currentUploadCount++;
											Store.currentErrorUpload++;
											if(Store.filesTotal===(Store.successfullyUploaded+Store.errorUploaded)){
												Store.isUploading = false;
												__webpack_require__(11)({ev: __webpack_require__(13).UploadComplete,uploadTimes:++Store.uploadTimes,success:Store.currentSuccessUpload,failed:Store.currentErrorUpload});
											}
											var errorItem = Store.uploadProgress.splice(index,1);
											Store.uploadProgress.unshift(errorItem[0]);
											// var errorImageId = Store.oriImageIds.splice(index,1);
											// Store.oriImageIds.unshift(errorImageId[0]);
											// var errorImageName = Store.oriImageNames.splice(index,1);
											// Store.oriImageNames.unshift(errorImageName[0]);
											Store.errorUploadedFiles.push(file);
											if(Store.filesCountInQueue==idCount){
												Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
												Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
												Store.isLostFocus = true;
											}
											_this.refreshImageUploadDom();
										}
										var idx = Store.retryId>=0 ? Store.retryId : 0;
										Store.uploadProgress.$set(idx, { percent: $(result).find('errorInfo').text(),imgId : currentId, xhr : xhr, info:"Failed: "+$(result).find('errorInfo').text() || 'Upload failed!' });
										Store.retryId = -1;
										$('#retry-'+idx).show();
										$('#progress-c-'+idx).hide();
										$("#delete-"+idx).hide();
										// $('#progress-' + i).css('width', 300).css('background-color', '#de3418').attr('title', 'Incorrect image format!');
									};
								};
								xhr.onerror = function(e) {
									// upload failed
									console.log('err');

									Store.errorUploaded++;
									Store.currentUploadCount++;
									Store.currentErrorUpload++;
									Store.filesCountInQueue ++;
									Store.uploadProgress.$set(index, { percent: "File exceeds maximum size of 100M",imgId : currentId, info: "Failed: File exceeds maximum size of 100M" || 'Upload failed!' });
									$('#retry-'+index).show();
									$('#progress-c-'+index).hide();
									$("#delete-"+index).hide();
									var errorItem = Store.uploadProgress.splice(index,1);
									Store.uploadProgress.unshift(errorItem[0]);
									if(Store.filesCountInQueue==idCount){
										Store.vm.$dispatch('dispatchSaveProject', true);	// isDisableMsg
										Store.vm.$broadcast("notifyAddNewUploadedImgIntoPages");
										Store.isLostFocus = true;
									}
									_this.refreshImageUploadDom();
								};


								xhr.open('post', url, true);
								xhr.send(formData);

								if(Store.retryId<0){
									_this.initImageUploadDom(index, file.name);
								}
							})(i,currentId,xhr);

							}else{
								//上传图片格式不符合时
								index = i;
								index += Store.prevFilesTotal;

								Store.errorUploaded++;
								Store.errorExt++;
								// console.log("errorExt",Store.errorExt);
								Store.oriImageNames.push({filename:files[i].name,imgId:currentId});

								_this.initImageUploadDom(index, files[i].name);

								$('#retry-'+index).show();
								$('#progress-c-'+index).hide();
								$("#delete-"+index).hide();

								var percent = 'Only .jpg .jpeg and .png files are supported';
								var info = 'Only .jpg .jpeg and .png files are supported';

								if(fileSizeMB === 0) {
									percent = 'Invalid image file, please select another file';
									info = 'Failed: Invalid image file, please select another file';
								}

								if(fileSizeMB >= 100) {
									percent = 'File exceeds maximum size of 100M';
									info = 'Failed: File exceeds maximum size of 100M';
								}

								Store.uploadProgress.$set(index, { percent: percent,imgId : currentId, info: info });

								var errorItem = Store.uploadProgress.splice(index,1);
								Store.uploadProgress.unshift(errorItem[0]);

								_this.refreshImageUploadDom();

							}

						};
					};
				});

			};
		};

	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    template: '<div  v-show="sharedStore.isSizeChartShow">' +
	                // '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex}"></div>' +
	                '<div id="bed-sizechart" v-bind:style="{zIndex: windowZindex}" style="width:1000px;height:600px;" >'+
	                    '<div style="height: 40px:line-height: 40px;">' +
	                        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 940px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleCloseSizeChart()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	                    '</div>' +
	                    '<div class="font-light" style="margin:10px 0 30px;font-size:40px;color:#3a3a3a;text-align:center;">Size Chart</div>'+
	                    '<table class="font-light" border="1" cellspacing="0" cellpadding="0" width="500" style="font-size:14px;text-align: center;margin:0 0 20px 60px">'+
	                        '<tr height="40" style="background: black;color:#eee;font-size: 18px;font-family: Gotham Book;"><td class="font-normal" colspan="7" style="border:1px solid #000;">Size Chart</td></tr>'+
	                        '<tr height="36" style="background: rgb(204,204,204);">'+
	                            '<td class="font-lightBlack" width="110">Size</td><td class="font-lightBlack" colspan="2">(a) Width</td><td class="font-lightBlack" colspan="2">(b) Height</td><td class="font-lightBlack" colspan="2">(c) Sleeve</td>'+
	                        '</tr>'+
	                        '<tr height="36">'+
	                            '<td></td><td width="62">inches</td><td width="63">cm</td><td width="62">inches</td><td width="63">cm</td><td width="62">inches</td><td width="63">cm</td>'+
	                        '</tr>'+
	                        '<tr height="31" v-for="item in sizeData">'+
	                            '<td class="font-lightBlack"">{{item.size}}</td><td width="62">{{item.ainches}}</td><td width="63">{{item.acm}}</td><td width="62">{{item.binches}}</td><td width="63">{{item.bcm}}</td><td width="62">{{item.cinches}}</td><td width="63">{{item.ccm}}</td>'+
	                        '</tr>'+
	                    '</table>'+
	                    '<span class="font-light" style="margin:0 0 0 60px;font-size:14px;color:#3a3a3a;">Note: Please allow 0.75inch or 2cm of tolerance</span>'+
	                    '<div class="button t-center font-medium" v-on:click="handleCloseSizeChart()" style="width: 160px;height: 40px;line-height: 40px;margin:82px auto;font-size: 16px;">Close</div>' +
	                '</div>'+
	              '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width: 1000,
	                height: 600,
	                selector: '#bed-sizechart'
	            },
	            sizeData : [
	            {size:"S",ainches:18,acm:45,binches:28,bcm:71,cinches:7.3,ccm:18.5},
	            {size:"M",ainches:20,acm:50,binches:29,bcm:73,cinches:7.3,ccm:18.5},
	            {size:"L",ainches:22,acm:55,binches:30,bcm:76,cinches:7.5,ccm:19},
	            {size:"XL",ainches:24,acm:60,binches:31,bcm:79,cinches:7.7,ccm:19.5},
	            {size:"XXL",ainches:26,acm:65,binches:32,bcm:81,cinches:7.7,ccm:19.5}
	            ],
	            sharedStore: Store
	        };
	    },
	    computed: {
	        windowZindex: function() {
	          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	              elementTotal = currentCanvas.params.length || 0;

	          return (elementTotal + 10) * 100+10;
	        },
	    },
	    methods: {
	        handleCloseSizeChart : function(){
	            this.sharedStore.isSizeChartShow = false ;
	        }

	    },
	    ready: function() {
	         var _this = this;
	        _this.$watch('sharedStore.isSizeChartShow',function(){
	            if(_this.sharedStore.isSizeChartShow){
	                var utilWindow = __webpack_require__(34);
	                utilWindow.setPopWindowPosition({ width: _this.privateStore.width, height: _this.privateStore.height, selector: _this.privateStore.selector });
	            } 
	        })
	    },
	    events: {
	        
	    }

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	var Vue = __webpack_require__(29);

	var CompImageList = Vue.extend(__webpack_require__(38));
	// Vue.component('image-list', CompImageList);

	var CompProjectItemList = Vue.extend(__webpack_require__(39));
	// Vue.component('project-item-list', CompProjectItemList);
	// component -- list tab
	module.exports = {
		template: '<div class="bed-list-tab" v-on:click="blurFocus" style="float: left;border-right: 1px solid rgba(232, 232, 232, 1);">' +
								'<div style="height: 60px;">' +
									'<div class="t-center" v-bind:class="list0Class" v-on:click="handleChangeTab(0)" style="width: 169px;border-right:1px solid rgba(232, 232, 232, 1);">Your Items</div>' +
									'<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(1)" style="width: 169px;">Images</div>' +
								'</div>' +
								'<div style="width:16px;height:16px;position: absolute;top: 60px;left: 135px;">'+
	        							'<span style="padding-top: 2px;font-size: 12px;line-height: 12px;display:block;color:#e13724;text-align:center;">{{sharedStore.itemListNum}}</span>'+
	    						'</div>'+
								'<image-list v-show="privateStore.currentView === \'image-list\'"></image-list>' +
								'<project-item-list v-show="privateStore.currentView === \'project-item-list\'"></project-item-list>' +
							'</div>',
		data: function() {
			return {
				privateStore: {
					currentView: 'image-list'
				},
				sharedStore: Store
			};
		},
		computed: {
			list0Class: function() {
				if(this.privateStore.currentView === 'project-item-list') {
					return 'list-tab-selected';
				}
				else {
					return 'list-tab';
				};
			},

			list1Class: function() {
				if(this.privateStore.currentView === 'image-list') {
					return 'list-tab-selected';
				}
				else {
					return 'list-tab';
				};
			}
		},
		components: {
			'image-list': CompImageList,
			'project-item-list': CompProjectItemList
		},
		methods: {
			handleChangeTab: function(nTabNum) {
				switch(nTabNum) {
					case 0:
						// Your items tab
						this.privateStore.currentView = 'project-item-list';
						break;
					case 1:
						this.privateStore.currentView = 'image-list';
						break;
				};
			},

			blurFocus: function() {
	      this.$dispatch('dispatchClearScreen');
	      // this.sharedStore.isLostFocus = true;
	    },
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {// component -- image list
	module.exports = {
		// template: '#t-image-list',
		template:   '<div style="text-align: center;">' +
									'<div class="button" v-on:click="triggerImageUpload()" style="width: 260px;height: 50px;line-height: 50px;margin: 40px 0px 10px 40px;font-size: 14px;">Add Photos</div>' +
									// '<div class="t-left" style="margin: 0 0 0 25px;">' +
									// 	'<input type="checkbox" id="input-hideused" v-on:click="handleHideUsedToggle()" v-model="privateStore.isHideUsed" />' +
									// 	'<label for="input-hideused" style="position: relative;top: -2px;font-size: 12px;">Hide Used</label>' +
									// '</div>' +
									'<div class="t-left" style="margin: 0 0 2px 40px;height: 20px;line-height: 20px;">' +
										'<input type="checkbox" id="input-hideused" v-on:click="handleHideUsedToggle()" v-model="privateStore.isHideUsed" style="float: left;" />' +
										'<label for="input-hideused" style="height: 20px;line-height: 20px;padding-left:4px;font-size: 12px;float:left;display:inline-block;cursor:pointer;">Hide Used</label>' +
									'</div>' +
									'<div id="list-image">' +
										'<div class="item-image" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">' +
											'<span class="">' +
												'<span class="box-preview-image" count-content="{{ item.usedCount }}" v-bind:style="{opacity: item.usedCount > 0? 1: 0 }" ></span>' +
												'<img class="preview-image" id="ori-image-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.name" draggable="true" />' +
											'</span>' +
											'<img id="icon-delete-{{ $index }}" src="../../static/img/delete.svg" width="20" height="20" v-on:click="handleDeleteImage($index)" v-show="item.usedCount <= 0" alt="delete" title="delete" style="position: relative; top: 7px; left: -16px; opacity: 0; cursor: pointer;" />' +
		                  '<img src="../../static/img/delete.svg" width="20" height="20" v-else alt="delete" style="position: relative; top: 7px; left: -16px; opacity: 0; cursor: pointer;" />' +
		                  '<div class="preview-image-tip" title="{{ item.imageTip.longTip }}">{{ item.imageTip.shortTip }}</div>' +
										'</div>' +
									'</div>' +
								'</div>',
		data: function() {
			return {
				privateStore: {
					imageList: [],
					isHideUsed: false,
					imageListParams: {
						selector: '#list-image'
					}
				},
				sharedStore: Store
			};
		},
		computed: {
			newImageList: function() {
				var newAry = [];

				// init image list
				for(var i = 0; i < this.sharedStore.imageList.length; i++) {
					if(this.privateStore.isHideUsed === false || (this.privateStore.isHideUsed === true && this.sharedStore.imageList[i].usedCount <= 0)) {
						newAry.push(this.sharedStore.imageList[i]);
						// newAry[i].previewUrl = 'http://img350' + this.sharedStore.imageList[i].url;
						newAry[newAry.length - 1].previewUrl = this.sharedStore.imageList[i].url + '350';
						newAry[newAry.length - 1].imageTip = this.chopImageTip(this.sharedStore.imageList[i].name, this.sharedStore.imageList[i].width, this.sharedStore.imageList[i].height);
						// newAry[i].usedCount = 0;
					};

				};

				this.bindImageDragEvent();
				// console.log(newAry);

				return newAry;
			}

		},
		methods: {

			// init image list size
			// initImageListSize: function() {
			// 	var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			// 	    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			// 	    newHeight = height - 280;

			// 	newHeight < 400 ? newHeight = 400 : newHeight;

			// 	$('#list-image').css('height', newHeight);
			// },

			//
			triggerImageUpload: function() {
				this.$dispatch('dispatchImageUpload');
				__webpack_require__(11)({ev: __webpack_require__(13).AddPhotos});
			},

			// chop image tip
			chopImageTip: function(sImageName, nImageWidth, nImageHeight) {
				sImageName = sImageName || '';
				nImageWidth = nImageWidth || 0;
				nImageHeight = nImageHeight || 0;

				// the final patten is like  Image name (1400x900)
				var sizePart = '',
						namePart = '',
						sizeStr = '',
						nameStr = '';

				// prepare size part at first
				if(nImageWidth > 0 && nImageHeight > 0) {
					// change size part only if width and height are valid
					sizeStr = sizePart = ' (' + nImageWidth + 'x' + nImageHeight + ')';
				};

				// chop name if needed
				if((sImageName.length + sizePart.length) > 20) {
					// image tip will be too long
					if(sizePart.length > 14) {
						// size part is too long
						// NOTE: this happens rarely, but to be robust, we consider it and change the patten as  Image name (12345x123...)
						var sizeNumPart = nImageWidth + 'x' + nImageHeight;

						sizeStr = ' (' + sizeNumPart.substr(0, 9) + '...)';

						if(sImageName.length > 6) {
							// name part is also too long
							var fitLength = 6,
									prefixLength = fitLength - 4;

							namePart = sImageName;
							nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
						}
						else {
							// normal name part + long size part
							nameStr = namePart = sImageName;
						};
					}
					else {
						// name part is too long, chop the name then
						var fitLength = 20 - sizePart.length,
								prefixLength = fitLength - 4;

						namePart = sImageName;
						nameStr = namePart.substr(0, prefixLength) + '...' + namePart.substr(namePart.length - 3);
					};
				}
				else {
					// no chopping needed
					nameStr = namePart = sImageName;
				};

				return {
					longTip: namePart + sizePart,
					shortTip: nameStr + sizeStr
				};
			},

			// handle hide used toggle
			handleHideUsedToggle: function() {
				// console.log(this.privateStore.isHideUsed);
				// at now, privateStore.isHideUsed is not changed
				//this.sharedStore.isHideUsed = !this.privateStore.isHideUsed;

				//this.bindImageDragEvent();
			},

			// show delete icon
			handleShowDeleteIcon: function(idx) {
				$('#icon-delete-' + idx).css('opacity', 1);
			},

			// hide delete icon
			handleHideDeleteIcon: function(idx) {
				$('#icon-delete-' + idx).css('opacity', 0);
			},

			// delete image
			handleDeleteImage: function(imageIdx) {
				if(imageIdx != undefined) {
					var imageId = $('#ori-image-' + imageIdx).attr('imageid') || '';

					if(imageId !== '') {
						for(var i = 0; i < this.sharedStore.imageList.length; i++) {
							if(imageId == this.sharedStore.imageList[i].id) {
								this.sharedStore.imageList.splice(i, 1);
								this.sharedStore.deleImagelist.push(this.sharedStore.imageList[i].encImgId);
								break;
							};
						};
					};
				};
			},

			// bind image dragging handles
			bindImageDragEvent: function() {
				var _this = this;

				// binding dragging listeners when view synced
				_this.$nextTick(function() {
					console.log('binding events now')
					for(var i = 0; i < $('.item-image').length; i++) {

						// on dragging start
						$('.item-image')[i].ondragstart = function(ev) {
							console.log('trigger event now ' + $(ev.target).attr('imageid'));
							_this.$dispatch('dispatchShowSpineLines');

							_this.sharedStore.elementDragged = ev.target;
							// console.log($(ev.target).attr('guid'));
							_this.sharedStore.dragData.imageId = $(ev.target).attr('imageid');
							_this.sharedStore.dragData.sourceImageUrl = $(ev.target).attr('imageurl');
							_this.sharedStore.dragData.cursorX = ev.offsetX || 0;
							_this.sharedStore.dragData.cursorY = ev.offsetY || 0;
							_this.sharedStore.dragData.isFromList = true;
							_this.sharedStore.operateMode = 'drag';
							// ev.dataTransfer.setData('imageId', $(ev.target).attr('imageid'));
							// ev.dataTransfer.setData('sourceImageUrl', $(ev.target).attr('imageurl'));
							// ev.dataTransfer.setData('imageGuid', $(ev.target).attr('guid'));
							// ev.dataTransfer.setData("imageWidth", $(ev.target).attr('owidth'));
							// ev.dataTransfer.setData("imageHeight", $(ev.target).attr('oheight'));
							// ev.dataTransfer.setData("imageWidth", ev.target.width);
							// ev.dataTransfer.setData("imageHeight", ev.target.height);
						};

						// on dragging end
						$('.item-image')[i].ondragend = function(ev) {
							console.log('dragging ends now');
							_this.sharedStore.dragData.isFromList = false;
							_this.sharedStore.operateMode = 'idle';
							_this.$dispatch('dispatchHideSpineLines');
						};
					};
				});
			}
		},
		events: {

			// notify the broadcast from parent instance
			notifyImageList: function() {
				console.log('notify image list event');
				var UtilWindow = __webpack_require__(34);

				UtilWindow.initImageListSize(this.privateStore.imageListParams);

				//this.bindImageDragEvent();
			}
		},
		created: function() {
			// var _this = this;

			// // get image list from backend
			// $.ajax({
			// 	url: 'testing/imageList.json',
			// 	type: 'get',
			// 	dataType: 'json',
			// 	// data:
			// }).done(function(result) {
			// 	if(result.retCode === 10000) {
			// 		_this.privateStore.imageList = result.data;

			// 		// binding dragging listeners when view synced
			// 		_this.$nextTick(function() {
			// 			for(var i = 0; i < $('.item-image').length; i++) {

			// 				// on dragging start
			// 				$('.item-image')[i].ondragstart = function(ev) {
			// 					_this.sharedStore.elementDragged = ev.target;
			// 					ev.dataTransfer.setData("imageWidth", ev.target.width);
			// 					ev.dataTransfer.setData("imageHeight", ev.target.height);
			// 				};
			// 			};
			// 		});

			// 	};
			// });


		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var UtilParam = __webpack_require__(10);
	var UtilWindow = __webpack_require__(34);

	// component -- image list
	module.exports = {
	    // template: '#t-image-list',
	    template: '<div id="list-project" v-bind:style="{ height: privateStore.minHeight + \'px\' }" style="margin-top:10px;overflow-x: hidden; overflow-y: auto;">' +
	        '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList" v-on:mouseover="handleShowDeleteIcon($index)" v-on:mouseout="handleHideDeleteIcon($index)">' +
	        '<div style="height:130px">' +
	        '<span style="display:inline-block;margin-left:40px;margin-top:18px;position:relative;">' +
	        '<img draggable="false" class="preview-project-image" style="width:auto;" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
	        '<img class="preview-project-image" style="width:auto;position:absolute;top:0;left:0" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="sharedStore.currentImage" :alt="item.color"/>' +
	        '</span>' +
	        '<input type="image" id="item-delete-{{ $index }}" src="../../static/img/delete.svg" width="20" height="20" alt="delete" style="position: relative; bottom: 100px; left: 155px; cursor: pointer; opacity:0;" v-show="item.show" v-on:click="deleteButtonClick(item.color)"/>' +
	        '<img draggable="false" src="../../static/img/delete.svg" width="20" height="20" v-else style="position: relative; bottom: 100px; left: 155px;opacity:0;"/>' +
	        '<span style="position:relative;font-size:14px;color:#7b7b7b;bottom:54px;left:0px;right:16px;">Color:</span>' +
	        '<span style="position:relative;font-size:12px;color:#3a3a3a;text-decoration:underline;cursor: pointer;bottom:54px;left:16px;" v-on:click="itemButtonClick(item.color,item.id)"/>{{item.title}}</span>' +

	        '</div>' +

	        '<div id="selectItemColorDiv-{{$index}}" class="selectItemColorDiv">' +
	        '<img draggable="false" id="White-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'White\')" src="assets/img/white-normal.png" width="50" height="50" v-on:click="itemColorClick(\'White\',$index,item.color)" />' +
	        '<img draggable="false" id="Black-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'Black\')" src="assets/img/black-normal.png" width="50" height="50" v-on:click="itemColorClick(\'Black\',$index,item.color)" />' +
	        '<img draggable="false" id="SportGrey-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'SportGrey\')" src="assets/img/grey-pressed.png" width="50" height="50" v-on:click="itemColorClick(\'SportGrey\',$index,item.color)" />' +
	        '<img draggable="false" id="NavyBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'NavyBlue\')" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="itemColorClick(\'NavyBlue\',$index,item.color)" />' +
	        '<img draggable="false" id="RoyalBlue-item-{{item.id}}" style="margin-left:10px;margin-top:10px;" v-bind:style="getOptionStyle(\'RoyalBlue\')" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="itemColorClick(\'RoyalBlue\',$index,item.color)" />' +
	        '</div>' +
	        '</div>' +
	        '<div v-on:click="clickSelectColor()" style="margin-top: 12px;cursor: pointer;">' +
	        '<span style="margin-left:85px;font-size:14px;color:#3a3a3a">+ Add Another Color</span>' +
	        '</div>' +
	        '<div class="selectColorDiv">' +
	        '<img draggable="false" id="White-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'White\')" src="assets/img/white-normal.png" width="50" height="50" v-on:click="addColorClick(\'White\')" />' +
	        '<img draggable="false" id="Black-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'Black\')" src="assets/img/black-normal.png" width="50" height="50" v-on:click="addColorClick(\'Black\')" />' +
	        '<img draggable="false" id="SportGrey-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'SportGrey\')" src="assets/img/grey-normal.png" width="50" height="50" v-on:click="addColorClick(\'SportGrey\')" />' +
	        '<img draggable="false" id="NavyBlue-project-item" style="margin-left:12px;margin-top:12px;" v-bind:style="getOptionStyle(\'NavyBlue\')" src="assets/img/navy-normal.png" width="50" height="50" v-on:click="addColorClick(\'NavyBlue\')" />' +
	        '<img draggable="false" id="RoyalBlue-project-item" style="margin-left:12px;margin-top:6px;" v-bind:style="getOptionStyle(\'RoyalBlue\')" src="assets/img/royal-normal.png" width="50" height="50" v-on:click="addColorClick(\'RoyalBlue\')" />' +
	        '</div>' +
	        '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                isShowColorDiv: false,
	                selectedColor: [],
	                minHeight: 200
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	        newImageList: function() {
	            //一个颜色只有一条数据
	            var colors = [];

	            var itemList = [];
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                var color = this.sharedStore.projectSettings[i].color;
	                if (colors.indexOf(color) == -1) {
	                    colors.push(color);
	                    var assets = this.getColorAssets(color);
	                    console.log("color:"+colors.length);
	                    var show = true;
	                    var colorObject = { id: i, name: color,title:assets.title, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage ,show:show};
	                    itemList.push(colorObject);
	                }


	            }
	            if(itemList.length===1){
	                itemList[0].show=false;
	            }
	            this.sharedStore.itemListNum=itemList.length;
	            return itemList;
	        }
	    },
	    methods: {
	    	handleShowDeleteIcon: function(idx) {
	    		if(this.newImageList.length>1){
	    			$('#item-delete-' + idx).css('opacity', 1);
	                //$('#item-delete-' + idx).removeAttr("disabled");
	    		}

			},
			handleHideDeleteIcon: function(idx) {
				$('#item-delete-' + idx).css('opacity', 0);
	            //$('#item-delete-' + idx).attr("disabled","disabled");
			},
	        deleteButtonClick: function(color) {
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                var prj = this.sharedStore.projectSettings[i];
	                if (prj.color === color) {
	                    this.sharedStore.projectSettings.splice(i, 1);
	                    //$("#project-div-0").css('background', '#f8f8f8');
	                    this.sharedStore.currentSelectProjectIndex = 0;
	                }
	            }
	            Store.vm.$broadcast('notifyRefreshBackground');

	        },
	        getDefaultMeasure: function(color, size) {
	            var defaultMeasure = 'M';
	            var params = [{ key : 'size', value : size}];
	            var measures = ['S', 'M', 'L', 'XL', 'XXL'];
	            // var measures = require('SpecManage').getOptionsMap('measure', params).split(',');

	            if(Store.disableOptions[color]) {
	                availableMeasures = measures.filter(function(measure) {
	                    return Store.disableOptions[color].options.indexOf(measure) === -1;
	                });

	                if(availableMeasures.indexOf(defaultMeasure) === -1) {
	                    defaultMeasure = availableMeasures[0];
	                }
	            }

	            return defaultMeasure;
	        },
	        addColorClick: function(type) {
	            if(this.isOptionDisabled(type)) return;
	            var size = '14X16';

	            if (this.privateStore.selectedColor.indexOf(type) != -1) {
	                this.hideColorDiv();
	            } else {
	                var project = __webpack_require__(23).newProject(type, this.getDefaultMeasure(type, size), 1);
	                this.sharedStore.projectSettings.push(project);
	                this.hideColorDiv();

	                var _this=this;
	                setTimeout(function(){
	                    _this.sharedStore.currentSelectProjectIndex = 0;
	                    $("#project-div-0").css('background', '#f8f8f8');
	                },300);
	            }

	        },
	        projectItemClick: function(index) {

	            this.sharedStore.currentSelectProjectIndex = index;
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                if (i == index) {
	                    $("#project-div-" + index).css('background', '#f8f8f8');
	                } else {
	                    $("#project-div-" + i).css('background', '#ffffff');
	                }
	            }
	            Store.vm.$broadcast('notifyRefreshBackground');

	        },
	        itemButtonClick: function(type, index) {
	            if($("#selectItemColorDiv-" + index).css('opacity')==="1"){
	                this.hideColorItemDiv(index);
	            }else{
	                this.setSelectedColorItem();
	                this.showColorItemDiv(index);
	                this.setItemSelectColor(index);
	            }

	        },
	        itemColorClick: function(type, index, color) {
	            if(this.isOptionDisabled(type)) return;

	            if (this.privateStore.selectedColor.indexOf(type) == -1) {
	                this.setSelectedColorItem();
	                //this.sharedStore.projectSettings[index].color = type;
	                for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                    var prj = this.sharedStore.projectSettings[i];
	                    if (prj.color === color) {
	                        prj.color = type;
	                        prj.measure = this.getDefaultMeasure(prj.color, prj.size);
	                    }
	                }
	                this.setItemSelectColor(index);
	                Store.vm.$broadcast('notifyRefreshBackground');
	            } else {
	                this.hideColorItemDiv(index);
	            }

	        },
	        setItemSelectColor: function(index) {

	            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
	                var type = this.sharedStore.colorOptionList[i].type;
	                if (this.privateStore.selectedColor.indexOf(type) != -1) {
	                    console.log(this.sharedStore.colorOptionList[i].pressColor);
	                    $("#" + type + "-item-" + index).attr("src", this.sharedStore.colorOptionList[i].pressColor);
	                } else {
	                    console.log(this.sharedStore.colorOptionList[i].normalColor);
	                    $("#" + type + "-item-" + index).attr("src", this.sharedStore.colorOptionList[i].normalColor);
	                }
	            }

	        },
	        clickSelectColor: function() {
	            var isShowColorDiv = this.privateStore.isShowColorDiv;
	            if (isShowColorDiv) {
	                this.hideColorDiv();
	            } else {
	                this.showColorDiv();
	            }
	            this.setSelectedColorItem();

	        },
	        setSelectedColorItem: function() {
	            var projects = this.sharedStore.projectSettings;
	            this.privateStore.selectedColor = [];
	            for (var i = 0; i < projects.length; i++) {
	                this.privateStore.selectedColor.push(projects[i].color);
	            }


	            for (var j = 0; j < this.sharedStore.colorOptionList.length; j++) {
	                var type = this.sharedStore.colorOptionList[j].type;
	                if (this.privateStore.selectedColor.indexOf(type) != -1) {
	                    $("#" + type + "-project-item").attr("src", this.sharedStore.colorOptionList[j].pressColor);
	                } else {
	                    $("#" + type + "-project-item").attr("src", this.sharedStore.colorOptionList[j].normalColor);
	                }
	            }

	        },
	        showColorDiv: function() {
	            $(".selectColorDiv").css('opacity', 1);
	            $(".selectColorDiv").css('height', '134px');
	            this.privateStore.isShowColorDiv = true;
	        },
	        hideColorDiv: function() {
	            $(".selectColorDiv").css('opacity', 0);
	            $(".selectColorDiv").css('height', '0px');
	            this.privateStore.isShowColorDiv = false;
	        },
	        showColorItemDiv: function(index) {
	            $("#selectItemColorDiv-" + index).css('opacity', 1);
	            $("#selectItemColorDiv-" + index).css('height', '70px');
	        },
	        hideColorItemDiv: function(index) {
	            $("#selectItemColorDiv-" + index).css('opacity', 0);
	            $("#selectItemColorDiv-" + index).css('height', '0px');
	        },
	        getColorAssets: function(type) {
	            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
	                if (this.sharedStore.colorOptionList[i].type === type) {
	                    return this.sharedStore.colorOptionList[i];
	                }
	            }
	        },
	        getOptionStyle: function(color, isNewTshirt) {
	            var opacity = 1;
	            var cursor = 'point';

	            if(this.isOptionDisabled(color)) {
	                opacity = 0.5;
	                cursor = 'not-allowed';
	            }

	            return {
	                opacity: opacity,
	                cursor: cursor
	            }
	        },
	        isOptionDisabled: function(color) {
	            return Store.disableOptions[color] &&
	                Store.disableOptions[color].isAllDisabled;
	        },
	        hasDisabledMeasure: function(project) {
	            return Store.disableOptions[project.color] &&
	                Store.disableOptions[project.color].options.indexOf(project.measure) !== -1;
	        }
	    },
	    events: {

	        notifyImageList: function() {
	            console.log('notify image list event');
	            this.privateStore.minHeight = UtilWindow.getProjectListSize();
	        },

	        // 通知初始化Tshirt项目
	        notifyResetProjectToDefault: function() {
	            var _this = this;
	            var projects = this.sharedStore.projectSettings;

	            // 下架尺寸的老项目数量置为0
	            projects.forEach(function(project) {
	                if(_this.hasDisabledMeasure(project)) {
	                    project.count = 0;
	                }
	            });

	            this.sharedStore.projectSettings = projects;
	        }
	    },
	    ready: function() {

	        // init project item list height
	        this.privateStore.minHeight = UtilWindow.getProjectListSize();

	        setTimeout(function(){
	            $("#project-div-0").css('background', '#f8f8f8');
	        },500);


	    }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	var ParamsManage = __webpack_require__(27);
	// component -- handle

	module.exports = {
	  template: '<div class="box-handle" id="handles-{{ id }}" v-bind:style="{ opacity: isShowHandles? 1: 0 }">' +
	              '<!-- center layer -->' +
	              '<div class="handle-center-layer" draggable="true"></div>' +
	              '<!-- top left corner handle -->' +
	              '<div class="handle-icon" id="" style="top: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
	              '<div class="handle handle-corner handle-top-left" id="" draggable="true" style="top: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
	              '<!-- top side handle -->' +
	              '<div class="handle-icon" id="" style="top: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
	              '<div class="handle handle-side handle-top-side" id="" draggable="true" style="top: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
	              '<!-- top right corner handle -->' +
	              '<div class="handle-icon" id="" style="top: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
	              '<div class="handle handle-corner handle-top-right" id="" draggable="true" style="top: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
	              '<!-- right side handle -->' +
	              '<div class="handle-icon" id="" style="top: {{ halfTop }}; right: -4px;" v-if="isSideHandles"></div>' +
	              '<div class="handle handle-side handle-right-side" id="" draggable="true" style="top: {{ halfTop }}; right: -4px;" v-if="isSideHandles"></div>' +
	              '<!-- bottom right corner handle -->' +
	              '<div class="handle-icon" id="" style="bottom: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
	              '<div class="handle handle-corner handle-bottom-right" id="" draggable="true" style="bottom: -4px; right: -4px;" v-if="isCornerHandles"></div>' +
	              '<!-- bottom side handle -->' +
	              '<div class="handle-icon" id="" style="bottom: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
	              '<div class="handle handle-side handle-bottom-side" id="" draggable="true" style="bottom: -4px; left: {{ halfLeft }};" v-if="isSideHandles"></div>' +
	              '<!-- bottom left corner handle -->' +
	              '<div class="handle-icon" id="" style="bottom: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
	              '<div class="handle handle-corner handle-bottom-left" id="" draggable="true" style="bottom: -4px; left: -4px;" v-if="isCornerHandles"></div>' +
	              '<!-- left side handle -->' +
	              '<div class="handle-icon" id="" style="top: {{ halfTop }}; left: -4px;" v-if="isSideHandles"></div>' +
	              '<div class="handle handle-side handle-left-side" id="" draggable="true" style="top: {{ halfTop }}; left: -4px;" v-if="isSideHandles"></div>' +
	            '</div>',
	  props: [
	    'id',
	    'isCornerHandles',
	    'isSideHandles',
	    'isShowHandles'
	  ],
	  data: function() {
	    return {

	    };
	  },
	  computed: {
	    halfLeft: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      var idx = ParamsManage.getIndexById(this.id);

	      return ((currentCanvas.params[idx].width / 2) * currentCanvas.ratio - 4) + 'px';
	    },

	    halfTop: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      var idx = ParamsManage.getIndexById(this.id);

	      return ((currentCanvas.params[idx].height / 2) * currentCanvas.ratio - 4) + 'px';
	    }
	  },
	  methods: {
	    bindHandleEvents: function(id) {
	      this.bindLayerEvents(id);

	      if(this.isCornerHandles) {
	        this.bindCornerEvents(id);
	      };

	      if(this.isSideHandles) {
	        this.bindSideEvents(id);
	      };

	    },

	    bindLayerEvents: function(id) {
	      var _this = this;
	      if(id != null) {
	        var handle = document.getElementById('handles-' + id),
	            centerLayer = handle.querySelector('.handle-center-layer');
	        var isInDragging = false;

	        var oriX, oriY, nowX, nowY;
	        var centerMouseMove,centerMouseUp;
	        if(id === 'bg') {
	          centerLayer.ondrop = function(ev) {
	            ev.preventDefault();

	            if(!isInDragging && Store.dragData.isFromList) {
	              console.log('drop', ev);
	              _this.$dispatch('dispatchDrop', { id: _this.id, x: ev.offsetX || ev.layerX || 0, y: ev.offsetY || ev.layerY || 0 });
	            };
	          };
	          centerLayer.ondragover = function(ev) {
	            ev.preventDefault();
	            if(!isInDragging) {
	            };
	          };
	          centerLayer.onclick = function(ev) {
	            console.log('click', ev);
	          };
	          centerLayer.ondblclick = function(ev) {
	            console.log('dbclick', ev);
	          };
	          centerLayer.onmouseover = function(ev) {
	          };
	          centerLayer.onmouseout = function(ev) {
	          };
	        }
	        else {
	          centerLayer.onmousedown = function(ev) {
	            ev.preventDefault();
	            isInDragging = true;

	            oriX = ev.screenX || 0;
	            oriY = ev.screenY || 0;
	            Store.operateMode = 'drag';
	            _this.$dispatch('dispatchDragStart');
	            centerMouseMove=function(ev){
	              ev.preventDefault();
	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              if(nowX === 0 && nowY === 0) {
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };
	              Store.operateMode = 'drag';
	              _this.$dispatch('dispatchMove', { x: movedX, y: movedY });
	            }

	            centerMouseUp=function(ev){

	              ev.preventDefault();
	              document.removeEventListener('mouseup',centerMouseUp);
	              document.removeEventListener('mousemove',centerMouseMove);
	              isInDragging = false;

	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              console.log(ev, nowX, nowY);
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              if(nowX === 0 && nowY === 0) {
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };
	              if(Math.abs(movedX) > 8 || Math.abs(movedY) > 8) {
	                movedX = 0;
	                movedY = 0;
	              };
	              _this.$dispatch('dispatchMove', { x: movedX, y: movedY });
	              _this.$dispatch('dispatchDragEnd');
	              Store.operateMode = 'idle';
	            }
	            document.addEventListener('mouseup',centerMouseUp);
	            document.addEventListener('mousemove',centerMouseMove);
	          };
	          centerLayer.ondrop = function(ev) {
	            ev.preventDefault();

	            if(!isInDragging && Store.dragData.isFromList) {
	              console.log('drop', ev);
	              _this.$dispatch('dispatchDrop', { id: _this.id, x: ev.offsetX || ev.layerX || 0, y: ev.offsetY || ev.layerY || 0 });
	            };
	          };;
	          centerLayer.ondragover = function(ev) {
	            ev.preventDefault();
	            if(!isInDragging) {
	              _this.$dispatch('dispatchDragOver');
	            };
	          };
	          centerLayer.onclick = function(ev) {
	            ev.stopPropagation();
	            console.log('click', ev);
	            _this.$dispatch('dispatchClick');
	          };
	          centerLayer.ondblclick = function(ev) {
	            console.log('dbclick', ev);
	            _this.$dispatch('dispatchDblClick');
	          };
	          centerLayer.onmouseover = function(ev) {
	            _this.$dispatch('dispatchMouseOver');
	          };
	          centerLayer.onmouseout = function(ev) {
	            _this.$dispatch('dispatchMouseOut');
	          };
	        };

	        // bind document event for key press here
	        // NOTE: in fact, this event should be binded only once, but it's with no side effect, we consider it and ignore the rebindings for it...
	        document.onkeypress = function(ev) {
	          console.log('key press', ev);
	        };
	      };
	    },

	    bindCornerEvents: function(id) {
	      if(id != null) {
	        var _this = this;
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	        var handle = document.getElementById('handles-' + id),
	            corners = handle.querySelectorAll('.handle-corner');

	        var oriX, oriY, nowX, nowY;
	        var cornerMouseMove,cornerMouseUp;
	        for(var i in corners) {
	          var item = corners[i];

	          item.onmousedown = function(ev) {
	            ev.stopPropagation();
	            ev.preventDefault();
	            oriX = ev.screenX || 0;
	            oriY = ev.screenY || 0;
	            // console.log(oriX, oriY);

	            Store.operateMode = 'scale';
	            _this.$dispatch('dispatchScaleStart');
	            var className=ev.target.className;
	            cornerMouseMove=function(ev){
	              // console.log('drag', ev);
	              ev.preventDefault();
	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              // value fix for jumping drag...
	              if(nowX === 0 && nowY === 0) {
	                // jumping happens
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };

	              // console.log(movedX, movedY);
	              var idx = ParamsManage.getIndexById(_this.id);
	              if(className.indexOf('top-left') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X

	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY });
	                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY });
	              }
	              else if(className.indexOf('top-right') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: 0, y: -1 * fixedMovedY });
	                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY });
	              }
	              else if(className.indexOf('bottom-left') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: movedX, y: 0 });
	                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY });
	              }
	              else if(className.indexOf('bottom-right') !== -1) {
	                // only resize
	                // bottom right handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY });
	              };
	              Store.operateMode = 'scale';
	            }

	            cornerMouseUp=function(ev){
	              ev.preventDefault();
	              document.removeEventListener('mousemove',cornerMouseMove);
	              document.removeEventListener('mouseup',cornerMouseUp);
	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              // value fix for jumping drag...
	              if(nowX === 0 && nowY === 0) {
	                // jumping happens
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };

	              // console.log(movedX, movedY);
	              var idx = ParamsManage.getIndexById(_this.id);
	              if(className.indexOf('top-left') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY });
	                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY });
	              }
	              else if(className.indexOf('top-right') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: 0, y: -1 * fixedMovedY });
	                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY });
	              }
	              else if(className.indexOf('bottom-left') !== -1) {
	                // need to dispatch move as well
	                // top left handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchMove', { x: movedX, y: 0 });
	                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY });
	              }
	              else if(className.indexOf('bottom-right') !== -1) {
	                // only resize
	                // bottom right handle, fix moved value by X
	                var fixedMovedY = movedX * currentCanvas.params[idx].height / currentCanvas.params[idx].width;
	                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY });
	              };
	              Store.operateMode = 'idle';
	            }
	            document.addEventListener('mousemove',cornerMouseMove);
	            document.addEventListener('mouseup',cornerMouseUp);
	          };

	          item.onclick = function(ev) {
	            ev.stopPropagation();
	            console.log('cornerClick', ev);
	            _this.$dispatch('dispatchCornerClick');
	          };
	        };
	      };
	    },

	    bindSideEvents: function(id) {
	      if(id != null) {
	        var _this = this;
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	        var handle = document.getElementById('handles-' + id),
	            sides = handle.querySelectorAll('.handle-side');

	        var oriX, oriY, nowX, nowY;
	        var sideMouseMove,sideMouseUp;
	        
	        for(var i in sides) {
	          var item = sides[i];

	          item.onmousedown = function(ev) {
	            ev.preventDefault();
	            ev.stopPropagation();
	            var className=ev.target.className;
	            oriX = ev.screenX || 0;
	            oriY = ev.screenY || 0;

	            Store.operateMode = 'scale';
	            _this.$dispatch('dispatchScaleStart');

	            sideMouseMove=function(ev){
	              ev.preventDefault();
	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              // value fix for jumping drag...
	              if(nowX === 0 && nowY === 0) {
	                // jumping happens
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };

	              // console.log('moved:', movedX, movedY);

	              if(className.indexOf('top') !== -1) {
	                // need to dispatch move as well
	                // top side handle, fix moved value by Y
	                var fixedMovedX = 0;
	                _this.$dispatch('dispatchMove', { x: fixedMovedX, y: movedY })
	                _this.$dispatch('dispatchScale', { width: -1 * fixedMovedX, height: -1 * movedY })
	              }
	              else if(className.indexOf('left') !== -1) {
	                // need to dispatch move as well
	                // top side handle, fix moved value by X
	                var fixedMovedY = 0;
	                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY })
	                _this.$dispatch('dispatchScale', { width: -1 * movedX, height: -1 * fixedMovedY })
	              }
	              else if(className.indexOf('right') !== -1) {
	                // only resize
	                // right side handle, fix moved value by X
	                var fixedMovedY = 0;
	                _this.$dispatch('dispatchScale', { width: movedX, height: fixedMovedY })
	              }
	              else if(className.indexOf('bottom') !== -1) {
	                // bottom side handle, fix moved value by Y
	                var fixedMovedX = 0;
	                // console.log('dispatch', fixedMovedX, movedY);
	                _this.$dispatch('dispatchScale', { width: fixedMovedX, height: movedY })
	              };
	              Store.operateMode = 'scale';
	            }

	            sideMouseUp=function(ev){
	              ev.preventDefault();
	              document.removeEventListener('mousemove',sideMouseMove);
	              document.removeEventListener('mouseup',sideMouseUp);
	              nowX = ev.screenX || 0;
	              nowY = ev.screenY || 0;
	              var movedX = nowX - oriX,
	                  movedY = nowY - oriY;
	              // value fix for jumping drag...
	              if(nowX === 0 && nowY === 0) {
	                // jumping happens
	                movedX = movedY = 0;
	              }
	              else {
	                oriX = nowX;
	                oriY = nowY;
	              };

	              // console.log('moved:', movedX, movedY);

	              if(className.indexOf('top') !== -1) {
	                // need to dispatch move as well
	                // top side handle, fix moved value by Y
	                var fixedMovedX = 0;
	                _this.$dispatch('dispatchMove', { x: fixedMovedX, y: movedY })
	                _this.$dispatch('dispatchScaleEnd', { width: -1 * fixedMovedX, height: -1 * movedY })
	              }
	              else if(className.indexOf('left') !== -1) {
	                // need to dispatch move as well
	                // top side handle, fix moved value by X
	                var fixedMovedY = 0;
	                _this.$dispatch('dispatchMove', { x: movedX, y: fixedMovedY })
	                _this.$dispatch('dispatchScaleEnd', { width: -1 * movedX, height: -1 * fixedMovedY })
	              }
	              else if(className.indexOf('right') !== -1) {
	                // only resize
	                // right side handle, fix moved value by X
	                var fixedMovedY = 0;
	                _this.$dispatch('dispatchScaleEnd', { width: movedX, height: fixedMovedY })
	              }
	              else if(className.indexOf('bottom') !== -1) {
	                // bottom side handle, fix moved value by Y
	                var fixedMovedX = 0;
	                // console.log('dispatch', fixedMovedX, movedY);
	                _this.$dispatch('dispatchScaleEnd', { width: fixedMovedX, height: movedY })
	              };
	              Store.operateMode = 'idle';
	            }
	            document.addEventListener('mousemove',sideMouseMove);
	            document.addEventListener('mouseup',sideMouseUp);

	          };

	          item.onclick = function(ev) {
	            ev.stopPropagation();
	            console.log('sideClick', ev);
	            _this.$dispatch('dispatchSideClick');
	          };
	        };
	      };
	    },


	  },
	  ready: function() {
	    this.bindHandleEvents(this.id);
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var ParamsManage = __webpack_require__(27);
	// var CanvasController = require('CanvasController');

	// component -- bar

	module.exports = {
	  template: '<div class="box-bar" v-bind:style="{ width: boxWidth + \'px\', left: boxLeft + \'px\', top: boxTop + \'px\', zIndex: windowZindex }">' +
	              '<!-- image bars -->' +
	              // '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(-90)" title="Rotate left" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
	              //   '<img draggable="false" src="../../static/img/bar-rotate-left.png" alt="RF" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
	              // '</span>' +
	              '<span class="button" v-if="type === \'image\'" v-on:click="handleEditImage()" title="Click to crop image" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
	                '<img draggable="false" src="../../static/img/bar-crop.png" alt="CR" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
	              '</span>' +
	              '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(90)" title="Rotate right" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
	                '<img draggable="false" src="../../static/img/bar-rotate-right.png" alt="RR" style="width: 20px; height: 20px; margin-top: 5px;" />' +
	              '</span>' +
	              '<span class="button" v-if="type === \'image\'" v-on:click="handleHCenterImage()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
	                '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
	              '</span>' +
	              '<span class="button"  v-if="type === \'image\'" v-on:click.stop="handleLayer()" title="Layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
	                '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
	              '</span>' +
	              '<span class="button" v-if="type === \'image\'" v-on:click="handleRemoveImage()" title="Remove" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
	                '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
	              '</span>' +
	              '<!-- text bars -->' +
	              '<span class="button" v-if="type === \'text\'" v-on:click="handleEditText()" title="Edit" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
	                '<img draggable="false" src="../../static/img/bar-edit.png" alt="ET" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
	              '</span>' +
	              '<span class="button" v-if="type === \'text\'" v-on:click="handleHCenterText()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
	                '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
	              '</span>' +
	              '<span class="button"  v-if="type === \'text\'" v-on:click.stop="handleLayer()" title="layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
	                '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
	              '</span>' +
	              '<span class="button" v-if="type === \'text\'" v-on:click="handleRemoveText()" title="Remove" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
	                '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
	              '</span>' +
	              '<subbar-panel v-bind:idx="idx"></subbar-panel>' +
	            '</div>',
	  // props: [
	  //   'id',
	  //   'type',
	  //   'width',
	  //   'height',
	  //   // 'enables'
	  // ],
	  data: function() {
	    return {
	      // boxWidth: 133,
	      boxHeight: 30,
	      id: 0,
	      sharedStore: Store
	    };
	  },
	  computed: {
	    boxWidth: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'image') {
	        return 165;
	      }
	      else if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'text') {
	        return 135;
	      }
	      else {
	        return 0;
	      };
	    },

	    idx : function(){
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      return currentCanvas.selectedIdx;
	    },

	    boxLeft: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          // idx = ParamsManage.getIndexById(this.id),
	          idx = currentCanvas.selectedIdx,
	          parentEl = currentCanvas.params[idx];
	      this.width = parentEl.width * currentCanvas.ratio;
	      var extendSize = -1 * (this.width - this.boxWidth) / 2;

	      if((parentEl.x * currentCanvas.ratio - extendSize) < 0) {
	        // over left side
	        // return (this.width - this.boxWidth) / 2 + Math.abs(parentEl.x * currentCanvas.ratio - extendSize);
	        return 4;
	      }
	      else if((parentEl.x * currentCanvas.ratio + this.width + extendSize) > currentCanvas.width) {
	        // over right side
	        // return (this.width - this.boxWidth) / 2 - Math.abs(parentEl.x * currentCanvas.ratio + this.width + extendSize - currentCanvas.width);
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        return currentCanvas.width - this.boxWidth - 4;
	      }
	      else {
	        // normal case
	        return (this.width - this.boxWidth) / 2 + parentEl.x * currentCanvas.ratio;
	      };

	    },

	    boxTop: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx,
	          parentEl = currentCanvas.params[idx];
	      this.height = parentEl.height * currentCanvas.ratio;
	      if((parentEl.y * currentCanvas.ratio + this.height + this.boxHeight + 4) >= (currentCanvas.height)) {
	        // cannot show downside bar
	        // if(parentEl.y * currentCanvas.ratio > (this.boxHeight + 10)) {
	        //   // can show on topside
	        //   return (this.height + 4);
	        // }
	        // else {
	          // show bottom as fixed...
	          // var hiddenInBottom = parentEl.y * currentCanvas.ratio + this.height - (currentCanvas.height - 10);
	          // return hiddenInBottom + 4;
	          return currentCanvas.height - this.boxHeight - 4;

	          // return (this.height - this.boxHeight) / 2;
	        // };
	      }
	      else {
	        // return (0 - this.boxHeight - 4);
	        return parentEl.y * currentCanvas.ratio + parentEl.height * currentCanvas.ratio + 4;
	      };
	    },

	    // boxBottom: function() {
	    //   var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	    //       // idx = ParamsManage.getIndexById(this.id),
	    //       idx = currentCanvas.selectedIdx,
	    //       parentEl = currentCanvas.params[idx];
	    //   this.height = parentEl.height * currentCanvas.ratio;
	    //
	    //   if((parentEl.y * currentCanvas.ratio + this.height + this.boxHeight + 4) >= (currentCanvas.height)) {
	    //     // cannot show downside bar
	    //     // if(parentEl.y * currentCanvas.ratio > (this.boxHeight + 10)) {
	    //     //   // can show on topside
	    //     //   return (this.height + 4);
	    //     // }
	    //     // else {
	    //       // show bottom as fixed...
	    //       var hiddenInBottom = parentEl.y * currentCanvas.ratio + this.height - (currentCanvas.height);
	    //       return hiddenInBottom + 4;
	    //
	    //       // return (this.height - this.boxHeight) / 2;
	    //     // };
	    //   }
	    //   else {
	    //     return (0 - this.boxHeight - 4);
	    //   };
	    // },

	    windowZindex: function() {
	      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	      //     idx = ParamsManage.getIndexById(this.id),
	      //     parentEl = currentCanvas.params[idx];
	      //
	      // return (parentEl.dep + 1) * 100 + 90;
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          elementTotal = currentCanvas.params.length || 0;

	      return (elementTotal + 10) * 100;
	    },

	    type : function(){
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      return currentCanvas.params[currentCanvas.selectedIdx].elType ? currentCanvas.params[currentCanvas.selectedIdx].elType : '';
	    }
	  },
	  methods: {
	    handleRemoveImage: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx;

	      Store.watchData.removeElementIdx = idx;
	      Store.watchData.removeElementType = 'image';
	      Store.watches.isRemoveElement = true;

	      __webpack_require__(11)({ev: __webpack_require__(13).ClickRemoveImage});
	      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'image' });
	    },

	    handleRemoveText: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx;

	      Store.watchData.removeElementIdx = idx;
	      Store.watchData.removeElementType = 'text';
	      Store.watches.isRemoveElement = true;

	      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'text' });
	    },

	    handleRotate: function(nDegree) {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx;

	      Store.vm.$broadcast('notifyRotateImage', { idx: idx, nDegree: nDegree });
	      __webpack_require__(11)({ev: __webpack_require__(13).ClickRotateImage});
	    },

	    handleEditImage: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx;

	      Store.watchData.cropImageIdx = idx;
	      Store.watches.isCropThisImage = true;
	      __webpack_require__(11)({ev: __webpack_require__(13).ClickCropImage});
	    },

	    handleEditText: function() {
	      Store.watches.isChangeThisText = true;
	    },

	    handleHCenterImage: function() {
	      this.$dispatch('dispatchHCenter');
	      __webpack_require__(11)({ev: __webpack_require__(13).ClickMoveImageToCenter});
	      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	      //     idx = currentCanvas.selectedIdx;
	      //
	      // require('CanvasController').hCenterElement(idx);
	    },

	    handleHCenterText: function() {
	      this.$dispatch('dispatchHCenter');
	      __webpack_require__(11)({ev: __webpack_require__(13).ClickMoveTextToCenter});
	      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	      //     idx = currentCanvas.selectedIdx;
	      //
	      // require('CanvasController').hCenterElement(idx);
	    },

	    handleLayer : function(){
	      this.sharedStore.isEditLayerShow = !this.sharedStore.isEditLayerShow;
	    },
	  },
	  events: {

	  },
	  ready: function() {
	    // if(this.type === 'image') {
	    //   this.boxWidth = 135;
	    // }
	    // else if(this.type === 'text') {
	    //   this.boxWidth = 105;
	    // };
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var ParamsManage = __webpack_require__(27);
	// component -- bar

	module.exports = {
	  template: '<!-- top sub bar -->' +
	            '<ul class="sub-box-bar" id="box-subbar-top" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'top\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: -175px;left: 0;">' +
	              '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
	              '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
	              '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
	              '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
	            '</ul>' +
	            '<!-- bottom sub bar -->' +
	            '<ul class="sub-box-bar" id="box-subbar-bottom" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'bottom\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: 45px;left: 0;">' +
	              '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
	              '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
	              '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
	              '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
	            '</ul>',
	  props: [
	    'idx'
	  ],
	  data: function() {
	    return {
	      boxWidth: 150,
	      boxHeight: 30,
	       fullBoxHeight: 165,
	      sharedStore : Store
	    };
	  },
	  computed: {
	    // to determine which subbar should be shown
	    toggleSubbar: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      if((currentCanvas.params[currentCanvas.selectedIdx].y + currentCanvas.params[currentCanvas.selectedIdx].height) * currentCanvas.ratio < this.fullBoxHeight) {
	        // cannot display top sub bar entirly, should bottom instead
	        return 'bottom';
	      }
	      else {
	        return 'top';
	      };
	    },
	    windowZindex: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          parentEl = currentCanvas.params[this.idx];

	      return (parentEl.dep + 1) * 100 + 90;
	    }
	  },
	  methods: {
	    handleToFront : function(){
	      __webpack_require__(25).sendToFront({idx:this.idx});
	      this.sharedStore.isEditLayerShow = false;
	    },

	    handleToBack : function(){
	      __webpack_require__(25).sendToBack({idx:this.idx});
	      this.sharedStore.isEditLayerShow = false;
	    },

	    handleForward : function(){
	      __webpack_require__(25).bringForward({idx:this.idx});
	      this.sharedStore.isEditLayerShow = false;
	    },

	    handleBackward : function(){
	      __webpack_require__(25).bringBackward({idx:this.idx});
	      this.sharedStore.isEditLayerShow = false;
	    },
	  },
	  events: {

	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    mixins: [
	            __webpack_require__(44)
	    ],
	    template: '<div style="position:absolute;" v-bind:style="{backgroundColor:bgColor,left:elementData.x*ratio + \'px\',top:elementData.y*ratio + \'px\',width: viewSize.width + \'px\',height:viewSize.height + \'px\',zIndex:(elementData.dep+1)*100}">' +
	                    '<img v-bind:src="photoSrc" style="position:absolute;left:0;top:0;opacity:0.2;" v-bind:style="{width: viewSize.width + \'px\',height:viewSize.height + \'px\'}" v-show="backImgShow" />'+
	                    '<canvas id="photoElementCanvas{{id}}"  style="position:absolute;top:0;left:0;" width="{{viewSize.width}}" height="{{viewSize.height}}"></canvas>'+
	                    '<warntip-element v-bind:id="id" v-if="!sharedStore.isPreview" v-bind:width="viewSize.width" v-bind:height="viewSize.height"></warntip-element>'+
	                    '<handle v-if="!sharedStore.isPreview"  v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
	                    // '<bar-panel v-if="!sharedStore.isPreview&&isShowHandle" v-bind:type="type" v-bind:id="id" v-bind:width="viewSize.width" v-bind:height="viewSize.height"></bar-panel>' +
	              '</div>',
	    data: function() {
	        return {
	            sharedStore: Store,
	            elementData:Object,
	            ratio:0,
	            id:0,
	            isCornerHandles:true,
	            isSideHandles:true,
	            imageData:null,
	            type:'image',
	            photoSrc:'',
	            backImgShow:false
	        };
	    },
	    computed: {
	        isShowHandle:function(){
	             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	             if(currentCanvas.selectedIdx===__webpack_require__(27).getIndexById(this.id) && !Store.isLostFocus){
	                return true;
	             }else{
	                return false;
	             }
	        },

	        viewSize: function() {
	          var width = Math.ceil(this.elementData.width * this.ratio);
	          var height = Math.ceil(this.elementData.height * this.ratio);

	          return {
	            width: width,
	            height: height
	          };
	        },
	        bgColor:function(){
	            if(this.elementData.imageId){
	                return 'rgba(255,255,255,0)';
	            }else{
	                return '#f5f5f5';
	            }
	        }
	    },
	    methods: {
	        init:function(idx){


	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            this.elementData=currentCanvas.params[idx];
	            this.id=this.elementData.id;
	            this.ratio=currentCanvas.ratio;


	        },
	        destroy:function(){

	        },
	        refreshImage:function(url){
	            __webpack_require__(16).clear("photoElementCanvas"+this.id);

	            __webpack_require__(16).drawImage("photoElementCanvas"+this.id, url, 0, 0,function(){
	                Store.vm.$broadcast("notifyRefreshScreenshot");
	            },this.viewSize.width,this.viewSize.height);
	            this.photoSrc=url;
	        },
	        onDragOver:function(){

	        },
	        setCrop:function(){

	            if (Math.abs(this.elementData.imageRotate) === 90) {

	                var cWidth = __webpack_require__(26).getImageDetail(this.elementData.imageId).height,
	                    cHeight = __webpack_require__(26).getImageDetail(this.elementData.imageId).width;
	            } else {
	                var cWidth = __webpack_require__(26).getImageDetail(this.elementData.imageId).width,
	                    cHeight = __webpack_require__(26).getImageDetail(this.elementData.imageId).height;
	            };

	            var cropPX = this.elementData.cropPX;
	            var cropPY = this.elementData.cropPY;
	            var cropPW = this.elementData.cropPW;
	            var cropPH = this.elementData.cropPH;
	            //console.log(this.elementData.cropPX,this.elementData.cropPY,this.elementData.cropPW,this.elementData.cropPH);
	            var width = this.elementData.width;
	            var height = this.elementData.height;
	            var cropLUX = cropPX;
	            var cropRLX = cropPX + cropPW;
	            var cropLUY = cropPY;
	            var cropRLY = cropPY + cropPH;
	            var viewRatio = height / width;
	            var photoImageW = cWidth;
	            var photoImageH = cHeight;
	            var oldHWAspectRatio = (cropRLY - cropLUY) / (cropRLX - cropLUX);
	            var cropCenterX = cropLUX + (cropRLX - cropLUX) / 2;
	            var cropCenterY = cropLUY + (cropRLY - cropLUY) / 2;
	            var oldCropX = cropLUX * photoImageW;
	            var oldCropY = cropLUY * photoImageH;
	            var oldCropW = (cropRLX - cropLUX) * photoImageW;
	            var oldCropH = (cropRLY - cropLUY) * photoImageH;
	            var oldCropCenterX = cropCenterX * photoImageW;
	            var oldCropCenterY = cropCenterY * photoImageH;

	            var cropUnitsPercentX = (cropRLX - cropLUX) * photoImageW / width;
	            var cropUnitsPercentY = (cropRLY - cropLUY) * photoImageH / height;

	            var newCropW = width * cropUnitsPercentX;
	            var newCropH = height * cropUnitsPercentY;
	            if(newCropW > photoImageW){
	                newCropW = photoImageW;
	            }
	            if(newCropH > photoImageH){
	                newCropH = photoImageH;
	            }

	            var resultX;
	            var resultY;
	            var resultW;
	            var resultH;
	            if(newCropW * viewRatio > newCropH){
	                resultH = newCropH;
	                resultW = newCropH / viewRatio;
	            }else{
	                resultW = newCropW;
	                resultH = newCropW * viewRatio;
	            }

	            resultX = oldCropCenterX - resultW/2;
	            resultX = resultX > 0 ? resultX : 0;
	            if(resultX + resultW > photoImageW){
	                resultX = resultX - (resultX + resultW - photoImageW);
	                resultX = resultX > 0 ? resultX : 0;
	            }

	            resultY = oldCropCenterY - resultH/2;
	            resultY = resultY > 0 ? resultY : 0;
	            if(resultY + resultH > photoImageH){
	                resultY = resultY - (resultY + resultH - photoImageH);
	                resultY = resultY > 0 ? resultY : 0;
	            }

	            this.elementData.cropPX=resultX / photoImageW|| 0;
	            this.elementData.cropPY=resultY / photoImageH|| 0;
	            this.elementData.cropPW=resultW / photoImageW|| 1;
	            this.elementData.cropPH=resultH / photoImageH|| 1;

	            //console.log(this.elementData.cropPX,this.elementData.cropPY,this.elementData.cropPW,this.elementData.cropPH);
	        },
	        setIndex:function(){
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            currentCanvas.selectedIdx=__webpack_require__(27).getIndexById(this.id);

	            Store.isLostFocus = false;

	            // console.log("dispatchDepthFront");
	            // Store.watchData.changeDepthIdx=require("ParamsManage").getIndexById(this.id);
	            // Store.watches.isChangeDepthFront=true;

	        },
	        refreshImageById:function(imageId){
	            //console.log("refreshImageById",imageId);
	            Store.dropData.isBg=false;
	            Store.dropData.newAdded=false;
	            Store.dropData.idx=__webpack_require__(27).getIndexById(this.id);
	            Store.watches.isOnDrop=true;
	            /*this.elementData.imageId=imageId;
	            this.setCrop();
	            this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));*/

	        }
	    },
	    events: {

	        refreshHandler:function(url){
	            this.refreshImage(__webpack_require__(27).getCropImageUrl(__webpack_require__(27).getIndexById(this.id)));
	        },
	        dispatchScaleEnd:function(data){
	            this.backImgShow=false;
	            var width=this.elementData.width+data.width/this.ratio;
	            if(width>=300){
	                this.elementData.width+=data.width/this.ratio;
	            }
	            var height=this.elementData.height+data.height/this.ratio;
	            if(height>=300){
	                this.elementData.height+=data.height/this.ratio;
	            }

	            this.setCrop();
	            this.refreshImage(__webpack_require__(27).getCropImageUrl(__webpack_require__(27).getIndexById(this.id)));
	        },
	        dispatchScaleStart:function(){

	             this.setIndex();
	             __webpack_require__(16).clear("photoElementCanvas"+this.id);
	             this.backImgShow=true;
	             //this.imageData=require("DrawManage").getImageData("photoElementCanvas"+this.id);
	        },
	        dispatchClick:function(){
	            this.setIndex();
	            this.sharedStore.isEditLayerShow = false;
	        },
	        dispatchMove:function(data){

	            this.setIndex();

	            Store.vm.$broadcast("notifyRefreshScreenshot");
	        },
	        dispatchDblClick:function(){
	            console.log("dispatchDblClick");
	            Store.watchData.cropImageIdx=__webpack_require__(27).getIndexById(this.id);
	            Store.watches.isCropThisImage = true;
	        },
	        dispatchDrop:function(event){
	            //console.log(event);
	            //console.log(Store.dragData);
	            if(this.elementData.imageId){
	                Store.dropData.idx=__webpack_require__(27).getIndexById(this.id);
	                Store.watches.isReplaceImage=true;
	                Store.vm.$broadcast('notifyAddOrReplaceImage',{id:event.id,x:event.x+this.elementData.x*this.ratio,y:event.y+this.elementData.y*this.ratio});

	            }else{
	                Store.dropData.isBg=false;
	                Store.dropData.newAdded=false;
	                Store.dropData.idx=__webpack_require__(27).getIndexById(this.id);
	                Store.watches.isOnDrop=true;
	                /*this.elementData.imageId=Store.dragData.imageId;
	                this.setCrop();
	                this.refreshImage(require("ParamsManage").getCropImageUrl(require("ParamsManage").getIndexById(this.id)));*/
	            }

	        },
	        dispatchScale:function(data){

	            var width=this.elementData.width+data.width/this.ratio;
	            if(width>=300){
	                this.elementData.width+=data.width/this.ratio;
	            }
	            var height=this.elementData.height+data.height/this.ratio;
	            if(height>=300){
	                this.elementData.height+=data.height/this.ratio;
	            }


	        }
	    },
	    created:function(){
	    },
	    ready:function(){

	        var _this=this;
	        if(this.elementData.imageId){
	            this.refreshImage(__webpack_require__(27).getCropImageUrl(__webpack_require__(27).getIndexById(this.id)));
	        }
	        this.$watch('elementData.isRefresh',function(){
	            if(_this.elementData.isRefresh){
	                _this.elementData.isRefresh=false;
	                console.log("refreshUrl");
	                _this.refreshImage(__webpack_require__(27).getCropImageUrl(__webpack_require__(27).getIndexById(_this.id)));
	            }

	        })
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
		events: {

	        dispatchRotate:function(){

	        },
	        dispatchDragEnd:function(){
	        	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio){
	            	this.elementData.x=0;
	            	if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio*0.8){
	            		this.elementData.y=0;
	            	}
	            }

	            if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio){
	            	this.elementData.y=0;
	            	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio*0.8){
	            		this.elementData.x=0;
	            	}
	            }


	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            if(this.elementData.x*this.ratio>currentCanvas.width){
	            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
	            	if(this.elementData.y*this.ratio>currentCanvas.height*0.8){
		            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
		            }
	            }
	            if(this.elementData.y*this.ratio>currentCanvas.height){
	            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
	            	if(this.elementData.x*this.ratio>currentCanvas.width*0.8){
		            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
		            }
	            }
	        },
	        dispatchScaleEnd:function(){
	        	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio){
	            	this.elementData.x=0;
	            	if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio*0.8){
	            		this.elementData.y=0;
	            	}
	            }

	            if(this.elementData.y*this.ratio<-this.elementData.height*this.ratio){
	            	this.elementData.y=0;
	            	if(this.elementData.x*this.ratio<-this.elementData.width*this.ratio*0.8){
	            		this.elementData.x=0;
	            	}
	            }


	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            if(this.elementData.x*this.ratio>currentCanvas.width){
	            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
	            	if(this.elementData.y*this.ratio>currentCanvas.height*0.8){
		            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
		            }
	            }
	            if(this.elementData.y*this.ratio>currentCanvas.height){
	            	this.elementData.y=currentCanvas.height/this.ratio-this.elementData.height;
	            	if(this.elementData.x*this.ratio>currentCanvas.width*0.8){
		            	this.elementData.x=currentCanvas.width/this.ratio-this.elementData.width;
		            }
	            }
	        },
	        dispatchMove:function(data){

	            this.elementData.x+=data.x/this.ratio;
	            this.elementData.y+=data.y/this.ratio;

	        },
	        // dispatchHCenter:function(){
	        // 	var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        // 	var canvasWidth =currentCanvas.width;
	        // 	var canvasHeight=currentCanvas.height;
	        // 	var elementWidth = this.elementData.width*this.ratio;
	        // 	var elementHeight = this.elementData.height*this.ratio;
					//
	        // 	this.elementData.x=(canvasWidth-elementWidth)/2/this.ratio;
	        // 	//alert(elementWidth);
	        // },
	        dispatchCornerClick:function(){
	            this.setIndex();
	            Store.isEditLayerShow = false;
	        },
	        dispatchSideClick:function(){
	            this.setIndex();
	            Store.isEditLayerShow = false;
	        }
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var UtilMath = __webpack_require__(7);
	module.exports = {
	    mixins: [
	            __webpack_require__(44)
	    ],
	    template: '<div style="position:absolute;cursor:move;" v-bind:style="{left:elementData.x*ratio + \'px\',zIndex: ( elementData.dep + 1 ) * 100, top:elementData.y*ratio + \'px\',width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}">' +
	                '<canvas id="textElementCanvas{{id}}" width="{{elementData.width*ratio}}px" height="{{elementData.height*ratio}}px" style="position:absolute;top:0;left:0;"></canvas>'+
	                '<img v-bind:src="textSrc" style="position:absolute;left:0;top:0;"v-bind:style="{width: elementData.width*ratio + \'px\',height:elementData.height*ratio + \'px\'}" v-show="backImgShow" />'+
	                '<handle v-if="!sharedStore.isPreview" v-bind:id="id" v-bind:is-Show-Handles="isShowHandle" v-bind:is-Corner-Handles="isCornerHandles" v-bind:is-Side-Handles="isSideHandles"></handle>'+
	                // '<bar-panel v-if="!sharedStore.isPreview&&isShowHandle" v-bind:type="type" v-bind:id="id" v-bind:width="elementData.width*ratio" v-bind:height="elementData.height*ratio"></bar-panel>' +

	            '</div>',
	    data: function() {
	        return {
	            privateStore: {},
	            sharedStore: Store,
	            elementData:Object,
	            ratio : 0,
	            lastSize : 0,
	            fontRatio : 0,
	            textSrc : '',
	            limitHeight : [],
	            limitSize : [],
	            allow : true,
	            backImgShow : false,
	            isCornerHandles:true,
	            isSideHandles:false,
	            imageRatio : 0,
	            type:'text',
	            id:0
	        };
	    },
	    computed: {
	        isShowHandle:function(){
	             var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	             if(currentCanvas.selectedIdx === __webpack_require__(27).getIndexById(this.id) && !Store.isLostFocus){
	                return true;
	             }else{
	                return false;
	             }
	        }
	    },
	    methods: {
	        init:function(idx){
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            this.elementData=currentCanvas.params[idx];
	            this.ratio=currentCanvas.ratio;
	            this.id=this.elementData.id;
	            this.lastSize = Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[idx].fontSize));
	        },
	        destroy:function(){

	        },
	        refreshText:function(){
	            var img=new Image(),
	                _this = this,
	                url = _this.getTextImageUrl()
	                currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            img.src = url;
	            img.onload = function ()
	            {
	                _this.elementData.width = this.width;
	                _this.elementData.height = this.height;
	                _this.imageRatio = this.width / this.height;
	                currentCanvas.params[__webpack_require__(27).getIndexById(_this.id)].width = this.width/_this.ratio;
	                currentCanvas.params[__webpack_require__(27).getIndexById(_this.id)].height = this.height/_this.ratio;
	                if(!_this.fontRatio){
	                    _this.fontRatio = currentCanvas.params[__webpack_require__(27).getIndexById(_this.id)].height / Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[__webpack_require__(27).getIndexById(_this.id)].fontSize));
	                }
	                if(!_this.limitHeight.length){
	                    _this.limitHeight.push(_this.limitSize[0]*_this.fontRatio);
	                    _this.limitHeight.push(_this.limitSize[1]*_this.fontRatio);
	                }
	                __webpack_require__(16).drawImage("textElementCanvas"+ (_this.id), url, 0, 0,function(){
	                    Store.vm.$broadcast('notifyRefreshScreenshot');
	                },this.width,this.height);
	            }
	            _this.textSrc = url;
	        },
	        getTextImageUrl : function(){
	            var idx = __webpack_require__(27).getIndexById(this.id),
	                currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	                fontUrl = '../../static/img/blank.png',
	                fontViewSize = 0,
	                size = 0;
	            size = Math.round(__webpack_require__(7).getTextViewFontSize(currentCanvas.params[idx].fontSize));
	            if(!this.fontRatio || this.lastSize !== size || !this.allow){
	                fontViewSize = size;
	                this.allow = true;
	            }else{
	                currentCanvas.params[idx].fontSize = (this.elementData.height / this.fontRatio) / this.ratio;
	                fontViewSize = Math.round(__webpack_require__(7).getTextViewFontSize(currentCanvas.params[idx].fontSize));
	            }
	            this.lastSize = fontViewSize;
	            if(fontViewSize>0){
	                if(currentCanvas.params[idx].text===''){
	                    if(Store.isPreview) {
	                        fontUrl = '../../static/img/blank.png';
	                    }
	                    else {
	                        fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
	                    }
	                }else{
	                    fontUrl = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(currentCanvas.params[idx].text)+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
	                }
	            }
	            return fontUrl;
	        },
	        onDoubleClick:function(event){

	        },
	        onDragOver:function(){

	        },
	        setIndex:function(){
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	            currentCanvas.selectedIdx = __webpack_require__(27).getIndexById(this.id);

	            Store.isLostFocus = false;

	            // Store.watchData.changeDepthIdx=require("ParamsManage").getIndexById(this.id);
	            // Store.watches.isChangeDepthFront=true;
	        },
	        getlimitHeight : function(){

	        },
	        setLimitSize : function(){
	            var minSize = UtilMath.getTextViewFontSize(UtilMath.getPxByInch(0.3)),
	                maxSize = UtilMath.getTextViewFontSize(UtilMath.getPxByInch(16));
	            this.limitSize.push(minSize)
	            this.limitSize.push(maxSize)
	        }
	    },
	    events: {
	        dispatchRefresh : function(){
	            this.refreshText();
	        },
	         dispatchScaleEnd:function(data){
	            var curWidth = this.elementData.width + data.width/this.ratio,
	                curHeight = this.elementData.height + data.height/this.ratio;
	            // console.log(curHeight,this.limitHeight)
	            if(curHeight<=this.limitHeight[0]){
	                this.elementData.width = this.limitHeight[0] * this.imageRatio;
	                this.elementData.height = this.limitHeight[0];
	            }else if(curHeight>=this.limitHeight[1]){
	                this.elementData.width = this.limitHeight[1] * this.imageRatio;
	                this.elementData.height = this.limitHeight[1];
	            }else{
	                this.elementData.width = curWidth;
	                this.elementData.height = curHeight;
	            }
	            this.refreshText();
	            this.backImgShow = false;
	        },
	        dispatchScaleStart:function(){
	            this.setIndex();
	             __webpack_require__(16).clear("textElementCanvas"+this.id);
	             this.backImgShow = true;
	        },
	        dispatchClick : function(){
	            this.setIndex();
	            this.sharedStore.isEditLayerShow = false;
	        },
	        dispatchMove:function(data){
	            this.setIndex();
	            Store.vm.$broadcast("notifyRefreshScreenshot");
	        },
	        dispatchDblClick : function(){
	            this.sharedStore.watches.isChangeThisText = true;
	        },
	        dispatchScale : function(data){
	            var curWidth = this.elementData.width + data.width/this.ratio,
	                curHeight = this.elementData.height + data.height/this.ratio;
	            // console.log(curHeight,this.limitHeight)
	            if(curHeight<=this.limitHeight[0]){
	                this.elementData.width = this.limitHeight[0] * this.imageRatio;
	                this.elementData.height = this.limitHeight[0];
	            }else if(curHeight>=this.limitHeight[1]){
	                this.elementData.width = this.limitHeight[1] * this.imageRatio;
	                this.elementData.height = this.limitHeight[1];
	            }else{
	                this.elementData.width = curWidth;
	                this.elementData.height = curHeight;
	            }
	        }

	    },
	    created:function(){
	    },
	    ready:function(){
	        this.setLimitSize();
	        this.refreshText();
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	var ProjectManage = __webpack_require__(18);
	var DrawManage = __webpack_require__(16);
	var SpecController = __webpack_require__(24);
	// component -- background

	module.exports = {
	  template: /*'<!-- background layer -->' +
	            '<div style="position: absolute; left: 0; top: 0; height: 100%; width: 100%;">' +*/
	              '<!-- background -->' +
	              '<canvas id="bg-part" style="position: absolute; left: 0; top: 0; "></canvas>' +
	              '<canvas id="helpline-border-up" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderUpLeft + \'px\', top: borderUpTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-border-right" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderRightLeft + \'px\', top: borderRightTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-border-down" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderDownLeft + \'px\', top: borderDownTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-border-left" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderLeftLeft + \'px\', top: borderLeftTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-logo-up" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoUpLeft + \'px\', top: logoUpTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-logo-right" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoRightLeft + \'px\', top: logoRightTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-logo-down" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoDownLeft + \'px\', top: logoDownTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-logo-left" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoLeftLeft + \'px\', top: logoLeftTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
	              '<canvas id="helpline-center" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: centerLeft + \'px\', top: centerTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>'
	            /*'</div>'*/,
	  props: [
	    'width',
	    'height'
	  ],
	  data: function() {
	    return {
	      sharedStore: Store,
	      borderColor: '#7b7b7b',
	      borderUpLeft: 0,
	      borderUpTop: 0,
	      borderRightLeft: 0,
	      borderRightTop: 0,
	      borderDownLeft: 0,
	      borderDownTop: 0,
	      borderLeftLeft: 0,
	      borderLeftTop: 0,
	      logoColor: '#7b7b7b',
	      logoUpLeft: 0,
	      logoUpTop: 0,
	      logoRightLeft: 0,
	      logoRightTop: 0,
	      logoDownLeft: 0,
	      logoDownTop: 0,
	      logoLeftLeft: 0,
	      logoLeftTop: 0,
	      centerColor: '#de3418',
	      centerLeft: 0,
	      centerTop: 0
	    };
	  },
	  computed: {
	    helplineZindex: function() {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						elementTotal = currentCanvas.params.length || 0;

				return (elementTotal + 2) * 100;
			},

	    // bgZindex: function() {
	    //   var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	    //       elementTotal = currentCanvas.params.length || 0;
	    //
	    //   return (elementTotal + 3) * 100;
	    // },
	  },
	  methods: {
	    initBg: function() {
	      this.initBgImage();

	      this.initHelplines();
	    },

	    initHelplines: function() {
	      this.initLineBorder();
	      this.initLineLogo();
	      this.initLineCenter();
	    },

	    initLineBorder: function() {
	      var _this = this;
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      var elUp = document.getElementById('helpline-border-up'),
	          elRight = document.getElementById('helpline-border-right'),
	          elDown = document.getElementById('helpline-border-down'),
	          elLeft = document.getElementById('helpline-border-left'),
	          canvasUp = elUp.getContext('2d'),
	          canvasRight = elRight.getContext('2d'),
	          canvasDown = elDown.getContext('2d'),
	          canvasLeft = elLeft.getContext('2d');
	      elUp.width = elDown.width = currentCanvas.width;
	      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
	      elRight.height = elLeft.height = currentCanvas.height;
	      _this.borderUpLeft = _this.borderDownLeft = _this.borderLeftLeft = currentCanvas.x;
	      _this.borderUpTop = _this.borderRightTop = _this.borderLeftTop = currentCanvas.y;
	      _this.borderRightLeft = currentCanvas.x + currentCanvas.width;
	      _this.borderDownTop = currentCanvas.y + currentCanvas.height;

	      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
	      DrawManage.drawDashedLine('helpline-border-up', _this.borderColor, 0, 0, elUp.width, 0, 2, 3);

	      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
	      DrawManage.drawDashedLine('helpline-border-right', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);

	      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
	      DrawManage.drawDashedLine('helpline-border-down', _this.borderColor, 0, 0, elDown.width, 0, 2, 3);

	      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
	      DrawManage.drawDashedLine('helpline-border-left', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);
	    },

	    initLineLogo: function() {
	      var _this = this;
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      var elUp = document.getElementById('helpline-logo-up'),
	          elRight = document.getElementById('helpline-logo-right'),
	          elDown = document.getElementById('helpline-logo-down'),
	          elLeft = document.getElementById('helpline-logo-left'),
	          canvasUp = elUp.getContext('2d'),
	          canvasRight = elRight.getContext('2d'),
	          canvasDown = elDown.getContext('2d'),
	          canvasLeft = elLeft.getContext('2d');
	      var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
	      var logoData = specData.logo;
	      elUp.width = elDown.width = logoData.width * currentCanvas.ratio;
	      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
	      elRight.height = elLeft.height = logoData.height * currentCanvas.ratio;
	      _this.logoUpLeft = _this.logoDownLeft = _this.logoLeftLeft = currentCanvas.x + logoData.x * currentCanvas.ratio;
	      _this.logoUpTop = _this.logoRightTop = _this.logoLeftTop = currentCanvas.y + logoData.y * currentCanvas.ratio;
	      _this.logoRightLeft = currentCanvas.x + (logoData.x + logoData.width) * currentCanvas.ratio;
	      _this.logoDownTop = currentCanvas.y + (logoData.y + logoData.height) * currentCanvas.ratio;

	      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
	      DrawManage.drawDashedLine('helpline-logo-up', _this.logoColor, 0, 0, elUp.width, 0, 2, 3);

	      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
	      DrawManage.drawDashedLine('helpline-logo-right', _this.logoColor, 0, 0, 0, elRight.height, 2, 3);

	      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
	      DrawManage.drawDashedLine('helpline-logo-down', _this.logoColor, 0, 0, elDown.width, 0, 2, 3);

	      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
	      DrawManage.drawDashedLine('helpline-logo-left', _this.logoColor, 0, 0, 0, elRight.height, 2, 3);
	    },

	    initLineCenter: function() {
	      var _this = this;
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      var el = document.getElementById('helpline-center'),
	          canvas = el.getContext('2d');
	      el.width = 2;
	      el.height = currentCanvas.height * 1.2;
	      _this.centerLeft = currentCanvas.x + currentCanvas.width / 2;
	      _this.centerTop = currentCanvas.y - 0.1 * currentCanvas.height;

	      canvas.clearRect(-1, -1, el.width + 2, el.height + 2);
	      DrawManage.drawDashedLine('helpline-center', _this.centerColor, 0, 0, 0, el.height, 2, 3);
	    },

	    initBgImage: function() {
	      var _this = this;
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      var imageUrl = '';
	      if(Store.projectSettings[Store.currentSelectProjectIndex].color && Store.selectedPageIdx != null) {
					imageUrl = './assets/img/'+ Store.projectSettings[Store.currentSelectProjectIndex].color +'-'+ Store.selectedPageIdx +'.png';
				};

	      var el = document.getElementById('bg-part'),
	          canvas = el.getContext('2d');
	      el.width = _this.width;
	      el.height = _this.height;

	      canvas.clearRect(-1, -1, el.width + 2, el.height + 2);
	      var image = new Image();
	      // imageUp.src = '/template-resources/images/bigNewPhotoFrame/baroque_gold_up.jpg';
	      image.src = imageUrl;
	      image.onload = function() {
	        canvas.drawImage(image, 0, 0, _this.width, _this.height);
	        Store.vm.$broadcast("notifyRefreshScreenshot");
	      };
	    },
	  },
	  events: {
	    notifyRefreshBackground: function() {
	      this.initBg();
	    },

	    notifyChangeBgImage: function() {
	      this.initBgImage();
	    },

	    // notifyChangeMatting: function() {
	    //   this.initMatting();
	    // }
	  },
	  ready: function() {
	    var _this = this;

	    _this.$watch('width', function() {
	      if(_this.width) {
	        _this.initBg();
	      };
	    });

	    _this.$watch('height', function() {
	      if(_this.height) {
	        _this.initBg();
	      };
	    });
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {var Vue = __webpack_require__(29);

	var CompActionPanel = Vue.extend(__webpack_require__(48));
	// Vue.component('action-panel', CompActionPanel);

	var CompContainer = Vue.extend(__webpack_require__(49));
	// Vue.component('operation-area', CompContainer);

	// module -- dashboard
	module.exports = {
	  template: '<div v-on:click="blurFocus()" style="float: right;">' +
	              '<!-- action panel component -->' +
	              '<action-panel v-if="!sharedStore.isPreview"></action-panel>' +
	              '<!-- operation area -->' +
	              '<operation-area></operation-area>' +
	              '<div class="bed-actionpanel-bottom">' +
	                '<div style="height: 80px;text-align: center;">' +
	                  '<div class="action-item" v-show="shouldChangePageShow" style="margin-top: 20px; width: 160px;height: 28px;line-height: 28px;border-radius: 14px;">' +
	                    '<div class="button" v-on:click="broadcastChangePage()" style="width: 80px;float: left;border-top-left-radius: 14px;border-bottom-left-radius: 14px; font-size: 12px; font-weight: 500;"><i class="fa fa-caret-left" style="font-size: 12px;"></i>&nbsp&nbspFront</div>' +
	                    '<div class="button" v-on:click="broadcastChangePage(1)" style="width: 80px;float: left;border-top-right-radius: 14px;border-bottom-right-radius: 14px; font-size: 12px; font-weight: 500;">Back&nbsp&nbsp<i class="fa fa-caret-right" style="font-size: 12px;"></i></div>' +
	                  '</div>' +
	                '</div>' +
	              '</div>' +
	            '</div>',
	  data: function() {
	    return {
	      privateStore: {

	      },
	      sharedStore : Store
	    };
	  },
	  computed: {
	    shouldActionPanelShow: function() {
	      if(Store.isPreview) {
	        return false;
	      }
	      else {
	        return true;
	      };
	    },

	    // to determine if change page action items should be shown
	    shouldChangePageShow: function() {
	        if (this.sharedStore.isChangePageShow) {
	            return true;
	        } else {
	            return false;
	        };
	    }
	  },
	  components: {
			'action-panel': CompActionPanel,
			'operation-area': CompContainer
		},
	  methods: {
	    blurFocus: function() {
	      this.$dispatch('dispatchClearScreen');
	      // this.sharedStore.isLostFocus = true;
	    },

	    // broadcast change page
	    broadcastChangePage: function(nPageNum) {
	        Store.vm.$broadcast('notifyChangePage', nPageNum);
	    }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	// component -- action panel
	module.exports = {
		template: '<div class="bed-actionpanel-top">' +
								'<div style="height: 80px;text-align: center;">' +
									'<div class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleAddText()">Add Text</div>' +
								'</div>' +
							'</div>',
		data: function() {
			return {
				privateStore: {},
				sharedStore: Store
			};
		},
	  methods: {
	    handleAddText: function() {
	      this.$dispatch("dispatchShowAddText");
	      __webpack_require__(11)({ev: __webpack_require__(13).AddText});
	    }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {
	var UtilCrop = __webpack_require__(50);
	var UtilWindow = __webpack_require__(34);
	var ImageListManage = __webpack_require__(26);
	var ParamsManage = __webpack_require__(27);
	// var ProjectManage = require('ProjectManage');
	// var SpecController = require('SpecController');
	var CanvasController = __webpack_require__(25);
	var ImageController = __webpack_require__(31);
	var TextController = __webpack_require__(30);
	// var WarnController = require("WarnController");

	// component -- container

	module.exports = {
	  template: '<div id="box-canvasbg" v-bind:style="{ width: privateStore.operationWidth + \'px\', height: privateStore.operationHeight + \'px\', margin: operationMarginTop + \'px \' + operationMarginLeft  + \'px\' }" style="position: relative;">' +
	              '<bg-layer v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
	              '<div class="bed-operation" id="container" v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\', background: background }" style="position: absolute; overflow: hidden">' +
	                '<bar-panel v-show="!sharedStore.isPreview && isShowHandle"></bar-panel>'+
	                '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
	              '</div>' +
	              '<screenshot></screenshot>' +
	            '</div>',
	  data: function() {
	    return {
	      privateStore: {
					operationWidth: 0,
					operationHeight: 0,
					operationPaddingTop: 0,
					operationPaddingLeft: 0,
					canvasTop: 0,
					canvasLeft: 0,
	        handleId: 'bg',
	        isShowHandle: true,
	        isCornerHandles: false,
	        isSideHandles: false
				},
				sharedStore: Store
	    };
	  },
	  computed: {
	    operationMarginTop: function() {
				return this.privateStore.operationPaddingTop;
			},

			operationMarginLeft: function() {
				return this.privateStore.operationPaddingLeft;
			},

	    isShowHandle:function(){
	       var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	       if(!Store.isLostFocus){
	          return true;
	       }else{
	          return false;
	       }
	    },
	    
	    background: function() {
	      if(Store.isPreview) {
	        return '';
	      } else {
	        return '#fff';
	      }
	    }
		},
	  methods: {
	    initCanvas: function() {
				var _this = this,
						store = _this.sharedStore,
						currentCanvas = store.pages[store.selectedPageIdx].canvas;

				// if(!Store.isPreview) {
				// 	if(currentCanvas.isInited) {
				// 		// already initialized, write back/sync params(ONLY current actived page!!)
				// 		_this.syncParamsData();
				// 	}
				// 	else {
				// 		// not initialized, proceed to read params only
				// 		currentCanvas.isInited = true;
				// 	};
				// };

				if(Store.pages.length > 1) {
					Store.isChangePageShow = true;
				};

				_this.initWindow();

				$('.bed-operation').css('width', currentCanvas.width).css('height', currentCanvas.height);

				for(var i = 0; i < currentCanvas.params.length; i++) {
				  // init element
	        CanvasController.createElement(i);
				};
	      // select the front element
	      currentCanvas.selectedIdx = ParamsManage.getFrontElementIndex();

				ImageListManage.freshImageUsedCount();
				// CanvasController.freshElementDepth();

				// CanvasController.hideSpineLines();
			},

	    clearCanvas: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

	      for(var i = currentCanvas.params.length - 1; i >= 0; i--) {
	        CanvasController.deleteElement(i);
	      };
	    },

	    initWindow: function() {
	      var _this = this,
	          store = _this.sharedStore,
	          currentCanvas = store.pages[store.selectedPageIdx].canvas;

	      // get the canvas size params
	      if(store.isPreview) {
	        var boxLimit = UtilWindow.getPreviewBoxLimit();
	      }
	      else {
	        var boxLimit = UtilWindow.getBoxLimit();
	      };

	      if(boxLimit.width > 0 && boxLimit.height > 0) {
	        if(currentCanvas.expendSize.top != undefined && currentCanvas.expendSize.top != null) {
	          // with expend size
	          var objWidth = currentCanvas.oriBgWidth + currentCanvas.expendSize.left + currentCanvas.expendSize.right;
	          var objHeight = currentCanvas.oriBgHeight + currentCanvas.expendSize.top + currentCanvas.expendSize.bottom;
	          var expendLeft = currentCanvas.expendSize.left;
	          var expendTop = currentCanvas.expendSize.top;
	        }
	        else {
	          var objWidth = currentCanvas.oriBgWidth;
	          var objHeight = currentCanvas.oriBgHeight;
	          var expendLeft = 0;
	          var expendTop = 0;
	        };
	        var wX = boxLimit.width / objWidth,
	            hX = boxLimit.height / objHeight;

	        if(wX > hX) {
	          // resize by height
	          currentCanvas.ratio = hX;
	          currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
	          currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
	          currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
	          currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
	          currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
	          currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

	          // when resize by height, the canvas view width is smaller than boxLimit.width, we should make it align center anyway
	          _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.bgWidth) / 2;
	        }
	        else {
	          // resize by width
	          currentCanvas.ratio = wX;
	          currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
	          currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
	          currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
	          currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
	          currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
	          currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

	          _this.privateStore.operationPaddingLeft = 0 + expendLeft * currentCanvas.ratio;
	        };

	        _this.privateStore.operationPaddingTop = 0 + expendTop * currentCanvas.ratio;
	        _this.privateStore.operationWidth = currentCanvas.bgWidth;
	        _this.privateStore.operationHeight = currentCanvas.bgHeight;
	        _this.privateStore.canvasTop = currentCanvas.y;
	        _this.privateStore.canvasLeft = currentCanvas.x;

	      }
	      else {
	        // Window size is too small
	        if(store.isPreview) {
	          console.log('Window size is too small!');
	        }
	        else {
	          alert('Window size is too small!');
	        };
	      };
	    },

	    // change page
			changePage: function(nPageNum) {
				nPageNum = parseInt(nPageNum) || 0;

				if(nPageNum !== this.sharedStore.selectedPageIdx) {
					// change page
	        // remove old paper
					this.clearCanvas();

					this.sharedStore.selectedPageIdx = nPageNum;

	        this.initCanvas();
	        this.$broadcast('notifyRefreshBackground');
				};
			},

	    handleOndrop: function(obj) {
	      var _this = this,
	          store = _this.sharedStore,
	          currentCanvas = store.pages[store.selectedPageIdx].canvas;

	      // obj = { isBg: true/false }
	      if(obj) {
	        var newAdded = obj.newAdded,
	            isBg = obj.isBg;

	        var imageId = store.dragData.imageId,
	            sourceImageUrl = store.dragData.sourceImageUrl,
	            // imageId = ev.dataTransfer.getData('imageId'),
	          // 	sourceImageUrl = ev.dataTransfer.getData('sourceImageUrl'),
	            // imageWidth = ev.dataTransfer.getData('imageWidth'),
	            // imageHeight = ev.dataTransfer.getData('imageHeight'),
	            idx;

	        if(newAdded) {
	          // adding new element
	          idx = currentCanvas.params.length - 1;
	        }
	        else if(isBg) {
	          idx = 0;
	        }
	        else {
	          idx = obj.idx;
	        };

	        currentCanvas.params[idx].imageId = imageId;

	        var imageDetail = ImageListManage.getImageDetail(imageId);

	        if(imageDetail) {
	          currentCanvas.params[idx].imageGuid = imageDetail.guid;
	          currentCanvas.params[idx].imageWidth = imageDetail.width;
	          currentCanvas.params[idx].imageHeight = imageDetail.height;
	        };

	        var defaultCrops = UtilCrop.getDefaultCrop(currentCanvas.params[idx].imageWidth, currentCanvas.params[idx].imageHeight, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio);

	        var px = defaultCrops.px,
	            py = defaultCrops.py,
	            pw = defaultCrops.pw,
	            ph = defaultCrops.ph,
	            width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
	            height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

	        // adding the crop settings to element
	        currentCanvas.params[idx].cropX = imageDetail.width * px;
	        currentCanvas.params[idx].cropY = imageDetail.height * py;
	        currentCanvas.params[idx].cropW = imageDetail.width * pw;
	        currentCanvas.params[idx].cropH = imageDetail.height * ph;

	        currentCanvas.params[idx].cropPX = px;
	  			currentCanvas.params[idx].cropPY = py;
	  			currentCanvas.params[idx].cropPW = pw;
	  			currentCanvas.params[idx].cropPH = ph;

	        currentCanvas.params[idx].imageRotate = 0;

	        var UtilProject = __webpack_require__(20);
	        var encImgId = UtilProject.getEncImgId(imageId);
	        var qs = UtilProject.getQueryString({
	          encImgId: encImgId,
	          px: px,
	          py: py,
	          pw: pw,
	          ph: ph,
	          width: Math.round(width),
	          height: Math.round(height)
	        });

	        currentCanvas.params[idx].url = '/imgservice/op/crop?' + qs;
	        currentCanvas.params[idx].isRefresh = true;
	        // $.ajax({
	        // 	url: '/imgservice/op/crop',
	        // 	type: 'get',
	        // 	data: 'imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(width) + '&height=' + Math.round(height)
	        // }).done(function(result) {
	        // 	$('#element-0').attr('href', result);
	        // });
	        // var newImageSize = _this.stecheTo(imageWidth, imageHeight, currentCanvas.elements[idx].vWidth, currentCanvas.elements[idx].vHeight);

	        // front-end testing
	        // $('#element-0').attr('href', store.elementDragged.attributes.src.value);

	        currentCanvas.params[idx].sourceImageUrl = sourceImageUrl;

	        ImageListManage.freshImageUsedCount();
	        _this.freshImageList();
	        // _this.$dispatch('dispatchChangeWarn');

	      };
	    },

	    freshImageList: function() {
	      this.$dispatch('dispatchImageList');
	    },

	    addImage: function(oParams) {
	      if(oParams && oParams.id != undefined && oParams.id != null) {
	        oParams.x = oParams.x || 0;
	        oParams.y = oParams.y || 0;
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        var defaultImagePositions = CanvasController.getDefaultNewElementPosition({ x: oParams.x, y: oParams.y });
	        if(currentCanvas.params.length) {
	          var newId = parseInt(currentCanvas.params[currentCanvas.params.length - 1].id) + 1
	        }
	        else {
	          var newId = 0;
	        };

	        // create a new image element at first
	        var newImageParams = {
	          id: newId,
	          elType: 'image',
	          url: '',
	          isRefresh: false,
	          x: defaultImagePositions.x,
	          y: defaultImagePositions.y,
	          width: defaultImagePositions.width,
	          height: defaultImagePositions.height,
	          rotate: 0,
	          dep: currentCanvas.params.length,
	          imageId: '',
	          cropPX: 0,
	          cropPY: 0,
	          cropPW: 1,
	          cropPH: 1
	        };

	        ImageController.createImage(newImageParams);

	        // now push in the image automatically
	        var obj = { newAdded: true, isBg: false };
	        // Store.dropData.ev = obj.ev;
	        Store.dropData.newAdded = obj.newAdded;
	        Store.dropData.isBg = obj.isBg;

	        Store.watches.isOnDrop = true;
	      };
	    },

	    removeImage: function(idx) {
	      ImageController.deleteImage(idx);

	      ImageListManage.freshImageUsedCount();
	      this.freshImageList();
	    },

	    removeText: function(idx) {
	      TextController.deleteText(idx);
	    },

	    refreshCanvas: function() {
	      this.$broadcast('notifyRefreshBackground');

	      this.clearCanvas();
	      this.initCanvas();
	    }
	  },
	  events: {
	    // respond broadcast change page
			notifyChangePage: function(nPageNum) {
				this.changePage(nPageNum);
			},

	    // 旋转后重刷参数 + 重绘
	    notifyRotate: function() {
	      CanvasController.freshPageData();

	      // this.freshImageList();
	      this.refreshCanvas();
	    },

	    notifyRepaintProject: function() {
	      CanvasController.freshPageData();

	      this.refreshCanvas();
	    },

	    notifyPaint: function() {
	      CanvasController.loadProjectIntoPages();

	      this.freshImageList();
	      // this.clearCanvas();
	    	this.initCanvas();
	    },

	    // respond broadcast repaint
	    notifyRepaint: function(oldIdx) {
	    	if(oldIdx != undefined && oldIdx != null) {
	    		// user select another project
	    		if(!Store.isPreview) {
		    		CanvasController.syncProjectData(oldIdx);
	    		};
	    	};

	    	// if(Store.pages.length > 0 && Store.pages[Store.selectedPageIdx].canvas.paper) {
	    	// 	Store.pages[Store.selectedPageIdx].canvas.paper.remove();
	    	// };
	      this.clearCanvas();

	    	CanvasController.loadProjectIntoPages();

	    	this.freshImageList();
	      this.initCanvas();
	    },

	    notifyRefreshCanvas: function() {
	      this.refreshCanvas();
	    },

	    notifyRemoveImage: function(idx) {
	      this.removeImage(idx);
	    },

	    notifyAddImage: function(oParams) {
	      this.addImage(oParams);
	    },

	    // capture dispatch depth to front
	    dispatchDepthFront: function(idx) {
	      // console.log('should change depth:', idx);
	      if(idx != undefined && idx != null) {
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	        CanvasController.changeDepthValue({ idx: idx, targetDepth: currentCanvas.params.length - 1 });
	      };
	    },

	    dispatchDrop: function(oParams) {
	      this.addImage(oParams);
	    },

	    dispatchHCenter: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          idx = currentCanvas.selectedIdx;

	      CanvasController.hCenterElement(idx);
	    },
	  },
	  ready: function() {
	    var _this = this;

	    _this.$watch('sharedStore.watches.isChangeDepthFront', function() {
				if(_this.sharedStore.watches.isChangeDepthFront) {
					_this.sharedStore.watches.isChangeDepthFront = false;
	        var idx = _this.sharedStore.watchData.changeDepthIdx;
	        _this.sharedStore.watchData.changeDepthIdx = '';

	        // console.log('should change depth:', idx);
	        if(idx != null && idx !== '') {
	          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	          CanvasController.changeDepthValue({ idx: idx, targetDepth: currentCanvas.params.length - 1 });
	        };
				};
			});

	    _this.$watch('sharedStore.watches.isOnDrop', function() {
				if(_this.sharedStore.watches.isOnDrop) {
					_this.sharedStore.watches.isOnDrop = false;
					_this.handleOndrop(_this.sharedStore.dropData);
				};
			});

	    _this.$watch('sharedStore.watches.isRemoveElement', function() {
				if(_this.sharedStore.watches.isRemoveElement) {
					_this.sharedStore.watches.isRemoveElement = false;
	        var idx = _this.sharedStore.watchData.removeElementIdx,
	            type = _this.sharedStore.watchData.removeElementType;
	        _this.sharedStore.watchData.removeElementIdx = '';
	        _this.sharedStore.watchData.removeElementType = '';

	        if(idx != null && idx !== '') {
	          if(type === 'image') {
	            _this.removeImage(idx);
	          }
	          else {
	            _this.removeText(idx);
	          };
	        };
				};
			});

	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 50 */
/***/ (function(module, exports) {

	
	// util -- crop image
	module.exports = {
		// get default crop params
		getDefaultCrop: function(imageWidth, imageHeight, targetWidth, targetHeight) {
			if(imageWidth && imageHeight && targetWidth && targetHeight) {
				var imageX = imageWidth / imageHeight,
						targetX = targetWidth / targetHeight,
						px, py, pw, ph;

				if(imageX > targetX) {
					// horizonal image + portrait target container
					var finalHeight = imageHeight,
							finalWidth = finalHeight * targetX,
							paddingSize = (imageWidth - finalWidth) / 2;

					px = paddingSize / imageWidth;
					py = 0;
					pw = finalWidth / imageWidth;
					ph = 1;
				}
				else {
					// portrait image + horizonal target container
					var finalWidth = imageWidth,
							finalHeight = finalWidth / targetX,
							paddingSize = (imageHeight - finalHeight) / 2;

					px = 0;
					py = paddingSize / imageHeight;
					pw = 1;
					ph = finalHeight / imageHeight;
				};

				return {
					px: Math.abs(px.toFixed(8)),
					py: Math.abs(py.toFixed(8)),
					pw: Math.abs(pw.toFixed(8)),
					ph: Math.abs(ph.toFixed(8))
				};
			}
			else {
				// wrong params, crop whole image
				return { px: 0, py: 0, pw: 1, ph: 1 };
			}
		},
		getConformCrop: function(imageWidth, imageHeight,cropPX,cropPY,cropPW,cropPH,currentWidth,currentHeight,targetWidth,targetHeight){
			var cropx=cropPX*imageWidth;
			var cropy=cropPY*imageHeight;
			var cropw=cropPW*imageWidth;
			var croph=cropPH*imageHeight;
			var targetCropW=targetWidth*cropw/currentWidth;
			var targetCropH=targetHeight*croph/currentHeight;
			
			var w,h;
			if((targetCropW-cropw)<(targetCropH-croph)){
				w=cropw;
				h=w/targetCropW*targetCropH;
			}else{
				h=croph;
				w=h/targetCropH*targetCropW;
			}
			targetCropW=w;
			targetCropH=h;

			var differW=(targetCropW-cropw)/2;
			var differH=(targetCropH-croph)/2;
			var targetCropX=cropx-differW;
			var targetCropY=cropy-differH;
			var targetCropRX=targetCropX+targetCropW;
			var targetCropRY=targetCropY+targetCropH;

			if(targetCropX<0){
				targetCropX=0;
			}

			if(targetCropY<0){
				targetCropY=0;
			}

			if(targetCropRX>imageWidth){
				targetCropX=imageWidth-targetCropW;
			}

			if(targetCropRY>imageHeight){
				targetCropY=imageHeight-targetCropH;
			}

			if( targetCropW>imageWidth || targetCropH>imageHeight){

				if((targetCropW-cropw)>(targetCropH-croph)){
					w=cropw;
					h=w/targetCropW*targetCropH;
				}else{
					h=croph;
					w=h/targetCropH*targetCropW;
				}
				targetCropW=w;
				targetCropH=h;

				differW=(targetCropW-cropw)/2;
				differH=(targetCropH-croph)/2;
				targetCropX=cropx-differW;
				targetCropY=cropy-differH;
			}
			
			
			return {px:targetCropX/imageWidth,py:targetCropY/imageHeight,pw:targetCropW/imageWidth,ph:targetCropH/imageHeight};

		},

		// get rotated angle
		getRotatedAngle: function(nCurrentAngle, nDegree) {
			if(nCurrentAngle != undefined && nCurrentAngle != null) {
				// valid degree now is 0 | 90 | 180 | -90
				nDegree = !isNaN(parseFloat(nDegree)) ? parseFloat(nDegree) : 90;

				nCurrentAngle += nDegree;
				// degree value fix
				nCurrentAngle > 180 ? nCurrentAngle -= 360 : nCurrentAngle;
				nCurrentAngle < -90 ? nCurrentAngle += 360 : nCurrentAngle;

				return nCurrentAngle;
			}
			else {
				return 0;
			};
		},

		// steche function (for front end cropping)
		stecheTo: function(sourceW, sourceH, tarW, tarH, type) {
			/* for now, disable slice type */
			// type = type || 'meet';			// type --> 'meet'/'slice'
			type = 'meet';
			var divisionSource = sourceW / sourceH,
					divisionTar = tarW / tarH,
					scale = 1;

			if(divisionSource > divisionTar) {
				if(type === 'slice') {
					// adjust by height
					scale = tarH / sourceH;
				}
				else {
					// adjust by width
					scale = tarW / sourceW;
				};
			}
			else {
				if(type === 'slice') {
					// adjust by width
					scale = tarW / sourceW;
				}
				else {
					// adjust by height
					scale = tarH / sourceH;
				};
			};

			// return final container size
			return { width: sourceW * scale, height: sourceH * scale };
		},
	};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {
	var Jcrop = __webpack_require__(52);

	var UtilCrop = __webpack_require__(50);
	var UtilWindow = __webpack_require__(34);
	var ImageListManage = __webpack_require__(26);
	var ImageController = __webpack_require__(31);
	var CanvasController = __webpack_require__(25);

	// component -- image crop
	module.exports = {
		// template: '#t-image-crop',
		template: '<div class="bed-image-crop" v-show="sharedStore.isImageCropShow">' +
								'<div class="shadow-bg"></div>' +
								'<div class="box-image-crop" v-bind:style="{ zIndex: windowZindex }">' +
									'<div style="height: 40px:line-height: 40px;">' +
										// '<div v-on:click="hideImageCrop()" style="width: 40px;height: 40px;line-height: 40px;margin-left: 700px;font-size: 20px;text-align: center;cursor: pointer;" title="close"><i class="fa fa-close"></i></div>' +
										'<div style="width: 40px;height: 40px;margin-left: 700px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideImageCrop()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
									'</div>' +
									'<div style="margin: 0 40px;">' +
										'<div class="font-title t-left">Set Image</div>' +
										'<div class="font-desc t-left">Image - {{ imageName }}</div>' +
									'</div>' +
									'<div style="margin: 30px auto 20px;width: 680px;">' +
										'<div id="box-crop">' +
											'<img id="image-tobecrop" src="" />' +
										'</div>' +
									'</div>' +
									'<div style="height: 46px;">' +
										// '<span class="button-circle" v-on:click="handleSendToBack()" style="display: inline-block; margin-left: 231px;height:46px;" title="send to back">' +
										// 	'<img src="../../static/img/send_to_back.png" onmouseover="this.src = \'../../static/img/send_to_back_hover.png\';" onmouseout="this.src = \'../../static/img/send_to_back.png\';" width="46" height="46" alt="send to back" />' +
										// '</span>' +
										'<span class="button-circle" v-on:click="doRotate(-90) | debounce" style="display: inline-block; margin-left: 291px;height:46px;" title="rotate left">' +
											'<img src="../../static/img/rotate_left.png" onmouseover="this.src = \'../../static/img/rotate_left_hover.png\';" onmouseout="this.src = \'../../static/img/rotate_left.png\';" width="46" height="46" alt="rotate left" />' +
										'</span>' +
										'<span class="button-circle" v-on:click="doRotate(90) | debounce" style="display: inline-block; margin-left: 70px;" title="rotate right">' +
											'<img src="../../static/img/rotate_right.png" onmouseover="this.src = \'../../static/img/rotate_right_hover.png\';" onmouseout="this.src = \'../../static/img/rotate_right.png\';" width="46" height="46" alt="rotate right" />' +
										'</span>' +
									'</div>' +
									'<div style="height: 20px;">' +
										// '<span style="display: inline-block; width: 96px; height: 20px; line-height: 20px; text-align: center; margin-left: 206px; font-size: 12px; color: #7a7a7a;">Send to back</span>' +
										'<span style="display: inline-block; width: 46px; height: 20px; line-height: 20px; text-align: center; margin-left: 291px; font-size: 12px; color: #7a7a7a;">- 90°</span>' +
										'<span style="display: inline-block; width: 46px; height: 20px; line-height: 20px; text-align: center; margin-left: 70px; font-size: 12px; color: #7a7a7a;">+ 90°</span>' +
									'</div>' +
									'<div class="button" v-on:click="doImageCrop()" style="display: inline-block; width: 160px;height: 40px;line-height: 40px;margin:25px 0 0 290px;text-align: center;font-size: 14px;" title="Click to crop image">Done</div>' +
									// '<span class="button-text" v-show="privateStore.isRemoveButtonShow" style="display: inline-block; position: relative; top: 10px; margin-left: 20px;" v-on:click="handleRemoveImage()">Remove</span>' +
								'</div>' +
							'</div>',
		data: function() {
			return {
				privateStore: {
					jcrop_api: '',
					isCanRotate: false,
					cropWindowParams: {
						width: 740,
						height: 698,
						selector: '.box-image-crop'
					},
					isRemoveButtonShow: true,
				},
				init : [],
				selectedIdx: '',
				sharedStore: Store
			};
		},
		computed: {
			windowZindex: function() {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
						elementTotal = currentCanvas.params.length || 0;

				return (elementTotal + 10) * 100;
			},
		},
		methods: {

			// do hiding image crop box
			hideImageCrop: function() {
				this.selectedIdx = '';
				this.sharedStore.isImageCropShow = false;
			},

			handleSendToBack: function() {
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				CanvasController.sendToBack({ idx: currentCanvas.selectedIdx });
				this.hideImageCrop();
			},

			// do rotate
			doRotate: function(nDegree) {
				if(this.privateStore.isCanRotate) {
					var _this = this,
							store = _this.sharedStore,
							currentCanvas = store.pages[store.selectedPageIdx].canvas;

					var idx = this.selectedIdx !== ''?this.selectedIdx:currentCanvas.selectedIdx;

					// valid degree now is 0 | 90 | 180 | -90
					var newDegree = UtilCrop.getRotatedAngle(currentCanvas.params[idx].imageRotate, nDegree);
					currentCanvas.params[idx].imageRotate = newDegree;

					if(Math.abs(currentCanvas.params[idx].imageRotate) === 90) {
						// special rorate
						var cWidth = currentCanvas.params[idx].imageHeight,
								cHeight = currentCanvas.params[idx].imageWidth;
					}
					else {
						var cWidth = currentCanvas.params[idx].imageWidth,
								cHeight = currentCanvas.params[idx].imageHeight;
					};

					var defaultCrops = UtilCrop.getDefaultCrop(cWidth, cHeight, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio);

					var px = defaultCrops.px,
							py = defaultCrops.py,
							pw = defaultCrops.pw,
							ph = defaultCrops.ph,
							width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
							height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

					// adding the crop settings to element
					currentCanvas.params[idx].cropX = cWidth * px;
					currentCanvas.params[idx].cropY = cHeight * py;
					currentCanvas.params[idx].cropW = cWidth * pw;
					currentCanvas.params[idx].cropH = cHeight * ph;

					currentCanvas.params[idx].cropPX = px;
					currentCanvas.params[idx].cropPY = py;
					currentCanvas.params[idx].cropPW = pw;
					currentCanvas.params[idx].cropPH = ph;

					// activate refreshing element
					currentCanvas.params[idx].isRefresh = true;

					_this.triggerImageCrop();
				};
			},

			// button triggered that to crop the selected image
			triggerImageCrop: function(idx) {
				var store = this.sharedStore,
						currentCanvas = store.pages[store.selectedPageIdx].canvas;
				if(this.selectedIdx !== ''){
					currentCanvas.selectedIdx = this.selectedIdx;
				}

				idx != null && idx !== '' ? idx : idx = currentCanvas.selectedIdx;

				if(currentCanvas.params[idx].imageId) {

					// set image, and init jcrop
					this.handleCropInit(idx);

					// handle image crop box position
					UtilWindow.setPopWindowPosition(this.privateStore.cropWindowParams);

					store.isImageCropShow = true;
				};
			},

			// set image and init crop
			handleCropInit: function(idx) {
				var _this = this,
						store = _this.sharedStore,
						currentCanvas = store.pages[store.selectedPageIdx].canvas;

				_this.privateStore.isCanRotate = false;

				idx != null && idx !== '' ? idx : idx = currentCanvas.selectedIdx;

				var imageDetail = ImageListManage.getImageDetail(currentCanvas.params[idx].imageId);
				var cWidth = imageDetail.width,
						cHeight = imageDetail.height;
				if(!this.init[idx]){
					currentCanvas.params[idx].cropX = cWidth * currentCanvas.params[idx].cropPX;
			    currentCanvas.params[idx].cropY = cHeight * currentCanvas.params[idx].cropPY;
			    currentCanvas.params[idx].cropW = cWidth * currentCanvas.params[idx].cropPW;
			    currentCanvas.params[idx].cropH = cHeight * currentCanvas.params[idx].cropPH;
			    currentCanvas.params[idx].imageWidth = imageDetail.width;
			    currentCanvas.params[idx].imageHeight = imageDetail.height;
			    // currentCanvas.params[idx].vWidth = currentCanvas.params[idx].width * currentCanvas.ratio;
		    	// currentCanvas.params[idx].vHeight = currentCanvas.params[idx].height * currentCanvas.ratio;
		    	this.init[idx] = true;
				}

				_this.imageName = imageDetail.name || '';
				// console.log(_this.imageName);

				if(Math.abs(currentCanvas.params[idx].imageRotate) === 90) {
					// image rotated specially, calculate width as height, height as width
					var width = currentCanvas.params[idx].imageHeight,
							height = currentCanvas.params[idx].imageWidth;
				}
				else {
					// normal case
					var width = currentCanvas.params[idx].imageWidth,
							height = currentCanvas.params[idx].imageHeight;
				};

				var px = currentCanvas.params[idx].cropX / width,
						py = currentCanvas.params[idx].cropY / height,
						pw = currentCanvas.params[idx].cropW / width,
						ph = currentCanvas.params[idx].cropH / height,
						tWidth = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
						tHeight = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

				var viewBoxWidth = 680,
						viewBoxHeight = 400;
				if(this.privateStore.cropWindowParams.height>window.innerHeight){
					viewBoxHeight = window.innerHeight - 295;
				}
				var	vX = viewBoxWidth / viewBoxHeight,
						imageX = width / height;

				if(vX > imageX) {
					// height meet
					store.cropImageRatio = viewBoxHeight / height;
				}
				else {
					// width meet
					store.cropImageRatio = viewBoxWidth / width;
				};

				// calculate margin left, margin top of crop image preview
				var previewImageWidth = width * store.cropImageRatio,
						previewImageHeight = height * store.cropImageRatio,
						marginLeft = (viewBoxWidth - previewImageWidth) / 2,
						marginTop = (viewBoxHeight - previewImageHeight) / 2;
				// console.log(store.cropImageRatio, previewImageWidth, previewImageHeight, marginLeft, marginTop);

				$('#box-crop').css('margin-left', marginLeft).css('padding-top', marginTop);

				if(_this.privateStore.jcrop_api !== '') {
					_this.privateStore.jcrop_api.destroy()
				};

				var UtilProject = __webpack_require__(20);
	      var encImgId = UtilProject.getEncImgId(currentCanvas.params[idx].imageId);
	      var qs = UtilProject.getQueryString({
	        encImgId: encImgId,
	        px: 0,
	        py: 0,
	        pw: 1,
	        ph: 1,
	        width: Math.round(previewImageWidth),
	        height: Math.round(previewImageHeight),
	        rotation: currentCanvas.params[idx].imageRotate
	      });


				$('#image-tobecrop')
					.attr('src', '/imgservice/op/crop?' + qs)
					.attr('width', previewImageWidth)
					.attr('height', previewImageHeight)
					.css('width', previewImageWidth)
					.css('height', previewImageHeight)
					.Jcrop({
						aspectRatio: currentCanvas.params[idx].width / currentCanvas.params[idx].height,
						setSelect: [currentCanvas.params[idx].cropX * store.cropImageRatio, currentCanvas.params[idx].cropY  * store.cropImageRatio, (currentCanvas.params[idx].cropX + currentCanvas.params[idx].cropW) * store.cropImageRatio, (currentCanvas.params[idx].cropY + currentCanvas.params[idx].cropH) * store.cropImageRatio],
						bgColor: 'black',
						allowSelect: false,
						bgOpacity: 0.4,
						onSelect: function(c) {
							store.cropParams = { x: c.x, y: c.y, w: c.w, h: c.h };
						}
					}, function(){
						_this.privateStore.jcrop_api = this;
						_this.privateStore.isCanRotate = true;
					});

			},

			// do crop image
			doImageCrop: function() {
				var _this = this,
						store = _this.sharedStore,
						currentCanvas = store.pages[store.selectedPageIdx].canvas;

				var idx = currentCanvas.selectedIdx;

				if(Math.abs(currentCanvas.params[idx].imageRotate) === 90) {
					// image rotated specially, calculate width as height, height as width
					var width = currentCanvas.params[idx].imageHeight,
							height = currentCanvas.params[idx].imageWidth;
				}
				else {
					// normal case
					var width = currentCanvas.params[idx].imageWidth,
							height = currentCanvas.params[idx].imageHeight;
				};

				var imageId = currentCanvas.params[idx].imageId,
						px = (store.cropParams.x / store.cropImageRatio) / width,
						py = (store.cropParams.y / store.cropImageRatio) / height,
						pw = (store.cropParams.w / store.cropImageRatio) / width,
						ph = (store.cropParams.h / store.cropImageRatio) / height,
						tWidth = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
						tHeight = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

				// write back to element
				currentCanvas.params[idx].cropX = store.cropParams.x / store.cropImageRatio;
				currentCanvas.params[idx].cropY = store.cropParams.y / store.cropImageRatio;
				currentCanvas.params[idx].cropW = store.cropParams.w / store.cropImageRatio;
				currentCanvas.params[idx].cropH = store.cropParams.h / store.cropImageRatio;

				currentCanvas.params[idx].cropPX = px;
				currentCanvas.params[idx].cropPY = py;
				currentCanvas.params[idx].cropPW = pw;
				currentCanvas.params[idx].cropPH = ph;

				currentCanvas.params[idx].isRefresh = true;

				// var url = '/imgservice/op/crop?imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(tWidth) + '&height=' + Math.round(tHeight) + '&rotation=' + currentCanvas.params[idx].imageRotate;
				// require("DrawManage").drawImage("photoElementCanvas"+ (idx), url, 0, 0,null,currentCanvas.params[idx].width * currentCanvas.ratio,currentCanvas.params[idx].height * currentCanvas.ratio);

				_this.hideImageCrop();
			},

			// remove image
			handleRemoveImage: function() {
				var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

				ImageController.deleteImage(currentCanvas.selectedIdx);
				ImageListManage.freshImageUsedCount();
				this.sharedStore.isImageCropShow = false;
			}
		},
		props: ['imageName'],
		events: {
			notifyImageCrop: function() {
				this.triggerImageCrop();
			},

			notifyRotateImage: function(oParams) {
				var _this = this,
						store = _this.sharedStore,
						currentCanvas = store.pages[store.selectedPageIdx].canvas;

				oParams.idx != undefined && oParams.idx != null && oParams.idx !== '' ? oParams.idx : oParams.idx = currentCanvas.selectedIdx;
				oParams.nDegree != undefined && oParams.nDegree != null ? oParams.nDegree : oParams.nDegree = 0;

				var idx = oParams.idx,
						nDegree = oParams.nDegree;

				// valid degree now is 0 | 90 | 180 | -90
				var newDegree = UtilCrop.getRotatedAngle(currentCanvas.params[idx].imageRotate, nDegree);
				currentCanvas.params[idx].imageRotate = newDegree;

				if(Math.abs(currentCanvas.params[idx].imageRotate) === 90) {
					// special rorate
					var cWidth = currentCanvas.params[idx].imageHeight,
							cHeight = currentCanvas.params[idx].imageWidth;
				}
				else {
					var cWidth = currentCanvas.params[idx].imageWidth,
							cHeight = currentCanvas.params[idx].imageHeight;
				};

				var defaultCrops = UtilCrop.getDefaultCrop(cWidth, cHeight, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio);

				var px = defaultCrops.px,
						py = defaultCrops.py,
						pw = defaultCrops.pw,
						ph = defaultCrops.ph,
						width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
						height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

				// adding the crop settings to element
				currentCanvas.params[idx].cropX = cWidth * px;
				currentCanvas.params[idx].cropY = cHeight * py;
				currentCanvas.params[idx].cropW = cWidth * pw;
				currentCanvas.params[idx].cropH = cHeight * ph;

				currentCanvas.params[idx].cropPX = px;
				currentCanvas.params[idx].cropPY = py;
				currentCanvas.params[idx].cropPW = pw;
				currentCanvas.params[idx].cropPH = ph;

				// activate refreshing element
				currentCanvas.params[idx].isRefresh = true;
			},
		},
		created: function() {
			var _this = this;

			_this.$watch('sharedStore.watches.isCropThisImage', function() {
				if(_this.sharedStore.watches.isCropThisImage) {
					var idx = _this.sharedStore.watchData.cropImageIdx;
					this.selectedIdx = idx;

					_this.sharedStore.watches.isCropThisImage = false;
					_this.sharedStore.watchData.cropImageIdx = '';
					_this.triggerImageCrop(idx);
				};
			});
		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 52 */,
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, jQuery) {module.exports={
	    // template: '#t-options',
	    template: '<div  v-show="sharedStore.isOptionsViewShow">' +
					        '<div class="shadow-bg"></div>' +
					        '<div id="option-window" class="box-options" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
					        	'<div style="height: 40px:line-height: 40px;">' +
											'<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
										'</div>' +
										'<div style="margin: 0 40px;">' +
											'<div class="font-title t-left">Options</div>' +
										'</div>' +
										'<div style="margin-top: 50px; margin-left: 40px;">' +
					                        '<div>' +
					                            '<label class="invalid-title-text" v-show="privateStore.isTitleInvalid">{{privateStore.invalidTxt}}</label>' +
					                        '</div>' +
											'<div class="options-div">' +
					                            // '<img src="../../static/img/Incorrect.svg" v-show="privateStore.isTitleInvalid" width="10" height="10" style="margin-left: -12px;margin-bottom: -26px;" />' +
											  '<label class="options-label font-label" style="height: 35px; line-height: 35px;">Title:</label>' +
											  '<input class="input font-input" id="titleInput" type="text" name="title" v-model="privateStore.currentSelectTitle" style="width: 453px; height: 33px;" v-on:blur="handleTitleInputBlur()" maxlength="50"/>' +
											'</div>' +
										'</div>' +
					          '<div class="options-button">' +
					            '<div class="button t-center" v-on:click="handleSubmitOptions()" style="width: 160px;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;">Done</div>' +
					          '</div>' +
					        '</div>' +
					      '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                currentSelectTitle:'',
	                isTitleInvalid:false,
	                invalidTxt:'Incorrect format, please try again.',
	                width:650,
	                height:300,
	                selector:'#option-window'
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	      windowZindex: function() {
	  			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	  					elementTotal = currentCanvas.params.length || 0;

	  			return (elementTotal + 10) * 100;
	  		},
	    },
	    methods: {

	        handleHideOptionsView: function() {

	            this.sharedStore.isOptionsViewShow = false;
	            this.initOptions();
	        },
	        handleSubmitOptions: function() {
	            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
	            console.log(this.privateStore.isTitleInvalid);
	            if(!this.privateStore.isTitleInvalid&&this.privateStore.currentSelectTitle.trim()){
	                if(this.sharedStore.title!=this.privateStore.currentSelectTitle){
	                var timestamp = (new Date()).valueOf();
	                //  旧的 title 修改接口。
	                // require('ProjectController').addOrUpdateAlbum(this.privateStore.currentSelectTitle,this,'dispatchUpdateAlbumResponse');
	                //  新的 title 修改接口
	                 __webpack_require__(23).changeProjectTitle(this.privateStore.currentSelectTitle,this,'dispatchUpdateAlbumResponse');
	                }else{
	                    this.submitData();
	                }
	            }else{
	                if(this.privateStore.currentSelectTitle.trim()){
	                    this.privateStore.invalidTxt='Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.';

	                }else{
	                    this.privateStore.invalidTxt='Title is required.';

	                }
	                this.privateStore.isTitleInvalid=true;
	            }

	        },
	        submitData: function(){

	            this.sharedStore.title=this.privateStore.currentSelectTitle;
	            this.sharedStore.isOptionsViewShow = false;
	            this.initOptions();


	        },
	        handleCanelOptions: function() {
	            this.sharedStore.isOptionsViewShow = false;
	            this.initOptions();
	        },
	        handleTitleInputBlur:function(){
	            var title = jQuery("#titleInput");
	            title.val(this.replaceInvalidString(title.val()));
	            this.privateStore.isTitleInvalid=!this.checkInvalid(this.privateStore.currentSelectTitle);
	            if(this.privateStore.currentSelectTitle.trim()){
	                this.privateStore.invalidTxt='Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.';

	            }else{
	                this.privateStore.invalidTxt='Title is required.';

	            }
	        },
	        checkInvalid:function(value){
	            //return(/^[A-Za-z0-9_@ \-`~!#$$%^&*\(\)+=\]\[\{\}|\\;':",.\>\<?)\/]+$/.test(value));
	            return(/^[a-zA-Z 0-9\d_\s\-]+$/.test(value));
	        },
	        replaceInvalidString :function(value){
	            var start_ptn = /<\/?[^>]*>/g;
	            var end_ptn = /[ | ]*\n/g;
	            var space_ptn = /&nbsp;/ig;
	            return value.replace(start_ptn,"").replace(end_ptn,"").replace(space_ptn,"").replace(/(^\s+)|(\s+$)/g,"");
	        },
	        initOptions: function(){

	            this.privateStore.isTitleInvalid=false;
	            this.privateStore.currentSelectTitle=this.sharedStore.title;
	        }
	    },
	    ready: function() {
	        this.initOptions();
	    },
	    events: {
	        notifyShowOptionWindow:function(){
	            console.log('showOptionWindow');
	            var utilWindow=__webpack_require__(34);
	            utilWindow.setPopWindowPosition({width:this.privateStore.width,height:this.privateStore.height,selector:this.privateStore.selector});
	            this.sharedStore.isOptionsViewShow=true;
	            this.initOptions();
	        },
	        notifyUpdateAlbumResponse:function(isValid,text){

	            this.privateStore.isTitleInvalid=isValid;
	            console.log(this.privateStore.isTitleInvalid);
	            if(this.privateStore.isTitleInvalid){
	                this.privateStore.invalidTxt=text;
	            }else{
	                this.submitData();
	            }


	        }
	    }

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {
	var slider = __webpack_require__(55);
	var UtilWindow = __webpack_require__(34);
	var UtilMath = __webpack_require__(7);
	var ParamsManage = __webpack_require__(27);
	var TextController = __webpack_require__(30);
	// component -- text editor
	module.exports = {
	  // template: '#t-text-editor',
	  template: '<div v-show="sharedStore.isTextEditorShow">' +
	              '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
	              '<div class="box-text-editor" style="overflow:hidden" v-bind:style="{ zIndex: windowZindex}">' +
	                '<div style="height: 40px:line-height: 40px;">' +
	                  '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideTextEditorView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 22px; margin-left: 33px; cursor: pointer;" /></div>' +
	                '</div>' +
	                '<div style="margin: 0 40px;">' +
	                  '<div class="font-title t-left">Text Editor</div>' +
	                '</div>' +
	                '<div style="margin: 50px 0 0 40px; width: 604px;">' +
	                  '<div class="box-textarea">' +
	                    '<textarea class="font-textarea" id="textArea" placeholder="Enter text here" style="height: 80px; width: 578px; line-height: 1.2; background-color: #f5f5f5;" v-model="privateStore.inputTextEditorTxt" v-on:change="handleTextChange()"></textarea>' +
	                    '<label class="font-label" v-show="privateStore.isShowInvalidTxt" style="color: red;float:right;margin-right:4px;">Invalid characters removed</label>'+
	                  '</div>' +
	                  '<div style="margin-top: 30px;">' +
	                    '<span style="position: relative;display: inline-block; width: 300px;">' +
	                      '<label class="options-label font-label" style="height: 35px; line-height: 35px;">Font Family:</label>' +
	                      '<select class="input font-select" v-model="privateStore.selectFontFamily" style="width: 200px;border-width:2px;border-color:rgb(161,195,250);"></select>' +
	                      '<label class="options-label font-label" v-on:click="handleFontFamilyClick"  type="text" style="position: absolute; width: 177px;height: 35px; line-height: 35px;right:10px;top:0;">{{displayFontFamily}}</label>'+
	                      '<div v-show="privateStore.isShowFontFamilySelect" style="position:absolute;width: 200px;height:403px;border: 1px solid rgb(161,195,250);left: 100px;z-index: 200;background-color: rgb(245,245,245);bottom: -145px;">'+
	                        '<div class="fontFamilySelect" v-on:click="handleSelectFontFamily(item.id)" style="height:20px" v-for="item in sharedStore.fontList"><img v-bind:src="item.imageUrl" style="padding-left: 10px;" height="16"/></div>'+
	                      '</div>'+
	                    '</span>' +
	                    '<span style="display: inline-block; width: 300px;margin-left: 4px;">' +
	                      '<label class="options-label font-label" style="height: 35px; line-height: 35px;margin-left:4px;width:90px;">Font Style:</label>' +
	                      '<select class="input font-select" id="fontStyleSelect" v-model="privateStore.selectFontStyle" style="width: 202px;">' +
	                        '<option v-for="item in privateStore.fontStyleList" value="{{item.fontFamily}}">{{item.displayName}}</option>' +
	                      '</select>' +
	                    '</span>' +
	                  '</div>' +
	                  '<div style="margin-top: 20px;">' +
	                    '<span style="position: relative; display: inline-block; width: 304px;">' +
	                      '<label class="options-label font-label" style="height: 35px; line-height: 35px;">Font Size:</label>' +
	                      '<!-- pop-out fake select button -->' +
	                      '<select class="input font-select" style="position: absolute; display: inline-block; width: 200px; right: 10px; top: 0;"></select>' +
	                      '<input class="input font-input" id="fontSizeText" type="text" v-on:blur="handleTextBlur()" v-on:focus="handleTextFocus()"  style="position: absolute; width: 177px; height: 33px; right: 10px; top: 0; background-color: rgba(245, 245, 245, 0);" value="{{displayFontSize}}"/>' +
	                      '<input class="input font-input" type="text" style="width: 181px; height: 33px;">' +
	                      '<div v-show="privateStore.isFontsizeSliderShow" style="position: absolute; display: inline-block; width: 140px; left: 100px; top: 37px; padding: 0 8px; border-radius: 4px; background-color: #e6e6e6; box-shadow: 0 2px 3px 1px #cbcbcb;">' +
	                        '<input type="text" id="as-slide-fontsize" data-slider-id="asFontsizeSlider" data-slider-min="0.3" data-slider-max="16" data-slider-step="0.1" data-slider-value="{{ privateStore.selectedInchFontSize }}" data-slider-handle="custom" data-slider-tooltip="hide" v-model="privateStore.selectedInchFontSize" />' +
	                      '</div>' +
	                    '</span>' +
	                    '<span style="display: inline-block; width: 300px;">' +
	                      '<label class="options-label font-label" style="height: 35px; line-height: 35px;margin-left:4px;width:90px;">Font Color:</label>' +
	                      '<select class="input font-select" id="fontColorSelect" v-model="privateStore.selectFontColor" style="width: 202px;">' +
	                        '<option value="0">Black</option>' +
	                        '<option value="6712688">Gray</option>' +
	                        '<option value="13289166">Light Gray</option>' +
	                        '<option value="16711422">White</option>' +
	                        '<option value="10497843">Cardinal</option>' +
	                        '<option value="16711680">Red</option>' +
	                        '<option value="16042184">Pink</option>' +
	                        '<option value="15690240">Orange</option>' +
	                        '<option value="14202129">Gold</option>' +
	                        '<option value="16776960">Yellow</option>' +
	                        '<option value="5679643">Green</option>' +
	                        '<option value="13158">Navy</option>' +
	                      '</select>' +
	                    '</span>' +
	                  '</div>' +
	                '</div>' +
	                '<div class="texteditor-button">' +
	                  '<div id="texteditor-submitButton" class="button t-center" v-on:click="handleText()" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; margin-left: 258px;font-size: 14px;">{{ privateStore.submitButtonLabel }}</div>' +
	                '</div>' +
	                '<div v-show="privateStore.isShowFontFamilySelect" style="width:100%;height:100%;position: absolute;top: 50px;" v-on:click="handleNoSelectFontFamily"></div>'+
	              '</div>' +
	            '</div>',
	  data: function() {
	    return {
	      privateStore: {
	        fontStyleList: [],
	        selectFontFamily: 'font_arial',
	        selectFontStyle: 'Arial Narrow',
	        selectFontColor: 0,
	        selectedInchFontSize: 2,
	        submitButtonLabel: 'Done',
	        isFontsizeSliderShow: false,
	        isEdit: false,
	        isRemoveButtonShow: false,
	        inputTextEditorTxt: '',
	        textWindowParams: {
	          width: 680,
	          height: 420,
	          selector: '.box-text-editor'
	        },
	         isShowFontFamilySelect:false,
	         isShowInvalidTxt:false
	      },
	      sharedStore: Store
	    };
	  },
	  computed: {
	    selectedPxFontSize: function() {
	      var inch = this.privateStore.selectedInchFontSize;
	      var px = UtilMath.getPxByInch(inch);

	      return Math.round(px);
	    },

	    displayFontSize: function() {
	      return this.privateStore.selectedInchFontSize + " in.";
	    },

	    windowZindex: function() {
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	          elementTotal = currentCanvas.params.length || 0;

	      return (elementTotal + 10) * 100;
	    },
	    displayFontFamily:function(){
	      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
	        if(this.sharedStore.fontList[i].id===this.privateStore.selectFontFamily){
	          return this.sharedStore.fontList[i].displayName;
	        }
	      };
	      return "";
	    }
	  },
	  methods: {
	    handleShowTextEditor: function() {
	      UtilWindow.setPopWindowPosition(this.privateStore.textWindowParams);
	      this.sharedStore.isTextEditorShow = true;
	      this.resetSumbitButton();
	    },

	    handleShowFontsizeSlider: function() {
	      this.privateStore.isFontsizeSliderShow = true;
	    },

	    handleTextBlur: function() {
	      var fontSize = parseFloat($("#fontSizeText").val().replace(" in.", ""));
	      if(isNaN(fontSize)){
	        fontSize = this.privateStore.selectedInchFontSize;
	      };

	      // size value fix
	      if(fontSize < 0.3) {
	        fontSize = 0.3;
	      }
	      else if(fontSize > 16) {
	        fontSize = 16;
	      };

	      $("#fontSizeText").val(fontSize + " in.");
	      this.privateStore.selectedInchFontSize = fontSize;
	      $("#as-slide-fontsize").slider('setValue', fontSize);

	      this.privateStore.isFontsizeSliderShow = false;
	    },

	    handleTextFocus: function() {
	      $("#fontSizeText").val($("#fontSizeText").val().replace(" in.", ""));
	      this.privateStore.isFontsizeSliderShow = true;
	    },

	    handleHideTextEditorView: function() {
	      this.sharedStore.isTextEditorShow = false;
	      this.resetView();
	    },

	    handleFontFamilyChange: function() {
	      this.resetFontStyle();
	    },

	    handleText: function() {
	      __webpack_require__(11)({ev: __webpack_require__(13).CompleteTextEdit});
	      var _this = this,
	          currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	      var element_index = 0;
	      var color = '' + this.privateStore.selectFontColor;
	      var size = this.selectedPxFontSize;
	      if(this.privateStore.isShowInvalidTxt){
	        return;
	      }
	      if(!this.privateStore.isEdit) {
	        // add new text
	        var element_id = 0;
	        var len = currentCanvas.params.length;
	        if(len){
	            element_id = currentCanvas.params[len-1].id+1;
	        }
	        var textParams = {
	          id : element_id,
	          elType: 'text',
	          text: $("#textArea").val(),
	          x: 500,
	          y: 500,
	          width: 2000,
	          height: 500,
	          rotate: 0,
	          dep: element_index,
	          fontFamily: this.privateStore.selectFontStyle,
	          fontSize: size,
	          fontWeight: 'normal',
	          textAlign: 'left',
	          fontColor: color,
	          isRefresh : false
	        };
	        TextController.createText(textParams);
	      }
	      else {
	        // change text
	        var oldTextParams = currentCanvas.params[currentCanvas.selectedIdx];
	        var textParams = {
	          id : oldTextParams.id,
	          elType: 'text',
	          text: $("#textArea").val(),
	          x: oldTextParams.x,
	          y: oldTextParams.y,
	          width: oldTextParams.width,
	          height: oldTextParams.height,
	          rotate: oldTextParams.rotate,
	          dep: oldTextParams.dep,
	          fontFamily: this.privateStore.selectFontStyle,
	          fontSize: size,
	          fontWeight: 'normal',
	          textAlign: 'left',
	          fontColor: color,
	          isRefresh : false
	        };
	        element_index = currentCanvas.selectedIdx;
	        TextController.editText(textParams, element_index);
	      };

	      this.sharedStore.isTextEditorShow = false;
	      this.privateStore.inputTextEditorTxt = "";
	      this.resetView();
	    },

	    handleRemoveText: function() {
	      var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

	      TextController.deleteText(currentCanvas.selectedIdx);

	      this.sharedStore.isTextEditorShow=false;
	      this.resetView();
	    },

	    resetFontStyle:function() {
	      var fontFamilyId=this.privateStore.selectFontFamily;
	      var fontFamily;
	      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
	        if(this.sharedStore.fontList[i].id==fontFamilyId){
	          fontFamily=this.sharedStore.fontList[i];
	          break;
	        }
	      }
	      this.privateStore.fontStyleList=fontFamily.fonts;
	      this.privateStore.selectFontStyle=this.privateStore.fontStyleList[0].fontFamily;
	    },

	    initView: function(idx) {
	      var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

	      if(idx != undefined && idx != null) {
	        // idx passed in

	      }
	      else {
	        idx = currentCanvas.selectedIdx;
	      };



	      this.privateStore.isEdit = true;
	      this.privateStore.isRemoveButtonShow = true;
	      var params = currentCanvas.params[idx];
	      var fontFamily = params.fontFamily;
	      var fontSize = params.fontSize;
	      var fontColor = params.fontColor;
	      var text = params.text;

	      var fontFamilyName = '';
	      var fontStyleName = '';

	      for (var i = 0; i < this.sharedStore.fontList.length; i++) {
	        var fontFamily_node=this.sharedStore.fontList[i];
	        var fontFamily_id=fontFamily_node['id'];
	        var fontFamily_name=fontFamily_node['name'];
	        var fontFamily_displayName=fontFamily_node['displayName'];
	        for(var j = 0;j<fontFamily_node.fonts.length;j++){
	          var font=fontFamily_node.fonts[j];
	          var fontStyle_id=font['fontFamily'];
	          var displayName=font['displayName'];
	          if(fontFamily==fontStyle_id) {
	            fontFamilyName=fontFamily_id;
	            fontStyleName=fontStyle_id;
	          };
	        };
	      };
	      if(fontFamilyName){
	      this.privateStore.selectFontFamily = fontFamilyName;
	      }
	      this.resetFontStyle();
	      this.privateStore.selectFontStyle = fontStyleName;
	      $("#textArea").val(text);
	      this.privateStore.inputTextEditorTxt = text;
	      var fontInchSize = parseFloat(UtilMath.getInchByPx(fontSize).toFixed(1));
	      $("#fontSizeText").val(fontInchSize + " in.");

	      this.privateStore.selectedInchFontSize = fontInchSize;
	      $("#as-slide-fontsize").slider('setValue', fontInchSize);

	      this.privateStore.selectFontColor = fontColor;
	      this.handleShowTextEditor();
	    },

	    resetView:function(){
	      $("#textArea").val("");
	      this.privateStore.selectFontFamily='font_arial';
	      this.privateStore.selectFontStyle='Arial Narrow';
	      this.privateStore.selectFontColor=0;
	      $("#fontSizeText").val('2 in.');
	      this.privateStore.selectedInchFontSize = 2;
	      $("#as-slide-fontsize").slider('setValue', 2);
	      this.resetFontStyle();
	      this.privateStore.isShowFontFamilySelect=false;
	      this.privateStore.inputTextEditorTxt = '';
	    },

	    getTextFamily: function(){
	      var _this = this;

	      $.ajax({
	        url: './assets/data/fonts.xml',
	        type: 'get',
	        dataType: 'xml'
	      }).done(function(result) {
	        if (result) {
	          for (var i = 0; i < $(result).find('fontFamily').length; i++) {
	            var fontFamily={};
	            var fontFamily_node=$(result).find('fontFamily').eq(i);
	            var fontFamily_id=fontFamily_node.attr('id');
	            var fontFamily_name=fontFamily_node.attr('name');
	            var fontFamily_displayName=fontFamily_node.attr('displayName');
	            fontFamily.id=fontFamily_id;
	            fontFamily.name=fontFamily_name;
	            fontFamily.displayName=fontFamily_displayName;
	            fontFamily.fonts=[];
	            fontFamily.imageUrl="assets/img/fonts/"+fontFamily_id+".png";
	            for(var j = 0;j<fontFamily_node.find("font").length;j++) {
	              var font=fontFamily_node.find("font").eq(j);
	              var font_id=font.attr('id');
	              var font_displayName=font.attr('displayName');
	              var font_fontFamily=font.attr('fontFamily');
	              var font_fontFace=font.attr('fontFace');
	              var font_weight=font.attr('weight');
	              var font_isDefault=font.attr('isDefault');
	              fontFamily.fonts[j]={fontFamily:font_fontFamily,displayName:font_displayName};
	            }

	            Store.fontList.push(fontFamily);
	          }
	          _this.privateStore.fontStyleList=Store.fontList[0].fonts;
	        }
	      });
	    },
	    handleFontFamilyClick:function(){
	      this.privateStore.isShowFontFamilySelect=true;
	    },
	    handleNoSelectFontFamily:function(){
	      this.privateStore.isShowFontFamilySelect=false;
	    },
	    handleSelectFontFamily:function(fontId){
	      this.privateStore.isShowFontFamilySelect=false;
	      this.privateStore.selectFontFamily=fontId;
	      this.resetFontStyle();
	    },
	    resetSumbitButton:function(){
	      if(this.privateStore.inputTextEditorTxt.length>0) {
	          $('#texteditor-submitButton').css('pointer-events','auto');
	          $('#texteditor-submitButton').css('opacity',1);
	      }else{
	          $('#texteditor-submitButton').css('pointer-events','none');
	          $('#texteditor-submitButton').css('opacity',0.4);
	      }
	    },
	    handleTextChange:function(){
	      var rLegalKeys = /[^\u000d\u000a\u0020-\u007e]*/g;
	      var inputString = this.privateStore.inputTextEditorTxt;
	      var filteredInputString = inputString.replace(rLegalKeys, '');
	      if(inputString !== filteredInputString){
	        this.privateStore.isShowInvalidTxt=true;
	        this.privateStore.inputTextEditorTxt=filteredInputString;
	        var _this=this;
	        setTimeout(function(){
	          _this.privateStore.isShowInvalidTxt=false;
	        },2000)
	      }else{
	        this.privateStore.isShowInvalidTxt=false;
	      }
	    }
	  },
	  ready: function() {
	    this.getTextFamily();

	    $('#as-slide-fontsize').slider({
	      // formatter: function(value) {
	      //  return 'Current value: ' + value;
	      // }
	    });
	  },
	  events: {
	    notifyModifyText: function(idx) {
	      this.initView(idx);
	    },

	    notifyShowAddText: function() {
	      this.handleShowTextEditor();

	      this.privateStore.isEdit = false;
	      this.privateStore.isRemoveButtonShow = false;
	      this.resetView();
	      this.resetSumbitButton();
	    }
	  },
	  created: function() {
	    var _this = this;

	    _this.$watch('sharedStore.watches.isChangeThisText', function() {
	      if(_this.sharedStore.watches.isChangeThisText) {
	        _this.sharedStore.watches.isChangeThisText = false;
	          _this.initView();
	      };
	    });

	    _this.$watch('privateStore.inputTextEditorTxt', function() {
	      _this.resetSumbitButton();
	    });
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 55 */,
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports={
	    props: ['measure','id','num','disabled'],
	    template: '<div style="display: inline-block;width:156px;height:38px;line-height:38px;margin-right:20px;margin-bottom:20px">' +
	                '<label style="float:left;width:40px;height:38px;text-align:right;color:#7b7b7b;font-size:14px;">{{showMeasure}}:</label>' +
	                '<a v-if="!disabled && this.num > 0" style="float:left;margin-left: 5px;height:38px;width: 26px;" href="javascript:" v-on:click="numDown()">'+
	                    '<img style="margin-top:6px;" src="assets/img/down.png" draggable="false">'+
	                '</a>'+
	                '<a v-if="disabled || this.num <= 0" style="float:left;margin-left: 5px;height:38px;width: 26px;cursor:not-allowed;" href="javascript:">'+
	                    '<img style="margin-top:6px;" src="assets/img/down-Disable.png" draggable="false">'+
	                '</a>'+
	                '<div style="float:left;width:50px;height:38px;margin-left:4px;">'+
	                    '<input v-on:blur="handleTextBlur()" style="display:block;width:100%;text-align:center;color:#7b7b7b;margin-top:6px;height:24px;font-size:14px;top:5px;background:#f4f4f4;border-style:none" v-model="num" v-bind:disabled="disabled"/>'+
	                '</div>'+
	                '<a v-if="!disabled && this.num < 99999" style="float:left;margin-left: 4px;width: 26px;height: 38px;" href="javascript:" v-on:click="numUp()">'+
	                    '<img style="margin-top:6px;" src="assets/img/up.png" draggable="false">'+
	                '</a>'+
	                '<a v-if="disabled || this.num >= 99999" style="float:left;margin-left: 4px;width: 26px;height: 38px;cursor:not-allowed;" href="javascript:">'+
	                    '<img style="margin-top:6px;" src="assets/img/up-Disable.png" draggable="false">'+
	                '</a>'+
				  '</div>',

	    data: function() {
	        return {
	            privateStore: {
	                isFireFox:false
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	        showMeasure:function(){
	            if(this.measure==="XXL"){
	                return "2XL";
	            }
	            return this.measure;
	        }
	    },
	    methods: {
	        numUp:function(){
	            if(this.disabled) return;

	            this.num++;
	            if(this.num>99999){
	                this.num=99999;
	            }
	        },
	        numDown:function(){
	            if(this.disabled) return;

	            this.num--;
	            if(this.num<0){
	                this.num=0;
	            }
	        },
	        handleTextBlur: function() {
	            var num = Math.round(this.num);
	            if(isNaN(num)){
	                num = 1;
	            };

	            // size value fix
	            if(num < 0) {
	                num = 0;
	            }else if(num > 99999) {
	                num = 99999;
	            };
	            this.num=num;
	        }
	    },
	    ready: function() {
	        // var userAgent = navigator.userAgent;
	        // if (userAgent.indexOf("Firefox") != -1) {
	        //     this.privateStore.isFireFox=true;
	        // }
	    },
	    events: {
	    }

	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = {
	    template: '<div  v-show="sharedStore.isOrderViewShow">' +
	                '<div class="shadow-bg"></div>' +
	                '<div id="order-window" class="box-order" style="overflow-x: hidden; overflow-y: hidden;" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
	                    '<div style="height: 40px:line-height: 40px;">' +
	                        '<div id="closeButton" style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideOptionsView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	                    '</div>' +
	                    '<div style="margin: 0 40px;">' +
	                        '<div class="font-title t-left">Select Your Quantity</div>' +
	                    '</div>' +
	                    '<div style="width:100%;height:320px;overflow:hidden;overflow-y: auto;margin: 40px 0px 0px 0px;" >' +
	                        '<div style="display:inline-block;width:100%;margin-left:30px;margin-top:14px;margin-bottom:14px" v-for="item in newImageList">' +
	                        '<span style="display:inline-block;position:relative;height:110px;">' +
	                            '<img class="order-project-image" style="width:auto;position:absolute;top:0;left:0" v-bind:class="{ \'order-select-image\': item.isEmpty}"  id="project-item-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
	                            '<img class="order-project-image" style="width:auto;position:absolute;top:0;left:0" v-bind:class="{ \'order-select-image\': item.isEmpty}"  id="project-item-{{ $index }}" :imageid="item.id" :imageurl="item.url" :src="sharedStore.currentImage" :alt="item.color"/>' +
	                        '</span>' +
	                        '<div style="position:relative;display:inline-block;width:530px;top:15px;left:95px;">' +
	                            '<measure-option v-for="measure in item.measures"  v-bind:measure="measure.measure" v-bind:id="item.id" v-bind:num.sync="measure.num" v-bind:disabled="measure.isDisabled"></measure-option>' +
	                        '</div>' +

	                    '</div>' +

	                '</div>' +


	                '<div style="width: 230px;text-align: center;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;color:red;" v-show="privateStore.isShowEmptyLabel">Please select your quantity!</div>' +

	                '<div>' +
	                '<div v-on:click="handleShowSizeChart()" style="text-decoration: underline;margin-left: 30px;font-size: 14px;color: #7b7b7b;cursor:pointer;">Size Chart</div>'+
	                '<div id="submitButton" class="button t-center" v-on:click="handleSubmitOrder()" style="width: 160px;height: 40px;line-height: 40px;margin:10px auto;font-size: 14px;">Order</div>' +
	                '</div>' +
	                '</div>' +
	                '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width: 670,
	                height: 550,
	                selector: '#order-window',
	                measure: ['S', 'M', 'L', 'XL', 'XXL'],
	                isShowEmptyLabel: false
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	        newImageList: function() {
	            //一个颜色只有一条数据
	            var colors = [];
	            var itemList = [];
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                var color = this.sharedStore.projectSettings[i].color;
	                var count = this.sharedStore.projectSettings[i].count;
	                var measure = this.sharedStore.projectSettings[i].measure;
	                if (colors.indexOf(color) == -1) {
	                    colors.push(color);
	                    var assets = this.getColorAssets(color);
	                    var colorObject = { id: i, name: color, color: color, isEmpty: false, url: assets.backgroundImage, previewUrl: assets.backgroundImage };
	                    var measures = [];
	                    for (var k = 0; k < this.privateStore.measure.length; k++) {
	                        var measure_object = new Object();
	                        var measure_count = 0;
	                        var measure_isDisabled = false;
	                        if (this.privateStore.measure[k] === measure) {
	                            measure_count = count;
	                        };
	                        if(this.isMeasureDisabled(color, this.privateStore.measure[k])) {
	                            measure_isDisabled = true;
	                        }
	                        measure_object.measure = this.privateStore.measure[k];
	                        measure_object.num = measure_count;
	                        measure_object.isDisabled = measure_isDisabled;
	                        measures.push(measure_object);
	                    }
	                    colorObject.measures = measures;
	                    itemList.push(colorObject);
	                } else {
	                    for (var j = 0; j < itemList.length; j++) {
	                        if (color === itemList[j].color) {
	                            for (var u = 0; u < itemList[j].measures.length; u++) {
	                                if (itemList[j].measures[u].measure === measure) {
	                                    itemList[j].measures[u].num = count;
	                                }
	                            }
	                        }
	                    }
	                }


	            }
	            return itemList;
	        },

	        windowZindex: function() {
	          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	              elementTotal = currentCanvas.params.length || 0;

	          return (elementTotal + 10) * 100;
	        },
	    },
	    methods: {
	        handleHideOptionsView: function() {

	            this.sharedStore.isOrderViewShow = false;
	            this.initOrders();
	        },
	        handleSubmitOrder: function() {
	            var isAllEmpty = false;
	            var measureList = [];

	            for (var i = 0; i < this.newImageList.length; i++) {
	                var isEmpty = true;
	                for (var j = 0; j < this.newImageList[i].measures.length; j++) {
	                    if (this.newImageList[i].measures[j].num !== 0) {
	                        isEmpty = false;
	                        measureList.push({ color: this.newImageList[i].color, measure: this.newImageList[i].measures[j].measure, count: this.newImageList[i].measures[j].num });
	                    }

	                }
	                this.newImageList[i].isEmpty = isEmpty;
	                if (isEmpty) {

	                    isAllEmpty = true;
	                }

	            }
	            if (isAllEmpty) {
	                this.privateStore.isShowEmptyLabel = true;
	            } else {
	                this.privateStore.isShowEmptyLabel = false;
	                var newProjectObjects = [];
	                this.sharedStore.projectSettings = [];
	                for (var i = 0; i < measureList.length; i++) {
	                    var measureObject = measureList[i];
	                    var project = __webpack_require__(23).newProject(measureObject.color, measureObject.measure, measureObject.count);
	                    this.sharedStore.projectSettings.push(project);
	                }
	                this.disabledSubmitButton();
	                __webpack_require__(23).orderProject(this);

	            }
	            __webpack_require__(11)({ev: __webpack_require__(13).ClickOrder});
	        },
	        handleCanelOptions: function() {
	            this.sharedStore.isOrderViewShow = false;
	            this.initOrders();
	        },
	        initOrders: function() {
	            this.privateStore.isShowEmptyLabel = false;
	        },
	        getColorAssets: function(type) {
	            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
	                if (this.sharedStore.colorOptionList[i].type === type) {
	                    return this.sharedStore.colorOptionList[i];
	                }
	            }
	        },
	        handleShowSizeChart : function() {
	            this.sharedStore.isSizeChartShow = true;
	        },
	        disabledSubmitButton:function(){
	            $('#submitButton').css('pointer-events','none');
	            $('#submitButton').css('opacity',0.4);
	            $('#closeButton').css('pointer-events','none');
	            $('#closeButton').css('opacity',0.4);
	        },
	        abledSubmitButton:function(){
	            $('#submitButton').css('pointer-events','auto');
	            $('#submitButton').css('opacity',1);
	            $('#closeButton').css('pointer-events','auto');
	            $('#closeButton').css('opacity',1);
	        },
	        isMeasureDisabled: function(color, measure) {
	            return Store.disableOptions[color] && Store.disableOptions[color].options.indexOf(measure) !== -1;
	        }
	    },
	    ready: function() {
	        this.initOrders();
	    },
	    events: {
	        notifyShowOrderWindow: function() {
	            console.log('showOrderWindow');
	            var utilWindow = __webpack_require__(34);
	            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
	            this.sharedStore.isOrderViewShow = true;
	            this.initOrders();
	            this.abledSubmitButton();
	        },
	        notifyReorder : function(){
	            __webpack_require__(23).orderProject(this);
	        },
	        notifyCloseWindow:function(){
	            this.sharedStore.isOrderViewShow = false;
	            this.initOrders();
	            this.abledSubmitButton();
	        }
	    }

	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    mixins: [
	        __webpack_require__(9)
	    ],
	    // template: '#t-header',
	    // fit for IE10, IE11, <template> not supported in html, thus put it here
	    template: '<div class="bed-header">' +
	                // '<div v-if="sharedStore.previewSource !== \'share\' && sharedStore.previewSource !== \'factory\'" style="display: inline-block; height: 50px;">' +
	                //   '<div id="logo" v-on:click="handleLogoClicked()" style="margin-left: 40px;float: left;"/><img src="../../static/img/new-logo.svg" height="15" alt="Logo" style="margin: 20px 20px 10px 0;" /></div>' +
	                //   '<div class="box-title" style="float: left;">' +
	                //     'My {{ productText }}' +
	                //   '</div>' +
	                // '</div>' +
	                '<div style="float: right; height: 48px;margin-top: 2px;">' +
	                  // '<div v-if="sharedStore.previewSource !== \'share\' && sharedStore.previewSource !== \'factory\'" style="width: 60px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleCloseView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 16px; margin-right: 60px; cursor: pointer;" /></div>' +
	                '</div>' +
	              '</div>',
	    data: function() {
	        return {
	            privateStore: {},
	            sharedStore: Store
	        };
	    },
	    computed: {

	        productText: function() {
	            switch (this.sharedStore.projectSettings[Store.currentSelectProjectIndex].product) {
	                case 'TS':
	                    return 'T-Shirt';
	                    break;
	                default:
	                    return '[ERR PRODUCT]';
	            };
	        }
	    },
	    methods: {
	        handleCloseView: function() {
	            var userAgent = navigator.userAgent;
	            window.close();
	        }
	    },
	    events: {

	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {module.exports = {
	    template: '<div v-show="sharedStore.isShowContactUs">' +
	        '<div class="shadow-bg"></div>' +
	        '<div id="contactUsWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
	        '<div style="height: 40px:line-height: 40px;">' +
	        '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	        '</div>' +
	        '<div style="margin: 0 40px;">' +
	        '<div class="font-title t-left">Contact Us</div>' +
	        '</div>' +
	        '<div style="margin: 50px 40px 0; width: 570px;">' +
	        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Have a question?</label>' +

	        '<div class="box-textarea">' +
	        '<textarea v-model="privateStore.question" class="font-textarea"  style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}"></textarea>' +
	        '</div>' +

	        '</div>' +
	        '<div style="margin: 60px 40px 0; width: 570px;">' +
	        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Have a feature request?</label>' +

	        '<div class="box-textarea">' +
	        '<textarea v-model="privateStore.featureRequest" class="font-textarea" style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[1]}}"></textarea>' +
	        '</div>' +

	        '</div>' +
	        '<div style="margin: 60px 40px 0; width: 570px;">' +
	        '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Want to report a bug?</label>' +

	        '<div class="box-textarea">' +
	        '<textarea v-model="privateStore.bug" class="font-textarea" style="height: 80px; width: 533px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[2]}}"></textarea>' +
	        '</div>' +

	        '</div>' +


	        '<div class="texteditor-button" style="margin-top: 50px;">' +
	        '<div id="emptyLabel" style="width: 200px;text-align: center;height: 40px;line-height: 40px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;opacity:0;">Please enter something.</div>' +

	        '<div>' +
	        '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; margin-left: 245px;font-size: 14px;">Done</div>' +
	        '</div>' +
	        '</div>' +
	        '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width: 655,
	                height: 655,
	                question:'',
	                featureRequest:'',
	                bug:'',
	                selector: '#contactUsWindow',
	                marks: ['input your question here', 'input your feature request here', 'input the bug description here']
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	      windowZindex: function() {
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	            elementTotal = currentCanvas.params.length || 0;

	        return (elementTotal + 10) * 100;
	      },
	    },
	    methods: {
	        handleHideView: function() {
	            this.sharedStore.isShowContactUs = false;
	        },
	        checkWords: function(event) {
	          for (var i = 0; i < this.privateStore.marks.length; i++) {userAgent:
	            if(event.target.value === this.privateStore.marks[i]){
	              event.target.value = '';
	            }
	          };
	        },
	        submit:function(){
	          if(this.privateStore.question.trim()===""&&this.privateStore.featureRequest.trim()===""&&this.privateStore.bug.trim()===""){
	            $("#emptyLabel").css('opacity', 1);
	          }else{
	            var question=this.privateStore.question;
	            var featureRequest=this.privateStore.featureRequest;
	            var bug=this.privateStore.bug;
	            var os=navigator.platform;
	            var browser='[appName:'+navigator.appName+';userAgent:'+navigator.userAgent+';appVersion:'+navigator.appVersion+']';
	            __webpack_require__(9).sentContactUs(this,question, featureRequest, bug,os,browser);
	            this.sharedStore.isShowContactUs = false;
	            this.privateStore.question="";
	            this.privateStore.featureRequest="";
	            this.privateStore.bug="";
	          }

	        }
	    },
	    ready: function() {},
	    events: {
	        notifyShowContactUsWindow: function() {
	            console.log('ShowContactUsWindow');
	            var utilWindow = __webpack_require__(34);
	            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
	            this.sharedStore.isShowContactUs = true;
	            $("#emptyLabel").css('opacity', 0);
	        }
	    },
	    created: function() {}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    template: '<div v-show="sharedStore.isShowClone">' +
	                '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
	                '<div id="cloneWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
	                  '<div style="height: 40px:line-height: 40px;">' +
	                    '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	                '</div>' +
	                '<div style="margin: 0 40px;">' +
	                '<div class="font-title t-left">Clone Project</div>' +
	                '</div>' +
	                '<div style="margin: 40px 40px 0; width: 570px;">' +
	                '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Please input new project name</label>' +
	                '<div class="box-textarea">' +
	                '<input id="clone_title" type="text" v-model="privateStore.title" class="font-textarea"  style="width: 533px;height:35px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}" v-on:blur="handleTitleInputBlur()" v-on:focus="handleTitleInputFocus()" maxlength="50"></textarea>' +
	                '</div>' +
	                '</div>' +
	                '<div class="texteditor-button" style="margin-top: 0px;">' +
	                '<div id="emptyInfo" v-show="privateStore.isProjectNameInvalid" style="width: auto;text-align: center;height: 30px;line-height: 30px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;">{{privateStore.invalidateTitle}}</div>' +
	                '<div style="text-align: center; margin-top:25px;">' +
	                '<div class="button t-center button-white" v-on:click="cancel" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px; margin-right: 26px;border: 1px solid #ccc;color: #393939;">Cancel</div>' +
	                '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px;">Clone</div>' +
	                '</div>' +
	                '</div>' +
	              '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width: 655,
	                height: 318,
	                title: '',
	                selector: '#cloneWindow',
	                marks: ['input new name here'],
	                invalidateTitle: 'Please input new project name. ',
	                isProjectNameInvalid: false
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	        windowZindex: function() {
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	                elementTotal = currentCanvas.params.length || 0;

	            return (elementTotal + 10) * 100;

	        },
	    },
	    methods: {
	        handleHideView: function() {
	            this.sharedStore.isShowClone = false;
	            this.privateStore.title = '';
	        },
	        submit: function() {
	            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
	                this.privateStore.invalidateTitle = "Please input new project name";
	                this.privateStore.isProjectNameInvalid = true;

	            } else if (!__webpack_require__(20).checkInvalid(this.privateStore.title)) {
	                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
	                this.privateStore.isProjectNameInvalid = true;
	            } else {
	                this.privateStore.isProjectNameInvalid = false;
	                __webpack_require__(23).cloneProject(this, this.privateStore.title);
	                //this.sharedStore.isShowClone = false;
	                this.privateStore.title = '';

	            }

	        },
	        cancel: function() {
	            this.sharedStore.isShowClone = false;
	            this.privateStore.title = '';
	        },
	        handleTitleInputBlur: function() {
	            this.privateStore.title = this.replaceInvalidString(this.privateStore.title);

	            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
	                this.privateStore.invalidateTitle = "Please input new project name";
	                this.privateStore.isProjectNameInvalid = true;
	                return;
	            }
	            if (!__webpack_require__(20).checkInvalid(this.privateStore.title)) {
	                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
	                this.privateStore.isProjectNameInvalid = true;
	            } else {
	               this.privateStore.isProjectNameInvalid = false;
	            }
	        },
	        handleTitleInputFocus: function(){
	            this.privateStore.invalidateTitle = '';
	        },
	        replaceInvalidString: function(value) {
	            var start_ptn = /<\/?[^>]*>/g;
	            var end_ptn = /[ | ]*\n/g;
	            var space_ptn = /&nbsp;/ig;
	            return value.replace(start_ptn, "").replace(end_ptn, "").replace(space_ptn, "").replace(/(^\s+)|(\s+$)/g, "");
	        }
	    },
	    ready: function() {},
	    events: {
	        notifyShowCloneWindow: function() {

	            var utilWindow = __webpack_require__(34);
	            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
	            this.sharedStore.isShowClone = true;
	            this.privateStore.isProjectNameInvalid = false;
	        },
	        notifyHideCloneWindow: function() {
	            this.sharedStore.isShowClone = false;
	        },
	        notifyShowInvalidTitle: function(title) {
	            this.privateStore.invalidateTitle = title;
	            this.privateStore.isProjectNameInvalid = true;
	        }
	    },
	    created: function() {}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var UtilWindow = __webpack_require__(34);
	module.exports = {

	    template: '<div  v-bind:style="{right:imageToRight + \'px\'}" style="margin-top:10px;width:16px;z-index:100;position: fixed;top:40px;">' +
	                '<div style="min-height:130px" id="project-div-{{item.id}}" v-on:click="projectItemClick(item.id)" v-for="item in newImageList">' +
	                    '<div style="height:130px;margin-top:30px">' +
	                        '<span style="display:inline-block;margin-left:0;margin-top:30px">' +
	                        '<img class="preview-project-image" style="border: 1px solid rgba(250, 250, 250, 1);" id="project-item-{{ item.id }}" :imageid="item.id" :imageurl="item.url" :src="item.previewUrl" :alt="item.color"/>' +
	                        '</span>' +
	                    '</div>' +
	                '</div>' +
	            '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                selectedColor: [],
	            },
	            sharedStore: Store,
	            imageToRight: ""
	        };
	    },
	    computed: {
	        imageToRight : function(){
	            var _this = this,
	                 store = _this.sharedStore,
	                currentCanvas = store.pages[store.selectedPageIdx].canvas;

	            // get the canvas size params
	            if(store.isPreview) {
	                var boxLimit = UtilWindow.getPreviewBoxLimit();
	            }
	            else {
	                var boxLimit = UtilWindow.getBoxLimit();
	            };

	            if(boxLimit.width > 0 && boxLimit.height > 0) {
	                var wX = boxLimit.width / currentCanvas.oriBgWidth,
	                        hX = boxLimit.height / currentCanvas.oriBgHeight;

	                if(wX > hX) {
	                    // resize by height
	                    currentCanvas.ratio = hX;
	                    currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
	                    currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
	                    currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
	                    currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
	                    currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
	                    currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

	                    // when resize by height, the canvas view width is smaller than boxLimit.width, we should make it align center anyway
	                    _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.bgWidth) / 2;
	                }
	                else {
	                    // resize by width
	                    currentCanvas.ratio = wX;
	                    currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
	                    currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
	                    currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
	                    currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
	                    currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
	                    currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;

	                    _this.privateStore.operationPaddingLeft = 0;
	                };

	                _this.privateStore.operationWidth = currentCanvas.bgWidth;
	                _this.privateStore.operationHeight = currentCanvas.bgHeight;
	                _this.privateStore.canvasTop = currentCanvas.y;
	                _this.privateStore.canvasLeft = currentCanvas.x;
	              var imgToLeft = parseInt(52+currentCanvas.bgWidth+currentCanvas.x);
	                console.log(currentCanvas.bgWidth);
	                console.log(currentCanvas.x);
	                console.log(imgToLeft);
	                if(imgToLeft<610){
	                    return 88;
	                }else{
	                    return 200;
	                }
	            }
	        },
	        newImageList: function() {
	            //一个颜色只有一条数据
	            var colors = [];

	            var itemList = [];
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                var color = this.sharedStore.projectSettings[i].color;
	                if (colors.indexOf(color) == -1) {
	                    colors.push(color);
	                    var assets = this.getColorAssets(color);
	                    var colorObject = { id: i, name: color, color: color, url: assets.backgroundImage, previewUrl: assets.backgroundImage };
	                    itemList.push(colorObject);
	                }
	            }
	            this.sharedStore.itemListNum=itemList.length;
	            return itemList;
	        },

	    },
	    methods: {
	        projectItemClick: function(index) {

	            this.sharedStore.currentSelectProjectIndex = index;
	            for (var i = 0; i < this.sharedStore.projectSettings.length; i++) {
	                if (i == index) {
	                    $("#project-item-" + index).css('border-color', '#7b7b7b');
	                } else {
	                    $("#project-item-" + i).css('border-color', '#ffffff');
	                }
	            }
	            Store.vm.$broadcast('notifyRefreshBackground');
	        },
	        getColorAssets: function(type) {
	            for (var i = 0; i < this.sharedStore.colorOptionList.length; i++) {
	                if (this.sharedStore.colorOptionList[i].type === type) {
	                    return this.sharedStore.colorOptionList[i];
	                }
	            }
	        }

	    },
	    events: {},
	    ready: function() {
	        setTimeout(function(){
	            $("#project-item-0").css('border-color', '#7b7b7b');
	        },500);
	        
	    }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    template :  '<div  v-show="sharedStore.isPopupShow">' +
	                    '<div class="shadow-bg" v-show="privateStore.showCenter"></div>' +
	                    '<div id="popup-window" v-show="privateStore.showCenter" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
	                        '<div v-show="privateStore.showcloseButton" style="height: 50px;line-height: 50px;">' +
	                            '<div style="width: 40px;height: 40px;float:right;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePopup" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	                        '</div>' +
	                        '<div style="line-height: 25px;padding:10px 10px 0;text-align:center;color: #3a3a3a;font-size:16px;">{{{ privateStore.msg }}}</div>' +
	                        '<div class="popup-button" style="margin-top:30px;text-align:center;">' +
	                            '<div v-if="privateStore.confirm" class="button t-center" v-on:click="handleOkPopup" style="width: 160px;height: 40px;line-height: 40px;margin:0 auto;font-size: 14px;">{{ privateStore.b0 }}</div>' +
	                                '<template v-else>' +
	                                    '<div class="button t-center" v-on:click="handleNowPopup" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;font-size: 14px;">{{ privateStore.b2 }}</div>' +
	                                    '<div class="button t-center button-white" v-on:click="handleLaterPopup" style="display:inline-block;width: 160px;height: 40px;margin-left:20px;line-height: 40px;font-size: 14px;border:1px solid #393939;color: #393939;box-sizing:border-box;">{{ privateStore.b1 }}</div>' +
	                                '</template>'+
	                            '</div>' +
	                        '</div>' +
	                    '</div>' +
	                    '<div id="pop-window-top" v-show="privateStore.showTop"  style="border:1px solid rgba(232, 232, 232, 1);background:#fff;right:-7px;" v-bind:style="{width: privateStore.tWidth + \'px\',height: privateStore.tHeight + \'px\'}" >' +
	                        '<span class="poptip-arrow-top" style="left:64%;"><em class="poptip-arrow-top-em">◆</em><i class="poptip-arrow-top-i">◆</i></span>' +
	                        '<div v-show="privateStore.showcloseButton" style="height: 40px;line-height: 40px;position:absolute;right:0;">' +
	                            '<div style="width: 40px;height: 40px;position:absolute;right:-1px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHideTopPopup" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 20px; margin-left: 4px; cursor: pointer;" /></div>' +
	                        '</div>' +
	                        '<div style="height:100%;">' +
	                            '<img :src="privateStore.image" v-show="sharedStore.saveImage" style="height:83%;padding: 15px;float: left;">' +
	                            '<span style="line-height:130px;float:left;margin-left: 30px;">{{ privateStore.topMsg }}</span>' +
	                        '</div>' +
	                    '</div>'+
	                '</div>',
	     data: function() {
	        return {
	            privateStore: {
	                params : '',
	                width : 470,
	                height : 206,
	                tWidth : 358,
	                tHeight : 130,
	                confirm : true,
	                showCenter : false,
	                showTop : false,
	                image : null,
	                texts : ["OK","Try Later","Try Now","Continue","Save","Replace","Place on top","Sure","Cancel","Don't Save","Save as"],
	                b1 : "Try Later",
	                b2 : "Try Now",
	                b0 : "OK",
	                showcloseButton : true,
	                msg : '',
	                topMsg : '',
	                selector : '#popup-window',
	                addparams : ''
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	      windowZindex: function() {
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	            elementTotal = currentCanvas.params.length || 0;

	        return (elementTotal + 12) * 100;
	      },
	    },
	    methods : {

	        handleNowPopup : function(){
	            var type = this.privateStore.type;
	            if(type==="order"){
	                this.$dispatch("dispatchReorder");
	            }else if(type==="logo"){
	              Store.isPopSave=false;
	                __webpack_require__(23).handledSaveOldProject(this,'dispatchRedirectHome');
	            }else if(type==="replace"){
	                var store = this.sharedStore,idx = store.pages[store.selectedPageIdx].canvas.elements.length,
	                    imageId = store.dragData.imageId;
	                store.shouldNewImage = true;
	                this.$dispatch("dispatchAddImage",this.privateStore.addparams);
	            }else if(type==="delete"){
	                var idx=this.privateStore.addparams.idx;
	                var type=this.privateStore.addparams.type;
	                this.sharedStore.watchData.removeElementIdx=idx;
	                this.sharedStore.watchData.removeElementType=type;
	                this.sharedStore.watches.isRemoveElement=true;
	            }else if(type==="saveAs"){
	                this.$dispatch('dispatchShowCloneWindow');
	            }else if(type==='login'){
	                window.open("/sign-in.html", "_blank");
	            }
	            this.handleHidePopup();
	            this.initOptions();
	        },

	        handleLaterPopup : function(){
	            var type = this.privateStore.type;
	            if(type==="order"){
	                //...
	            }else if(type==="logo"){
	                Store.isPopSave=false;
	                this.redirectHome();
	            }else if(type==="replace"){
	                var idx = this.sharedStore.dropData.idx,
	                    imageId = this.sharedStore.dragData.imageId;
	                var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	                currentCanvas.elements[idx].refreshImageById(imageId);
	            }else if(type==='cancelUpload'){
	                for(var i=0;i<this.sharedStore.uploadProgress.length;i++){
	                      Store.vm.$broadcast("notifyCancelItem",i);
	                 }
	                 if(Store.cancelByX){
	                    __webpack_require__(11)({ev: __webpack_require__(13).CancelAllFilesByXClicked});
	                }else{
	                    __webpack_require__(11)({ev: __webpack_require__(13).CancelAllFilesClicked});
	                }

	                 this.sharedStore.isImageUploadShow = false;
	                 __webpack_require__(11)({ev: __webpack_require__(13).CloseMonitor,auto:false});
	            }
	            this.handleHidePopup();
	            this.initOptions();
	        },

	        handleOkPopup : function(){
	            var type = this.privateStore.type;
	            if(type==="order"){
	                //...
	            }
	            this.handleHidePopup();
	            this.initOptions();
	        },

	        handleHidePopup : function(){
	            // this.sharedStore.isPopupShow = false;
	            // this.privateStore.showTop = this.privateStore.showTop && false;
	            this.privateStore.showCenter = false;
	        },

	        handleHideTopPopup : function(){
	            // this.sharedStore.isPopupShow = false;
	            this.privateStore.showTop = false;
	        },

	        initOptions : function(){
	            this.sharedStore.isPopupShow=false;
	            this.privateStore.confirm = true;
	            this.privateStore.msg = '';
	            this.privateStore.showcloseButton = true;
	            this.privateStore.showCenter = false;
	            this.privateStore.showTop = false;
	            this.privateStore.b1 = this.privateStore.texts[1];
	            this.privateStore.b2 = this.privateStore.texts[2];

	        },

	        redirectHome : function(){
	            location.href = "/";
	        },

	        strategies : function(){
	            var _this = this,oldHeight=_this.privateStore.height;
	            _this.privateStore.height=206;
	            return  {
	                'order' : function(status){
	                    if(status==-1){
	                        _this.privateStore.confirm = false;
	                        _this.privateStore.b1 = _this.privateStore.texts[1];
	                        _this.privateStore.b2 = _this.privateStore.texts[2];
	                        _this.setMsg('Unable to add to cart, please try again.');
	                    }
	                },
	                'save' : function(status){
	                    _this.privateStore.b0 =_this.privateStore.texts[0];
	                    // _this.privateStore.confirm = true;
	                    if(status==0){
	                        _this.privateStore.height = oldHeight;
	                        _this.setTopMsg('Saved successfully!');
	                        // _this.privateStore.showCenter = false;
	                        _this.privateStore.showTop = true;
	                        _this.privateStore.image = _this.getImageSelected();
	                        return true;
	                    }else if(status==-1){
	                        _this.privateStore.msg = 'Unable to save, please try again.';
	                    }else if(status==-2){
	                        _this.privateStore.msg = 'Project Title already Exists';
	                    }else if(status==-3){
	                        _this.privateStore.height=246;
	                        _this.privateStore.msg = "This item was already ordered, you can't modify it anymore. Please create a new project if you want to modify.";
	                    }
	                },
	                'preview' : function(status){
	                    if(status==-1){
	                        _this.privateStore.b0 =_this.privateStore.texts[0];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('Preview failed, please try again.');
	                    }
	                },
	                'upload' : function(status){
	                    if(status==-1){
	                        _this.privateStore.b0 =_this.privateStore.texts[0];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('Please wait for the upload to finish.');
	                    }
	                },
	                'contact' : function(status){
	                    if(status==0){
	                        _this.privateStore.b0 =_this.privateStore.texts[0];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('Submit successfully.\nMany thanks for your feedback.');
	                    }else{
	                        _this.privateStore.b0 =_this.privateStore.texts[0];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('Send failed, you may try again later');
	                    }
	                },
	                'spec' : function(status){
	                    if(status==-1){
	                        _this.privateStore.b0 =_this.privateStore.texts[0];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('Request api service failed');
	                    }
	                },
	                'logo' : function(status){
	                    if(status==-1){
	                        _this.privateStore.height=232;
	                        _this.privateStore.width=510;
	                        _this.privateStore.b1 = _this.privateStore.texts[9];
	                        _this.privateStore.b2 = _this.privateStore.texts[4];
	                        _this.privateStore.confirm = false;
	                        _this.setMsg('This will take you to home page.<br/>Please select an option before continuing.');
	                    }
	                },
	                'replace' : function(status){
	                    if(status==-1){
	                        _this.privateStore.b1 = _this.privateStore.texts[5];
	                        _this.privateStore.b2 = _this.privateStore.texts[6];
	                        _this.privateStore.confirm = false;
	                        _this.setMsg('How do you want to handle this image? ');
	                    }
	                },
	                'isOrder' : function(status){
	                    if(status==-1){
	                        _this.privateStore.height=250;
	                        _this.privateStore.b0 =_this.privateStore.texts[3];
	                        _this.privateStore.confirm = true;
	                        _this.setMsg('This item was already ordered, you can not modify it anymore. Please create a new project if you want to modify.');
	                    }
	                },
	                'delete' :function(status){
	                    if(status==-1){
	                        _this.privateStore.b1 = _this.privateStore.texts[8];
	                        _this.privateStore.b2 = _this.privateStore.texts[7];
	                        _this.privateStore.confirm = false;
	                        _this.setMsg('Current element will  be removed from workbench, please confirm? ');
	                    }
	                },
	                'saveAs' :function(status){
	                    _this.privateStore.height=236;
	                    _this.privateStore.b1 = _this.privateStore.texts[8];
	                    _this.privateStore.b2 = _this.privateStore.texts[10];
	                    _this.privateStore.confirm = false;
	                    _this.setMsg(_this.privateStore.params.info);
	                },
	                'clone' :function(status){
	                    _this.privateStore.confirm = true;
	                    _this.setMsg(_this.privateStore.params.info);

	                },
	                'cancelUpload' : function(){
	                    _this.privateStore.b1 = _this.privateStore.texts[3];
	                    _this.privateStore.b2 = _this.privateStore.texts[8];
	                    _this.privateStore.confirm = false;
	                    _this.setMsg('Your image has not been uploaded.<br />What do you want to do?');
	                },
	                'login':function(){
	                    _this.privateStore.height=260;
	                    _this.privateStore.b1 = _this.privateStore.texts[8];
	                    _this.privateStore.b2 = "Log In";
	                    _this.setMsg('Your session has timed out. You must log in again to continue. Clicking Log In will open a new window. Once successfully logged in, you may return to this window to continue editing.');
	                    _this.privateStore.confirm = false;
	                }
	            }
	        },

	        showPopup: function(params) {
	            this.privateStore.params = params;
	            if(params.type!=='save'){
	                this.privateStore.type = params.type;
	            }
	            this.checkType(params);
	            if(this.privateStore.showCenter){
	                var utilWindow=__webpack_require__(34);
	                utilWindow.setPopWindowPosition({width:this.privateStore.width,height:this.privateStore.height,selector:this.privateStore.selector});
	            }
	            this.sharedStore.isPopupShow = true;
	        },

	        checkType : function(params){
	            if(!this.strategies()[params.type](params.status)){
	                this.privateStore.showCenter = true;
	            }else{
	                this.privateStore.showTop = true;
	            }
	        },

	        getImageSelected : function(){
	            if(this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color && this.sharedStore.selectedPageIdx != null) {
	                return './assets/img/'+ this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color +'-'+ this.sharedStore.selectedPageIdx +'.png';
	            };
	        },

	        setMsg : function(msg){
	            this.privateStore.msg = msg;
	        },

	        setTopMsg : function(msg){
	            this.privateStore.topMsg = msg;
	        }
	    },
	    events : {
	        notifyShowPopup : function(params){
	            var _this = this;
	            this.showPopup(params);
	            if(_this.privateStore.showTop){
	                setTimeout(function(){
	                    _this.handleHideTopPopup();
	                },2000);
	            }
	        },
	        notifyRedirectHome : function(){
	            this.redirectHome();
	        },
	        notifyAddOrReplaceImage : function(params){
	            this.showPopup({type:'replace',status:-1});
	            this.privateStore.addparams = params
	        },
	        notifyDeleteElement:function(params){
	            //var index=params.idx;
	            //var type=params.type;
	            this.showPopup({type:'delete',status:-1});
	            this.privateStore.addparams = params
	        }
	    },
	    ready : function(){
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var DrawManage = __webpack_require__(16);
	var ProjectManage = __webpack_require__(18);

	module.exports = {
	 template: '<canvas id="screenshot" style="display:none;position:absolute;" v-bind:width="width" v-bind:height="height"></canvas>',
	  data: function() {
	    return {
	      privateStore : {
	          ratio : 0,
	          timer : null
	      },
	      sharedStore : Store
	    };
	  },
	  computed: {
	      width : function(){
	          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	          return currentCanvas.bgWidth;
	      },
	      height : function(){
	          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	          return currentCanvas.bgHeight;
	      }
	  },
	  methods: {
	      createScreenshot : function(){
	          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	              params = currentCanvas.params;
	          this.privateStore.ratio = currentCanvas.ratio;
	          var container = $("#container"),screenshot = $("#screenshot").get(0);
	          params = this.sortByDepth(params.slice(0));
	          this.getAddon(params);
	          DrawManage.drawRect("screenshot","#fff",0,0,screenshot.width,screenshot.height);
	          this.drawBg();
	          this.drawElems(params);
	      },
	      refreshScreenshot : function(){
	          DrawManage.clear("screenshot");
	          this.createScreenshot();
	      },
	      sortByDepth : function(arr){
	          return arr.sort(function(a,b){
	              return a.dep > b.dep;
	          });
	      },
	      getAddon : function(params){
	        this.drawElems(params);
	        this.sharedStore.currentImage = screenshot.toDataURL('image/png');
	      }, 
	      drawElems : function(params){
	         var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	            canvas = document.createElement("canvas"),
	            ctx = canvas.getContext("2d"),
	            screenshot = $("#screenshot").get(0),
	            sctx = screenshot.getContext("2d");
	          canvas.width = currentCanvas.bgWidth;
	          canvas.height = currentCanvas.bgHeight;
	          for(var i=0,len=params.length;i<len;i++){
	              var item = params[i],
	                  sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
	              //to limit image in operation area
	              ctx.drawImage($("#"+sourceId).get(0),item.x*this.privateStore.ratio,item.y*this.privateStore.ratio);
	          }
	          sctx.drawImage(canvas,0,0,currentCanvas.width,currentCanvas.height,currentCanvas.x,currentCanvas.y,currentCanvas.width,currentCanvas.height);
	      },
	      drawBg : function(){
	        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	        DrawManage.drawCanvas("screenshot","bg-part",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
	      }
	  },
	  events: {
	      notifyRefreshScreenshot : function(){
	        if(this.sharedStore.selectedPageIdx===0) { 
	          var _this = this;
	          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
	          _this.privateStore.timer = setTimeout(function(){
	            _this.refreshScreenshot();
	          },100);
	        };
	      }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	// module -- inner preview

	module.exports = {
	  template: '<div v-show="sharedStore.isInnerPreviewShow" style="position: fixed; z-index: 9999999; left: 0; top: 0; width: 100%; height: 100%; background-color: white;">' +
	              '<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePreview()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position: absolute; top: 18px; right: 44px; cursor: pointer;" />' +
	              '<iframe v-bind:src="privateStore.previewUrl" frameborder="0" scrolling="auto" style="width: 100%; height: 100%;">' +
	              '</iframe>' +
	            '</div>',
	  data: function() {
			return {
				privateStore: {
	        previewUrl: ''
				},
				sharedStore: Store
			};
		},
	  computed: {
	    // previewUrl: function() {
	    //   var editUrl = window.location.href;
	    //   var prefix = editUrl.split('index.html?')[0];
	    //
	    //   editUrl = prefix + 'preview.html?initGuid=' + Store.projectId + '&isPreview=true&source=self';
	    //
	    //   return editUrl;
	    // },
	  },
	  methods: {
	    handleHidePreview: function() {
	      this.sharedStore.isInnerPreviewShow = false;
	    },
	  },
	  ready: function() {
	    var _this = this;

	    _this.$watch('sharedStore.isInnerPreviewShow', function() {
	      if(_this.sharedStore.isInnerPreviewShow) {
	        var editUrl = window.location.href;
	        var prefix = editUrl.split('index.html?')[0];

	        editUrl = prefix + 'preview.html?initGuid=' + Store.projectId + '&isPreview=true&source=self';

	        _this.privateStore.previewUrl = editUrl;
	      }
	      else {
	        _this.privateStore.previewUrl = '';
	      };
	    });
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {module.exports = {
	    template: '<div>' +
	                    '<div class="shadow-bg" v-show="privateStore.isShowCartReturn" v-bind:style="{zIndex: windowZindex-1}"></div>' +
	                    '<div id="cartReturnWindow" v-show="privateStore.isShowCartReturn" class="box-popup" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }" >' +
	                        '<div style="font-size: 24px;margin: 40px 45px 54px 45px;color: #3a3a3a;">What would you like to do?</div>'+
	                        '<div style="margin: 40px 45px 54px 45px;">'+
	                            '<div>'+
	                                '<input id="currentItem" name="cartRerutnItem" type="radio" value="current" v-model="privateStore.selected"><label for="currentItem" style="font-size:18px;color: #3a3a3a;">Edit current project</label>'+
	                                '<div style="font-size:14px;color: #7b7b7b;margin: 10px 0 0 22px;height: 50px;"></div>'+
	                            '</div>'+
	                            '<div>'+
	                                '<input id="cloneItem" name="cartRerutnItem" type="radio" value="clone" v-model="privateStore.selected"><label for="cloneItem" style="font-size:18px;color: #3a3a3a;">Clone current project</label>'+
	                                '<div style="font-size:14px;color: #7b7b7b;margin: 10px 0 0 22px;height: 50px;">Create a copy of the current project to edit.</div>'+
	                            '</div>'+
	                            '<div>'+
	                                '<input id="newItem"  name="cartRerutnItem" type="radio" value="new" v-model="privateStore.selected"><label for="newItem" style="font-size:18px;color: #3a3a3a;">Create a new blank project</label>'+
	                                
	                            '</div>'+
	                        '</div>'+
	                        '<div class="popup-button" style="margin-top:35px;text-align:center;">' +
	                            '<div class="button t-center" v-on:click="optionChange()" style="display:inline-block;width: 160px;height: 40px;line-height: 40px;font-size: 14px;">Continue</div>' +
	                        '</div>' +
	                    '</div>' +
	                '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width:580,
	                height:450,
	                selector: '#cartReturnWindow',
	                selected:'current',
	                isShowCartReturn:false

	            },
	            sharedStore: Store
	         };
	    },
	    computed: {
	        windowZindex: function() {
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	                    elementTotal = currentCanvas.params.length || 0;

	            return (elementTotal + 10) * 100;
	        },
	    },
	    methods: {
	        optionChange:function(){
	            switch(this.privateStore.selected){
	                case 'current':
	                this.privateStore.isShowCartReturn = false;
	                return;
	                case 'clone':
	                Store.fromCart=false;
	                this.privateStore.isShowCartReturn = false;
	                this.$dispatch('dispatchShowCloneWindow');
	                return;
	                case 'new':
	                Store.fromCart=false;
	                Store.watches.isProjectLoaded=false;
	                this.privateStore.isShowCartReturn = false;
	                this.$dispatch('dispatchShowNewProjectWindow');
	                return;

	            }
	        }
	    },
	    events: {
	        notifyShowCartReturnWindow: function() {

	            var utilWindow = __webpack_require__(34);
	            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
	            this.privateStore.isShowCartReturn = true;
	        }
	    },
	    created:function(){
	    },
	    ready:function(){
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var ProjectService = __webpack_require__(9);
	module.exports = {
	    template: '<div v-show="privateStore.isShowCreateProject">' +
	                '<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
	                '<div id="newProjectWindow" class="box-order" v-bind:style="{width: privateStore.width + \'px\',height: privateStore.height + \'px\', zIndex: windowZindex }">' +
	                  '<div style="height: 40px:line-height: 40px;">' +
	                    '<div style="width: 40px;height: 40px;margin-left: 610px;font-size: 20px;"><img src="../../static/img/close-normal.svg" draggable="false" width="16" height="16" v-on:click="handleHideView()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
	                '</div>' +
	                '<div style="margin: 0 40px;">' +
	                '<div class="font-title t-left">Create a new project</div>' +
	                '</div>' +
	                '<div style="margin: 40px 40px 0; width: 570px;">' +
	                '<label class="options-label font-label" style="height: 35px; line-height: 35px;width: 100%;">Please input new project name</label>' +
	                '<div class="box-textarea">' +
	                '<input id="new_project_title" type="text" v-model="privateStore.title" class="font-textarea"  style="width: 533px;height:35px; line-height: 35px; background-color: #f5f5f5;" placeholder="{{privateStore.marks[0]}}" v-on:blur="handleTitleInputBlur()" maxlength="50"></textarea>' +
	                '</div>' +
	                '</div>' +
	                '<div class="texteditor-button" style="margin-top: 0px;">' +
	                '<div id="new_project_emptyInfo" style="width: auto;text-align: center;height: 30px;line-height: 30px;font-size: 14px;color:red;margin-left:auto;margin-right:auto;visibility:hidden;">{{privateStore.invalidateTitle}}</div>' +
	                '<div style="text-align: center;margin-top:25px;">' +
	                '<div class="button t-center button-white" v-on:click="cancel" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px; margin-right: 26px;border: 1px solid #ccc;color: #393939;">Cancel</div>' +
	                '<div class="button t-center" v-on:click="submit" style="width: 160px;height: 40px;line-height: 40px;display: inline-block; font-size: 14px;">Done</div>' +
	                '</div>' +
	                '</div>' +
	              '</div>',
	    data: function() {
	        return {
	            privateStore: {
	                width: 655,
	                height: 318,
	                title: '',
	                selector: '#newProjectWindow',
	                marks: ['input new name here'],
	                invalidateTitle: 'Please input new project name. ',
	                isShowCreateProject:false
	            },
	            sharedStore: Store
	        };
	    },
	    computed: {
	        windowZindex: function() {
	            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	                elementTotal = currentCanvas.params.length || 0;

	            return (elementTotal + 10) * 100;

	        },
	    },
	    methods: {
	        handleHideView: function() {
	            this.privateStore.isShowCreateProject = false;
	            this.privateStore.title = '';
	        },
	        submit: function() {
	            var _this = this;
	            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
	                this.privateStore.invalidateTitle = "Please input new project name";
	                $("#new_project_emptyInfo").css("visibility", "visible");

	            } else{
	                if(this.privateStore.title === Store.title){
	                    var errorString = "Title existed, please pick another one.";
	                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
	                }else if (!__webpack_require__(20).checkInvalid(this.privateStore.title)) {
	                    this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
	                    $("#new_project_emptyInfo").css("visibility", "visible");
	                } else {
	                    __webpack_require__(9).createProjectAddOrUpdateAlbum(_this.privateStore.title,Store.title,function(title){
	                        $("#new_project_emptyInfo").css("visibility", "hidden");
	                        __webpack_require__(23).createProject(_this, title);
	                        _this.privateStore.title = '';
	                    },function(){
	                        // var errorString = "Title existed, please pick another one.";
	                        // Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
	                    })            
	                }
	            }   

	        },
	        cancel: function() {
	            this.privateStore.isShowCreateProject = false;
	        },
	        handleTitleInputBlur: function() {
	            this.privateStore.title = this.replaceInvalidString(this.privateStore.title);

	            if (!this.privateStore.title || this.privateStore.title.trim() === "") {
	                this.privateStore.invalidateTitle = "Please input new project name";
	                $("#new_project_emptyInfo").css("visibility", "visible");
	                return;
	            }
	            if (!__webpack_require__(20).checkInvalid(this.privateStore.title)) {
	                this.privateStore.invalidateTitle = "Only letters, numbers, blank space, - (hyphen) and _ (underscore) are allowed in the title.";
	                $("#new_project_emptyInfo").css("visibility", "visible");
	            } else {
	                $("#new_project_emptyInfo").css("visibility", "hidden");
	            }
	        },
	        replaceInvalidString: function(value) {
	            var start_ptn = /<\/?[^>]*>/g;
	            var end_ptn = /[ | ]*\n/g;
	            var space_ptn = /&nbsp;/ig;
	            return value.replace(start_ptn, "").replace(end_ptn, "").replace(space_ptn, "").replace(/(^\s+)|(\s+$)/g, "");
	        }
	    },
	    ready: function() {
	      
	    },
	    events: {
	        notifyShowNewProjectWindow: function() {

	            var utilWindow = __webpack_require__(34);
	            utilWindow.setPopWindowPosition({ width: this.privateStore.width, height: this.privateStore.height, selector: this.privateStore.selector });
	            this.privateStore.isShowCreateProject = true;
	            $("#new_project_emptyInfo").css("visibility", "hidden");
	        },
	        notifyHideNewProjectWindow: function() {
	            this.privateStore.isShowCreateProject = false;
	        },
	        notifyShowNewProjectInvalidTitle: function(title) {
	            this.privateStore.invalidateTitle = title;
	            $("#new_project_emptyInfo").css("visibility", "visible");
	        }
	    },
	    created: function() {}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, $) {var ParamsManage = __webpack_require__(27);
	var ImageListManage = __webpack_require__(26);

	module.exports = {
	    template: '<div id="warnTipElement-{{ id }}" v-show="scale > warnTipLimit" v-bind:style="{ height:  (privateStore.height) + \'px\', bottom: bottom + \'px\', left: left + \'px\', zIndex: windowZindex }" style="position: absolute;">' +
	      '<img src="../../static/img/warn_big_icon.svg" width="{{ privateStore.width }}px" height="{{ privateStore.height }}px" alt="" title="{{ warnTipMsg }}" /> {{ privateStore.warnTipContent }}' +
	    '</div>',
	    props: [
	        'id',
	        'width',
	        'height',
	        'x',
	        'y',
	        'pagenum'
	    ],
	    data: function() {
	        return {
	            privateStore: {
	                width: 18,
	                height: 18,
	                warnTipContent : '',
	                margin : Store.warnTipMargin || 90,
	                scale : 1
	            },
	            sharedStore : Store
	        };
	    },
	    computed: {
	        warnTipLimit:function(){
	            /*var Prj = Store.projectSettings[Store.currentSelectProjectIndex];
	            if(Prj.category==="categoryCanvas"){*/
	                return this.sharedStore.warnTipLimit || 200;
	            /*}else{
	                return 30;
	            }*/
	        },
	        scale: function() {
	            var currentCanvas = this.sharedStore.pages[this.pagenum || this.sharedStore.selectedPageIdx].canvas,
	                idx = ParamsManage.getIndexById(this.id),
	                params = currentCanvas.params[idx],
	                imageDetail = ImageListManage.getImageDetail(params.imageId),
	                cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
	                // cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH,
	                frameWidth = this.width / currentCanvas.ratio;
	                // scaleW = this.width / currentCanvas.ratio / cropWidth;
	                // scaleH = this.height / currentCanvas.ratio / cropHeight;

	            if(cropWidth < frameWidth) {
	            //   var scaleW = Math.round((frameWidth - cropWidth) * 100 / frameWidth);
	              var scaleW = (frameWidth - cropWidth) * 100 / cropWidth;
	            }
	            else {
	              var scaleW = 0;
	            };

	            return Math.round(scaleW);
	        },

	        bottom : function(){
	            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	            var offset = this.privateStore.margin * currentCanvas.ratio

	            // 如果store里面有设置warnTipBottom，直接重置warnTipBottom作为bottom
	            if(this.sharedStore.warnTipBottom) {
	                return this.sharedStore.warnTipBottom;
	            }

	            if(this.sharedStore.isCanvas){
	                var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y) - currentCanvas.canvasBordeThickness.top) * currentCanvas.ratio;
	                if(this.y + this.height > offsetY){
	                    offset += this.y + this.height - offsetY;
	                }
	                return offset;
	            }

	            // 不同产品的WarnTip bottom值
	            switch(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']) {
	                case 'frameCanvas':
	                case 'acrylicPrint':
	                case 'metalPrint':
	                case 'woodPrint':
	                case 'LRB':
	                case 'LSC':
	                case 'mountPrint': {
	                    var offsetY = (currentCanvas.photoLayer.height - Math.abs(currentCanvas.photoLayer.y)) * currentCanvas.ratio;

	                    if(this.y + this.height > offsetY){
	                        offset += this.y + this.height - offsetY;
	                    }
	                    return offset;
	                }
	                case 'IPadCase': {
	                    return (this.privateStore.margin +
	                        currentCanvas.realSides.bottom +
	                        currentCanvas.realEdges.bottom +
	                        currentCanvas.realBleedings.bottom +
	                        10) * currentCanvas.ratio;
	                }
	                case 'PhoneCase': {
	                    return (this.privateStore.margin +
	                        currentCanvas.realSides.bottom +
	                        currentCanvas.realEdges.bottom +
	                        currentCanvas.realBleedings.bottom)
	                        * currentCanvas.ratio;
	                }
	                default: {
	                    var currentCanvasTop = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
	                        ? Math.abs(currentCanvas.boardInMatting.top)
	                        : Math.abs(currentCanvas.photoLayer.y);

	                    var offsetY = (currentCanvas.photoLayer.height - currentCanvasTop) * currentCanvas.ratio;

	                    if(this.y + this.height > offsetY){
	                        offset = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
	                            ? offset + currentCanvas.boardInMatting.bottom * currentCanvas.ratio
	                            : offset + currentCanvas.boardInFrame.bottom * currentCanvas.ratio;
	                    }
	                    return offset;
	                }
	            }
	        },

	        left : function(){
	            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
	            var offset = this.privateStore.margin* currentCanvas.ratio;

	            // 如果store里面有设置warnTipLeft，直接重置warnTipLeft作为left
	            if(this.sharedStore.warnTipLeft) {
	                return this.sharedStore.warnTipLeft;
	            }

	            if(this.sharedStore.isCanvas){
	                var offsetX = (Math.abs(currentCanvas.photoLayer.x) + currentCanvas.canvasBordeThickness.left) * currentCanvas.ratio;
	                if(this.x < offsetX){
	                    offset += offsetX - this.x;
	                }
	                return offset;
	            }

	            switch(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']) {
	                case 'frameCanvas':
	                case 'flushMountCanvas':
	                case 'acrylicPrint':
	                case 'metalPrint':
	                case 'woodPrint':
	                case 'LRB':
	                case 'LSC':
	                case 'mountPrint': {
	                    var offsetX = Math.abs(currentCanvas.photoLayer.x) * currentCanvas.ratio;
	                    if(this.x < offsetX){
	                        offset += offsetX - this.x;
	                    }
	                    if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product'] == "acrylicPrint"){
	                        offset += 300 * currentCanvas.ratio;
	                    }

	                    return offset;
	                }
	                case 'IPadCase': {
	                    return (this.privateStore.margin +
	                        currentCanvas.realSides.left +
	                        currentCanvas.realEdges.left +
	                        currentCanvas.realBleedings.left +
	                        300) * currentCanvas.ratio;
	                }
	                case 'PhoneCase': {
	                    return (this.privateStore.margin +
	                        currentCanvas.realSides.left +
	                        currentCanvas.realEdges.left +
	                        currentCanvas.realBleedings.left)
	                        * currentCanvas.ratio;
	                }
	                default: {
	                    var offsetX = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
	                        ? Math.abs(currentCanvas.boardInMatting.left) * currentCanvas.ratio
	                        : Math.abs(currentCanvas.photoLayer.x) * currentCanvas.ratio;

	                    if(this.x < offsetX){
	                        offset = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte'] === 'M'
	                            ? offset + currentCanvas.boardInMatting.left * currentCanvas.ratio
	                            : offset + currentCanvas.boardInFrame.left * currentCanvas.ratio;
	                    }
	                    return offset;
	                }
	            }
	        },

	        mirrorLength : function(){
	            var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

	            return currentCanvas.ratio * this.sharedStore.mirrorLength;
	        },

	        windowZindex: function() {
	          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas,
	              idx = ParamsManage.getIndexById(this.id),
	              parentEl = currentCanvas.params[idx];

	          return (parentEl.dep + 1) * 100 + 80;
	        },

	        warnTipMsg: function() {
	            // console.log("scale",this.scale)
	            /*var Prj = Store.projectSettings[Store.currentSelectProjectIndex];
	            if(Prj.category==="categoryCanvas"){*/
	                /*return 'Image is enlarged ' + this.scale + '% beyond original size, most images print well up to ' +
	                    (this.sharedStore.warnTipLimit || 200) +'% beyond original size.';*/

	                return 'Photo has low resolution and may look poor in print.';
	            /*}else{
	                return 'Image is enlarged ' + this.scale + '% beyond original size, most images print well up to 50% beyond original size.';
	            }*/

	        },
	    },
	    methods: {
	        hideWarnTip : function(idx){
	            $("#warnTipElement-" + idx).hide();
	        },
	        showWarnTip : function(idx){
	            $("#warnTipElement-" + idx).show();
	        },
	    },
	    events: {
	       notifyShowWarnTip : function(){
	            var idx = ParamsManage.getIndexById(this.id);
	            this.showWarnTip(idx);
	       },
	       notifyHideWarnTip : function(){
	            var idx = ParamsManage.getIndexById(this.id);
	            this.hideWarnTip(idx);
	       }
	    },
	    created:function(){
	    },
	    ready:function(){
	        // var index = ParamsManage.getIndexById(this.id),
	        //     scale = require("ScaleManage").getImageScale(index);
	        // if(scale > Store.warnSettings.resizeLimit){
	        //     this.showWarnTip(index);
	        // }else{
	        //     this.hideWarnTip(index);
	        // }
	    }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store) {
	module.exports = {
		events: {
			// child instance dispatch image upload
			dispatchImageUpload: function() {
				this.$broadcast('notifyShowImageUpload');
			},

			// child instance dispatch image list
			dispatchImageList: function() {
				this.$broadcast('notifyImageList');
			},

			dispatchImageCrop: function() {
				this.$broadcast('notifyImageCrop');
			},

			dispatchReplaceImage : function(param){
				this.$broadcast('notifyReplaceImage',param);
			},

			dispatchShowAddText: function() {
			  this.$broadcast('notifyShowAddText');
			},

			dispatchAddText: function(idx) {
				this.$broadcast('notifyAddText', idx);
			},

			dispatchModifyText: function(idx) {
			  this.$broadcast('notifyModifyText', idx);
			},

			dispatchResetCanvas: function() {
			  this.$broadcast('notifyResetCanvas');
			},

			dispatchShowSpineLines: function() {
				this.$broadcast('notifyShowSpineLines');
			},

			dispatchHideSpineLines: function() {
				this.$broadcast('notifyHideSpineLines');
			},

			dispatchShowOptionWindow: function() {
				this.$broadcast('notifyShowOptionWindow');
			},

			dispatchUpdateAlbumResponse: function(isValid,text) {
				this.$broadcast('notifyUpdateAlbumResponse',isValid,text);
			},

			dispatchShowOrderWindow: function() {
				this.$broadcast('notifyShowOrderWindow');
			},

			dispatchShowContactUsWindow:function(){
				this.$broadcast('notifyShowContactUsWindow');
			},

			dispatchPreviewSave:function(result){
				this.$broadcast('notifyPreviewSave',result);
			},

			dispatchShowPopup : function(params){
				this.$broadcast('notifyShowPopup',params)
			},

			dispatchReorder : function(params){
				this.$broadcast("notifyReorder",params);
			},

			dispatchRedirectHome : function(){
				this.$broadcast("notifyRedirectHome");
			},
			dispatchDepthFront: function(idx) {
				console.log(idx);
			},
			dispatchShowWarnTip : function(idx){
				this.$broadcast("notifyShowWarnTip",idx);
			},

			dispatchHideWarnTip : function(idx){
				this.$broadcast("notifyHideWarnTip",idx);
			},

			dispatchShowOptionsWindow : function(){
				this.$broadcast("notifyShowOptionsWindow");
			},

			dispatchRotate : function(){
				this.$broadcast("notifyRotate");
			},

			dispatchRepaintProject: function() {
				this.$broadcast('notifyRepaintProject');
			},

			dispatchAddImage : function(params){
				this.$broadcast("notifyAddImage",params);
			},

			dispatchShowCloneWindow:function(){
				this.$broadcast("notifyShowCloneWindow");
			},
			dispatchResetProjectInfo:function(){

				if(__webpack_require__(20).getIsShowProjectInfoView()){
					//this.$broadcast("notifyResetProjectInfo",false);
					var text=__webpack_require__(20).getProjectInfoViewText();
					/*this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});*/

				}else{
					this.$broadcast("notifyResetProjectInfo",true);
				}
			},

			// some system actions
			dispatchClearScreen: function(isFullClear) {
				isFullClear ? isFullClear = true : isFullClear = false;

				if(isFullClear) {
					// full screen clearing
				}
				else {
					// half screen clearing
				};

				// common screen clearing
				// 1. blur action focus
				this.sharedStore.isLostFocus = true;
			},
			
			dispatchShowProjectChooseWindow:function(){
				Store.fromCart=true;
				Store.watches.isProjectLoaded=false;
				__webpack_require__(9).getProjectIdByTitle(Store.title);
				this.$broadcast("notifyShowCartReturnWindow");
				
			},
			dispatchGetProjectIdByTitleSuccess:function(){
				//Store.fromCart=true;
				//Store.projectId="131412";
				//Store.watches.isProjectLoaded=false;
				if (Store.userSettings.userId !== '' && Store.projectId !== '') {

	                __webpack_require__(9).getProjectInfo();
		            __webpack_require__(23).getOldProject();

	            };
			},
			dispatchShowNewProjectWindow:function(){
				this.$broadcast("notifyShowNewProjectWindow");
			}

		}
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Store, global) {
	module.exports = {
		methods: {
			handleResize: function() {
				// console.log('resize');
				if(Store.ctrls.tcResize !== '') {
					// in pending
					clearTimeout(Store.ctrls.tcResize);
					Store.ctrls.tcResize = '';
				}
				else {
					// already loose
				};

				Store.ctrls.tcResize = setTimeout(function() {
					Store.watches.flagRepaint = true;
					clearTimeout(Store.ctrls.tcResize);
					Store.ctrls.tcResize = "";
				}, 500);
			},
		},
		events: {
			// notify resize
			resize: function() {
				this.handleResize();
			}
		},
		created: function() {
			var _this = this;
	    // fix v-on:resize
	    global.window.addEventListener('resize', function() {
	      _this.$emit('resize');
	    });


	    _this.$watch('sharedStore.watches.flagRepaint', function() {
	    	if(_this.sharedStore.watches.flagRepaint) {
					_this.sharedStore.watches.flagRepaint = false;

					if(Store.isImageCropShow){
						Store.vm.$broadcast("notifyImageCrop");
					}
					// console.log('should repaint');
					if(Store.watches.isSpecLoaded && Store.watches.isProjectLoaded) {
						_this.$broadcast('notifyRefreshCanvas', Store.currentSelectProjectIndex);
					};
				};
			});

	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }())))

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, Store) {var productType={book:1,frame:2,poster:9,cards:5,phonecase:10};
	module.exports = {

	    loadSpec: function(obj) {
	        //this.loadLocalSpec();
	        var _this = this;
	        $.ajax({
	            url: Store.domains.productBaseUrl + '/product/spec/product-spec?productType=7',
	            type: 'get',
	            dataType: 'text'
	        }).done(function(specInfoResult) {
	            specInfoResult = $.parseXML(specInfoResult);
	            if (specInfoResult && $(specInfoResult).find('resultData').attr('state') === 'success') {
	                var specUrl = $(specInfoResult).find('availableVersionPath').text();
	                //specUrl=specUrl.replace("artisanstate","zno");
	                $.ajax({
	                    url: specUrl,
	                    type: 'get',
	                    dataType: 'text'
	                }).done(function(specResult) {
	                    specResult = $.parseXML(specResult);
	                    _this.parseSpecXml(specResult);
	                });
	            } else {
	                //been.showMsg('Request api service failed', 'default', 'Message',null,null,'ok');
	                obj.$dispatch("dispatchShowPopup", { type : 'spec', status : 0})
	            }
	        });

	    },
	    loadLocalSpec: function() {
	        var _this = this;
	        $.ajax({
	            url: './assets/data/spec.xml?requestKey='+__webpack_require__(10).getRequestKey(),
	            type: 'get',
	            dataType: 'text'
	        }).done(function(specResult) {
	            specResult = $.parseXML(specResult);
	            Store.spec.specXml = specResult;
	            Store.watches.isSpecLoaded = true;
	        });
	    },
	    parseSpecXml: function(specXml) {
	        Store.spec.specXml = specXml;
	        //console.log(Store.spec.specXml);
	        //console.log('***************************************');
	        var products = $(specXml).find('optionGroup[id="product"]').find('option');
	        for (var i = 0; i < products.length; i++) {
	            //console.log(products.eq(i).attr('id'));
	            //console.log(products.eq(i).find("title").text());
	            Store.spec.products.push({ id: products.eq(i).attr('id'), title: products.eq(i).find("title").text() });
	        };
	        var sizes = $(specXml).find('optionGroup[id="size"]').find('option');
	        for (var i = 0; i < sizes.length; i++) {
	            Store.spec.sizes.push({ id: sizes.eq(i).attr('id'), name: sizes.eq(i).attr('name'), default: sizes.eq(i).attr('default') });
	        };
	        var colors = $(specXml).find('optionGroup[id="color"]').find('option');
	        for (var i = 0; i < colors.length; i++) {
	            Store.spec.colors.push({ id: colors.eq(i).attr('id'), name: colors.eq(i).attr('name') });
	        };
	        var measures = $(specXml).find('optionGroup[id="measure"]').find('option');
	        for (var i = 0; i < measures.length; i++) {
	            Store.spec.measures.push({ id: measures.eq(i).attr('id'), name: measures.eq(i).attr('name') });
	        };
	        //require('SpecController').analyseSpec({size:'14X16',product:'TS'});
	        Store.watches.isSpecLoaded = true;

	    },
	    loadProductSpec:function(type,callFunction){
	        var _this = this;
	        $.ajax({
	            url: Store.domains.productBaseUrl + '/product/spec/product-spec?productType='+productType[type],
	            type: 'get',
	            dataType: 'text'
	        }).done(function(specInfoResult) {

	             specInfoResult = $.parseXML(specInfoResult);
	             console.log(specInfoResult);

	            if (specInfoResult && $(specInfoResult).find('resultData').attr('state') === 'success') {
	                var specUrl = $(specInfoResult).find('availableVersionPath').text();
	                $.ajax({
	                    url: specUrl,
	                    type: 'get',
	                    dataType: 'text'
	                }).done(function(specResult) {
	                    specResult = $.parseXML(specResult);
	                    Store.spec.specXml = specResult;
	                    callFunction();
	                    Store.watches.isSpecLoaded = true;
	                });
	            } else {
	               console.log("load spec failed");
	            }
	        });
	    }


	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ })
]);