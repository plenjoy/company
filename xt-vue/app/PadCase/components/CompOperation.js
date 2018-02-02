
var Raphael = require('raphael');
var freeTransform = require('raphaelTransform');

var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
var SpecController = require('SpecController');
var CanvasController = require('CanvasController');
var ImageController = require('ImageController');
var TextController = require('TextController');


// component -- operation
module.exports = {
	// template: '#t-operation',
	template: '<div id="box-canvasbg" v-bind:style="{ width: privateStore.operationWidth + \'px\', height: privateStore.operationHeight + \'px\', margin: \'0 \' + operationMarginLeft  + \'px\' }" style="position: relative;">' +
							'<img v-bind:src="bgPath" draggable="false" alt="Background image is missing :(" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;" />' +
							'<div class="bed-operation" id="box-operation" v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\' }" style="position: absolute;">'+
	    					'<div title="Image is enlarged {{sharedStore.warnMargin.rate}}% beyond original size.\nMost images print well up to 50% beyond original size." v-bind:style="{width:sharedStore.warnMargin.width  + \'px \',height:sharedStore.warnMargin.height  + \'px \',margin: -sharedStore.warnMargin.top  + \'px \' + \'0 \' +  \'0 \' + sharedStore.warnMargin.left  + \'px \'}" v-show="sharedStore.warnMargin.visible" style="position:relative; z-index:10;">' +
	    						'<img style="width:100%;height:100%" src="../../static/img/warn_big_icon.png" draggable="false"/>' +
	    					'<div>' +
	    				'</div>' +
    				'</div>',
  mixins: [
  	require('CompCanvas')
  ],
	data: function() {
		return {
			privateStore: {
				operationWidth: 0,
				operationHeight: 0,
				operationPaddingLeft: 0,
				canvasTop: 0,
				canvasLeft: 0
			},
			sharedStore: Store
		};
	},
	computed: {
		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft;
		},

		bgPath: function() {
			if(this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color && this.sharedStore.selectedPageIdx != null) {
				return './assets/img/'+ this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].color +'-'+ this.sharedStore.selectedPageIdx +'.png';
			};
		}
	},
	methods: {
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

        //修改超过图片超过30%警告图标的位置
        store.warnMargin.width=110* currentCanvas.ratio;
        store.warnMargin.height=100* currentCanvas.ratio;
        store.warnMargin.left=(60+currentCanvas.bleedings.left)*currentCanvas.ratio;
        store.warnMargin.top=store.warnMargin.left+23;
			}
			else {
				// Window size is too small
				alert('Window size is too small!');
			};
		},

		createElement: function(idx) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

			if(currentCanvas.params[idx].elType === 'text') {
				CanvasController.createElement(idx, TextController);
			}
			else {
				CanvasController.createElement(idx, ImageController);
			};
		},

		syncParamsData: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;

			// reset trash params values
			currentCanvas.params = [];

			for(var i = 0; i < currentCanvas.elements.length; i++) {
				var newParams = ParamsManage.getParamsValueByElement(i);

				currentCanvas.params.push(newParams);
			}
		},

		initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;

			if(!Store.isPreview) {
				if(currentCanvas.isInited) {
					// already initialized, write back/sync params(ONLY current actived page!!)
					_this.syncParamsData();
				}
				else {
					// not initialized, proceed to read params only
					currentCanvas.isInited = true;
				};
			};

			if(Store.pages.length > 1) {
				Store.isChangePageShow = true;
			};

			_this.initWindow();

			$('.bed-operation').css('width', currentCanvas.width + 3).css('height', currentCanvas.height + 3);
			currentCanvas.paper = Raphael('box-operation', currentCanvas.width + 1, currentCanvas.height + 1);

			// loop and make all elements(includes bg element) based on params
		  if(true) {
		  	// draw bleeding ribbon and opacity layers
		  	// CanvasController.createBleeding();

		  	if(!Store.isPreview) {
		  		// draw invisible bg layer to enable drop functions
		  		CanvasController.createBackLayer();

		  		// draw outer lines
		  		CanvasController.createOuterLine();

		  		if(Store.selectedPageIdx !== 1) {
		  			// draw inner line
		  			CanvasController.createInnerLine();
		  		};

		  		// draw single center line
		  		CanvasController.createCenterLine();

		  		// draw spine lines
		  		// CanvasController.createSpineLine();

	  	    // set handle of double clicking -- cropping
	  	   //  bleedingInner.dblclick(function() {
  		   //  	// dispatch crop event
  		   //  	_this.$dispatch('dispatchImageCrop');
  			  // }).click(function() {
    		 //    	var that = this;
    		 //    	// that.toFront();

    		 //    	// save the selected image index into store
    		 //    	currentCanvas.selectedIdx = 0;
    		 //    	CanvasController.highlightSelection();

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

		    	// if(navigator.userAgent.indexOf('Trident') !== -1) {
		    	// 	// fit for IE
		    	// 	// on dragging over
		    	// 	$('#element-bg').attr('ondragover', 'event.preventDefault();');

		    	// 	// on dropping
		  			// $('#element-bg').attr('ondrop', 'asFn.fnOndrop(event, true);');
		    	// }
		    	// else {
		    	// 	// on dragging over
		    	// 	document.getElementById('element-bg').ondragover = function(ev) {
		    	// 		ev.preventDefault();
		    	// 	};

		    	// 	document.getElementById('element-bg').ondrop = function(ev) {
		    	// 		var obj = { ev: ev, isBg: true };

		    	// 		_this.handleOndrop(obj);
		    	// 	};
		    	// };

	    		// on dragging over
	    		document.getElementById('element-bg').ondragover = function(ev) {
	    			ev.preventDefault();
	    		};

	  			// on dropping
	  			document.getElementById('element-bg').ondrop = function(ev) {
	  				console.log(ev);
	  				var mouseX = ev.layerX || offsetX || 0,
	  						mouseY = ev.layerY || offsetY || 0;
	  				var defaultImagePositions = CanvasController.getDefaultNewElementPosition({ x: mouseX, y: mouseY });

	  				// create a new image element at first
	  				var newImageParams = {
	  					elType: 'image',
	  					url: '',
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
	  				var obj = { ev: ev, newAdded: true, isBg: false };
	  				Store.dropData.ev = obj.ev;
	  				Store.dropData.newAdded = obj.newAdded;
	  				Store.dropData.isBg = obj.isBg;

	  				Store.watches.isOnDrop = true;
	  			};

		  	};

		  };

			for(var i = 0; i < currentCanvas.params.length; i++) {
			  // init element
			  _this.createElement(i);
			};

			ImageListManage.freshImageUsedCount();
			CanvasController.freshElementDepth();

			CanvasController.hideSpineLines();
		},

		// change page
		changePage: function(nPageNum) {
			nPageNum = parseInt(nPageNum) || 0;

			if(nPageNum !== this.sharedStore.selectedPageIdx) {
				// change page
				// back up svg attrs
				// for(var i = 0; i < this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.elements.length; i++) {
				// 	this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.elements[i].mirrorAttrs = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.elements[i].attrs;
				// };

				// remove old paper
				this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.paper.remove();

				this.sharedStore.selectedPageIdx = nPageNum;

				this.initCanvas();
        this.$dispatch('dispatchChangeWarn');
			};
		},

		// handle ondrop
		handleOndrop: function(obj) {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;

			// obj = { ev: event, isBg: true/false }
			if(obj) {
				var ev = obj.ev,
						newAdded = obj.newAdded,
						isBg = obj.isBg;

				ev.preventDefault();

				var imageId = store.dragData.imageId,
						sourceImageUrl = store.dragData.sourceImageUrl,
						// imageId = ev.dataTransfer.getData('imageId'),
					// 	sourceImageUrl = ev.dataTransfer.getData('sourceImageUrl'),
						// imageWidth = ev.dataTransfer.getData('imageWidth'),
						// imageHeight = ev.dataTransfer.getData('imageHeight'),
						idx;

				if(newAdded) {
					// adding new element
					idx = currentCanvas.elements.length - 1;
				}
				else if(isBg) {
					idx = 0;
				}
				else {
					idx = parseInt(ev.target.id.split('-')[1]);
				};

				currentCanvas.elements[idx].imageId = imageId;

				var imageDetail = ImageListManage.getImageDetail(imageId);

				if(imageDetail) {
					currentCanvas.elements[idx].imageGuid = imageDetail.guid;
					currentCanvas.elements[idx].imageWidth = imageDetail.width;
					currentCanvas.elements[idx].imageHeight = imageDetail.height;
				};

				var defaultCrops = UtilCrop.getDefaultCrop(currentCanvas.elements[idx].imageWidth, currentCanvas.elements[idx].imageHeight, currentCanvas.elements[idx].vWidth, currentCanvas.elements[idx].vHeight);

				var px = defaultCrops.px,
						py = defaultCrops.py,
						pw = defaultCrops.pw,
						ph = defaultCrops.ph,
						width = currentCanvas.elements[idx].vWidth / pw,
						height = currentCanvas.elements[idx].vHeight / ph;

				// adding the crop settings to element
				currentCanvas.elements[idx].cropX = imageDetail.width * px;
				currentCanvas.elements[idx].cropY = imageDetail.height * py;
				currentCanvas.elements[idx].cropW = imageDetail.width * pw;
				currentCanvas.elements[idx].cropH = imageDetail.height * ph;


				currentCanvas.elements[idx].imageRotate = 0;

				var UtilProject = require('UtilProject');
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

				$('#element-' + idx).attr('href', '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString());
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

				currentCanvas.elements[idx].sourceImageUrl = sourceImageUrl;

				ImageListManage.freshImageUsedCount();
				_this.freshImageList();
        _this.$dispatch('dispatchChangeWarn');

			};
		},

		// fresh image list
		freshImageList: function() {
			this.$dispatch('dispatchImageList');
		},

		// reset project
    resetProject:function(){
        var _this = this;
        var store = _this.sharedStore;
        var prj = Store.projectSettings[Store.currentSelectProjectIndex];

        store.pages[this.sharedStore.selectedPageIdx].canvas.paper.remove();

        CanvasController.initCanvasData();

        _this.freshImageList();
        _this.initCanvas();
    }

	},
	events: {
		// respond broadcast change page
		notifyChangePage: function(nPageNum) {
			this.changePage(nPageNum);
		},

    notifyAddText:function(index){
      this.createElement(index);
      this.spineLinesToTop();
    },

    notifyResetCanvas:function(){
      this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.paper.remove();
      this.initCanvas();
    },

    notifyResetProject:function(){
        this.resetProject();
        this.$dispatch("dispatchChangeWarn");
    },

    // respond broadcast repaint
    notifyRepaint: function(oldIdx) {
    	if(oldIdx != undefined && oldIdx != null) {
    		// user select another project
    		if(!Store.isPreview) {
	    		CanvasController.syncProjectData(oldIdx);
    		};
    	};

    	if(Store.pages.length > 0 && Store.pages[Store.selectedPageIdx].canvas.paper) {
    		Store.pages[Store.selectedPageIdx].canvas.paper.remove();
    	};

    	CanvasController.loadProjectIntoPages();

    	this.freshImageList();
    	this.initCanvas();
    },

    notifyOndrop: function(obj) {
    	if(obj) {
   			this.handleOndrop(obj);
    	};
    },

    notifyShowSpineLines: function() {
    	CanvasController.showSpineLines();
    },

    notifyHideSpineLines: function() {
    	CanvasController.hideSpineLines();
    }

	},
	ready: function() {
		var _this = this;
		// 		store = _this.sharedStore,
		// 		prj = Store.projectSettings[Store.currentSelectProjectIndex];
				// currentCanvas = store.pages[store.selectedPageIdx].canvas;
		console.log('canvas dom is ready');

		_this.$watch('sharedStore.watches.isOnDrop', function() {
			if(_this.sharedStore.watches.isOnDrop) {
				_this.sharedStore.watches.isOnDrop = false;
				_this.handleOndrop(_this.sharedStore.dropData);
			};
		});
	}
};
