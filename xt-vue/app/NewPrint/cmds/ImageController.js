
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

	deleteImage: function(idx,removeImageOnly) {
		if(idx != undefined && idx != null) {
			this.removeImageFromParams(idx,removeImageOnly);
			// Store.vm.$broadcast('notifyRefreshScreenshot');
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

	removeImageFromParams: function(idx,removeImageOnly) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		// fresh depth
		CanvasController.freshDepth(idx);

		var elementId = currentCanvas.params[idx].id;
		if(!removeImageOnly){
			currentCanvas.params.splice(idx, 1);

			// // NOTE: t-shirt special fitting
			// for(var i = 0; i < Store.projects.length; i++) {
			// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

			// 	currentCanvas.params.splice(idx, 1);
			// };

			this.deleteImageElement(idx, elementId);
		}else{
			currentCanvas.params[idx].imageId = '';
			currentCanvas.params[idx].url = '';
			currentCanvas.params[idx].sourceImageUrl = '';
			currentCanvas.params[idx].imageGuid= '';
			currentCanvas.params[idx].imageWidth= '';
			currentCanvas.params[idx].imageHeight= '';
			currentCanvas.params[idx].imageRotate= 0;
			currentCanvas.params[idx].cropPX= 0;
			currentCanvas.params[idx].cropPY= 0;
			currentCanvas.params[idx].cropPW= 1;
			currentCanvas.params[idx].cropPH= 1;
			currentCanvas.params[idx].isRefresh = true;
		}
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

	deleteImageElement: function(idx, elementId) {
		CanvasController.deleteElement(idx, elementId);
    CanvasController.spineLinesToTop();
	}
};
