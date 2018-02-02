var Vue = require('vuejs');

var CanvasController = require("CanvasController");

var CompTmplItem = Vue.extend(require('../components/CompTmplItem.js'));

module.exports = {
	template : '<div class="tmpl_main" v-show="sharedStore.isChangeTmplExpanded">' +
					'<table class="tmpl_list">' +
						'<td>' +
							'<tmpl-item v-for="item in list" v-bind:item="item"></tmpl-item>' +
						'</td>' +
					'</table>' +
			   	'</div>',
	data : function(){
		return {
			privatedStore : {
				changeButtText : 'Change',
				autoText : 'Auto Layout',
				isAutoLayout : true,
				cellWidth : 162.28
			},
			sharedStore : Store
		}
	},
	computed : {
		list : function(){

			var arr = [],
				lists = this.sharedStore.templateList;

			var size = Store.projectSettings[Store.currentSelectProjectIndex].size;
			var rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated;
			if(rotated){
				size = size.split('X')[1]+'X'+size.split('X')[0];
			}

			for(var i=0,len=lists.length;i<len;i++){
				if(lists[i].imageNum==this.sharedStore.imagesIndex && lists[i].designSize==size ){
					arr.push(lists[i]);
				}
			}

			return arr;
		},
		currentGuid : function(){
			return this.sharedStore.projectSettings[this.sharedStore.currentSelectProjectIndex].tplGuid;
		},
	},
	methods : {

	},
	events : {
		notifySetRotatedTemplate : function(){
			if(!this.sharedStore.autoLayout){
				return;
			}
			var arr = [],
				_this = this,
				lists = this.sharedStore.templateList;

			var size = Store.projectSettings[Store.currentSelectProjectIndex].size,
				guid = Store.projectSettings[Store.currentSelectProjectIndex].tplGuid,
				currentCanvas = Store.pages[Store.selectedPageIdx].canvas,
				rotateGuid='',
				imgParams = [],
				imgNums = 0,
				hImgNum = 0,
				vImgNum = 0;

			if(!CanvasController.getTemplateBySize(size).length){
				return;
			}
			for(var i=0;i<currentCanvas.params.length;i++){
	            var item = currentCanvas.params[i];
	            if(item.elType==='image'){
	                imgParams.push(item);
	                if(item.width>item.height){
	                    hImgNum++;
	                }else{
	                  vImgNum++;
	                }
	            }
	        }
	        imgNums = imgParams.length;
	        if((CanvasController.getTemplateByGuid(guid) && imgNums!=CanvasController.getTemplateByGuid(guid).imageNum) || (!CanvasController.getTemplateByGuid(guid))){
	        	fitTpl = CanvasController.getFitTemplate(imgNums,hImgNum,vImgNum);
		        if(fitTpl){
		        	Store.imagesIndex = fitTpl.imageNum;
			        require('TemplateService').getTemplateItemInfo(fitTpl.guid,fitTpl.designSize);
			        Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = fitTpl.guid;
			        Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = fitTpl.suitId;
			        return;
		        }
	        }

			for(var i=0;i<this.sharedStore.templateList.length;i++){
				var item = this.sharedStore.templateList[i];
				if(item.guid==guid){
					Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = item.suitId;
					Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = item.rotateTemplateGuid;
					rotateGuid=item.rotateTemplateGuid;
					break;
				}
			}
			var rotated = Store.projectSettings[Store.currentSelectProjectIndex].rotated;
			if(rotated){
				size = size.split('X')[1]+'X'+size.split('X')[0];
			}

			for(var i=0,len=lists.length;i<len;i++){
				if(lists[i].imageNum==this.sharedStore.imagesIndex && lists[i].designSize==size ){
					arr.push(lists[i]);
				}
			}
			if(rotateGuid){
				require('TemplateService').getTemplateItemInfo(rotateGuid,size);
			}else{
				Store.vm.$broadcast("notifyChangeTmplByImageCount",0);
				CanvasController.autoLayout();
			}

		}
	},
	components : {
		'tmpl-item' : CompTmplItem
	},
	ready : function(){

	}
}
