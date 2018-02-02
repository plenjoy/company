module.exports = {
	template: '<div class="item-option" style="text-align: center;margin: 0 15px;">' +
					'<select name="" id="">Size</select>' + 
					'<select name="" id="">Finish</select><br>' + 
					'<input type="text" value="1">' +
					'<span>$0.09 each</span><br>' +
					'<a href="#">Edit</a>' +
					'<a href="#">Duplicate</a>' +
					'<a href="#">Delete</a>' +
			   '</div>',
	props : ['id'],
	data: function() {
		return {
			privateStore: {},
			sharedStore: Store,
		};
	},
	computed : {
		allSize : function(){
			// return require("SpecManage").getAllSize();
			return [];
		}
	},
  methods: {
    

	
  }
};
