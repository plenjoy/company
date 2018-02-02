
// component -- action panel
module.exports = {
	template: '<div class="footer-actionpanel-top" v-show="sharedStore.isCanvas">' +
							'<div style="height: 80px;text-align: center;">' +
								'<div class="button action-item" style="margin: 30px 40px 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;visibility:hidden;">&nbsp;</div>' +
								'<div class="button action-item" style="margin: 30px 40px 20px 0; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;visibility:hidden;">&nbsp;</div>' +
								'<div class="button action-item" style="margin-top: 30px; margin-bottom: 20px; width: 120px;height: 28px;line-height: 28px;border-radius: 14px;text-align: center;font-size: 12px; font-weight: 500;" v-on:click="handleEditBorder()">Edit Border</div>' +
							'</div>' +
						'</div>',
	data: function() {
		return {
			privateStore: {},
			sharedStore: Store
		};
	},
  methods: {
	handleEditBorder: function() {
		this.$dispatch("dispatchShowEditBorder");
	}
  }
};
