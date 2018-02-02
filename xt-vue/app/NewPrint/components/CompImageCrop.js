
var Jcrop = require('jcrop');

var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ImageController = require('ImageController');
var CanvasController = require('CanvasController');
var UtilMath = require("UtilMath");
// component -- image crop
module.exports = {
	// template: '#t-image-crop',
	template: '<div class="bed-image-crop" v-show="sharedStore.isImageCropShow">' +
							'<div class="shadow-bg" v-bind:style="{ zIndex: windowZindex-1 }"></div>' +
							'<div class="box-image-crop" v-bind:style="{ zIndex: windowZindex }">' +
								'<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideImageCrop()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position:absolute;top: 22px; right: 22px; cursor: pointer;" />' +
								'<h3 class="font-normal t-left" style="font-size: 24px;color: #3a3a3a;margin: 0 0 4px 0;">Edit Image</h3>' +
									// '<div class="font-desc t-left">Image - {{ imageName }}</div>' +
								'<div style="margin: 30px auto 20px;width: 480px;min-height:310px;" v-bind:style="{height:height+\'px\'}">' +
									'<div id="box-crop">' +
										'<img id="image-tobecrop" src="" />' +
									'</div>' +
								'</div>' +
								'<div style="height: 46px;text-align:center;">' +
									// '<span class="button-circle" v-on:click="handleSendToBack()" style="display: inline-block; margin-left: 231px;height:46px;" title="send to back">' +
									// 	'<img src="../../static/img/send_to_back.png" onmouseover="this.src = \'../../static/img/send_to_back_hover.png\';" onmouseout="this.src = \'../../static/img/send_to_back.png\';" width="46" height="46" alt="send to back" />' +
									// '</span>' +
									'<span class="button-circle" v-on:click="doRotate(-90) | debounce" style="display: inline-block; height:46px;" title="rotate left">' +
										'<img src="../../static/img/rotate_left.png" onmouseover="this.src = \'../../static/img/rotate_left_hover.png\';" onmouseout="this.src = \'../../static/img/rotate_left.png\';" width="46" height="46" alt="rotate left" />' +
									'</span>' +
									'<span class="button-circle" v-on:click="doRotate(90) | debounce" style="display: inline-block; margin-left: 70px;" title="rotate right">' +
										'<img src="../../static/img/rotate_right.png" onmouseover="this.src = \'../../static/img/rotate_right_hover.png\';" onmouseout="this.src = \'../../static/img/rotate_right.png\';" width="46" height="46" alt="rotate right" />' +
									'</span>' +
								'</div>' +
								'<div style="height: 20px;text-align:center;margin-top:14px;">' +
									// '<span style="display: inline-block; width: 96px; height: 20px; line-height: 20px; text-align: center; margin-left: 206px; font-size: 12px; color: #7a7a7a;">Send to back</span>' +
									'<span style="display: inline-block; width: 46px; height: 20px; line-height: 20px; text-align: center; font-size: 12px; color: #7a7a7a;">- 90°</span>' +
									'<span style="display: inline-block; width: 46px; height: 20px; line-height: 20px; text-align: center; margin-left: 70px; font-size: 12px; color: #7a7a7a;">+ 90°</span>' +
								'</div>' +
								'<div v-if="sharedStore.isBorderEditorShow" style="border-top: 1px solid #f5f5f5;overflow: hidden;margin-top:20px;">' +
									'<div style="overflow:hidden;">'+
										'<span class="font-book" style="font-size:14px;color:#3a3a3a;">Border</span>'+
										'<div style="float:right;font-size:13px;color:#7b7b7b;">'+
												'<input type="checkbox" id="appply-to-all" v-model="applyAll" style="vertical-align:middle;margin-right:8px;" />'+
												'<label for="appply-to-all" style="vertical-align:middle;">Apply to all the images.</label>'+
										'</div>' +
									'</div>'+
									'<div style="margin-top:2px;padding:20px;background-color:#f6f6f6;">'+
											'<div >'+
													'<label class="font-light" style="display:inline-block;font-size:13px;width:50px;color:#3a3a3a;">Color:</label>'+
													'<select class="font-light bbox" style="width:150px;font-size:12px;height:20px;color:#7b7b7b;border:1px solid #666;" v-model="borderColor" v-on:change="borderColorChange()">'+
															'<option v-for="color in privateStore.borderColor" value="{{ color.id }}">{{ color.title }}</option>'+
													'</select>'+
											'</div>'+
											'<div style="position:relative;margin-top:15px;">'+
													// '<span class="change-border-size font-light"  v-bind:style="{left:left}" style="position:absolute;color:#3a3a3a;font-size:12px;top:-16px;width:40px;">{{borderLengthInch}} In.</span>'+
													'<label class="font-light;" style="display:inline-block;font-size:13px;width:50px;color:#3a3a3a;">Size:</label><input type="range" :disabled="borderSizeDisabled" id="border-size-selector" min="0" max="1" step="0.1" v-bind:style="{top:top}" style="width:306px;vertical-align: top;position:relative;" v-on:change="handleLengthChange()" v-model="borderLengthInch" number />'+
													'<input type="number" :disabled="borderSizeDisabled" min="0" max="1" step="0.1" v-model="borderLengthInch" v-on:change="handleLengthChange()" style="width:50px;margin-left:20px;vertical-align: top;text-align:center;" />'+
											'</div>' +
									'</div>'+
								'</div>' +

								'<div style="text-align: center;margin-top: 30px;">' +
									// '<div class="button-white t-center" style="border: 1px solid black;text-align: center;width: 160px;height: 40px;line-height: 40px;margin-right: 50px;display: inline-block;font-size: 14px;" v-on:click="hideImageCrop()">Cancel</div>' +
									'<div class="button" v-on:click="doImageCrop()" style="display: inline-block; width: 160px;height: 40px;line-height: 40px;text-align: center;font-size: 14px;" title="Click to crop image">Done</div>' +
								'</div>'+
								// '<span class="button-text" v-show="privateStore.isRemoveButtonShow" style="display: inline-block; position: relative; top: 10px; margin-left: 20px;" v-on:click="handleRemoveImage()">Remove</span>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {
				jcrop_api: '',
				isCanRotate: false,
				cropWindowParams: {
					width: 560,
					height: 800,
					selector: '.box-image-crop'
				},
				borderColor : [
					{ id : 'none', title : 'None'},
					{ id : '#FFFFFF', title : 'White'},
					{ id : '#000000', title : 'Black'},
				],
				ratio : 0,
				isRemoveButtonShow: true,
			},
			borderLength : 0,
			borderLengthInch : 0,
			borderColor : 'none',
			applyAll : false,
			init : [],
			sharedStore: Store,
			pageIdx:0,
			firstTime : true,
			isChangeCrop: false,
			imageId: null,
			imageRotate: 0,
			cropInfo: {
				px: 0,
				py: 0,
				pw: 0,
				ph: 0,
				width: 0,
				height: 0
			}
		};
	},
	computed: {
		windowZindex: function() {
			var currentCanvas = Store.pages[this.pageIdx].canvas,
					elementTotal = currentCanvas.params.length || 0;

			return (elementTotal + 10) * 100 * 3;
		},
		borderLength : function(){
			UtilMath.getPxByInch(this.borderLengthInch);
		},
		cropAreaheight : function(){
			if(window.innerHeight<this.privateStore.cropWindowParams.height){
				return height - 360;
			}else{
				return 310;
			}
		},
		left : function() {
			var left = (34 + this.borderLengthInch*10*216/11)+"px";
			return left;
		},
		top : function(){
			if("ActiveXObject" in window){
				return "-20px";
			}else{
				return 0;
			}
		},
		borderSizeDisabled:function() {
			return this.borderColor === "none";
		}
	},
	methods: {
		initPrivateData: function(pageIdx, elementIdx) {
			var currentCanvas = this.sharedStore.pages[pageIdx].canvas;
			var elementData = currentCanvas.params[elementIdx];
			this.borderLengthInch = UtilMath.getInchByPx(currentCanvas.borderLength || 0);
			this.borderColor = currentCanvas.borderColor || 'none';
			this.cropInfo.px = elementData.cropPX,
			this.cropInfo.py = elementData.cropPY,
			this.cropInfo.pw = elementData.cropPW,
			this.cropInfo.ph = elementData.cropPH,
			this.imageId = elementData.imageId;
			this.imageRotate = elementData.imageRotate;

			if(this.borderColor == "none"){
				$("#border-size-selector").css('pointer-events','none');
				$('#border-size-selector').css('opacity',0.4);
			}
		},
		// do hiding image crop box
		hideImageCrop: function() {
			this.sharedStore.isImageCropShow = false;
			$('#image-tobecrop').attr('src', null)
		},

		handleSendToBack: function() {
			var currentCanvas = Store.pages[this.pageIdx].canvas;

			CanvasController.sendToBack({ idx: currentCanvas.selectedIdx });
			this.hideImageCrop();
		},

		// do rotate
		doRotate: function(nDegree) {
			if(this.privateStore.isCanRotate) {
				var currentCanvas = this.sharedStore.pages[this.pageIdx].canvas;
				// var idx = currentCanvas.selectedIdx;
				var idx = 0;
				var elementData = currentCanvas.params[idx]

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

		handleLengthChange : function(){
			var store         = this.sharedStore,
			    currentSize   = store.projectSettings[this.pageIdx].size,
			    currentCanvas = this.sharedStore.pages[this.pageIdx].canvas,
			    bigSize       = Math.max(currentSize.split("X")[0],currentSize.split("X")[1]),
			    bigSizeRatio  = this.borderLengthInch/bigSize,
			    realBorderWidth = Math.max(store.cropParams.w,store.cropParams.h)*bigSizeRatio + "px";
		    $(".h-border").css('width',realBorderWidth);
				$(".v-border").css('height',realBorderWidth);
		},

		borderColorChange : function(){
			if(this.borderColor==='none'){
				this.borderLengthInch = 0;
				//$("#border-size-selector").css('pointer-events','none');
				//$("#border-size-selector").attr("disabled","disabled");
				$('#border-size-selector').css('opacity',0.4);
			}else{
				//$("#border-size-selector").css('pointer-events','auto');
				//$("#border-size-selector").removeAttr("disabled");
				$('#border-size-selector').css('opacity',1);
				if(this.borderLengthInch===0){
					this.borderLengthInch = 0.2;
				}
			}
			$(".h-border,.v-border").css('background',this.borderColor);
			this.handleLengthChange();
		},

		// button triggered that to crop the selected image
		triggerImageCrop: function(idx,pageIdx) {
			var store = this.sharedStore,
				pageIdx  = pageIdx || this.pageIdx,
				currentCanvas = store.pages[pageIdx].canvas;

			idx != null && idx !== '' ? idx : idx = currentCanvas.selectedIdx;

			if(this.imageId) {
				// set image, and init jcrop
				this.handleCropInit(idx,pageIdx);

				// handle image crop box position
				// UtilWindow.setPopWindowPosition(this.privateStore.cropWindowParams);
				store.isImageCropShow = true;
			};
		},

		// set image and init crop
		handleCropInit: function(idx,pageIdx) {
			var _this = this,
					store = _this.sharedStore,
					pageIdx  = pageIdx || this.pageIdx,
					currentCanvas = store.pages[pageIdx].canvas;

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

			var viewBoxWidth = 480,
					viewBoxHeight = 310;
			if(this.privateStore.cropWindowParams.height>window.innerHeight){
				viewBoxHeight = window.innerHeight - 360;
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
							var currentSize   = store.projectSettings[_this.pageIdx].size,
							    currentCanvas = _this.sharedStore.pages[_this.pageIdx].canvas,
							    bigSize       = Math.max(currentSize.split("X")[0],currentSize.split("X")[1]),
							    bigSizeRatio  = _this.borderLengthInch/bigSize,
							    realBorderWidth = Math.max(c.w,c.h)*bigSizeRatio + "px";
						if(!_this.firstTime){
							$(".h-border").css('width',realBorderWidth);
							$(".v-border").css('height',realBorderWidth);
						};
						store.cropParams = { x: c.x, y: c.y, w: c.w, h: c.h,realBorderWidth:realBorderWidth};
						_this.firstTime = false;

						if(_this.privateStore.isCanRotate) {
							_this.isChangeCrop = true;
						}
					}
				}, function(){
					_this.privateStore.jcrop_api = this;
					_this.privateStore.isCanRotate = true;
					_this.isChangeCrop = false;
					//add borders
					var rl = $($(".jcrop-vline")[0]),
						tBorder = $("<div />").css({
							'position' : 'absolute',
							'width' : '100%',
							'top' : '1px',
							'left' : 0,
						}).addClass("v-border"),
						rBorder = $("<div />").css({
							'position' : 'absolute',
							'height' : '100%',
							'top' : 0,
							'right' : '1px'
						}).addClass("h-border"),
						bBorder = $("<div />").css({
							'position' : 'absolute',
							'width' : '100%',
							'bottom' : '1px',
							'left' : 0
						}).addClass("v-border"),
						lBorder = $("<div />").css({
							'position' : 'absolute',
							'height' : '100%',
							'top' : 0,
							'left' : '1px'
						}).addClass("h-border");
					rl.after(tBorder);
					rl.after(rBorder);
					rl.after(bBorder);
					rl.after(lBorder);
					$(".h-border").css('width',store.cropParams.realBorderWidth);
					$(".v-border").css('height',store.cropParams.realBorderWidth);
					$(".h-border,.v-border").css('background',_this.borderColor);
				});
		},

		// do crop image
		doImageCrop: function() {
			var store = this.sharedStore,
					pageIdx = this.pageIdx,
					currentCanvas = store.pages[pageIdx].canvas;

			var idx = currentCanvas.selectedIdx;

			if(typeof this.idx != 'undefined'){
				idx = this.idx;
			}

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

			if(this.isChangeCrop || this.imageRotate !== currentCanvas.params[idx].imageRotate) {
				// write back to element
				// TODO  这里的 cropX 、 cropY 等的计算方式有误。
				currentCanvas.params[idx].cropX = store.cropParams.x / store.cropImageRatio;
				currentCanvas.params[idx].cropY = store.cropParams.y / store.cropImageRatio;
				currentCanvas.params[idx].cropW = store.cropParams.w / store.cropImageRatio;
				currentCanvas.params[idx].cropH = store.cropParams.h / store.cropImageRatio;

				currentCanvas.params[idx].cropPX = px;
				currentCanvas.params[idx].cropPY = py;
				currentCanvas.params[idx].cropPW = pw;
				currentCanvas.params[idx].cropPH = ph;
				currentCanvas.params[idx].imageRotate = this.imageRotate;
			}

			currentCanvas.params[idx].isRefresh = true;

			if(this.applyAll){
				for(var i=0;i<store.pages.length;i++){
					var curCanvas = store.pages[i].canvas;
					curCanvas.borderColor = this.borderColor;
					curCanvas.borderLength = UtilMath.getPxByInch(this.borderLengthInch);
					curCanvas.params[0].isRefresh = true;
				}
			}else{
				currentCanvas.borderColor = this.borderColor;
				currentCanvas.borderLength = UtilMath.getPxByInch(this.borderLengthInch);
				currentCanvas.params[0].isRefresh = true;
			}
			this.hideImageCrop();
		},

		// remove image
		handleRemoveImage: function() {
			var currentCanvas = this.sharedStore.pages[this.sharedthis.pageIdx].canvas;

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
					currentCanvas = store.pages[this.pageIdx].canvas;

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

			var defaultCrops = UtilCrop.getDefaultCrop(cWidth, cHeight, currentCanvas.params[idx].width, currentCanvas.params[idx].height);

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
				_this.applyAll=false;
				_this.idx = _this.sharedStore.watchData.cropImageIdx;
				_this.pageIdx = _this.sharedStore.watchData.cropImagePageIdx;

				_this.sharedStore.watches.isCropThisImage = false;
				_this.sharedStore.watchData.cropImageIdx = '';
				_this.initPrivateData(_this.pageIdx, _this.idx);
				_this.triggerImageCrop(_this.idx,_this.pageIdx);
			};
		});
	}
};
