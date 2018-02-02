
var Vue = require('vuejs');

var CompImageList = Vue.extend(require('../components/CompImageList.js'));
// Vue.component('image-list', CompImageList);

// var CompProjectItemList = Vue.extend(require('../components/CompProjectItemList.js'));
// Vue.component('project-item-list', CompProjectItemList);
// component -- list tab
module.exports = {
	template:   '<div class="bed-list-tab" v-show="!sharedStore.isPreview" v-on:click="blurFocus" style="border-right: 1px solid rgba(232, 232, 232, 1);border-top: 1px solid rgba(232, 232, 232, 1);">' +
					'<div style="height: 34px;">' +
						// '<div class="t-center" v-bind:class="list0Class" v-on:click="handleChangeTab(0)" style="width: 189px;border-right:1px solid rgba(232, 232, 232, 1);">Options</div>' +
						// '<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(1)" style="width: 189px;">Images</div>' +
						// '<div class="t-center" v-bind:class="list2Class" v-on:click="handleChangeTab(2)" style="width: 126px;">Layouts</div>' +
						'<div class="t-center" v-bind:class="list1Class" v-on:click="handleChangeTab(1)" style="width: 140px; border-right: 1px solid rgba(232, 232, 232, 1);">Photos</div>' +
						'<div class="t-center" v-bind:class="list2Class" style="width: 139px;cursor: default;"></div>' +
					'</div>' +
					// '<option-list v-show="privateStore.currentView === \'option-list\'"></option-list>' +
					'<image-list v-show="privateStore.currentView === \'image-list\'"></image-list>' +
					'<layout-list v-show="privateStore.currentView === \'layout-list\'"></layout-list>' +
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
		}
	},
	components: {
		'image-list': CompImageList,
		// 'project-item-list': CompProjectItemList
	},
	methods: {
		handleChangeTab: function(nTabNum) {
			switch(nTabNum) {
				case 0:
					this.privateStore.currentView = 'option-list';
					break;
				case 1:
					this.privateStore.currentView = 'image-list';
					break;
				case 2:
					this.privateStore.currentView = 'layout-list';
					break;
			};
		},

		blurFocus: function() {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
    },
	}
};
