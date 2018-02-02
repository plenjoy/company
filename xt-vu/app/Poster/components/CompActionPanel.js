
// component -- action panel
module.exports = {
	template: '<div class="bed-actionpanel-top">' +
							'<div style="height: 80px;text-align: center;">' +
                  			'<div style="position:absolute;right:18px;width:100px;margin-top:15px;" class="font-medium">'+
                  			'<span class="font-medium" v-show="!trialPrice"  style="padding-left:15px;font-size:14px;color:#3a3a3a;">{{oriPrice}}</span>'+
                  			'<span class="font-medium" v-show="typeof trialPrice !==\'undefined\'" style="padding-left:15px;font-size:14px;color:#3a3a3a;">{{trialPrice}}</span>'+
                  			// '<img src="./assets/img/title-price.svg" style="width:13px;height:13px;margin-left:8px;"/>'+
                  			'</div>'+

								// '<div class="button action-item" v-show="showRotate" style="margin: 30px 0 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleRotate()">Rotate</div>' +
								// '<div class="button action-item" v-show="sharedStore.isFrameLayer" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleFrameLayer()">Frame Layer</div>' +
							'<div style="margin:0 auto">'+
								'<div v-show="showRotate"  v-bind:class="{button:rotated,\'button-white\':!rotated}" class="action-item font-normal" style="border:1px solid #393939;margin: 30px 0 0px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px 0 0 14px ;text-align: center;font-size: 12px;" v-on:click="handleRotate(\'H\')">Landscape</div>' +
								'<div v-show="showRotate"  v-bind:class="{button:!rotated,\'button-white\':rotated}" class="action-item font-normal" style="border:1px solid #393939;;margin: 30px 0 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 0 14px 14px 0;text-align: center;font-size: 12px;" v-on:click="handleRotate(\'V\')">Portrait</div>' +
						    '</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {},
			prj: {},
			sharedStore: Store,
			rotated: '',
			oriPrice : '',
            trialPrice : '',
            priceStyle:'',

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
		prj: function(){
            var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
            return prj;
        },
	},
  methods: {
    handleAddText: function() {
      this.$dispatch("dispatchShowAddText");
    },
    handleCanvasPriceChange: function(){
        var options = this.prj.paper + ',' + this.prj.size;
        var user = this.sharedStore.userSettings;
        var userId = user.userId;
        var product = this.prj.product;
        require("ProjectService").getPosterPrice(product, options, userId);
    },
	// handleRotate: function() {

	// 		if(this.sharedStore.rotateLock){
	// 			var params = this.sharedStore.pages[0].canvas.params;
	// 			var hasTextElement = params.some(function(item){return item.elType === "text" });
	// 			if(params.length && hasTextElement){
	// 				this.sharedStore.rotateLock = false;
	// 			}
	// 			var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
	// 			currentProject.rotated=!currentProject.rotated;
	// 			this.$dispatch("dispatchRotate");
	// 			Store.vm.$broadcast("notifySetRotatedTemplate");
	// 		}
	// },
	handleRotate: function(direction) {

		if(this.sharedStore.rotateLock){
			var params = this.sharedStore.pages[0].canvas.params;
			var hasTextElement = params.some(function(item){return item.elType === "text" });
			if(params.length && hasTextElement){
				this.sharedStore.rotateLock = false;
			}
      var hasPhotoElement = params.some(function(item){ return item.elType === 'image'; })
			var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
			if((currentProject.rotated && direction === "V") || (!currentProject.rotated && direction === "H") ){
        if(hasPhotoElement){
				  this.sharedStore.isSwitchLoadingShow = true;
        }
				currentProject.rotated=!currentProject.rotated;
				this.$dispatch("dispatchRotate");
				// Store.vm.$broadcast("notifySetRotatedTemplate");
				this.$dispatch("dispatchRotateTemplate");
				console.log(currentProject.rotated);
			}
		}
	},
	handleFrameLayer : function(){

	}
  },

  events: {
  	notifyCanvasPriceChange:function(){
        this.handleCanvasPriceChange();
    }
  },

  ready: function(){
  	  var _this = this;
        /*_this.$watch('sharedStore.priceChange',function(){
            _this.$set('oriPrice',_this.sharedStore.photoPrice.oriPrice);
            _this.$set('trialPrice',_this.sharedStore.photoPrice.trialPrice);
            // if(_this.trialPrice){
            //     _this.priceStyle = {textDecoration : 'line-through'};
            // }else{
            //     _this.priceStyle = {textDecoration : 'none'};
            // }
            _this.sharedStore.priceChange = false;
        });*/
  }
};
