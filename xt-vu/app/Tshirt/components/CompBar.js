var ParamsManage = require('ParamsManage');
// var CanvasController = require('CanvasController');

// component -- bar

module.exports = {
  template: '<div class="box-bar" v-bind:style="{ width: boxWidth + \'px\', left: boxLeft + \'px\', top: boxTop + \'px\', zIndex: windowZindex }">' +
              '<!-- image bars -->' +
              // '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(-90)" title="Rotate left" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
              //   '<img draggable="false" src="../../static/img/bar-rotate-left.png" alt="RF" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              // '</span>' +
              '<span class="button" v-if="type === \'image\'" v-on:click="handleEditImage()" title="Click to crop image" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
                '<img draggable="false" src="../../static/img/bar-crop.png" alt="CR" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              '</span>' +
              '<span class="button" v-if="type === \'image\'" v-on:click="handleRotate(90)" title="Rotate right" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
                '<img draggable="false" src="../../static/img/bar-rotate-right.png" alt="RR" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              '</span>' +
              '<span class="button" v-if="type === \'image\'" v-on:click="handleHCenterImage()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
                '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              '</span>' +
              '<span class="button"  v-if="type === \'image\'" v-on:click.stop="handleLayer()" title="Layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
                '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              '</span>' +
              '<span class="button" v-if="type === \'image\'" v-on:click="handleRemoveImage()" title="Remove" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
                '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
              '</span>' +
              '<!-- text bars -->' +
              '<span class="button" v-if="type === \'text\'" v-on:click="handleEditText()" title="Edit" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-left-radius: 15px;border-bottom-left-radius: 15px;">' +
                '<img draggable="false" src="../../static/img/bar-edit.png" alt="ET" style="width: 20px; height: 20px; margin-top: 5px; margin-left: 3px;" />' +
              '</span>' +
              '<span class="button" v-if="type === \'text\'" v-on:click="handleHCenterText()" title="Move To Center" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
                '<img draggable="false" src="../../static/img/bar-aligncenter.png" alt="AC" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              '</span>' +
              '<span class="button"  v-if="type === \'text\'" v-on:click.stop="handleLayer()" title="layer" style="display: inline-block;width: 30px; height: 30px; margin-right: 1px;">' +
                '<img draggable="false" src="../../static/img/bar-layer.png" alt="LAYER" style="width: 20px; height: 20px; margin-top: 5px;" />' +
              '</span>' +
              '<span class="button" v-if="type === \'text\'" v-on:click="handleRemoveText()" title="Remove" style="display: inline-block;width: 35px; height: 30px; margin-right: 1px; border-top-right-radius: 15px;border-bottom-right-radius: 15px;">' +
                '<img draggable="false" src="../../static/img/bar-delete.png" alt="DEL" style="width: 20px; height: 20px; margin-top: 5px; margin-right: 3px;" />' +
              '</span>' +
              '<subbar-panel v-bind:idx="idx"></subbar-panel>' +
            '</div>',
  // props: [
  //   'id',
  //   'type',
  //   'width',
  //   'height',
  //   // 'enables'
  // ],
  data: function() {
    return {
      // boxWidth: 133,
      boxHeight: 30,
      id: 0,
      sharedStore: Store
    };
  },
  computed: {
    boxWidth: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'image') {
        return 165;
      }
      else if(currentCanvas.params[currentCanvas.selectedIdx].elType === 'text') {
        return 135;
      }
      else {
        return 0;
      };
    },

    idx : function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      return currentCanvas.selectedIdx;
    },

    boxLeft: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          // idx = ParamsManage.getIndexById(this.id),
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx];
      this.width = parentEl.width * currentCanvas.ratio;
      var extendSize = -1 * (this.width - this.boxWidth) / 2;

      if((parentEl.x * currentCanvas.ratio - extendSize) < 0) {
        // over left side
        // return (this.width - this.boxWidth) / 2 + Math.abs(parentEl.x * currentCanvas.ratio - extendSize);
        return 4;
      }
      else if((parentEl.x * currentCanvas.ratio + this.width + extendSize) > currentCanvas.width) {
        // over right side
        // return (this.width - this.boxWidth) / 2 - Math.abs(parentEl.x * currentCanvas.ratio + this.width + extendSize - currentCanvas.width);
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        return currentCanvas.width - this.boxWidth - 4;
      }
      else {
        // normal case
        return (this.width - this.boxWidth) / 2 + parentEl.x * currentCanvas.ratio;
      };

    },

    boxTop: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx];
      this.height = parentEl.height * currentCanvas.ratio;
      if((parentEl.y * currentCanvas.ratio + this.height + this.boxHeight + 4) >= (currentCanvas.height)) {
        // cannot show downside bar
        // if(parentEl.y * currentCanvas.ratio > (this.boxHeight + 10)) {
        //   // can show on topside
        //   return (this.height + 4);
        // }
        // else {
          // show bottom as fixed...
          // var hiddenInBottom = parentEl.y * currentCanvas.ratio + this.height - (currentCanvas.height - 10);
          // return hiddenInBottom + 4;
          return currentCanvas.height - this.boxHeight - 4;

          // return (this.height - this.boxHeight) / 2;
        // };
      }
      else {
        // return (0 - this.boxHeight - 4);
        return parentEl.y * currentCanvas.ratio + parentEl.height * currentCanvas.ratio + 4;
      };
    },

    // boxBottom: function() {
    //   var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
    //       // idx = ParamsManage.getIndexById(this.id),
    //       idx = currentCanvas.selectedIdx,
    //       parentEl = currentCanvas.params[idx];
    //   this.height = parentEl.height * currentCanvas.ratio;
    //
    //   if((parentEl.y * currentCanvas.ratio + this.height + this.boxHeight + 4) >= (currentCanvas.height)) {
    //     // cannot show downside bar
    //     // if(parentEl.y * currentCanvas.ratio > (this.boxHeight + 10)) {
    //     //   // can show on topside
    //     //   return (this.height + 4);
    //     // }
    //     // else {
    //       // show bottom as fixed...
    //       var hiddenInBottom = parentEl.y * currentCanvas.ratio + this.height - (currentCanvas.height);
    //       return hiddenInBottom + 4;
    //
    //       // return (this.height - this.boxHeight) / 2;
    //     // };
    //   }
    //   else {
    //     return (0 - this.boxHeight - 4);
    //   };
    // },

    windowZindex: function() {
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
      //     idx = ParamsManage.getIndexById(this.id),
      //     parentEl = currentCanvas.params[idx];
      //
      // return (parentEl.dep + 1) * 100 + 90;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 10) * 100;
    },

    type : function(){
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      return currentCanvas.params[currentCanvas.selectedIdx].elType ? currentCanvas.params[currentCanvas.selectedIdx].elType : '';
    }
  },
  methods: {
    handleRemoveImage: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      Store.watchData.removeElementIdx = idx;
      Store.watchData.removeElementType = 'image';
      Store.watches.isRemoveElement = true;

      require('trackerService')({ev: require('trackerConfig').ClickRemoveImage});
      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'image' });
    },

    handleRemoveText: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

      Store.watchData.removeElementIdx = idx;
      Store.watchData.removeElementType = 'text';
      Store.watches.isRemoveElement = true;

      // Store.vm.$broadcast('notifyDeleteElement', { idx: idx, type: 'text' });
    },

    handleRotate: function(nDegree) {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx;

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

    handleEditText: function() {
      Store.watches.isChangeThisText = true;
    },

    handleHCenterImage: function() {
      this.$dispatch('dispatchHCenter');
      require('trackerService')({ev: require('trackerConfig').ClickMoveImageToCenter});
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
      //     idx = currentCanvas.selectedIdx;
      //
      // require('CanvasController').hCenterElement(idx);
    },

    handleHCenterText: function() {
      this.$dispatch('dispatchHCenter');
      require('trackerService')({ev: require('trackerConfig').ClickMoveTextToCenter});
      // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
      //     idx = currentCanvas.selectedIdx;
      //
      // require('CanvasController').hCenterElement(idx);
    },

    handleLayer : function(){
      this.sharedStore.isEditLayerShow = !this.sharedStore.isEditLayerShow;
    },
  },
  events: {

  },
  ready: function() {
    // if(this.type === 'image') {
    //   this.boxWidth = 135;
    // }
    // else if(this.type === 'text') {
    //   this.boxWidth = 105;
    // };
  }
};
