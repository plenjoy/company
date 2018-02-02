
var Jcrop = require('jcrop');

var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ImageController = require('ImageController');
var CanvasController = require('CanvasController');

// component -- image crop
module.exports = {
	// template: '#t-image-crop',
	template: '<div class="bed-image-crop" v-show="sharedStore.isImageCropShow">' +
							'<div class="shadow-bg" v-bind:style="{zIndex: windowZindex-1}"></div>' +
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
								/*'<span class="button-text" v-show="privateStore.isRemoveButtonShow" style="display: inline-block; position: relative; top: 10px; margin-left: 20px;" v-on:click="handleRemoveImage()">Remove</span>' +*/
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
			sharedStore: Store,
			imageId: null,
			imageRotate: 0,
			cropInfo: {
				px: 0,
				py: 0,
				pw: 0,
				ph: 0,
				width: 0,
				height: 0
			},
			imageName: ''
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

		initPrivateData: function(idx) {
			var _this = this;
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
			var elementData = currentCanvas.params[idx];

			_this.borderLengthInch = require('UtilMath').getInchByPx(currentCanvas.borderLength || 0);
			_this.borderColor = currentCanvas.borderColor || 'none';
			_this.cropInfo.px = elementData.cropPX,
			_this.cropInfo.py = elementData.cropPY,
			_this.cropInfo.pw = elementData.cropPW,
			_this.cropInfo.ph = elementData.cropPH,
			_this.imageId = elementData.imageId;
			_this.imageRotate = elementData.imageRotate;

			Store.imageList.forEach(function(image) {
				if(image.id === _this.imageId) {
					_this.imageName = image.name;
				}
			});
		},

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
				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

				var idx = this.selectedIdx !== ''?this.selectedIdx:currentCanvas.selectedIdx;

				// valid degree now is 0 | 90 | 180 | -90
				var elementData = currentCanvas.params[idx];
				
				// valid degree now is 0 | 90 | 180 | -90
				this.imageRotate = UtilCrop.getRotatedAngle(this.imageRotate, nDegree);
				var imageDetail = ImageListManage.getImageDetail(this.imageId);
				var isRotatedImage = Math.abs(this.imageRotate) === 90;

				var imageWidth = isRotatedImage ? imageDetail.height : imageDetail.width,
						imageHeight = isRotatedImage ? imageDetail.width : imageDetail.height;

				var defaultCrops = UtilCrop.getDefaultCrop(imageWidth, imageHeight, elementData.width, elementData.height);
				
				this.cropInfo.px = defaultCrops.px;
				this.cropInfo.py = defaultCrops.py;
				this.cropInfo.pw = defaultCrops.pw;
				this.cropInfo.ph = defaultCrops.ph;

				this.triggerImageCrop(idx);
			}
		},

		// button triggered that to crop the selected image
		triggerImageCrop: function(idx) {
			var store = this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;
			if(this.selectedIdx !== ''){
				currentCanvas.selectedIdx = this.selectedIdx;
			}

			idx != null && idx !== '' ? idx : idx = currentCanvas.selectedIdx;

			if(this.imageId) {

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

			var imageDetail = ImageListManage.getImageDetail(this.imageId);
			var isRotatedImage = Math.abs(this.imageRotate) === 90;
			// 如果旋转值是 90 的倍数的话表示 图片宽高需要对调；
			var width = isRotatedImage ? imageDetail.height : imageDetail.width,
					height = isRotatedImage ? imageDetail.width : imageDetail.height;

	    var cropX = width * this.cropInfo.px,
	    cropY = height * this.cropInfo.py,
	    cropW = width * this.cropInfo.pw,
	    cropH = height * this.cropInfo.ph;

			var viewBoxWidth = 680,
					viewBoxHeight = 400;
			if(this.privateStore.cropWindowParams.height>window.innerHeight){
				viewBoxHeight = window.innerHeight - 295;
			}

			var	viewBoxWHRatio = viewBoxWidth / viewBoxHeight,
					sourceImageWHRatio = width / height;

			if(viewBoxWHRatio > sourceImageWHRatio) {
				// height meet
				store.cropImageRatio = viewBoxHeight / height;
			} else {
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

			var UtilProject = require('UtilProject');
      var encImgId = UtilProject.getEncImgId(this.imageId);
      var qs = UtilProject.getQueryString({
        encImgId: encImgId,
        px: 0,
        py: 0,
        pw: 1,
        ph: 1,
        width: Math.round(previewImageWidth),
        height: Math.round(previewImageHeight),
        rotation: this.imageRotate
      });

			$('#image-tobecrop')
				.attr('src', '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString())
				.attr('width', previewImageWidth)
				.attr('height', previewImageHeight)
				.css('width', previewImageWidth)
				.css('height', previewImageHeight)
				.Jcrop({
					aspectRatio: currentCanvas.params[idx].width / currentCanvas.params[idx].height,
					setSelect: [cropX * store.cropImageRatio, cropY  * store.cropImageRatio, (cropX + cropW) * store.cropImageRatio, (cropY + cropH) * store.cropImageRatio],
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
			var store = this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;

			var idx = currentCanvas.selectedIdx;

			var imageDetail = ImageListManage.getImageDetail(this.imageId);
			var isRotatedImage = Math.abs(this.imageRotate) === 90;
			// 如果旋转值是 90 的倍数的话表示 图片宽高需要对调；
			var width = isRotatedImage ? imageDetail.height : imageDetail.width,
					height = isRotatedImage ? imageDetail.width : imageDetail.height;

			var imageId = currentCanvas.params[idx].imageId,
					px = (store.cropParams.x / store.cropImageRatio) / width,
					py = (store.cropParams.y / store.cropImageRatio) / height,
					pw = (store.cropParams.w / store.cropImageRatio) / width,
					ph = (store.cropParams.h / store.cropImageRatio) / height,
					tWidth = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
					tHeight = currentCanvas.params[idx].height * currentCanvas.ratio / ph;
			px=parseFloat(px.toFixed(8));
			py=parseFloat(py.toFixed(8));

			// write back to element
			currentCanvas.params[idx].cropX = store.cropParams.x / store.cropImageRatio;
			currentCanvas.params[idx].cropY = store.cropParams.y / store.cropImageRatio;
			currentCanvas.params[idx].cropW = store.cropParams.w / store.cropImageRatio;
			currentCanvas.params[idx].cropH = store.cropParams.h / store.cropImageRatio;

			currentCanvas.params[idx].cropPX = px;
			currentCanvas.params[idx].cropPY = py;
			currentCanvas.params[idx].cropPW = pw;
			currentCanvas.params[idx].cropPH = ph;
			currentCanvas.params[idx].imageRotate = this.imageRotate;

			currentCanvas.params[idx].isRefresh = true;

			// var url = '/imgservice/op/crop?imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(tWidth) + '&height=' + Math.round(tHeight) + '&rotation=' + currentCanvas.params[idx].imageRotate;
			// require("DrawManage").drawImage("photoElementCanvas"+ (idx), url, 0, 0,null,currentCanvas.params[idx].width * currentCanvas.ratio,currentCanvas.params[idx].height * currentCanvas.ratio);

			this.hideImageCrop();
		},

		// remove image
		handleRemoveImage: function() {
			var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

			ImageController.deleteImage(currentCanvas.selectedIdx);
			ImageListManage.freshImageUsedCount();
			this.sharedStore.isImageCropShow = false;
		}
	},
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
				_this.selectedIdx = idx;

				_this.sharedStore.watches.isCropThisImage = false;
				_this.sharedStore.watchData.cropImageIdx = '';

				_this.initPrivateData(idx);
				_this.triggerImageCrop(idx);
			};
		});
	}
};
