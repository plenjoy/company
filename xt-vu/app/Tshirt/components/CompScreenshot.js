var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
 template: '<canvas id="screenshot" style="display:none;position:absolute;" v-bind:width="width" v-bind:height="height"></canvas>',
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
      }
  },
  methods: {
      createScreenshot : function(){
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#screenshot").get(0);
          params = this.sortByDepth(params.slice(0));
          this.getAddon(params);
          DrawManage.drawRect("screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.drawBg();
          this.drawElems(params);
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
      getAddon : function(params){
        this.drawElems(params);
        this.sharedStore.currentImage = screenshot.toDataURL('image/png');
      }, 
      drawElems : function(params){
         var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            screenshot = $("#screenshot").get(0),
            sctx = screenshot.getContext("2d");
          canvas.width = currentCanvas.bgWidth;
          canvas.height = currentCanvas.bgHeight;
          for(var i=0,len=params.length;i<len;i++){
              var item = params[i],
                  sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
              //to limit image in operation area
              ctx.drawImage($("#"+sourceId).get(0),item.x*this.privateStore.ratio,item.y*this.privateStore.ratio);
          }
          sctx.drawImage(canvas,0,0,currentCanvas.width,currentCanvas.height,currentCanvas.x,currentCanvas.y,currentCanvas.width,currentCanvas.height);
      },
      drawBg : function(){
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        DrawManage.drawCanvas("screenshot","bg-part",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
      }
  },
  events: {
      notifyRefreshScreenshot : function(){
        if(this.sharedStore.selectedPageIdx===0) { 
          var _this = this;
          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
          _this.privateStore.timer = setTimeout(function(){
            _this.refreshScreenshot();
          },100);
        };
      }
  }
};
