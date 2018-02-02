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
          DrawManage.drawRect("screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.drawElems(params);
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
          var spread = require("ProjectManage").getPhonecaseContent();
          for(var i=0,len=params.length;i<len;i++){
              var item = params[i],
                  sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
              DrawManage.drawCanvas("screenshot",sourceId,(spread.x+item.x)*this.privateStore.ratio,(spread.y+item.y)*this.privateStore.ratio);
          }
      },
      drawLayer : function(){
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        // DrawManage.drawCanvas("screenshot","bg-part",0,0,currentCanvas.width,currentCanvas.height,currentCanvas.x,currentCanvas.y,currentCanvas.width,currentCanvas.height);
        DrawManage.drawCanvas("screenshot","bg-part",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
      }
  },
  events: {
      notifyRefreshScreenshot : function(){
          console.log("notifyRefreshScreenshot");
          Store.loadingNum--;
          if(Store.loadingNum==0){
            Store.isShowLoading=false;
          }
          var _this = this;
          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
          _this.privateStore.timer = setTimeout(function(){
            _this.refreshScreenshot();
          },100);
      }
  }
};
