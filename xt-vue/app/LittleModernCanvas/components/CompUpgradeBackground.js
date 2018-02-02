
var ProjectManage = require('ProjectManage');

var DrawManage = require('DrawManage');

var OptionConfig = require('OptionConfig');
// component -- background

module.exports = {
  template: '<!-- background -->' +
              '<canvas id="upgrade-bg-part{{idx}}" v-bind:style="{zIndex:Zindex}" v-bind:width="width" v-bind:height="height" style="position: absolute; left: 0; top: 0;width: 100%;height:100%;background-size:cover;background-position: 50% 50%;pointer-events: none;z-index: 1000"></canvas>' +
              '<img v-bind:src="imageUrl" v-bind:style="{zIndex:Zindex}" style="display:none;position: absolute; left: 0; top: 0;width:100%;height:100%;pointer-events: none;" />',
  props: [
    'idx',
    'main',
    'ratio',
    'width',
    'height'
  ],
  data: function() {
    return {
      upLeft: 0,
      upTop: 0,
      rightRight: 0,
      rightTop: 0,
      downLeft: 0,
      downBottom: 0,
      leftLeft: 0,
      leftTop: 0,
      timer : null,
      imageUrl: '',
      sharedStore: Store
    };
  },
  computed: {

    bgZindex: function() {
      var currentCanvas = Store.upgradeCanvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 3) * 100;
    },

    Zindex: function() {
      var currentCanvas = Store.upgradeCanvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 9) * 101;
    },
  },
  methods: {
    initBg: function() {
      var currentCanvas = Store.upgradeCanvas;
      

      var _this = this,curImage = _this.currentBgImage();
      var currentCanvas = Store.upgradeCanvas;
      DrawManage.clear("upgrade-bg-part"+ this.idx);
      DrawManage.drawImage("upgrade-bg-part"+ this.idx,curImage.src,0,0,function(){
        if(_this.main){
           //Store.vm.$broadcast("notifyRefreshScreenshot", _this.idx, _this.ratio);
          //Store.vm.$broadcast("notifyRefreshRealScreenshot", _this.idx, _this.ratio);
        }
        _this.sharedStore.cycleLock = false;
        _this.sharedStore.isBgLoaded = false;
        if(_this.sharedStore.queueKey){
            _this.sharedStore.queueKey = false;
            _this.initBg();
        }
        if(!Store.isProjectUpgrade){
          Store.isPageLoadingShow = false;
        }
        
        _this.imageUrl = curImage.src;
        // setTimeout(function(){$(".bed-page-loading").css("display","none");},0)
      },currentCanvas.oriBgWidth*this.ratio,currentCanvas.oriBgHeight*this.ratio);
    },

    currentBgImage : function(){
        var bg = {},
            key = '',
            currentProject = Store.projectSettings[this.idx],
            size = currentProject['size'].toLowerCase(),
            product  = currentProject['product'],
            prefix = this.getPrefix(),
            bgSrc = '',
            rotated = currentProject.rotated;
        if(rotated){
          size = size.split("x")[1]+"x"+size.split("x")[0];
        }
        if(product === 'woodPrint'){
          prefix  += currentProject['finish'] + "/";
        }else{
          prefix  += size + "/";
        }
        if(this.main){
          bg.src = prefix + size + ".png?version=25";
        }else{
          bg.src = prefix + size + "_white.png?version=25";
        }

        if(bgSrc){
          bg.layer = prefix + bgSrc;
        }
        if(this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matte']==='M'){
            var matteStyle = this.sharedStore.projectSettings[Store.currentSelectProjectIndex]['matteStyle'].replace("matteStyle","");
            if(matteStyle!=="none"){
                bg.mattePath = 'assets/img/matting/' + size + '/' + matteStyle + ".png";
            }
        }
        return bg;
    },

    getPrefix : function(){
      var type = 'foreground',
          SpecManage = require("SpecManage"),
          currentProject = Store.projectSettings[this.idx],
          keyPatterns = SpecManage.getVariableKeyPatternById(type).split("-"),
          cur = keyPatterns.indexOf("size"),
          path = 'assets/img/types/';
      keyPatterns.splice(cur,1);
      for(var i=0;i<keyPatterns.length;i++){
        var value = currentProject[keyPatterns[i]];
        if(value && value.toLowerCase()!=="none"){
          if(keyPatterns[i] === "canvasBorderSize" && currentProject.product != "littleModernCanvas"){
            continue;
          }
          path += value + "/";
        }
      }
      return path;
    },
    
  },
  events: {
    /*notifyRefreshBackground: function() {
      this.initBg();
    },

    notifyChangeBgImage: function() {
    },*/
  },
  ready: function() {
     var _this = this;

    _this.$watch('width', function() {
        _this.initBg();
    });

    _this.$watch('height', function() {
        _this.initBg();
    });
  }
};
