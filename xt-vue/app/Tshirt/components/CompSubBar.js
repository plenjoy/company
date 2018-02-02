var ParamsManage = require('ParamsManage');
// component -- bar

module.exports = {
  template: '<!-- top sub bar -->' +
            '<ul class="sub-box-bar" id="box-subbar-top" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'top\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: -175px;left: 0;">' +
              '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
              '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
              '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
              '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
            '</ul>' +
            '<!-- bottom sub bar -->' +
            '<ul class="sub-box-bar" id="box-subbar-bottom" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'bottom\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: 45px;left: 0;">' +
              '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
              '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
              '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
              '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
            '</ul>',
  props: [
    'idx'
  ],
  data: function() {
    return {
      boxWidth: 150,
      boxHeight: 30,
       fullBoxHeight: 165,
      sharedStore : Store
    };
  },
  computed: {
    // to determine which subbar should be shown
    toggleSubbar: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      if((currentCanvas.params[currentCanvas.selectedIdx].y + currentCanvas.params[currentCanvas.selectedIdx].height) * currentCanvas.ratio < this.fullBoxHeight) {
        // cannot display top sub bar entirly, should bottom instead
        return 'bottom';
      }
      else {
        return 'top';
      };
    },
    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          parentEl = currentCanvas.params[this.idx];

      return (parentEl.dep + 1) * 100 + 90;
    }
  },
  methods: {
    handleToFront : function(){
      require("CanvasController").sendToFront({idx:this.idx});
      this.sharedStore.isEditLayerShow = false;
    },

    handleToBack : function(){
      require("CanvasController").sendToBack({idx:this.idx});
      this.sharedStore.isEditLayerShow = false;
    },

    handleForward : function(){
      require("CanvasController").bringForward({idx:this.idx});
      this.sharedStore.isEditLayerShow = false;
    },

    handleBackward : function(){
      require("CanvasController").bringBackward({idx:this.idx});
      this.sharedStore.isEditLayerShow = false;
    },
  },
  events: {

  }
};
