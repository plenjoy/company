var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
  template: '<canvas id="screenshot" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>' +
  '<canvas id="real-screenshot" v-bind:style="{ left: mirrorLeft + \'px\', top: mirrorTop + \'px\' }" style="display:none;position:absolute;"></canvas>',
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
      createScreenshot : function(pageIdx){
          var currentCanvas = Store.pages[pageIdx].canvas,
              params = currentCanvas.params;
          // this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container0Main"),screenshot = $("#screenshot").get(0);
          screenshot.width = container.width();
          screenshot.height = container.height();
          params = this.sortByDepth(params.slice(0));
          this.drawElems(params, pageIdx);
          this.$dispatch("dispatchRefreshMirror");
      },
      createRealScreenShot : function(pageIdx){
          var currentCanvas = Store.pages[pageIdx].canvas,
              params = currentCanvas.params;
          var screenshot = $("#real-screenshot").get(0);
          screenshot.width = currentCanvas.oriBgWidth * this.privateStore.ratio;
          screenshot.height = currentCanvas.oriBgHeight * this.privateStore.ratio;
          params = this.sortByDepth(params.slice(0));
          DrawManage.drawRect("real-screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.copyScreenshot(pageIdx);
          this.drawLayer(pageIdx);
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
      drawElems : function(params, pageIdx){
        var currentCanvas = Store.pages[pageIdx].canvas;
        for(var i=0,len=params.length;i<len;i++){
            var item = params[i],
            sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+ pageIdx +item.id + 'Main';
            // DrawManage.drawCanvas("screenshot",sourceId,(item.x)*this.privateStore.ratio,(item.y)*this.privateStore.ratio);
            DrawManage.drawCanvas("screenshot",sourceId,0,0);
        }
      },
      drawMatte : function(){
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","matting-part",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        /*DrawManage.drawCanvas("real-screenshot","matting-part-up",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-right",(currentCanvas.oriBgWidth - currentCanvas.foreground.right - currentCanvas.mattingSize.right - currentCanvas.expendSize.right) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-down",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.oriBgHeight - currentCanvas.foreground.bottom - currentCanvas.mattingSize.bottom - currentCanvas.expendSize.bottom) * currentCanvas.ratio);
        DrawManage.drawCanvas("real-screenshot","matting-part-left",(currentCanvas.foreground.left + currentCanvas.expendSize.left) * currentCanvas.ratio,(currentCanvas.foreground.top + currentCanvas.expendSize.top) * currentCanvas.ratio);*/
      },
      copyScreenshot : function(pageIdx){
          var currentCanvas = Store.pages[pageIdx].canvas;
          // DrawManage.drawCanvas("real-screenshot","screenshot",currentCanvas.oriX * this.privateStore.ratio ,currentCanvas.oriY * this.privateStore.ratio);
          DrawManage.drawCanvas("real-screenshot","photoElementCanvas"+ pageIdx +"0Main",currentCanvas.oriX * this.privateStore.ratio ,currentCanvas.oriY * this.privateStore.ratio);
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
      drawLayer : function(pageIdx){
        var currentCanvas = this.sharedStore.pages[pageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","bg-part"+pageIdx+"Main",0,0,currentCanvas.oriBgWidth * this.privateStore.ratio ,currentCanvas.oriBgHeight * this.privateStore.ratio);
      },
      drawBackLayer : function(){
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        DrawManage.drawCanvas("real-screenshot","bg-layer",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
      },
      getFirstIndex: function() {
        var firstIndex = 0;
        this.sharedStore.pages.some(function(item,index){
            if(!item.isDeleted){
                firstIndex = index;
                return true;
            }
        });
        return firstIndex;
      }
  },
  events: {
      notifyRefreshScreenshot : function(pageIdx, ratio){
        if(this.sharedStore.isPreview)return;
        var _this = this;
        _this.privateStore.ratio = ratio || 1;
        _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
        _this.privateStore.timer = setTimeout(function(){
          _this.refreshScreenshot(pageIdx);
          if(_this.sharedStore.isNewInsertProject) {
              _this.$dispatch('dispatchSaveScreenshotDelay', 500);
              _this.sharedStore.isNewInsertProject = false;
          }
        },100);
      },
      notifyRefreshRealScreenshot : function(pageIdx,ratio){
        if(this.sharedStore.isPreview)return;
        this.privateStore.ratio = ratio || 1;
        this.createRealScreenShot(pageIdx);
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

    // _this.$watch('width', function() {
    //   _this.refreshScreenshot();
    // });

    // _this.$watch('height', function() {
    //   _this.refreshScreenshot();
    // });

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
