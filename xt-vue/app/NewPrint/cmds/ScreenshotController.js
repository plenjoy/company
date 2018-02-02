var DrawManage = require("DrawManage");
var Scale = require("Scale");
module.exports = {
	convertScreenshotToBase64 : function(){

		var screenshot = document.getElementById("screenshot");

		var activePageCount = Store.pages.reduce(function(count, page) {
			return !page.isDeleted ? count + 1 : count;
		}, 0);

		if(activePageCount > 1) {
			return this.getMultipleScreenshotImage();
		}

    // if(Store.isRoundBorder){
    //   var currentCanvas = Store.pages[0].canvas;
    //   var borderRadiuSize = currentCanvas.cornerRadius * currentCanvas.ratio;
    //   return DrawManage.resizeImageWithShadow("screenshot",Store.screenshotSize.width,Store.screenshotSize.height,borderRadiuSize);
		// } else {
		// 	var activePageCount = Store.pages.reduce(function(count, page) {
		// 		return !page.isDeleted ? count + 1 : count;
		// 	}, 0);

		// 	if(activePageCount > 1) {
		// 		return this.getMultipleScreenshotImage();
		// 	}
		// }
		if(screenshot.width/Store.screenshotSize.width <=1 || screenshot.height/Store.screenshotSize.height <=1){
			 return DrawManage.resizeImage("screenshot",Store.screenshotSize.width,Store.screenshotSize.height);
		}else{
			return Scale.scale({width:Store.screenshotSize.width,height:Store.screenshotSize.height},screenshot,'jpeg-src');
		}
	},


	getMultipleScreenshotImage: function() {
		// 获取第一个未删除的pageIdx
		var firstEnablePageIdx = null;

		for(var i = 0; i < Store.pages.length; i++) {
			if(!Store.pages[i].isDeleted) {
				firstEnablePageIdx = i;
				break;
			}
		}

		// 绘制多project重叠切图
		if(firstEnablePageIdx !== null){
			return this.resizeImageWithMultipleProjectBg("screenshot", firstEnablePageIdx);
		}
	},

	resizeImageWithMultipleProjectBg: function(canvasId,pageIdx) {
		var canvas = document.getElementById(canvasId),
				ctx = canvas.getContext("2d"),
				tmpCanvas = document.createElement("canvas"),
				tctx = tmpCanvas.getContext("2d"),
				currentCanvas = Store.pages[0].canvas;

		var activePageCount = Store.pages.reduce(function(count, page) {
			return !page.isDeleted ? count + 1 : count;
		}, 0);

		// 复制背景参数
		var maxDuplicateCount = 2,	// 最大复制背景层数
				duplicateBgOffset = { deg: 10 },	// 复制旋转背景偏移角度
				duplicateBgCount = activePageCount - 1 > maxDuplicateCount ? maxDuplicateCount : activePageCount - 1,
				extend = { width: 100, height: 100 }; // 截图扩展像素
		
		// 设置最终截图大小
		var tmpCanvasWidth = canvas.width + extend.width;
		var tmpCanvasHeight = canvas.height + extend.height;
		tmpCanvas.width = tmpCanvasWidth;
		tmpCanvas.height = tmpCanvasHeight;

		var radiu = currentCanvas.cornerRadius * currentCanvas.ratio;

		// 设置最终截图背景色
		tctx.fillStyle = '#f0f0f0';
		tctx.fillRect(0, 0, tmpCanvasWidth, tmpCanvasHeight);

		// 计算canvas中心旋转参数
		var centerX = tmpCanvasWidth / 2;
		var centerY = tmpCanvasHeight / 2;
		var x = centerX - canvas.width / 2;
		var y = centerY - canvas.height / 2;

		// 绘制中心旋转背景层
		for(var i = duplicateBgCount; i > 0; i--) {
			// 中心旋转
			tctx.save();
			tctx.translate(centerX, centerY);
			tctx.rotate(6 * Math.PI / 180 * i);
			tctx.translate(-centerX, -centerY);
	
			// 设置阴影
			tctx.shadowBlur = 12.5;
			tctx.shadowColor = 'black';
			tctx.shadowOffsetX = 2;
			tctx.shadowOffsetY = 2;
			tctx.globalAlpha = 0.4;
			tctx.fillRect(x, y, canvas.width, canvas.height);
			// 填充阴影矩形内容为白色
			tctx.shadowBlur = 0;
			tctx.beginPath();
			tctx.moveTo(x + radiu, y + canvas.height);
			tctx.arcTo(x, y + canvas.height, x, y + canvas.height - radiu, radiu);
			tctx.lineTo(x, y + radiu);
			tctx.arcTo(x, y, x + radiu, y, radiu);
			tctx.lineTo(x + canvas.width - radiu, y);
			tctx.arcTo(x + canvas.width, y, x + canvas.width, y + radiu, radiu);
			tctx.lineTo(x + canvas.width, y + canvas.height - radiu);
			tctx.arcTo(x + canvas.width, y + canvas.height, x + canvas.width - radiu, y + canvas.height, radiu);
			tctx.fillStyle = 'white';
			tctx.shadowColor = 'transparent';
			tctx.globalAlpha = 1;
			tctx.fill();
	
			// 还原画布
			tctx.restore();
		}

		// 绘制Print screenshot阴影
		tctx.shadowBlur = 12.5;
		tctx.shadowColor = 'black';
		tctx.shadowOffsetX = 2;
		tctx.shadowOffsetY = 2;
		tctx.globalAlpha = 0.4;
		tctx.fillRect(x, y, canvas.width, canvas.height);
		// 绘制Print screenshot
		tctx.shadowBlur = 0;
		tctx.shadowColor = 'transparent';
		tctx.globalAlpha = 1;

		// 绘制圆角
		tctx.beginPath();
		tctx.moveTo(x + radiu, y + canvas.height);
		tctx.arcTo(x, y + canvas.height, x, y + canvas.height - radiu, radiu);
		tctx.lineTo(x, y + radiu);
		tctx.arcTo(x, y, x + radiu, y, radiu);
		tctx.lineTo(x + canvas.width - radiu, y);
		tctx.arcTo(x + canvas.width, y, x + canvas.width, y + radiu, radiu);
		tctx.lineTo(x + canvas.width, y + canvas.height - radiu);
		tctx.arcTo(x + canvas.width, y + canvas.height, x + canvas.width - radiu, y + canvas.height, radiu);
		var pattern = tctx.createPattern(canvas, 'no-repeat');
		tctx.fillStyle = pattern;
		tctx.translate(x, y);
		tctx.fill();
		tctx.closePath();

		// // for testing
		// var oldChild = document.querySelector('#testCavnas');
		// oldChild ? document.body.removeChild(oldChild) : '';
		// document.body.appendChild(tmpCanvas);
		// tmpCanvas.id = 'testCavnas';
		// tmpCanvas.style.position = 'absolute';
		// tmpCanvas.style.top = '50px';
		// tmpCanvas.style.right = '0px';

		return tmpCanvas.toDataURL("image/png");
	}
}
