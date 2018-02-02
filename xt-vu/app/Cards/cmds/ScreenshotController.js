var DrawManage = require("DrawManage");
module.exports = {
	convertScreenshotToBase64 : function(){
		return DrawManage.canvasToBase64("screenshot");
	}
}
