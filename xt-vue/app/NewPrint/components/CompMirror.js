var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");
var UtilMath = require('UtilMath');
module.exports = {
  template: '<div v-show="sharedStore.isCanvas" class="box-mirror">'+
                '<canvas id="mirror-top" height="{{ vMirrorLength+1 }}px" width="{{ w  }}px" v-bind:style="{top: top + \'px\', left: left +\'px\', zIndex: windowZindex}" style="position:absolute;"></canvas>'+
                '<canvas id="mirror-right" width="{{ vMirrorLength+1 }}px" height="{{ h  }}px" v-bind:style="{top : vMirrorLength/2 + top - vMirrorLength +  \'px\', left: rLeft +\'px\', zIndex: windowZindex-1}" style="position:absolute;background: #fff;"></canvas>'+
            '</div>',
  data: function() {
    return {
      sharedStore : Store,
      borderShow : false,
      mirrorShow : false
    };
  },
  computed: {
      w : function(){
          var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;
          return currentCanvas.width;
      },
      h : function(){
          var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;
          return currentCanvas.height;
      },
      left : function(){
        var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;

        return currentCanvas.oriX * currentCanvas.ratio;
      },
      top : function(){
        var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;

        return currentCanvas.oriY * currentCanvas.ratio;
      },
      rLeft : function(){
          var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;

          return (currentCanvas.oriX + currentCanvas.frameBaseSize.width) * currentCanvas.ratio + this.vMirrorLength ;
      },

      vMirrorLength: function() {
        var currentCanvas =  Store.pages[Store.selectedPageIdx].canvas;

        return this.sharedStore.mirrorLength * currentCanvas.ratio;
      },

      windowZindex: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 9) * 100;
      },


  },
  methods: {
      createMirror : function(){
          var client = DrawManage.getClient("screenshot"),
              w = this.w,
              h = this.h,
              shotCtx = client.context,
              currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              container = $("#container"),
              screenshot = $("#screenshot"),
              imageData,oldData,newData,mLength;
          mLength = this.sharedStore.mirrorLength * currentCanvas.ratio;
          console.log('mLength', this.sharedStore.mirrorLength);
          imageData = DrawManage.getImageData("screenshot",0,0,screenshot.get(0).width,screenshot.get(0).height);
          DrawManage.fillImageData("screenshot",imageData);
          var w = screenshot.get(0).width, h = screenshot.get(0).height;
          if(this.sharedStore.isMirrorBorder){
              //draw mirror
              //top
              imageData = DrawManage.getImageData("screenshot",0,mLength,w - mLength,mLength);
              newData = DrawManage.createImageData("mirror-top",w - mLength,mLength);
              newData = DrawManage.imageDataVRevert(imageData,newData);
              DrawManage.fillImageData("mirror-top",newData,0,0,w - mLength,mLength);
              //right
              imageData = DrawManage.getImageData("screenshot",w - 2 * mLength,mLength,mLength,Math.ceil(h-mLength/2));
              newData = DrawManage.createImageData("mirror-right",mLength,Math.ceil(h-mLength/2));
              DrawManage.fillImageData("mirror-right",imageData,0,mLength,mLength,Math.ceil(h-mLength/2));
              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
          }else if(this.sharedStore.isColorBorder){
              var color = UtilMath.decToHex(this.sharedStore.bgColor);
              //fill with color
              DrawManage.drawRect("mirror-top",color,0,0,w-mLength,mLength);

              DrawManage.drawRect("mirror-right",color,0,0,mLength,h);

              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
          }else{
              $("#overlay-top,#overlay-bottom").width = this.w;
              $("#overlay-left,#overlay-right").height = this.h;
              var rBorderData = DrawManage.getImageData("screenshot",w - mLength,0,mLength,h),
                  tBOrderData = DrawManage.getImageData("screenshot",0,0,w-mLength,mLength);
                newData = DrawManage.createImageData("mirror-right",mLength,Math.ceil(h-mLength/2));
                newData = DrawManage.imageDataHRevert(rBorderData,newData);
                DrawManage.fillImageData("mirror-right",newData,0,mLength-this.vMirrorLength,mLength,h);
                DrawManage.fillImageData("mirror-top",tBOrderData,0,0,w,mLength);
          }
          imageData = DrawManage.wrapBorder("mirror-top","top");
          DrawManage.clear("mirror-top");
          imageData = DrawManage.fillEmptyDataWithColor(imageData,{r:255,g:255,b:255});
          imageData = DrawManage.replaceColor(imageData,imageData.width-mLength-mLength/2+2,0,{r:255,g:255,b:255});
          DrawManage.fillImageData("mirror-top",imageData,0,0,imageData.width,imageData.height);
          imageData = DrawManage.wrapBorder("mirror-right","right");
          DrawManage.clear("mirror-right");
          DrawManage.fillImageData("mirror-right",imageData,0,0,imageData.width,imageData.height);
          Store.vm.$broadcast("notifyRefreshRealScreenshot");
      },
      refreshMirror : function(){
          DrawManage.clear("mirror-top");
          DrawManage.clear("mirror-right");
          this.createMirror();
      }
  },
  events: {
      notifyRefreshMirror : function(){

        // this.refreshMirror();
      }
  },
  ready: function() {
  }
};
