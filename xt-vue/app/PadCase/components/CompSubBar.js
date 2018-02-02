var ParamsManage = require('ParamsManage');
// component -- bar

module.exports = {
  template: '<ul class="sub-box-bar" v-show="sharedStore.isEditLayerShow" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: -175px;right: -20px;">' +
              '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
              '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
              '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
              '<li class="button" v-on:click="handleBackward" title="Send Backword" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backword</li>' +
            '</ul>',
  props: [
    'idx'
  ],
  data: function() {
    return {
      boxWidth: 150,
      boxHeight: 30,
      sharedStore : Store
    };
  },
  computed: {
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
