
var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var DecorationListManage = require('DecorationListManage');
var ParamsManage = require('ParamsManage');
// var ProjectManage = require('ProjectManage');
// var SpecController = require('SpecController');
var CanvasController = require('CanvasController');
var ImageController = require('ImageController');
var DecorationController = require('DecorationController');
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
              //CompBackground
              '<bg-layer v-bind:width="privateStore.operationWidth" v-bind:height="privateStore.operationHeight"></bg-layer>' +
              //edit Text Form
              '<div v-show="isEditTextFormShow && !sharedStore.isPreview && false" class="textForm" title="Double click here to edit details." ' + /*'@dblclick="handleDbClickTextFormRemind"' + */ ' v-bind:style="{top: textFormStyle.top + \'px\',left: textFormStyle.left+\'px\',zIndex:windowZindex}" style="cursor:pointer;position:absolute;height:26px;line-height:26px;width:261px;background-color:#fff;font-size:12px;color:#3a3a3a;box-shadow: 0 3px 6px rgba(0,0,0,.16)" data-html2canvas-ignore="true">'+
                 '<div class="edit-text start-gif"><img src="assets/img/Start-gif.gif" style="width:30px;height:16px;"/></div>'+
                 '<div class="remind-text" style="padding-left:6px;float:left;line-height:26px;position:relative;">'+
                     '<span>Double click here to edit details.</span>'+
                 '</div>'+
              '</div>'+
              //edit family name
              '<div v-show="isEditFamilyNameShow && !sharedStore.isPreview" class="familyName" title="Double click here to type your family name" v-bind:style="{top: familyNameStyle.top + \'px\',left: familyNameStyle.left+\'px\',zIndex:windowZindex}" style="position:absolute;height:26px;line-height:26px;width:350px;background-color:#fff;cursor:auto;font-size:12px;color:#3a3a3a;box-shadow: 0 3px 6px rgba(0,0,0,.16)" data-html2canvas-ignore="true">'+
                 '<div class="edit-text start-gif"><img src="assets/img/Start-gif.gif" style="width:30px;height:16px;"/></div>'+
                 '<div class="remind-text" style="padding-left:6px;float:left;line-height:26px;position:relative;">'+
                     '<span>Double click here to type your family name</span>'+
                     '<img v-on:click="handleCloseFamilyNameRemind()" style="width:8px;height:26px;margin-left:8px;position:absolute;cursor:pointer;" src="assets/img/close.svg" />'+
                 '</div>'+
              '</div>'+
              '<div class="bed-operation" id="container" ' + /*'@dblclick="handleDbClickTextFormRemind"' + */ ' v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\' }" style="position: absolute; overflow: hidden;background: #fff;">' +
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
      // return this.privateStore.operationPaddingLeft + 30;  // add the kept space
      return this.privateStore.operationPaddingLeft;
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
            elementTotal = currentCanvas.params.length || 0,
            zIndex = (elementTotal + 10) * 100 - 1;
        return zIndex;
    },
   // familyNameLeft: function(){
   //    var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
   //        currenElement = currentCanvas.params[this.privateStore.index];
   //    return (currentCanvas.oriX + currenElement.x + currenElement.width) * currentCanvas.ratio + 10;
   // },
   isEditTextFormShow: function() {
    if(!Store.isPortal){
      var isEditTextFormShow = false;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      currentCanvas.params.forEach(function(param){
        if(param.tagName && param.tagType && !param.isEdit && !param.isDisableRemind) {
          isEditTextFormShow = true;
        }
      });

      return isEditTextFormShow;
     }else{
      return false;
     }
   },
   textFormStyle: function() {
    var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
    var firstTextFormIdx = 0;
    for(var i = 0;i < currentCanvas.params.length;i++){
      if(currentCanvas.params[i].tagName && currentCanvas.params[i].tagType && !currentCanvas.params[i].isDisableRemind && !currentCanvas.params[i].isEdit){
        firstTextFormIdx = i;
        break;
      }
    }

    currenElement = currentCanvas.params[firstTextFormIdx];

    var top = (currentCanvas.oriY + currenElement.y + currenElement.height / 2) * currentCanvas.ratio - 13 ,
        left = (currentCanvas.oriX + currenElement.x + currenElement.width) * currentCanvas.ratio + 10;
        top = top > currentCanvas.height?currentCanvas.height :top;
        left = left > currentCanvas.width?currentCanvas.width + 40:left;

    return {
      top: top,
      left: left
    }
   },
   familyNameStyle: function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var firstFamilyTextIdx = 0;
          for(var i = 0;i < currentCanvas.params.length;i++){
            if(currentCanvas.params[i].isFamilyName == 'true'){
              firstFamilyTextIdx = i;
              break;
            }
          }
      currenElement = currentCanvas.params[firstFamilyTextIdx];
      var top = (currentCanvas.oriY + currenElement.y + currenElement.height / 2) * currentCanvas.ratio - 13 ,
          left = (currentCanvas.oriX + currenElement.x + currenElement.width) * currentCanvas.ratio + 10;
          top = top > currentCanvas.height?currentCanvas.height :top;
          left = left > currentCanvas.width?currentCanvas.width + 40:left;
      var textPosition = 400 + left + 330;
          if(textPosition > document.body.clientWidth || textPosition > document.documentElement.clientWidth){
            $(".familyName").css("width","").css("height","").css("line-height","");
            $(".remind-text").css("float","none");
          }else{
            $(".familyName").css("width","350px").css("height","26px").css("line-height","26px");
            $(".remind-text").css("float","left");
          }

      return {
        top: top,
        left: left
      }
   },
   isEditFamilyNameShow: function() {
     if(!Store.isPortal){
         var currentParams = Store.pages[Store.selectedPageIdx].canvas.params;
         var isShowFamilyName = currentParams.some(function(item){return item.isFamilyName === 'true'})
         return isShowFamilyName;
     }else{
        return false;
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

    usedStyle : function(){
      if(this.sharedStore.isPreview){
        return {
          // border : '1px solid #f1f1f1',
          width: Math.floor(this.privateStore.previewWidth) + 'px',
          height: Math.floor(this.privateStore.previewHeight) + 'px',
          margin: Math.floor(this.operationMarginTop) + 'px ' + Math.floor(this.operationMarginLeft) + 'px',
          // boxShadow : '10px 10px 20px rgba(214,214,214,0.3),-10px 10px 20px rgba(214,214,214,0.3)',
          overflow: 'hidden',
          marginRight: '0px'
        };
      }else{
        return {
          // border: '1px solid #d6d6d6',
          width: Math.floor(this.privateStore.operationWidth) + 'px',
          height: Math.floor(this.privateStore.operationHeight) + 'px',
          margin: Math.floor(this.operationMarginTop) + 'px ' + Math.floor(this.operationMarginLeft)+ 'px',
          marginRight: '0px'
          // boxShadow: '0 5px 20px 3px rgba(214,214,214, .9)'
        };
      }
    },

    isInnerPage: function() {
      return Store.selectedPageIdx === 2;
    },

  },
  methods: {
    initCanvas: function() {
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[store.selectedPageIdx].canvas;
          // _this.sharedStore.isEditFamilyNameShow = false;
          // for(var i = 0; i < currentCanvas.params.length;i++){
          //     if(currentCanvas.params[i].isFamilyName === "true"){
          //         _this.sharedStore.isEditFamilyNameShow = true;
          //     }
          // }
          // console.log( "aaaa",_this.sharedStore.isEditFamilyNameShow);
      if(Store.pages.length > 1) {
        Store.isChangePageShow = true;
        Store.isSwitchLoadingShow = true;
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
      DecorationListManage.freshDecorationUsedCount();

      //_this.getFamilyNameRemind();
      // CanvasController.freshElementDepth();

      // CanvasController.hideSpineLines();
    },

    getFamilyNameRemind: function(){
        //if(!Store.isPortal){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          var params = currentCanvas.params;
          for(var i = 0; i < params.length;i++){
              if(params[i].elType === "text" && params[i].isFamilyName.toString() === "true"){
                  this.sharedStore.isEditFamilyNameShow = true;
                  break;
              }
          }
        //}

    },
    clearCanvas: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      for(var i = currentCanvas.params.length - 1; i >= 0; i--) {
        CanvasController.deleteElement(i);
      };
    },

    initWindow: function() {
      var boxLimit,
          _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[store.selectedPageIdx].canvas;

      // get the canvas size params
      if(store.isPreview) {
        boxLimit = UtilWindow.getPreviewBoxLimit(true);
      }else if(store.cutLargePhoto){
        boxLimit = {height:1980,width:2000};
      }else {
        var layoutHeight = _this.isInnerPage || _this.sharedStore.isPortal ? 100 : 0;
        if(Store.isBlankCard) {
          layoutHeight = 0;
        }
        boxLimit = UtilWindow.getCardBoxLimit(280, layoutHeight);
      };
      boxLimit.height += 20;

      if (_this.sharedStore.isPortal) {
        boxLimit.height += 200;
      }

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
          _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.width) / 2 - currentCanvas.x;
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
          // _this.privateStore.previewWidth = currentCanvas.bgWidth - (currentCanvas.realBleedings.left + currentCanvas.realBleedings.right) * currentCanvas.ratio;
          // _this.privateStore.previewHeight = currentCanvas.bgHeight - (currentCanvas.realBleedings.top + currentCanvas.realBleedings.bottom) * currentCanvas.ratio;
          _this.privateStore.previewWidth = currentCanvas.bgWidth;
          _this.privateStore.previewHeight = currentCanvas.bgHeight;

          // _this.privateStore.canvasTop = currentCanvas.y - currentCanvas.realBleedings.top * currentCanvas.ratio;
          // _this.privateStore.canvasLeft = currentCanvas.x - currentCanvas.realBleedings.left * currentCanvas.ratio;
          _this.privateStore.canvasTop = currentCanvas.y;
          _this.privateStore.canvasLeft = currentCanvas.x;
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
          // console.log('Window size is too small!');
        }
        else {
          alert('Window size is too small!');
        };

      };
    },
    // changePage
    changePage: function(nPageNum) {
      nPageNum = parseInt(nPageNum) || 0;

      // 备注：Store.isPortal这个条件用在submit截图的情况下，所以不能去掉 2017/7/5
      if(nPageNum !== this.sharedStore.selectedPageIdx || Store.isPortal) {
        // change page
        // remove old paper
        this.clearCanvas();

        this.sharedStore.selectedPageIdx = nPageNum;

        this.initCanvas();
        this.$broadcast('notifyRefreshBackground');
      };
    },
    handleOndrop: function(obj) {
      // this.sharedStore.isShowProgress = true;
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
          //  sourceImageUrl = ev.dataTransfer.getData('sourceImageUrl'),
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
        //  url: '/imgservice/op/crop',
        //  type: 'get',
        //  data: 'imageId=' + imageId + '&px=' + px + '&py=' + py + '&pw=' + pw + '&ph=' + ph + '&width=' + Math.round(width) + '&height=' + Math.round(height)
        // }).done(function(result) {
        //  $('#element-0').attr('href', result);
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
        require('trackerService')({ev: require('trackerConfig')['DragPhotoToPage']});
        // _this.$dispatch('dispatchChangeWarn');

      };
    },
  handleDecorationOndrop: function(obj) {
      // this.sharedStore.isShowProgress = true;
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.pages[store.selectedPageIdx].canvas;

      // obj = { isBg: true/false }
      if(obj) {
        var newAdded = obj.newAdded,
            isBg = obj.isBg;

        var imageId = store.dragData.imageId,
            sourceImageUrl = store.dragData.sourceImageUrl,
            imageGuid = store.dragData.guid,
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
        var decorationDetail = DecorationListManage.getDecorationDetail(imageId);

        currentCanvas.params[idx].imageWidth = decorationDetail.width;
        currentCanvas.params[idx].imageHeight = decorationDetail.height;

        //request a high definition image
        currentCanvas.params[idx].url = Store.domains.baseUrl+'/artwork/png/1000/'+imageGuid+'.png';
        // console.log(currentCanvas.params[idx].url);
        currentCanvas.params[idx].isDecRefresh = true;

        currentCanvas.params[idx].sourceImageUrl = sourceImageUrl;

        DecorationListManage.freshDecorationUsedCount();
        _this.freshDecorationList();

      };
    },
    handleCloseFamilyNameRemind:function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            params = currentCanvas.params;
        for(var i=0,len=params.length;i<len;i++){
            if(params[i].isFamilyName.toString() === "true"){
                // this.sharedStore.isEditFamilyNameShow = false;
                params[i].isFamilyName = "false";
                break;
            }
        }
    },
    handleCloseTextFormRemind:function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          params = currentCanvas.params;

      for(var i=0,len=params.length;i<len;i++){
        if(params[i].tagName && params[i].tagType && !params[i].isDisableRemind){
            params[i].isDisableRemind = true;
        }
      }
    },
    handleDbClickTextFormRemind: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          params = currentCanvas.params, findedHightLightForm = false;

      if(!Store.isPortal) {
        for(var i=0,len=params.length;i<len;i++){
          // 找到第一个未编辑的TextForm
          if(params[i].tagName && params[i].tagType){
            if(!params[i].isEdit && !findedHightLightForm) {
              // 高亮TextForm
              this.$dispatch('dispatchHighLightTextForm', i);
              // 清空TextForm
              this.$dispatch('dispatchCleanTextFormPlaceholders');

              findedHightLightForm = true;
            }
            if(!params[i].isDisableRemind) {
              // 去掉气泡
              this.handleCloseTextFormRemind();
            }
          }
        }
      }
    },
    freshImageList: function() {
      this.$dispatch('dispatchImageList');
    },
    freshTextFormList: function() {
      this.$dispatch('dispatchTextFormList');
    },
    freshDecorationList: function(){
       this.$dispatch('dispatchDecorationList');
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
    addDecoration: function(oParams) {
      if(oParams && oParams.id != undefined && oParams.id != null) {
        oParams.x = oParams.x || 0;
        oParams.y = oParams.y || 0;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var defaultDecorationPositions = CanvasController.getDefaultNewDecElementPosition({ x: oParams.x, y: oParams.y });
        if(currentCanvas.params.length) {
          var newDecId = parseInt(currentCanvas.params[currentCanvas.params.length - 1].id) + 1
        }
        else {
          var newDecId = 0;
        };

        // create a new image element at first
        var newDecorationParams = {
          id: newDecId,
          elType: 'decoration',
          url: '',
          isDecRefresh: false,
          x: defaultDecorationPositions.x,
          y: defaultDecorationPositions.y,
          width: defaultDecorationPositions.width,
          height: defaultDecorationPositions.height,
          rotate: 0,
          dep: currentCanvas.params.length,
          imageId: '',
          guid: Store.dragData.decorationid,
          decorationid: Store.dragData.decorationid,
          decorationtype: Store.dragData.type,
        };

        DecorationController.createDecoration(newDecorationParams);

        // now push in the image automatically
        var obj = { newAdded: true, isBg: false };
        // Store.dropData.ev = obj.ev;
        Store.dropData.newAdded = obj.newAdded;
        Store.dropData.isBg = obj.isBg;
        Store.watches.isDecorationOnDrop = true;

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
      ImageController.deleteImage(idx,true);
      if(this.sharedStore.autoLayout && imageArr.length > 1){
          // this.sharedStore.isSwitchLoadingShow = true;
      }

      ImageListManage.freshImageUsedCount();
      this.freshImageList();
      imageArr = null;
    },
    removeDecoration: function(idx){
      // 获取 decolationElement 元素的数组长度，供删除装饰图片做判断。
      var decorationArr = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas.params.filter(function(item){
          return item.elType === "decoration";
      })

      DecorationController.deleteDecoration(idx,decorationArr.length < 2);

      DecorationListManage.freshDecorationUsedCount();
      this.freshDecorationList();
      decorationArr = null;
    },

    removeText: function(idx) {
      TextController.deleteText(idx);
    },

    refreshCanvas: function() {
      this.$broadcast('notifyRefreshBackground');

      this.clearCanvas();
      this.freshImageList();
      this.freshTextFormList();
      this.initCanvas();
    }
  },
  events: {

    notifyCleanTextFormRemind: function() {
      this.handleCloseTextFormRemind();
    },

    notifyChangePage: function(nPageNum) {
      this.changePage(nPageNum);
    },

    // 旋转后重刷参数 + 重绘
    notifyRotate: function() {
      CanvasController.fixRotatePhotoElement();
      CanvasController.freshPageData();

      // this.freshImageList();
      this.refreshCanvas();
    },

    notifyRepaintProject: function() {
      CanvasController.freshPageData();
      this.$broadcast('notifyRefreshBackground');
      this.refreshCanvas();
    },

    notifyPaint: function() {
      CanvasController.loadProjectIntoPages();

      this.freshImageList();
      // this.clearCanvas();
      this.initCanvas();
    },
    notifyGetFamilyNameRemind: function(){
      //this.getFamilyNameRemind();
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
      //  Store.pages[Store.selectedPageIdx].canvas.paper.remove();
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
    notifyAddDecoration: function(oParams){
      this.addDecoration(oParams);
    },

    notifyDbClickTextFormRemind: function() {
      this.handleDbClickTextFormRemind();
    },

    // capture dispatch depth to front
    dispatchDepthFront: function(idx) {
      // console.log('should change depth:', idx);
      if(idx != undefined && idx != null) {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        CanvasController.changeDepthValue({ idx: idx, targetDepth: currentCanvas.params.length - 1 });
      };
    },
    dispatchRepaintText: function(){
      this.initCanvas();
    },
    dispatchDrop: function(oParams) {
      this.addImage(oParams);
      // this.addDecoration(oParams);
    },
    dispatchDecorationDrop: function(oParams){
      this.addDecoration(oParams);
    },
    notifyApplyTemplate:function(xml){
      this.clearCanvas();
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      currentCanvas.params=CanvasController.getTemplateParams(xml);
      this.initCanvas();
      Store.vm.$broadcast('notifyRefreshTextFormList');
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
        // _this.handleDecorationOndrop(_this.sharedStore.dropData);
      };
    });

     _this.$watch('sharedStore.watches.isDecorationOnDrop', function() {
      if(_this.sharedStore.watches.isDecorationOnDrop) {
        _this.sharedStore.watches.isDecorationOnDrop = false;
        // _this.handleOndrop(_this.sharedStore.dropData);
        _this.handleDecorationOndrop(_this.sharedStore.dropData);
      };
    });

    _this.$watch('sharedStore.watches.isRemoveElement', function() {
      if(_this.sharedStore.watches.isRemoveElement) {
        _this.sharedStore.watches.isRemoveElement = false;
        var idx = _this.sharedStore.watchData.removeElementIdx,
            type = _this.sharedStore.watchData.removeElementType;
        _this.sharedStore.watchData.removeElementIdx = '';
        _this.sharedStore.watchData.removeElementType = '';

        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var currentParam = currentCanvas.params[idx];

        if(idx != null && idx !== '') {
          if(type === 'image' && currentParam.imageId) {
            _this.removeImage(idx);
          }else if(type ==='decoration'){
            _this.removeDecoration(idx);
          }
          // 如果是其他，直接删除元素 removeText方法就是删除整个元素
          else {
            _this.removeText(idx);
          };
        };
      };
    });

  }
};
