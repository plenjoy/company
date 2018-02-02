var DrawManage = require("DrawManage");
var Scale = require("Scale");
module.exports = {
	convertScreenshotToBase64 : function(){
		
		var screenshot = document.getElementById("real-screenshot");
		if(screenshot.width/Store.screenshotSize.width <=1 || screenshot.height/Store.screenshotSize.height <=1){
			return DrawManage.resizeImage("real-screenshot",Store.screenshotSize.width,Store.screenshotSize.height);
		}else{
			return Scale.scale({width:Store.screenshotSize.width,height:Store.screenshotSize.height},screenshot,'jpeg-src');
		}
		// return DrawManage.canvasToBase64("real-screenshot");
	}
}