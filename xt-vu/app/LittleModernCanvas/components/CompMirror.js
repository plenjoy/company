var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");
var UtilMath = require('UtilMath');
module.exports = {
  template: '<div v-show="sharedStore.isCanvas" class="box-mirror{{idx}}{{main}}">'+
                '<canvas id="mirror-top{{idx}}{{main}}" height="{{ vMirrorLength+1 }}px" width="{{ w  }}px" v-bind:style="{top: top + \'px\', left: left +\'px\', zIndex: windowZindex}" style="position:absolute;"></canvas>'+
                '<canvas id="mirror-right{{idx}}{{main}}" width="{{ vMirrorLength+1 }}px" height="{{ h  }}px" v-bind:style="{top : vMirrorLength/2 + top - vMirrorLength +  \'px\', left: rLeft - 2 +\'px\', zIndex: windowZindex-1}" style="position:absolute;background:#f0f0f0;"></canvas>'+
            '</div>',
  data: function() {
    return {
      sharedStore : Store,
      borderShow : false,
      mirrorShow : false,
      mirrorPageIdx:0,
      mirrorPageRatio:0,
      extraName:''
    };
  },
  props:[
    "ratio",
    "idx",
    "main"
  ],

  computed: {
      w : function(){
          var currentCanvas =  Store.pages[this.idx].canvas;
          return currentCanvas.oriWidth * this.ratio;
      },
      h : function(){
          var currentCanvas =  Store.pages[this.idx].canvas;
          return currentCanvas.oriHeight * this.ratio;
      },
      left : function(){
        var currentCanvas =  Store.pages[this.idx].canvas;

        return currentCanvas.oriX * this.ratio;
      },
      top : function(){
        var currentCanvas =  Store.pages[this.idx].canvas;

        return (currentCanvas.oriY+currentCanvas.realBleedings.top) * this.ratio;
      },
      rLeft : function(){
          var currentCanvas =  Store.pages[this.idx].canvas;

          return (currentCanvas.oriX + currentCanvas.frameBaseSize.width) * this.ratio + this.vMirrorLength ;
      },

      vMirrorLength: function() {
        var currentCanvas =  Store.pages[this.idx].canvas;

        return (currentCanvas.realBleedings.top+currentCanvas.canvasBordeThickness.top) * this.ratio;
      },

      windowZindex: function() {
        var currentCanvas = Store.pages[this.idx].canvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 9) * 100;
      },


  },
  methods: {
      createMirror : function(){
          var w = this.w,
              h = this.h,
              currentCanvas = Store.pages[this.idx].canvas,
              screenshot = $("#photoElementCanvas"+this.mirrorPageIdx+"0"+this.extraName),
              imageData,oldData,newData,mLength;
          var screenshotName="photoElementCanvas"+this.mirrorPageIdx+"0"+this.extraName;

          /*if(this.extraName){
            screenshot = $("#photoElementCanvas"+this.mirrorPageIdx+this.extraName);
            screenshotName = "photoElementCanvas"+this.mirrorPageIdx+this.extraName;
          }*/
          mLength = this.sharedStore.mirrorLength * this.mirrorPageRatio;
          // console.log('mLength', this.sharedStore.mirrorLength);
          imageData = DrawManage.getImageData(screenshotName,0,0,screenshot.get(0).width,screenshot.get(0).height);
          DrawManage.fillImageData(screenshotName,imageData);
          var w = screenshot.get(0).width, h = screenshot.get(0).height;
          if(this.sharedStore.isMirrorBorder){
              //draw mirror
              //top
              imageData = DrawManage.getImageData(screenshotName,0,0,w,mLength);
              newData = DrawManage.createImageData("mirror-top"+this.mirrorPageIdx+this.extraName,w,mLength);
              newData = DrawManage.imageDataVRevert(imageData,newData);
              DrawManage.fillImageData("mirror-top"+this.mirrorPageIdx+this.extraName,newData,mLength,0,w,mLength);
              //right
              imageData = DrawManage.getImageData(screenshotName,w - mLength,0,mLength,h);
              //newData = DrawManage.createImageData("mirror-right"+this.mirrorPageIdx,mLength,h);
              DrawManage.fillImageData("mirror-right"+this.mirrorPageIdx+this.extraName,imageData,0,mLength,mLength,h);
              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
          }else if(this.sharedStore.isColorBorder){
              var color = UtilMath.decToHex(this.sharedStore.bgColor);
              //fill with color
              DrawManage.drawRect("mirror-top"+this.mirrorPageIdx+this.extraName,color,0,0,w-mLength,mLength);

              DrawManage.drawRect("mirror-right"+this.mirrorPageIdx+this.extraName,color,0,0,mLength,h);

              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
          }else{
              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
              var rBorderData = DrawManage.getImageData(screenshotName,w - mLength,0,mLength,h),
                  tBOrderData = DrawManage.getImageData(screenshotName,0,0,w-mLength,mLength);
                newData = DrawManage.createImageData("mirror-right"+this.mirrorPageIdx+this.extraName,mLength,Math.floor(h-mLength/2));
                newData = DrawManage.imageDataHRevert(rBorderData,newData);
                DrawManage.fillImageData("mirror-right"+this.mirrorPageIdx+this.extraName,newData,0,mLength-this.vMirrorLength,mLength,h);
                DrawManage.fillImageData("mirror-top"+this.mirrorPageIdx+this.extraName,tBOrderData,0,0,w,mLength);
          }
          imageData = DrawManage.wrapBorder("mirror-top"+this.mirrorPageIdx+this.extraName,"top");
          DrawManage.clear("mirror-top"+this.mirrorPageIdx+this.extraName);
          DrawManage.fillImageData("mirror-top"+this.mirrorPageIdx+this.extraName,imageData,0,0,imageData.width,imageData.height);
          imageData = DrawManage.wrapBorder("mirror-right"+this.mirrorPageIdx+this.extraName,"right");
          DrawManage.clear("mirror-right"+this.mirrorPageIdx+this.extraName);
          DrawManage.fillImageData("mirror-right"+this.mirrorPageIdx+this.extraName,imageData,-1,1,imageData.width,imageData.height);
          Store.vm.$broadcast("notifyRefreshRealScreenshot",this.idx,this.ratio);
      },
      refreshMirror : function(){
          DrawManage.clear("mirror-top"+this.mirrorPageIdx+this.extraName);
          DrawManage.clear("mirror-right"+this.mirrorPageIdx+this.extraName);
          this.createMirror();
      },
      clearMirror : function(idx){
          if(this.extraName){
            DrawManage.clear("mirror-top"+idx+this.extraName);
            DrawManage.clear("mirror-right"+idx+this.extraName);
          }
          
      }

  },
  events: {
      notifyRefreshMirror : function(){
        this.refreshMirror();
      },
      notifyClearMirror : function(idx){
        this.clearMirror(idx);
      },

      notifyRefreshItemMirror: function(idx,ratio,extraName){
        this.mirrorPageIdx=idx;
        this.mirrorPageRatio=ratio;
        if(extraName){
          this.extraName=extraName;
        }else{
          this.extraName="";
        }
        this.refreshMirror();
      }
  },
  ready: function() {
  }
};
