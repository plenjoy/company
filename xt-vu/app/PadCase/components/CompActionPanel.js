
// component -- action panel
module.exports = {
	template: '<div class="bed-actionpanel-top" style="position:absolute;left:0;top:38px;background:white;width:100%;height:38px;border-bottom: 1px solid #d6d6d6;z-index: -1;">' +
					'<div>' +
						'<div style="float: right;margin: 12px 20px 0 0;height: 16px;line-height: 16px;" class="font-medium">'+
                  			'<span class="font-medium" v-show="!trialPrice"  style="padding-left:15px;font-size:14px;color:#3a3a3a;">{{\'$\' + toFixed(oriPrice, 2) +\' USD\'}}</span>'+
                  			'<span class="font-medium" v-show="typeof trialPrice !==\'undefined\'" style="padding-left:15px;font-size:14px;color:#3a3a3a;">{{\'$\' + toFixed(trialPrice, 2) +\' USD\'}}</span>'+
              			'</div>'+
								// '<div class="button action-item" style="margin: 30px 40px 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleAddText()">Add Text</div>' +
								// '<div class="button action-item" style="margin: 30px 0 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleRotate()">Rotate</div>' +
								// '<div class="button action-item" v-show="sharedStore.isFrameLayer" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleFrameLayer()">Frame Layer</div>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			privateStore: {},
			sharedStore: Store,
			oriPrice : '',
            trialPrice : '',
            priceStyle:'',
		};
	},
  methods: {
		toFixed: function(num, remainDecimal) {
			return require('UtilMath').round(num, remainDecimal).toFixed(2);
		},

    handleAddText: function() {
      this.$dispatch("dispatchShowAddText");
    },

	handleRotate: function() {
		var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
		currentProject.rotated=!currentProject.rotated;
		this.$dispatch("dispatchRotate");
		Store.vm.$broadcast("notifySetRotatedTemplate");
	},

	handleFrameLayer : function(){

	},
	handleCanvasPriceChange: function(){
        var Prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
        var options = Prj.deviceType;
        var user = this.sharedStore.userSettings;
        var userId = user.userId;
        var product = Prj.product;
        require("ProjectService").getPadPrice(product, options, userId);
    },
  },
  events: {
  	notifyCanvasPriceChange:function(){
        this.handleCanvasPriceChange();
    }
  },

  ready: function(){
  	  var _this = this;
        _this.$watch('sharedStore.priceChange',function(){
            _this.$set('oriPrice',_this.sharedStore.photoPrice.oriPrice);
            _this.$set('trialPrice',_this.sharedStore.photoPrice.trialPrice);
            _this.sharedStore.priceChange = false;
        });
  }
};
