
// component -- action panel
module.exports = {
	template: '<div class="bed-actionpanel-top">' +
							'<div style="height: 66px;text-align: center;">' +
								'<div class="button action-item" style="margin: 30px 40px 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;display:none;" v-on:click="handleAddText()">Add Text</div>' +
								// '<div v-show="showRotate" class="button action-item" style="margin: 30px 0 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleRotate()">Rotate</div>' +
								'<div v-show="showRotate" v-bind:class="{button:rotated,\'button-white\':!rotated}" class="action-item font-normal" style="border:1px solid #393939;margin: 30px 0 10px 0; width: 120px;height: 24px;line-height: 24px;border-radius: 14px 0 0 14px ;text-align: center;font-size: 12px;" v-on:click="handleRotate(\'H\')">Landscape</div>' +
								'<div v-show="showRotate" v-bind:class="{button:!rotated,\'button-white\':rotated}" class="action-item font-normal" style="border:1px solid #393939;;margin: 30px 0 10px 0; width: 120px;height: 24px;line-height: 24px;border-radius: 0 14px 14px 0;text-align: center;font-size: 12px;" v-on:click="handleRotate(\'V\')">Portrait</div>' +
								'<div class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;display:none;" id="show-edit-matt" v-on:click="handleEdit()">Setting</div>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {
				showRotate : true
			},
			sharedStore: Store,
			rotated : ''
		};
	},
	computed : {
		rotated: function(){
			return this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].rotated;
		},
		showRotate : function() {
			var currentProject = Store.projectSettings[Store.currentSelectProjectIndex],
				currentSize    = currentProject.size;
			if(currentSize.split("X")[0] === currentSize.split("X")[1]){
				return false;
			}else{
				return true;
			};
		}
	},
  methods: {
    handleAddText: function() {
      this.$dispatch("dispatchShowAddText");
    },

		handleRotate: function(direction) {
			var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
			if((currentProject.rotated && currentProject.orientation === "Landscape" && direction === "V")
				|| (!currentProject.rotated && currentProject.orientation === "Portrait" && direction === "H")
			){
				this.sharedStore.isSwitchLoadingShow = true;
				currentProject.rotated=!currentProject.rotated;
				currentProject.orientation = currentProject.orientation === "Landscape" ? "Portrait" : "Landscape";
				require('trackerService')({ev: require('trackerConfig').SwitchOrientation,orientation: currentProject.orientation === "Landscape" ? "Landscape" : "Portrait"});
				this.$dispatch("dispatchRotate");
				this.sharedStore.pages[Store.selectedPageIdx].canvas.pageItems[0].handleRepaint();
				this.$dispatch("dispatchRotateTemplate");
			}
		},

		handleEdit: function() {
			this.$dispatch("dispatchShowMattingGlassEdit");
		}
  }
};
