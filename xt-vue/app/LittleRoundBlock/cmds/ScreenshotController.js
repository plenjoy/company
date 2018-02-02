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
		// return DrawManage.canvasToBase64("real-screenshot");
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
				bgCanvas = document.getElementById(bgCanvasId),
				bgCtx = bgCanvas.getContext("2d"),
				tmpCanvas = document.createElement("canvas"),
				tctx = tmpCanvas.getContext("2d"),
				// 新建bgCanvas副本，bgCanvas的imageData如果画回bgCanvas，
				// 会造成canvas绘画数据混乱，因此新建canvas来做背景副本
				newBgCanvas = document.createElement("canvas"),
				newBgCtx = newBgCanvas.getContext("2d");
		// imageData变量
		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
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
				duplicateBgOffset = { x: 0, y: 0 },	// 复制背景偏移数,
				duplicateRotateDeg = 0,
				duplicateBgCount = activePageCount - 1 > maxDuplicateCount ? maxDuplicateCount : activePageCount - 1,
				extend = { width: duplicateBgCount * 40, height: duplicateBgCount * 40 };
		
		switch(Store.projectSettings[pageIdx].size) {
			case '8X10':
					duplicateBgOffset = Store.projectSettings[pageIdx].orientation === 'Landscape' ? { x: 35, y: 25 } : { x: 25, y: 20 };
					break;
			case '11X14':
					duplicateBgOffset = Store.projectSettings[pageIdx].orientation === 'Landscape' ? { x: 30, y: 25 } : { x: 20, y: 15 };
					break;
			case '10X10':
					duplicateBgOffset = Store.projectSettings[pageIdx].shape !== 'Round' ? { x: 35, y: 25 } : { x: 35, y: 0 };
					duplicateRotateDeg = Store.projectSettings[pageIdx].shape !== 'Round' ? 0 : 25;
					break;
			case '14X14':
					duplicateBgOffset = Store.projectSettings[pageIdx].shape !== 'Round' ? { x: 30, y: 25 } : { x: 35, y: 0 };
					duplicateRotateDeg = Store.projectSettings[pageIdx].shape !== 'Round' ? 0 : 25;
					break;
		}

		// 设置最终截图大小
		var tmpCanvasWidth = canvas.width + extend.width;
		var tmpCanvasHeight = canvas.height + extend.height;
		tmpCanvas.width = tmpCanvasWidth;
		tmpCanvas.height = tmpCanvasHeight;

		// 设置最终截图背景色
		tctx.fillStyle = '#f0f0f0';
		tctx.fillRect(0, 0, tmpCanvasWidth, tmpCanvasHeight);


		// 创建去白边的screenshot
		imageData = require('DrawManage').replaceColorOutOfArea(
				imageData,
				currentCanvas.oriX * ratio,
				currentCanvas.oriY * ratio,
				greyColor,
				currentCanvas.oriWidth * ratio,
				currentCanvas.oriHeight * ratio,
				null,
				null,
				Store.projectSettings[0].shape
		);
		ctx.putImageData(imageData, 0, 0);
		ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);


		// 创建去白边的复制背景层 bg-layer
		newBgCanvas.width = bgCanvas.width;
		newBgCanvas.height = bgCanvas.height;
		bgImageData = require('DrawManage').replaceColorOutOfArea(
				bgImageData,
				currentCanvas.oriX * ratio,
				currentCanvas.oriY * ratio,
				greyColor,
				currentCanvas.oriWidth * ratio,
				currentCanvas.oriHeight * ratio,
				null,
				greyColor,
				Store.projectSettings[0].shape
		);
		newBgCtx.putImageData(bgImageData, 0, 0);

		// 计算canvas中心旋转参数
		var centerX = newBgCanvas.width / 2;
		var centerY = newBgCanvas.height / 2;
		var x = centerX - newBgCanvas.width / 2;
		var y = centerY - newBgCanvas.height / 2;
		// 计算canvas中心旋转参数
		newBgCtx.save();
		newBgCtx.translate(centerX, centerY);
		newBgCtx.rotate(duplicateRotateDeg * Math.PI / 180);
		newBgCtx.translate(-centerX, -centerY);
		newBgCtx.drawImage(newBgCanvas, 0, 0, bgCanvas.width, bgCanvas.height);
		newBgCtx.restore();

		// 计算screenshot居中位置
		var bgX = (tmpCanvasWidth - currentCanvas.oriBgWidth * ratio - duplicateBgOffset.x * duplicateBgCount) / 2;
		var bgY = (tmpCanvasHeight - currentCanvas.oriBgHeight * ratio - duplicateBgOffset.y * duplicateBgCount) / 2;
		// 绘制复制背景层
		for(var i = duplicateBgCount; i > 0; i--) {
				tctx.globalAlpha = 0.9 - 0.3 * i;
				tctx.drawImage(newBgCanvas, bgX + i * duplicateBgOffset.x, bgY + (duplicateBgCount - i) * duplicateBgOffset.y, canvas.width, canvas.height);
		}
		// 绘制产品效果图
		tctx.globalAlpha = 1;
		tctx.drawImage(canvas, bgX, bgY + duplicateBgCount * duplicateBgOffset.y, canvas.width, canvas.height);

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