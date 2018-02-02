//components --- remind msg
module.exports = {

	template: '<div class="bed-remind-msg font-medium" v-bind:style="cursorStyle"  v-on:click="handleRemindMsg()" v-show="sharedStore.isRemindMsgShow" >{{ privateStore.msg }}</div>',
	// template: '<div class="bed-remind-msg font-book" v-bind:style="cursorStyle"  v-on:click="handleRemindMsg()" v-show="sharedStore.isRemindMsgShow" style="z-index:9999;width:400px;left:50%;margin-left:-200px;text-align:center;" >{{ privateStore.msg }}</div>',
	data: function() {
		return {
			privateStore: {
				timer: '',
				msg: '',
				msgType: '',
			},
			sharedStore: Store,
			cursorStyle:'',
			// allSize : []
		};
	},
	computed: {
		// cursorStyle: function() {
		// 	if (this.privateStore.msgType) {
		// 		// return 'pointer';
		// 		if(document.body.scrollTop>50||document.documentElement.scrollTop>50){
		// 			return{
		// 				top:'10px',
		// 				position:'fixed',
		// 				cursor:'pointer'
		// 			}
		// 		}else{
		// 			return{
		// 				top:'60px',
		// 				position:'absolute',
		// 				cursor:'pointer'
		// 			}
		// 		}
		// 	} else {
		// 		if(document.body.scrollTop>50||document.documentElement.scrollTop>50){
		// 			return{
		// 				top:'10px',
		// 				position:'fixed',
		// 				cursor:'default'
		// 			}
		// 		}else{
		// 			return{
		// 				top:'60px',
		// 				position:'absolute',
		// 				cursor:'default'
		// 			}
		// 		}
		// 	}
		// },

	},
	methods: {


		showRemindMsg: function() {
			//提示語是否顯示
			var _this = this;
			_this.sharedStore.isRemindMsgShow = true;
			_this.privateStore.timer && clearTimeout(_this.privateStore.timer);
			// Store.vm.$broadcast("dispatchDeletePhoto");
			_this.$dispatch("dispatchDeletePhoto");
			_this.privateStore.msgType = true;
			_this.setRemindMsg('You have removed 1 photo, click here to cancel.');
			_this.privateStore.timer = setTimeout(function() {
				_this.privateStore.msg = '';
				_this.sharedStore.tempId = "";
				_this.sharedStore.tempParams = "";
			}, 5000);
		},

		handleRemindMsg: function() {
			if (!this.privateStore.msgType) {
				return;
			}
			var _this = this;
			clearTimeout(_this.privateStore.timer);
			_this.$dispatch("dispatchRecoverDeletedPhoto");
			_this.privateStore.msgType = false;
			_this.setRemindMsg('Cancel successfully');
			_this.privateStore.timer = setTimeout(function() {
				_this.privateStore.msg = '';
				_this.sharedStore.tempId = "";
				_this.sharedStore.tempParams = "";
			}, 2000);
		},
		setRemindMsg: function(msg) {
			this.privateStore.msg = msg;
		},
		freshPageIndexes: function() {
			for (var i = 0; i < this.sharedStore.pages.length; i++) {
				this.sharedStore.pages[i].idx = i;
			}
		},

	},
	events: {
		notifyShowRemindMsg: function() {
			this.showRemindMsg();
		}

	},
	created: function() {

	},
	ready: function() {
		var _this = this;
		_this.$watch('sharedStore.watches.isRemindMsg', function() {
			if (_this.sharedStore.watches.isRemindMsg) {

				_this.sharedStore.watches.isRemindMsg = false;
				_this.showRemindMsg();

			}
		});
		_this.$watch('sharedStore.projectSettings.length',function(){
			if(_this.sharedStore.projectSettings.length){
				if(document.body.scrollTop>50||document.documentElement.scrollTop>50){
					_this.cursorStyle = {top:'5px',cursor:'pointer',position:'fixed',left:'50%',width:'400px',lineHeight:'30px',marginLeft:'-200px',textAlign:'center',zIndex:'9999',background:'rgba(200,200,200,0.5)'}
				}else{
					_this.cursorStyle = {top:'55px',cursor:'pointer',position:'absolute',left:'50%',width:'400px',lineHeight:'30px',marginLeft:'-200px',textAlign:'center',zIndex:'9999',background:'rgba(200,200,200,0.5)'}
				}
			}
		})
	}
};
