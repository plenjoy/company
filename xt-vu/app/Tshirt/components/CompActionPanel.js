
// component -- action panel
module.exports = {
	template: '<div class="bed-actionpanel-top">' +
							'<div style="height: 80px;text-align: center;">' +
								'<div class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleAddText()">Add Text</div>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {},
			sharedStore: Store
		};
	},
  methods: {
    handleAddText: function() {
      this.$dispatch("dispatchShowAddText");
      require('trackerService')({ev: require('trackerConfig').AddText});
    }
  }
};
