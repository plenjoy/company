var UtilMath = require('UtilMath');
var ImageListManage = require('ImageListManage');
var DecorationListManage = require('DecorationListManage');
var ParamsManage = require('ParamsManage');
var ProjectManage = require('ProjectManage');
var SpecController = require('SpecController');
var WarnController = require("WarnController");
var ImageService = require("ImageService");

var Vue = require('vuejs');
var CompPhotoElement = Vue.component('photo-element');
var CopmDecorationElement = Vue.component('decoration-element');
var CompTextElement = Vue.component('text-element');
var CompStyleElement = Vue.component('style-element');
var strings = require('../contants/strings');

var INSIDE_PAGE = strings.pageTypes.INSIDE_PAGE;
var FRONT_PAGE = strings.pageTypes.FRONT_PAGE;
var FLAT = strings.cardTypes.FLAT;
var FOLDER = strings.cardTypes.FOLDER;
var TOP = strings.formatTypes.TOP;
var SIDE = strings.formatTypes.SIDE;

module.exports = {
    createElement: function(idx, obj) {
        // this.initElement(idx, obj);
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        if (currentCanvas.params[idx].elType === 'text') {
            var el = new CompTextElement();
        } else if (currentCanvas.params[idx].elType === 'image') {
            var el = new CompPhotoElement();
        } else if (currentCanvas.params[idx].elType === 'decoration') {
            var el = new CopmDecorationElement();
        } else if (currentCanvas.params[idx].elType === 'style') {
            var el = new CompStyleElement();
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

        if (currentCanvas.params[idx].elType === 'text') {
            var el = new CompTextElement();
        } else if (currentCanvas.params[idx].elType === 'decoration') {
            var el = new CopmDecorationElement();
        } else {
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

        if(currentCanvas.elements[idx]) {
            currentCanvas.elements[idx].$destroy(true);
            currentCanvas.elements.splice(idx, 1);
        }
    },

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
        // console.log('index is ' + idx + ' in initElementData');
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        if (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
            // add image element
            var loadImageUrl = '../../static/img/blank.png';
            // var loadImageUrl = '';
            if (currentCanvas.params[idx].imageId !== '') {
                // already initialized, read old cropped image
                var px = currentCanvas.params[idx].cropPX,
                    py = currentCanvas.params[idx].cropPY,
                    pw = currentCanvas.params[idx].cropPW,
                    ph = currentCanvas.params[idx].cropPH,
                    width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
                    height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;

                var UtilProject = require('UtilProject');
                var encImgId = UtilProject.getEncImgId(currentCanvas.params[idx].imageId);
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

                loadImageUrl = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
            };

            currentCanvas.elements.$set(idx, currentCanvas.paper.image(loadImageUrl, currentCanvas.params[idx].x * currentCanvas.ratio, currentCanvas.params[idx].y * currentCanvas.ratio, currentCanvas.params[idx].width * currentCanvas.ratio, currentCanvas.params[idx].height * currentCanvas.ratio));
        } else if (currentCanvas.params[idx].elType === 'text') {
            var fontViewSize = Math.round(UtilMath.getTextViewFontSize(currentCanvas.params[idx].fontSize));
            var fontUrl = '../../static/img/blank.png';

            if (fontViewSize > 0) {
                if (currentCanvas.params[idx].text === '') {
                    if (Store.isPreview) {
                        fontUrl = '../../static/img/blank.png';
                    } else {
                        fontUrl = Store.domains.proxyFontBaseUrl + "/product/text/textImage?text=" + encodeURIComponent('Enter text here') + "&font=" + encodeURIComponent(currentCanvas.params[idx].fontFamily) + "&fontSize=" + fontViewSize + "&color=" + currentCanvas.params[idx].fontColor + "&align=left";
                    };
                } else {
                    fontUrl = Store.domains.proxyFontBaseUrl + "/product/text/textImage?text=" + encodeURIComponent(currentCanvas.params[idx].text) + "&font=" + encodeURIComponent(currentCanvas.params[idx].fontFamily) + "&fontSize=" + fontViewSize + "&color=" + currentCanvas.params[idx].fontColor + "&align=left";
                };
            } else {
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
        // console.log('set element ' + idx + ' dep into ' + currentCanvas.params[idx].dep + ' now');
        currentCanvas.elements[idx].vWidth = currentCanvas.params[idx].width * currentCanvas.ratio;
        currentCanvas.elements[idx].vHeight = currentCanvas.params[idx].height * currentCanvas.ratio;
        currentCanvas.elements[idx].sourceImageUrl = currentCanvas.params[idx].url || '';
        currentCanvas.elements[idx].imageId = currentCanvas.params[idx].imageId || '';
        currentCanvas.elements[idx].imageRotate = currentCanvas.params[idx].imageRotate || 0;;

        // get image detail
        var imageDetail = ImageListManage.getImageDetail(currentCanvas.elements[idx].imageId);

        if (imageDetail) {
            currentCanvas.elements[idx].imageGuid = imageDetail.guid;
            currentCanvas.elements[idx].imageWidth = imageDetail.width;
            currentCanvas.elements[idx].imageHeight = imageDetail.height;

            if (Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
                // rotated specially
                var cWidth = currentCanvas.elements[idx].imageHeight,
                    cHeight = currentCanvas.elements[idx].imageWidth;
            } else {
                var cWidth = currentCanvas.elements[idx].imageWidth,
                    cHeight = currentCanvas.elements[idx].imageHeight;
            };
            // adding the crop settings to element
            currentCanvas.elements[idx].cropX = cWidth * currentCanvas.params[idx].cropPX;
            currentCanvas.elements[idx].cropY = cHeight * currentCanvas.params[idx].cropPY;
            currentCanvas.elements[idx].cropW = cWidth * currentCanvas.params[idx].cropPW;
            currentCanvas.elements[idx].cropH = cHeight * currentCanvas.params[idx].cropPH;
        } else {
            currentCanvas.elements[idx].imageGuid = '';
            currentCanvas.elements[idx].imageWidth = '';
            currentCanvas.elements[idx].imageHeight = '';

            currentCanvas.elements[idx].cropX = 0;
            currentCanvas.elements[idx].cropY = 0;
            currentCanvas.elements[idx].cropW = 1;
            currentCanvas.elements[idx].cropH = 1;
        };

        //   // paint warn tip
        //   currentCanvas.warns[idx] = {
        //   	isActive: false,
        //   	el: ''
        //   };
        //   if((currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') && imageDetail) {
        //    var cropWidth = imageDetail.width * pw,
        //    	cropHeight = imageDetail.height * ph;
        //    console.log(imageDetail.width)
        //    var params = require("ParamsManage").getParamsValueByElement(idx);
        //    var scaleW = params.width / cropWidth,
        //    	scaleH = params.height / cropHeight,
        //    	scale = Math.max(scaleW, scaleH);
        //    console.log(scale)

        //    if(scale>Store.warnSettings.resizeLimit){
        //    	WarnController.createElement(idx);
        //    }else{
        //    	WarnController.deleteElement(idx);
        //    	currentCanvas.warns[idx].isActive = false;
        //    }
        //    WarnController.showBeforeElements();
        // }

    },



    // init element handles
    initElementHandles: function(idx) {
        var _this = this;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        // if(idx > 0) {

        // set double click handle
        if (currentCanvas.elements[idx].elType === 'text') {
            currentCanvas.elements[idx]
                .dblclick(function() {
                    // var that = this;
                    // _this.$dispatch('dispatchModifyText', that.idx);
                    Store.watches.isChangeThisText = true;
                });
        } else {
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
        if (currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
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
        } else if (currentCanvas.params[idx].elType === 'text') {
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
            //console.log(events);
            if (events[0] === 'scale start' || events[0] === 'rotate start') {

                // _this.changeClickDepth({ idx: img.opts.idx });
                _this.showSpineLines();

                WarnController.deleteElement(idx);

            } else if (events[0] === 'drag start') {
                Store.ctrls.isDragStarted = true;
                // Store.ctrls.lastTranEvent = '';

                _this.showSpineLines();
                // console.log(currentCanvas.elements, currentCanvas.warns)
                // console.log(currentCanvas, currentCanvas.warns[idx]);
                WarnController.deleteElement(idx);

            } else if (events[0] === 'drag end' || (Store.ctrls.isDragStarted && events[0] === 'apply' && Store.ctrls.lastTranEvent === 'init')) {
                // console.log('drag end');
                console.info('index' + idx);
                Store.ctrls.isDragStarted = false;
                Store.ctrls.lastTranEvent = '';
                _this.changeClickDepth({ idx: img.opts.idx });
                _this.hideSpineLines();
                if (currentCanvas.warns[idx] && currentCanvas.warns[idx].isActive) {
                    WarnController.createElement(idx);
                }
                WarnController.showBeforeElements();
                console.info('index' + idx)
            } else if (events[0] === 'scale end' || events[0] === 'rotate end') {
                // console.log('should sync params now');
                var newParams = ParamsManage.getParamsValueByElement(img.opts.idx);

                if (currentCanvas.params[img.opts.idx].elType === 'text') {
                    // console.log('resize text');
                    if (newParams.fontSize < UtilMath.getPxByInch(0.3)) {
                        newParams.fontSize = UtilMath.getPxByInch(0.3);
                    } else if (newParams.fontSize > UtilMath.getPxByInch(16)) {
                        newParams.fontSize = UtilMath.getPxByInch(16);
                    };
                    obj.editText(newParams, img.opts.idx);
                } else {
                    currentCanvas.params.splice(img.opts.idx, 1, newParams);
                    _this.editElement(img.opts.idx);
                    _this.highlightSelection(img.opts.idx);
                    _this.spineLinesToTop();
                    _this.hideSpineLines();
                };

            } else if (events[0] === 'apply') {
                var params = require("ParamsManage").getParamsValueByElement(idx);

                if (params.x < -params.width || params.y < -params.height || params.x > currentCanvas.oriWidth || params.y > currentCanvas.oriHeight) {
                    console.info(params);
                    params.x = 0;
                    params.y = 0;
                    if (params.elType === "text") {
                        var TextController = require('TextController');
                        TextController.editText(params, idx);
                    } else if (params.elType === "image" || params.elType === "logo") {
                        var ImageController = require('ImageController');
                        ImageController.editImage(params, idx);
                    }

                }
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
        if (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') {
            // ## in fact, this code only valid for added images because background was covered by bleeding layer, the real event for background is binded on bleeding layer

            if (navigator.userAgent.indexOf('Trident') !== -1) {
                // fit for IE
                // on dragging over
                $('#element-' + idx).attr('ondragover', 'event.preventDefault();');

                // on dropping
                $('#element-' + idx).attr('ondrop', 'asFn.fnOndrop(event);');
            } else {
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
                    // console.log("frop")
                    Store.watches.isOnDrop = true;
                    Store.watches.isDecorationOnDrop = true;
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
        if ((currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo') && imageDetail) {
            var cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
                cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH;
            // console.log(imageDetail.width)
            var params = require("ParamsManage").getParamsValueByElement(idx);
            var scaleW = params.width / cropWidth,
                scaleH = params.height / cropHeight,
                scale = Math.max(scaleW, scaleH);
            // console.log(scale)

            if (scale > Store.warnSettings.resizeLimit) {
                WarnController.createElement(idx);
            } else {
                WarnController.deleteElement(idx);
                currentCanvas.warns[idx].isActive = false;
            }
            WarnController.showBeforeElements();
        }
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

        var specData = SpecController.analyseSpec({ size: prj.size, product: prj.product });
        var logoX = specData.logo.x * currentCanvas.ratio,
            logoY = specData.logo.y * currentCanvas.ratio,
            logoWidth = specData.logo.width * currentCanvas.ratio,
            logoHeight = specData.logo.height * currentCanvas.ratio;

        currentCanvas.innerLine = currentCanvas.paper.path('M' + logoX + ' ' + logoY + 'L' + (logoX + logoWidth) + ' ' + logoY + 'L' + (logoX + logoWidth) + ' ' + (logoY + logoHeight) + 'L' + logoX + ' ' + (logoY + logoHeight) + 'L' + logoX + ' ' + logoY);
        currentCanvas.innerLine.attr({ stroke: '#7b7b7b', 'stroke-dasharray': '-' });
    },

    // create inner line
    createCenterLine: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            centerX = currentCanvas.width / 2;

        // NOTE: we think when center line exists, spine lines do not, thus we use spineLeft element instead
        currentCanvas.spineLeft = currentCanvas.paper.path('M' + centerX + ' 0L' + centerX + ' ' + currentCanvas.height);
        currentCanvas.spineLeft.attr({ stroke: '#7b7b7b', 'stroke-dasharray': '-' });
    },

    // create spine lines
    createSpineLine: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        // NOTE: for now, we think spine cannot be 0 width and must be in cover page
        if (currentCanvas.oriSpineWidth !== 0) {
            var spineWidth = currentCanvas.oriSpineWidth * currentCanvas.ratio,
                spineLeftX = (currentCanvas.width - spineWidth) / 2,
                spineRightX = spineLeftX + spineWidth;

            currentCanvas.spineLeft = currentCanvas.paper.path('M' + spineLeftX + ' 0L' + spineLeftX + ' ' + currentCanvas.height);
            currentCanvas.spineLeft.attr({ stroke: '#646464', 'stroke-dasharray': '-' });
            currentCanvas.spineRight = currentCanvas.paper.path('M' + spineRightX + ' 0L' + spineRightX + ' ' + currentCanvas.height);
            currentCanvas.spineRight.attr({ stroke: '#646464', 'stroke-dasharray': '-' });
        };
    },

    changeClickDepth: function(oParams) {
        if (oParams && oParams.idx != undefined) {
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
        if (oParams && oParams.idx != undefined) {
            // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

            // currentCanvas.selectedIdx = currentCanvas.elements.length - 1;
            // currentCanvas.elements[oParams.idx].toBack();

            this.changeDepthValue({ idx: oParams.idx, targetDepth: 0 });
            // this.freshElementDepth();
            //
            // if(currentCanvas.elementBg) {
            // 	currentCanvas.elementBg.toBack();
            // };

            // this.spineLinesToTop();

            // currentCanvas.trans[oParams.idx].apply();

            // this.blurSelection(oParams.idx);
            // console.log('after apply', currentCanvas.elements[oParams.idx], currentCanvas.trans[oParams.idx]);
        };
    },

    sendToFront: function(oParams) {
        if (oParams && oParams.idx != undefined) {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

            this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params.length - 1 });
        };
    },

    bringBackward: function(oParams) {
        if (oParams && oParams.idx != undefined) {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

            if (currentCanvas.params[oParams.idx].dep > 0) {
                this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params[oParams.idx].dep - 1 });
            };

        };
    },

    bringForward: function(oParams) {
        if (oParams && oParams.idx != undefined) {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

            if (currentCanvas.params[oParams.idx].dep < currentCanvas.params.length - 1) {
                this.changeDepthValue({ idx: oParams.idx, targetDepth: currentCanvas.params[oParams.idx].dep + 1 });
            };

        };
    },

    // change the dep value we hold for further depth controlling
    changeDepthValue: function(oParams) {
        if (oParams && oParams.idx != undefined && oParams.targetDepth != undefined) {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                currentDepth = currentCanvas.params[oParams.idx].dep,
                targetDepth = oParams.targetDepth;

            if (targetDepth === currentDepth) {
                return;
            } else if (targetDepth > currentDepth) {
                // pop up
                for (var i = 0; i < currentCanvas.params.length; i++) {
                    if (currentCanvas.params[i].dep > currentDepth && currentCanvas.params[i].dep <= targetDepth) {
                        currentCanvas.params[i].dep--;
                    };
                };
                currentCanvas.params[oParams.idx].dep = targetDepth;
            } else {
                // sink down
                for (var i = 0; i < currentCanvas.params.length; i++) {
                    if (currentCanvas.params[i].dep < currentDepth && currentCanvas.params[i].dep >= targetDepth) {
                        currentCanvas.params[i].dep++;
                    };
                };
                currentCanvas.params[oParams.idx].dep = targetDepth;
            };
        };
        Store.vm.$broadcast("notifyRefreshScreenshot");
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
        for (var i = 0; i < currentCanvas.elements.length; i++) {
            depthAry.push({
                idx: i,
                dep: currentCanvas.elements[i].dep
            });
        };
        // sort array by depth value ASC
        depthAry.sort(function(a, b) {
            return a.dep - b.dep });
        // now change the depth(we only need to change depth from second one, leave the first on bottom...)
        for (i = 1; i < depthAry.length; i++) {
            currentCanvas.elements[depthAry[i].idx].toFront();

            // warn tip toFront
            if (currentCanvas.warns[depthAry[i].idx] && currentCanvas.warns[depthAry[i].idx].el) {
                currentCanvas.warns[depthAry[i].idx].el.toFront();
            };
        };

        this.spineLinesToTop();
    },

    // fresh depth
    freshDepth: function(removedIdx) {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            fromDepth = currentCanvas.params[removedIdx].dep;

        for (var i = 0; i < currentCanvas.params.length; i++) {
            if (currentCanvas.params[i].dep > fromDepth) {
                currentCanvas.params[i].dep--;
            };
        };
    },

    // fresh index
    freshIdx: function(fromIdx) {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        for (var i = 0; i < currentCanvas.elements.length; i++) {
            if (currentCanvas.elements[i].idx > fromIdx) {
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

        if (currentCanvas.innerLine !== '') {
            currentCanvas.innerLine.toFront();
        };
        if (currentCanvas.spineLeft !== '') {
            currentCanvas.spineLeft.toFront();
        };
        if (currentCanvas.spineRight !== '') {
            currentCanvas.spineRight.toFront();
        };
    },

    showSpineLines: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        if (currentCanvas.outerLine !== '') {
            currentCanvas.outerLine.show();
        };
        if (currentCanvas.innerLine !== '') {
            currentCanvas.innerLine.show();
        };
        if (currentCanvas.spineLeft !== '') {
            currentCanvas.spineLeft.show();
        };
        if (currentCanvas.spineRight !== '') {
            currentCanvas.spineRight.show();
        };
    },

    hideSpineLines: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        if (currentCanvas.outerLine !== '') {
            currentCanvas.outerLine.hide();
        };
        if (currentCanvas.innerLine !== '') {
            currentCanvas.innerLine.hide();
        };
        if (currentCanvas.spineLeft !== '') {
            currentCanvas.spineLeft.hide();
        };
        if (currentCanvas.spineRight !== '') {
            currentCanvas.spineRight.hide();
        };
    },

    // highlight selection
    highlightSelection: function(idx) {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        idx ? idx : idx = currentCanvas.selectedIdx;

        for (var i = 0; i < currentCanvas.trans.length; i++) {
            currentCanvas.trans[i].setOpts({ draw: false });
        };

        if (currentCanvas.elements[idx].elType === 'image' || currentCanvas.elements[idx].elType === 'logo') {
            var options = {
                drag: ['self'],
                rotate: false,
                scale: ['bboxCorners'],
                keepRatio: true,
                snap: { rotate: 1, scale: 1, drag: 1 },
                draw: ['bbox'],
                // draw: false,
                range: { scale: [0, 99999] },
                idx: idx
            };
        } else {
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
        if (true) {
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
        if (oData) {
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

            // // check if user drop image into logo area(in cover page, page index 0)
            // if(Store.selectedPageIdx === 0 && this.isInLogoArea(targetX, targetY)) {
            // 	// fit image into logo area(meet type)
            // 	var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
            // 	var logoData = specData.logo;
            //
            // 	if(imageDetail) {
            // 		elWidth = imageDetail.width;
            // 		elHeight = imageDetail.height;
            // 	}
            // 	else {
            // 		// some errors occured... but to be robust, we consider it and set the new element width, height based on logo width, logo height
            // 		elWidth = logoData.width;
            // 		elHeight = logoData.height;
            // 	};
            //
            // 	// fix element width, height value
            // 	var divElement = elWidth / elHeight,
            // 			divLogo = logoData.width / logoData.height;
            // 	if(divElement >= divLogo) {
            // 		// width will meet the limit at first
            // 		var resizeRatio = logoData.width / elWidth;
            //
            // 		elWidth = elWidth * resizeRatio;
            // 		elHeight = elHeight * resizeRatio;
            // 	}
            // 	else {
            // 		// height will meet the limit at first
            // 		var resizeRatio = logoData.height / elHeight;
            //
            // 		elWidth = elWidth * resizeRatio;
            // 		elHeight = elHeight * resizeRatio;
            // 	};
            //
            // 	// get element x, y positions by resized elWidth, elHeight
            // 	var elX = logoData.x + (logoData.width - elWidth) / 2,
            // 			elY = logoData.y + (logoData.height - elHeight) / 2;
            //
            // 	return {
            // 		x: elX,
            // 		y: elY,
            // 		width: elWidth,
            // 		height: elHeight
            // 	};
            // }
            // else {
            // normal case
            if (imageDetail) {
                elWidth = imageDetail.width;
                elHeight = imageDetail.height;
            } else {
                // some errors occured... but to be robust, we consider it and set the new element width, height based on fullWidth, fullHeight
                elWidth = fullWidth / 3;
                elHeight = fullHeight / 3;
            };

            // fix element width, height value
            var divElement = elWidth / elHeight,
                // divCanvas = fullWidth / fullHeight;
                divCanvas = limitedWidth / limitedHeight;
            if (divElement >= divCanvas) {
                // width will meet the limit at first
                var resizeRatio = limitedWidth / elWidth;
            } else {
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
            // console.log(fixedX, fixedY);
            targetX -= fixedX;
            targetY -= fixedY;

            return {
                x: targetX,
                y: targetY,
                width: elWidth,
                height: elHeight
            };
            // };
        } else {
            return {
                x: 0,
                y: 0,
                width: 300,
                height: 300
            };
        };
    },
    getDefaultNewDecElementPosition: function(oData) {
        if (oData) {
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
                decorationDetail = DecorationListManage.getDecorationDetail(imageId),
                elWidth, elHeight;

            if (decorationDetail) {
                elWidth = decorationDetail.width;
                elHeight = decorationDetail.height;
            } else {
                // some errors occured... but to be robust, we consider it and set the new element width, height based on fullWidth, fullHeight
                elWidth = fullWidth / 3;
                elHeight = fullHeight / 3;
            };

            // fix element width, height value
            var divElement = elWidth / elHeight,
                // divCanvas = fullWidth / fullHeight;
                divCanvas = limitedWidth / limitedHeight;
            if (divElement >= divCanvas) {
                // width will meet the limit at first
                var resizeRatio = limitedWidth / elWidth;
            } else {
                // height will meet the limit at first
                var resizeRatio = limitedHeight / elHeight;
            };
            elWidth *= resizeRatio;
            elHeight *= resizeRatio;

            var fixedX = Store.dragData.cursorX / currentCanvas.ratio,
                fixedY = Store.dragData.cursorY / currentCanvas.ratio;
            // console.log(fixedX, fixedY);
            targetX -= fixedX;
            targetY -= fixedY;

            return {
                x: targetX,
                y: targetY,
                width: elWidth,
                height: elHeight
            };
            // };
        } else {
            return {
                x: 0,
                y: 0,
                width: 300,
                height: 300
            };
        };
    },
    // // check if position is in logo area(in real size)
    // isInLogoArea: function(targetX, targetY) {
    // 	if(targetX != null && targetY != null) {
    // 		var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
    // 		var logoData = specData.logo;
    //
    // 		if(targetX >= logoData.x && targetX <= (logoData.x + logoData.width) && targetY >= logoData.y && targetY <= (logoData.y + logoData.height)) {
    // 			// in logo area
    // 			return true;
    // 		}
    // 		else {
    // 			return false;
    // 		};
    // 	}
    // 	else {
    // 		return false;
    // 	};
    // },

    // init canvas data -- main
    initCanvasData: function() {
        if (Store.projectSettings && Store.projectXml) {
            var sXml = Store.projectXml;
            this.initCardSetting(sXml);
            this.initImageList(sXml);
            this.initDecorationList(sXml);
            this.initProject(sXml);

            // 如果是blank card，初始化blank card element
            if(Store.isBlankCard) {
                this.initBlankCardElement();
            }

            // set page as cover page defaultly
            Store.selectedPageIdx = 0;
            Store.deletedPhoto = 'true';
        };
    },

    // initCardSetting
    initCardSetting: function(sXml) {
        if (sXml) {
            Store.cardSetting = {};
            Store.cardSetting.styleId = $(sXml).find('card').eq(0).find('styleId').eq(0).attr('value') || "";
            Store.cardSetting.festival = $(sXml).find('card').eq(0).find('festival').eq(0).attr('value') || "";
            Store.cardSetting.trim = $(sXml).find('card').eq(0).find('trim').eq(0).attr('value') || "";
            Store.templateGuid = $(sXml).find('card').eq(0).find('templateGuid').eq(0).attr('value') || Store.templateGuid;

            // 如果styleId是blank，则为空白card
            if(Store.cardSetting.styleId === 'blank' && !Store.cardSetting.festival) {
                Store.isBlankCard = true;
            }
        }
    },

    // init image list
    initImageList: function(sXml) {
        if (!Store.isPortal && Store.deletedPhoto === 'false') return;
        if (sXml) {
            var imgCount = $(sXml).find('images').find('image').length;

            Store.imageList = [];
            if (imgCount > 0) {
                for (var i = 0; i < imgCount; i++) {
                    Store.imageList.push({
                        id: $(sXml).find('images').find('image').eq(i).attr('id'),
                        guid: $(sXml).find('images').find('image').eq(i).attr('guid') || '',
                        // url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
                        encImgId: $(sXml).find('images').find('image').eq(i).attr('encImgId') || '',
                        url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(sXml).find('images').find('image').eq(i).attr('guid') + require('UtilParam').getSecurityString() + '&rendersize=fit',
                        name: decodeURIComponent($(sXml).find('images').find('image').eq(i).attr('name')) || '',
                        width: parseFloat($(sXml).find('images').find('image').eq(i).attr('width')) || 0,
                        height: parseFloat($(sXml).find('images').find('image').eq(i).attr('height')) || 0,
                        shotTime: $(sXml).find('images').find('image').eq(i).attr('shotTime') || '',
                        orientation: $(sXml).find('images').find('image').eq(i).attr('orientation') || 0,
                        usedCount: 0,
                        previewUrl: ''
                    });
                };
                if (!$(sXml).find('images').find('image').eq(0).attr('encImgId')) {
                    ImageService.getEncImageIds();
                };

                // push in url now
                for (i = 0; i < imgCount; i++) {
                    Store.imageList[i].url = Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + Store.imageList[i].encImgId + require('UtilParam').getSecurityString() + '&rendersize=fit';
                    require('UtilImage').getBlobImagePreviewUrl(i);
                };
            };
        };
    },
    //  初始化项目中的饰品列表
    initDecorationList: function(sXml) {
        if (sXml) {
            var decorationCount = $(sXml).find('decorations').find('decoration').length;
            if (decorationCount > 0) {
                for (var i = 0; i < decorationCount; i++) {
                    Store.decorationList.push({
                        guid: $(sXml).find('decorations').find('decoration').eq(i).attr('guid') || '',
                        name: $(sXml).find('decorations').find('decoration').eq(i).attr('name') || '',
                        type: $(sXml).find('decorations').find('decoration').eq(i).attr('type') || '',
                        count: $(sXml).find('decorations').find('decoration').eq(i).attr('count') || '',
                        displayRatio: $(sXml).find('decorations').find('decoration').eq(i).attr('displayRatio') || '',
                        width: $(sXml).find('decorations').find('decoration').eq(i).attr('width') || '',
                        height: $(sXml).find('decorations').find('decoration').eq(i).attr('height') || ''
                    });
                };
            }
        }
    },

    // init project
    initProject: function(sXml) {
        if (sXml) {
            for (var k = 0; k < $(sXml).find('card').length; k++) {
                // var prj = Store.projectSettings[k];
                // var specData = SpecController.analyseSpec({ size: prj.size, product: prj.product});

                Store.projects[k] = {};
                Store.projects[k].pages = [];
                for (var i = 0; i < $(sXml).find('card').eq(k).find('spread').length; i++) {
                    var currentSpread = $(sXml).find('card').eq(k).find('spread').eq(i);
                    Store.projects[k].pages.push({
                        type: currentSpread.attr('type') || '',
                        id: currentSpread.attr('id') || '',
                        tplGuid: currentSpread.attr('tplGuid') || '',
                        pageNumber: currentSpread.attr('pageNumber') || '',
                        styleId: currentSpread.attr('styleId') || '',
                        styleItemId: currentSpread.attr('styleItemId') || '',
                        width: currentSpread.attr('width') || '',
                        height: currentSpread.attr('height') || '',
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
                            oriWidth: 0, // real size
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
                            params: []
                        }
                    });

                    var currentCanvas = Store.projects[k].pages[i].canvas;

                    var spread = require("ProjectManage").getCardSpread();
                    var orientation = Store.projectSettings[k].orientation;
                    var format = Store.projectSettings[k].format;
                    var currentPage = Store.projects[k].pages[i].type;
                    var product = Store.projectSettings[k].product;

                    currentCanvas.oriWidth = product === FOLDER && format === SIDE && currentPage !== INSIDE_PAGE ? spread.width / 2 : spread.width;
                    currentCanvas.oriHeight = product === FOLDER && format === TOP && currentPage !== INSIDE_PAGE ? spread.height / 2 : spread.height;
                    currentCanvas.oriX = 0;
                    currentCanvas.oriY = 0;
                    currentCanvas.photoLayer = { width: currentCanvas.oriWidth, height: currentCanvas.oriHeight };
                    currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
                    currentCanvas.foreground = this.getForeground(spread, currentCanvas, k, i, currentPage);
                    currentCanvas.formedSpread = this.getFormedSpread(spread, currentCanvas, product, format, currentPage);
                    currentCanvas.oriBgWidth = currentCanvas.foreground.width;
                    currentCanvas.oriBgHeight = currentCanvas.foreground.height;
                    currentCanvas.oriX = currentCanvas.foreground.x;
                    currentCanvas.oriY = currentCanvas.foreground.y;

                    // 重置 spread 的外形尺寸
                    Store.projects[k].pages[i].width = currentCanvas.oriWidth;
                    Store.projects[k].pages[i].height = currentCanvas.oriHeight;
                    // get elements' size params
                    var paramsCount = $(sXml).find('card').eq(k).find('spread').eq(i).find('element').length;
                    for (var j = 0; j < paramsCount; j++) {
                        var imgId = (!Store.isPortal && Store.deletedPhoto === 'false') ? '' : $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('imageid') || '',
                            imageDetail = ImageListManage.getImageDetail(imgId) || '',
                            sourceImageUrl = '';
                        
                        if(imgId === 'undefined') imgId = '';

                        imageDetail !== '' ? sourceImageUrl = Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + imageDetail.encImgId + require('UtilParam').getSecurityString() + '&rendersize=fit' : sourceImageUrl;
                        var ox = parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('x')) || 0,
                            oy = parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('y')) || 0,
                            ow = parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('width')) || 0,
                            oh = parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('height')) || 0;
                        // var shiftedValue = ParamsManage.getShiftValue(currentCanvas);
                        // var newPosition = ParamsManage.getShiftPosition(ox, oy, ow, oh, shiftedValue.x, shiftedValue.y);
                        var elType = '';
                        if ($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('type') === 'CalendarStyleElement') {
                            elType = 'style';
                            // 兼容 spec的 baseSize 更改后老项目的 style 撑满支持。
                            ox = 0, oy = 0, ow = currentCanvas.oriWidth, oh = currentCanvas.oriHeight;
                        } else if ($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('type') === 'PhotoElement') {
                            elType = 'image';
                        } else if ($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('type') === 'TextElement') {
                            elType = 'text';
                        } else if ($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('type') === 'DecorationElement') {
                            elType = 'decoration';
                        };

                        var baseParam = {
                            // 确定用户界面下params唯一标识符
                            index: Store.templateGuid ? Store.projects[k].pages[i].id + '-' + j : '',
                            id: j,
                            elType: elType,
                            styleGuid: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('styleGuid') || '',
                            styleItemId: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('styleItemId') || '',
                            styleId: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('styleId') || '',
                            styleImageId: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('imageId') || '',
                            // url: sourceImageUrl,
                            url: '',
                            isRefresh: false,
                            text: decodeURIComponent($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).text()) || '',
                            // x: currentCanvas.oriWidth * (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('px')) || 0),
                            x: ox,
                            // y: currentCanvas.oriHeight * (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('py')) || 0),
                            y: oy,
                            // width: currentCanvas.oriWidth * (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('pw')) || 0),
                            width: ow,
                            // height: currentCanvas.oriHeight * (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('ph')) || 0),
                            height: oh,
                            rotate: parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('rot')),
                            dep: parseInt($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('dep')) || 0,
                            imageId: imgId,
                            imageGuid: imageDetail.guid || '',
                            imageWidth: imageDetail.width || '',
                            imageHeight: imageDetail.height || '',
                            imageRotate: parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('imgRot')) || 0,
                            // imageFlip: ,
                            cropPX: parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropLUX')) || 0,
                            cropPY: parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropLUY')) || 0,
                            cropPW: (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropRLX')) - parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropLUX'))) || 1,
                            cropPH: (parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropRLY')) - parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('cropLUY'))) || 1,
                            isFamilyName: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('isFamilyName') || 'false',
                            fontFamily: decodeURIComponent($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('fontFamily')) || '',
                            fontSize: currentCanvas.oriHeight * parseFloat($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('fontSize') || 0),
                            fontWeight: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('fontWeight') || '',
                            textAlign: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('textAlign') || 'left',
                            textVAlign: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('textVAlign') || 'top',
                            lineSpacing: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('lineSpacing') || '1',
                            fontColor: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('color') || '0',
                            decorationid: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('decorationid') || '',
                            decorationtype: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('decorationtype') || '',
                            isDisableRemind: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('isDisableRemind') === 'true' ? true : false
                        }
                        if($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('tagType') &&
                            $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('tagType') !== 'Null' ) {
                            $.extend(baseParam, {
                                tagName: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('tagName') || '',
                                tagType: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('tagType') || '',
                                mandatory: parseInt($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('mandatory')) || 0,
                                constant: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('constant') === 'true',
                                textFormat: strings.tagFormats[$(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('tagType')],
                                // 如果constant是true，那么isEdit也是true，否则按照设定的数据中来
                                isEdit: $(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('constant') === 'true'
                                    ? true
                                    : ($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('isEdit') === 'true' ? true : false),
                                order: parseInt($(sXml).find('card').eq(k).find('spread').eq(i).find('element').eq(j).attr('order'))
                            });
                        }
                        currentCanvas.params.push(baseParam);
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

        for (var i = 0; i < pickedProject.pages.length; i++) {
            Store.pages.push({
                type: pickedProject.pages[i].type || '',
                id: pickedProject.pages[i].id || '',
                tplGuid: pickedProject.pages[i].tplGuid || '',
                pageNumber: pickedProject.pages[i].pageNumber || '',
                styleId: pickedProject.pages[i].styleId || '',
                styleItemId: pickedProject.pages[i].styleItemId || '',
                width: pickedProject.pages[i].width || '',
                height: pickedProject.pages[i].height || '',
                name: '',
                canvas: {
                    isInited: false,
                    width: 0, // canvas width
                    height: 0, // canvas height
                    x: 0,
                    y: 0,
                    bgWidth: 0,
                    bgHeight: 0,
                    ratio: 1, // view size / real size,  eg. ratio = width / oriWidth
                    oriWidth: pickedProject.pages[i].canvas.oriWidth, // real size
                    oriHeight: pickedProject.pages[i].canvas.oriHeight,
                    oriX: pickedProject.pages[i].canvas.oriX,
                    oriY: pickedProject.pages[i].canvas.oriY,
                    oriBgWidth: pickedProject.pages[i].canvas.oriBgWidth,
                    oriBgHeight: pickedProject.pages[i].canvas.oriBgHeight,
                    oriSpineWidth: pickedProject.pages[i].canvas.oriSpineWidth,
                    bleedings: {}, // bleeding sizes
                    realBleedings: pickedProject.pages[i].canvas.realBleedings,
                    frameBaseSize: pickedProject.pages[i].canvas.frameBaseSize,
                    frameBorderThickness: pickedProject.pages[i].canvas.frameBorderThickness,
                    canvasBordeThickness: pickedProject.pages[i].canvas.canvasBordeThickness,
                    boardInFrame: pickedProject.pages[i].canvas.boardInFrame,
                    boardInMatting: pickedProject.pages[i].canvas.boardInMatting,
                    mattingSize: pickedProject.pages[i].canvas.mattingSize,
                    expendSize: pickedProject.pages[i].canvas.expendSize,
                    photoLayer: pickedProject.pages[i].canvas.photoLayer,
                    formedSpread: pickedProject.pages[i].canvas.formedSpread,
                    selectedIdx: 0, // the image index in params which was selected
                    // paper: '',			// svg paper object
                    params: pickedProject.pages[i].canvas.params.slice(0), // all elements params/settings from backend
                    elements: [], // svg current saved elements params/settings, with extra data
                    // idx, dep, type('image'/'text'), imageUrl(current selected image path)/text, vWidth, vHeight (the view/handler size), cropX, cropY, cropW, cropH(the real crop positions done) ...
                    // fontFamily, fontWeight, fontSize, color(rgba -- >), opacity(0 - 1)
                    // trans: [],			// the objects those store transforming
                    // warns: [],			// the objects those store warn elements
                    outerLine: '', // to store the outer line element
                    innerLine: '', // to store the inner line element
                    bleedingRibbonLeft: '', // to store the left bleeding element
                    bleedingRibbonRight: '', // to store the right bleeding element
                    bleedingRibbonTop: '', // to store the top bleeding element
                    bleedingRibbonBottom: '', // to store the bottom bleeding element
                    spineLeft: '', // to store the left spine element
                    spineRight: '', // to store the right spine element
                    elementBg: '' // to store the bg element
                }
            });
        };
    },

    // sync project data
    syncProjectData: function(nProjectIdx) {
        // target is sync pages setting back into project params
        nProjectIdx != undefined && nProjectIdx != null ? nProjectIdx : nProjectIdx = Store.currentSelectProjectIndex;

        for (var j = 0; j < Store.pages.length; j++) {
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

            Store.projects[nProjectIdx].pages[Store.selectedPageIdx].canvas.params = [];
            Store.projects[nProjectIdx].pages[Store.selectedPageIdx].canvas.params = currentCanvas.params.slice(0);

            // // NOTE: for t-shirt, we need to sync data into ALL project params
            // for(i = 0; i < Store.projectSettings.length; i++) {
            // 	if(i > Store.projects.length - 1) {
            // 		// missing a new added project
            // 		this.createProjectData();
            // 	}
            // 	else {
            // 		Store.projects[i].pages[j].canvas.params = [];
            // 		Store.projects[i].pages[j].canvas.params = currentCanvas.params.slice(0);
            // 	};
            // };
        };

    },

    createProjectData: function() {
        Store.projects.push(Store.projects[0]);
    },

    freshPageData: function() {
        for(var pageIdx = 0; pageIdx < Store.pages.length; pageIdx++) {
            var product = Store.projectSettings[Store.selectedIdx].product;
            var orientation = Store.projectSettings[Store.selectedIdx].orientation;
            var format = Store.projectSettings[Store.selectedIdx].format;
            var spread = require("ProjectManage").getCardSpread();
            var currentPage = Store.pages[pageIdx];
            var currentCanvas = Store.pages[pageIdx].canvas;
            var currentPageType = Store.pages[pageIdx].type;
    
            currentPage.width = product === FOLDER && format === SIDE && currentPageType !== INSIDE_PAGE ? spread.width / 2 : spread.width;
            currentPage.height = product === FOLDER && format == TOP && currentPageType !== INSIDE_PAGE ? spread.height / 2 : spread.height;
            currentCanvas.oriBgWidth = spread.width;
            currentCanvas.oriBgHeight = spread.height;
            currentCanvas.oriWidth = spread.width;
            currentCanvas.oriHeight = spread.height;
            currentCanvas.oriX = 0;
            currentCanvas.oriY = 0;
            currentCanvas.photoLayer = { width: spread.width, height: spread.height };
            currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
            currentCanvas.oriWidth = product === FOLDER && format === SIDE && currentPageType !== INSIDE_PAGE ? spread.width / 2 : spread.width;
            currentCanvas.oriHeight = product === FOLDER && format == TOP && currentPageType !== INSIDE_PAGE ? spread.height / 2 : spread.height;
            currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
            currentCanvas.photoLayer = { width: currentCanvas.oriWidth, height: currentCanvas.oriHeight };
            currentCanvas.foreground = this.getForeground(spread, currentCanvas, Store.selectedIdx, pageIdx, currentPageType);
            currentCanvas.formedSpread = this.getFormedSpread(spread, currentCanvas, product, format, currentPageType);
            currentCanvas.oriBgWidth = currentCanvas.foreground.width;
            currentCanvas.oriBgHeight = currentCanvas.foreground.height;
            currentCanvas.oriX = currentCanvas.foreground.x;
            currentCanvas.oriY = currentCanvas.foreground.y;
        }
    },
    fixRotatePhotoElement: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        for (var i = 0; i < currentCanvas.params.length; i++) {
            // console.log(currentCanvas.params[i].width / currentCanvas.oriWidth, currentCanvas.params[i].height / currentCanvas.oriHeight);
            if (currentCanvas.params[i].width / currentCanvas.oriWidth > 0.95 && currentCanvas.params[i].height / currentCanvas.oriHeight > 0.95) {
                // console.log("in fix");
                var temp = currentCanvas.params[i].width;
                currentCanvas.params[i].width = currentCanvas.params[i].height;
                currentCanvas.params[i].height = temp;
                if (currentCanvas.params[i].imageId) {
                    var imageId = currentCanvas.params[i].imageId;

                    var imageDetail = require("ImageListManage").getImageDetail(imageId);

                    var defaultCrops = require("UtilCrop").getDefaultCrop(currentCanvas.params[i].imageWidth, currentCanvas.params[i].imageHeight, currentCanvas.params[i].width, currentCanvas.params[i].height);

                    var px = defaultCrops.px,
                        py = defaultCrops.py,
                        pw = defaultCrops.pw,
                        ph = defaultCrops.ph;

                    currentCanvas.params[i].cropX = imageDetail.width * px;
                    currentCanvas.params[i].cropY = imageDetail.height * py;
                    currentCanvas.params[i].cropW = imageDetail.width * pw;
                    currentCanvas.params[i].cropH = imageDetail.height * ph;

                    currentCanvas.params[i].cropPX = px;
                    currentCanvas.params[i].cropPY = py;
                    currentCanvas.params[i].cropPW = pw;
                    currentCanvas.params[i].cropPH = ph;
                }
            };
        };
    },
    getTemplateParams: function(xml) {
        var params = [];
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var himage = [];
        var vimage = [];
        var styleElements = [];
        var tagListObj={};
        var others = [];
        // console.log('0', currentCanvas.params);
        for (var i = 0; i < currentCanvas.params.length; i++) {
            // console.log(currentCanvas.params[i]);
            if (currentCanvas.params[i].elType === "image" && currentCanvas.params[i].imageId) {
                if (currentCanvas.params[i].width > currentCanvas.params[i].height) {
                    vimage.push({ id: currentCanvas.params[i].imageId, guid: currentCanvas.params[i].imageGuid, width: currentCanvas.params[i].imageWidth, height: currentCanvas.params[i].imageHeight, rotate: currentCanvas.params[i].imageRotate });
                } else {
                    himage.push({ id: currentCanvas.params[i].imageId, guid: currentCanvas.params[i].imageGuid, width: currentCanvas.params[i].imageWidth, height: currentCanvas.params[i].imageHeight, rotate: currentCanvas.params[i].imageRotate });
                }
            } else if (currentCanvas.params[i].elType === "style") {
                styleElements.push(currentCanvas.params[i]);
            } else if (/*currentCanvas.params[i].elType == "text" ||*/ currentCanvas.params[i].elType == "decoration") {
                others.push(currentCanvas.params[i]);
            }


        };
        // 获取并保存 tagList 列表。
        for (var i = 0; i < $(xml).find('tag').length; i++) {
            var tagElement = $(xml).find('tag').eq(i);
            tagListObj[tagElement.attr('id')] = {
                constant: Boolean(parseInt(tagElement.attr('constant'))),
                mandatory: Boolean(parseInt(tagElement.attr('mandatory'))),
                tagType: tagElement.attr('tagType'),
                tagName: tagElement.attr('tagName')
            }
        }

        // console.log('1', vimage);
        // console.log('2', himage);
        // console.log('3', others);
        var elementArr = [];
        for (var i = 0; i < $(xml).find('element').length; i++) {
            var element = $(xml).find('element').eq(i);
            var object = {};
            object.px = parseFloat(element.attr('px'));
            object.py = parseFloat(element.attr('py'));
            object.pw = parseFloat(element.attr('pw'));
            object.ph = parseFloat(element.attr('ph'));
            object.dep = parseFloat(element.attr('dep'));
            object.type= element.attr('type');
            object.text= decodeURIComponent(element.text());
            object.color=element.attr('color');
            object.fontSize=parseFloat(element.attr('fontSize'));
            object.textAlign=element.attr('textAlign');
            object.textVAlign=element.attr('textVAlign');
            object.lineSpacing=element.attr('lineSpacing');
            object.fontWeight=element.attr('fontWeight');
            object.fontFamily=decodeURIComponent(element.attr('fontFamily'));
            object.rotate=element.attr('rot');
            object.tagId=element.attr('tagId');

            elementArr.push(object);
        }
        elementArr.sort(function(a, b) {
            return a.dep - b.dep
        });
        if (styleElements.length > 0) {
            for (var m = 0; m < styleElements.length; m++) {
                params.push(styleElements[m]);
            }
        };

        for (var i = 0; i < elementArr.length; i++) {

            var element = elementArr[i];
            var elementX = element.px * currentCanvas.oriWidth;
            var elementY = element.py * currentCanvas.oriHeight;
            var elementW = element.pw * currentCanvas.oriWidth;
            var elementH = element.ph * currentCanvas.oriHeight;
            var newParams;
            if (element.type === "PhotoElement") {
                var imageObject = this.shiftTemplateSuitImage(himage, vimage, elementW, elementH);
                var imageId = "";
                var imageGuid = "";
                var imageWidth = 0;
                var imageHeight = 0;
                var imageRotate = 0;
                if (imageObject) {
                    imageId = imageObject.id;
                    imageGuid = imageObject.guid;
                    imageWidth = imageObject.width;
                    imageHeight = imageObject.height;
                    imageRotate = imageObject.rotate;
                }

                if (Math.abs(imageRotate) === 90) {
                    // special rorate
                    var cWidth = imageHeight,
                        cHeight = imageWidth;
                } else {
                    var cWidth = imageWidth,
                        cHeight = imageHeight;
                };
                // console.log("crop", cWidth, cHeight, elementW, elementH);
                var cropObject = require('UtilCrop').getDefaultCrop(cWidth, cHeight, elementW * currentCanvas.ratio, elementH * currentCanvas.ratio);
                newParams = {
                    id: i + styleElements.length,
                    elType: 'image',
                    url: '',
                    isRefresh: false,
                    x: elementX,
                    y: elementY,
                    width: elementW,
                    height: elementH,
                    rotate: element.rotate,
                    dep: i + styleElements.length,
                    imageId: imageId,
                    imageGuid: imageGuid,
                    imageRotate: imageRotate,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight,
                    cropPX: cropObject.px,
                    cropPY: cropObject.py,
                    cropPW: cropObject.pw,
                    cropPH: cropObject.ph
                };


            }
            if(element.type === "TextElement") {
                newParams = {
                    id: i + styleElements.length,
                    elType: 'text',
                    text: element.text,
                    // text: 'Double click to insert Text',
                    x: elementX,
                    y: elementY,
                    width: elementW,
                    height: elementH,
                    rotate: element.rotate,
                    dep: i + styleElements.length,
                    fontFamily: element.fontFamily,
                    fontSize: currentCanvas.oriHeight * element.fontSize,
                    fontWeight: element.fontWeight,
                    textAlign: element.textAlign || 'left',
                    textVAlign: element.textVAlign || 'top',
                    lineSpacing: element.lineSpacing || 1,
                    fontColor: element.color,
                    isRefresh: false,
                    isFamilyName: false
                };
                if (element.tagId && element.tagId != '-1') {
                    if(tagListObj[element.tagId]){
                        $.extend(newParams, tagListObj[element.tagId]);
                    } else {
                        console.warn('tagId not In tagList!!!!');
                    }
                }
            }
            params.push(newParams);
        }

        if (others.length > 0) {
            var dep = params.length;
            for (var u = 0; u < others.length; u++) {
                var textItem = others[u];
                textItem.id = dep;
                textItem.dep = dep;
                params.push(textItem);
                dep++;
            }
        }
        // console.log(params);
        return params;
    },
    shiftTemplateSuitImage: function(himage, vimage, width, height) {
        var imageObject = null;
        if (width > height) {
            imageObject = vimage.shift();
        } else {
            imageObject = himage.shift();
        }

        if (typeof(imageObject) == "undefined") {
            if (width > height) {
                imageObject = himage.shift();
            } else {
                imageObject = vimage.shift();
            }
        }
        if (typeof(imageObject) == "undefined") {
            imageObject = null;
        }
        return imageObject;
    },


    getTemplateBySize: function(size) {
        var tpls = [];
        for (var i = 0; i < Store.templateList.length; i++) {
            if (Store.templateList[i].designSize === size) {
                tpls.push(Store.templateList[i]);
            }
        }
        return tpls;
    },

    getTemplateByGuid: function(guid) {
        for (var i = 0; i < Store.templateList.length; i++) {
            if (Store.templateList[i].guid === guid) {
                return Store.templateList[i];
            }
        }
    },

    getFitTemplate: function(imgsNum, hImgNum, vImgNum) {
        var size = Store.projectSettings[Store.currentSelectProjectIndex].size,
            rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated,
            tpls = [],
            fitTpls = [],
            optionalTpls = [];
        if (rotated) {
            size = size.split('X')[1] + 'X' + size.split('X')[0];
        }
        tpls = this.getTemplateBySize(size);
        if (tpls.length > 0) {
            for (var index in tpls) {
                if (tpls[index].imageNum == imgsNum && tpls[index].isCoverDefault && tpls[index].isCoverDefault === 'true') {
                    return tpls[index];
                }
            }
        }
        for (var index in tpls) {
            var tpl = tpls[index];
            if (imgsNum == tpl.imageNum) {
                if (hImgNum == tpl.horizontalNum) {
                    fitTpls.push(tpl);
                } else if (vImgNum == tpl.verticalNum) {
                    fitTpls.push(tpl);
                } else {
                    optionalTpls.push(tpl);
                }
            }
        }

        if (fitTpls.length) {
            if (fitTpls.length === 1) {
                return fitTpls[0];
            } else {
                var rindex = Math.floor(Math.random() * fitTpls.length);
                return fitTpls[rindex];
            }
        } else {
            /*if(tpls.length>0){
            	if(tpls.length===1){
            		return tpls[0];
            	}else{
            		var rindex = Math.floor(Math.random()*fitTpls.length);
            		return tpls[rindex];
            	}
            }*/
            if (optionalTpls.length) {
                var rindex = Math.floor(Math.random() * optionalTpls.length);
                return optionalTpls[rindex];
            }
        }
    },

    autoLayout: function() {
        if (Store.autoLayout) {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                imgParams = [],
                imgNums = 0,
                hImgNum = 0,
                vImgNum = 0,
                fitTpl;
            for (var i = 0; i < currentCanvas.params.length; i++) {
                var item = currentCanvas.params[i];
                if (item.elType === 'image') {
                    imgParams.push(item);
                    if (item.width > item.height) {
                        hImgNum++;
                    } else {
                        vImgNum++;
                    }
                }
            }
            imgNums = imgParams.length;
            fitTpl = this.getFitTemplate(imgNums, hImgNum, vImgNum);
            if (fitTpl) {
                Store.imagesIndex = fitTpl.imageNum;
                require('TemplateService').getTemplateItemInfo(fitTpl.guid, fitTpl.designSize);
                Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = fitTpl.guid;
                Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = fitTpl.suitId;
            }
        }
    },
    getForegroundVariable: function(projectNum, pageNum) {
        var type = 'foreground',
            SpecManage = require("SpecManage"),
            keyPatterns = SpecManage.getVariableKeyPatternById(type).split("-"),
            params = [],
            res,
            currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        for (var i = 0, l = keyPatterns.length; i < l; i++) {
            var key = currentProject[keyPatterns[i]];
            if (keyPatterns[i] === "trim") {
                key = Store.projectSettings[Store.selectedIdx].trim;
            } else if (keyPatterns[i] === "type") {
                key = Store.projects[projectNum].pages[pageNum].type;
            }
            if (key) {
                var item = { key: keyPatterns[i], value: key };
                params.push(item);
            }
        }
        res = SpecManage.getVariable(type, params);
        if (Store.projects[projectNum].pages[pageNum].type === 'insidePage') {
            var width = parseFloat(res.iWidth);
            var height = parseFloat(res.iHeight);
            var left = parseFloat(res.iPaddingLeft);
            var right = parseFloat(res.iPaddingRight);
            var top = parseFloat(res.iPaddingTop);
            var bottom = parseFloat(res.iPaddingBottom);
        } else {
            var width = parseFloat(res.cWidth);
            var height = parseFloat(res.cHeight);
            var left = parseFloat(res.cPaddingLeft);
            var right = parseFloat(res.cPaddingRight);
            var top = parseFloat(res.cPaddingTop);
            var bottom = parseFloat(res.cPaddingBottom);
        }
        if (res) {
            return {
                width: width,
                height: height,
                left: left,
                right: right,
                top: top,
                bottom: bottom,
            }
        } else {
            return null;
        }
    },
    getForeground: function(spread, currentCanvas, projectNum, pageNum, pageType) {
        var foreground = this.getForegroundVariable(projectNum, pageNum);
        var setting = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = setting.product;
        var orientation = setting.orientation;
        var format = setting.format;
        var formedSpread = this.getFormedSpread(spread, currentCanvas, product, format, pageType);
        if (foreground) {
            var ratioX = formedSpread.width / (foreground.width - foreground.left - foreground.right),
                realBgWidth = ratioX * foreground.width,
                ratioY = formedSpread.height / (foreground.height - foreground.top - foreground.bottom),
                realBgHeight = ratioY * foreground.height,
                // realBgHeight=(foreground.height/foreground.width)*realBgWidth,
                realX = foreground.left * ratioX - formedSpread.left,
                realY = foreground.top * ratioY - formedSpread.top;
            return {
                width: realBgWidth,
                height: realBgHeight,
                x: realX,
                y: realY,
                ratioX: ratioX,
                ratioY: ratioY,
                left: foreground.left * ratioX,
                top: foreground.top * ratioY,
                right: foreground.right * ratioX,
                bottom: foreground.bottom * ratioY
            };
        } else {
            return {
                width: frameBaseSize.width,
                height: frameBaseSize.height,
                x: photoLayer.x,
                y: photoLayer.y,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };
        }
    },
    getFormedSpread: function(spread, currentCanvas, product, format, pageType) {
        if (pageType === INSIDE_PAGE || product === FLAT) {
            return {
                width: currentCanvas.oriWidth - spread.bleedLeft - spread.bleedRight,
                height: currentCanvas.oriHeight - spread.bleedTop - spread.bleedBottom,
                top: spread.bleedTop,
                left: spread.bleedLeft
            };
        } else {
            if (format === SIDE) {
                var left = pageType === FRONT_PAGE ? 0 : spread.bleedLeft;
                var width = pageType === FRONT_PAGE
                    ? currentCanvas.oriWidth - spread.bleedRight
                    : currentCanvas.oriWidth - spread.bleedLeft;

                return {
                    width: width,
                    height: currentCanvas.oriHeight - spread.bleedTop - spread.bleedBottom,
                    top: spread.bleedTop,
                    left: left
                };
            } else if (format === TOP) {
                return {
                    width: currentCanvas.oriWidth - spread.bleedLeft - spread.bleedRight,
                    height: currentCanvas.oriHeight - spread.bleedBottom,
                    top: 0,
                    left: spread.bleedLeft
                };
            }
        }
    },

    initBlankCardElement: function() {
        for(var k = 0; k < Store.projects.length; k++) {
            var currentProject = Store.projects[k];

            for(var j = 0; j < currentProject.pages.length; j++) {
                var currentParams = currentProject.pages[j].canvas.params;
                var isInsidePage = currentProject.pages[j].type === INSIDE_PAGE;

                if(currentParams.length === 0) {
                    var photoElement = this.createBlankCardElement(isInsidePage);
                    currentParams.push(photoElement);
                }
            }
        }
    },

    createInsidePage: function() {
        for(var k = 0; k < Store.projects.length; k++) {
            var spread = require("ProjectManage").getCardSpread();
            Store.projects[k].pages.push({
                type: 'insidePage',
                id: require("UtilProject").guid(),
                tplGuid: '',
                pageNumber: '2',
                styleId: '',
                styleItemId: '',
                width: spread.width,
                height: spread.height,
                name: '',
                canvas: {
                    oriWidth: 0,
                    oriHeight: 0,
                    oriX: 0,
                    oriY: 0,
                    oriBgWidth: 0,
                    oriBgHeight: 0,
                    oriSpineWidth: 0,
                    realBleedings: {},
                    frameBaseSize: {},
                    frameBorderThickness: {},
                    boardInFrame: {},
                    boardInMatting: {},
                    mattingSize: {},
                    expendSize: {},
                    photoLayer: {},
                    params: [this.createBlankCardElement(true)],
                    elements: []
                }
            });

            var i = Store.projects[k].pages.length - 1;
            var currentCanvas = Store.projects[k].pages[i].canvas;
            
            var orientation = Store.projectSettings[k].orientation;
            var format = Store.projectSettings[k].format;
            var currentPage = Store.projects[k].pages[i].type;
            var product = Store.projectSettings[k].product;

            currentCanvas.oriWidth = product === FOLDER && format === SIDE && currentPage !== INSIDE_PAGE ? spread.width / 2 : spread.width;
            currentCanvas.oriHeight = product === FOLDER && format === TOP && currentPage !== INSIDE_PAGE ? spread.height / 2 : spread.height;
            currentCanvas.oriX = 0;
            currentCanvas.oriY = 0;
            currentCanvas.photoLayer = { width: currentCanvas.oriWidth, height: currentCanvas.oriHeight };
            currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
            currentCanvas.foreground = this.getForeground(spread, currentCanvas, k, i, currentPage);
            currentCanvas.formedSpread = this.getFormedSpread(spread, currentCanvas, product, format, currentPage);
            currentCanvas.oriBgWidth = currentCanvas.foreground.width;
            currentCanvas.oriBgHeight = currentCanvas.foreground.height;
            currentCanvas.oriX = currentCanvas.foreground.x;
            currentCanvas.oriY = currentCanvas.foreground.y;

            // 重置 spread 的外形尺寸
            Store.projects[k].pages[i].width = currentCanvas.oriWidth;
            Store.projects[k].pages[i].height = currentCanvas.oriHeight;

            Store.pages.push(Store.projects[k].pages[i]);
        }
    },

    removeInsidePage: function() {
        Store.pages.pop();
        for(var k = 0; k < Store.projects.length; k++) {
            Store.projects[k].pages.pop();
        }
    },

    createBlankCardElement: function(isInsidePage) {
        var spread = require("ProjectManage").getCardSpread();
        var orientation = Store.projectSettings[Store.selectedIdx].orientation;
        var format = Store.projectSettings[Store.selectedIdx].format;
        var product = Store.projectSettings[Store.selectedIdx].product;
        var elementWidth = product === FOLDER && format == SIDE ? spread.width / 2 : spread.width;
        var elementHeight = product === FOLDER && format == TOP ? spread.height / 2 : spread.height;

        // 如果是上折页，并且内页的情况下，photoElement高度撑满内页
        if(format === TOP && isInsidePage) {
            elementHeight *= 2;
        }
        // 如果是边折页，并且内页的情况下，photoElement宽度撑满内页
        if(format === SIDE && isInsidePage) {
            elementWidth *= 2;
        }

        return {
            id: 0,
            elType: 'image',
            styleGuid: '',
            styleItemId: '',
            styleId: '',
            styleImageId: '',
            url: '',
            isRefresh: false,
            x: 0,
            y: 0,
            width: elementWidth,
            height: elementHeight,
            rotate: 0,
            dep: 0,
            imageId: '',
            imageGuid: '',
            imageWidth: '',
            imageHeight: '',
            imageRotate: 0,
            cropPX: 0,
            cropPY: 0,
            cropPW: 1,
            cropPH: 1,
        }
    },

    removeElements: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        
        for(var i = currentCanvas.params.length - 1; i >= 0; i--) {
            this.deleteElement(i);
        };

        if(Store.pages[Store.selectedPageIdx].type === INSIDE_PAGE) {
            Store.isSwitchLoadingShow = false;
        }
    },

    refreshInsidePage: function() {
        var projectSetting = Store.projectSettings[Store.currentSelectProjectIndex];

        var shouldNewInsidePage = projectSetting['product'] === FOLDER; // 如果是折页card，则可以创建内页
        var shouldCleanInsidePage = Store.pages.some(function(page) { // 如果有card内页，则可以清除内页
          return page.type === INSIDE_PAGE;
        });

        // 内页刷新
        if(shouldCleanInsidePage) {
            this.removeInsidePage();
        }
        if(shouldNewInsidePage) {
            this.createInsidePage();
        }
    },

    fixResizePhotoElement: function() {
        for(var pageIdx = 0; pageIdx < Store.pages.length; pageIdx++) {
            var type = Store.pages[pageIdx].type;
            var currentCanvas = Store.pages[pageIdx].canvas;
            var spread = require("ProjectManage").getCardSpread();
            var product = Store.projectSettings[Store.selectedIdx].product;
            var orientation = Store.projectSettings[Store.selectedIdx].orientation;
            var format = Store.projectSettings[Store.selectedIdx].format;
            var elementWidth = product === FOLDER && format === SIDE ? spread.width / 2 : spread.width;
            var elementHeight = product === FOLDER && format === TOP ? spread.height / 2 : spread.height;

            // 如果是上折页，并且内页的情况下，photoElement高度撑满内页
            if(format === TOP && type === INSIDE_PAGE) {
                elementHeight *= 2;
            }
            // 如果是边折页，并且内页的情况下，photoElement宽度撑满内页
            if(format === SIDE && type === INSIDE_PAGE) {
                elementWidth *= 2;
            }
            
            currentCanvas.params[0].width = elementWidth;
            currentCanvas.params[0].height = elementHeight;
            currentCanvas.params[0].x = 0;
            currentCanvas.params[0].y = 0;
            currentCanvas.params[0].imageId = '';
        }
    },
    resetPagesData: function() {
        for(var pageIdx = 0; pageIdx < Store.resetPages.length; pageIdx++) {
            var currentResetCanvas = Store.resetPages[pageIdx].canvas;
            var currentCanvas = Store.pages[pageIdx].canvas;

            for(var paramIdx = 0; paramIdx < currentResetCanvas.params.length; paramIdx++) {
                var currentResetParam = currentResetCanvas.params[paramIdx];
                var resetParamIndex = Store.resetPages[pageIdx].id + '-' + paramIdx;
                var currentParam = currentCanvas.params.filter(function(param) {
                    return param.index === resetParamIndex && param.elType === currentResetParam.elType;
                })[0];

                if(currentParam) {
                    currentParam.dep = currentResetParam.dep;
                    currentParam.fontColor = currentResetParam.fontColor;
                    currentParam.fontFamily = currentResetParam.fontFamily;
                    currentParam.fontSize = currentResetParam.fontSize;
                    currentParam.fontWeight = currentResetParam.fontWeight;
                    currentParam.height = currentResetParam.height;
                    currentParam.lineSpacing = currentResetParam.lineSpacing;
                    currentParam.textAlign = currentResetParam.textAlign;
                    currentParam.textVAlign = currentResetParam.textVAlign;
                    currentParam.width = currentResetParam.width;
                    currentParam.x = currentResetParam.x;
                    currentParam.y = currentResetParam.y;

                    if(currentParam.imageId) {
                        var imageDetail = require('ImageListManage').getImageDetail(currentParam.imageId);

                        currentParam.imageRotate = imageDetail ? imageDetail.orientation : 0;

                        var isRotatedImage = Math.abs(currentParam.imageRotate) / 90 % 2 === 1;

                        if(imageDetail) {
                            currentParam.imageGuid = imageDetail.guid;
                            currentParam.imageWidth = imageDetail.width;
                            currentParam.imageHeight = imageDetail.height;
                        };

                        if(isRotatedImage) {
                            // special rorate
                            var cWidth = currentParam.imageHeight,
                                cHeight = currentParam.imageWidth;
                          }
                          else {
                            var cWidth = currentParam.imageWidth,
                                cHeight = currentParam.imageHeight;
                          };

                        var defaultCrops = require('UtilCrop').getDefaultCrop(cWidth, cHeight, currentParam.width * currentCanvas.ratio, currentParam.height * currentCanvas.ratio);

                        var px = defaultCrops.px,
                            py = defaultCrops.py,
                            pw = defaultCrops.pw,
                            ph = defaultCrops.ph,
                            width = currentParam.width * currentCanvas.ratio / pw,
                            height = currentParam.height * currentCanvas.ratio / ph;
            
                        // adding the crop settings to element
                        currentParam.cropX = imageDetail.width * px;
                        currentParam.cropY = imageDetail.height * py;
                        currentParam.cropW = imageDetail.width * pw;
                        currentParam.cropH = imageDetail.height * ph;
                
                        currentParam.cropPX = px;
                        currentParam.cropPY = py;
                        currentParam.cropPW = pw;
                        currentParam.cropPH = ph;

                        var encImgId = require('UtilProject').getEncImgId(currentParam.imageId);
                        var qs = require('UtilProject').getQueryString({
                            encImgId: encImgId,
                            px: px,
                            py: py,
                            pw: pw,
                            ph: ph,
                            width: Math.round(width),
                            height: Math.round(height)
                        });
                    }
                } else {
                    currentCanvas.params.push({
                        index: resetParamIndex,
                        cropPH: 1,
                        cropPW: 1,
                        cropPX: 0,
                        cropPY: 0,
                        decorationid: currentResetParam.decorationid,
                        decorationtype: currentResetParam.decorationtype,
                        dep: currentResetParam.dep,
                        elType: currentResetParam.elType,
                        fontColor: currentResetParam.fontColor,
                        fontFamily: currentResetParam.fontFamily,
                        fontSize: currentResetParam.fontSize,
                        fontWeight: currentResetParam.fontWeight,
                        height: currentResetParam.height,
                        id: paramIdx,
                        imageGuid: '',
                        imageHeight: '',
                        imageId: '',
                        imageRotate: 0,
                        imageWidth: '',
                        isDisableRemind: false,
                        isFamilyName: currentResetParam.isFamilyName,
                        isRefresh: false,
                        lineSpacing: currentResetParam.lineSpacing,
                        rotate: 0,
                        styleGuid: currentResetParam.styleGuid,
                        styleId: currentResetParam.styleId,
                        styleImageId: currentResetParam.styleImageId,
                        styleItemId: currentResetParam.styleItemId,
                        text: '',
                        textAlign: currentResetParam.textAlign,
                        textVAlign: currentResetParam.textVAlign,
                        url: '',
                        width: currentResetParam.width,
                        x: currentResetParam.x,
                        y: currentResetParam.y,
                    });
                }
            }
        }
    }
};
