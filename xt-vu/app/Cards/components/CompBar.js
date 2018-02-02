var ParamsManage = require('ParamsManage');
// component -- bar

module.exports = {
  template: '<div class="box-bar"  v-bind:style="{ width: boxWidth + \'px\', left: boxLeft + \'px\', top: boxTop + \'px\', zIndex: windowZindex }" data-html2canvas-ignore="true">' +
              '<!-- image bars -->' +
              // '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(-90)" title="Rotate left" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-rotate-left.png" alt="RF" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              // '</span>' +

              // 图像编裁剪按钮的旧样式和新样式
              //  '<span class="button" v-if="type === \'image\'" v-on:click="handleEditImage()" title="Click to crop image" style="isplay: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-crop.png" alt="CR" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              // '</span>' +
              '<span class="button" v-if="type === \'image\' && hasImage" v-on:click="handleEditImage()" title="Click to crop image" />' +
                'Crop'+
              '</span>' +

              // 图片旋转按钮的旧样式和新样式
              // '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(90)" title="Rotate image" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-rotate-right.png" alt="RR" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +
              '<span class="button" v-if="type === \'image\' && hasImage" v-on:click="handleRotate(90)" title="Rotate image">' +
                'Rotate' +
              '</span>' +


              // '<span class="button" v-if="type === \'image\'" v-on:click="handleHCenterImage()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +

              // 图片移除按钮的旧样式和新样式
              // '<span class="button" v-if="type === \'image\'" v-on:click="handleRemoveImage()" title="Delete image or layer" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
              // '</span>' +
              // Blank Card禁止删除图片元素框
              // 非Blank Card可以删除元素框
              '<span class="button" v-if="type === \'image\' && (!sharedStore.isBlankCard || (sharedStore.isBlankCard && hasImage))" v-on:click="handleRemoveImage()" title="Delete image or layer">' +
                'Remove' +
              '</span>' +

              //  图片层级设置按钮的就样式和新样式
              // '<span class="button"  v-if="type === \'image\'" v-on:click.stop="handleLayer()" title="Layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +
              '<span class="button has-subnav" v-if="type === \'image\' && hasImage && sharedStore.isPortal" v-on:mouseover="handleLayer" v-on:mouseout="handleLayer" v-on:click.prevent.stop="" title="Layer">' +
                'Layer' +
              '</span>'+

              '<!-- text bars -->' +
              // 文本编辑 按钮 的旧样式和新样式
              // '<span class="button" v-if="type === \'text\'" v-on:click="handleEditText()" title="Edit" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-edit.png" alt="ET" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              // '</span>' +
              '<span class="button" v-if="type === \'text\' && istextEditShow" v-on:click="handleEditText()" title="Edit">' +
                'Edit' +
              '</span>'+

              // '<span class="button" v-if="type === \'text\'" v-on:click="handleHCenterText()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +

              // 文本移除按钮的旧样式和新样式
              // '<span class="button" v-if="type === \'text\'" v-on:click="handleRemoveText()" title="Remove" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
              // '</span>' +
              '<span class="button" v-if="type === \'text\' && istextEditShow" v-on:click="handleRemoveText()" title="Remove">' +
                'Remove' +
              '</span>'+

              // 文本层级设置按钮的 旧样式和新样式
              // '<span class="button" v-if="type === \'text\'" v-on:click.stop="handleLayer()" title="layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +
              '<span class="button has-subnav" v-if="type === \'text\' && sharedStore.isPortal" v-on:mouseover="handleLayer" v-on:mouseout="handleLayer" v-on:click.prevent.stop="" title="layer">' +
                'Layer' +
              '</span>'+

              '<!-- decoration bars -->' +

              //装饰移除
               '<span class="button" v-if="type === \'decoration\'" v-on:click="handleRemoveDecoration()" title="Remove">' +
                'Remove' +
              '</span>'+

              // 文本层级设置按钮的 旧样式和新样式
              // '<span class="button" v-if="type === \'text\'" v-on:click.stop="handleLayer()" title="layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
              //   '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              // '</span>' +
              '<span class="button has-subnav" v-if="type === \'decoration\' && sharedStore.isPortal" v-on:mouseover="handleLayer" v-on:mouseout="handleLayer" v-on:click.prevent.stop="" title="layer">' +
                'Layer' +
              '</span>'+

              '<subbar-panel v-bind:idx="idx"></subbar-panel>' +
            '</div>',
  data: function() {
    return {
      // boxWidth: 165,
      boxHeight: 30,
      id : 0,
      sharedStore : Store,
      istextEditShow: false
    };
  },
  computed: {
    boxWidth: function() {
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      // if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'image') {
      //   return 13;
      // }
      // else if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'text') {
      //   return 105;
      // }
      // else {
      //   return 0;
      // };
      return 130;
    },

    idx : function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      return currentCanvas.selectedIdx;
    },

    boxLeft: function() {
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
      //     idx = currentCanvas.selectedIdx,
      //     parentEl = currentCanvas.params[idx];
      // this.width = parentEl.width * currentCanvas.ratio;
      // var extendSize = -1 * (this.width - this.boxWidth) / 2;

      // if((parentEl.x * currentCanvas.ratio - extendSize) < 0) {
      //   // over left side
      //   // return (this.width - this.boxWidth) / 2 + Math.abs(parentEl.x * currentCanvas.ratio - extendSize);
      //   return 4;
      // }
      // else if((parentEl.x * currentCanvas.ratio + this.width + extendSize) > currentCanvas.width) {
      //   // over right side
      //   // return (this.width - this.boxWidth) / 2 - Math.abs(parentEl.x * currentCanvas.ratio + this.width + extendSize - currentCanvas.width);
      //   var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      //   return currentCanvas.width - this.boxWidth - 4;
      // }
      // else {
      //   // normal case
      //   return (this.width - this.boxWidth) / 2 + parentEl.x * currentCanvas.ratio;
      // };
       var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx],
          ProjectManage = require("ProjectManage");
      if(((parentEl.x)*currentCanvas.ratio)>this.sharedStore.barPosition.x){
        return ((parentEl.x)*currentCanvas.ratio)
      }else if((currentCanvas.width-135)<this.sharedStore.barPosition.x){
        return (currentCanvas.width-135);
      }else{
        return this.sharedStore.barPosition.x;
      }

    },

    boxTop: function() {
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
      //     idx = currentCanvas.selectedIdx,
      //     parentEl = currentCanvas.params[idx];
      // this.height = parentEl.height * currentCanvas.ratio;
      // if((parentEl.y * currentCanvas.ratio + this.height + this.boxHeight + 4) >= (currentCanvas.height - 10)) {
      //     return currentCanvas.height - this.boxHeight - 4;
      // }
      // else {
      //   return parentEl.y * currentCanvas.ratio + parentEl.height * currentCanvas.ratio + 4;
      // };
       var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx],
          ProjectManage = require("ProjectManage");
      if(((parentEl.y)*currentCanvas.ratio)>this.sharedStore.barPosition.y){
        return ((parentEl.y)*currentCanvas.ratio);
      }else if((currentCanvas.height-105)<this.sharedStore.barPosition.y){
        return (currentCanvas.height-105);
      }else{
        return this.sharedStore.barPosition.y;
      }
    },

    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 10) * 100;
    },

    type : function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        return currentCanvas.params[currentCanvas.selectedIdx].elType ? currentCanvas.params[currentCanvas.selectedIdx].elType : '';
    },

    istextEditShow: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      if(this.sharedStore.isPortal || !currentCanvas.params[this.idx].tagType) {
        return true;
      }
      return false;
    },

    hasImage : function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      if(currentCanvas.params[this.idx].imageId) {
        return true;
      }
      return false;
    },
  },
  methods: {
     handleRemoveImage: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'image' });
      if(!Store.isPortal) {
        var currentParam = currentCanvas.params[idx];

        if(!currentParam.imageId) {
          Store.removeImageFrameCount++;
        }

        require('trackerService')({
          ev: require('trackerConfig').ClickRemove,
          type: currentParam.imageId ? 'image' : 'photoFrame'
        });
      }

      Store.watchData.removeElementIdx = idx;
      Store.watchData.removeElementType = 'image';
      Store.watches.isRemoveElement = true;
    },

    handleRotate: function(nDegree) {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;
      this.sharedStore.isSwitchLoadingShow = true;
      Store.vm.$broadcast('notifyRotateImage', { idx: idx, nDegree: nDegree });
      require('trackerService')({ev: require('trackerConfig').ClickRotateImage});
    },

    handleEditImage: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      Store.watchData.cropImageIdx = idx;
      Store.watches.isCropThisImage = true;
      require('trackerService')({ev: require('trackerConfig').ClickCropImage});
    },
    handleLayer : function(){
      this.sharedStore.isEditLayerShow = !this.sharedStore.isEditLayerShow;
    },
    handleRemoveDecoration: function(){
       var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      Store.watchData.removeElementIdx = idx;
      Store.watchData.removeElementType = 'decoration';
      Store.watches.isRemoveElement = true;

    },
    handleEditText: function() {
      Store.watches.isChangeThisText = true;
    },
    handleRemoveText: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      if(!Store.isPortal) {
        var currentParam = currentCanvas.params[idx];

        require('trackerService')({
          ev: require('trackerConfig').ClickRemove,
          type: 'text'
        });
      }

      Store.watchData.removeElementIdx = idx;
      Store.watchData.removeElementType = 'text';
      Store.watches.isRemoveElement = true;
      Store.removeTextFrameCount++;

      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'text' });
    },

  },
  events: {

  },
  ready : function(){
    // if(this.type === 'image') {
    //     this.boxWidth = 165;
    //   }
    //   else if(this.type === 'text') {
    //     this.boxWidth = 105;
    //   };
  }
};
