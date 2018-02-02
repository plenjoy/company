
// module -- inner preview

module.exports = {
  template: '<div v-show="sharedStore.isInnerPreviewShow" style="position: absolute; z-index: 9999999; left: 0; top: 0; width: 100%; height: 100%; background-color: white;">' +
              '<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePreview()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position: absolute; top: 18px; right: 44px; cursor: pointer;" />' +
              '<iframe v-bind:src="privateStore.previewUrl" frameborder="0" scrolling="auto" v-bind:style="{height:height}" style="width: 100%;min-height:100%;">' +
              '</iframe>' +
            '</div>',
  data: function() {
		return {
			privateStore: {
        previewUrl: '',
        orderedPreview: false
			},
			sharedStore: Store
		};
	},
  computed: {
    // previewUrl: function() {
    //   var editUrl = window.location.href;
    //   var prefix = editUrl.split('index.html?')[0];
    //
    //   editUrl = prefix + 'preview.html?initGuid=' + Store.projectId + '&isPreview=true&source=self';
    //
    //   return editUrl;
    // },
    height : function(){
      var UtilWindow  = require('UtilWindow'),
          height      = UtilWindow.getPrintPreviewBoxLimit().width,
          pagesNum    = this.sharedStore.pages.length,
          windowWidth = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
          numInRow    = Math.floor((windowWidth-100)/(height+20)),
          iframeHeight  = 100+Math.ceil(pagesNum/numInRow)*(height+70)+"px";
      return iframeHeight;
    }
  },
  methods: {
    handleHidePreview: function() {
      if(!this.privateStore.orderedPreview) {
        $("#main-page").css('display','block');
        this.sharedStore.isInnerPreviewShow = false;
      } else {
        location.href = '/my-projects.html';
      }
    }
  },
  events: {
    notifyIframeHeightChange: function() {
      var UtilWindow  = require('UtilWindow'),
          height      = UtilWindow.getPrintPreviewBoxLimit().width,
          pagesNum    = this.sharedStore.pages.length,
          windowWidth = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
          numInRow    = Math.floor((windowWidth-100)/(height+20)),
          iframeHeight  = 100+Math.ceil(pagesNum/numInRow)*(height+50)+"px";
          $("iframe").css("height",100+Math.ceil(pagesNum/numInRow)*(height+70));
    },

    notifyOrderedPreview: function() {
      this.sharedStore.isInnerPreviewShow = true;
      this.privateStore.orderedPreview = true;
    }
  },
  ready: function() {
    var _this = this;

    _this.$watch('sharedStore.isInnerPreviewShow', function() {
      if(_this.sharedStore.isInnerPreviewShow) {
        var editUrl = window.location.href;
        var prefix = editUrl.split('index.html?')[0];
        var orderedPreview = _this.privateStore.orderedPreview ? '&orderedPreview=true' : '';

        editUrl = prefix + 'preview.html?initGuid=' + Store.projectId + '&isPreview=true&source=self' + orderedPreview;

        _this.privateStore.previewUrl = editUrl;
      }
      else {
        _this.privateStore.previewUrl = '';
      };
    });
  }
};
