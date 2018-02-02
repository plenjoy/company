var UtilMath = require('UtilMath');
var ImageListManage = require('ImageListManage');
var ParamsManage = require('ParamsManage');
var SpecController = require('SpecController');

module.exports = {
	createElement : function(idx){
		this.initElement(idx);
	},
	editElement : function(idx){
		this.deleteElement(idx);
		this.initElement(idx);
	},
	deleteElement : function(idx){
		// console.log('delete warn', idx);
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		if(currentCanvas.warns[idx]){
		 currentCanvas.warns[idx].el && currentCanvas.warns[idx].el.remove();
		 currentCanvas.warns[idx].el = '';
		}
		// this.showBeforeElements();
	},
	initElement : function(idx){
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
		 	warnTipUrl = '../../static/img/warn_big_icon.png',
		 	params = require("ParamsManage").getParamsValueByElement(idx);

		currentCanvas.warns[idx].isActive = true;
		currentCanvas.warns[idx].el = currentCanvas.paper.image(warnTipUrl, params.x * currentCanvas.ratio + 5, (params.y + params.height) * currentCanvas.ratio - 15,Store.warnSettings.warnImageWidth,Store.warnSettings.warnImageHeight);
		currentCanvas.warns[idx].el.node.id = 'warn-tip-' + idx;
		var title = document.createElementNS("http://www.w3.org/2000/svg","title"),
			text = document.createTextNode(Store.warnSettings.resizeWarnMsg);
		title.appendChild(text);
		document.getElementById('warn-tip-' + idx).appendChild(title);
	},
	showBeforeElements : function(){
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas,warns = currentCanvas.warns;
		warns.map(function(warn){
			warn.el && warn.el.toFront();
		})
	},
	refreshLaterTips : function(idx){
		var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
		for(var i=idx,l=currentCanvas.warns.length;i<l;i++){
			if(currentCanvas.warns[i] && currentCanvas.warns[i].isActive){
				currentCanvas.warns[i].el.node.id = 'warn-tip-' + i;
				// this.deleteElement(i);
				// this.initElement(i);
			}
		}
	}
}
