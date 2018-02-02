

module.exports = {
	// get image detail
	getImageDetail: function(sImageId) {
		if(sImageId) {
			for(var i = 0; i < Store.imageList.length; i++) {
				if(Store.imageList[i].id === sImageId) {
					return Store.imageList[i];
				};
			};
		}
		else {
			return '';
		};
	},

	// fresh image used count
	freshImageUsedCount: function() {
		// var _this = this,
		// 		store = _this.sharedStore;

		// count image used
		var usedIdAry = [],				// [ 'id1', 'id2', ... ]
				usedCountAry = [];		// [ 1, 2, ... ]
		for(var i = 0; i < Store.pages.length; i++) {
			var currentCanvas = Store.pages[i].canvas;

			for(var j = 0; j < currentCanvas.params.length; j++) {
				if(currentCanvas.elements[j] && currentCanvas.elements[j].imageId != undefined && currentCanvas.elements[j].imageId !== '') {
					// inited, fetch data based on elements
					var el = currentCanvas.elements[j];
				}
				else {
					// not inited, fetch data based on params
					var el = currentCanvas.params[j];
				};

				// used image !
				if(el.imageId && el.imageId !== '') {
					if($.inArray(el.imageId, usedIdAry) === -1) {
						// new image id
						usedIdAry.push(el.imageId);
						usedCountAry.push(1);
					}
					else {
						// image id used already, count ++
						var idx = $.inArray(el.imageId, usedIdAry);

						usedCountAry[idx]++;
					};
				};
			};
		};

		// init image list
		for(i = 0; i < Store.imageList.length; i++) {
			Store.imageList[i].usedCount = 0;

			// check if used
			for(j = 0; j < usedIdAry.length; j++) {
				if(usedIdAry[j] === Store.imageList[i].id) {
					Store.imageList[i].usedCount = usedCountAry[j];
					break;
				};
			};
		};

	},
};
