var Vue = require('vuejs');

var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);

var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);

var JsonProjectManage = require('JsonProjectManage');
var CanvasController = require('CanvasController');

// module -- dashboard
module.exports = {
  template: '<div v-on:click="blurFocus()" v-bind:style="usedStyle">' +
              '<!-- action panel component -->' +
              '<action-panel v-if="!sharedStore.isPreview && !sharedStore.isRemark"></action-panel>' +
              '<!-- operation area -->' +
              '<div id="main-container-wrap" style="position:relative;">'+
                  '<operation-area key="centerContainer" v-bind:idx="sharedStore.selectedPageIdx"  main="Main"></operation-area>' +
                  '<div @click="changeSelectedProject(-1)" style="width:44px;height:100%;position:absolute;top:0;left:0;">'+
                      '<span :class="{disabled: isFirstUsefullPage}" class="changePageIcon left" />'+
                  '</div>'+
                  '<div @click="changeSelectedProject(+1)" style="width:44px;height:100%;position:absolute;top:0;right:0;">'+
                      '<span :class="{disabled: isLastUsefullPage}" class="changePageIcon right" />'+
                  '</div>'+
              '</div>'+
              '<action-panel-bottom></action-panel-bottom>' +
              '<div v-show="!sharedStore.isPreview" style="height:130px;border-top:1px solid #d6d6d6;border-left:1px solid #d6d6d6;background-color:#f6f6f6;box-sizing:border-box;overflow-x:auto;overflow-y:hidden;">'+
                  '<div style="display:inline-block;min-width:100%;height:130px;padding:34px 16px 0 16px;box-sizing:border-box;white-space:nowrap;">'+
                      // '<div v-show="!sharedStore.isPreview && totalPageNum < 1000 && !sharedStore.checkFailed && !sharedStore.isRemark" class="add-photo-button" id="add-photos" @click="addProject">'+
                      '<div v-show="isAddBottonShow" class="add-photo-button" id="add-photos" @click="addProject">'+
                          '<div style="position: absolute;width:100%;left: 0;top: 50%;transform:translate(0,-50%); text-align:center;">'+
                              '<span class="font-normal" style="font-size:12px;color:#7b7b7b;">+ Add Block</span>'+
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
        pages: [],
        isAddBottonShow: false
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
          left: '280px',
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
		'operation-area': CompContainer
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
        (function(i,imgId) {
          if(!_this.sharedStore.pages[i].isDeleted){
              var el = new CompContainer();
              el.setId(i,'',showIndex);
              el.$mount().$before("#add-photos");
              _this.$nextTick(function() {
                el.initCanvas();
                // _this.privateStore.pages.push(imgId);
                _this.sharedStore.pages[i].canvas.pageItems.push(el);
              })
              showIndex ++;
          }
        })(i);
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
      return '';
        var that = this;
        require('trackerService')({ev: require('trackerConfig')['AddBlock'], blockNum: this.totalPageNum});

        this.sharedStore.projectSettings.push(require("ProjectController").newProject());
        var length = this.sharedStore.projectSettings.length;
        var bleeding = JsonProjectManage.getBleedSize(length-1);
        var frameBaseSize = JsonProjectManage.getBaseSize(length-1);
        var photoLayer = JsonProjectManage.getPhotoLayer(length-1);
        var foreground = CanvasController.getForeground(frameBaseSize, {},photoLayer,length-1);
        this.sharedStore.pages.push({
          type: 'Page',
          name: '',
          isDeleted: false,
          guid: require("UtilProject").guid(),
          canvas: {
              oriWidth: photoLayer.width, // real size
              oriHeight: photoLayer.height,
              oriX: foreground.x,
              oriY: foreground.y,
              oriBgWidth: foreground.width,
              oriBgHeight: foreground.height,
              oriSpineWidth: 0,
              realBleedings: bleeding,
              frameBaseSize: frameBaseSize,
              frameBorderThickness: {},
              boardInFrame: {},
              boardInMatting: {},
              mattingSize: {},
              expendSize: {},
              foreground: foreground,
              mirrorSize: {},
              photoLayer: photoLayer,
              elements: [],
              pageItems: [],
              centerElements: [],
              params: [{
                id: 0,
                elType: 'image',
                url: '',
                isRefresh: false,
                x: 0,
                y: 0,
                width: photoLayer.width,
                height: photoLayer.height,
                rotate: 0,
                dep: 0,
                imageId: '',
                imageGuid: '',
                imageWidth: '',
                imageHeight: '',
                imageRotate: 0,
                cropPX: 0,
                cropPY: 0,
                cropPW: 1,
                cropPH: 1,
                style: {
                  brightness: 0
                }
            }],
          }
        });
        this.clearItemElement();
        this.showItem();
        setTimeout(function(){
            $("#add-photos")[0].scrollIntoView(false);
            if(that.sharedStore.pages[that.sharedStore.selectedPageIdx].canvas.params[0].imageId){
                that.sharedStore.selectedPageIdx = that.sharedStore.projectSettings.length -1;
                that.sharedStore.currentSelectProjectIndex = that.sharedStore.projectSettings.length -1;
            }
        });
    },
    deleteProject: function(pageIdx){
        var firstVisiablePageIdx = 0;

        this.clearItemElement();
        this.sharedStore.projectSettings[pageIdx].isDeleted = true;
        this.sharedStore.pages[pageIdx].isDeleted = true;
        // 这一步是为了避免 图片 计数的逻辑错误。
        this.sharedStore.pages[pageIdx].canvas.params[0].imageId = '';

        this.sharedStore.pages.some(function(item,index){
          if(!item.isDeleted){
            firstVisiablePageIdx = index;
            return true;
          }
        });
        if(this.sharedStore.selectedPageIdx === pageIdx) {
           this.sharedStore.selectedPageIdx = firstVisiablePageIdx;
           this.sharedStore.currentSelectProjectIndex = firstVisiablePageIdx;
        }

        this.showItem();
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
    fillImageIntoBlankPage: function(imgArray){
      var imageDetail = imgArray[0];
      var _this = this;

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

      this.sharedStore.pages.some(function(page,index){
        var currentProject = Store.projectSettings[index];
        var orientation = currentProject.orientation;
        var currentCanvas = page.canvas;
        var photoElementIndex = 0;

        currentCanvas.params.some(function(element,index){
          if(element.type === 'image') {
            photoElementIndex = index;
            return;
          }
        });

        var firstPhotoElement = currentCanvas.params[photoElementIndex];
        if(!firstPhotoElement.imageId) {
            firstPhotoElement.imageId = imageDetail.id;
            firstPhotoElement.imageRotate = imageRotate;
            firstPhotoElement.imageGuid = imageDetail.guid;
            firstPhotoElement.imageWidth = imageDetail.width;
            firstPhotoElement.imageHeight = imageDetail.height;

            if ( (cWidth > cHeight && orientation === 'Portrait')
              || (cHeight > cWidth && orientation === 'Landscape')
            ) {
              setTimeout(function(){
                _this.sharedStore.isSwitchLoadingShow = true;
                currentProject.rotated=!currentProject.rotated;
                currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";
                CanvasController.fixRotatePhotoElement(index);
                CanvasController.freshPageData(index);
                // _this.sharedStore.vm.$broadcast('notifyRefreshItems');
                if(index === _this.sharedStore.selectedPageIdx){
                    _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
                }
                // _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
                _this.sharedStore.pages[index].canvas.pageItems[0].handleRepaint();
              })
            } {
                var defaultCrops = require('UtilCrop').getDefaultCrop(cWidth, cHeight, firstPhotoElement.width, firstPhotoElement.height);
                var px = defaultCrops.px,
                    py = defaultCrops.py,
                    pw = defaultCrops.pw,
                    ph = defaultCrops.ph,
                    width = firstPhotoElement.width * currentCanvas.ratio / pw,
                    height = firstPhotoElement.height * currentCanvas.ratio / ph;

                // adding the crop settings to element
                firstPhotoElement.cropX = cWidth * px;
                firstPhotoElement.cropY = cHeight * py;
                firstPhotoElement.cropW = cWidth * pw;
                firstPhotoElement.cropH = cHeight * ph;

                firstPhotoElement.cropPX = px;
                firstPhotoElement.cropPY = py;
                firstPhotoElement.cropPW = pw;
                firstPhotoElement.cropPH = ph;

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

                firstPhotoElement.url = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
                firstPhotoElement.isRefresh = true;
                // _this.sharedStore.pages[index].canvas.pageItems[0].handleRepaint();
                // firstPhotoElement.sourceImageUrl = sourceImageUrl;
            }

            // setTimeout(function(){
            //     if(index === _this.sharedStore.selectedPageIdx){
            //         _this.sharedStore.vm.$broadcast('notifyRepaintCenterContainer');
            //     }
            //     _this.sharedStore.pages[index].canvas.pageItems[photoElementIndex].handleRepaint();
            // })
            return true;
        };

      });
    },
    replacePageImage: function(imgs) {
      var _this = this;
      var useIndex = Store.watchData.replacePageId;
      var imageDetail = Array.isArray(imgs) && imgs[0];

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

      var currentProject = Store.projectSettings[useIndex];
      var orientation = currentProject.orientation;
      var currentPage = Store.pages[useIndex];
      var currentCanvas = currentPage.canvas;

      var photoElement = currentCanvas.params[currentCanvas.selectedIdx];
      this.sharedStore.isShowProgress = true;
        photoElement.imageId = imageDetail.id;
        photoElement.imageRotate = imageRotate;
        photoElement.imageGuid = imageDetail.guid;
        photoElement.imageWidth = imageDetail.width;
        photoElement.imageHeight = imageDetail.height;

        if ( (cWidth > cHeight && orientation === 'Portrait')
          || (cHeight > cWidth && orientation === 'Landscape')
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
            var defaultCrops = require('UtilCrop').getDefaultCrop(cWidth, cHeight, photoElement.width, photoElement.height);
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
    },
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
    },
    notifyAddNewUploadedImgIntoPages: function() {
      if(this.sharedStore.newUploadedImg.length) {
        if(!(typeof(Store.watchData.replacePageId) == "number")) {
          console.log(this.sharedStore.newUploadedImg[0]);
          this.fillImageIntoBlankPage(this.sharedStore.newUploadedImg);
        } else {
          this.replacePageImage(this.sharedStore.newUploadedImg);
        }
        this.sharedStore.newUploadedImg.length=0;
      }
    }
  }
};
