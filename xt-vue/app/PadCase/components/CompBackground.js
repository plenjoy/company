
var ProjectManage = require('ProjectManage');
var DrawManage = require('DrawManage');
var SpecController = require('SpecController');
// component -- background

module.exports = {
  template: /*'<!-- background layer -->' +
            '<div style="position: absolute; left: 0; top: 0; height: 100%; width: 100%;">' +*/
              '<!-- background -->' +
              '<canvas id="bg-part" v-bind:style="{zIndex:Zindex,opacity:opacity}" v-bind:width="width" v-bind:height="height" style="position: absolute; left: 0; top: 0;width: 100%;height:100%;background-size:cover;background-position: 50% 50%;pointer-events: none;"></canvas>'
              // '<canvas id="helpline-border-up" v-bind:style="{ left: borderUpLeft + \'px\', top: borderUpTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              // '<canvas id="helpline-border-right" v-bind:style="{ left: borderRightLeft + \'px\', top: borderRightTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              // '<canvas id="helpline-border-down" v-bind:style="{ left: borderDownLeft + \'px\', top: borderDownTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              // '<canvas id="helpline-border-left" v-bind:style="{ left: borderLeftLeft + \'px\', top: borderLeftTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>'
            /*'</div>'*/,
  props: [
    'width',
    'height',
    'opacity'
  ],
  data: function() {
    return {
      sharedStore: Store,
      borderColor: '#f00',
      borderUpLeft: 0,
      borderUpTop: 0,
      borderRightLeft: 0,
      borderRightTop: 0,
      borderDownLeft: 0,
      borderDownTop: 0,
      borderLeftLeft: 0,
      borderLeftTop: 0,
      timer : null
    };
  },
  computed: {
    helplineZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 2) * 100;
    },
    Zindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 2) * 100;
    },
    currentCaseImage : function(){
      var prj = Store.projectSettings[Store.currentSelectProjectIndex];
      return "assets/img/ipadcase/"+Store.phonecaseImages[prj.deviceType];
    }
  },
  methods: {
    initBg: function() {
      // this.initHelplines();

      // if(!this.sharedStore.isPreview) {
      //   this.initLineBorder();
      // };
      var _this = this;
      Store.loadingNum++;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      // $("#bg-part").css("background-image","url("+_this.currentCaseImage+")");
      DrawManage.clear("bg-part");
      DrawManage.drawImage("bg-part",_this.currentCaseImage,0,0,function(){
          Store.vm.$broadcast("notifyRefreshScreenshot");
      },currentCanvas.bgWidth,currentCanvas.bgHeight);
    },

    initHelplines: function() {

    },

    initLineBorder: function() {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      var elUp = document.getElementById('helpline-border-up'),
          elRight = document.getElementById('helpline-border-right'),
          elDown = document.getElementById('helpline-border-down'),
          elLeft = document.getElementById('helpline-border-left'),
          canvasUp = elUp.getContext('2d'),
          canvasRight = elRight.getContext('2d'),
          canvasDown = elDown.getContext('2d'),
          canvasLeft = elLeft.getContext('2d');
      elUp.width = elDown.width = currentCanvas.bgWidth - (currentCanvas.realBleedings.left + currentCanvas.realBleedings.right)*currentCanvas.ratio;
      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
      elRight.height = elLeft.height = currentCanvas.bgHeight - (currentCanvas.realBleedings.top + currentCanvas.realBleedings.bottom)*currentCanvas.ratio;
      _this.borderUpLeft = _this.borderDownLeft = _this.borderLeftLeft = currentCanvas.realBleedings.left*currentCanvas.ratio;
      _this.borderUpTop = _this.borderRightTop = _this.borderLeftTop = currentCanvas.realBleedings.bottom*currentCanvas.ratio;
      _this.borderRightLeft = currentCanvas.bgWidth - currentCanvas.realBleedings.right*currentCanvas.ratio;
      _this.borderDownTop = currentCanvas.bgHeight - currentCanvas.realBleedings.bottom*currentCanvas.ratio;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      DrawManage.drawDashedLine('helpline-border-up', _this.borderColor, 0, 0, elUp.width, 0, 2, 3);

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      DrawManage.drawDashedLine('helpline-border-right', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      DrawManage.drawDashedLine('helpline-border-down', _this.borderColor, 0, 0, elDown.width, 0, 2, 3);

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      DrawManage.drawDashedLine('helpline-border-left', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);
    }
  },
  events: {
    notifyRefreshBackground: function() {
      var _this = this;
      if( _this.timer){
        clearTimeout( _this.timer);
      }
       _this.timer = setTimeout(function(){
         _this.initBg();
      })
    }
  },
  ready: function() {
    var _this = this;

    _this.$watch('width', function() {
      if( _this.timer){
        clearTimeout( _this.timer);
      }
       _this.timer = setTimeout(function(){
        if(Store.watches.isProjectLoaded){
            _this.initBg();
        }
      })
    });

    _this.$watch('height', function() {
      if( _this.timer){
        clearTimeout( _this.timer);
      }
       _this.timer = setTimeout(function(){
         if(Store.watches.isProjectLoaded){
            _this.initBg();
        }
      })
    });
  }
};
