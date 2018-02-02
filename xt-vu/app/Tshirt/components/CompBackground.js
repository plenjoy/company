
var ProjectManage = require('ProjectManage');
var DrawManage = require('DrawManage');
var SpecController = require('SpecController');
// component -- background

module.exports = {
  template: /*'<!-- background layer -->' +
            '<div style="position: absolute; left: 0; top: 0; height: 100%; width: 100%;">' +*/
              '<!-- background -->' +
              '<canvas id="bg-part" style="position: absolute; left: 0; top: 0; "></canvas>' +
              '<canvas id="helpline-border-up" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderUpLeft + \'px\', top: borderUpTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-right" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderRightLeft + \'px\', top: borderRightTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-down" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderDownLeft + \'px\', top: borderDownTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-border-left" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: borderLeftLeft + \'px\', top: borderLeftTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-logo-up" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoUpLeft + \'px\', top: logoUpTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-logo-right" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoRightLeft + \'px\', top: logoRightTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-logo-down" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoDownLeft + \'px\', top: logoDownTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-logo-left" v-show="((sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\') && sharedStore.selectedPageIdx === 0" v-bind:style="{ left: logoLeftLeft + \'px\', top: logoLeftTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>' +
              '<canvas id="helpline-center" v-show="(sharedStore.operateMode !==\'\' && sharedStore.operateMode !== \'idle\') || sharedStore.previewSource ===\'factory\'" v-bind:style="{ left: centerLeft + \'px\', top: centerTop + \'px\', zIndex: helplineZindex }" style="position: absolute;"></canvas>'
            /*'</div>'*/,
  props: [
    'width',
    'height'
  ],
  data: function() {
    return {
      sharedStore: Store,
      borderColor: '#7b7b7b',
      borderUpLeft: 0,
      borderUpTop: 0,
      borderRightLeft: 0,
      borderRightTop: 0,
      borderDownLeft: 0,
      borderDownTop: 0,
      borderLeftLeft: 0,
      borderLeftTop: 0,
      logoColor: '#7b7b7b',
      logoUpLeft: 0,
      logoUpTop: 0,
      logoRightLeft: 0,
      logoRightTop: 0,
      logoDownLeft: 0,
      logoDownTop: 0,
      logoLeftLeft: 0,
      logoLeftTop: 0,
      centerColor: '#de3418',
      centerLeft: 0,
      centerTop: 0
    };
  },
  computed: {
    helplineZindex: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
					elementTotal = currentCanvas.params.length || 0;

			return (elementTotal + 2) * 100;
		},

    // bgZindex: function() {
    //   var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
    //       elementTotal = currentCanvas.params.length || 0;
    //
    //   return (elementTotal + 3) * 100;
    // },
  },
  methods: {
    initBg: function() {
      this.initBgImage();

      this.initHelplines();
    },

    initHelplines: function() {
      this.initLineBorder();
      this.initLineLogo();
      this.initLineCenter();
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
      elUp.width = elDown.width = currentCanvas.width;
      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
      elRight.height = elLeft.height = currentCanvas.height;
      _this.borderUpLeft = _this.borderDownLeft = _this.borderLeftLeft = currentCanvas.x;
      _this.borderUpTop = _this.borderRightTop = _this.borderLeftTop = currentCanvas.y;
      _this.borderRightLeft = currentCanvas.x + currentCanvas.width;
      _this.borderDownTop = currentCanvas.y + currentCanvas.height;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      DrawManage.drawDashedLine('helpline-border-up', _this.borderColor, 0, 0, elUp.width, 0, 2, 3);

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      DrawManage.drawDashedLine('helpline-border-right', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      DrawManage.drawDashedLine('helpline-border-down', _this.borderColor, 0, 0, elDown.width, 0, 2, 3);

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      DrawManage.drawDashedLine('helpline-border-left', _this.borderColor, 0, 0, 0, elRight.height, 2, 3);
    },

    initLineLogo: function() {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      var elUp = document.getElementById('helpline-logo-up'),
          elRight = document.getElementById('helpline-logo-right'),
          elDown = document.getElementById('helpline-logo-down'),
          elLeft = document.getElementById('helpline-logo-left'),
          canvasUp = elUp.getContext('2d'),
          canvasRight = elRight.getContext('2d'),
          canvasDown = elDown.getContext('2d'),
          canvasLeft = elLeft.getContext('2d');
      var specData = SpecController.analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
      var logoData = specData.logo;
      elUp.width = elDown.width = logoData.width * currentCanvas.ratio;
      elUp.height = elRight.width = elDown.height = elLeft.width = 2;
      elRight.height = elLeft.height = logoData.height * currentCanvas.ratio;
      _this.logoUpLeft = _this.logoDownLeft = _this.logoLeftLeft = currentCanvas.x + logoData.x * currentCanvas.ratio;
      _this.logoUpTop = _this.logoRightTop = _this.logoLeftTop = currentCanvas.y + logoData.y * currentCanvas.ratio;
      _this.logoRightLeft = currentCanvas.x + (logoData.x + logoData.width) * currentCanvas.ratio;
      _this.logoDownTop = currentCanvas.y + (logoData.y + logoData.height) * currentCanvas.ratio;

      canvasUp.clearRect(-1, -1, elUp.width + 2, elUp.height + 2);
      DrawManage.drawDashedLine('helpline-logo-up', _this.logoColor, 0, 0, elUp.width, 0, 2, 3);

      canvasRight.clearRect(-1, -1, elRight.width + 2, elRight.height + 2);
      DrawManage.drawDashedLine('helpline-logo-right', _this.logoColor, 0, 0, 0, elRight.height, 2, 3);

      canvasDown.clearRect(-1, -1, elDown.width + 2, elDown.height + 2);
      DrawManage.drawDashedLine('helpline-logo-down', _this.logoColor, 0, 0, elDown.width, 0, 2, 3);

      canvasLeft.clearRect(-1, -1, elLeft.width + 2, elLeft.height + 2);
      DrawManage.drawDashedLine('helpline-logo-left', _this.logoColor, 0, 0, 0, elRight.height, 2, 3);
    },

    initLineCenter: function() {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      var el = document.getElementById('helpline-center'),
          canvas = el.getContext('2d');
      el.width = 2;
      el.height = currentCanvas.height * 1.2;
      _this.centerLeft = currentCanvas.x + currentCanvas.width / 2;
      _this.centerTop = currentCanvas.y - 0.1 * currentCanvas.height;

      canvas.clearRect(-1, -1, el.width + 2, el.height + 2);
      DrawManage.drawDashedLine('helpline-center', _this.centerColor, 0, 0, 0, el.height, 2, 3);
    },

    initBgImage: function() {
      var _this = this;
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      var imageUrl = '';
      if(Store.projectSettings[Store.currentSelectProjectIndex].color && Store.selectedPageIdx != null) {
				imageUrl = './assets/img/'+ Store.projectSettings[Store.currentSelectProjectIndex].color +'-'+ Store.selectedPageIdx +'.png';
			};

      var el = document.getElementById('bg-part'),
          canvas = el.getContext('2d');
      el.width = _this.width;
      el.height = _this.height;

      canvas.clearRect(-1, -1, el.width + 2, el.height + 2);
      var image = new Image();
      // imageUp.src = '/template-resources/images/bigNewPhotoFrame/baroque_gold_up.jpg';
      image.src = imageUrl;
      image.onload = function() {
        canvas.drawImage(image, 0, 0, _this.width, _this.height);
        Store.vm.$broadcast("notifyRefreshScreenshot");
      };
    },
  },
  events: {
    notifyRefreshBackground: function() {
      this.initBg();
    },

    notifyChangeBgImage: function() {
      this.initBgImage();
    },

    // notifyChangeMatting: function() {
    //   this.initMatting();
    // }
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
