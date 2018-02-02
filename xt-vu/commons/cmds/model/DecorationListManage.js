module.exports = {
	getDecorationDetail: function(sImageId){
		if(sImageId){
			for(var i = 0; i < Store.allDecorationList.length; i++){
				if(Store.allDecorationList[i].id === sImageId){
					return Store.allDecorationList[i];
				}
			}
		}else{
			return '';
		}
	},
	freshDecorationUsedCount: function() {
		// var _this = this,
		// 		store = _this.sharedStore;

		// count image used
		var usedIdAry = [],				// [ 'id1', 'id2', ... ]
				usedCountAry = [];		// [ 1, 2, ... ]
		for(var i = 0; i < Store.pages.length; i++) {
			var currentCanvas = Store.pages[i].canvas;

			for(var j = 0; j < currentCanvas.params.length; j++) {
				if(currentCanvas.elements[j] && currentCanvas.elements[j].decorationid != undefined && currentCanvas.elements[j].decorationid !== '') {
					// inited, fetch data based on elements
					var el = currentCanvas.elements[j];
				}
				else {
					// not inited, fetch data based on params
					var el = currentCanvas.params[j];
				};

				// used image !
				if(el.decorationid && el.decorationid !== '') {
					if($.inArray(el.decorationid, usedIdAry) === -1) {
						// new image id
						usedIdAry.push(el.decorationid);
						usedCountAry.push(1);
					}
					else {
						// image id used already, count ++
						var idx = $.inArray(el.decorationid, usedIdAry);

						usedCountAry[idx]++;
					};
				};
			};
		};
	
		for(i = 0; i < Store.allDecorationList.length; i++) {
			Store.allDecorationList[i].count = 0;

			// check if used
			for(j = 0; j < usedIdAry.length; j++) {
				if(usedIdAry[j] === Store.allDecorationList[i].guid) {
					Store.allDecorationList[i].count = usedCountAry[j];
					
					break;
				};
			};
		};


		
	},
}