var DrawManage = require('DrawManage');
var ProjectManage = require("ProjectManage");

module.exports = {
  template: '<canvas id="screenshot" style="display:none;position: absolute;top:0;left:0;" v-bind:width="width" v-bind:height="height"></canvas>',
  data: function() {
    return {
      privateStore : {
          ratio : 0,
          timer : null,
          timer2: null,
          time3: null,
          count: 0
      },
      sharedStore : Store,
      bgNotified: false
    };
  },
  computed: {
      width : function(){
        var currentCanvas;
        if(Store.isPortal){
          currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        }else{
          currentCanvas = this.sharedStore.pages[0].canvas;
        }
        return currentCanvas.bgWidth;
      },
      height : function(){
        var currentCanvas;
        if(Store.isPortal){
          currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        }else{
          currentCanvas = this.sharedStore.pages[0].canvas;
        }
        return currentCanvas.bgHeight;
      }
  },
  methods: {
      createScreenshot : function(){
          var _this = this;
          var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
              params = currentCanvas.params;
          this.privateStore.count = params.length + 1;
          this.privateStore.ratio = currentCanvas.ratio;
          var container = $("#container"),screenshot = $("#screenshot").get(0);
          params = this.sortByDepth(params.slice(0));
          DrawManage.drawRect("screenshot","#fff",0,0,screenshot.width,screenshot.height);
          this.drawElems(params);
          this.drawLayer();

          if(Store.isPortal) {
            setTimeout(function() {
              _this.setPortalScreenShot();
            }, 200);
          }
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
           var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
           var newParams = [];
           $.extend(true,newParams,params);
           newParams.sort(function(prev,next){return prev.dep - next.dep});
          for(var i=0,len=newParams.length;i<len;i++){
              var item = newParams[i];
                  // sourceId = (item.elType==="text"?"textElementCanvas":"photoElementCanvas")+item.id;
                  switch(item.elType){
                    case "style":
                      sourceId = 'styleElementCanvas' + item.id;
                    break;
                    case "text":
                      sourceId = 'textElementCanvas' + item.id;
                    break;
                    case "image":
                      sourceId = 'photoElementCanvas' + item.id;
                    break;
                    case "decoration":
                      sourceId = 'decorationElementCanvas' + item.id;
                    break;
                  }
              if(+item.rotate) {
                DrawManage.drawRotateCanvas({
                  tarCanvasId: "screenshot",
                  sourceCanvasId: sourceId,
                  x: (item.x + currentCanvas.oriX) * this.privateStore.ratio,
                  y: (item.y + currentCanvas.oriY) * this.privateStore.ratio,
                  rotate: item.rotate
                });
              } else {
                DrawManage.drawCanvas("screenshot",sourceId,(item.x + currentCanvas.oriX)*this.privateStore.ratio,(item.y + currentCanvas.oriY)*this.privateStore.ratio);
              }
              // DrawManage.drawCanvas("screenshot",sourceId,(item.x + currentCanvas.oriX)*this.privateStore.ratio,(item.y + currentCanvas.oriY)*this.privateStore.ratio);
              this.privateStore.count--;
              if(this.privateStore.count === 0 && this.sharedStore.cutLargePhoto){
                this.setSubmitTimer();
              }
          }
      },
      drawLayer: function() {
        var _this = this;
        var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
        DrawManage.drawCanvas("screenshot","bg-part",0,0,currentCanvas.bgWidth,currentCanvas.bgHeight);
        this.privateStore.count--;
        if(this.privateStore.count === 0 && this.sharedStore.cutLargePhoto){
          this.setSubmitTimer()
        }
      },
      setSubmitTimer: function() {
        var _this = this;
        if(this.sharedStore.cutLargePhoto && this.sharedStore.selectedPageIdx === 1){
            // this.privateStore.encodeImage0 = require("ScreenshotController").convertScreenshotToBase64().replace("data:image/jpeg;base64,","");
             this.privateStore.timer2 && clearTimeout(this.privateStore.timer2);
             this.privateStore.timer2 = setTimeout(function(){
                _this.sharedStore.encodeImage2 = require("ScreenshotController").convertScreenshotToBase64().replace("data:image/jpeg;base64,","");
                _this.sharedStore.refreshScreenNotifiedCount = _this.sharedStore.pages[0].canvas.params.length + 1;
                _this.sharedStore.vm.$broadcast('notifyChangePage', 0);
            },2000);
        }else if(_this.sharedStore.cutLargePhoto && _this.sharedStore.selectedPageIdx === 0){
          this.privateStore.timer3 && clearTimeout(this.privateStore.timer3);
          this.privateStore.timer3 = setTimeout(function() {
              _this.sharedStore.encodeImage1 =  require("ScreenshotController").convertScreenshotToBase64().replace("data:image/jpeg;base64,","");
              //  发送 请求保存信息
              _this.sharedStore.cutLargePhoto = false;
              require('ProjectController').submitPortalCardProject(_this);
              _this.sharedStore.vm.$broadcast('notifyChangePage', 1);
          },2000);
        }
      },
      setPortalScreenShot: function() {
        switch(Store.selectedPageIdx) {
          case 0:
            Store.encodeImage1 = require("ScreenshotController").convertScreenshotToBase64().replace("data:image/jpeg;base64,","");
            break;
          case 1:
            Store.encodeImage2 = require("ScreenshotController").convertScreenshotToBase64().replace("data:image/jpeg;base64,","");
            break;
          default:
            break;
        }
      }
  },
  events: {
      notifyRefreshScreenshot : function(isBg){
        var _this = this;
        if(this.sharedStore.cutLargePhoto){
          if(isBg){
            if(this.bgNotified){
              return;
            }else{
              this.sharedStore.refreshScreenNotifiedCount--;

              this.bgNotified = true;
            }
          }else{
            this.sharedStore.refreshScreenNotifiedCount--;
          }
          if(this.sharedStore.refreshScreenNotifiedCount === 0){
            this.bgNotified = false;
            _this.refreshScreenshot();
          }
        }else if(this.sharedStore.selectedPageIdx === 0 || this.sharedStore.isPortal){
            _this.privateStore.timer && clearTimeout(_this.privateStore.timer);
            _this.privateStore.timer = setTimeout(function(){
              _this.refreshScreenshot();
            },100);
        }
      }
  }
};
