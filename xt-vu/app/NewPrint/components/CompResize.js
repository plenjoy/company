
module.exports = {
	methods: {
		handleResize: function() {
			// console.log('resize');
			if(Store.ctrls.tcResize !== '') {
				// in pending
				clearTimeout(Store.ctrls.tcResize);
				Store.ctrls.tcResize = '';
			}
			else {
				// already loose
			};

			Store.ctrls.tcResize = setTimeout(function() {
				Store.watches.flagRepaint = true;
				clearTimeout(Store.ctrls.tcResize);
				Store.ctrls.tcResize = "";
			}, 500);
		},
	},
	events: {
		// notify resize
		resize: function() {
			this.handleResize();
		}
	},
	created: function() {
		var _this = this;
    // fix v-on:resize
    global.window.addEventListener('resize', function() {
      _this.$emit('resize');
    });


    _this.$watch('sharedStore.watches.flagRepaint', function() {
    	if(_this.sharedStore.watches.flagRepaint) {

				_this.sharedStore.watches.flagRepaint = false;
				// console.log('should repaint');
				// if(Store.watches.isSpecLoaded && Store.watches.isProjectLoaded) {
				// 	_this.$broadcast('notifyRefreshCanvas', Store.currentSelectProjectIndex);
				// };
				// for(var i=0;i<Store.pages.length;i++){
				// 	(function(i){
				// 		Store.pages[i].canvas.pageItems[0].refreshCanvas();
				// 	})(i);
				// }
				if(Store.isImageCropShow){
					Store.vm.$broadcast("notifyImageCrop");
				}
				if(Store.isPrintPreviewShow){
					Store.vm.$broadcast("notifyShowPrintPreview");
				}

				Store.vm.$broadcast("notifyIframeHeightChange");

			};
		});

  }
};
