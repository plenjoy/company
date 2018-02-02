
var Vue = require('vuejs');

var CompImageList = Vue.extend(require('../components/CompImageList.js'));
var CompOption = Vue.extend(require('../components/CompOption.js'));
// Vue.component('image-list', CompImageList);

// var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
// Vue.component('project-item-list', CompProjectItemList);
// component -- list tab
module.exports = {
	template: '<div class="bed-list-tab" v-on:click="blurFocus" style="border: 1px solid #e8e8e8;">' +
							'<div style="height: 34px;">' +
								'<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(0)" style="width:50%;box-sizing: border-box;border-right:1px solid rgba(232, 232, 232, 1);">Options</div>' +
								'<div class="t-center" v-bind:class="list0Class" v-on:click="handleChangeTab(1)" style="width:50%;box-sizing: border-box;">Images</div>' +
								'<div class="t-center" v-bind:class="list2Class" v-on:click="handleChangeTab(2)" style="width:124.666px;display: none;">Layouts</div>' +
							'</div>' +
							// '<div style="width:16px;height:16px;position: relative;bottom: 59px;left: 135px;">'+
        			// 	'<span style="padding-top: 2px;font-size: 12px;line-height: 12px;display:block;color:#e13724;text-align:center;">{{sharedStore.itemListNum}}</span>'+
    					// '</div>'+
							'<image-list v-show="privateStore.currentView === \'image-list\'"></image-list>' +
							'<option-list v-show="privateStore.currentView === \'option-list\'"></option-list>' +
							// '<project-item-list v-show="privateStore.currentView === \'project-item-list\'"></project-item-list>' +
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
			if(this.privateStore.currentView === 'image-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},

		list1Class: function() {
			if(this.privateStore.currentView === 'option-list') {
				return 'list-tab-selected';
			}
			else {
				return 'list-tab';
			};
		},
		list2Class: function() {
			// if(this.privateStore.currentView === 'option-list') {
			// 	return 'list-tab-selected';
			// }
			// else {
				return 'list-tab';
			// };
		}
	},
	components: {
		'image-list': CompImageList,
		'option-list' : CompOption
		// 'project-item-list': CompProjectItemList
	},
	methods: {
		handleChangeTab: function(nTabNum) {
			switch(nTabNum) {
				case 0:
					this.privateStore.currentView = 'option-list';
					break;
				case 1:
					// Images tab
					this.privateStore.currentView = 'image-list';
					break;
			};
		},

		blurFocus: function() {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
    },
	}
};
