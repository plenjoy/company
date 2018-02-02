
// component -- action panel
module.exports = {
	template: 	'<div class="bed-actionpanel-top" :style="usedStyle">' +
					'<div style="height: 60px;text-align: center;">' +
	      				'<div class="button action-item" :style="addTextStyle" style="margin-top: 30px; margin-bottom: 15px; width: 120px;height: 26px;line-height: 26px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleAddText()">Add Text</div>' +
	      				'<div v-show="sharedStore.isPortal && (sharedStore.lockedElementId === null || sharedStore.lockedPageIdx !== sharedStore.selectedPageIdx)" class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 26px;line-height: 26px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleElementLock()">Lock</div>' +
	      				'<div v-show="sharedStore.isPortal && sharedStore.lockedPageIdx === sharedStore.selectedPageIdx && sharedStore.lockedElementId !== null" class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 26px;line-height: 26px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleElementUnlock()">Unlock</div>' +
	      				'<div v-show="sharedStore.isPortal" class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 26px;line-height: 26px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="toggleBgImage()">{{sharedStore.isBgImageShow ? \'HideBgImage\' : \'ShowBgImage\'}}</div>' +
                '<div v-show="sharedStore.isPortal" class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 26px;line-height: 26px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="toggleCenterLine()">{{sharedStore.isCenterlineShow ? \'HideCenterLine\' : \'ShowCenterLine\'}}</div>' +
				    '</div>' +
				'</div>',
	data: function() {
		return {
			privateStore: {
			},
			sharedStore: Store,
			rotated: '',


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
		},
		usedStyle: function() {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
			elementTotal = currentCanvas.params.length || 0;
			
			return Store.isPortal ? null : {
				zIndex: (elementTotal + 10) * 110 - 2
			};
		},
		addTextStyle: function() {
			return Store.isPortal ? {
				marginTop: '30px'
			} : {
				marginTop: '19px'
			}
		}
	},
	methods: {
	    handleAddText: function() {
				require('trackerService')({ev: require('trackerConfig').ClickAddText});
	      this.$dispatch("dispatchShowAddText");
    	},
    	handleElementLock: function (){
    		var currentCanvas = this.sharedStore.pages[this.sharedStore.selectedPageIdx].canvas;
				this.sharedStore.lockedElementId = currentCanvas.selectedIdx;
				this.sharedStore.lockedPageIdx = Store.selectedPageIdx;
    	},
    	handleElementUnlock: function(){
					this.sharedStore.lockedElementId = null;
					this.sharedStore.lockedPageIdx = null;
    	},
   		toggleBgImage: function(){
   			this.sharedStore.isBgImageShow = !this.sharedStore.isBgImageShow;
   		},
      toggleCenterLine: function(){
        this.sharedStore.isCenterlineShow = !this.sharedStore.isCenterlineShow
      }

    },

 	events: {

 	},
    ready: function(){

	}
};
