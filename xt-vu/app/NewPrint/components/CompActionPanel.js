// component -- action panel
module.exports = {
	template: '<div v-if="!sharedStore.isRemark && sharedStore.isActionPanelShow && !sharedStore.checkFailed" class="bed-actionpanel-top" style="height:65px;line-height:65px;margin: 0 40px;">' +
							'<div v-show="sharedStore.pages.length">' +
								'<a class="action-item font-medium"  style="display:inline-block;margin-right: 42px;cursor:pointer;" v-on:click="addPhotos()"> + Add Photos</a>' +
								'<div v-show="sharedStore.isChangeAllAndFilterShow" class="inline">'+
									'<a class="action-item font-medium"  style="display:inline-block;margin-right: 42px;cursor:pointer;" v-on:click="showChangeAll()">Change All</a>' +
									'<span class="font-medium" style="display:inline-block;margin-right:5px;">Filter By Size :</span>'+
									'<select v-show="!sharedStore.isPreview" class="font-light" style="width: 60px;outline:none;" name="" id="" v-on:change="handleOnChange()" v-model="sharedStore.selectedSize">' +
										'<option value="0" selected="selected">All</option>' +
										'<option v-for="size in allSize" value="{{ size.id }}">{{ size.title }}</option>' +
									'</select>' +
								'</div>'+
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {
				size: '',
			},
			sharedStore: Store,
			allSize: []
		};
	},
	computed: {},
	methods: {
		addPhotos: function() {
			Store.vm.$broadcast("notifyShowImageUpload");
			require('trackerService')({ev: require('trackerConfig').AddPhotos});
		},

		showChangeAll: function() {
			// Store.vm.$broadcast("notifyShowChangeAll");
			// this.sharedStore.isChangeAllShow = true;
			this.$dispatch("dispatchShowChangeAll");
			// 埋点
			require('trackerService')({ev: require('trackerConfig').ClickChangeAll});
		},
		handleOnChange: function() {

		},
		fixList: function(type, oriAry) {
			if (type && oriAry) {
				var mapList = require('SpecManage').getOptions(type);
				var newAry = [];
				for (var i = 0; i < oriAry.length; i++) {
					for (var j = 0; j < mapList.length; j++) {
						if (oriAry[i] === mapList[j].id) {
							var nid = oriAry[i];
							var SpecManage = require("SpecManage");
							var keyPatterns = SpecManage.getOptionMapKeyPatternById(type).split("-");
							var params = [];
							params.push({key:'product',value:'print'});
							var res = SpecManage.getDisableOptionsMap(type, params);
							var resArray;
							if (res != null) {
								resArray = res.split(",")
							}
							var inDisableArray = false;
							for (var tt in Store.disableArray) {
								if (Store.disableArray[tt].idx == this.id) {
									inDisableArray = true;
								}
							}
							if (inDisableArray || !res || (resArray && resArray.indexOf(nid) == -1)) {
								newAry.push({
									id: oriAry[i],
									title: mapList[j].name || mapList[j].title || ''
								});
							}

							break;
						};
					};
				};

				return newAry;
			};
		},

	},
	ready: function() {
		var _this = this;
		_this.$watch('sharedStore.watches.isProjectLoaded', function() {
			if (_this.sharedStore.watches.isProjectLoaded) {
				_this.allSize = require("SpecManage").getAvailableOptions('size');
				_this.allSize = _this.fixList("size", _this.allSize);
			}
		})
	}
};
