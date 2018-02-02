
var CanvasController = require('CanvasController');
// controller -- image
module.exports = {

	createImage: function(oData) {
		if(oData) {
			this.addImageInParams(oData);
		};
	},

	editImage: function(oData, idx) {
		if(oData && idx != undefined && idx != null) {
      this.changeImageInParams(oData, idx);
		};

	},

	deleteImage: function(idx) {
		if(idx != undefined && idx != null) {
			this.removeImageFromParams(idx);
			Store.vm.$broadcast('notifyRefreshScreenshot');
		};
	},

	// update params
	addImageInParams: function(oData) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		var element_index = currentCanvas.params.length;

		currentCanvas.params.push(oData);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;
		// 	var element_index = currentCanvas.params.length;

		// 	currentCanvas.params.push(oData);
		// };

		// NOTE: for item which last added, its' index is the same with depth
		this.createImageElement(element_index);
	},

	changeImageInParams: function(oData, idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		currentCanvas.params.splice(idx, 1, oData);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

		// 	currentCanvas.params.splice(idx, 1, oData);
		// };

		// NOTE: for item which last added, its' index is the same with depth
		this.editImageElement(idx);
	},

	removeImageFromParams: function(idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		// fresh depth
		CanvasController.freshDepth(idx);

		currentCanvas.params.splice(idx, 1);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

		// 	currentCanvas.params.splice(idx, 1);
		// };

		this.deleteImageElement(idx);
	},

	// create image element in canvas
	createImageElement: function(idx) {
		CanvasController.createElement(idx);
    CanvasController.spineLinesToTop();
	},

	editImageElement: function(idx) {
		CanvasController.editElement(idx);
    CanvasController.spineLinesToTop();
	},

	deleteImageElement: function(idx) {
		CanvasController.deleteElement(idx);
    CanvasController.spineLinesToTop();
	}
};
