module.exports = {
  template:
    '<div class="item-option" v-bind:style="containerStyle" style="position: absolute; bottom: 4px;left: 50%;transform: translateX(-50%);" v-show="!sharedStore.isPreview">' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleEdit()">' +
        '<img style="width: 16.8px; height: 16.8px; cursor: pointer;" src="./assets/img/edit.svg" />' +
        '<div class="tool-tip">Edit Image<div class="tool-tip-triangle"></div></div>' +
      '</div>' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleRotate()">' +
        '<img style="width: 23.8px; height: 23.8px; position: relative; top: -3px; cursor: pointer;" :style="rotateStyle" src="./assets/img/rotate.svg" />' +
        '<div class="tool-tip">Rotate Block<div class="tool-tip-triangle"></div></div>' +
      '</div>' +
      // '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="changeShape()">' +
      //   '<img style="width: 23.8px; height: 23.8px; position: relative; top: -3px; cursor: pointer; transform: scale(0.75);" src="./assets/img/change-shape.svg" />' +
      //   '<div class="tool-tip">Change Shape<div class="tool-tip-triangle"></div></div>' +
      // '</div>' +
      '<div v-if="!sharedStore.isRemark" class="option-list-item" @click="handleDelete()">' +
        '<img style="width: 13.9px; height: 13.9px; cursor: pointer; position: relative; top: 1px;" src="./assets/img/remove.svg" />' +
        '<div class="tool-tip">Delete Block<div class="tool-tip-triangle"></div></div>' +
      '</div>' +

      '<div class="size-dropdown-container" @click="toggleDropDown" v-el:size-drop-down>' +
        '<div class="size-dropdown-value">' +
          '<span :class="prj.shape"></span>' +
          '<span>{{getSizeTitle(prj.size)}}</span>' +
          '<img class="triangle-down" src="assets/img/dropdown.svg" v-if="!sharedStore.isRemark"></img>' +
          '<div class="tool-tip" v-if="!sharedStore.isRemark">Switch Size<div class="tool-tip-triangle"></div></div>' +
        '</div>' +
        '<div class="size-dropdown" v-show="isShowDropDown && !sharedStore.isRemark">' +
          '<div class="size-dropdown-item" v-for="size in allSize" @click="changeSize(size.id, size.shape)">' +
            '<span :class="size.shape"></span>' +
            '{{ size.title }}' +
          '</div>' +
        '</div>' +
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
      isShowDropDown: false,
      prj: {
        size: '',
        paper: '',
        quantity: 0,
      }
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
          width: '230px',
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
    toggleDropDown: function(event) {
      this.isShowDropDown = !this.isShowDropDown;
    },
    getSizeTitle: function(sizeId) {
      return this.allSize.filter(function(item) {
        return item.id === sizeId;
      })[0].title;
    },
    changePageIdx: function() {
      this.sharedStore.selectedPageIdx = this.id;
      this.sharedStore.currentSelectProjectIndex = this.id;
    },

    changeShape: function() {
      // 更新pageIdx
      var _this = this;
      this.changePageIdx();

      setTimeout(function() {
        // 获取projectSetting对象
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        // 反转project shape值
        switch(currentProject.shape) {
          case 'Round': currentProject.shape = 'Square'; break;
          case 'Square': currentProject.shape = 'Round'; break;
        }

        // 获取项目paramArray
        var optionIds = require('SpecManage').getOptionIds();
        var paramArray = [];

        optionIds.forEach(function(optionId) {
          paramArray.push({key: optionId, value: currentProject[optionId]});
        });

        // shape改变了，造成size值不一样了，因此去获取默认的size尺寸
        currentProject.size = require('SpecManage').getOptionsMapDefaultValue('size', paramArray);

        // 刷新option列表数据
        _this.allSize = require("SpecManage").getAvailableOptions('size');
        _this.allSize = _this.fixList("size", _this.allSize);

        // 重绘canvas
        require('CanvasController').freshPageData(Store.currentSelectProjectIndex);
        require('CanvasController').fixResizePhotoElement();

        Store.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
        Store.vm.$broadcast('notifyRepaintCenterContainer');
      });
    },

    changeSize: function(selectedSize, selectedShape) {
      // 更新pageIdx
      this.changePageIdx();
      
      //  更新完成后，改变尺寸
      setTimeout(function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        currentProject.size = selectedSize;
        currentProject.shape = selectedShape;
        
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
      this.changePageIdx();

      // 更新完成后，旋转canvas
      setTimeout(function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        if(currentProject.shape === 'Round' || currentProject.shape === 'Square') {
          return;
        }
        currentProject.rotated = !currentProject.rotated;
        currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";

        Store.vm.$dispatch("dispatchRotate");
        // require('CanvasController').fixResizePhotoElement();
        Store.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
        require('trackerService')({ev: require('trackerConfig').SwitchOrientation,orientation: currentProject.orientation === "Landscape" ? "Landscape" : "Portrait"});
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
          Store.vm.$dispatch("dispatchShowPopup", { type : 'deleteProject', status : 0, pageIdx: Store.selectedPageIdx,message:"This operation will delete this block, would you like to continue?" });
        } else {
          Store.vm.$broadcast('notifyDeleteProject', Store.selectedPageIdx);
        }

        Store.vm.$broadcast('notifyRepaintCenterContainer');
      });
    },
    
    fixList: function(type, oriAry) {
      // 处理LRB 特殊逻辑：不可复用！
      var SpecManage = require('SpecManage');
      var shapeList = SpecManage.getOptions('shape');
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
      var mapList = require('SpecManage').getOptions(type);
      var newArray = [];

      // 获取项目paramArray
      var optionIds = require('SpecManage').getOptionIds();
      var paramArray = [];

      optionIds.forEach(function(optionId) {
        paramArray.push({key: optionId, value: currentProject[optionId]});
      });

      // 根据shape类型来获取size
      shapeList.forEach(function(shape) {
        paramArray = paramArray.map(function(paramItem) {
          if(paramItem.key === 'shape') {
            paramItem.value = shape.id;
          }
          return paramItem;
        });

        var optionMap = SpecManage.getOptionsMap(type, paramArray);

        mapList.forEach(function(mapItem) {
          if(optionMap.indexOf(mapItem.id) !== -1) {
            newArray.push({
              id: mapItem.id,
              title: mapItem.name,
              shape: shape.id
            });
          }
        })
      });

      return newArray;
        // if (type && oriAry) {
        //     var mapList = require('SpecManage').getOptions(type);
        //     var newAry = [];
        //     for (var i = 0; i < oriAry.length; i++) {
        //         for (var j = 0; j < mapList.length; j++) {
        //             if (oriAry[i] === mapList[j].id) {
        //                 var nid = oriAry[i];
        //                 var SpecManage = require("SpecManage");
        //                 var keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-");
        //                 var params = [];
        //                 var currentProject = Store.projectSettings[this.id];
        //                 for (var v = 0, q = keyPatterns.length; v < q; v++) {
        //                     var key = currentProject[keyPatterns[v]];
        //                     if (key) {
        //                         var item = {
        //                             key: keyPatterns[v],
        //                             value: key
        //                         };
        //                         params.push(item);
        //                     }
        //                 }
        //                 var res = SpecManage.getDisableOptionsMap(type, params);
        //                 var resArray;
        //                 if (res != null) {
        //                     resArray = res.split(",")
        //                 }
        //                 var inDisableArray = false;
        //                 for (var tt in Store.disableArray) {
        //                     if (Store.disableArray[tt].value == oriAry[i]) {
        //                         inDisableArray = true;
        //                     }
        //                 }
        //                 if (inDisableArray || !res || (resArray && resArray.indexOf(nid) == -1)) {
        //                     newAry.push({
        //                         id: oriAry[i],
        //                         title: mapList[j].name || mapList[j].title || ''
        //                     });
        //                 }

        //                 break;
        //             };
        //         };
        //     };
            
        //     console.log(newAry)

        //     return newAry;
        // };
    },
    hideDropDown: function(event) {
      for(var i = 0; i < event.path.length; i++) {
        var pathItem = event.path[i];

        if(pathItem === this.$els.sizeDropDown) {
          return;
        }
      }

      this.isShowDropDown = false;
    }
  },
  events: {
  },
  ready: function() {
      var _this = this;

      this.changeSize = this.changeSize.bind(this);

      _this.allSize = require("SpecManage").getAvailableOptions('size', null, this.id);
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

      document.addEventListener('click', this.hideDropDown);
  }
};
