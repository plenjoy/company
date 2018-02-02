

var UtilMath = require('UtilMath');
var CanvasController = require('CanvasController');
// controller -- text
module.exports = {

	createText: function(oData) {
		var _this = this;

		if(oData) {
			// prepare text image width and height
			var fontViewSize = Math.round(UtilMath.getTextViewFontSize(oData.fontSize));
			if(fontViewSize > 0) {
			  // valid text size
			  var img = new Image();
			  if(oData.text === '') {
			    img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
			  }
			  else {
			    img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(oData.text)+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
			  };

			  if(img.complete) {
			    _this.addTextInParams(oData, img.width, img.height);
			    return;
			  }
			  img.onload = function () {
			    _this.addTextInParams(oData, img.width, img.height);
			  };
			}
			else {
			  // invalid text size
			  // NOTE: we create a very small size text image for text which cannot display on screen(to keep an element in canvas anyhow)
			  _this.addTextInParams(oData, 1, 1);
			};


		};
	},

	editText: function(oData, idx) {
		var _this = this;

		if(oData && idx != undefined && idx != null) {
			var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      var fontViewSize = Math.round(UtilMath.getTextViewFontSize(oData.fontSize));
      if(fontViewSize > 0) {
        // valid text size
        var img = new Image();
        if(oData.text === '') {
          img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent('Enter text here')+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
        }
        else {
          img.src = Store.domains.proxyFontBaseUrl+"/product/text/textImage?text="+encodeURIComponent(oData.text)+"&font="+encodeURIComponent(oData.fontFamily)+"&fontSize="+fontViewSize+"&color="+oData.fontColor+"&align=left";
        };

        if(img.complete) {
          _this.changeTextInParams(oData, img.width, img.height, idx);
          return;
        }
        img.onload = function () {
          _this.changeTextInParams(oData, img.width, img.height, idx);
        };
      }
      else {
        // invalid text size
        // NOTE: we create a very small size text image for text which cannot display on screen(to keep an element in canvas anyhow)
        _this.changeTextInParams(oData, 1, 1, idx);
      };
		};

	},

	deleteText: function(idx) {
		if(idx != undefined && idx != null) {
			this.removeTextFromParams(idx);
      Store.vm.$broadcast('notifyRefreshScreenshot');
		};
	},

	// update params
	addTextInParams: function(oData, nImageWidth, nImageHeight) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		var element_index = currentCanvas.params.length;

		oData.width = nImageWidth / currentCanvas.ratio;
		oData.height = nImageHeight  / currentCanvas.ratio;
		oData.dep = element_index;

		currentCanvas.params.push(oData);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

		// 	currentCanvas.params.push(oData);
		// };

		// NOTE: for item which last added, its' index is the same with depth
		this.createTextElement(element_index);
	},

	changeTextInParams: function(oData, nImageWidth, nImageHeight, idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		oData.width = nImageWidth  / currentCanvas.ratio;
		oData.height = nImageHeight  / currentCanvas.ratio;

		currentCanvas.params.splice(idx, 1, oData);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

		// 	currentCanvas.params.splice(idx, 1, oData);
		// };

		// NOTE: for item which last added, its' index is the same with depth
		this.editTextElement(idx);
	},

	removeTextFromParams: function(idx) {
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

		// fresh depth
		CanvasController.freshDepth(idx);

		currentCanvas.params.splice(idx, 1);

		// // NOTE: t-shirt special fitting
		// for(var i = 0; i < Store.projects.length; i++) {
		// 	var currentCanvas = Store.projects[i].pages[Store.selectedPageIdx].canvas;

		// 	currentCanvas.params.splice(idx, 1);
		// };

		this.deleteTextElement(idx);
	},

	// create text element in canvas
	createTextElement: function(idx) {
		var _this = this;
		CanvasController.createElement(idx, _this);
    CanvasController.spineLinesToTop();
	},

	editTextElement: function(idx) {
		var _this = this;
		CanvasController.editElement(idx, _this);
    CanvasController.spineLinesToTop();
	},

	deleteTextElement: function(idx) {
		var _this = this;
		CanvasController.deleteElement(idx, _this);
    CanvasController.spineLinesToTop();
	}
};
