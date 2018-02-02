var Vue = require('vuejs');

var CompActionPanel = Vue.extend(require('../components/CompActionPanel.js'));

var UtilWindow = require('UtilWindow');
// Vue.component('action-panel', CompActionPanel);

var CompActionPanelBottom = Vue.extend(require('../components/CompActionPanelBottom.js'));
// Vue.component('action-panel-bottom', CompActionPanelBottom);

var CompContainer = Vue.extend(require('../components/CompContainer.js'));

var CompTmpl = Vue.extend(require('../components/CompTmpl.js'));

// Vue.component('operation-area', CompContainer);

// module -- dashboard
module.exports = {
  template:
            '<div v-on:click="blurFocus($event)" class="dashboard" v-bind:style="usedStyle" >' +
              '<!-- action panel component -->' +
              '<action-panel v-if="!sharedStore.isPreview"></action-panel>' +
              '<!-- operation area -->' +
              '<operation-area></operation-area>' +
              '<div class="bed-actionpanel-bottom">' +
                // '<div style="height: 80px;text-align: center;" v-if="!sharedStore.isPreview">' +
                '<div style="height: 80px;text-align: center;">' +
                  '<div class="action-item" v-show="shouldChangePageShow" v-bind:style="{ marginTop:marginTop }" style="background:#f6f6f6;border:1px solid #d6d6d6; width: 360px;height: 22px;line-height: 22px;border-radius: 4px;overflow:hidden;">' +

                    // '<div class="button" v-on:click="broadcastChangePage()" style="width: 80px;float: left;border-top-left-radius: 14px;border-bottom-left-radius: 14px; font-size: 12px; font-weight: 500;"><i class="fa fa-caret-left" style="font-size: 12px;"></i>&nbsp&nbspFront</div>' +
                    // '<div class="button" v-on:click="broadcastChangePage(1)" style="width: 80px;float: left;border-top-right-radius: 14px;border-bottom-right-radius: 14px; font-size: 12px; font-weight: 500;">Back&nbsp&nbsp<i class="fa fa-caret-right" style="font-size: 12px;"></i></div>' +

                    '<div style="width:20px;margin-left:10px;margin-top:6px;float:left;font-size: 0px;">'+
                        '<img v-show="sharedStore.selectedPageIdx" v-on:click="broadcastChangePage(0)" src="./assets/img/icon/1-normal.svg" height="10"  onmouseover="this.src = \'./assets/img/icon/1-hover.svg\'" onmouseout="this.src = \'./assets/img/icon/1-normal.svg\'" alt="Front Cover" title="Front Cover" style="cursor: pointer;" />' +
                        '<img v-show="!sharedStore.selectedPageIdx" src="./assets/img/icon/1-disable.svg" height="10" />' +
                    '</div>' +
                    '<div style="width:20px;margin-left:30px;margin-top:6px;float: left;font-size: 0px;">'+
                        '<img v-show="sharedStore.selectedPageIdx" v-on:click="broadcastChangePage(\'forward\')" src="./assets/img/icon/2-normal.svg" height="10"  onmouseover="this.src = \'./assets/img/icon/2-hover.svg\'" onmouseout="this.src = \'./assets/img/icon/2-normal.svg\'" alt="Previous Page" title="Previous Page" style="cursor: pointer;" />' +
                        '<img v-show="!sharedStore.selectedPageIdx" src="./assets/img/icon/2-disable.svg" height="10" />' +
                    '</div>' +
                    '<span class="font-book" style="font-size:12px;color:#7b7b7b;">{{ currentPage }}</span>'+
                    '<div style="width:20px;margin-right:10px;margin-top:6px;float: right;font-size: 0;">'+
                        '<img v-show="nextPageActive" v-on:click="broadcastChangePage(1)" src="./assets/img/icon/4-normal.svg" height="10"  onmouseover="this.src = \'./assets/img/icon/4-hover.svg\'" onmouseout="this.src = \'./assets/img/icon/4-normal.svg\'" alt="Back Cover" title="Back Cover" style="cursor: pointer;" />' +
                        '<img v-show="!nextPageActive" src="./assets/img/icon/4-disable.svg" height="10" />' +
                    '</div>' +
                    '<div style="width:20px;margin-right:30px;margin-top:6px;float: right;font-size: 0;">'+
                        '<img v-show="nextPageActive" v-on:click="broadcastChangePage(\'back\')" src="./assets/img/icon/3-normal.svg" height="10"  onmouseover="this.src = \'./assets/img/icon/3-hover.svg\'" onmouseout="this.src = \'./assets/img/icon/3-normal.svg\'" alt="Next Page" title="Next Page" style="cursor: pointer;" />' +
                        '<img v-show="!nextPageActive" src="./assets/img/icon/3-disable.svg" height="10" />' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<layout-list v-if="sharedStore.projectSettings[this.sharedStore.selectedIdx].product === \'FD\' ||  sharedStore.isPortal"></layout-list>' +
              // '<tmpl-element v-if="!sharedStore.isPreview"></tmpl-element>' +
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
            float: 'left',
            marginLeft: '280px',
            position: 'relative',
            zIndex: '0',
            marginTop: '38px',
            height: 'calc(100vh - 76px)',
            width: 'calc(100vw - 280px)'
            // backgroundColor: '#f1f1f1'
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
      },
      marginTop: function() {
        return this.sharedStore.isPreview?'0':'20px';
      },

      nextPageActive: function() {
        if(this.sharedStore.selectedPageIdx == 1){
          return false;
        }else{
          return true;
        }
      },
      currentPage: function() {
        switch(this.sharedStore.selectedPageIdx){
          case 0:
            return 'Front Cover';
          break;
          case 2:
            return 'Inside Page';
          break;
          case 1:
            return 'Back Cover';
          break;
        }
      }
  },
  components: {
		'action-panel': CompActionPanel,
		'action-panel-bottom': CompActionPanelBottom,
		'operation-area': CompContainer,
    'tmpl-element' : CompTmpl
	},
  methods: {
    handleAddText: function() {
      require('trackerService')({ev: require('trackerConfig').AddText});
      this.$dispatch("dispatchShowAddText");
    },

    blurFocus: function(event) {
      this.$dispatch('dispatchClearScreen');
      // this.sharedStore.isLostFocus = true;
      this.sharedStore.isShowHandlePoint = false;
      this.sharedStore.isTotalPriceShow = false;
    },

    // broadcast change page
    broadcastChangePage: function(action) {
      var nPageNum = null;
      var trackerName = null;
      switch(action){
        case 0:
          trackerName = 'ClickFrontCover';
          nPageNum = 0;
        break;
        case 'forward':
          trackerName = 'ClickPreviousPage';
          switch(this.sharedStore.selectedPageIdx){
            case 0:
              nPageNum = 0;
            break;
            case 1:
              nPageNum = this.sharedStore.pages.length == 2? 0 : 2;
            break;
            case 2:
              nPageNum = 0;
            break;
          }
        break;
        case 'back':
          trackerName = 'ClickNextPage';
          switch(this.sharedStore.selectedPageIdx){
            case 0:
              nPageNum = this.sharedStore.pages.length - 1;
            break;
            case 1:
              nPageNum = 1;
            break;
            case 2:
              nPageNum = 1;
            break;
          }
        break;
        case 1:
          trackerName = 'ClickBackCover';
          nPageNum = 1;
        break;
      }
      require('trackerService')({ev: require('trackerConfig')[trackerName]});
      Store.vm.$broadcast('notifyChangePage', nPageNum);
      Store.vm.$broadcast('notifyRefreshTextFormList');
    },
    handleMoveElement: function(keyCode){
      if(keyCode < 37 || keyCode > 40)return;
      var moveX = moveY = 0;
      switch(keyCode){
        case 37:
        moveX = -1;
        break;
        case 38:
        moveY = -1;
        break;
        case 39:
        moveX = 1;
        break;
        case 40:
        moveY = 1;
        break;
      }
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
      currentElement = currentCanvas.params[currentCanvas.selectedIdx]
      currentElement.x+=moveX/currentCanvas.ratio;
      currentElement.y+=moveY/currentCanvas.ratio;
      Store.isLostFocus = true;
      Store.vm.$broadcast("notifyRefreshScreenshot");
    }
  },
  ready: function(){
    var that = this;
    $(document).keydown(function (event) {
      if(Store.isPortal && event.keyCode === 40){
        event.preventDefault();
      }
    });
    document.addEventListener('keydown',function(event){
      if(Store.isPortal){
        that.handleMoveElement(event.keyCode);
      }
    });
  }
};
