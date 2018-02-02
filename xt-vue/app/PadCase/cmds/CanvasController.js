
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
        })

				loadImageUrl = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
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
						fontUrl = Store.domains.productBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
					};
      	}
      	else {
      	  fontUrl = Store.domains.productBaseUrl+"/product/text/textImage?text="+encodeURIComponent(currentCanvas.params[idx].text)+"&font="+encodeURIComponent(currentCanvas.params[idx].fontFamily)+"&fontSize="+fontViewSize+"&color="+currentCanvas.params[idx].fontColor+"&align=left";
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
    currentCanvas.elements[idx].imageRotate = currentCanvas.params[idx].imageRotate || 0;;

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
		    //console.log(events);
		    if(events[0] === 'scale start' || events[0] === 'rotate start') {

		    	// _this.changeClickDepth({ idx: img.opts.idx });
		    	_this.showSpineLines();

	    		WarnController.deleteElement(idx);

		    }
		    else if(events[0] === 'drag start') {
		    	Store.ctrls.isDragStarted = true;
		    	// Store.ctrls.lastTranEvent = '';

		    	_this.showSpineLines();
		    	console.log(currentCanvas.elements,currentCanvas.warns)
		    	console.log(currentCanvas, currentCanvas.warns[idx]);
	    		WarnController.deleteElement(idx);

		    }
		    else if(events[0] === 'drag end' || (Store.ctrls.isDragStarted && events[0] === 'apply' && Store.ctrls.lastTranEvent === 'init')) {
		    	// console.log('drag end');
		    	console.info('index'+idx);
		    	Store.ctrls.isDragStarted = false;
		    	Store.ctrls.lastTranEvent = '';
		    	_this.changeClickDepth({ idx: img.opts.idx });
		    	_this.hideSpineLines();
		    	if(currentCanvas.warns[idx] && currentCanvas.warns[idx].isActive){
		    		WarnController.createElement(idx);
		    	}
		    	WarnController.showBeforeElements();
		    	console.info('index'+idx)
		    }
		    else if(events[0] === 'scale end' || events[0] === 'rotate end') {
		    	// console.log('should sync params now');
		    	var newParams = ParamsManage.getParamsValueByElement(img.opts.idx);

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
		    else if(events[0] === 'apply'){
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
	  			console.log("frop")
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
		  	keepRatio: true,
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
			// };
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
		if (Store.projectSettings) {

            if(Store.projectXml){
                var sXml = Store.projectXml;
                this.initXMLImageList(sXml);
                this.initXMLProject(sXml);
            }else if(Store.projectJson){
                var sJson = Store.projectJson;
                this.initJsonImageList(sJson);
                this.initJsonProject(sJson);
            }
            
            Store.selectedPageIdx = 0;
        };
	},

	// init image list
	initXMLImageList: function(sXml) {
		if(sXml) {
			var imgCount = $(sXml).find('images').find('image').length;

			Store.imageList = [];
			if(imgCount > 0) {
				for(var i = 0; i < imgCount; i++) {
					Store.imageList.push({
						id: $(sXml).find('images').find('image').eq(i).attr('id'),
						guid: $(sXml).find('images').find('image').eq(i).attr('guid') || '',
						// url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
						encImgId: $(sXml).find('images').find('image').eq(i).attr('encImgId') || '',
						url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(sXml).find('images').find('image').eq(i).attr('encImgId') + require('UtilParam').getSecurityString() + '&rendersize=fit',
						name: decodeURIComponent($(sXml).find('images').find('image').eq(i).attr('name')) || '',
						width: parseFloat($(sXml).find('images').find('image').eq(i).attr('width')) || 0,
						height: parseFloat($(sXml).find('images').find('image').eq(i).attr('height')) || 0,
						shotTime: $(sXml).find('images').find('image').eq(i).attr('shotTime') || '',
						orientation: $(sXml).find('images').find('image').eq(i).attr('orientation') || 0,
						usedCount: 0,
						previewUrl: ''
					});

					require('UtilImage').getBlobImagePreviewUrl(i);
				};
			};
		};
	},
	initJsonImageList: function(sJson) {
        if (sJson) {
            var imgCount = sJson.project.images.length;

            Store.imageList = [];
            var images = sJson.project.images;
            if (imgCount > 0) {
                for (var i = 0; i < imgCount; i++) {
                    Store.imageList.push({
                        id: images[i].id,
                        guid: images[i].guid || '',
                        encImgId: images[i].encImgId || '',
                        name: decodeURIComponent(images[i].name) || '',
                        width: parseFloat(images[i].width) || 0,
                        height: parseFloat(images[i].height) || 0,
                        shotTime: images[i].shotTime || '',
                        orientation: images[i].orientation || 0,
												usedCount: 0,
												previewUrl: ''
                    });
                };

                // NOTE: for now, to fit for legacy data without encImgId, we use ajax to fecthing again
                if(i===0 && !images[i].encImgId) {
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
	// init project
	initXMLProject: function(sXml) {
		if(sXml) {
			for(var k = 0; k < $(sXml).find('padCase').length; k++) {
				// var prj = Store.projectSettings[k];
				// var specData = SpecController.analyseSpec({ size: prj.size, product: prj.product});

				Store.projects[k] = {};
				Store.projects[k].pages = [];
				for(var i = 0; i < $(sXml).find('padCase').eq(k).find('face').length; i++) {
					Store.projects[k].pages.push({
						type:  '',
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

					var spread = require("ProjectManage").getPhonecaseContent();

					currentCanvas.oriBgWidth = spread.bgWidth;
					currentCanvas.oriBgHeight = spread.bgHeight;
					currentCanvas.oriWidth = spread.width;
					currentCanvas.oriHeight = spread.height;
					currentCanvas.oriX = spread.x;
					currentCanvas.oriY = spread.y;
					currentCanvas.photoLayer = { width: spread.bgWidth, height: spread.bgHeight };
					currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
					currentCanvas.realSides = { top: spread.sideTop, right: spread.sideRight, bottom: spread.sideBottom, left: spread.sideLeft };
					currentCanvas.realEdges = { top: spread.edgeTop, right: spread.edgeRight, bottom: spread.edgeBottom, left: spread.edgeLeft };

					// get elements' size params
					var paramsCount = $(sXml).find('padCase').eq(k).find('face').eq(i).find('element').length;
					for(var j = 0; j < paramsCount; j++) {
						var imgId = $(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('imageid') || '',
								imageDetail = ImageListManage.getImageDetail(imgId),
								sourceImageUrl = '';

						imageDetail !== '' ? sourceImageUrl = Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid='+ imageDetail.encImgId + require('UtilParam').getSecurityString() +'&rendersize=fit' : sourceImageUrl;
						var ox = parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('x')) || 0,
								oy = parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('y')) || 0,
								ow = parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('width')) || 0,
								oh = parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('height')) || 0;
						// var shiftedValue = ParamsManage.getShiftValue(currentCanvas);
						// var newPosition = ParamsManage.getShiftPosition(ox, oy, ow, oh, shiftedValue.x, shiftedValue.y);
						var elType = '';
						if($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('type') === 'PhotoElement') {
							elType = 'image';
						}
						else if($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('type') === 'TextElement') {
							elType = 'text';
						};

						currentCanvas.params.push({
							id: j,
							elType: elType,
							// url: sourceImageUrl,
							url: '',
							isRefresh: false,
							text: decodeURIComponent($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).text()) || '',
							// x: currentCanvas.oriWidth * (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('px')) || 0),
							x: ox,
							// y: currentCanvas.oriHeight * (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('py')) || 0),
							y: oy,
							// width: currentCanvas.oriWidth * (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('pw')) || 0),
							width: ow,
							// height: currentCanvas.oriHeight * (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('ph')) || 0),
							height: oh,
							rotate: 0,
							dep: parseInt($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('dep')) || 0,
							imageId: imgId,
							imageGuid: imageDetail.guid || '',
							imageWidth: imageDetail.width || '',
							imageHeight: imageDetail.height || '',
							imageRotate: parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('imgRot')) || 0,
							// imageFlip: ,
							cropPX: parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropLUX')) || 0,
							cropPY: parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropLUY')) || 0,
							cropPW: (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropRLX')) - parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropLUX'))) || 1,
							cropPH: (parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropRLY')) - parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('cropLUY'))) || 1,
							fontFamily: decodeURIComponent($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('fontFamily')) || '',
							fontSize: currentCanvas.oriHeight * parseFloat($(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('fontSize') || 0),
							fontWeight: $(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('fontWeight') || '',
							textAlign: $(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('textAlign') || '',
							fontColor: $(sXml).find('padCase').eq(k).find('face').eq(i).find('element').eq(j).attr('color') || ''
						});
					};

					// robust enhancement for wrong depth value from other ends
					currentCanvas.params.sort(function(a, b) {
						return a.dep - b.dep;
					});

					// fix the depth value
					for(j = 0; j < currentCanvas.params.length; j++) {
					  currentCanvas.params[j].dep = j;
					};

				};
			};

		};
	},
	initJsonProject: function(sJson) {
		if(sJson) {
			var pages = sJson.project.pages;
			Store.projects[0] = {};
			Store.projects[0].pages = [];
			for(var i = 0; i < pages.length; i++) {

				
				Store.projects[0].pages.push({
					type:  '',
					name: '',
					canvas: {
						oriWidth: 0,		// real size
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
						params: [],			// all elements params/settings from backend
					}
				});

				var currentCanvas = Store.projects[0].pages[i].canvas;

				var spread = require("ProjectManage").getPhonecaseContent();

				currentCanvas.oriBgWidth = spread.bgWidth;
				currentCanvas.oriBgHeight = spread.bgHeight;
				currentCanvas.oriWidth = spread.width;
				currentCanvas.oriHeight = spread.height;
				currentCanvas.oriX = spread.x;
				currentCanvas.oriY = spread.y;
				currentCanvas.photoLayer = { width: spread.bgWidth, height: spread.bgHeight };
				currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
				currentCanvas.realSides = { top: spread.sideTop, right: spread.sideRight, bottom: spread.sideBottom, left: spread.sideLeft };
				currentCanvas.realEdges = { top: spread.edgeTop, right: spread.edgeRight, bottom: spread.edgeBottom, left: spread.edgeLeft };

				
				var paramsCount = pages[i].elements.length;
				for(var j = 0; j < paramsCount; j++) {
					var imgId = pages[i].elements[j].imageid || '',
							imageDetail = ImageListManage.getImageDetail(imgId),
							sourceImageUrl = '';

					imageDetail !== '' ? sourceImageUrl = Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid='+ imageDetail.encImgId + require('UtilParam').getSecurityString() +'&rendersize=fit' : sourceImageUrl;
					var ox = parseFloat(pages[i].elements[j].x) || 0,
							oy = parseFloat(pages[i].elements[j].y) || 0,
							ow = parseFloat(pages[i].elements[j].width) || 0,
							oh = parseFloat(pages[i].elements[j].height) || 0;
					var elType = '';
					if(pages[i].elements[j].type === 'PhotoElement') {
						elType = 'image';
					}
					else if(pages[i].elements[j].type === 'TextElement') {
						elType = 'text';
					};

					currentCanvas.params.push({
						id: j,
						elType: elType,
						// url: sourceImageUrl,
						url: '',
						isRefresh: false,
						text: decodeURIComponent(pages[i].elements[j].text) || '',
						x: ox,
						y: oy,
						width: ow,
						height: oh,
						rotate: 0,
						dep: parseInt(pages[i].elements[j].dep) || 0,
						imageId: imgId,
						imageGuid: imageDetail.guid || '',
						imageWidth: imageDetail.width || '',
						imageHeight: imageDetail.height || '',
						imageRotate: parseFloat(pages[i].elements[j].imgRot) || 0,
						cropPX: parseFloat(pages[i].elements[j].cropLUX) || 0,
						cropPY: parseFloat(pages[i].elements[j].cropLUY) || 0,
						cropPW: (parseFloat(pages[i].elements[j].cropRLX) - parseFloat(pages[i].elements[j].cropLUX)) || 1,
						cropPH: (parseFloat(pages[i].elements[j].cropRLY) - parseFloat(pages[i].elements[j].cropLUY)) || 1,
						fontFamily: decodeURIComponent(pages[i].elements[j].fontFamily) || '',
						fontSize: currentCanvas.oriHeight * parseFloat(pages[i].elements[j].fontSize || 0),
						fontWeight: pages[i].elements[j].fontWeight || '',
						textAlign: pages[i].elements[j].textAlign || '',
						fontColor: pages[i].elements[j].color || ''
					});
				};

				currentCanvas.params.sort(function(a, b) {
					return a.dep - b.dep;
				});

				for(j = 0; j < currentCanvas.params.length; j++) {
				  currentCanvas.params[j].dep = j;
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
					bleedings: {}, // bleeding sizes
					realBleedings: pickedProject.pages[i].canvas.realBleedings,
					realSides: pickedProject.pages[i].canvas.realSides,
					realEdges: pickedProject.pages[i].canvas.realEdges,
					frameBaseSize: pickedProject.pages[i].canvas.frameBaseSize,
					frameBorderThickness: pickedProject.pages[i].canvas.frameBorderThickness,
					canvasBordeThickness: pickedProject.pages[i].canvas.canvasBordeThickness,
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
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		var spread = require("ProjectManage").getPhonecaseContent();

		currentCanvas.oriBgWidth = spread.bgWidth;
		currentCanvas.oriBgHeight = spread.bgHeight;
		currentCanvas.oriWidth = spread.width;
		currentCanvas.oriHeight = spread.height;
		currentCanvas.oriX = spread.x;
		currentCanvas.oriY = spread.y;
		currentCanvas.photoLayer = { width: spread.bgWidth, height: spread.bgHeight };
		currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
		currentCanvas.realSides = { top: spread.sideTop, right: spread.sideRight, bottom: spread.sideBottom, left: spread.sideLeft };
		currentCanvas.realEdges = { top: spread.edgeTop, right: spread.edgeRight, bottom: spread.edgeBottom, left: spread.edgeLeft };
	},

	getTemplateParams:function(xml){
		var params=[];
	  	var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	  	var himage=[];
	  	var vimage=[];
	  	var texts=[];
      	for (var i = 0; i < currentCanvas.params.length; i++) {
      		console.log(currentCanvas.params[i]);
      		if(currentCanvas.params[i].elType==="image"&&currentCanvas.params[i].imageId){
      			if(currentCanvas.params.width>currentCanvas.params.height){
      				vimage.push({id:currentCanvas.params[i].imageId,guid:currentCanvas.params[i].imageGuid,width:currentCanvas.params[i].imageWidth,height:currentCanvas.params[i].imageHeight,rotate:currentCanvas.params[i].imageRotate});
	      		}else{
	      			himage.push({id:currentCanvas.params[i].imageId,guid:currentCanvas.params[i].imageGuid,width:currentCanvas.params[i].imageWidth,height:currentCanvas.params[i].imageHeight,rotate:currentCanvas.params[i].imageRotate});
	      		}
      		}else if(currentCanvas.params[i].elType==="text"){
      			texts.push(currentCanvas.params[i]);
      		}


      	};
      	console.log(vimage,himage,texts);
      	var elementArr=[];
      	for(var i=0;i<$(xml).find('element').length;i++){
      		var element=$(xml).find('element').eq(i);
      		var object={};
      		object.px=parseFloat(element.attr('px'));
      		object.py=parseFloat(element.attr('py'));
      		object.pw=parseFloat(element.attr('pw'));
      		object.ph=parseFloat(element.attr('ph'));
      		object.dep=parseFloat(element.attr('dep'));
      		elementArr.push(object);
      	}
      	elementArr.sort(function(a,b){
            return a.dep-b.dep});

      	for(var i=0;i<elementArr.length;i++){

        	var element=elementArr[i];
        	var elementX=element.px*currentCanvas.oriWidth;
        	var elementY=element.py*currentCanvas.oriHeight;
        	var elementW=element.pw*currentCanvas.oriWidth;
        	var elementH=element.ph*currentCanvas.oriHeight;
        	var imageObject=this.shiftTemplateSuitImage(himage,vimage,elementW,elementH);
        	var imageId="";
        	var imageGuid="";
        	var imageWidth=0;
        	var imageHeight=0;
        	var imageRotate=0;
        	if(imageObject){
        		imageId=imageObject.id;
        		imageGuid=imageObject.guid;
        		imageWidth=imageObject.width;
        		imageHeight=imageObject.height;
        		imageRotate=imageObject.rotate;
        	}

        	if(Math.abs(imageRotate) === 90) {
				// special rorate
				var cWidth = imageHeight,
						cHeight = imageWidth;
			}
			else {
				var cWidth = imageWidth,
						cHeight = imageHeight;
			};
			console.log("crop",cWidth, cHeight, elementW, elementH);
        	var cropObject=require('UtilCrop').getDefaultCrop(cWidth, cHeight, elementW*currentCanvas.ratio, elementH*currentCanvas.ratio);
        	var newImageParams = {
          		id: i,
          		elType: 'image',
          		url: '',
          		isRefresh: false,
          		x: elementX,
          		y: elementY,
          		width: elementW,
          		height: elementH,
          		rotate: 0,
          		dep: i,
          		imageId: imageId,
          		imageGuid:imageGuid,
          		imageRotate:imageRotate,
          		imageWidth:imageWidth,
          		imageHeight:imageHeight,
          		cropPX: cropObject.px,
          		cropPY: cropObject.py,
          		cropPW: cropObject.pw,
          		cropPH: cropObject.ph

        	};
        	params.push(newImageParams);

      	}

      	if(texts.length>0){
      		var dep=params.length;
      		for(var u=0;u<texts.length;u++){
      			var textItem=texts[u];
      			textItem.id=dep;
      			textItem.dep=dep;
      			params.push(textItem);
      			dep++;
      		}
      	}
      	console.log(params);
      	return params;
	},
	shiftTemplateSuitImage:function(himage,vimage,width,height){
		var imageObject = null;
		if(width>height){
			imageObject = vimage.shift();
		}else{
			imageObject = himage.shift();
		}

		if(typeof(imageObject) == "undefined"){
			if(width>height){
				imageObject = himage.shift();
			}else{
				imageObject = vimage.shift();
			}
		}
		if(typeof(imageObject) == "undefined"){
			imageObject=null;
		}
		return imageObject;
	},


	getTemplateBySize : function(size){
		var tpls = [];
		for(var i=0;i<Store.templateList.length;i++){
			if(Store.templateList[i].designSize===size){
				tpls.push(Store.templateList[i]);
			}
		}
		return tpls;
	},

	getTemplateByGuid : function(guid){
		for(var i=0;i<Store.templateList.length;i++){
			if(Store.templateList[i].guid===guid){
				return Store.templateList[i];
			}
		}
	},

	getFitTemplate : function(imgsNum,hImgNum,vImgNum){
		var size = Store.projectSettings[Store.currentSelectProjectIndex].size,
			rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated,
			tpls = [],
			fitTpls = [];
		if(rotated){
			size = size.split('X')[1]+'X'+size.split('X')[0];
		}
		tpls = this.getTemplateBySize(size);
		for(var index in tpls){
			var tpl = tpls[index];
			if(imgsNum == tpl.imageNum){
				if(hImgNum == tpl.horizontalNum){
					fitTpls.push(tpl);
				}else if(vImgNum == tpl.verticalNum){
					fitTpls.push(tpl);
				}else{
					fitTpls.push(tpl);
				}
			}
		}

		if(fitTpls.length){
			if(fitTpls.length===1){
				return fitTpls[0];
			}else{
				var rindex = Math.floor(Math.random()*fitTpls.length);
				return fitTpls[rindex];
			}
		}else{
			if(tpls.length>0){
				if(tpls.length===1){
					return tpls[0];
				}else{
					var rindex = Math.floor(Math.random()*fitTpls.length);
					return tpls[rindex];
				}
			}
		}
	},

	autoLayout : function(){
		if(Store.autoLayout){
	        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
	        	imgParams = [],
	            imgNums = 0,
	            hImgNum = 0,
	            vImgNum = 0,
	            fitTpl;
	        for(var i=0;i<currentCanvas.params.length;i++){
	            var item = currentCanvas.params[i];
	            if(item.elType==='image'){
	                imgParams.push(item);
	                if(item.width>item.height){
	                    hImgNum++;
	                }else{
	                  vImgNum++;
	                }
	            }
	        }
	        imgNums = imgParams.length;
	        fitTpl = this.getFitTemplate(imgNums,hImgNum,vImgNum);
	        if(fitTpl){
	        	Store.imagesIndex = fitTpl.imageNum;
		        require('TemplateService').getTemplateItemInfo(fitTpl.guid,fitTpl.designSize);
		        Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = fitTpl.guid;
		        Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = fitTpl.suitId;
	        }
	    }
    },

    fixResizePhotoElement: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var spread = ProjectManage.getPhonecasePhotoLayer();
        for (var i = 0; i < currentCanvas.params.length; i++) {
            if (currentCanvas.params[i].width / currentCanvas.oriWidth > 0.95 && currentCanvas.params[i].height / currentCanvas.oriHeight > 0.95) {

                currentCanvas.params[i].width = spread.width;
                currentCanvas.params[i].height = spread.height;
            };
        };
    }

};
