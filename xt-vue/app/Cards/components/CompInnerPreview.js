
// module -- inner preview

module.exports = {
  template: '<div id="frame" v-show="sharedStore.isInnerPreviewShow" style="position: fixed; z-index: 9999999; left: 0; top: 0; width: 100%; height: 100%; background-color: white;">' +
              '<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePreview()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position: absolute; top: 18px; right: 44px; cursor: pointer;" />' +
              // '<iframe v-bind:src="privateStore.previewUrl" frameborder="0" scrolling="auto" style="width: 100%; height: 100%;">' +
              // '</iframe>' +
            '</div>',
  data: function() {
		return {
			privateStore: {
        previewUrl: ''
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
  },
  methods: {
    handleHidePreview: function() {
      this.sharedStore.isInnerPreviewShow = false;
    },
  },
  ready: function() {
    var _this = this;

    _this.$watch('sharedStore.isInnerPreviewShow', function() {
      if(_this.sharedStore.isInnerPreviewShow) {
        if(document.getElementById("inner-preview")){
          document.getElementById("frame").removeChild(document.getElementById("inner-preview"));
        }
        var editUrl = window.location.href;
        var prefix = editUrl.split('index.html?')[0];
        editUrl = prefix + 'preview.html?initGuid=' + Store.projectId + '&isPreview=true&source=self';
        _this.privateStore.previewUrl = editUrl;
        var iframe = document.createElement('iframe');
        iframe.src = editUrl;
        iframe.id = 'inner-preview';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        document.getElementById("frame").appendChild(iframe);
      }
      else {
        _this.privateStore.previewUrl = '';
      };
    });
  }
};
