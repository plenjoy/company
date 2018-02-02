var DrawManage = require("DrawManage");
var Scale = require("Scale");
module.exports = {
	convertScreenshotToBase64 : function(){
	
		if(Store.isProjectUpgrade) {
			return Store.beforeUpgradeScreenshot;
		} else {
			var screenshot = document.getElementById("real-screenshot");
			var activePageCount = Store.pages.reduce(function(count, page) {
				return !page.isDeleted ? count + 1 : count;
			}, 0);

			if(activePageCount > 1) {
				return this.getMultipleScreenshotImage();
			}

			if(screenshot.width/Store.screenshotSize.width <=1 || screenshot.height/Store.screenshotSize.height <=1){
				this.removeTransparentBgColor("real-screenshot");
				return DrawManage.resizeImage("real-screenshot",Store.screenshotSize.width,Store.screenshotSize.height);
			}else{
				this.removeTransparentBgColor("real-screenshot");
				return Scale.scale({width:Store.screenshotSize.width,height:Store.screenshotSize.height},screenshot,'jpeg-src');
			}
		}
		//return DrawManage.canvasToBase64("real-screenshot");
	},


	removeTransparentBgColor: function(canvasId) {
		var canvas = document.getElementById(canvasId),
				ctx = canvas.getContext("2d"),
				imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
				greyColor = {r: 240, g: 240, b: 240};

		imageData = require('DrawManage').replaceColorOutOfArea(
			imageData,
			0,
			0,
			greyColor,
			canvas.width,
			canvas.height,
			greyColor,
			greyColor
		);

		ctx.putImageData(imageData, 0, 0);
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
			return this.resizeImageWithMultipleProjectBg("real-screenshot", firstEnablePageIdx);
		}
	},

	resizeImageWithMultipleProjectBg: function(canvasId,pageIdx) {
		// DOM变量
		var bgCanvasId = 'bg-part' + pageIdx + 'Main',
				canvas = document.getElementById(canvasId),
				ctx = canvas.getContext("2d"),
				newRealCanvas = document.createElement('canvas'),
				newRealCtx = newRealCanvas.getContext("2d"),
				bgCanvas = document.getElementById(bgCanvasId),
				bgCtx = bgCanvas.getContext("2d"),
				tmpCanvas = document.createElement("canvas"),
				tctx = tmpCanvas.getContext("2d"),
				// 新建bgCanvas副本，bgCanvas的imageData如果画回bgCanvas，
				// 会造成canvas绘画数据混乱，因此新建canvas来做背景副本
				newBgCanvas = document.createElement("canvas"),
				newBgCtx = newBgCanvas.getContext("2d");

		newRealCanvas.width = canvas.width;
		newRealCanvas.height = canvas.height;
		newRealCtx.drawImage(canvas, 0, 0);

		// imageData变量
		var imageData = ctx.getImageData(0, 0, newRealCanvas.width, newRealCanvas.height),
				bgImageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
		// currentCanvas变量
		var currentCanvas = Store.pages[pageIdx].canvas,
				ratio = this.getMainScreenshotRatio(currentCanvas),
				greyColor = {r: 240, g: 240, b: 240},
				redColor = {r: 255, g: 0, b: 0};

		// 没有删除的page总数
		var activePageCount = Store.pages.reduce(function(count, page) {
			return !page.isDeleted ? count + 1 : count;
		}, 0);

		// 复制背景参数
		var maxDuplicateCount = 2,	// 最大复制背景层数
				duplicateBgOffset = { x: 25, y: 25 },	// 复制背景偏移数
				duplicateBgCount = activePageCount - 1 > maxDuplicateCount ? maxDuplicateCount : activePageCount - 1,
				extend = { width: duplicateBgCount * 40, height: duplicateBgCount * 40 };

		// 设置最终截图大小
		var tmpCanvasWidth = newRealCanvas.width + extend.width;
		var tmpCanvasHeight = newRealCanvas.height + extend.height;
		tmpCanvas.width = tmpCanvasWidth;
		tmpCanvas.height = tmpCanvasHeight;

		// 设置最终截图背景色
		tctx.fillStyle = '#f0f0f0';
		tctx.fillRect(0, 0, tmpCanvasWidth, tmpCanvasHeight);

		// 
		if(newRealCanvas.width === 200) {
			return '';
		}

		// 创建去白边的screenshot
		imageData = require('DrawManage').replaceColorOutOfArea(
				imageData,
				currentCanvas.foreground.x * ratio,
				currentCanvas.foreground.y * ratio,
				greyColor,
				currentCanvas.frameBaseSize.width * ratio,
				currentCanvas.frameBaseSize.height * ratio
		);
		newRealCtx.putImageData(imageData, 0, 0);
		newRealCtx.drawImage(newRealCanvas, 0, 0, newRealCanvas.width, newRealCanvas.height);


		// 创建去白边的复制背景层 bg-layer
		newBgCanvas.width = bgCanvas.width;
		newBgCanvas.height = bgCanvas.height;
		bgImageData = require('DrawManage').replaceColorOutOfArea(
				bgImageData,
				currentCanvas.foreground.x * ratio,
				currentCanvas.foreground.y * ratio,
				greyColor,
				currentCanvas.frameBaseSize.width * ratio,
				currentCanvas.frameBaseSize.height * ratio,
				null,
				greyColor
		);
		newBgCtx.putImageData(bgImageData, 0, 0);
		newBgCtx.drawImage(newBgCanvas, 0, 0, bgCanvas.width, bgCanvas.height);


		// 计算screenshot居中位置
		var bgX = (tmpCanvasWidth - currentCanvas.oriBgWidth * ratio - duplicateBgOffset.x * duplicateBgCount) / 2;
		var bgY = (tmpCanvasHeight - currentCanvas.oriBgHeight * ratio - duplicateBgOffset.y * duplicateBgCount) / 2;
		// 绘制复制背景层
		for(var i = duplicateBgCount; i > 0; i--) {
				tctx.globalAlpha = 0.8 - 0.2 * i;
				tctx.drawImage(newBgCanvas, bgX + i * duplicateBgOffset.x, bgY + (duplicateBgCount - i) * duplicateBgOffset.y, newRealCanvas.width, newRealCanvas.height);
		}
		// 绘制产品效果图
		tctx.globalAlpha = 1;
		tctx.drawImage(newRealCanvas, bgX, bgY + duplicateBgCount * duplicateBgOffset.y, newRealCanvas.width, newRealCanvas.height);

		// // for testing
		// var oldChild = document.querySelector('#testCavnas');
		// oldChild ? document.body.removeChild(oldChild) : '';
		// document.body.appendChild(tmpCanvas);
		// tmpCanvas.id = 'testCavnas';
		// tmpCanvas.style.position = 'absolute';
		// tmpCanvas.style.top = '50px';
		// tmpCanvas.style.right = '0px';

		return tmpCanvas.toDataURL("image/png");
	},
	getMainScreenshotRatio: function(currentCanvas) {
			var objWidth = currentCanvas.oriBgWidth,
					objHeight = currentCanvas.oriBgHeight;
			var boxLimit = require('UtilWindow').getBoxWH(280,236);
			var wX = boxLimit.width / objWidth,
					hX = boxLimit.height / objHeight;
			
			return wX > hX ? hX : wX;
	}
}