var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");
var UtilMath = require('UtilMath');
module.exports = {
  template: '<div v-show="sharedStore.isCanvas" class="upgrade-box-mirror{{idx}}">'+
                '<canvas id="upgrade-mirror-right{{idx}}" width="{{ vMirrorLength+1 }}px" height="{{ h  }}px" v-bind:style="{top : vMirrorLength/2 + top - vMirrorLength +  \'px\', left: rLeft +\'px\', zIndex: windowZindex-1}" style="position:absolute;background:#f0f0f0;"></canvas>'+
                '<canvas id="upgrade-mirror-top{{idx}}" height="{{ vMirrorLength+1 }}px" width="{{ w  }}px" v-bind:style="{top: top + \'px\', left: left +\'px\', zIndex: windowZindex}" style="position:absolute;"></canvas>'+
               
            '</div>',
  data: function() {
    return {
      sharedStore : Store,
      borderShow : false,
      mirrorShow : false,
      mirrorPageIdx:0,
      mirrorPageRatio:0,
      w:100,
      h:100,
      left:100,
      top:100,
      rLeft:100,
      vMirrorLength:100
    };
  },
  props:[
    "ratio",
    "idx"
  ],

  computed: {

      windowZindex: function() {
        var currentCanvas = Store.upgradeCanvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 9) * 100;
      },


  },
  methods: {
      createMirror : function(){
          var currentCanvas =  Store.upgradeCanvas;
          var w = this.w,
              h = this.h,
              screenshot = $("#upgrade-photoElementCanvas"+this.mirrorPageIdx+"0"),
              imageData,oldData,newData,mLength;
          var screenshotName="upgrade-photoElementCanvas"+this.mirrorPageIdx+"0";
          console.log("createMirror",currentCanvas);
          mLength = this.sharedStore.mirrorLength * this.mirrorPageRatio;
          imageData = DrawManage.getImageData(screenshotName,0,0,screenshot.get(0).width,screenshot.get(0).height);
          DrawManage.fillImageData(screenshotName,imageData);
          var w = screenshot.get(0).width, h = screenshot.get(0).height;
          if(this.sharedStore.isMirrorBorder){
           
              imageData = DrawManage.getImageData(screenshotName,0,0,w,mLength);
              newData = DrawManage.createImageData("upgrade-mirror-top"+this.mirrorPageIdx,w,mLength);
              newData = DrawManage.imageDataVRevert(imageData,newData);
              DrawManage.fillImageData("upgrade-mirror-top"+this.mirrorPageIdx,newData,mLength,0,w,mLength);
              imageData = DrawManage.getImageData(screenshotName,w - mLength,0,mLength,h);
              DrawManage.fillImageData("upgrade-mirror-right"+this.mirrorPageIdx,imageData,0,mLength,mLength,h);
          }
          imageData = DrawManage.wrapBorder("upgrade-mirror-top"+this.mirrorPageIdx,"top");
          DrawManage.clear("upgrade-mirror-top"+this.mirrorPageIdx);
          DrawManage.fillImageData("upgrade-mirror-top"+this.mirrorPageIdx,imageData,0,0,imageData.width,imageData.height);
          imageData = DrawManage.wrapBorder("upgrade-mirror-right"+this.mirrorPageIdx,"right");
          DrawManage.clear("upgrade-mirror-right"+this.mirrorPageIdx);
          DrawManage.fillImageData("upgrade-mirror-right"+this.mirrorPageIdx,imageData,-1,1,imageData.width,imageData.height);
          Store.vm.$broadcast("upgrade-notifyRefreshRealScreenshot",this.idx,this.ratio);
      },
      refreshMirror : function(){
          DrawManage.clear("upgrade-mirror-top"+this.mirrorPageIdx);
          DrawManage.clear("upgrade-mirror-right"+this.mirrorPageIdx);
          this.createMirror();
      },
      clearMirror : function(idx){
          
            DrawManage.clear("upgrade-mirror-top"+idx);
            DrawManage.clear("upgrade-mirror-right"+idx);
      }

  },
  events: {
      notifyRefreshUpgradeMirror: function(idx,ratio){
        console.log('notifyRefreshUpgradeMirror');
        this.mirrorPageIdx=idx;
        this.mirrorPageRatio=ratio;
        var currentCanvas =  Store.upgradeCanvas;
        this.w = currentCanvas.oriWidth * this.ratio;
        this.h = currentCanvas.oriHeight * this.ratio;
        this.left = currentCanvas.oriX * this.ratio;
        this.top = (currentCanvas.oriY+currentCanvas.realBleedings.top) * this.ratio;
        this.vMirrorLength = (currentCanvas.realBleedings.top+currentCanvas.canvasBordeThickness.top) * this.ratio;
        this.rLeft = (currentCanvas.oriX + currentCanvas.frameBaseSize.width) * this.ratio + this.vMirrorLength ;
        var _this = this;
        setTimeout(function(){
          _this.refreshMirror();
        });
      }
  },
  ready: function() {
  }
};
