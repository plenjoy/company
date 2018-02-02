var notSettingKeys = [
	'albumId', 'ordered', 'price', 'projectId',
	'projectXml', 'rotated', 'title', 'token',
	'tplGuid', 'tplSuitId', 'uploadTimestamp', 'userId',
	'product', 'category'
];

module.exports = {
	template:
				'<div v-if="!sharedStore.isPortal && !sharedStore.isPreview && oriPrice && !sharedStore.isRemark" v-bind:style="{zIndex:windowZindex}" style="position:absolute;right:40px;top:60px;">'+
	      			'<div style="height:16px;line-height:16px;">'+

	          			'<img v-show="isShowDetail" src="./assets/img/title-price.svg" style="width:13px;height:13px;margin:1px 20px 0 0;cursor:pointer;float:right;" v-on:click="showTotalPrice()"/>'+
	          			'<span class="font-medium" style="font-size:13px;color:#3a3a3a;margin-left:0px;float:right;">&nbsp;USD</span>'+
	          			'<span class="font-medium" v-show="discount" style="font-size:13px;margin-left:10px;color:#3a3a3a;margin-right:0;float:right;">{{"$" + toFixed(totalPrice, 2)}}</span>'+
	          			'<span class="font-medium" style="font-size:13px;float:right;margin-left:10px;" v-bind:style="{textDecoration:priceStyle, color: discount ? \'#7b7b7b\' : \'#3a3a3a\'}" >{{preMessage + "$" + toFixed(totalOriprice, 2)}}</span>'+
						'<span class="font-medium" style="font-size:13px;float:right;color:#3a3a3a;margin-left:20px;" >{{productMessage}}</span>'+
						// '<span class="font-medium">{{productDisplayName}}:</span>'+
	      			'</div>'+
	      			'<div v-show="sharedStore.isTotalPriceShow && typeof oriPrice !==\'undefined\'" v-bind:style="{zIndex:windowZindex}" style="position:absolute;right:0px;top:43px;width:180px;box-sizing:border-box;border:1px solid #d6d6d6;box-shadow:0 3px 6px rgba(0,0,0,.16);background:#fff;">'+
	      				'<div class="border-style"></div>'+
	      				'<div style="margin-top:15px;height:15px;line-height:15px;">'+
		      				'<span class="price-item font-light" style="width:80px;">Unit price:</span>'+
		      				'<span class="price-num font-normal" style="float:left;padding-left:20px;">{{"$" + toFixed(oriPrice, 2)}}<span>'+
	      				'</div>'+
						'<div v-for="priceOption in priceOptionList" style="margin-top:5px;height:15px;line-height:15px;">'+
		      				'<span class="price-item font-light" style="width:80px;white-space:nowrap;">{{priceOption.title}}</span>'+
		      				'<span class="price-num font-normal" style="float:left;padding-left:20px;">{{"$" + toFixed(priceOption.oriPrice, 2)}}</span>'+
	      				'</div>'+
	      				'<div style="margin-top:5px;height:15px;line-height:15px;">'+
		      				'<span class="price-item font-light" style="width:80px;">Quantity:</span>'+
		      				'<span class="price-num font-normal" style="float:left;padding-left:20px;">{{quantity}}</span>'+
	      				'</div>'+
	      				'<div v-show="discount" style="margin-top:5px;height:15px;line-height:15px;width:180px;">'+
	      					'<div style="width:80px;float:left;margin-left:20px;">'+
			      				'<span class="font-light" style="float:left;font-size:12px;color:#3a3a3a;">Discount:</span>'+
			      				// '<span style="float:right;line-height:15px;">-</span>'+
		      				'</div>'+
		      				'<div class="price-num font-normal" style="float:left;padding-left:16px;">{{"-$" + toFixed(discount, 2)}}</div>'+
	      				'</div>'+
	      				'<hr style="width:140px;margin:10px auto 12px;"/>'+
	      				'<div style="margin-bottom:15px;height:15px;line-height:15px;">'+
		      				'<span class="price-item" style="width:80px;">Total:</span>'+
		      				'<span class="font-medium" style="font-size:12px;color:#3a3a3a;float:left;padding-left:20px;">{{"$" + toFixed(totalPrice, 2)}}<span>'+
	      				'</div>'+
	      			'</div>'+
	      		'</div>',

	data: function() {
		return {
			privateStore: {
				priceShowNum: 0,
			},
			prj: {},
			sharedStore: Store,
			rotated: '',
			oriPrice: 0,
		    sPrice: 0,
		    priceStyle:'',
		    quantity: 0,
			priceOptions: {},
			productDisplayName: '',
			isOnSale: false,
			// 用来配置是否显示价格小窗
			isShowDetail: false
		};
	},
	computed : {
		quantity: function() {
			var quantity = 0;

			// for(var i = 0; i < Store.pages.length; i++) {
			// 	if(!Store.pages[i].isDeleted) {
			// 		var currentProject = Store.projectSettings[i];
			// 		quantity += currentProject.quantity;
			// 	}
			// }

			// return quantity;
			return 1;
		},
		prj: function(){
		    var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
		    return prj;
		},
		productMessage: function() {
			var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
			if(prj.product === 'LRB') {
				return this.quantity + (this.quantity === 1 ? ' Block, ' : ' Blocks, ');
			} else {
				return ''
			}
		},
		preMessage: function() {
			var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
			var photoText = this.sharedStore.LSCPageNum === 1 ? ' photo' : ' photos';
			if(prj.product === 'LSC' && !this.discount) {
				return '10 cards made from ' + this.sharedStore.LSCPageNum + photoText + ', ';
				// return this.sharedStore.LSCPageNum + (this.sharedStore.LSCPageNum === 1 ? ' Photo (': ' Photos (')+ 10/this.sharedStore.LSCPageNum + (10/this.sharedStore.LSCPageNum > 1 ? ' cards' : ' card') +' for each photo), '
			} else {
				return ''
			}
		},
		windowZindex: function() {
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
                    elementTotal = currentCanvas.params.length || 0;

            return (elementTotal + 9) * 101+1;
        },
		// 额外附加价格条目
		priceOptionList: function() {
			var options = this.priceOptions;
			var priceOptionList = [];

			// if(this.prj.trim === 'R') {
			// 	// 添加圆角单价条目
			// 	var priceOption = {
			// 		title: 'Rounded Trim:',
			// 		oriPrice: (options['card-rounded'].oriPrice - 0).toFixed(2) - 0,
			// 		sPrice: (options['card-rounded'].sPrice - 0).toFixed(2) - 0,
			// 		isOnSale: options['card-rounded'].couponId
			// 	};
			// 	priceOptionList.push(priceOption);
			// }

			return priceOptionList;
		},
		discount: function(){
			var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
			var quantity = this.quantity || 1;
			var mainProductDiscount = 0;
			var optionsDiscount = 0;

			if(this.isOnSale) {
				mainProductDiscount = (this.oriPrice - this.sPrice) * quantity;
			}

			if(this.priceOptionList.length > 0) {
				optionsDiscount = this.priceOptionList.map(function(option) {
					if(option.isOnSale) {
						return option.oriPrice - option.sPrice;
					} else {
						return 0;
					}
				});

				optionsDiscount = optionsDiscount.reduce(function(acc, optionDiscount) {
					return acc + optionDiscount * quantity;
				});
			}

			return mainProductDiscount + optionsDiscount;
		},
		totalOriprice:function(){
			var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
			var quantity = this.quantity || 1;
			var optionsOriPrice = 0;

			if(this.priceOptionList.length > 0) {
				optionsOriPrice = this.priceOptionList.reduce(function(sum, option) {
					return sum + option.oriPrice;
				}, 0);
			}

			return (this.oriPrice + optionsOriPrice) * quantity;
		},
		totalPrice: function(){
			var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
			var quantity = this.quantity || 1;

			return this.totalOriprice - this.discount;
		},
	},
	methods: {
		toFixed: function(num, remainDecimal) {
			return require('UtilMath').round(num, remainDecimal).toFixed(2);
		},
		handleAddText: function() {
		  this.$dispatch("dispatchShowAddText");
		},
		showTotalPrice: function(){

			this.sharedStore.isTotalPriceShow = true;

		},

		setProductName: function() {
			var _this = this;
			var productOptionMaps = require("SpecManage").getOptions('product');
			productOptionMaps.forEach(function(productOption) {
				if(productOption.id === _this.prj.product) {
					_this.productDisplayName = productOption.title;
				}
			});
		},

		handleCanvasPriceChange: function(){
			var options = [];
			var _this = this;
			var product = _this.prj.product;
			var userId = _this.sharedStore.userSettings.userId;

			var settingKeys = Object.keys(_this.prj).filter(function(key) {
				return notSettingKeys.indexOf(key) === -1;
			});

			settingKeys.forEach(function(key) {
				if(_this.prj[key] && _this.prj[key] !== 'none') {
					options.push(_this.prj[key]);
				}
			});

			options = options.join(',');
            require("ProjectService").getCanvasPrice(product, options, userId);
        },

		// getList: function(type) {
		// 	var SpecManage = require("SpecManage"),
		// 		keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-"),
		// 		params = [],
		// 		res;
		// 	var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

		// 	for (var i = 0, l = keyPatterns.length; i < l; i++) {
		// 		var key = currentProject[keyPatterns[i]];
		// 		if (key) {
		// 		var item = { key: keyPatterns[i], value: key };
		// 		params.push(item);
		// 		}
		// 	}
		// 	res = SpecManage.getOptionsMap(type, params);
		// 	return res ? res.split(",") : [];
		// },
	},

	events: {
		notifyCanvasPriceChange:function(){
		    this.handleCanvasPriceChange();
		},
	},
	ready: function(){
		var _this = this;
		_this.$watch('sharedStore.priceChange',function(){

			_this.$set('oriPrice', (_this.sharedStore.photoPrice.oriPrice - 0));
			_this.$set('sPrice', (_this.sharedStore.photoPrice.sPrice - 0));
			_this.$set('isOnSale', !!_this.sharedStore.photoPrice.couponId);
			_this.$set('priceOptions', _this.sharedStore.photoPrice.options);

			if(_this.isOnSale){
			    _this.priceStyle = 'line-through';
			}else{
			    _this.priceStyle = 'none';
			}
			_this.sharedStore.priceChange = false;
			// _this.setProductName();
		});
	}
}
