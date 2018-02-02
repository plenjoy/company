var Vue = require('vuejs');

var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);

var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);
var CompUpgradeContainer = Vue.extend(require('../components/CompUpgradeContainer.js'));

var JsonProjectManage = require('JsonProjectManage');
var CanvasController = require('CanvasController');

// module -- dashboard
module.exports = {
  template: '<div v-on:click="blurFocus()" v-bind:style="usedStyle">' +
              '<!-- action panel component -->' +
              '<action-panel style="display:none;" v-if="!sharedStore.isPreview && !sharedStore.isRemark"></action-panel>' +
              '<!-- operation area -->' +
              '<div v-show="sharedStore.isPreview" id="main-container-wrap" style="position:relative;">'+
                  '<operation-area key="centerContainer" v-bind:idx="selectedPageIdx" main="Main"></operation-area>' +
                  '<div @click="changeSelectedProject(-1)" style="width:44px;height:100%;position:absolute;top:0;left:0;">'+
                      '<span :class="{disabled: isFirstUsefullPage}" class="changePageIcon left" />'+
                  '</div>'+
                  '<div @click="changeSelectedProject(+1)" style="width:44px;height:100%;position:absolute;top:0;right:0;">'+
                      '<span :class="{disabled: isLastUsefullPage}" class="changePageIcon right" />'+
                  '</div>'+
              '</div>'+
              '<upgrade-area v-bind:idx="selectedPageIdx"></upgrade-area>'+
              '<action-panel-bottom></action-panel-bottom>' +
              '<div v-show="!sharedStore.isPreview" style="height:100%;border-left:1px solid #d6d6d6;box-sizing:border-box;overflow-x:hidden;overflow-y:auto;">'+
                  '<div style="display:inline-block;position:relative;width:100%;height:100%px;padding:34px 16px 0 16px;box-sizing:border-box;">'+
                      '<price-item></price-item>' +
                      '<div v-show="!sharedStore.isPreview && totalPageNum < 1000 && !sharedStore.checkFailed && !sharedStore.isRemark" class="add-photo-button" id="add-photos" @click="addProject">'+
                          '<div style="position: absolute;width: 280px; height: 280px;border: 1px solid #b6b6b6;background-color: #f6f6f6;border-style:dashed;bottom:14px;left: 50%;transform: translateX(-50%);">'+
                            '<div style="position: absolute;width:100%;left: 0;top: 50%;transform:translate(0,-50%); text-align:center;">'+
                                '<span class="font-light" style="font-size:24px;color:#3a3a3a;">+ Add </span>'+
                            '</div>'+
                          '</div>'+
                      '</div>' +
                  '</div>'+
              '</div>'+
              '<screenshot-element></screenshot-element>' +
            '</div>',
  data: function() {
    return {
      privateStore: {
        first: 0,
        pages: []
      },
      sharedStore : Store
    };
  },
  computed: {
    usedStyle: function() {
      if(this.sharedStore.isPreview) {
        return {};
      }
      else {
        return {
          position: 'absolute',
          top: '38px',
          bottom: '0',
          left: '0px',
          right: 0,
          overflow : 'hidden'
        };
      };
    },

    // to determine if change page action items should be shown
    shouldChangePageShow: function() {
        if (this.sharedStore.isChangePageShow) {
            return true;
        } else {
            return false;
        };
    },
    isFirstUsefullPage: function(){
        var isFirstUsefullPage = true;
        for(var i =0; i < this.sharedStore.selectedPageIdx; i++){
          if(!this.sharedStore.pages[i].isDeleted){
              isFirstUsefullPage = false;
          }
        }
        return isFirstUsefullPage;
    },
    isLastUsefullPage: function(){
      var isLastUsefullPage = true;
      for(var i =this.sharedStore.selectedPageIdx + 1; i < this.sharedStore.pages.length; i++){
        if(!this.sharedStore.pages[i].isDeleted){
            isLastUsefullPage = false;
        }
      }
      return isLastUsefullPage;
    },
    selectedPageIdx: function() {
      if(!Store.isPreview) {
        var firstEnabledPageIdx = 0;
        
        for(var i = 0; i < Store.pages.length; i++) {
          if(!Store.pages[i].isDeleted) {
            firstEnabledPageIdx = i;
            break;
          }
        }
  
        return firstEnabledPageIdx;
      } else {
        return this.sharedStore.selectedPageIdx;
      }
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
  components: {
		'action-panel': CompActionPanel,
    'action-panel-bottom': CompActionPanelBottom,
		'operation-area': CompContainer,
    'upgrade-area': CompUpgradeContainer
	},
  methods: {
    showItem: function(reload) {
      var _this = this;
      var showIndex = 1;
      if ((_this.privateStore.first++) == 0) {
        // require("CanvasController").loadProjectIntoPages();
      }
      if (reload) {
        _this.privateStore.pages.length = 0;
      }
      // console.log("pages", _this.sharedStore.pages);
      for (var i = 0; i < _this.sharedStore.pages.length; i++) {
        var guid = _this.sharedStore.pages[i].guid;

        if(_this.privateStore.pages.indexOf(guid) === -1) {
          (function(i, guid) {
            if(!_this.sharedStore.pages[i].isDeleted){
                var el = new CompContainer();
                el.setId(i,'',showIndex);
                el.$mount().$before("#add-photos");
                _this.privateStore.pages.push(guid);

                _this.$nextTick(function() {
                  el.initCanvas();
                  _this.sharedStore.pages[i].canvas.pageItems.push(el);
                })
                showIndex ++;
            }
          })(i, guid);
        }
      }

      // var centerEl = new CompContainer();
      // centerEl.setId(this.sharedStore.selectedPageIdx, 'Mains');
      // centerEl.$mount().$appendTo("#main-container-wrap");
      // _this.$nextTick(function() {
      //   centerEl.initCanvas();
      //   _this.sharedStore.pages[0].canvas.pageItems.push(centerEl);
      // })

    },
    clearItemElement: function() {
      this.privateStore.pages.length = 0;
      for (var i = 0; i < this.sharedStore.pages.length; i++) {
        var currentCanvas = this.sharedStore.pages[i].canvas;
        if (currentCanvas.pageItems.length) {
          currentCanvas.pageItems[0].$destroy(true);
          currentCanvas.pageItems.length = 0;
          currentCanvas.elements[0].$destroy(true);
          currentCanvas.elements.length = 0;
        }
      }
    },
    blurFocus: function() {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
    },
    addProject: function() {
        var that = this;
        require('trackerService')({ev: require('trackerConfig')['ClickAddPhotos']});

        Store.vm.$broadcast("notifyShowImageUpload");
    },

    deleteProject: function(pageIdx){
        var firstVisiablePageIdx = 0;

        // this.clearItemElement();
        this.sharedStore.projectSettings[pageIdx].isDeleted = true;
        this.sharedStore.pages[pageIdx].isDeleted = true;
        // 这一步是为了避免 图片 计数的逻辑错误。
        var deleteImageId = this.sharedStore.pages[pageIdx].canvas.params[0].imageId;
        this.sharedStore.pages[pageIdx].canvas.params[0].imageId = '';
        if(deleteImageId){
           this.deletePhoto(deleteImageId);
        }
        this.sharedStore.pages.some(function(item,index){
          if(!item.isDeleted){
            firstVisiablePageIdx = index;
            return true;
          }
        });
       
        this.$dispatch('dispatchSaveProject');
        if(this.sharedStore.selectedPageIdx === pageIdx) {
           this.sharedStore.selectedPageIdx = firstVisiablePageIdx;
           this.sharedStore.currentSelectProjectIndex = firstVisiablePageIdx;
        }

        this.showItem();
    },
    deletePhoto: function(targetImageId) {

        if(targetImageId){
          for(var k=0;k<this.sharedStore.imageList.length;k++){
            if(this.sharedStore.imageList[k].id==targetImageId){
              this.sharedStore.imageList.splice(k,1);
            }
          }
        }
      
      
    },
    freshItemIndexes: function() {
      for (var i = 0; i < this.sharedStore.pages.length; i++) {
        this.sharedStore.pages[i].idx = i;
      };
    },
    // broadcast change page
    broadcastChangePage: function(nPageNum) {
        Store.vm.$broadcast('notifyChangePage', nPageNum);
    },
    changeSelectedProject: function(num){
      if(this.sharedStore.isSwitchLoadingShow)return;
      var pageLength = this.sharedStore.pages.length;
      var selectedIdx = this.sharedStore.selectedPageIdx;
      var terminalIndex = selectedIdx;
      do{
        terminalIndex += num;
      }while(this.sharedStore.pages[terminalIndex] && this.sharedStore.pages[terminalIndex].isDeleted)
      if (terminalIndex >= 0 && terminalIndex < pageLength) {
        var trackerKey = this.sharedStore.isPreview ? "SwitchBlocksInPreview" : "SwitchBlocks";
        this.sharedStore.selectedPageIdx = terminalIndex;
        this.sharedStore.currentSelectProjectIndex = terminalIndex;
        require('trackerService')({ev: require('trackerConfig')[trackerKey], isFromFactory: this.sharedStore.isFromFactory});
      }
    },
    getRatio: function(foreground) {
      var size = Store.baseProject.size;
      var objWidth = foreground.width;
      var objHeight = foreground.height;

      var wX = Store.boxLimit[size].width / objWidth,
          hX = Store.boxLimit[size].height / objHeight;

      var ratio = wX > hX ? hX : wX;

      return ratio;
    },
    fillImageIntoBlankPage: function(imgArray){
      if(!(imgArray instanceof Array))return null;
      var _this = this;
      imgArray.forEach(function(imageDetail) {

        // var imageDetail = imgArray[0];
        var imageRotate = imageDetail ? imageDetail.orientation : 0;
        var isRotate = Math.abs(imageRotate) / 90 % 2 === 1;

        if(isRotate) {
          // special rorate
          var cWidth = imageDetail.height,
              cHeight = imageDetail.width;
        }
        else {
          var cWidth = imageDetail.width,
              cHeight = imageDetail.height;
        };

        var PrjConstructor = require('Prj');
        var project = PrjConstructor();
        project.product = Store.baseProject.product;
        project.size = Store.baseProject.size;
        project.paper = Store.baseProject.paper;
        project.color = Store.baseProject.color;
        project.canvasBorder = Store.baseProject.canvasBorder;
        project.canvasBorderSize = Store.baseProject.canvasBorderSize;
        project.frameStyle = Store.baseProject.frameStyle;
        project.rotated = cWidth > cHeight ? true : false;
        project.orientation = cWidth > cHeight ? "Landscape" : "Portrait";
        project.quantity = 1;

        _this.sharedStore.projectSettings.push(project);
        var length = _this.sharedStore.projectSettings.length;
        var bleeding = JsonProjectManage.getLMCBleedSize(length - 1);
        var frameBaseSize = JsonProjectManage.getLMCBaseSize(length - 1);
        var photoLayer = JsonProjectManage.getLMCPhotoLayer(length - 1);
        var foreground = CanvasController.getForeground(frameBaseSize, { left: 0, top: 0, right: 0, bottom: 0 }, photoLayer, length - 1);
        var canvasBordeThickness = JsonProjectManage.getLMCCanvasBorder(length - 1);
        var fg = CanvasController.getForegroundVariable();
        var oriX = fg.left * foreground.ratioX - bleeding.left - canvasBordeThickness.left;
        var oriY = fg.top * foreground.ratioY - bleeding.top - canvasBordeThickness.top;
        var mirrorSize = { top: canvasBordeThickness.top + bleeding.top, right: canvasBordeThickness.right + bleeding.right, bottom: canvasBordeThickness.bottom + bleeding.bottom, left: canvasBordeThickness.left + bleeding.left };
        var elementWidth = photoLayer.width - mirrorSize.left - mirrorSize.right;
        var elementHeight = photoLayer.height - mirrorSize.top - mirrorSize.bottom;



        var defaultCrops = require('UtilCrop').getDefaultCrop(cWidth, cHeight, elementWidth, elementHeight);
        var photoElement = {};
        var px = defaultCrops.px,
            py = defaultCrops.py,
            pw = defaultCrops.pw,
            ph = defaultCrops.ph,
            width = elementWidth * _this.getRatio(foreground) / pw,
            height = elementHeight * _this.getRatio(foreground) / ph;

        photoElement.cropX = cWidth * px;
        photoElement.cropY = cHeight * py;
        photoElement.cropW = cWidth * pw;
        photoElement.cropH = cHeight * ph;

        photoElement.cropPX = px;
        photoElement.cropPY = py;
        photoElement.cropPW = pw;
        photoElement.cropPH = ph;

        photoElement.width = elementWidth;
        photoElement.height = elementHeight;
        photoElement.x = mirrorSize.left;
        photoElement.y = mirrorSize.top;
        var UtilProject = require('UtilProject');
        var encImgId = UtilProject.getEncImgId(imageDetail.id);
        var qs = UtilProject.getQueryString({
            encImgId: encImgId,
            px: px,
            py: py,
            pw: pw,
            ph: ph,
            width: Math.round(width),
            height: Math.round(height)
        });

        photoElement.url = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
        var encImgId = UtilProject.getEncImgId(imageDetail.id);
        _this.sharedStore.pages.push({
            type: 'Page',
            name: '',
            isDeleted: false,
            guid: require("UtilProject").guid(),
            canvas: {
                oriWidth: photoLayer.width, // real size
                oriHeight: photoLayer.height,
                oriX: oriX,
                oriY: oriY,
                oriBgWidth: foreground.width,
                oriBgHeight: foreground.height,
                oriSpineWidth: 0,
                realBleedings: bleeding,
                frameBaseSize: frameBaseSize,
                frameBorderThickness: {},
                canvasBordeThickness: canvasBordeThickness,
                boardInFrame: {},
                boardInMatting: {},
                mattingSize: {},
                expendSize: {},
                foreground: foreground,
                mirrorSize: mirrorSize,
                photoLayer: photoLayer,
                elements: [],
                pageItems: [],
                centerElements: [],
                params: [{
                    id: 0,
                    elType: 'image',
                    url: photoElement.url,
                    isRefresh: false,
                    x: photoElement.x,
                    y: photoElement.y,
                    width: photoElement.width,
                    height: photoElement.height,
                    rotate: 0,
                    dep: 0,
                    imageId: imageDetail.id,
                    imageGuid: imageDetail.guid,
                    imageWidth: imageDetail.width,
                    imageHeight: imageDetail.height,
                    imageRotate: imageRotate,
                    cropPX: photoElement.cropPX,
                    cropPY: photoElement.cropPY,
                    cropPW: photoElement.cropPW,
                    cropPH: photoElement.cropPH,
                    style: {
                        brightness: 0
                    }
                }]
            }

        });

        Store.mirrorLength = mirrorSize.top;
      });
      // 显示loading
      Store.isShowProgress = true;

      // this.clearItemElement();
      this.showItem();
      this.$dispatch('dispatchSaveProject');
      setTimeout(function() {
          $("#add-photos")[0].scrollIntoView(false);
          _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
          /*if (that.sharedStore.pages[that.sharedStore.selectedPageIdx].canvas.params[0].imageId) {
              that.sharedStore.selectedPageIdx = that.sharedStore.projectSettings.length - 1;
              that.sharedStore.currentSelectProjectIndex = that.sharedStore.projectSettings.length - 1;
          }*/
      });
    },
    replacePageImage: function(imgs) {
      var _this = this;
      var useIndex = Store.watchData.replacePageId;
      var imageDetail = Array.isArray(imgs) && imgs[0];

      var currentProject = Store.projectSettings[useIndex];
      var orientation = currentProject.orientation;
      var currentPage = Store.pages[useIndex];
      var currentCanvas = currentPage.canvas;

      var photoElement = currentCanvas.params[currentCanvas.selectedIdx];
      this.sharedStore.isShowProgress = true;
        photoElement.imageId = imageDetail.id;
        photoElement.imageRotate = 0;
        photoElement.imageGuid = imageDetail.guid;
        photoElement.imageWidth = imageDetail.width;
        photoElement.imageHeight = imageDetail.height;

        if ( (imageDetail.width > imageDetail.height && orientation === 'Portrait')
          || (imageDetail.height > imageDetail.width && orientation === 'Landscape')
        ) {
          // setTimeout(function(){
            // _this.sharedStore.isSwitchLoadingShow = true;
            currentProject.rotated=!currentProject.rotated;
            currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";
            CanvasController.fixRotatePhotoElement(useIndex);
            CanvasController.freshPageData(useIndex);
          //   _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
          //   _this.sharedStore.pages[useIndex].canvas.pageItems[0].handleRepaint();
          // })
        } {
            var defaultCrops = require('UtilCrop').getDefaultCrop(photoElement.imageWidth, photoElement.imageHeight, photoElement.width, photoElement.height);
            var px = defaultCrops.px,
                py = defaultCrops.py,
                pw = defaultCrops.pw,
                ph = defaultCrops.ph,
                width = photoElement.width * currentCanvas.ratio / pw,
                height = photoElement.height * currentCanvas.ratio / ph;

            // adding the crop settings to element
            photoElement.cropX = imageDetail.width * px;
            photoElement.cropY = imageDetail.height * py;
            photoElement.cropW = imageDetail.width * pw;
            photoElement.cropH = imageDetail.height * ph;

            photoElement.cropPX = px;
            photoElement.cropPY = py;
            photoElement.cropPW = pw;
            photoElement.cropPH = ph;

            var UtilProject = require('UtilProject');
            var encImgId = UtilProject.getEncImgId(imageDetail.id);
            var qs = UtilProject.getQueryString({
              encImgId: encImgId,
              px: px,
              py: py,
              pw: pw,
              ph: ph,
              width: Math.round(width),
              height: Math.round(height)
            });

            photoElement.url = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
            // photoElement.isRefresh = true;
            // _this.sharedStore.pages[index].canvas.pageItems[0].handleRepaint();
            // photoElement.sourceImageUrl = sourceImageUrl;
        }

        setTimeout(function(index, elementIndex){
            _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
            _this.sharedStore.pages[index].canvas.pageItems[elementIndex].handleRepaint();
        },100,Store.watchData.replacePageId,currentCanvas.selectedIdx)

      Store.watchData.replacePageId = null;
    }
  },
  events: {
    notifyShowItem: function(reload) {
      this.showItem(reload);
    },
    notifyRefreshItems: function(reload) {
      this.clearItemElement();
      this.showItem(true);
    },
    notifyDeleteProject: function(pageIdx){
      this.deleteProject(pageIdx);

      var currentProject = Store.projectSettings[pageIdx];
      require('trackerService')({ev: require('trackerConfig')['ClickDeleteCanvas'], orientation: currentProject.orientation === "Landscape" ? "Landscape" : "Portrait"});
    },
    notifyAddMyPhotosIntoPages: function(myPhotoImages) {
      this.fillImageIntoBlankPage(myPhotoImages);
    },
    notifyAddNewUploadedImgIntoPages: function() {
      if(this.sharedStore.newUploadedImg.length) {
        if(!(typeof(Store.watchData.replacePageId) == "number")) {
          this.fillImageIntoBlankPage(this.sharedStore.newUploadedImg);
        } else {
          this.replacePageImage(this.sharedStore.newUploadedImg);
        }
        this.sharedStore.newUploadedImg.length=0;
      }
    }
  },
  ready: function() {
    var _this = this;
    _this.$watch('sharedStore.watches.isProjectLoaded',function(){
        if(_this.sharedStore.watches.isProjectLoaded){
           for(var i=0;i<_this.sharedStore.pages.length;i++){
              _this.sharedStore.initQuantitys.push(+_this.sharedStore.projectSettings[i].quantity);
           }
        }
    })
  }
};
