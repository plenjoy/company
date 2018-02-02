
var ProjectManage = require('ProjectManage');
var DrawManage = require('DrawManage');
var SpecController = require('SpecController');
// component -- background

module.exports = {
  template: '<!-- background layer -->' +
            '<div style="position: absolute; left: 0; top: 0; height: 100%; width: 100%;">' +
              '<!-- background -->' +
              '<img v-bind:src="src" v-show="sharedStore.isBgImageShow" v-bind:style="{zIndex:Zindex + 1}" v-bind:width="width" v-bind:height="height" style="position:absolute;left:0;top:0;pointer-events:none;">'+
              '<canvas id="bg-part" v-bind:style="{zIndex:Zindex}" v-bind:width="width" v-bind:height="height" style="position: absolute; left: 0; top: 0;pointer-events:none;display:none;"></canvas>'+
              '<div  v-show="sharedStore.isCenterlineShow">'+
                '<div id="horizonal-center-line" v-bind:style="{ left: 0 + \'px\', top: horizonalTop + \'px\', width: width + \'px\',height:\'1px\', zIndex: Zindex + 1 }" style="position: absolute;border-top:1px dashed red;"></div>'+
                '<div id="portrait-center-line" v-bind:style="{ left: portraitLeft + \'px\', top: 0 + \'px\', width: 1 + \'px\',height: height + \'px\', zIndex: Zindex + 1 }" style="position: absolute;border-left:1px dashed red;"></div>'+
              '</div>'+
              '<canvas id="helpline-border-up" v-bind:style="{ left: borderUpLeft + \'px\', top: borderUpTop + \'px\', zIndex: Zindex + 1 }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-right" v-bind:style="{ left: borderRightLeft + \'px\', top: borderRightTop + \'px\', zIndex: Zindex + 1 }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-down" v-bind:style="{ left: borderDownLeft + \'px\', top: borderDownTop + \'px\', zIndex: Zindex + 1 }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-left" v-bind:style="{ left: borderLeftLeft + \'px\', top: borderLeftTop + \'px\', zIndex: Zindex + 1 }" style="position: absolute;"></canvas>'+
            '</div>',
  props: [
    'width',
    'height'
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
      horizonalTop: 0,
      portraitLeft: 0,
      src: ''
    };
  },
  computed: {
     Zindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 9) * 101;
    },
    helplineZindex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
          elementTotal = currentCanvas.params.length || 0;

      return (elementTotal + 2) * 100;
    },
    src: function() {
      return this.currentBgImage() + '?version=card_gray1';
    }
  },
  methods: {
    initBg: function() {
      this.initBgImage();
      // this.initHelplines();

      if(this.sharedStore.isPortal) {
        this.initLineBorder();
      }else {
        var elUp = document.getElementById('helpline-border-up'),
            elRight = document.getElementById('helpline-border-right'),
            elDown = document.getElementById('helpline-border-down'),
            elLeft = document.getElementById('helpline-border-left');
            elUp.width = elDown.width = elUp.height = elRight.width = elDown.height = elLeft.width = elRight.height = elLeft.height =0;
      };
        Store.isSwitchLoadingShow = false;
        Store.isPageLoadingShow = false;
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
      // elUp.width = elDown.width = currentCanvas.width - (currentCanvas.realBleedings.left + currentCanvas.realBleedings.right)*currentCanvas.ratio;
      elUp.width = elDown.width = currentCanvas.width;
      // elUp.height = elRight.width = elDown.height = elLeft.width = 2;
      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
      // elRight.height = elLeft.height = currentCanvas.height - (currentCanvas.realBleedings.top + currentCanvas.realBleedings.bottom)*currentCanvas.ratio;
      elRight.height = elLeft.height = currentCanvas.height;
      _this.borderUpLeft = _this.borderDownLeft = _this.borderLeftLeft = currentCanvas.x;
      _this.borderUpTop = _this.borderRightTop = _this.borderLeftTop = currentCanvas.y;
      _this.borderRightLeft = currentCanvas.x  + currentCanvas.width;
      _this.borderDownTop = currentCanvas.y + currentCanvas.height;

      var formedSpread = currentCanvas.formedSpread;
       _this.horizonalTop = currentCanvas.y + (formedSpread.height/2+formedSpread.top)*currentCanvas.ratio;
       _this.portraitLeft = currentCanvas.x + (formedSpread.width/2+formedSpread.left)*currentCanvas.ratio;;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      DrawManage.drawDashedLine('helpline-border-up', _this.borderColor, 0, 0, elUp.width, 0, 2, 3);

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      DrawManage.drawDashedLine('helpline-border-right', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      DrawManage.drawDashedLine('helpline-border-down', _this.borderColor, 0, 0, elDown.width, 0, 2, 3);

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      DrawManage.drawDashedLine('helpline-border-left', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);

    },
    initBgImage: function() {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var imageUrl = this.currentBgImage();

      var el = document.getElementById('bg-part'),
          canvas = el.getContext('2d');
      el.width = _this.width;
      el.height = _this.height;

      canvas.clearRect(-1, -1, el.width + 2, el.height + 2);
      var image = new Image();
      // imageUp.src = '/template-resources/images/bigNewPhotoFrame/baroque_gold_up.jpg';
      image.src = imageUrl;
      image.onload = function() {
        var drawWidth = _this.width,
            drawHeight = _this.width*(this.height/this.width);
        canvas.drawImage(image, 0, 0,_this.width,_this.height);
        Store.vm.$broadcast("notifyRefreshScreenshot",true);
      };
    },
    currentBgImage : function(){
          var bg = {},
              key = '',
              type = Store.pages[Store.selectedPageIdx].type,
              currentProject = Store.projectSettings[Store.currentSelectProjectIndex],
              product = Store.projectSettings[Store.currentSelectProjectIndex].product,
              size = currentProject['size'].toLowerCase(),
              orientation  = currentProject['orientation'],
              prefix = this.getPrefix(),
              bgSrc = '';
          if(['frontPage','backPage'].indexOf(type) !== -1 && product === 'FD'){
            var usePosition = type === "frontPage"? '_Front':'_Back';
            bg.src = prefix + size + usePosition + ".png?version=card_gray1";
          }else{
             bg.src = prefix + size + ".png?version=card_gray1";
          }
          return bg.src;
      },

      getPrefix : function(){
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex],
            type = Store.pages[Store.selectedPageIdx].type,
            product = Store.projectSettings[Store.currentSelectProjectIndex].product,
            trim = Store.projectSettings[Store.selectedIdx].trim,
            path = 'assets/img/types/',
            size = currentProject['size'].toLowerCase(),
            orientation  = currentProject['orientation'];
            format  = currentProject['format'];

            if(['frontPage','backPage'].indexOf(type) !== -1){
              path += 'coverPage/' + product + '/' + trim + '/' + orientation + '/';
              if( product === 'FD'){
                path += format + '/' + size +'/';
              }
            }else{
              path += 'insidePage/' + trim + '/' + orientation + '/';
              if( product === 'FD'){
                path += format + '/';
              }
            }

            return path;
      }
  },
  events: {
    notifyRefreshBackground: function() {
      this.initBg();
    }
  },
  ready: function() {
    var _this = this;

    _this.$watch('width', function() {
      if(_this.width) {
        _this.initBg();
      };
    });

    _this.$watch('height', function() {
      if(_this.height) {
        _this.initBg();
      };
    });
  }
};
