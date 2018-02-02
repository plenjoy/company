var Vue = require('vuejs');
var CompOption = Vue.extend(require('../components/CompOption.js'));
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
  template:  // '<div id="box-canvasbg" v-show="showCurrentContainer" v-bind:style="{width: width + \'px\',height : height + \'px\'}" style="float: left;border: 1px solid #d9d9d9;margin: 0 10px 20px">' +
              //-------变动--------
              '<div id="box-canvasbg{{idx}}" v-show="showCurrentContainer" v-on:mouseenter="onMouseEnter" v-on:mouseleave="onMouseLeave"  v-bind:style="usedStyle"  style="float: left;">' +

              // '<img v-bind:src="bgPath" draggable="false" alt="Background image is missing :(" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;" />' +
              // '<div v-bind:style="{width: width + \'px\',height : width + \'px\'}" style="position: relative;overflow: hidden;display: table-cell;vertical-align: middle;background: #e4e4e4;border: 1px solid #d6d6d6">' +
              //-------变动------
              '<div v-bind:style="usedStyle2" style="position: relative;box-sizing:border-box;display: table-cell;vertical-align: bottom;">' +
                '<div class="bed-operation" id="container{{idx}}" v-bind:style="bedOperationUsedStyle" style="position: relative; background: #fff;margin: 0 auto;">' +
                  '<handle v-if="!sharedStore.isPreview" v-bind:id="privateStore.handleId" v-bind:is-Show-Handles="privateStore.isShowHandle" v-bind:is-Corner-Handles="privateStore.isCornerHandles" v-bind:is-Side-Handles="privateStore.isSideHandles" />'+
                '</div>' +
              '</div>' +
              '<div v-if="sharedStore.isPreview" class="font-medium" style="position: relative;margin: 0 auto;top: 12px;color: #7B7B7B;text-align:left;font-size:12px;left:{{Math.floor(privateStore.canvasLeft)}}px;width:{{Math.floor(optionLabelWidth)}}px">{{optionLabel}}</div>'+
              '<option-element v-bind:id="idx" v-bind:opacity="opacity" style="box-sizing:border-box; width:290px;"></option-element>' +
              // '<bg-layer v-show="!sharedStore.isCanvas" v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
              // '<mirror-element v-show="sharedStore.isCanvas"></mirror-element>' +
            '</div>',
  props : ['item'],
  data: function() {
    return {
      privateStore: {
				operationWidth: 0,
				operationHeight: 0,
				operationPaddingTop: 0,
				operationPaddingLeft: 0,
				canvasTop: 0,
				canvasRadius: 0,
				canvasLeft: 0,
        handleId: 'bg',
        isShowHandle: true,
        isCornerHandles: false,
        isSideHandles: false,
        boxLimit : {width:0,height:0}
			},
      idx : 0,
			sharedStore: Store,
      opacity: Store.isHoverShowOption ? 0 : 100
    };
  },
  computed: {
    optionLabelWidth: function(){
      currentCanvas = this.sharedStore.pages[this.idx].canvas;
      return currentCanvas.width;
    },
    optionLabel: function(){
      var currentSetting = this.sharedStore.projectSettings[this.idx];
      var printString = (currentSetting.quantity>1)?"Prints":"Print";
      var allPaper = require("SpecManage").getOptions('paper');
      
      var paperTitle = allPaper.filter(function(item){
        return item.id === currentSetting.paper;
      })[0].title;
      return currentSetting.size.toLowerCase()+" | "+paperTitle+" | "+currentSetting.quantity+" "+printString;
    },
    operationMarginTop: function() {
			return this.privateStore.operationPaddingTop;
		},
		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft;
		},
    isShowHandle:function(){
         var currentCanvas = Store.pages[this.idx].canvas;
         if(!Store.isLostFocus){
            return true;
         }else{
            return false;
         }
    },
    width : function(){
      return this.sharedStore.boxLimit.width;
    },
    height : function(){
      if(this.sharedStore.isPreview){
        return  this.sharedStore.boxLimit.height;
      }else{
        var optionHeight = this.sharedStore.isProjectSettingSelectShow ? 115 : 10;
        if(this.sharedStore.isRemark){
            return this.sharedStore.boxLimit.height +  optionHeight;
        }else{
          return this.sharedStore.boxLimit.height + optionHeight;
        }
      };
    },
    usedStyle : function(){
        if(Store.isPreview){
          return {
            width: this.width + 20 + 'px',
            height : this.height + 20 + 'px',
            margin: "0 0 50px 15px"
          };
        }else{
          return {
             width: this.sharedStore.limitWidth ? this.width + 'px' : (this.width + 20) + 'px',
             height : this.height + 'px',
             margin: this.sharedStore.limitWidth ? "0 0 50px 15px" : "0 20px 50px"
           }
        }
    },
    usedStyle2 : function(){
      if(Store.isPreview){
        return {
          width: this.width + 20 + 'px',
          height : this.width + 'px'
        }
      }else{
        return {
          width: this.sharedStore.limitWidth ? this.width + 'px' : (this.width + 20) + 'px',
          height : this.width + 'px'
        }
      }
    },
    bedOperationUsedStyle: function() {
      return {
        top: this.privateStore.canvasTop + 'px',
        left: this.privateStore.canvasLeft + 'px',
        cursor: !this.sharedStore.isPreview ? 'pointer' : 'default',
        borderRadius: this.privateStore.canvasRadius + 'px',
        boxShadow: this.sharedStore.isThickShadow ? '3px 2px 1px rgba(0,0,0,0.8)' : 'rgb(224, 224, 224) 0px 3px 26px 4px',
        zIndex: Math.ceil(Math.random() * 100)
      };
    },
    /*showCurrentContainer : function() {
      // console.log(this.sharedStore.selectedSize);
      // debugger;
       if(this.sharedStore.selectedSize =='0'||this.sharedStore.selectedSize == ''){
          if(this.sharedStore.selectedPaper){
            return this.sharedStore.projectSettings[this.idx].paper === this.sharedStore.selectedPaper
          }
      }else{
        if(this.sharedStore.selectedPaper && this.sharedStore.selectedPaper.toLowerCase!=="none"){
            return this.sharedStore.projectSettings[this.idx].paper === this.sharedStore.selectedPaper && this.sharedStore.projectSettings[this.idx].size === this.sharedStore.selectedSize;
        }else{
          return this.sharedStore.projectSettings[this.idx].size === this.sharedStore.selectedSize;
        }
      }
      return true;

    },*/
    showCurrentContainer : function() {

      if(Store.isPreview || Store.isRemark){
        //if(Store.isPreview){
          var bool=true;
          if(this.sharedStore.selectedSize =='0'){
            return true;
          }
          if(this.sharedStore.selectedSize  && this.sharedStore.selectedSize!="" && this.sharedStore.projectSettings[this.idx].size != this.sharedStore.selectedSize){
            bool=false;
          }
          if(this.sharedStore.selectedPaper && this.sharedStore.selectedPaper.toLowerCase!=="none" && this.sharedStore.projectSettings[this.idx].paper != this.sharedStore.selectedPaper){
            bool=false;
          }
          return bool;
        /*}else{
          return true;
        }*/

      }else{
        if(this.sharedStore.selectedSize =='0'){
          return true;
        }else{
          return this.sharedStore.projectSettings[this.idx].size === this.sharedStore.selectedSize;
        }

      }
    }
	},
  methods: {
    setId : function(idx){
      this.idx = idx;
    },
    onMouseEnter: function(){
      if(!this.sharedStore.isHoverShowOption)return;
      this.opacity = 100;
    },
    onMouseLeave: function(){
      if(!this.sharedStore.isHoverShowOption)return;
      this.opacity = 0;
    },
    initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.pages[this.idx].canvas;

			if(Store.pages.length > 1) {
				Store.isChangePageShow = true;
			};

			_this.initWindow();

      $('#container'+this.idx).css('width', Math.floor(currentCanvas.width)).css('height', Math.floor(currentCanvas.height));

			for(var i = 0; i < currentCanvas.params.length; i++) {
			  // init element
        CanvasController.createElement(i,this.idx);
			};
      // select the front element
      currentCanvas.selectedIdx = ParamsManage.getFrontElementIndex();
		},

    clearCanvas: function() {
      var currentCanvas = Store.pages[this.idx].canvas;

      for(var i = currentCanvas.params.length - 1; i >= 0; i--) {
        var elementId = currentCanvas.params[i].id;
        CanvasController.deleteElement(i, elementId);
      };
    },

    initWindow: function() {
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[this.idx].canvas;

      // get the canvas size params
      var boxLimit = this.sharedStore.boxLimit;
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
          var objWidth = currentCanvas.oriWidth;
          var objHeight = currentCanvas.oriHeight;
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
        }
        else {
          // resize by width
          currentCanvas.ratio = wX;
          currentCanvas.width = currentCanvas.oriWidth * currentCanvas.ratio;
          currentCanvas.height = currentCanvas.oriHeight * currentCanvas.ratio;
          currentCanvas.x = currentCanvas.oriX * currentCanvas.ratio;
          currentCanvas.y = currentCanvas.oriY * currentCanvas.ratio;
        };

        _this.privateStore.operationPaddingTop = 0;
        _this.privateStore.operationWidth = currentCanvas.width;
        _this.privateStore.operationHeight = currentCanvas.height;
        _this.privateStore.canvasTop = currentCanvas.y;
        _this.privateStore.canvasLeft = currentCanvas.x;
        _this.privateStore.canvasRadius = currentCanvas.cornerRadius * currentCanvas.ratio || 0;

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
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[this.idx].canvas;

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
          height: Math.round(height),
          rotation: currentCanvas.params[idx].imageRotate
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
        var currentCanvas = Store.pages[this.idx].canvas;
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

      // ImageListManage.freshImageUsedCount();
      this.freshImageList();
    },

    removeText: function(idx) {
      TextController.deleteText(idx);
    },

    refreshCanvas: function() {
      this.$broadcast('notifyRefreshBackground');

      this.clearCanvas();
      this.freshImageList();
      this.initCanvas();
    },
    // recoverDeletedPhoto : function(){

               // this.sharedStore.pages.splice(this.sharedStore.tempId,0, this.sharedStore.tempParams[0]);
               // this.sharedStore.pages.$set(this.sharedStore.tempId,this.sharedStore.tempParams[0]);
               // console.log(this.sharedStore.pages);
               // this.refreshCanvas();
               // this.freshItemIndexes();
              // this.sharedStore.projectSettings.splice(this.sharedStore.tempId,0,this.sharedStore.tempProjectSettings);
    // },

  },
  events: {
    // 旋转后重刷参数 + 重绘
    notifyRotate: function() {
      CanvasController.fixRotatePhotoElement();
      CanvasController.freshPageData();

      // this.freshImageList();
      this.refreshCanvas();
    },

    notifyResetIdx : function(pram){
      for(var i=0;i<pram.length;i++){
        if(this.idx === pram[i].oldIdx ){
          this.idx = pram[i].newIdx
        }
      }
    },

    notifyRepaintProject: function(idx) {
      if(idx===this.id){
        CanvasController.freshPageData();
        this.refreshCanvas();
      }
    },

    // notifyPaint: function() {
    //   CanvasController.loadProjectIntoPages();

    //   this.freshImageList();
    //   // this.clearCanvas();
    // 	this.initCanvas();
    // },

    // respond broadcast repaint
    notifyRepaint: function(oldIdx) {
    	if(oldIdx != undefined && oldIdx != null) {
    		// user select another project
    		if(!Store.isPreview) {
	    		CanvasController.syncProjectData(oldIdx);
    		};
    	};

    	// if(Store.pages.length > 0 && Store.pages[this.idx].canvas.paper) {
    	// 	Store.pages[this.idx].canvas.paper.remove();
    	// };
      this.clearCanvas();

    	CanvasController.loadProjectIntoPages();

    	this.freshImageList();
      this.initCanvas();
    },

    notifyRefreshCanvas: function(idx) {
      if(idx===this.idx){
        this.refreshCanvas();
      }
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
        var currentCanvas = Store.pages[this.idx].canvas;
        CanvasController.changeDepthValue({ idx: idx, targetDepth: currentCanvas.params.length - 1 });
      };
    },

    dispatchDrop: function(oParams) {
      this.addImage(oParams);
    },
    notifyApplyTemplate:function(xml){
      this.clearCanvas();
      var currentCanvas = Store.pages[this.idx].canvas;
      currentCanvas.params=CanvasController.getTemplateParams(xml);
      this.initCanvas();
    },
    // notifyRecoverDeletedPhoto : function(){
    //       console.log('recover----')
    //       this.recoverDeletedPhoto();
    //   },
  },
  components: {
    'option-element' : CompOption
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
          var currentCanvas = Store.pages[this.idx].canvas;
          CanvasController.changeDepthValue({ idx: idx, targetDepth: currentCanvas.params.length - 1 });
        };
			};
		});

    // _this.$watch('sharedStore.watches.isOnDrop', function() {
    //   if(_this.sharedStore.watches.isOnDrop) {
    //     _this.sharedStore.watches.isOnDrop = false;
    //     _this.handleOndrop(_this.sharedStore.dropData);
    //   };
    // });

    // _this.$watch('idx', function() {
    //   if(_this.idx) {
    //     _this.sharedStore.watches.isOnDrop = false;
    //     _this.handleOndrop(_this.sharedStore.dropData);
    //   };
    // });

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
