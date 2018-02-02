
var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
// var ProjectManage = require('ProjectManage');
// var SpecController = require('SpecController');
var CanvasController = require('CanvasController');
var ImageController = require('ImageController');
// var TextController = require('TextController');
// var WarnController = require("WarnController");

// component -- container

module.exports = {
  template: '<div v-bind:style="topStyle" style="position:relative;">'+
              '<div v-show="sharedStore.isSwitchLoadingShow && !sharedStore.isPageLoadingShow" style="width: 98px;height: 98px;background-color: #f0f0f0;border: 1px solid #7b7b7b;border-radius: 12px;position: absolute;top: 50%;left: 50%;margin: -42.5px 0 0 -42.5px;z-index: 9999;text-align: center;">'+
                  '<img src="assets/img/Loading.gif" width="50px" height="50px" title="Switching" alt="Switching" style="margin-top:15px;">' +
                  '<span class="font-light" style="position: relative;top: -8px;color: #7d7d7d;font-size: 12px;">Loading...</span>'+
              '</div>'+
              '<div id="box-canvasbg" v-bind:style="{ width: privateStore.operationWidth + \'px\', height: privateStore.operationHeight + \'px\', margin: operationMarginTop + \'px \' + operationMarginLeft  + \'px\',opacity:opacity }" style="position: relative;overflow: hidden;">' +
              // '<img v-bind:src="bgPath" draggable="false" alt="Background image is missing :(" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;" />' +
              '<div style="position: relative;width: 100%; height: 100%; overflow: hidden;">' +
                '<div class="bed-operation" id="container" v-bind:style="containerStyle" style="position: relative; overflow: hidden;background: #fff;">' +
                  '<bar-panel v-show="!sharedStore.isPreview && isShowHandle"></bar-panel>'+
                  '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
                '</div>' +
              '</div>' +
              '<bg-layer v-show="!sharedStore.isCanvas" v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
              '<screenshot-element  v-show="sharedStore.isCanvas" v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></screenshot-element>' +
              '<mirror-element v-show="sharedStore.isCanvas"></mirror-element>' +
              '</div>'+
              '<div v-if="sharedStore.isCanvas"  v-bind:style="{ width: privateStore.operationWidth + \'px\', height: privateStore.operationHeight + \'px\', top: operationMarginTop + \'px \',left: operationMarginLeft  + \'px\',zIndex:windowZindex }" style="position: absolute;pointer-events: none;">'+
                '<div v-bind:style="{width: privateStore.operationWidth + 16 + \'px\'}" style="position:absolute;height:10px;top:-8px;left:-8px;background:rgb(240, 240, 240);"></div>'+
                '<div v-bind:style="{width: privateStore.operationWidth + 16 + \'px\'}" style="position:absolute;height:10px;bottom:-8px;left:-8px;background:rgb(240, 240, 240);"></div>'+
                '<div v-bind:style="{height: privateStore.operationHeight + 16 + \'px\'}" style="position:absolute;width:10px;top:-8px;left:-8px;background:rgb(240, 240, 240);"></div>'+
                '<div v-bind:style="{height: privateStore.operationHeight + 16 + \'px\'}" style="position:absolute;width:10px;top:-8px;right:-8px;;background:rgb(240, 240, 240);"></div>'+
              '</div>'+
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
        isSideHandles: false,
			},
			sharedStore: Store,
      isCategoryCanvas : false
    };
  },
  computed: {
    operationMarginTop: function() {
			return this.privateStore.operationPaddingTop;
		},

		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft;
		},

    opacity : function(){
        if(this.sharedStore.isSwitchLoadingShow){
          return "0";
        }else{
          return "1";
        }
    },

    isShowHandle:function(){
         var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
         if(!Store.isLostFocus){
            return true;
         }else{
            return false;
         }
    },
    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;
      return (elementTotal + 10) * 100 -10;
    },
    topStyle: function(){
        if(this.sharedStore.isPreview){
            return{
                top: '50px'
            }
        }else{
            return{
                top: '0'
            }
        }
    },
    containerStyle: function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
      var product = currentProject.product;
      var isFloatFrame = product === 'floatFrame';
      var ratio = currentCanvas.ratio;
      var shadowX = Math.floor(-56*ratio) + 'px ';
      var shadowY = Math.floor(42*ratio) + 'px ';
      var shadowBlur = Math.floor(140*ratio) + 'px ';
      var shadowSpread = Math.floor(28*ratio) + 'px ';
      var boxShadow = shadowX + shadowY + shadowBlur + shadowSpread + 'rgba(0,0,0,0.24)';

      return {
          top: this.privateStore.canvasTop + 'px',
          left: this.privateStore.canvasLeft + 'px',
          borderRadius: isFloatFrame ? '5px' : 0,
          zIndex: Math.ceil(Math.random() * 10),
          boxShadow: isFloatFrame ? boxShadow : 0,
          cursor: !this.sharedStore.isPreview ? 'pointer' : 'default'
      }
    }
	},
  methods: {
    initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas,
          currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

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

      // 针对 floatFrame 产品，展示区不能带出血，同时photoLayer 需要向右下坐出血的偏移。
      var isFloatFrame = currentProject.product === 'floatFrame';
      var containerWidth = isFloatFrame
          ? Math.floor((currentCanvas.oriWidth - currentCanvas.realBleedings.left - currentCanvas.realBleedings.right - currentCanvas.boardInFrame.left  - currentCanvas.boardInFrame.right)*currentCanvas.ratio)
          : Math.floor(currentCanvas.width);
      var containerHeight = isFloatFrame
          ? Math.floor((currentCanvas.oriHeight - currentCanvas.realBleedings.top - currentCanvas.realBleedings.bottom - currentCanvas.boardInFrame.top  - currentCanvas.boardInFrame.bottom)*currentCanvas.ratio)
          : Math.floor(currentCanvas.height);

      $('.bed-operation').css('width', containerWidth).css('height', containerHeight);

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
        var elementId = currentCanvas.params[i].id;
        CanvasController.deleteElement(i, elementId);
      };
    },

    initWindow: function() {
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[store.selectedPageIdx].canvas,
          currentProject = store.projectSettings[store.currentSelectProjectIndex];

      // get the canvas size params
      if(store.isPreview) {
        var boxLimit = UtilWindow.getPreviewBoxLimit(true);
      }
      else {
        var boxLimit = UtilWindow.getBoxLimit(380);
      };
      // console.log("cur",currentCanvas)
      if(boxLimit.width > 0 && boxLimit.height > 0) {
        // if(!this.sharedStore.isCanvas && currentCanvas.expendSize.top) {
        //   // with expend size
        //   var objWidth = currentCanvas.oriBgWidth + currentCanvas.expendSize.left + currentCanvas.expendSize.right;
        //   var objHeight = currentCanvas.oriBgHeight + currentCanvas.expendSize.top + currentCanvas.expendSize.bottom;
        //   var expendLeft = currentCanvas.expendSize.left;
        //   var expendTop = currentCanvas.expendSize.top;
        // }
        // else {
          var objWidth = currentCanvas.oriBgWidth;
          var objHeight = currentCanvas.oriBgHeight;
          var expendLeft = 0;
          var expendTop = 0;
        // };
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
        // if(currentCanvas.canvasBordeThickness){
        //     currentCanvas.mirrorLength = (currentCanvas.canvasBordeThickness.left + currentCanvas.realBleedings.left) * currentCanvas.ratio;
        // }

        _this.privateStore.operationPaddingTop = 0 + expendTop * currentCanvas.ratio;
        _this.privateStore.operationWidth = currentCanvas.bgWidth;
        _this.privateStore.operationHeight = currentCanvas.bgHeight;
        _this.privateStore.canvasTop = currentCanvas.y;
        _this.privateStore.canvasLeft = currentCanvas.x;

        if(currentProject.product === 'floatFrame') {
          _this.privateStore.canvasTop += (currentCanvas.realBleedings.top + currentCanvas.boardInFrame.top ) * currentCanvas.ratio;
          _this.privateStore.canvasLeft += (currentCanvas.realBleedings.left + currentCanvas.boardInFrame.left)* currentCanvas.ratio;
        }

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

    handleOndrop: function(obj) {
      this.sharedStore.isShowProgress = true;
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[store.selectedPageIdx].canvas;

      Store.isLostFocus = true;
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
        currentCanvas.params[idx].imageRotate = 0;

        var imageDetail = ImageListManage.getImageDetail(imageId);

        if(imageDetail) {
          currentCanvas.params[idx].imageGuid = imageDetail.guid;
          currentCanvas.params[idx].imageWidth = imageDetail.width;
          currentCanvas.params[idx].imageHeight = imageDetail.height;
        }

        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var rotated = currentProject.rotated;
        // 根据图片的宽高进行 模版的自动调整。
        if ( (imageDetail.width > imageDetail.height && !rotated)
          || (imageDetail.height > imageDetail.width && rotated)
        ) {
          var _this = this;
          setTimeout(function(){
            _this.sharedStore.isSwitchLoadingShow = true;
            currentProject.rotated=!currentProject.rotated;
            _this.$dispatch("dispatchRotate");
            _this.$dispatch("dispatchRotateTemplate");
          })
        } else {
            var defaultCrops = UtilCrop.getDefaultCrop(currentCanvas.params[idx].imageWidth, currentCanvas.params[idx].imageHeight, currentCanvas.params[idx].width, currentCanvas.params[idx].height);

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

            currentCanvas.params[idx].url = '/imgservice/op/crop?' + qs;
            currentCanvas.params[idx].isRefresh = true;

            currentCanvas.params[idx].sourceImageUrl = sourceImageUrl;
        }

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
        CanvasController.autoLayout();
      };
    },

    removeImage: function(idx) {
      ImageController.deleteImage(idx,true);

      ImageListManage.freshImageUsedCount();
      this.freshImageList();
    },

    removeText: function(idx) {
      TextController.deleteText(idx);
    },

    refreshCanvas: function() {
      this.$broadcast('notifyRefreshBackground');
      // Store.vm.$broadcast('notifyRefreshBackground');


      this.clearCanvas();
      this.freshImageList();
      this.initCanvas();
    }
  },
  events: {
    // 旋转后重刷参��?+ 重绘
    notifyRotate: function() {
      CanvasController.fixRotatePhotoElement();
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
    notifyApplyTemplate:function(xml){
      this.clearCanvas();
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      currentCanvas.params=CanvasController.getTemplateParams(xml);
      this.initCanvas();
    }
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

    _this.$watch('sharedStore.watches.isProjectComplete', function() {
      if(_this.sharedStore.watches.isProjectComplete) {
       var Prj = _this.sharedStore.projectSettings[_this.sharedStore.currentSelectProjectIndex];
          if(Prj.category==="categoryCanvas"){
              _this.isCategoryCanvas = true;
          }else{
              _this.isCategoryCanvas = false;
          };
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
