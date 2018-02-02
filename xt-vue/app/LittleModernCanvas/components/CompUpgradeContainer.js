var Vue = require('vuejs');
var CompOption = Vue.extend(require('../components/CompOption.js'));
var UtilCrop = require('UtilCrop');
var UtilWindow = require('UtilWindow');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
var CanvasController = require('CanvasController');
var ImageController = require('ImageController');
var UpgradeProjectController = require('UpgradeProjectController');

module.exports = {
  template: '<div v-bind:style="topStyle">'+               
                '<div v-bind:style="flipperStyle">'+
                    '<div id="upgradePageView" v-bind:style="frontPageStyle" >' +
                      '<div style="position: relative;width: 100%; height: 100%; overflow: hidden;">' +
                        '<div id="upgradeContainer" v-bind:style="{ top: privateStore.canvasTop + \'px\', left: privateStore.canvasLeft + \'px\' }" style="position: relative; overflow: hidden;background: #f0f0f0;">' +
                        '</div>' +
                      '</div>' +
                      '<upgrade-bg-layer v-show="!sharedStore.isCanvas" v-bind:idx="idx" v-bind:ratio="privateStore.ratio" v-bind:main="main" v-bind:width="Math.floor(privateStore.operationWidth)" v-bind:height="Math.floor(privateStore.operationHeight)"></upgrade-bg-layer>' +
                      '<upgrade-mirror-element v-bind:idx="idx"  v-bind:ratio="privateStore.ratio" v-show="sharedStore.isCanvas"></upgrade-mirror-element>' +
                    '</div>'+
                '</div>'+
                '<canvas id="upgradeScreenshot" v-bind:width="Math.floor(privateStore.operationWidth)" v-bind:height="Math.floor(privateStore.operationHeight)" v-bind:style="frontPageStyle"/>'+
            '</div>',
  props: ['main', 'idx'],
  data: function() {
    return {
      privateStore: {
        ratio: 1,
				operationWidth: 0,
				operationHeight: 0,
				operationPaddingTop: 0,
				operationPaddingLeft: 0,
				canvasTop: 0,
				canvasLeft: 0,
        handleId: 'bg',
        isShowHandle: true,
        isCornerHandles: false,
        isSideHandles: false,
        oriLogoImage: {
          width: 86,
          height: 32,
          bottom: 82
        },
        isShowBackLogo: false,
        hoverShowDeleteIcon: false
			},
      idx: 0,
			sharedStore: Store,
      isFrontPageShow: true,
      isCategoryCanvas : false,
      containerRotateAngel: Store.isFrontPage ? 0 : -180
    };
  },
  computed: {
    topStyle: function(){

      return{
        display: 'none',
        margin: '0',
        width: Math.floor(this.privateStore.operationWidth) + 'px',
        height: Math.floor(this.privateStore.operationHeight) + 'px',
        float : "right"
      }
        
    },
    flipperStyle: function(){
      return {
        opacity: '1',
        position: 'absolute'

      }
    },
    frontPageStyle: function(){
      return {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 2,
        width: Math.floor(this.privateStore.operationWidth) + 'px',
        height: Math.floor(this.privateStore.operationHeight) + 'px',
        opacity: '1',
      }
    },

    operationMarginTop: function() {

			return this.privateStore.operationPaddingTop;
		},

		operationMarginLeft: function() {
			return this.privateStore.operationPaddingLeft;
		},

    windowZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;
      return (elementTotal + 10) * 100 - 10;
    },
    
	},
  methods: {
    initCanvas: function() {
			var _this = this,
					store = _this.sharedStore,
					currentCanvas = store.upgradeCanvas;
      if(!currentCanvas.oriWidth) return;
			_this.initWindow();

      $('#upgradeContainer').css('width', currentCanvas.oriWidth*this.privateStore.ratio).css('height', currentCanvas.oriHeight*this.privateStore.ratio);

			for(var i = 0; i < currentCanvas.params.length; i++) {

        UpgradeProjectController.createElement(i,this.idx,this.privateStore.ratio);
			};
		},

    clearCenterElement: function(){
      var canvas = Store.upgradeCanvas;
      if(canvas && canvas.elements) {
        for (var i = 0; i < canvas.elements.length; i++) {
          canvas.elements[i].$destroy(true);
          canvas.elements.splice(i, 1);
        }
      }
    },

    initWindow: function() {
      var _this = this,
          store = _this.sharedStore,
          currentCanvas = store.upgradeCanvas;

      
      var boxLimit = UtilWindow.getBoxWH(280,236);

      if(boxLimit.width > 0 && boxLimit.height > 0) {
        var objWidth = currentCanvas.oriBgWidth;
        var objHeight = currentCanvas.oriBgHeight;
        var expendLeft = 0;
        var expendTop = 0;
        var wX = boxLimit.width / objWidth,
            hX = boxLimit.height / objHeight;
        if(wX > hX) {
          this.privateStore.ratio = hX;
          _this.privateStore.operationPaddingLeft = (boxLimit.width - currentCanvas.oriWidth * this.privateStore.ratio) / 2 - (currentCanvas.oriX * this.privateStore.ratio);
          _this.privateStore.operationPaddingRight = (boxLimit.width) / 2 - ((currentCanvas.oriBgWidth - currentCanvas.oriWidth /2 - currentCanvas.oriX) * this.privateStore.ratio);
        }
        else {
          this.privateStore.ratio = wX;
          _this.privateStore.operationPaddingLeft = 0 + expendLeft * this.privateStore.ratio;
        };

        _this.privateStore.operationPaddingTop = 0 + expendTop * this.privateStore.ratio;
        _this.privateStore.operationWidth = currentCanvas.oriBgWidth * this.privateStore.ratio;
        _this.privateStore.operationHeight = currentCanvas.oriBgHeight * this.privateStore.ratio;
        _this.privateStore.canvasTop = currentCanvas.oriY * this.privateStore.ratio;
        _this.privateStore.canvasLeft = currentCanvas.oriX * this.privateStore.ratio;

      }
      else {
        alert('Window size is too small!');
      };
    },
    

  },
  events: {

    /*notifyRotate: function() {
      console.log("notifyRotate");
      CanvasController.fixRotatePhotoElement();
      CanvasController.changeBorderToMirror(false,true);
      CanvasController.freshPageData();
      this.clearCenterElement();
      this.initCanvas();

    },

    notifyPaint: function() {
      console.log("notifyPaint");
      CanvasController.loadProjectIntoPages();
    	if(Store.pages.length !== 0) {
        this.initCanvas();
      }
    },*/

    notifyPaintUpgradeContainer: function(){
      console.log("notifyPaintUpgradeContainer");
      this.clearCenterElement();
      this.initCanvas();
    },
    notifyPaintUpgradeScreenshot: function(){
      var _this = this;
      var currentCanvas = Store.upgradeCanvas;
      
      setTimeout(function(){
        require("DrawManage").drawCanvas("upgradeScreenshot","upgrade-mirror-right"+_this.idx,(currentCanvas.oriX + currentCanvas.oriWidth-currentCanvas.canvasBordeThickness.right-currentCanvas.realBleedings.top) * _this.privateStore.ratio, (currentCanvas.oriY-currentCanvas.canvasBordeThickness.top/2+currentCanvas.realBleedings.top/2) * _this.privateStore.ratio);
        require("DrawManage").drawCanvas("upgradeScreenshot","upgrade-mirror-top"+idx,currentCanvas.oriX * _this.privateStore.ratio,currentCanvas.oriY * _this.privateStore.ratio);
        
        for(var i=0,len=currentCanvas.params.length;i<len;i++){
          var item = currentCanvas.params[i],
          sourceId = "upgrade-photoElementCanvas"+ _this.idx +item.id;
          console.log('ss',item.x,item.y,_this.privateStore.ratio);
          require("DrawManage").drawCanvas("upgradeScreenshot",sourceId,(item.x)*_this.privateStore.ratio+_this.privateStore.canvasLeft,(item.y)*_this.privateStore.ratio+_this.privateStore.canvasTop);
             
        }
        require("DrawManage").drawCanvas("upgradeScreenshot","upgrade-bg-part"+_this.idx);

      }
      ,600);
    }

  },
  components: {
    'option-element' : CompOption
  },
  ready: function() {
    var _this = this;

    /*if(this.main){
      _this.$watch('idx', function() {
        console.log("watch");
        if(this.sharedStore.watches.isProjectLoaded){
            _this.clearCenterElement();
            _this.initCanvas();
        }
      });
    }*/

  }
};
