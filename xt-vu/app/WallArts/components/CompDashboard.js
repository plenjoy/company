var Vue = require('vuejs');

var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));
// Vue.component('action-panel', CompActionPanel);

var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

var CompContainer = Vue.extend(require('../components/CompContainer.js'));
// Vue.component('operation-area', CompContainer);

// module -- dashboard
module.exports = {
  template: '<div v-on:click="blurFocus()" v-bind:style="usedStyle">' +
              '<!-- action panel component -->' +
              '<action-panel v-if="!sharedStore.isPreview"></action-panel>' +
              '<!-- operation area -->' +
              '<operation-area></operation-area>' +
              '<action-panel-bottom v-if="!sharedStore.isPreview"></action-panel-bottom>' +
              // '<div class="bed-actionpanel-bottom" v-if="!isCanvas && !sharedStore.isPreview">' +
              //   '<div style="height: 80px;text-align: center;">' +
              //     '<div class="action-item" v-show="shouldChangePageShow" style="margin-top: 20px; width: 160px;height: 28px;line-height: 28px;border-radius: 14px;">' +
              //       '<div class="button" v-on:click="broadcastChangePage()" style="width: 80px;float: left;border-top-left-radius: 14px;border-bottom-left-radius: 14px; font-size: 12px; font-weight: 500;"><i class="fa fa-caret-left" style="font-size: 12px;"></i>&nbsp&nbspFront</div>' +
              //       '<div class="button" v-on:click="broadcastChangePage(1)" style="width: 80px;float: left;border-top-right-radius: 14px;border-bottom-right-radius: 14px; font-size: 12px; font-weight: 500;">Back&nbsp&nbsp<i class="fa fa-caret-right" style="font-size: 12px;"></i></div>' +
              //     '</div>' +
              //   '</div>' +
              // '</div>' +
            '</div>',
  data: function() {
    return {
      privateStore: {

      },
      sharedStore : Store
    };
  },
  computed: {
    usedStyle: function() {
      if(this.sharedStore.isPreview) {
        return {};
      }
      else {
        return {
          /*float: 'right',*/
          overflow : 'hidden'
          /*backgroundColor: '#f1f1f1',
          boxShadow: '1px 1px 10px #d1d1d1 inset'*/
        };
      };
    },

    // to determine if change page action items should be shown
    shouldChangePageShow: function() {
        if (this.sharedStore.isChangePageShow) {
            return true;
        } else {
            return false;
        };
    }
  },
  components: {
		'action-panel': CompActionPanel,
    'action-panel-bottom': CompActionPanelBottom,
		'operation-area': CompContainer
	},
  methods: {
    blurFocus: function() {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
    },

    // broadcast change page
    broadcastChangePage: function(nPageNum) {
        Store.vm.$broadcast('notifyChangePage', nPageNum);
    }
  }
};
