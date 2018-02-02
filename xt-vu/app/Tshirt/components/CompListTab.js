
var Vue = require('vuejs');

var CompImageList = Vue.extend(require('../components/CompImageList.js'));
// Vue.component('image-list', CompImageList);

var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
// Vue.component('project-item-list', CompProjectItemList);
// component -- list tab
module.exports = {
	template: '<div class="bed-list-tab" v-on:click="blurFocus" style="float: left;border-right: 1px solid rgba(232, 232, 232, 1);">' +
							'<div style="height: 60px;">' +
								'<div class="t-center" v-bind:class="list0Class" v-on:click="handleChangeTab(0)" style="width: 169px;border-right:1px solid rgba(232, 232, 232, 1);">Your Items</div>' +
								'<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(1)" style="width: 169px;">Images</div>' +
							'</div>' +
							'<div style="width:16px;height:16px;position: absolute;top: 60px;left: 135px;">'+
        							'<span style="padding-top: 2px;font-size: 12px;line-height: 12px;display:block;color:#e13724;text-align:center;">{{sharedStore.itemListNum}}</span>'+
    						'</div>'+
							'<image-list v-show="privateStore.currentView === \'image-list\'"></image-list>' +
							'<project-item-list v-show="privateStore.currentView === \'project-item-list\'"></project-item-list>' +
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
			if(this.privateStore.currentView === 'project-item-list') {
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
		}
	},
	components: {
		'image-list': CompImageList,
		'project-item-list': CompProjectItemList
	},
	methods: {
		handleChangeTab: function(nTabNum) {
			switch(nTabNum) {
				case 0:
					// Your items tab
					this.privateStore.currentView = 'project-item-list';
					break;
				case 1:
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
