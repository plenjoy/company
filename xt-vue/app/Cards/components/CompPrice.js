
module.exports = {
	template:
			'<div v-if="!sharedStore.isPortal" style="z-index:-1;position:absolute;left:0;top:38px;background:white;width:100%;height:38px;border-bottom: 1px solid #d6d6d6;">'+
      			'<div style="margin-top:12px;height:16px;line-height:16px;">'+
          			'<img src="./assets/img/title-price.svg" style="width:13px;height:13px;margin:1px 20px 0 0;cursor:pointer;float:right;" v-on:click="showTotalPrice()"/>'+
          			'<span class="font-medium" style="font-size:13px;color:#3a3a3a;margin-right:10px;float:right;">{{"$" + toFixed(totalPrice, 2) + " USD"}}</span>'+
          			'<span class="font-normal" v-show="discount" style="font-size:13px;color:#7B7B7B;margin-right:18px;float:right;" v-bind:style={textDecoration:priceStyle} >{{"$" + toFixed(totalOriprice, 2)}}</span>'+
      			'</div>'+
      			'<div v-show="sharedStore.isTotalPriceShow && typeof oriPrice !==\'undefined\'" v-bind:style="{zIndex:windowZindex}" style="position:absolute;right:5px;top:38px;width:180px;box-sizing:border-box;border:1px solid #d6d6d6;box-shadow:0 3px 6px rgba(0,0,0,.16);background:#fff;">'+
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
	      				'</div>'+
	      				'<div class="price-num font-normal" style="float:left;padding-left:15px;">{{"-$" + toFixed(discount, 2)}}</div>'+
    				'</div>'+
    				'<hr style="width:140px;margin:10px auto 12px;"/>'+
    				'<div style="margin-bottom:15px;height:15px;line-height:15px;">'+
	      				'<span class="price-item" style="width:80px;font-weight:700;">Total:</span>'+
	      				'<span class="font-medium" style="font-size:12px;color:#3a3a3a;float:left;padding-left:20px;font-weight:700;">{{"$" + toFixed(totalPrice, 2)}}<span>'+
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
			isOnSale: false
		};
	},
	computed : {

		prj: function(){
		    var prj = this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
		    return prj;
		},
		windowZindex: function() {
            // var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
            //         elementTotal = currentCanvas.params.length || 0;

						// return (elementTotal + 9) * 101+1;
						return 1;
        },
		// 额外附加价格条目
		priceOptionList: function() {
			var options = this.priceOptions;
			var priceOptionList = [];

			if(this.prj.trim === 'R') {
				// 添加圆角单价条目
				var priceOption = {
					title: 'Rounded Trim:',
					oriPrice: +options['card-rounded'].oriPrice,
					sPrice: +options['card-rounded'].sPrice,
					isOnSale: options['card-rounded'].couponId
				};
				priceOptionList.push(priceOption);
			}

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

			this.sharedStore.isTotalPriceShow = !this.sharedStore.isTotalPriceShow;
			if(this.sharedStore.isTotalPriceShow) {
					require('trackerService')({ev: require('trackerConfig')['CheckPrice'], totalOriprice: this.totalOriprice.toFixed(2), totalPrice: this.totalPrice.toFixed(2)});
			}
		},
		handleCardsPriceChange: function(){
		    var options = this.prj.paper + ',' + this.prj.size ;
		    var rounded = this.prj.trim,
		    	quantity;
		    if(Store.quantity){
		    	quantity = Store.quantity;
		    }else{
		    	quantity = 1;
		    }
		    var user = this.sharedStore.userSettings;
		    var userId = user.userId;
		    var product = this.prj.product;
		    require("ProjectService").getCardsPrice(product, options, quantity, rounded, userId);
		},
	},

	events: {
		notifyCardsPriceChange:function(){
		    this.handleCardsPriceChange();
		},

	},
	ready: function(){
		var _this = this;
		_this.$watch('sharedStore.priceChange',function(){

			_this.$set('oriPrice', _this.sharedStore.photoPrice.oriPrice);
			_this.$set('sPrice', _this.sharedStore.photoPrice.sPrice);
			_this.$set('isOnSale', !!_this.sharedStore.photoPrice.couponId);
			_this.$set('priceOptions', _this.sharedStore.photoPrice.options);

			if(_this.isOnSale){
			    _this.priceStyle = 'line-through';
			}else{
			    _this.priceStyle = 'none';
			}
			_this.sharedStore.priceChange = false;
		});

		_this.$watch('sharedStore.watches.isProjectComplete',function(){
            if(_this.sharedStore.watches.isProjectComplete){
                var prj = _this.sharedStore.projectSettings[Store.currentSelectProjectIndex];
                if(Store.quantity){
                	_this.quantity = (Store.quantity - 0);
                }else{
                	_this.quantity = 1;
                }

            }
        })
	}
}
