var CanvasController = require('CanvasController');
//controller --- decoration
module.exports = {
	createDecoration: function(oData) {
		if(oData) {
			this.addDecorationInParams(oData);
		};
	},

	editDecoration: function(oData, idx) {
		if(oData && idx != undefined && idx != null) {
      this.changeDecorationInParams(oData, idx);
		};

	},

	deleteDecoration: function(idx,removeDecorationOnly) {
		if(idx != undefined && idx != null) {
			this.removeDecorationFromParams(idx,removeDecorationOnly);
			Store.vm.$broadcast('notifyRefreshScreenshot');
		};
	},

	// update params
	addDecorationInParams: function(oData) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		var element_index = currentCanvas.params.length;

		currentCanvas.params.push(oData);

		this.createDecorationElement(element_index);
	},

	changeDecorationInParams: function(oData, idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		currentCanvas.params.splice(idx, 1, oData);

		this.editDecorationElement(idx);
	},

	removeDecorationFromParams: function(idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		// fresh depth
		CanvasController.freshDepth(idx);

		var elementId = currentCanvas.params[idx].id;
			currentCanvas.params.splice(idx, 1);
			this.deleteDecorationElement(idx, elementId);

	},

	// create image element in canvas
	createDecorationElement: function(idx) {
		CanvasController.createElement(idx);
    	CanvasController.spineLinesToTop();
	},

	editDecorationElement: function(idx) {
		CanvasController.editElement(idx);
   		// CanvasController.spineLinesToTop();
	},

	deleteDecorationElement: function(idx) {
		CanvasController.deleteElement(idx);
    	CanvasController.spineLinesToTop();
	}
}
