var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");
var ParamsManage = require('ParamsManage');
module.exports = {
  template: '<div v-show="sharedStore.isCanvas" class="box-mirror">'+
                '<canvas id="mirror-top" height="{{ sharedStore.mirrorLength+1 }}px" width="{{ w  }}px" style="position:absolute;background:#fff;top:0;left:0;z-index:{{windowZindex}};"></canvas>'+
                '<canvas id="mirror-bottom" height="{{ sharedStore.mirrorLength+1 }}px;" width="{{ w  }}px" style="position:absolute;background:#fff;bottom:0;left:0;z-index:{{windowZindex}};"></canvas>'+
                '<canvas id="mirror-left" width="{{ sharedStore.mirrorLength+1 }}px;" height="{{ h  }}px" style="position:absolute;background:#fff;top:0;left:0;z-index:{{windowZindex}};"></canvas>'+
                '<canvas id="mirror-right" width="{{ sharedStore.mirrorLength+1 }}px" height="{{ h  }}px" style="position:absolute;background:#fff;top:0;right:0;z-index:{{windowZindex}};"></canvas>'+
            '</div>' +
            '<div class="box-overlay" v-show="sharedStore.isCanvas && !sharedStore.isPreview">'+
                '<canvas id="overlay-top" height="{{ sharedStore.mirrorLength }}px" width="{{ sharedStore.mirrorLength }}px" style="position:absolute;background:#f1f1f1;top:0;left:0;z-index:{{windowZindex}}"></canvas>'+
                '<canvas id="overlay-bottom" height="{{ sharedStore.mirrorLength }}px" width="{{ sharedStore.mirrorLength }}px" style="position:absolute;background:#f1f1f1;bottom:0;right:0;z-index:{{windowZindex}}"></canvas>'+
                '<canvas id="overlay-left" height="{{ sharedStore.mirrorLength }}px" width="{{ sharedStore.mirrorLength }}px" style="position:absolute;background:#f1f1f1;bottom:0;left:0;z-index:{{windowZindex}}"></canvas>'+
                '<canvas id="overlay-right" height="{{ sharedStore.mirrorLength }}px" width="{{ sharedStore.mirrorLength }}px" style="position:absolute;background:#f1f1f1;top:0;right:0;z-index:{{windowZindex}}"></canvas>'+
            '</div>',
  // props: [
  //   'width',
  //   'height'
  // ],
  data: function() {
    return {
      sharedStore : Store
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
        return this.sharedStore.mirrorLength;
      },
      top : function(){
        return this.sharedStore.mirrorLength;
      },
      windowZindex: function() {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            elementTotal = currentCanvas.params.length || 0;

        return (elementTotal + 10) * 99;
      }
  },
  methods: {
      createMirror : function(){
          var client = DrawManage.getClient("screenshot"),
              w = client.width,
              h = client.height,
              shotCtx = client.context,
              currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              container = $("#container"),
              screenshot = $("#screenshot"),
              imageData,oldData,newData,mLength;
          mLength = this.sharedStore.mirrorLength;
          rBorderData = DrawManage.getImageData("screenshot",screenshot.get(0).width - mLength,mLength,mLength,screenshot.get(0).height - 2 * mLength);
          //clip
          imageData = DrawManage.getImageData("screenshot",mLength,mLength,screenshot.get(0).width - 2 * mLength,screenshot.get(0).height - 2 * mLength);
          screenshot.get(0).width = +screenshot.get(0).width - 2 * mLength;
          screenshot.get(0).height = +screenshot.get(0).height - 2 * mLength;
          DrawManage.fillImageData("screenshot",imageData);
          var w = screenshot.get(0).width, h = screenshot.get(0).height;
          if(this.sharedStore.isMirrorBorder){
              //draw mirror
              //top
              imageData = DrawManage.getImageData("screenshot",0,0,w,mLength);
              newData = DrawManage.createImageData("mirror-top",w,mLength);
              newData = DrawManage.imageDataVRevert(imageData,newData);
              DrawManage.fillImageData("mirror-top",newData,mLength,0,w,mLength);
               //bottom
              imageData = DrawManage.getImageData("screenshot",0,h - mLength,w,mLength);
              newData = DrawManage.createImageData("mirror-bottom",w,mLength);
              newData = DrawManage.imageDataVRevert(imageData,newData);
              DrawManage.fillImageData("mirror-bottom",newData,mLength,-1,w,mLength);
              //left
              imageData = DrawManage.getImageData("screenshot",0,0,mLength,h);
              newData = DrawManage.createImageData("mirror-left",mLength,h);
              newData = DrawManage.imageDataHRevert(imageData,newData);
              DrawManage.fillImageData("mirror-left",newData,0,mLength,mLength,h);
              //right
              imageData = DrawManage.getImageData("screenshot",w - mLength,0,mLength,h);
              newData = DrawManage.createImageData("mirror-right",mLength,h);
              newData = DrawManage.imageDataHRevert(imageData,newData);
              DrawManage.fillImageData("mirror-right",newData,-1,mLength,mLength,h);
              if(!this.sharedStore.isPreview){
                   //draw Line
                  DrawManage.drawLine("mirror-top","#f00",mLength,mLength,w+mLength,mLength);
                  DrawManage.drawLine("mirror-bottom","#f00",mLength,0,w+mLength,0);
                  DrawManage.drawLine("mirror-left","#f00",mLength,mLength,mLength,h+mLength);
                  DrawManage.drawLine("mirror-right","#f00",0,mLength,0,h+mLength);
              }
              $(".box-mirror canvas").show();
          }else if(this.sharedStore.isColorBorder){
              var color = ParamsManage.decToHex(this.sharedStore.bgColor);
              //fill with color
              DrawManage.drawRect("mirror-top",color,mLength,0,w,mLength);
              DrawManage.drawRect("mirror-bottom",color,mLength,0,w,mLength);
              DrawManage.drawRect("mirror-left",color,0,mLength,mLength,h);
              DrawManage.drawRect("mirror-right",color,0,mLength,mLength,h);
              //draw line
              DrawManage.drawLine("mirror-top","#f00",mLength,mLength,w+mLength,mLength);
              DrawManage.drawLine("mirror-bottom","#f00",mLength,0,w+mLength,0);
              DrawManage.drawLine("mirror-left","#f00",mLength,mLength,mLength,h+mLength);
              DrawManage.drawLine("mirror-right","#f00",0,mLength,0,h+mLength);
              $(".box-mirror canvas").show();
          }else{
              $(".box-mirror canvas").hide();
              if(this.sharedStore.isPreview){
                $("#mirror-right").show();
                DrawManage.fillImageData("mirror-right",rBorderData,-1,mLength,mLength,h);
              }
          }
          if(this.sharedStore.isPreview){
              $("#screenshot").show();
              $("#mirror-top,#mirror-bottom,#mirror-left").hide();
              $("#mirror-right").css({
                  transform: 'perspective(1500px) rotateY(70deg)',
                  transformOrigin: '0px 40%',
                  webkitFilter: 'grayscale(50%)'
              });
              $("#box-canvasbg").css({
                  overflow : "hidden",
                  transformOrigin : "100% 50%",
                  transform : "perspective(100px) rotateY(-0.8deg) translateZ(0)"
              });

          }else{
            $("#screenshot").hide();
          }
      },
      refreshMirror : function(){
          DrawManage.clear("mirror-top");
          DrawManage.clear("mirror-bottom");
          DrawManage.clear("mirror-left");
          DrawManage.clear("mirror-right");
          this.createMirror();
      }
  },
  events: {
      notifyRefreshMirror : function(){
        this.refreshMirror();
      }
  }
};
