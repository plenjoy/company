
var Vue = require('vuejs');

var CompImageList = Vue.extend(require('../components/CompImageList.js'));
var CompOptions = Vue.extend(require('../components/CompOptions.js'));
var CompTextFormList = Vue.extend(require('../components/CompTextFormList.js'));
// Vue.component('image-list', CompImageList);

// component -- list tab
module.exports = {
	template:
		'<div class="bed-list-tab" v-on:click="blurFocus" style="float: left;border-right: 1px solid rgba(232, 232, 232, 1);border-top: 1px solid rgba(232, 232, 232, 1);">' +
			'<div style="height: 34px;">' +
				'<div class="t-center" v-bind:class="list0Class" v-on:click="handleChangeTab(0)" v-show="!sharedStore.isPortal" :style="{width:listWidths.option}" style="border-right:1px solid rgba(232, 232, 232, 1);">Options</div>' +
				'<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(1)" :style="{width:listWidths.images}" style="border-right:1px solid rgba(232, 232, 232, 1);">Photos</div>' +
				// '<div class="t-center" v-bind:class="list2Class" v-on:click="handleChangeTab(2)" v-show="sharedStore.textFormList.length" :style="{width:listWidths.layouts}" style="border-right:1px solid rgba(232, 232, 232, 1);">Layouts</div>' +
				'<div class="t-center" v-show="sharedStore.isPortal" v-bind:class="list3Class" v-on:click="handleChangeTab(3)" :style="{width:listWidths.decorations}" style="border-right:1px solid rgba(232, 232, 232, 1);">Decorations</div>' +
				// '<div class="t-center" v-bind:class="list4Class" v-on:click="handleChangeTab(4)" v-show="sharedStore.textFormList.length" :style="{width:listWidths.forms}">Form</div>' +
			'</div>' +

			'<option-list v-show="privateStore.currentView === \'option-list\'" v-if="!sharedStore.isPortal" ></option-list>' +
			'<image-list v-show="privateStore.currentView === \'image-list\'"></image-list>' +
			// '<layout-list v-show="privateStore.currentView === \'layout-list\'" v-if="sharedStore.projectSettings[this.sharedStore.selectedIdx].product === \'FD\' ||  sharedStore.isPortal"></layout-list>' +
			'<decoration-list v-if="privateStore.currentView === \'decoration-list\'"></decoration-list>' +
			'<form-list v-show="privateStore.currentView === \'form-list\'"></form-list>' +
		'</div>',
	data: function() {
		return {
			privateStore: {
				currentView: 'image-list'
			},
			sharedStore: Store
		};
	},
	computed: {
		list0Class: function() {
			if(this.privateStore.currentView === 'option-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},

		list1Class: function() {
			if(this.privateStore.currentView === 'image-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},
		list2Class: function() {
			if(this.privateStore.currentView === 'layout-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},
		list3Class: function() {
			if(this.privateStore.currentView === 'decoration-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},
		list4Class: function() {
			if(this.privateStore.currentView === 'form-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},
		listWidths: function() {
			var listWidth = 280;

			if(!this.sharedStore.isPortal){
				if(Store.textFormList.length) {
					return {
						option: listWidth / 2 - 1 + 'px',
						images: listWidth / 2 - 1 + 'px',
						// forms: listWidth / 3 - 1 + 'px'
					}
				} else {
					return {
						option: listWidth / 2 - 1 + 'px',
						images: listWidth / 2 - 1 + 'px'
					}
				}
			}else{
				if(Store.textFormList.length) {
					return {
						// forms: listWidth / 3 - 1 + 'px',
						images: listWidth / 2 - 1 + 'px',
						decorations: listWidth / 2 - 1 + 'px'
					}
				} else {
					return {
						images: listWidth / 2 - 1 + 'px',
						decorations: listWidth / 2 - 1 + 'px'
					}
				}
			}
		}
	},
	components: {
		'image-list': CompImageList,
		'option-list': CompOptions,
		'form-list': CompTextFormList
	},
	methods: {
		handleChangeTab: function(nTabNum) {
			var trackerName = null;
			switch(nTabNum) {
				case 0:
					this.privateStore.currentView = 'option-list';
					trackerName = 'ClickOptionTab';
					break;
				case 1:
					this.privateStore.currentView = 'image-list';
					trackerName = 'ClickImagesTab';
					break;
				case 2:
					this.privateStore.currentView = 'layout-list';
					trackerName = 'ClickLayoutTab';
				break;
				case 3:
					this.privateStore.currentView = 'decoration-list';
					trackerName = 'ClickDecorationTab';
					break;
				case 4:
					this.privateStore.currentView = 'form-list';
					trackerName = 'ClickFormTab';
					break;
			};
			require('trackerService')({ev: require('trackerConfig')[trackerName]});
		},

		blurFocus: function() {
			this.$dispatch('dispatchClearScreen');
			// this.sharedStore.isLostFocus = true;
		},
	},

	events: {
		notifyChangeTab: function(tabName) {
			this.privateStore.currentView = tabName;
		}
	},

	ready: function() {
		var _this = this;

		// 用户界面下，有tag文本默认显示textForm
		// _this.$watch('sharedStore.watches.isProjectLoaded', function() {
		// 	var hasTextForm = Store.textFormList.length !== 0;

		// 	if(hasTextForm && !Store.isPortal) {
		// 		_this.privateStore.currentView = 'form-list';
		// 	}
				// });

		 _this.$watch('sharedStore.selectedPageIdx', function() {
			var isNoTextForm = Store.textFormList.length === 0;
			var isInFormView = _this.privateStore.currentView === 'form-list';

			if(isNoTextForm && isInFormView && !Store.isPortal) {
				_this.privateStore.currentView = 'image-list';
			}
		});

		_this.$watch('sharedStore.isBlankCard', function() {
			if(Store.isBlankCard) {
				_this.privateStore.currentView = 'option-list';
			}
		});
	}
};
