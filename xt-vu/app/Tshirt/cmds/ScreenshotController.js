var DrawManage = require("DrawManage");
module.exports = {
	convertScreenshotToBase64 : function(){
		return DrawManage.resizeImage("screenshot",Store.screenshotSize.width,Store.screenshotSize.height);
	}
}