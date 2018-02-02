var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
  template: '<canvas v-bind:width="width" v-bind:height="height" id="screenshot" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>' +
  '<canvas id="real-screenshot" v-bind:width="width" v-bind:height="height" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>',
  data: function() {
    return {
      privateStore : {
          ratio : 0,
          timer : null
      },
      sharedStore : Store
    };
  },
  computed: {
      width : function(){
          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
          return currentCanvas.bgWidth;
      },
      height : function(){
          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
          return currentCanvas.bgHeight;
      },

      mirrorLeft: function() {
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

        return currentCanvas.ratio * this.sharedStore.mirrorLength;
      },

      mirrorTop: function() {
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;

        return currentCanvas.ratio * this.sharedStore.mirrorLength;
      }
  },
  methods: {
      createScreenshot : function(pageIdx){
          if(pageIdx>0) { return }
          var currentCanvas = Store.pages[pageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#screenshot").get(0);
          screenshot.width = container.width();
          screenshot.height = container.height();
          params = this.sortByDepth(params.slice(0));
          this.drawElems(params,pageIdx);
          this.$dispatch("dispatchRefreshMirror");

          if(this.sharedStore.isRoundBorder){
              var borderRadiuSize = currentCanvas.cornerRadius * currentCanvas.ratio;
              DrawManage.drawBorderRadius("screenshot", borderRadiuSize, 'transparent');
          }
      },
      createRealScreenShot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#real-screenshot").get(0);
          params = this.sortByDepth(params.slice(0));
          DrawManage.drawRect("real-screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.drawBackLayer();
          this.copyScreenshot();
          if(this.sharedStore.isCanvas){
            this.draw3DBorder();
          }
          if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte']==='M'){
            this.drawMatte();
          }
          var imageData = DrawManage.getImageData("real-screenshot",0,0,screenshot.width,screenshot.height);
          DrawManage.fillImageData("real-screenshot",imageData,0,0,imageData.width,imageData.height);
          this.drawLayer();
      },
      refreshScreenshot : function(pageIdx){
          var pageIdx = pageIdx || 0;
          DrawManage.clear("screenshot");
          this.createScreenshot(pageIdx);
      },
      sortByDepth : function(arr){
          return arr.sort(function(a,b){
              return a.dep > b.dep;
          });
      },
      drawElems : function(params,pageIdx){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            limit = params.length;
        var screenshot = $("#screenshot").get(0);
        var screenshotCtx = screenshot.getContext("2d");
        this.sizeScreenShot(currentCanvas.width, currentCanvas.height);
        screenshotCtx.fillStyle = "#FFFFFF";
        screenshotCtx.fillRect(0, 0, screenshot.width, screenshot.height);
          for(var i=0,len=limit;i<len;i++){
              var item = params[i],
              sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+pageIdx+item.id;
              DrawManage.drawCanvas("screenshot",sourceId,(item.x)*this.privateStore.ratio,(item.y)*this.privateStore.ratio,item.width*this.privateStore.ratio,item.height*this.privateStore.ratio);
          }
      },
      drawMatte : function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","matting-part",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
      },
      copyScreenshot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          DrawManage.drawCanvas("real-screenshot","screenshot",currentCanvas.x,currentCanvas.y);
      },
      draw3DBorder : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          if(this.sharedStore.isCanvas){
              DrawManage.drawCanvas("real-screenshot","mirror-top",currentCanvas.oriX * currentCanvas.ratio,currentCanvas.oriY * currentCanvas.ratio);
              DrawManage.drawCanvas("real-screenshot","mirror-right",(currentCanvas.oriX + currentCanvas.frameBaseSize.width) * currentCanvas.ratio + this.mirrorLeft,currentCanvas.oriY * currentCanvas.ratio + this.mirrorTop/2 - this.mirrorTop);
          }else{
            DrawManage.drawCanvas("real-screenshot","mirror-right",$("#screenshot").width()+this.mirrorLeft,-this.mirrorLeft/2);
            DrawManage.drawCanvas("real-screenshot","mirror-top",0,0);
          }
      },
      drawLayer : function(){
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","bg-part",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
      },
      drawBackLayer : function(){
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","bg-layer",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
      },
      sizeScreenShot : function(w,h){
        $("#screenshot").get(0).width = w;
        $("#screenshot").get(0).height = h;
      }
  },
  events: {
      notifyRefreshScreenshot : function(pageIdx){
          var _this = this;
          if(pageIdx>0) return;
          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
          _this.privateStore.timer = setTimeout(function(){
            _this.refreshScreenshot(pageIdx);
          },100);
      },
      notifyRefreshRealScreenshot : function(){
      }
  },
  ready: function() {

    var screenshot = document.getElementById("real-screenshot");
    screenshot.width = Store.screenshotSize.width;
    screenshot.height = Store.screenshotSize.height;
    require("DrawManage").drawRect("real-screenshot","#fff",0,0,Store.screenshotSize.width,Store.screenshotSize.height);

    var emptyImage = new Image();
    var editUrl = window.location.href;
    var prefix = editUrl.split('index.html?')[0];
    emptyImage.src = prefix + '/assets/img/noimage_pc.png';
    emptyImage.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = emptyImage.width;
        canvas.height = emptyImage.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(emptyImage, 0, 0, emptyImage.width, emptyImage.height);
        Store.emptyImage = canvas.toDataURL("image/png").replace("data:image/png;base64,","");
    }
  }
};
