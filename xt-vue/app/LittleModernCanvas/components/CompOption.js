module.exports = {
  template:
    '<div class="item-option" v-bind:style="containerStyle" style="position: absolute; bottom: 4px;left: 50%;transform: translateX(-50%);" v-show="!sharedStore.isPreview">' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleEdit()">' +
        '<img style="width: 16.8px; height: 16.8px; cursor: pointer;" src="./assets/img/edit.svg" />' +
        '<div class="tool-tip">Edit Image<div class="tool-tip-triangle"></div></div>' +
      '</div>' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleRotate()">' +
        '<img style="width: 23.8px; height: 23.8px; position: relative; top: -3px; cursor: pointer;" :style="rotateStyle" src="./assets/img/rotate.svg" />' +
        '<div class="tool-tip">Rotate Canvas<div class="tool-tip-triangle"></div></div>' +
      '</div>' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleDelete()">' +
        '<img style="width: 13.9px; height: 13.9px; cursor: pointer; position: relative; top: 1px;" src="./assets/img/remove.svg" />' +
        '<div class="tool-tip">Delete Canvas<div class="tool-tip-triangle"></div></div>' +
      '</div>' +

      '<div class="size-dropdown-container">' +
        '<div class="tool-tip" v-if="!sharedStore.isRemark">Switch Size<div class="tool-tip-triangle"></div></div>' +
        '<div class="size-dropdown-value">{{getSizeTitle(prj.size)}}<span class="triangle-down" v-if="!sharedStore.isRemark"></span></div>' +
        '<select class="size-dropdown" @change="changeSize($event)" v-model="prj.size" v-if="!sharedStore.isRemark">' +
          '<option v-for="size in allSize" :value="size.id" style="font-size:15px;">{{ size.title }}</option>' +
        '</select>' +
      '</div>' +
    '</div>',
  props: ['id', 'opacity'],
  data: function() {
    return {
      privateStore: {
        quantity: 1,
      },
      allSize: [],
      sharedStore: Store,
      prj: {
        size: '',
        paper: '',
        quantity: 0,
      },
      isRepainting: false
    };
  },
  computed: {
      prj: function() {
          var prj = this.sharedStore.projectSettings[this.id];
          this.privateStore.quantity = prj.quantity;
          return prj;
      },
      price: function() {
          return this.sharedStore.projectSettings[this.id].price;
      },
      containerStyle: function() {
        return {
          opacity: this.opacity,
          width: '240px',
          boxSizing: 'border-box',
        }
      },
      buttonStyle: function(){
        return {
          float: 'left',
          width: '25%',
          textAlign: 'center',
          position: 'relative',
        }
      },
      rotateStyle: function() {
        var currentProject = this.sharedStore.projectSettings[this.id];
        var width = currentProject.size.split('X')[0],
            height = currentProject.size.split('X')[1];

        if(width === height) {
          return {
            opacity: 0.5,
            cursor: 'not-allowed'
          }
        } else {
          return {
            cursor: 'pointer'
          };
        }
      }
  },
  methods: {
    getSizeTitle: function(sizeId) {
      return this.allSize.filter(function(item) {
        return item.id === sizeId;
      })[0].title;
    },
    changePageIdx: function() {
      this.sharedStore.selectedPageIdx = this.id;
      this.sharedStore.currentSelectProjectIndex = this.id;
    },

    changeSize: function(event) {
      // 更新pageIdx
      this.changePageIdx();

      var selectedSize = event.target.value;
      
      //  更新完成后，改变尺寸
      setTimeout(function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        currentProject.size = selectedSize;
        
        require('CanvasController').freshPageData(Store.currentSelectProjectIndex);
        require('CanvasController').fixResizePhotoElement();

        Store.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
        Store.vm.$broadcast('notifyRepaintCenterContainer');

        require('trackerService')({ev: require('trackerConfig').SwitchSize,size: selectedSize});
      });
    },

    handleEdit: function() {
      this.changePageIdx();

      setTimeout(function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
        idx = currentCanvas.selectedIdx;
  
        Store.watchData.cropImageIdx = idx;
        Store.watches.isCropThisImage = true;
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        require('trackerService')({ev: require('trackerConfig').ClickCropImage,orientation:currentProject.orientation});
      });
    },

    handleRotate: function() {
      // 更新pageIdx
      var _this = this;
      this.changePageIdx();

      // 更新完成后，旋转canvas
      setTimeout(function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var width = currentProject.size.split('X')[0],
            height = currentProject.size.split('X')[1];
        // 方形的LMC不可旋转，防止反复狂点使LMC旋转
        if(width === height || _this.isRepainting) {
          return;
        }

        currentProject.rotated = !currentProject.rotated;
        currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";

        Store.vm.$dispatch("dispatchRotate");
        Store.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
        require('trackerService')({ev: require('trackerConfig').SwitchOrientation,orientation: currentProject.orientation === "Landscape" ? "Landscape" : "Portrait"});

        _this.isRepainting = true;
        // 防止反复狂点使LMC旋转
        setTimeout(function() {
          _this.isRepainting = false;
        }, 500);
      });
    },

    handleDelete: function(){
      this.changePageIdx();

      setTimeout(function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var hasImage = currentCanvas.params.some(function(element){
          return (element.elType==='image' && element.imageId);
        });
        if(hasImage) {
          Store.vm.$dispatch("dispatchShowPopup", { type : 'deleteProject', status : 0, pageIdx: Store.selectedPageIdx,message:"This operation will delete this canvas, would you like to continue?" });
        } else {
          Store.vm.$broadcast('notifyDeleteProject', Store.selectedPageIdx);
        }
      });
    },
    
    fixList: function(type, oriAry) {
        if (type && oriAry) {
            var mapList = require('SpecManage').getOptions(type);
            var newAry = [];
            for (var i = 0; i < oriAry.length; i++) {
                for (var j = 0; j < mapList.length; j++) {
                    if (oriAry[i] === mapList[j].id) {
                        var nid = oriAry[i];
                        var SpecManage = require("SpecManage");
                        var keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-");
                        var params = [];
                        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
                        for (var v = 0, q = keyPatterns.length; v < q; v++) {
                            var key = currentProject[keyPatterns[v]];
                            if (key) {
                                var item = {
                                    key: keyPatterns[v],
                                    value: key
                                };
                                params.push(item);
                            }
                        }
                        var res = SpecManage.getDisableOptionsMap(type, params);
                        var resArray;
                        if (res != null) {
                            resArray = res.split(",")
                        }
                        var inDisableArray = false;
                        for (var tt in Store.disableArray) {
                            if (Store.disableArray[tt].value == oriAry[i]) {
                                inDisableArray = true;
                            }
                        }
                        if (inDisableArray || !res || (resArray && resArray.indexOf(nid) == -1)) {
                            newAry.push({
                                id: oriAry[i],
                                title: mapList[j].name || mapList[j].title || ''
                            });
                        }

                        break;
                    };
                };
            };

            return newAry;
        };
    },
  },
  events: {
  },
  ready: function() {
      var _this = this;

      this.changeSize = this.changeSize.bind(this);

      _this.allSize = require("SpecManage").getAvailableOptions('size');
      _this.allSize = _this.fixList("size", _this.allSize);

      _this.$watch("sharedStore.isReprintAll",function(){
          var prj = this.sharedStore.projectSettings[this.id];

          if(!_this.sharedStore.isReprintAll){
              prj.quantity = 0;
              _this.privateStore.quantity = 0;
          }else{
              prj.quantity = _this.sharedStore.initQuantitys[_this.id] ;
              _this.privateStore.quantity = _this.sharedStore.initQuantitys[_this.id];
          }
      });
  }
};
