var UtilMath = require("UtilMath");

module.exports = {
  // template: '#t-image-upload',
  template: '<div class="bed-matting-change" v-show="privateStore.isMattingChangeShow">'+
              '<div class="shadow-bg" v-bind:style="{zIndex:windowZindex}"></div>'+
              '<div class="box-matting-change fix-center" v-bind:style="{zIndex:windowZindex}" style="background-color: #fff;width: 520px;padding-bottom: 30px;overflow:visible" >'+
                '<div style="height: 40px:line-height: 40px;">'+
                  '<div style="width: 40px;height: 40px;margin-left: 480px;font-size: 20px;"><img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="hideMattingChange" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="margin-top: 24px; margin-left: 4px; cursor: pointer;" /></div>' +
                '</div>'+
                '<div style="margin: 0 30px;">'+
                  '<div class="font-normal t-center" style="font-size: 20px;color: #3a3a3a;">Matting requires the glass frame option</div>'+
                '</div>'+
                '<div class="font-light t-center" style="margin:14px 100px 24px;font-size:14px;color:#7b7b7b;line-height:1.5;">Option for matting will also change your frame from \"glassless\" to \"glass\".</div>'+
                '<div style="margin: 24px 0 0; text-align:center;">'+
                  '<div class="button-white t-center" v-on:click="hideMattingChange" style="margin-right: 40px;border: 1px solid #7b7b7b;text-align: center;width: 135px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">Cancel</div>'+
                  '<div class="button-white t-center" v-on:click="handleMattingChange" style="border: 1px solid #7b7b7b;text-align: center;width: 135px;height: 40px;line-height: 40px;display: inline-block;font-size: 14px;">OK</div>'+
                '</div>'+
              '</div>'+
            '</div>',
  data: function() {
    return {
      privateStore: {
        id:'',
        value:'',
        isMattingChangeShow: false
      },
      sharedStore: Store
    };
  },
  computed: {
    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
        elementTotal = currentCanvas.params.length || 0;
      return (elementTotal + 99) * 100;
    }
  },
  methods: {
    hideMattingChange: function() {
      this.privateStore.isMattingChangeShow = false;
      this.$dispatch("dispatchOptionItemSelect",'matteStyle','none');
    },
    handleMattingChange: function() {
      this.privateStore.isMattingChangeShow = false;
      this.sharedStore.isSwitchLoadingShow = true;
      this.$dispatch("dispatchOptionItemSelect",'matteStyle',this.privateStore.value);
    }
  },
  events: {
    notifyShowMattingChange: function(id,value) {
      this.privateStore.id = id;
      this.privateStore.value = value;
      this.privateStore.isMattingChangeShow = true;
    }
  }
}
