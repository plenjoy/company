
// module -- inner preview

module.exports = {
  template: '<div v-show="sharedStore.isMarkingPlaceShow" style="position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; background-color: white;">' +
              '<img src="../../static/img/close-normal.svg" width="16" height="16" v-on:click="handleHidePreview()" onmouseover="this.src = \'../../static/img/close-hover.svg\'" onmouseout="this.src = \'../../static/img/close-normal.svg\'" alt="close" title="close" style="position: absolute; top: 18px; right: 44px; cursor: pointer;" />' +
              '<iframe v-bind:src="privateStore.previewUrl" frameborder="0" scrolling="auto" style="width: 2500px; height: 3000px;">' +
              '</iframe>' +
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
      this.sharedStore.isMarkingPlaceShow = false;
    },
  },
  ready: function() {
    var _this = this;

    _this.$watch('sharedStore.isMarkingPlaceShow', function() {
      if(_this.sharedStore.isMarkingPlaceShow) {
        var editUrl = window.location.href;
        var prefix = editUrl.split('index.html?')[0];

        editUrl = prefix + 'markingplace.html?initGuid=' + Store.projectId + '&isMarkingPlace=true&source=self';

        _this.privateStore.previewUrl = editUrl;
      }
      else {
        _this.privateStore.previewUrl = '';
      };
    });
  }
};
