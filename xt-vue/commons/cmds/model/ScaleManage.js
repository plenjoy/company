module.exports = {
	getImageScale : function(idx){
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
			params = currentCanvas.params[idx],
			imageDetail = require("ImageListManage").getImageDetail(params.imageId),
			cropWidth = imageDetail.width * currentCanvas.params[idx].cropPW,
			cropHeight = imageDetail.height * currentCanvas.params[idx].cropPH,
			scaleW = params.width / cropWidth,
	    	scaleH = params.height / cropHeight,
	    	scale = Math.max(scaleW, scaleH);
	    return scale;
	}
}