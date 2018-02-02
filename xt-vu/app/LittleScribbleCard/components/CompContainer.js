
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
  template: '<div class="flip-container" v-bind:style="topStyle" @mouseenter="toogleDeleteIcon(true)" @mouseleave="toogleDeleteIcon(false)" style="position:relative;vertical-align:middle;">'+
                '<span v-if="sharedStore.isPreview" class="preview-blockName font-normal" >{{previewBlockIndex}} / {{totalPageNum}}</span>'+
                '<span v-if="!main" class="blockName font-light" v-bind:class="{active: idx == sharedStore.selectedPageIdx}">Card {{showIndex}}</span>'+
                '<div v-if="main &&　sharedStore.isSwitchLoadingShow && !sharedStore.isPageLoadingShow" style="width: 98px;height: 98px;background: #fff;border: 1px solid #7b7b7b;border-radius: 12px;position: absolute;top: 50%;left: 50%;margin: -42.5px 0 0 -42.5px;z-index: 9999;text-align: center;">'+
                    '<img src="assets/img/Loading.gif" width="50px" height="50px" title="Switching" alt="Switching" style="margin-top:15px;">' +
                    '<span class="font-light" style="position: relative;top: -8px;color: #7d7d7d;font-size: 12px;">Loading...</span>'+
                '</div>'+
                '<div class="flipper" v-bind:style="flipperStyle">'+
                    '<div v-show="!main || isFrontPageShow" id="box-canvasbg{{idx}}{{main ? \'Main\' : \'\'}}" v-bind:style="frontPageStyle" style="position: absolute;overflow: hidden;z-index:2;">' +
                      // '<img v-show="!main && isShowDeleteIcon && !sharedStore.isPreview && !sharedStore.isRemark && privateStore.hoverShowDeleteIcon && !sharedStore.checkFailed" @click="handleDeleteProject" src="assets/img/delete.svg" style="position:absolute;width:18px;height:18px;top:0;right:0;cursor:pointer;z-index:9999;" />'+
                      // '<img v-bind:src="bgPath" draggable="false" alt="Background image is missing :(" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;" />' +
                      '<div style="position: relative;width: 100%; height: 100%; overflow: hidden;">' +
                        '<div class="bed-operation" id="container{{idx}}{{main ? \'Main\' : \'\'}}" v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\', cursor: !sharedStore.isPreview ? \'pointer\' : \'default\' }" style="position: relative; overflow: hidden;background: #fff;">' +
                          '<bar-panel v-show="!sharedStore.isPreview && isShowHandle && main"></bar-panel>'+
                          '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:main="main" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
                        '</div>' +
                      '</div>' +
                      '<bg-layer v-show="!sharedStore.isCanvas" v-bind:idx="idx" v-bind:ratio="privateStore.ratio" v-bind:main="main" v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
                      // '<screenshot-element  v-show="sharedStore.isCanvas" v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></screenshot-element>' +
                      '<mirror-element v-show="sharedStore.isCanvas"></mirror-element>' +
                    '</div>'+
                    '<div v-bind:style="backPageStyle" style="position: absolute;overflow: hidden;background-size:100% 100%;transform: rotateY(180deg);z-index:1;">'+
                      '<img v-if="privateStore.isShowBackLogo && main" src="assets/img/back-logo.svg" v-bind:style="backLogoStyle">'+
                    '</div>'+
                    '<div class="flip-remark" v-if="!main && sharedStore.isRemark">' +
                      '<input type="checkbox" v-el:remark-input @click="onToggleRemark">' +
                    '</div>' +
                '</div>'+
            '</div>',
  props: ['main', 'idx'],
  data: function() {
    return {
      privateStore: {
        ratio: 1,
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
        oriLogoImage: {
          width: 86,
          height: 32,
          bottom: 82
        },
        isShowBackLogo: false,
        hoverShowDeleteIcon: false
			},
      idx: 0,
			sharedStore: Store,
      isFrontPageShow: true,
      isCategoryCanvas : false,
      containerRotateAngel: Store.isFrontPage ? 0 : -180
    };
  },
  computed: {
    backLogoStyle: function() {
      var oriLogoImage = this.privateStore.oriLogoImage;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var width = oriLogoImage.width * currentCanvas.foreground.ratioX * this.privateStore.ratio;
      var height = oriLogoImage.height * currentCanvas.foreground.ratioY * this.privateStore.ratio;
      var bottom = oriLogoImage.bottom * currentCanvas.foreground.ratioY * this.privateStore.ratio;
      var left = this.privateStore.operationWidth / 2 - width / 2;

      return {
        width: width + 'px',
        height: height + 'px',
        bottom: bottom + 'px',
        position: 'absolute',
        left: left + 'px',
        margin: '0 auto'
      }
    },
    containerRotateAngel: function() {
      return this.sharedStore.isFrontPage || !this.main ? 0 : -180;
    },
    flipperStyle: function(){
      return {
         width: this.privateStore.operationWidth + (this.main ? 2 * this.operationPaddingRight : 0) + 'px',
         height: this.privateStore.operationHeight + 'px',
         transform: 'rotateY('+ this.containerRotateAngel + 'deg)',
         opacity: this.opacity,
         top: this.main ? 0 : (84 - this.privateStore.operationHeight) / 2 + 'px'
      }
    },
    backfaceVisibility: function() {
      var nAgt = navigator.userAgent;
      var isIE = (nAgt.indexOf('MSIE') != -1) || (nAgt.indexOf('Trident/') != -1);
      if (isIE) {
        return undefined;
      }
      return 'hidden';
    },
    frontPageStyle: function(){
      return {
         width: this.privateStore.operationWidth + 'px',
         height: this.privateStore.operationHeight + 'px',
         margin: this.main ? (this.operationMarginTop + 'px ' + this.privateStore.operationPaddingRight + 'px 0 ' + this.operationMarginLeft  + 'px') : 0,
         opacity: this.opacity,
         backfaceVisibility: this.backfaceVisibility
      }
    },
    backPageStyle: function() {
      var nAgt = navigator.userAgent;
      var isIE = (nAgt.indexOf('MSIE') != -1) || (nAgt.indexOf('Trident/') != -1);
      return {
        width: this.privateStore.operationWidth + 'px',
        height: this.privateStore.operationHeight + 'px',
        margin: this.main ? (this.operationMarginTop + 'px ' + this.privateStore.operationPaddingRight + 'px 0 ' + this.operationMarginLeft  + 'px') : 0,
        opacity: this.opacity,
        backgroundImage: this.backPageUrl ? 'url(' + this.backPageUrl + ')' : undefined,
        backfaceVisibility: isIE ? undefined : 'hidden'
      }
    },

    operationMarginTop: function() {

			return this.privateStore.operationPaddingTop;
		},

		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft;
		},

    backPageUrl: function() {
      if (this.sharedStore.watches.isProjectLoaded) {
        var type = 'foreground',
            SpecManage = require("SpecManage"),
            currentProject = Store.projectSettings[Store.currentSelectProjectIndex],
            keyPatterns = SpecManage.getVariableKeyPatternById(type).split("-"),
            cur = keyPatterns.indexOf("size"),
            size = currentProject['size'].toLowerCase(),
            rotated = currentProject.rotated,
            path = 'assets/img/types/';
        keyPatterns.splice(cur,1);
        for(var i=0;i<keyPatterns.length;i++){
          var value = currentProject[keyPatterns[i]];
          if(value && value.toLowerCase()!=="none"){
            path += value + "/";
          }
        }
        if(rotated){
          size = size.split("x")[1]+"x"+size.split("x")[0];
        }
        return path + size + '/' + size + '_back.png?version=21'
      }
    },

    opacity : function(){
        if(this.main && this.sharedStore.isSwitchLoadingShow){
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
                display: this.main ? 'block' : 'inline-block',
                margin: this.main ? '' : '0 8px',
                width: this.privateStore.operationWidth + (this.main ? (this.operationMarginLeft + this.privateStore.operationPaddingRight) : 0) + 'px',
                height: this.privateStore.operationHeight + 'px',
            }
        }else if(this.sharedStore.isRemark) {
          return{
              display: this.main ? 'block' : 'inline-block',
              margin: this.main ? '66px 0 0 0' : '0 8px',
              width: this.privateStore.operationWidth + (this.main ? 2 * this.operationMarginLeft : 0) + 'px',
              height: this.privateStore.operationHeight + 'px'
          }
        }else{
            return{
                display: this.main ? 'block' : 'inline-block',
                margin: this.main ? '' : '0 8px',
                width: this.privateStore.operationWidth + (this.main ? (this.operationMarginLeft + this.privateStore.operationPaddingRight) : 0) + 'px',
                height: this.main ? this.privateStore.operationHeight + 'px' : '84px'
                // paddingTop: this.main ? '' :  (84 - this.operationHeight) + 'px 0 0 0'
                // paddingTop: '30px'
            }
        }
    },
    isShowDeleteIcon: function(){
        var visiablePageNum = 0;
        this.sharedStore.pages.forEach(function(item){
           if(!item.isDeleted){visiablePageNum++};
        });
        return visiablePageNum > 1;
    },
    previewBlockIndex: function(){
      var blockIndex = 0;
      for(var i=0; i <= this.sharedStore.selectedPageIdx; i++){
        if(!this.sharedStore.pages[i].isDeleted){
          blockIndex++;
        }
      }
      return blockIndex;
    },
    totalPageNum: function(){
      var pageNum = 0;
      this.sharedStore.pages.forEach(function(item){
        if(!item.isDeleted){
           pageNum++;
        }
      });
      return pageNum;
    }
	},
  methods: {
    setId : function(idx, main, showIndex){
      this.idx = idx;
      this.main = main;
      this.showIndex = showIndex;
    },
    initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[this.idx].canvas;

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

      // $('.bed-operation').css('width', currentCanvas.width).css('height', currentCanvas.height);
      $('#container' + this.idx +  (this.main ? 'Main' : '')).css('width', currentCanvas.oriWidth*this.privateStore.ratio).css('height', currentCanvas.oriHeight*this.privateStore.ratio);
      var extraName = this.main ? 'Main' : '';

			for(var i = 0; i < currentCanvas.params.length; i++) {
			  // init element
        CanvasController.createElement(i,this.idx,this.privateStore.ratio, extraName);
			};
      // select the front element
      currentCanvas.selectedIdx = ParamsManage.getFrontElementIndex();

			ImageListManage.freshImageUsedCount();

			// CanvasController.freshElementDepth();

			// CanvasController.hideSpineLines();
		},

    clearCanvas: function(pageIdx) {
      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var currentCanvas = Store.pages[useIndex].canvas;

      for(var i = currentCanvas.params.length - 1; i >= 0; i--) {
        var elementId = currentCanvas.params[i].id;
        CanvasController.deleteElement(i, elementId,useIndex);
      };
    },
    clearCenterElement: function(){
      for (var j = 0; j < Store.pages.length; j++) {
          var canvas = Store.pages[j].canvas;
          for (var i = 0; i < canvas.centerElements.length; i++) {
                  canvas.centerElements[i].$destroy(true);
                  canvas.centerElements.splice(i, 1);
          }
      }
    },

    initWindow: function() {
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[this.idx].canvas;

      // get the canvas size params
      if(store.isPreview) {
        var boxLimit = UtilWindow.getBoxWH(0,150);
      }
      else {
        var usedHeight = this.sharedStore.LSCPageNum === 1 ? 135 : 270;
        var boxLimit = UtilWindow.getBoxWH(280,usedHeight);
      };

      if(!this.main){
        boxLimit.width = 100;
        boxLimit.height = 84;
      }
      // console.log("cur",currentCanvas)
      if(boxLimit.width > 0 && boxLimit.height > 0) {
        var objWidth = currentCanvas.oriBgWidth;
        var objHeight = currentCanvas.oriBgHeight;
        var expendLeft = 0;
        var expendTop = 0;
        var wX = boxLimit.width / objWidth,
            hX = boxLimit.height / objHeight;
        if(wX > hX) {
          // resize by height
          this.privateStore.ratio = hX;
          if(!this.main) {
            currentCanvas.ratio = hX;
            currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
            currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
            currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
            currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
            currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
            currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;
          }

          // when resize by height, the canvas view width is smaller than boxLimit.width, we should make it align center anyway
          // _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.oriBgWidth * this.privateStore.ratio) / 2;
          //  为了让上传 云朵居中做的处理。
          _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.oriWidth * this.privateStore.ratio) / 2 - (currentCanvas.oriX * this.privateStore.ratio);
          _this.privateStore.operationPaddingRight = (boxLimit.width) / 2 - ((currentCanvas.oriBgWidth - currentCanvas.oriWidth /2 - currentCanvas.oriX) * this.privateStore.ratio);
        }
        else {
          // resize by width
          this.privateStore.ratio = wX;
          if(!this.main) {
            currentCanvas.ratio = wX;
            currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
            currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
            currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
            currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
            currentCanvas.bgWidth = currentCanvas.oriBgWidth * currentCanvas.ratio;
            currentCanvas.bgHeight = currentCanvas.oriBgHeight * currentCanvas.ratio;
          }

          _this.privateStore.operationPaddingLeft = 0 + expendLeft * this.privateStore.ratio;
        };

        _this.privateStore.operationPaddingTop = 0 + expendTop * this.privateStore.ratio;
        _this.privateStore.operationWidth = currentCanvas.oriBgWidth * this.privateStore.ratio;
        _this.privateStore.operationHeight = currentCanvas.oriBgHeight * this.privateStore.ratio;
        _this.privateStore.canvasTop = currentCanvas.oriY * this.privateStore.ratio;
        _this.privateStore.canvasLeft = currentCanvas.oriX * this.privateStore.ratio;

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

        var imageDetail = ImageListManage.getImageDetail(imageId);

        currentCanvas.params[idx].imageId = imageId;
        currentCanvas.params[idx].imageRotate = imageDetail ? imageDetail.orientation : 0;

        var isRotatedImage = Math.abs(currentCanvas.params[idx].imageRotate) / 90 % 2 === 1;

        if(imageDetail) {
          currentCanvas.params[idx].imageGuid = imageDetail.guid;
          currentCanvas.params[idx].imageWidth = imageDetail.width;
          currentCanvas.params[idx].imageHeight = imageDetail.height;
        }

        if(isRotatedImage) {
          // special rorate
          var cWidth = currentCanvas.params[idx].imageHeight,
              cHeight = currentCanvas.params[idx].imageWidth;
        }
        else {
          var cWidth = currentCanvas.params[idx].imageWidth,
              cHeight = currentCanvas.params[idx].imageHeight;
        };

        var currentProject = Store.projectSettings[Store.selectedPageIdx];
        var orientation = currentProject.orientation;
        // 根据图片的宽高进行 模版的自动调整。
        if ( (cWidth > cHeight && orientation === 'Portrait')
          || (cHeight > cWidth && orientation === 'Landscape')
        ) {
          var _this = this;
          setTimeout(function(){
            _this.sharedStore.isSwitchLoadingShow = true;
            currentProject.rotated=!currentProject.rotated;
            currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";
            _this.$dispatch("dispatchRotate");
            // _this.sharedStore.vm.$broadcast('notifyRefreshItems');
            _this.sharedStore.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
            _this.$dispatch("dispatchRotateTemplate");
          })
        } else {

            var defaultCrops = UtilCrop.getDefaultCrop(cWidth, cHeight, currentCanvas.params[idx].width, currentCanvas.params[idx].height);
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


      this.clearCanvas(this.idx);
      this.freshImageList();
      this.initCanvas();
    },

    // 解决FireFox未彻底清除canvas问题
    refreshCanvasWithDelay: function() {
      var _this = this;

      setTimeout(function() {
        _this.$broadcast('notifyRefreshBackground');

        // _this.clearCanvas();
        _this.clearCenterElement();
        _this.freshImageList();
        _this.initCanvas();
      }, 2000);
    },
    handleDeleteProject: function(){
      var currentCanvas = this.sharedStore.pages[this.idx].canvas;
      var hasImage = currentCanvas.params.some(function(element){
          return (element.elType==='image' && element.imageId);
      });
      if(hasImage) {
          this.sharedStore.vm.$dispatch("dispatchShowPopup", { type : 'deleteProject', status : 0, pageIdx: this.idx});
      } else {
          this.sharedStore.vm.$broadcast('notifyDeleteProject', this.idx);
      }
      require('trackerService')({ev: require('trackerConfig')['RemoveBlock'], hasImage: hasImage});
    },
    handleRepaint: function(){
        this.clearCanvas(this.idx);
        this.freshImageList();
        this.initCanvas();
    },
    onToggleRemark: function(event) {
      Store.projectSettings[this.idx].quantity = Store.projectSettings[this.idx].quantity === 1 ? 0 : 1;
      this.$els.remarkInput.checked = Store.projectSettings[this.idx].quantity === 1;
    },
    toogleDeleteIcon: function(isShow){
        this.privateStore.hoverShowDeleteIcon = isShow;
    }
  },
  events: {
    // 旋转后重刷参��?+ 重绘
    notifyRotate: function() {
      CanvasController.fixRotatePhotoElement();
      CanvasController.freshPageData();

      this.clearCenterElement();
      this.initCanvas();
      // this.freshImageList();
      // this.refreshCanvasWithDelay();
    },

    notifyRepaintProject: function() {
      if(!this.main)return;
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
	    		// CanvasController.syncProjectData(oldIdx);
    		};
    	};

    	// if(Store.pages.length > 0 && Store.pages[Store.selectedPageIdx].canvas.paper) {
    	// 	Store.pages[Store.selectedPageIdx].canvas.paper.remove();
    	// };
      this.clearCanvas();

    	// CanvasController.loadProjectIntoPages();

    	this.freshImageList();
      this.initCanvas();
    },

    notifyRepaintCenterContainer: function(){
      if(!this.main)return;
      this.clearCenterElement();
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
      // this.clearCanvas();
      this.clearCenterElement();
      var currentCanvas = Store.pages[this.idx].canvas;
      currentCanvas.params=CanvasController.getTemplateParams(xml);
      // this.sharedStore.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
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

          if(Prj.product==="LSC"){
              _this.privateStore.isShowBackLogo = true;
          }
      };
    });

    _this.$watch('sharedStore.isReprintAll', function() {
      if(!_this.main) {
        Store.projectSettings[_this.idx].quantity = Store.isReprintAll ? 1 : 0;
        _this.$els.remarkInput.checked = Store.isReprintAll;
      }
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

    _this.$watch('sharedStore.isFrontPage', function() {
      if(_this.sharedStore.isFrontPage) {
        _this.isFrontPageShow = true;
      } else {
        setTimeout(function(){
          _this.isFrontPageShow = false;
        }, 150);
      }
    });

    if(this.main){
      _this.$watch('idx', function() {
        if(this.sharedStore.watches.isProjectLoaded){
            // _this.sharedStore.isFrontPage = true;
            _this.sharedStore.isSwitchLoadingShow = true;
            _this.clearCenterElement();
            _this.freshImageList();
            _this.initCanvas();
        }
      });
    }

  }
};
