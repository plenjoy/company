
// component -- action panel
module.exports = {
	template: '<div v-show="false" v-bind:style="topStyle" class="bed-actionpanel-bottom">' +
                '<div style="height: 34px;text-align: center;">' +
                  '<div class="action-item" v-on:click="changePage(currentPage !== \'Front\')" v-bind:style="{ marginTop:marginTop }" style="cursor: pointer;background:#f6f6f6;border:1px solid #d6d6d6; width: 140px;height: 22px;line-height: 22px;border-radius: 4px;overflow:hidden;">' +
                    '<span style="width:20px;margin-right: 6px;margin-top:6px;font-size: 0px;">'+
                        '<img src="./assets/img/icon/fresh.svg" height="10" alt="Change Page" title="Change Page" />' +
                    '</span>' +
                    '<span class="font-book" style="font-size:12px;color:#7b7b7b;">{{ currentPage }}</span>'+
                  '</div>' +
                '</div>' +
              '</div>',
	data: function() {
		return {
			privateStore: {},
			sharedStore: Store
		};
	},
	computed: {
      marginTop: function() {
        // return this.sharedStore.isPreview?'0':'10px';
        return 0;
      },
      currentPage: function() {
        if(this.sharedStore.isFrontPage){
        	return 'Front';
        }
        return 'Back';
      },
      topStyle: function() {
        if(this.sharedStore.isPreview){
            return{
                position: 'relative',
                top: '0px',
                zIndex: 99999
            }
        }else{
            return{
                top: '0'
            }
        }
      },
  },
  methods: {
		changePage: function(toFrontPage) {
			var isFrontPage = this.sharedStore.isFrontPage;
      var trackerKey = this.sharedStore.isPreview ? 'SwitchSideInPreview' : 'SwitchSide';
      if(isFrontPage && !toFrontPage){
				this.sharedStore.isFrontPage = false;
        require('trackerService')({ev: require('trackerConfig')[trackerKey],side: 'back', isFromFactory: this.sharedStore.isFromFactory});
			};
			if(!isFrontPage && toFrontPage){
				this.sharedStore.isFrontPage = true;
        require('trackerService')({ev: require('trackerConfig')[trackerKey],side: 'front', isFromFactory: this.sharedStore.isFromFactory});
			};
		}
  }
};
