
var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
// var ProjectManage = require('ProjectManage');
// var SpecController = require('SpecController');
var CanvasController = require('CanvasController');
var ImageController = require('ImageController');
var TextController = require('TextController');
// var WarnController = require("WarnController");

// component -- container

module.exports = {

  template:
        '<div style="position: relative;">'+

            '<div v-show="sharedStore.isSwitchLoadingShow" style="width: 98px;height: 98px;background: #fff;border: 1px solid #7b7b7b;border-radius: 12px;position: absolute;top: 48%;left: 50%;margin: -42.5px 0 0 -42.5px;z-index: 9999;text-align: center;">'+
                '<img src="assets/img/Loading.gif" width="50px" height="50px" title="Switching" alt="Switching" style="margin-top:15px;">' +
                '<span class="font-light" style="position: relative;top: -8px;color: #7d7d7d;font-size: 12px;">Loading...</span>'+
            '</div>'+
            '<div v-bind:style="{opacity:opacity}">'+
            '<div id="box-canvasbg" v-bind:style="usedStyle" style="position: relative;">' +
              '<bg-layer v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
              '<div class="bed-operation" id="container"  v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\' }" style="position: absolute; overflow: hidden;background: #fff;">' +
                '<bar-panel v-show="!sharedStore.isPreview && isShowHandle"></bar-panel>'+
                '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
              '</div>' +
              '<screenshot></screenshot>' +
            '</div>'+
            '</div>'+
          '</div>',
  data: function() {
    return {
      privateStore: {
				operationWidth: 0,
				operationHeight: 0,
				operationPaddingTop: 0,
				operationPaddingLeft: 0,
        previewWidth: 0,
        previewHeight: 0,
				canvasTop: 0,
				canvasLeft: 0,
        handleId: 'bg',
        isShowHandle: true,
        isCornerHandles: false,
        isSideHandles: false,
			},
			sharedStore: Store
    };
  },
  computed: {
    operationMarginTop: function() {
			return this.privateStore.operationPaddingTop;
		},

		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft + 30;  // add the kept space
		},
   opacity : function(){
      if(this.sharedStore.isSwitchLoadingShow){
        return "0";
      }else{
        return "1";
      }
    },
    windowZindex: function() {
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                  elementTotal = currentCanvas.params.length || 0;

          return (elementTotal + 10) * 80;
    },

    isShowHandle:function(){
           var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
           if(!Store.isLostFocus){
              return true;
           }else{
              return false;
           }
    },

    usedStyle : function(){
      if(this.sharedStore.isPreview){
        return {
          border : '1px solid #f1f1f1',
          width: this.privateStore.previewWidth + 'px',
          height: this.privateStore.previewHeight + 'px',
          margin: this.operationMarginTop + 'px ' + this.operationMarginLeft+ 'px',
          boxShadow : '10px 10px 20px rgba(214,214,214,0.3),-10px 10px 20px rgba(214,214,214,0.3)',
          overflow: 'hidden'
        };
      }else{
        return {
          border: '1px solid #d6d6d6',
          width: this.privateStore.operationWidth + 'px',
          height: this.privateStore.operationHeight + 'px',
          margin: this.operationMarginTop + 'px ' + this.operationMarginLeft+ 'px',
          boxShadow: '0 5px 20px 3px rgba(214,214,214, .9)'
        };
      }
    }

	},
  methods: {
    initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[store.selectedPageIdx].canvas;

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
        var boxLimit = UtilWindow.getPreviewBoxLimit(true);
      }
      else {
        var boxLimit = UtilWindow.getBoxLimit(430);
      };

      if(boxLimit.width > 0 && boxLimit.height > 0) {
        if(currentCanvas.expendSize.top) {
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
          _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.width) / 2;
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
        if(store.isPreview) {
          currentCanvas.width=currentCanvas.width-(currentCanvas.realBleedings.right ) * currentCanvas.ratio;
          currentCanvas.height=currentCanvas.height-(currentCanvas.realBleedings.bottom ) * currentCanvas.ratio;
          _this.privateStore.previewWidth = currentCanvas.bgWidth - (currentCanvas.realBleedings.right +currentCanvas.realBleedings.left) * currentCanvas.ratio;
          _this.privateStore.previewHeight = currentCanvas.bgHeight - (currentCanvas.realBleedings.bottom + currentCanvas.realBleedings.top) * currentCanvas.ratio;

          //预览时图片的位置
          _this.privateStore.canvasTop = currentCanvas.y - currentCanvas.realBleedings.top * currentCanvas.ratio;
          _this.privateStore.canvasLeft = currentCanvas.x - currentCanvas.realBleedings.left * currentCanvas.ratio;
        }
        else {
          _this.privateStore.canvasTop = currentCanvas.y;
          _this.privateStore.canvasLeft = currentCanvas.x;
        };

        //fix tmpl width
        $("#tmpl").css("width",window.innerWidth-341-20);
        //init image list height
        //UtilWindow.initImageListSize({selector:'#list-image'});
        //reheight dashboard
        //$(".dashboard").css("height",window.innerHeight-51);
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

        var imageDetail = ImageListManage.getImageDetail(imageId);

        currentCanvas.params[idx].imageId = imageId;
        currentCanvas.params[idx].imageRotate = imageDetail ? imageDetail.orientation : 0;

        var isRotatedImage = Math.abs(currentCanvas.params[idx].imageRotate) / 90 % 2 === 1;

        if(imageDetail) {
          currentCanvas.params[idx].imageGuid = imageDetail.guid;
          currentCanvas.params[idx].imageWidth = imageDetail.width;
          currentCanvas.params[idx].imageHeight = imageDetail.height;
        };

        if(isRotatedImage) {
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

        currentCanvas.params[idx].url = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
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

        if(newAdded){
          CanvasController.autoLayout();
        }

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
      // 获取 photoElement 元素的数组长度，供删除图片做判断。
      var imageArr = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.params.filter(function(item){
          return item.elType === "image";
      })
      /* 当autoLayout 为 true 且 photoElement 的数量大于 1 的时候，点击remove 的时候同时删除模版和图片。
      否则仅仅删除 图片。  */
      // ImageController.deleteImage(idx,!(this.sharedStore.autoLayout && imageArr.length > 1));
      ImageController.deleteImage(idx,imageArr.length < 2);
      if(this.sharedStore.autoLayout && imageArr.length > 1){
          this.sharedStore.isSwitchLoadingShow = true;
      }

      ImageListManage.freshImageUsedCount();
      this.freshImageList();
      imageArr = null;
    },

    removeText: function(idx) {
      TextController.deleteText(idx);
    },

    refreshCanvas: function() {
      this.$broadcast('notifyRefreshBackground');

      this.clearCanvas();
      this.freshImageList();
      this.initCanvas();
    }
  },
  events: {
    // 旋转后重刷参数 + 重绘
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
