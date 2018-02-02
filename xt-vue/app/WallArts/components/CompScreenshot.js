var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
  template: '<canvas v-bind:width="width" v-bind:height="height" id="screenshot" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>' +
  '<canvas id="real-screenshot" v-bind:width="width" v-bind:height="height" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>',
  data: function() {
    return {
      privateStore : {
          ratio : 0,
          timer : null,
          isInitScreenshotSaved: false
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
      createScreenshot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#screenshot").get(0);
          // screenshot.width = container.width();
          // screenshot.height = container.height();
          screenshot.width = currentCanvas.width;
          screenshot.height = currentCanvas.height;
          DrawManage.drawRect("screenshot","#fff",0,0,screenshot.width,screenshot.height);
          params = this.sortByDepth(params.slice(0));
          this.drawElems(params);
          this.$dispatch("dispatchRefreshMirror");
      },
      createRealScreenShot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#real-screenshot").get(0);
          params = this.sortByDepth(params.slice(0));
          DrawManage.drawRect("real-screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.drawBackLayer();
          if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']==='floatFrame'){
            this.drawBgFloat();
          }
          this.copyScreenshot();
          if(this.sharedStore.isCanvas){
            this.draw3DBorder();
          }
          if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte']==='M'){
            this.drawMatte();
          }
        //   var imageData = DrawManage.getImageData("real-screenshot",0,0,screenshot.width,screenshot.height);
        //   DrawManage.fillImageData("real-screenshot",imageData,0,0,imageData.width,imageData.height);
          this.drawLayer();
      },
      refreshScreenshot : function(){
          DrawManage.clear("screenshot");
          this.createScreenshot();
      },
      sortByDepth : function(arr){
          return arr.sort(function(a,b){
              return a.dep > b.dep;
          });
      },
      drawElems : function(params){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        for(var i=0,len=params.length;i<len;i++){
            var item = params[i],
            sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
            if(item.elType==="text" || (item.elType==="image" && item.imageId) ) {
              DrawManage.drawCanvas("screenshot",sourceId,(item.x)*this.privateStore.ratio,(item.y)*this.privateStore.ratio);
            }
        }
      },
      drawBgFloat: function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","bg-float",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
      },
      drawMatte : function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","matting-part",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        /*DrawManage.drawCanvas("real-screenshot","matting-part-up",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-right",(currentCanvas.oriBgWidth - currentCanvas.foreground.right - currentCanvas.mattingSize.right - currentCanvas.expendSize.right) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-down",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.oriBgHeight - currentCanvas.foreground.bottom - currentCanvas.mattingSize.bottom - currentCanvas.expendSize.bottom) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-left",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);*/
      },
      copyScreenshot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
          var isFloatFrame = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['product']==='floatFrame';
          if (!isFloatFrame) {
              DrawManage.drawCanvas("real-screenshot","screenshot",currentCanvas.x,currentCanvas.y);
          } else {
              var drawLeft = Math.floor(currentCanvas.x+currentCanvas.realBleedings.left*currentCanvas.ratio),
                  drawTop =  Math.floor(currentCanvas.y+currentCanvas.realBleedings.top*currentCanvas.ratio),
                  drawWidth =  Math.floor((currentCanvas.oriWidth-currentCanvas.realBleedings.left - currentCanvas.realBleedings.right)*currentCanvas.ratio),
                  drawHeight =  Math.floor((currentCanvas.oriHeight-currentCanvas.realBleedings.top - currentCanvas.realBleedings.bottom)*currentCanvas.ratio),
                  sourceX =  Math.floor(currentCanvas.realBleedings.left*currentCanvas.ratio),
                  sourceY =  Math.floor(currentCanvas.realBleedings.top*currentCanvas.ratio);
              this.drawFloatShadow();
              DrawManage.drawCanvas("real-screenshot","screenshot",drawLeft,drawTop,drawWidth,drawHeight,sourceX,sourceY,drawWidth,drawHeight);
              // this.drawBorderRadius();
          }
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
      drawFloatShadow: function(){
          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
          var ratio = currentCanvas.ratio;
          var drawLeft = currentCanvas.x+currentCanvas.realBleedings.left*ratio,
              drawTop = currentCanvas.y+currentCanvas.realBleedings.top*ratio,
              drawWidth = Math.floor((currentCanvas.oriWidth-currentCanvas.realBleedings.left - currentCanvas.realBleedings.right)*ratio-1),
              drawHeight = Math.floor((currentCanvas.oriHeight-currentCanvas.realBleedings.top - currentCanvas.realBleedings.bottom)*ratio);
          var realScreenshotDom = document.getElementById('real-screenshot');
          var ctx = realScreenshotDom.getContext('2d');
          ctx.shadowColor = 'rgba(0,0,0,0.44)';
          ctx.shadowBlur = 90 * ratio;
          ctx.shadowOffsetX = -24 * ratio;
          ctx.shadowOffsetY = 40 * ratio;
          ctx.fillStyle = 'black';
          ctx.fillRect(drawLeft,drawTop,drawWidth,drawHeight);
      },
      drawBorderRadius: function(){
          var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
          var ratio = currentCanvas.ratio;
          var drawLeft = currentCanvas.x+currentCanvas.realBleedings.left*ratio,
              drawTop = currentCanvas.y+currentCanvas.realBleedings.top*ratio,
              width = Math.floor((currentCanvas.oriWidth-currentCanvas.realBleedings.left - currentCanvas.realBleedings.right)*ratio),
              height = Math.floor((currentCanvas.oriHeight-currentCanvas.realBleedings.top - currentCanvas.realBleedings.bottom)*ratio);
          var realScreenshotDom = document.getElementById('real-screenshot');
          var ctx = realScreenshotDom.getContext('2d');
          var img = new Image();
          img.onload = function(){
              var cp = ctx.createPattern( img , 'repeat' );
              ctx.translate(drawLeft,drawTop);
              ctx.fillStyle = cp;
              ctx.beginPath();
              ctx.moveTo(0,0);           // 创建开始点
              ctx.lineTo(5,0);          // 创建水平线
              ctx.arcTo(0,0,0,5,5); // 创建弧
              ctx.lineTo(0,0);         // 创建垂直线
              ctx.closePath();
              ctx.fill();
              // 右上圆角
              ctx.beginPath();
              ctx.moveTo(width,0);           // 创建开始点
              ctx.lineTo(width-5,0);          // 创建水平线
              ctx.arcTo(width,0,width,5,5); // 创建弧
              ctx.lineTo(width,0);         // 创建垂直线
              ctx.fill();
              ctx.closePath();
              // 左下圆角
              ctx.beginPath();
              ctx.moveTo(0,height);           // 创建开始点
              ctx.lineTo(0,height-5);          // 创建水平线
              ctx.arcTo(0,height,5,height,5); // 创建弧
              ctx.lineTo(0,height);         // 创建垂直线
              ctx.fill();
              ctx.closePath();
              // 右下圆角
              ctx.beginPath();
              ctx.moveTo(width,height);           // 创建开始点
              ctx.lineTo(width-5,height);          // 创建水平线
              ctx.arcTo(width,height,width,height-5,5); // 创建弧
              ctx.lineTo(width,height);         // 创建垂直线
              ctx.fill();
              ctx.closePath();
              ctx.translate(-drawLeft,-drawTop);
          };
          img.src = 'assets/img/linen.png';
      }
  },
  events: {
      notifyRefreshScreenshot : function(){
          var _this = this;
          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
          _this.privateStore.timer = setTimeout(function(){
            _this.refreshScreenshot();
            if(_this.sharedStore.isNewInsertProject) {
                _this.$dispatch('dispatchSaveScreenshotDelay', 500);
                _this.sharedStore.isNewInsertProject = false;
            }
          },100);
      },
      notifyRefreshRealScreenshot : function(){
        this.createRealScreenShot();
      },

      notifySaveScreenshot: function() {
          if(!this.privateStore.isInitScreenshotSaved) {
            require('ProjectController').saveOldProject(this, function() {});
            this.privateStore.isInitScreenshotSaved = true;
          }
      }
  },
  ready: function() {
    var _this = this;

    _this.$watch('width', function() {
      _this.refreshScreenshot();
    });

    _this.$watch('height', function() {
      _this.refreshScreenshot();
    });

    var screenshot = document.getElementById("real-screenshot");
    screenshot.width = Store.screenshotSize.width;
    screenshot.height = Store.screenshotSize.height;
    require("DrawManage").drawRect("real-screenshot","#fff",0,0,Store.screenshotSize.width,Store.screenshotSize.height);
  }
};
