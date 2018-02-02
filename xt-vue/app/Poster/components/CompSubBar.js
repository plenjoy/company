var ParamsManage = require('ParamsManage');
// component -- bar

module.exports = {
  template: '<!-- top sub bar -->' +
            // '<ul class="sub-box-bar" id="box-subbar-top" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'top\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: -175px;right: -20px;">' +
              // '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
              // '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
              // '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
              // '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
            '<ul class="sub-box-bar" id="box-subbar-top" v-on:mouseover="handleLayer" v-on:mouseout="handleLayer" v-show="sharedStore.isEditLayerShow" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex,left:left,bottom:bottom }" style="position:absolute;margin:0;padding:0;">' +
              '<span class="button" v-on:click="handleToFront" style="display: inline-block;width:100%; height: 26px;line-height: 26px;padding-left: 8px;box-sizing:border-box;text-align:left;font-size:12px;border-radius: 5px 5px 0 0;">' +
                'Bring To Front'+
              '</span>' +
              '<span class="button" v-on:click="handleToBack" style="display: inline-block;width:100%; height: 26px;line-height: 26px;padding-left: 8px;box-sizing:border-box;text-align:left;font-size:12px;border-radius: 0;border-top: 1px solid #7b7b7b;">' +
                'Send To Back'+
              '</span>' +
              '<span class="button" v-on:click="handleForward" style="display: inline-block;width:100%; height: 26px;line-height: 26px;padding-left: 8px;box-sizing:border-box;text-align:left;font-size:12px;border-radius:0;border-top: 1px solid #7b7b7b;">' +
                'Bring Forward'+
              '</span>' +
              '<span class="button" v-on:click="handleBackward" style="display: inline-block;width:100%; height: 26px;line-height: 26px;padding-left: 8px;box-sizing:border-box;text-align:left;font-size:12px;border-radius:0 0 5px 5px;border-top: 1px solid #7b7b7b;">' +
                'Send Backward'+
              '</span>' +
            '</ul>',
            // '<!-- bottom sub bar -->' +
            // '<ul class="sub-box-bar" id="box-subbar-bottom" v-show="sharedStore.isEditLayerShow && toggleSubbar ===\'bottom\'" v-bind:style="{ width: boxWidth + \'px\', zIndex: windowZindex }" style="position:absolute;margin:0;padding:0;top: 45px;right: -20px;">' +
            //   '<li class="button" v-on:click="handleToFront" title="Bring To Front" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring To Front</li>' +
            //   '<li class="button" v-on:click="handleToBack" title="Send To Back" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send To Back</li>' +
            //   '<li class="button" v-on:click="handleForward" title="Bring Forward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Bring Forward</li>' +
            //   '<li class="button" v-on:click="handleBackward" title="Send Backward" style="width:100%;font-size: 14px;height: 30px;line-height: 30px;padding: 5px;font-weight: lighter;">Send Backward</li>' +
            // '</ul>',
  props: [
    'idx'
  ],
  data: function() {
    return {
      boxWidth: 130,
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
    },

    left: function() {
       var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx],
          ProjectManage = require("ProjectManage");
      if(((parentEl.x)*currentCanvas.ratio)>this.sharedStore.barPosition.x){
        return ((parentEl.x)*currentCanvas.ratio)
      }else if((currentCanvas.width-260)<this.sharedStore.barPosition.x){
        return "-130px";
      }else{
        return "126px";
      }
    },

    bottom:function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          idx = currentCanvas.selectedIdx,
          parentEl = currentCanvas.params[idx],
          ProjectManage = require("ProjectManage");
          console.log("bottom");
          console.log(parentEl.elType)
      if(((parentEl.y)*currentCanvas.ratio)>this.sharedStore.barPosition.y){
        return ((parentEl.y)*currentCanvas.ratio);
      }else if(parentEl.elType=="image" && (currentCanvas.height-182)<this.sharedStore.barPosition.y){
        if((currentCanvas.height-104)<this.sharedStore.barPosition.y){
          return 0
        }else{
          return -(currentCanvas.height - this.sharedStore.barPosition.y - 104)+"px";
        }
      }else if(parentEl.elType=="text" && (currentCanvas.height-156)<this.sharedStore.barPosition.y){
        if((currentCanvas.height-78)<this.sharedStore.barPosition.y){
          return 0
        }else{
          return -(currentCanvas.height - this.sharedStore.barPosition.y - 78)+"px";
        }
      }else{
        return "-78px";
      }
    }
  },
  methods: {
    handleLayer : function(){
      this.sharedStore.isEditLayerShow = !this.sharedStore.isEditLayerShow;
    },
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
