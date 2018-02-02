
var UtilMath = require('UtilMath');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
var ProjectManage = require('ProjectManage');
var SpecController = require('SpecController');
var WarnController = require("WarnController");

var Vue = require('vuejs');
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

        var UtilProject = require('UtilProject');
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

					var params = require("ParamsManage").getParamsValueByElement(idx);

		    	if(params.x<-params.width||params.y<-params.height||params.x>currentCanvas.oriWidth||params.y>currentCanvas.oriHeight){
		    		console.info(params);
		    		params.x=0;
		    		params.y=0;
		    		if(params.elType==="text"){
		    			var TextController = require('TextController');
		    			TextController.editText(params,idx);
		    		}else if(params.elType==="image"||params.elType==="logo"){
		    			var ImageController = require('ImageController');
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
	    var params = require("ParamsManage").getParamsValueByElement(idx);
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
