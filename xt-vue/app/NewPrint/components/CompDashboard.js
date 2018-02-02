var Vue = require('vuejs');

// Vue.component('action-panel', CompActionPanel);

var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
var CompOption = Vue.extend(require('../components/CompOption.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

var CompItemElement = Vue.component('operation-area');
// Vue.component('operation-area', CompContainer);
var ProjectManage = require("ProjectManage");
var JsonProjectManage = require('JsonProjectManage');
var UtilWindow = require('UtilWindow');
// module -- dashboard
module.exports = {
  template: '<div  id="dashboard" v-show="sharedStore.watches.isProjectLoaded" v-bind:style="marginStyle" class="fix">' +
              '<div v-show="!sharedStore.isPreview && !sharedStore.isRemark && isAddPhotoButtonShow && sharedStore.watches.isProjectLoaded && !sharedStore.checkFailed" v-bind:style="addPhotoStyle" class="add-photo-buttom" id="add-photos" v-on:click="addPhotos()">'+
                '<div style="position: absolute;width:100%;left: 0;top: 50%;transform:translate(0,-50%); text-align:center;">'+
                  '<img src="assets/img/add-normal.svg" width="59px" height="44px" ommouseover="this.src=\'assets/img/add-hover.svg\'"  ommouseout="this.src=\'assets/img/add-normal.svg\'" style="display:block;margin:0 auto;margin-bottom: 25px;">'+
                  '<span class="font-light" style="font-size:13px;color:#3a3a3a;">{{addPhotoText}}</span>'+
                '</div>'+
              '</div>' +
              '<screenshot-element></screenshot-element>' +
            '</div>',
  data: function() {
    return {
      privateStore: {
        pages: [],
        first: 0
      },
      sharedStore: Store,
      isAddPhotoButtonShow: true
    };
  },
  computed: {
    usedStyle: function() {
      if (this.sharedStore.isPreview) {
        return {};
      } else {
        return {
          float: 'right',
          /*backgroundColor: '#f1f1f1',
          boxShadow: '1px 1px 10px #d1d1d1 inset'*/
        };
      };
    },
    marginStyle : function(){
      if(this.sharedStore.isRemark || !this.sharedStore.isActionPanelShow || this.sharedStore.checkFailed){
        return {
          margin : '40px 0px 0 15px'
        }
      }else{
        return {
          margin : this.sharedStore.limitWidth ? '0 0 0 15px' : '0 30px'
        }
      }
    },
    width: function() {
      return this.sharedStore.limitWidth ? 240 : this.sharedStore.boxLimit.width + 20;
    },
    height: function() {
      var optionHeight = this.sharedStore.isProjectSettingSelectShow ? 117 : 0;
      return this.sharedStore.boxLimit.height + optionHeight;
    },

    // to determine if change page action items should be shown
    shouldChangePageShow: function() {
      if (this.sharedStore.isChangePageShow) {
        return true;
      } else {
        return false;
      };
    },
    isAddPhotoButtonShow: function() {
      if(this.sharedStore.maxPageNum && this.sharedStore.pages.length >= this.sharedStore.maxPageNum){
        return false;
      }
      return true;
    },
    addPhotoStyle: function() {
      var baseStyle = {
        width: this.width + 'px',
        height: this.height + 'px',
        borderRadius: this.sharedStore.isRoundBorder ? '12px' : 0
      };
      if (this.sharedStore.pages.length) {
        baseStyle.float = 'left';
        baseStyle.position = 'relative';
        baseStyle.margin = this.sharedStore.limitWidth ? '0 67px 20px' : '0 20px 20px';
      } else {
        baseStyle.position = 'absolute';
        baseStyle.left = '50%';
        baseStyle.top = '50%';
        baseStyle.transform = 'translate(-50%,-50%)';

      }
      return baseStyle;
    },
    addPhotoText: function() {
      if (!this.sharedStore.maxPageNum) return 'Add Photos';
      var pageLenth = this.sharedStore.pages.length;
      var showNum = this.sharedStore.maxPageNum - pageLenth;
      return 'Click to add ' + showNum + ' photo(s)';
    }
  },
  components: {
    // 'action-panel': CompActionPanel,
    'action-panel-bottom': CompActionPanelBottom,
    'option': CompOption
  },
  methods: {
    blurFocus: function() {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
    },

    // broadcast change page
    broadcastChangePage: function(nPageNum) {
      Store.vm.$broadcast('notifyChangePage', nPageNum);
    },

    showItem: function(reload) {
      var _this = this;
      if ((_this.privateStore.first++) == 0) {
        require("CanvasController").loadProjectIntoPages();
      }
      if (reload) {
        _this.privateStore.pages.length = 0;
      }
      // console.log("pages", _this.sharedStore.pages);
      for (var i = 0; i < _this.sharedStore.pages.length; i++) {
        if (_this.privateStore.pages.indexOf(_this.sharedStore.pages[i].guid) === -1) {
          (function(i,guid) {
            var el = new CompItemElement();
            el.$mount().$before("#add-photos");
            el.setId(i);
            _this.privateStore.pages.push(guid);
            _this.$nextTick(function() {
              el.initCanvas();
              _this.sharedStore.pages[i].canvas.pageItems.push(el);
            })
          })(_this.sharedStore.pages[i].idx,_this.sharedStore.pages[i].guid);
        }
      }
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

    addImagesIntoPages: function(imgs) {
      var length = this.sharedStore.pages.length;
      for (var i = 0; i < imgs.length; i++) {
        var rotated = false;
        var img = imgs[i];
        var isRotatedImage = Math.abs(img.orientation || 0) / 90 % 2 === 1;

        if (isRotatedImage) {
          rotated = img.width >= img.height;
        } else {
          rotated = img.width < img.height;
        }
        var baseSize = JsonProjectManage.getPrintBaseSize({
          size: Store.baseProject.size,
          rotated: rotated
        });
        var bleedings = JsonProjectManage.getPrintBleed({
          size: Store.baseProject.size,
          rotated: rotated
        });
        var cornerRadius = JsonProjectManage.getPrintCornerRadius({
          size: Store.baseProject.size
        });
        this.sharedStore.pages.push({
          type: '',
          name: '',
          idx: length + i,
          guid: require('UtilProject').guid(),
          canvas: {
            oriWidth: baseSize.width + bleedings.left + bleedings.right,
            oriHeight: baseSize.height + bleedings.top + bleedings.bottom,
            oriX: 0,
            oriY: 0,
            bleedings: bleedings,
            baseSize: baseSize,
            cornerRadius: cornerRadius,
            params: [],
            elements: [],
            pageItems: [],
            borderLength: 0,
            borderColor: 'none'
          }
        })

        require("ProjectController").newProject(Store.baseProject.size, Store.baseProject.paper, rotated);

        Store.projectSettings[length + i].rotated = rotated;
        if(!Store.isPreview){
          var optionIds = require('SpecManage').getOptionIds();
          var options = [];

          optionIds.forEach(function(optionId) {
              if(optionId !== 'product') {
                  options.push(Store.projectSettings[length + i][optionId]);
              }
          });

          options = options.filter(function(option) {
              return option && option !== 'none';
          });

          var product = Store.projectSettings[length + i].product;
          this.sharedStore.watchData.changePriceIdx = length + i;
          require("ProjectService").getPhotoPrice(product, options.join(','), length + i);
        }
        var currentCanvas = Store.pages[length + i].canvas;
        var boxLimit = require("UtilWindow").getPrintBoxLimit();
        // console.log("cur",currentCanvas)
        if (boxLimit.width > 0 && boxLimit.height > 0) {
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
          if (wX > hX) {
            // resize by height
            currentCanvas.ratio = hX;
          } else {
            // resize by width
            currentCanvas.ratio = wX;
          };

        }

        if(isRotatedImage) {
          // special rorate
          var cWidth = img.height,
              cHeight = img.width;
        }
        else {
          var cWidth = img.width,
              cHeight = img.height;
        };

        var defaultCrops = require("UtilCrop").getDefaultCrop(cWidth, cHeight, currentCanvas.oriWidth, currentCanvas.oriHeight);
        var px = defaultCrops.px,
          py = defaultCrops.py,
          pw = defaultCrops.pw,
          ph = defaultCrops.ph;
        currentCanvas.params.push({
          id: 0,
          elType: 'image',
          // url: sourceImageUrl,
          url: img.url,
          isRefresh: false,
          text: '',
          // x: currentCanvas.oriWidth * (parseFloat($(sXml).find('frameBoard').eq(k).find('elements').eq(i).find('element').eq(j).attr('px')) || 0),
          x: 0,
          // y: currentCanvas.oriHeight * (parseFloat($(sXml).find('frameBoard').eq(k).find('elements').eq(i).find('element').eq(j).attr('py')) || 0),
          y: 0,
          // width: currentCanvas.oriWidth * (parseFloat($(sXml).find('frameBoard').eq(k).find('elements').eq(i).find('element').eq(j).attr('pw')) || 0),
          width: currentCanvas.oriWidth,
          // height: currentCanvas.oriHeight * (parseFloat($(sXml).find('frameBoard').eq(k).find('elements').eq(i).find('element').eq(j).attr('ph')) || 0),
          height: currentCanvas.oriHeight,
          rotate: 0,
          dep: 1,
          imageId: img.id,
          imageGuid: img.guid,
          imageWidth: img.width,
          imageHeight: img.height,
          imageRotate: img.orientation || 0,
          // imageFlip: ,
          cropPX: px,
          cropPY: py,
          cropPW: pw,
          cropPH: ph,
          fontFamily: '',
          fontSize: 0,
          fontWeight: '',
          textAlign: '',
          fontColor: '',
          style: {
            brightness: 0
          }
        });
      }
      //require("ProjectService").getNewPrintPrice();
      // require("CanvasController").syncProjectData();
      this.showItem();
      // if(Store.newUploadedImg){
      //    Store.newUploadedImg.length = 0;
      // }
    },

    replacePageImage: function(imgs) {
      var img = Array.isArray(imgs) && imgs[0];
      var rotated = false;
      if(img) {
        var isRotatedImage = Math.abs(img.orientation || 0) / 90 % 2 === 1;

        if (isRotatedImage) {
          rotated = img.width >= img.height;
        } else {
          rotated = img.width < img.height;
        }
        var currentProject = Store.projectSettings[Store.watchData.replacePageId];
        currentProject.rotated = rotated;
        var baseSize = JsonProjectManage.getPrintBaseSize({
            size: currentProject.size,
            rotated: rotated
          });
        var bleedings = JsonProjectManage.getPrintBleed({
          size: currentProject.size,
          rotated: currentProject.rotated
        });

        var currentCanvas = this.sharedStore.pages[Store.watchData.replacePageId].canvas;

        var currentCanvas = Store.pages[Store.watchData.replacePageId].canvas;
        currentCanvas.oriWidth = baseSize.width + bleedings.left + bleedings.right;
        currentCanvas.oriHeight = baseSize.height + bleedings.top + bleedings.bottom;
        currentCanvas.bleedings = bleedings;
        currentCanvas.baseSize = baseSize;
        Store.imageList = this.removeImageFromImageList(currentCanvas.params[0]);
        var boxLimit = require("UtilWindow").getPrintBoxLimit();
        if (boxLimit.width > 0 && boxLimit.height > 0) {
          var objWidth = currentCanvas.oriWidth;
          var objHeight = currentCanvas.oriHeight;
          var wX = boxLimit.width / objWidth,
            hX = boxLimit.height / objHeight;
          if (wX > hX) {
            currentCanvas.ratio = hX;
          } else {
            currentCanvas.ratio = wX;
          };
        }
        var isRotatedImage = Math.abs(img.orientation || 0) / 90 % 2 === 1;

        if(isRotatedImage) {
          // special rorate
          var cWidth = img.height,
              cHeight = img.width;
        }
        else {
          var cWidth = img.width,
              cHeight = img.height;
        };

        var defaultCrops = require("UtilCrop").getDefaultCrop(cWidth, cHeight, currentCanvas.oriWidth, currentCanvas.oriHeight);
        var px = defaultCrops.px,
          py = defaultCrops.py,
          pw = defaultCrops.pw,
          ph = defaultCrops.ph;
        var currentParam = currentCanvas.params[0];
        currentParam.url = img.url;
        currentParam.rotate = 0;
        currentParam.imageRotate = img.orientation || 0;
        currentParam.width = currentCanvas.oriWidth;
        currentParam.height = currentCanvas.oriHeight;
        currentParam.imageId = img.id;
        currentParam.imageGuid = img.guid;
        currentParam.imageWidth = img.width;
        currentParam.imageHeight = img.height;
        currentParam.cropPX = px;
        currentParam.cropPY = py;
        currentParam.cropPW = pw;
        currentParam.cropPH = ph;
      }
      // currentParam.isRefresh = true;
      Store.watchData.replacePageId = null;
      this.clearItemElement();
      this.showItem();
    },

    removeImageFromImageList: function(param) {
      var imageId = param && param.imageId;

      if(imageId) {
        var currentCanvas = this.sharedStore.pages[Store.watchData.replacePageId].canvas;
        var newImageList = Store.imageList.filter(function(imageItem) {
          if(imageItem.id == imageId){
            Store.deleImagelist.push(imageItem.encImgId)
          }
          return imageItem.id !== imageId;
        });

        return newImageList.map(function(imageItem, idx) {
          imageItem.order = idx;
          return imageItem;
        });
      } else {
        return Store.imageList;
      }
    },

    addPhotos: function() {
      Store.watchData.replacePageId = null;
      Store.vm.$broadcast("notifyShowImageUpload");
      require('trackerService')({ev: require('trackerConfig').AddPhotos});
    },
    deletePhoto: function() {

      this.clearItemElement();

      for (var i = 0; i < this.sharedStore.pages.length; i++) {
        if (this.sharedStore.pages[i].idx == Store.watchData.deletePageId) {
          //console.log("imageId",this.sharedStore.pages[i].canvas.params[0].imageId);
          var imageId=this.sharedStore.pages[i].canvas.params[0].imageId;
          var imageNum=0;
          for(var j = 0; j < this.sharedStore.pages.length; j++){
             if(this.sharedStore.pages[j].canvas.params[0].imageId==imageId){
              imageNum++;
             }
          }
          //console.log("imageNum",imageNum);
          if(imageNum==1){
            for(var k=0;k<this.sharedStore.imageList.length;k++){
              if(this.sharedStore.imageList[k].id == imageId){
                this.sharedStore.deleImagelist.push(this.sharedStore.imageList[k].encImgId)
                this.sharedStore.tempImageInfo=this.sharedStore.imageList.splice(k,1);
              }
            }
          }else{
          }
          var deleteId = Store.watchData.deletePageId;
          this.sharedStore.tempId = Store.watchData.deletePageId;
          this.sharedStore.tempProjectSettings = this.sharedStore.projectSettings.splice(deleteId, 1);
          this.sharedStore.tempParams = this.sharedStore.pages.splice(deleteId, 1);
        }
      }
      if (this.sharedStore.pages.length == 0) {
        this.sharedStore.watches.isFirstProjectLoaded = false;
      }
      this.freshItemIndexes();
      this.showItem();
    },

    recoverDeletedPhoto: function() {
      var _this = this;
      _this.clearItemElement();
      _this.sharedStore.pages.splice(_this.sharedStore.tempId, 0, _this.sharedStore.tempParams[0]);
      _this.sharedStore.projectSettings.splice(_this.sharedStore.tempId, 0, _this.sharedStore.tempProjectSettings[0]);
      //_this.sharedStore.imageList.splice(_this.sharedStore.tempId, 0,_this.sharedStore.tempImageInfo[0]);
      if(_this.sharedStore.tempImageInfo&&_this.sharedStore.tempImageInfo[0]){
        _this.sharedStore.imageList.push(Object.assign({},_this.sharedStore.tempImageInfo[0]));
        _this.sharedStore.tempImageInfo.length=0;
      }

      _this.freshItemIndexes();
      _this.showItem();

    },

    duplicatePhoto: function() {
      var _this = this;
      _this.clearItemElement();
      var duplicateId = Store.watchData.duplicatePageId;
      var tempParams = _this.sharedStore.pages.slice(duplicateId, duplicateId + 1);
      var tmpP = $.extend(true, {}, tempParams[0]);
      tmpP.guid = require('UtilProject').guid();
      console.log(tmpP);

      var tempProjectSettings = _this.sharedStore.projectSettings.slice(duplicateId, duplicateId + 1);
      var tmpPs = $.extend(true, {}, tempProjectSettings[0]);

      this.sharedStore.pages.splice(duplicateId + 1, 0, tmpP);

      this.sharedStore.projectSettings.splice(duplicateId + 1, 0, tmpPs);

      _this.freshItemIndexes();
      _this.showItem();
    },

    freshItemIndexes: function() {
      for (var i = 0; i < this.sharedStore.pages.length; i++) {
        this.sharedStore.pages[i].idx = i;
      };
      console.log(this.sharedStore.pages)
    },
    freshPages:function(){
      this.privateStore.pages.length = 0;
    }

  },
  events: {
    notifyShowItem: function(reload) {
      this.showItem(reload);
    },
    notifyFreshItemIndexes: function() {
      this.freshItemIndexes();
    },
    notifyAddMyPhotosIntoPages: function(myPhotoImages) {
      this.addImagesIntoPages(myPhotoImages);
    },
    notifyAddNewUploadedImgIntoPages: function() {
      if(!(typeof(Store.watchData.replacePageId) == "number")) {
        this.addImagesIntoPages(this.sharedStore.newUploadedImg);
      } else {
        this.replacePageImage(this.sharedStore.newUploadedImg);
      }
      this.sharedStore.newUploadedImg.length=0;
    },
    notifyDeletePhoto: function() {
      this.deletePhoto();
    },
    notifyRecoverDeletedPhoto: function() {
      this.recoverDeletedPhoto();
    },
    notifyDuplicatePhoto: function() {
      this.duplicatePhoto();
    },
    notifyFreshPages:function(){
      this.freshPages();
    }
  },
  ready: function() {
    var _this = this;
    _this.$watch('sharedStore.watches.isDuplicate', function() {
      if (_this.sharedStore.watches.isDuplicate) {
        _this.sharedStore.watches.isDuplicate = false;
        _this.duplicatePhoto();
        Store.watchData.duplicatePageId = '';
      }
    })
    _this.$watch('sharedStore.watches.isProjectLoaded',function(){
        if(_this.sharedStore.watches.isProjectLoaded){
           for(var i=0;i<_this.sharedStore.pages.length;i++){
              _this.sharedStore.initQuantitys.push(+_this.sharedStore.projectSettings[i].quantity);
           }
        }
    })
  }
};
