
var ProjectManage = require('ProjectManage');

var DrawManage = require('DrawManage');

var OptionConfig = require('OptionConfig');
// component -- background

module.exports = {
  template: '<!-- background -->' +
              '<canvas id="bg-part{{idx}}{{main ? \'Main\':\'\'}}" v-bind:style="{zIndex:Zindex}" v-bind:width="width" v-bind:height="height" style="position: absolute; left: 0; top: 0;width: 100%;height:100%;background-size:cover;background-position: 50% 50%;pointer-events: none;"></canvas>' +
              '<canvas id="bg-layer" v-bind:width="width" v-bind:height="height" style="display:none;position: absolute; left: 0; top: 0;width: 100%;height:100%;background-size:cover;background-position: 50% 50%;pointer-events: none;"></canvas>'+
              '<img v-bind:src="imageUrl" v-bind:style="{zIndex:Zindex}" style="display:none;position: absolute; left: 0; top: 0;width:100%;height:100%;pointer-events: none;" />'+
              '<!-- mattings -->' +
              '<canvas id="matting-part" v-show="!sharedStore.isCanvas" v-bind:style="{ zIndex: mattingZindex,top : matteTop, left : matteLeft}" style="position: absolute;pointer-events:none; "></canvas>',
  props: [
    'idx',
    'main',
    'ratio',
    'width',
    'height',
    'originalBgWidth'
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
    mattingZindex: function() {
			var currentCanvas = Store.pages[this.idx].canvas,
					elementTotal = currentCanvas.params.length || 0;

			return (elementTotal + 2) * 100;
		},

    bgZindex: function() {
      var currentCanvas = Store.pages[this.idx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 3) * 100;
    },

    Zindex: function() {
      var currentCanvas = Store.pages[this.idx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 9) * 101;
    },

    matteLeft : function(){
      var currentCanvas = Store.pages[this.idx].canvas;
      var ratio = currentCanvas.ratio,
          padding = currentCanvas.foreground.left + currentCanvas.expendSize.left;
      return ratio * padding + 'px';
    },

    matteRight : function(){
      var currentCanvas = Store.pages[this.idx].canvas;
      var ratio = currentCanvas.ratio,
          padding = currentCanvas.foreground.right + currentCanvas.expendSize.right;
      return ratio * padding + 'px';
    },

    matteTop : function(){
      var currentCanvas = Store.pages[this.idx].canvas;
      var ratio = currentCanvas.ratio,
          padding = currentCanvas.foreground.top + currentCanvas.expendSize.top;
      return ratio * padding + 'px';
    },

    matteBottom : function(){
      var currentCanvas = Store.pages[this.idx].canvas;
      var ratio = currentCanvas.ratio,
          padding = currentCanvas.foreground.bottom + currentCanvas.expendSize.bottom;
      return ratio * padding + 'px';
    },
  },
  methods: {
    initBg: function() {
      var currentCanvas = Store.pages[this.idx].canvas;
      // if(this.sharedStore.cycleLock){
      //   this.sharedStore.queueKey = true;
      //   return;
      // }else{
      //   this.sharedStore.cycleLock = true;
      // }
      // console.log('refresh background');
      if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
        this.initMatting();
      }
      else {
        this.idleMatting();
      };

      var _this = this,curImage = _this.currentBgImage();
      var currentCanvas = Store.pages[this.idx].canvas;
      DrawManage.clear("bg-part"+ this.idx + this.main);
      DrawManage.drawImage("bg-part"+ this.idx + this.main,curImage.src,0,0,function(){
        if(_this.main){
          // Store.vm.$broadcast("notifyRefreshScreenshot", _this.idx, _this.ratio);
          // Store.vm.$broadcast("notifyRefreshRealScreenshot", _this.idx, _this.ratio);
        }
        // Store.vm.$broadcast("notifyRefreshScreenshot", _this.idx, _this.ratio);
        _this.sharedStore.cycleLock = false;
        _this.sharedStore.isBgLoaded = false;
        if(_this.sharedStore.queueKey){
            _this.sharedStore.queueKey = false;
            _this.initBg();
        }

        if(!Store.isProjectUpgrade) {
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
        //if(this.main){
          bg.src = prefix + size + ".png?version=24";
        //}else{
          //bg.src = prefix + size + ".png?version=24";
        //}

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

    idleMatting: function() {
      var _this = this;
      var currentCanvas = Store.pages[this.idx].canvas;
      var el = document.getElementById('matting-part');
      el.width = el.height = 0;
    },

    initMatting: function() {
      var _this = this;
      var currentCanvas = Store.pages[this.idx].canvas;
       if(this.sharedStore.mattCycleLock){
        this.sharedStore.mattQueueKey = true;
        return;
      }else{
        this.sharedStore.mattCycleLock = true;
      }
      var el = document.getElementById('matting-part'),
          ctx = el.getContext('2d'),
          mattImgSize = require("CanvasController").getMattImageSize(),
          width = (currentCanvas.oriBgWidth - currentCanvas.foreground.left -currentCanvas.foreground.right - currentCanvas.expendSize.left - currentCanvas.expendSize.right) * currentCanvas.ratio,
          height = (currentCanvas.oriBgHeight - currentCanvas.foreground.top -currentCanvas.foreground.bottom - currentCanvas.expendSize.top - currentCanvas.expendSize.bottom) * currentCanvas.ratio,
          bgImage = this.currentBgImage();
      el.width = width;
      el.height = height;
      if(bgImage.mattePath){
          var im = new Image();
          im.onload = function(){
              ctx.drawImage(im,0,0,mattImgSize.width,mattImgSize.height,0,0,width,height);
              // Store.isMattLoaded = true;
              _this.sharedStore.mattCycleLock = false;
              _this.sharedStore.isMattLoaded = false;
              if(_this.sharedStore.mattQueueKey){
                 _this.sharedStore.mattQueueKey = false;
                 _this.initMatting();
              }
          }
          im.src = bgImage.mattePath;
      }
    },

    initBgImage: function() {
      var _this = this;
      var currentCanvas = Store.pages[this.idx].canvas;
      var imageUrl = ProjectManage.getFrameBorderAsset();

      var elUp = document.getElementById('bg-part-up'),
          elRight = document.getElementById('bg-part-right'),
          elDown = document.getElementById('bg-part-down'),
          elLeft = document.getElementById('bg-part-left'),
          canvasUp = elUp.getContext('2d'),
          canvasRight = elRight.getContext('2d'),
          canvasDown = elDown.getContext('2d'),
          canvasLeft = elLeft.getContext('2d');
      var borderUp = currentCanvas.frameBorderThickness.top * currentCanvas.ratio,
          borderRight = currentCanvas.frameBorderThickness.right * currentCanvas.ratio,
          borderDown = currentCanvas.frameBorderThickness.bottom * currentCanvas.ratio,
          borderLeft = currentCanvas.frameBorderThickness.left * currentCanvas.ratio;
      var expendUp = (currentCanvas.frameBorderThickness.top - currentCanvas.boardInFrame.top) * currentCanvas.ratio,
          expendRight = (currentCanvas.frameBorderThickness.right - currentCanvas.boardInFrame.right) * currentCanvas.ratio,
          expendDown = (currentCanvas.frameBorderThickness.bottom - currentCanvas.boardInFrame.bottom) * currentCanvas.ratio,
          expendLeft = (currentCanvas.frameBorderThickness.left - currentCanvas.boardInFrame.left) * currentCanvas.ratio;
      elUp.width = elDown.width =  _this.width + expendLeft + expendRight;
      elUp.height = borderUp;
      elRight.width = borderRight;
      elRight.height = elLeft.height =  _this.height + expendUp + expendDown;
      elDown.height = borderDown;
      elLeft.width = borderLeft;

      this.upLeft = this.downLeft = this.leftLeft = -1 * expendLeft;
      this.upTop = this.rightTop = this.leftTop = -1 * expendUp;
      this.rightRight = -1 * expendRight;
      this.downBottom = -1 * expendDown;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      canvasUp.beginPath();
      canvasUp.moveTo(0, 0);
      canvasUp.lineTo(_this.width + expendLeft + expendRight, 0);
      canvasUp.lineTo(_this.width + expendLeft + expendRight - borderRight, borderUp);
      canvasUp.lineTo(borderLeft, borderUp);
      canvasUp.closePath();
      canvasUp.stroke();
      canvasUp.clip();
      var imageUp = new Image();
      imageUp.src = imageUrl.assetUpUrl;
      imageUp.onload = function() {
        canvasUp.drawImage(imageUp, 0, 0, _this.width + expendLeft + expendRight, borderUp);
      };

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      canvasRight.beginPath();
      canvasRight.moveTo(borderRight, 0);
      canvasRight.lineTo(borderRight, _this.height + expendUp + expendDown);
      canvasRight.lineTo(0, _this.height + expendUp + expendDown - borderDown);
      canvasRight.lineTo(0, borderUp);
      canvasRight.closePath();
      canvasRight.stroke();
      canvasRight.clip();
      var imageRight = new Image();
      imageRight.src = imageUrl.assetRightUrl;
      imageRight.onload = function() {
        canvasRight.drawImage(imageRight, 0, 0, borderRight, _this.height + expendUp + expendDown);
      };

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      canvasDown.beginPath();
      canvasDown.moveTo(0, borderDown);
      canvasDown.lineTo(_this.width + expendLeft + expendRight, borderDown);
      canvasDown.lineTo(_this.width + expendLeft + expendRight - borderRight, 0);
      canvasDown.lineTo(borderLeft, 0);
      canvasDown.closePath();
      canvasDown.stroke();
      canvasDown.clip();
      var imageDown = new Image();
      // imageDown.src = '/template-resources/images/bigNewPhotoFrame/baroque_gold_down.jpg';
      imageDown.src = imageUrl.assetDownUrl;
      imageDown.onload = function() {
        canvasDown.drawImage(imageDown, 0, 0, _this.width + expendLeft + expendRight, borderDown);
      };

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      canvasLeft.beginPath();
      canvasLeft.moveTo(0, 0);
      canvasLeft.lineTo(0, _this.height + expendUp + expendDown);
      canvasLeft.lineTo(borderLeft, _this.height + expendUp + expendDown - borderDown);
      canvasLeft.lineTo(borderLeft, borderUp);
      canvasLeft.closePath();
      canvasLeft.stroke();
      canvasLeft.clip();
      var imageLeft = new Image();
      // imageLeft.src = '/template-resources/images/bigNewPhotoFrame/baroque_gold_left.jpg';
      imageLeft.src = imageUrl.assetLeftUrl;
      imageLeft.onload = function() {
        canvasLeft.drawImage(imageLeft, 0, 0, borderLeft, _this.height + expendUp + expendDown);
      };
    },

    initBgLines: function() {
      var _this = this;
      var currentCanvas = Store.pages[this.idx].canvas;
      var foreground = require("CanvasController").getForegroundVariable();
      // var imageUrl = ProjectManage.getFrameBorderAsset();

      var elUp = document.getElementById('bgline-part-up'),
          elRight = document.getElementById('bgline-part-right'),
          elDown = document.getElementById('bgline-part-down'),
          elLeft = document.getElementById('bgline-part-left'),
          canvasUp = elUp.getContext('2d'),
          canvasRight = elRight.getContext('2d'),
          canvasDown = elDown.getContext('2d'),
          canvasLeft = elLeft.getContext('2d');
      var borderUp = currentCanvas.frameBorderThickness.top * currentCanvas.ratio,
          borderRight = currentCanvas.frameBorderThickness.right * currentCanvas.ratio,
          borderDown = currentCanvas.frameBorderThickness.bottom * currentCanvas.ratio,
          borderLeft = currentCanvas.frameBorderThickness.left * currentCanvas.ratio;
      var expendUp = (currentCanvas.frameBorderThickness.top - currentCanvas.boardInFrame.top + foreground.top ) * currentCanvas.ratio,
          expendRight = (currentCanvas.frameBorderThickness.right - currentCanvas.boardInFrame.right + foreground.right) * currentCanvas.ratio,
          expendDown = (currentCanvas.frameBorderThickness.bottom - currentCanvas.boardInFrame.bottom + foreground.bottom) * currentCanvas.ratio,
          expendLeft = (currentCanvas.frameBorderThickness.left - currentCanvas.boardInFrame.left + foreground.left) * currentCanvas.ratio;
      elUp.width = elDown.width =  _this.width + expendLeft + expendRight;
      elUp.height = borderUp;
      elRight.width = borderRight;
      elRight.height = elLeft.height =  _this.height + expendUp + expendDown;
      elDown.height = borderDown;
      elLeft.width = borderLeft;

      this.upLeft = this.downLeft = this.leftLeft = -1 * expendLeft;
      this.upTop = this.rightTop = this.leftTop = -1 * expendUp;
      this.rightRight = -1 * expendRight;
      this.downBottom = -1 * expendDown;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      canvasUp.beginPath();
      canvasUp.moveTo(0, 0);
      canvasUp.lineTo(borderLeft, Math.floor(borderUp));
      canvasUp.lineTo(_this.width + expendLeft + expendRight - borderRight, Math.floor(borderUp));
      canvasUp.lineTo(_this.width + expendLeft + expendRight, 0);
      canvasUp.stroke();

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      canvasRight.beginPath();
      canvasRight.moveTo(0, borderUp);
      canvasRight.lineTo(0, _this.height + expendUp + expendDown - borderDown);
      canvasRight.stroke();

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      canvasDown.beginPath();
      canvasDown.moveTo(0, borderDown);
      canvasDown.lineTo(borderLeft, 0);
      canvasDown.lineTo(_this.width + expendLeft + expendRight - borderRight, 0);
      canvasDown.lineTo(_this.width + expendLeft + expendRight, borderDown);
      canvasDown.stroke();

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      canvasLeft.beginPath();
      canvasLeft.moveTo(Math.floor(borderLeft), borderUp);
      canvasLeft.lineTo(Math.floor(borderLeft), _this.height + expendUp + expendDown - borderDown);
      canvasLeft.stroke();
    },
  },
  events: {
    notifyRefreshBackground: function() {
      this.initBg();
    },

    notifyChangeBgImage: function() {
    },

    notifyChangeMatting: function() {
      this.initMatting();
    }
  },
  ready: function() {
     var _this = this;

    _this.$watch('width', function() {
        _this.initBg();
    });

    _this.$watch('height', function() {
        _this.initBg();
    });

    _this.$watch('index', function() {
        _this.initBg();
    });

    /*_this.$watch('sharedStore.isBgLoaded', function() {
      if(_this.sharedStore.isBgLoaded){
          _this.sharedStore.cycleLock = false;
          _this.sharedStore.isBgLoaded = false;
          if(_this.sharedStore.queueKey){
              _this.sharedStore.queueKey = false;
              _this.initBg();
          }
      }
    });*/

   /* _this.$watch('sharedStore.isMattLoaded', function() {s
      if(_this.sharedStore.isMattLoaded){
          _this.sharedStore.mattCycleLock = false;
          _this.sharedStore.isMattLoaded = false;
          if(_this.sharedStore.mattQueueKey){
              _this.sharedStore.mattQueueKey = false;
              _this.initMatting();
          }
      }
    });*/
  }
};
