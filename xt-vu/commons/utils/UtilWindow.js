
module.exports = {

	// handle box position ( center ) before showing it
	setPopWindowPosition: function(oParams) {
		if(oParams && oParams.width && oParams.height && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newLeft = (width - oParams.width)/2  > 0 ? (width - oParams.width)/2 : 0 ,
			    newTop = (height - oParams.height)/2 > 0 ? (height - oParams.height)/2 : 0;

			$(oParams.selector).css('left', newLeft).css('top', newTop);
		};
	},

	// init image list size
	initImageListSize: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 208;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},

	initImageListSizeWithCards: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 40 - 34 - 41 - 28 - 20 - 3 - 36;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},

	initImageListSizeWithWallArts: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 215 + 40;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},


	initImageListSizeWithCase: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 234;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},
	initImageListSizeWithPadCase: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 240;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},
	initImageListSizeWithLRB: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 40 - 35 - 10 - 32 - 10;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},
	initDecorationListSize: function(oParams) {
		if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 208;

			newHeight = newHeight < 200 ? 200 : newHeight;

			$(oParams.selector).css('height', newHeight);
		};
	},
	// init tshirt project item list size
	getProjectListSize: function(oParams) {
		// if(oParams && oParams.selector) {
			var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			    height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			    newHeight = height - 122;

			newHeight = newHeight < 200 ? 200 : newHeight;

			// $(oParams.selector).css('height', newHeight);
			return newHeight;
		// };
	},

	// get canvas box limit
	getBoxLimit: function(listTabWidth) {
		listTabWidth = listTabWidth || 340;
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - listTabWidth - 20,
				boxHeight = height - 50 - 2 - 80 * 2;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},

	getCardBoxLimit: function(listTabWidth, offsetBottom) {
		listTabWidth = listTabWidth || 340;
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - listTabWidth - 20,
				boxHeight = height - 38 * 2 - 60 - 80 - 20 - offsetBottom;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},

	getBoxLimitWithCase : function(){
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - 280 - 20 - 30 * 2,			// list tab, scroll, margin
				boxHeight = height - 50 - 30 - 2 - 150;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},


	getBoxBgSize : function(){
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - 340 - 20,
				boxHeight = height - 50 - 2;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},

	// get preview canvas box limit
	getPreviewBoxLimit: function(isWithoutBottomPanel) {
		isWithoutBottomPanel = isWithoutBottomPanel || false;
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width - 50,
				boxHeight = height - 30 - 60;

		isWithoutBottomPanel ? boxHeight: boxHeight -= 80;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},

	// get canvas box limit with template
	getBoxLimitWithTmpl: function() {
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
			height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
			boxWidth = width - 340 - 20 - 30 * 2,   // imagelist, scroll bar, margin
			boxHeight = height - 50 - 2 - 80 * 2;	// header, kept space, action panel

		// check if app is with template
		if(Store.isWithTemplate) {
			boxHeight -= 40;
			if(Store.isChangeTmplExpanded) {
				boxHeight -= 155;
			};
		};

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},

	getOptionHeight : function(){
		var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

		return height - 80 - 60 -4;
	},

	getWallArtsOptionHeight : function(){
		var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

		return height - 50 - 44 - 2;
	},

	getCardsOptionHeight : function(){
		var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);

		return height - 41 - 35 - 36;
	},

	getPhoneCaseOptionHeight : function(){
		var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
		
		return height - 80 - 60 -4;
	},

	getPadCaseOptionHeight : function(){
		var height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
		console.log(height - 80 - 200);
		return height - 80 - 90;
	},

	getPrintBoxLimit : function(){
		if(Store.limitWidth) {
			return {
				width: Store.limitWidth,
				height: Store.limitWidth
			}
		}

		var width = screen.availWidth,
		perWidth = (width - 6*40 - 2 * 30 - 6*5) / 6 - 20;
		// perWidth = perWidth < 235 ? 235 : (perWidth-20);
		perWidth = perWidth < 235 ? 235 : perWidth;
		return {
			width: perWidth,
			height : perWidth
		}
	},

	getPrintPreviewBoxLimit: function() {
		var width = screen.availWidth,
			perWidth = (width - 4*20 - 2 * 50) / 4;
		perWidth = perWidth >=458 ? 458 : perWidth - 20;
		perWidth = perWidth < 235 ? 235 : perWidth;
		return {
			width: perWidth,
			height : perWidth
		}
	},
	getCenterPreviewBoxLimit: function(isWithoutBottomPanel) {
		isWithoutBottomPanel = isWithoutBottomPanel || false;
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = width,
				boxHeight = height - 30 - 60;

		isWithoutBottomPanel ? boxHeight: boxHeight -= 80;

		boxWidth > 0 ? boxWidth : boxWidth = 0;
		boxHeight > 0 ? boxHeight : boxHeight = 0;
		return { width: boxWidth, height: boxHeight };
	},
	// 获取盒子的宽高。宽高需要去除的值外部传入。
	getBoxWH: function(desWidth, desHeight) {
		var width = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth),
				height = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight),
				boxWidth = desWidth ? (width - desWidth) : width,
				boxHeight = desHeight ? (height - desHeight) : height;

				boxWidth > 0 ? boxWidth : boxWidth = 0;
				boxHeight > 0 ? boxHeight : boxHeight = 0;
				return { width: boxWidth, height: boxHeight };
	}
};
