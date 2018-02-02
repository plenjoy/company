var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
  template: '<canvas id="screenshot" style="display:none;position: absolute;top:0;left:0;" v-bind:width="width" v-bind:height="height"></canvas>',
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
          for(var i=0,len=params.length;i<len;i++){
              var item = params[i],
                  sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
              DrawManage.drawCanvas("screenshot",sourceId,(item.x)*this.privateStore.ratio,(item.y)*this.privateStore.ratio);
          }
      }
  },
  events: {
      notifyRefreshScreenshot : function(){
          var _this = this;
          _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
          _this.privateStore.timer = setTimeout(function(){
            _this.refreshScreenshot();
          },100);
      }
  },
  ready:function(){
  }
};
