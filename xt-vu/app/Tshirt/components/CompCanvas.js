
// component -- canvas
module.exports = {
	methods: {
		// changeClickDepth: function(oParams) {
		// 	if(oParams && oParams.idx != undefined) {
		// 		var _this = this,
		// 				store = _this.sharedStore,
		// 				currentCanvas = store.pages[store.selectedPageIdx].canvas;

		// 		// save the selected image index into store
	 //    	currentCanvas.selectedIdx = oParams.idx;
	 //    	currentCanvas.elements[oParams.idx].toFront();

	 //    	_this.highlightSelection();
	 //    	console.log('click ON - set element ' + oParams.idx + ' to front');

		//   	// change the dep value after toFront
		//   	for(var j = 0;j < currentCanvas.elements.length; j++) {
		//   		if(currentCanvas.elements[j].dep > currentCanvas.elements[oParams.idx].dep ) {
		//   			currentCanvas.elements[j].dep--;
		//   			console.log('element ' + j + ' dep -1 = ' + currentCanvas.elements[j].dep);
		//   		};
		// 		};
		// 		currentCanvas.elements[oParams.idx].dep = currentCanvas.elements.length - 1;
		// 		console.log('set element ' + oParams.idx + ' dep into ' + currentCanvas.elements[oParams.idx].dep);
	 //      _this.spineLinesToTop();

		//   	// apply the change
		//   	currentCanvas.trans[oParams.idx].apply();
		// 	};
		// },

		

		// make spine lines always top
		// spineLinesToTop: function() {
		// 	var _this = this,
		// 			store = _this.sharedStore,
		// 			currentCanvas = store.pages[store.selectedPageIdx].canvas;

		// 	if(currentCanvas.innerLine !== '') {
		// 		currentCanvas.innerLine.toFront();
		// 	};
		// 	if(currentCanvas.spineLeft !== '') {
		// 		currentCanvas.spineLeft.toFront();
		// 	};
		// 	if(currentCanvas.spineRight !== '') {
		// 		currentCanvas.spineRight.toFront();
		// 	};
		// },

		// // highlight selection
		// highlightSelection: function(idx) {
		// 	var _this = this,
		// 			store = _this.sharedStore,
		// 			currentCanvas = store.pages[store.selectedPageIdx].canvas;

		// 	idx ? idx : idx = currentCanvas.selectedIdx;

		// 	for(var i = 0; i < currentCanvas.elements.length; i++) {
		// 		currentCanvas.elements[i].attr({ stoke: 'rgba(255, 0, 0, 0)' });
		// 	};

		// 	currentCanvas.elements[idx].attr({ stoke: 'rgba(255, 0, 0, .8)' });

		// },
	}
};