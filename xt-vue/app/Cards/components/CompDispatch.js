
module.exports = {
	events: {
		// child instance dispatch image upload
		dispatchImageUpload: function() {
			this.$broadcast('notifyShowImageUpload');
		},

		// child instance dispatch image list
		dispatchImageList: function() {
			this.$broadcast('notifyImageList');
		},
		dispatchDecorationList: function(){
			this.$broadcast('notifyDecorationList');
		},
		dispatchImageCrop: function() {
			this.$broadcast('notifyImageCrop');
		},

		dispatchShowAddText: function() {
		  this.$broadcast('notifyShowAddText');
		},

		dispatchAddText: function(idx) {
			this.$broadcast('notifyAddText', idx);
		},
		dispatchShowMattingGlassEdit : function(){
			this.$broadcast("notifyShowMattingGlassEdit");
		},

		dispatchModifyText: function(idx) {
		  this.$broadcast('notifyModifyText', idx);
		},

		dispatchResetCanvas: function() {
		  this.$broadcast('notifyResetCanvas');
		},

		dispatchShowSpineLines: function() {
			this.$broadcast('notifyShowSpineLines');
		},

		dispatchHideSpineLines: function() {
			this.$broadcast('notifyHideSpineLines');
		},

		dispatchShowOptionWindow: function() {
			this.$broadcast('notifyShowOptionWindow');
		},

		dispatchUpdateAlbumResponse: function(isValid,text) {
			this.$broadcast('notifyUpdateAlbumResponse',isValid,text);
		},

		dispatchShowOrderWindow: function() {
			this.$broadcast('notifyShowOrderWindow');
		},

		dispatchShowContactUsWindow:function(){
			this.$broadcast('notifyShowContactUsWindow');
		},

		dispatchPreviewSave:function(result){
			this.$broadcast('notifyPreviewSave',result);
		},

		dispatchShowPopup : function(params){
			this.$broadcast('notifyShowPopup',params)
		},

		dispatchReorder : function(params){
			this.$broadcast("notifyReorder",params);
		},

		dispatchRedirectHome : function(){
			this.$broadcast("notifyRedirectHome");
		},

		dispatchShowWarnTip : function(idx){
			this.$broadcast("notifyShowWarnTip",idx);
		},

		dispatchHideWarnTip : function(idx){
			this.$broadcast("notifyHideWarnTip",idx);
		},

		dispatchShowOptionsWindow : function(){
			this.$broadcast("notifyShowOptionsWindow");
		},

		dispatchRotate : function(){
			this.$broadcast("notifyRotate");
		},
		dispatchRefreshScreenshot : function(){
			this.$broadcast("notifyRefreshScreenshot");
		},
		dispatchCardsPriceChange:function(){
			this.$broadcast("notifyCardsPriceChange");
		},
		dispatchRepaintProject: function() {
			this.$broadcast('notifyRepaintProject');
		},

		dispatchAddImage : function(params){
			this.$broadcast("notifyAddImage",params);
		},
		dispatchAddDecoration: function(params){
			this.$broadcast("notifyAddDecoration",params);
		},
		dispatchShowCloneWindow:function(){
			this.$broadcast("notifyShowCloneWindow");
		},
		dispatchTemplateItemInfo:function(xml){
			// console.log(xml);
			this.$broadcast("notifyApplyTemplate",xml);
		},
		dispatchResetProjectInfo:function(){

			if(require('UtilProject').getIsShowProjectInfoView()){
				//this.$broadcast("notifyResetProjectInfo",false);
				var text=require('UtilProject').getProjectInfoViewText();
				/*this.$dispatch("dispatchShowPopup", { type : 'saveAs', status : 0 ,info:text});*/

			}else{
				this.$broadcast("notifyResetProjectInfo",true);
			}
		},

		// some system actions
		dispatchClearScreen: function(isFullClear) {
			isFullClear ? isFullClear = true : isFullClear = false;

			if(isFullClear) {
				// full screen clearing
			}
			else {
				// half screen clearing
			};

			// common screen clearing
			// 1. blur action focus
			this.sharedStore.isLostFocus = true;
			this.sharedStore.isShowHandlePoint = false;
		},
		// dispatchDecorationDrop: function(event){
		// 	this.$broadcast("notifyDecorationDrop",event);
		// },
		dispatchSingleImageUploadComplete:function(imageId){
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      var idx = currentCanvas.selectedIdx;
	      currentCanvas.elements[idx].setImageById(imageId);
		},

		dispatchApplyTemplate:function(templateId,suitId,designSize){
			require('TemplateService').getTemplateItemInfo(templateId,designSize);
			Store.pages[Store.selectedPageIdx].tplGuid = templateId;
			Store.pages[Store.selectedPageIdx].tplSuitId = suitId;
      this.$broadcast("notifyFreshCrop");
      this.$dispatch("dispatchRepaintProject");
      this.$dispatch("dispatchRefreshScreenshot");
      this.$broadcast("notifyFreshCrop");
		},
		dispatchRotateTemplate:function(){
			var currentGuid=Store.projectSettings[Store.currentSelectProjectIndex].tplGuid;
			for(var i in Store.templateList){
				if(currentGuid===Store.templateList[i].guid){
					var rotateTemplateGuid=Store.templateList[i].rotateTemplateGuid;
					for(var j in Store.templateList){
						if(Store.templateList[j].guid===rotateTemplateGuid){
							this.$dispatch("dispatchApplyTemplate",Store.templateList[j].guid,Store.templateList[j].suidId,Store.templateList[j].designSize);
							return;
						}
					}
				}
			}
			require('CanvasController').autoLayout();

		},
		dispatchShowProjectChooseWindow:function(){
			Store.fromCart=true;
			Store.watches.isProjectLoaded=false;
			require("ProjectService").getProjectIdByTitle(Store.title);
			this.$broadcast("notifyShowCartReturnWindow");

		},
		dispatchGetProjectIdByTitleSuccess:function(){
			//Store.fromCart=true;
			//Store.projectId="131412";
			//Store.watches.isProjectLoaded=false;
			if (Store.userSettings.userId !== '' && Store.projectId !== '') {

                require("ProjectService").getProjectInfo();
	            require("ProjectController").getOldProject();

            };
		},
		dispatchShowNewProjectWindow:function(){
			this.$broadcast("notifyShowNewProjectWindow");
		},
		dispatchOptionItemSelect:function(id,value){
			this.$broadcast("notifyOptionItemSelect",id,value);
		},
		dispatchOrderToCart:function(){
			this.$broadcast("notifyOrderToCart");
		},
		dispatchTextFormList: function() {
			this.$broadcast('notifyTextFormList');
		},
		dispatchChangeTab: function(tabName) {
			this.$broadcast('notifyChangeTab', tabName);
		},
		dispatchHighLightTextForm: function(selectedElementIdx) {
			this.$broadcast('notifyHighLightForm', selectedElementIdx);
		},
		dispatchCleanTextFormPlaceholders: function() {
			this.$broadcast('notifyCleanTextFormPlaceholders');
		},
		dispatchDbClickTextFormRemind: function() {
			this.$broadcast('notifyDbClickTextFormRemind');
		},
		dispatchCleanTextFormRemind: function() {
			this.$broadcast('notifyCleanTextFormRemind');
		},
		dispatchToggleShortTip: function(options) {
			this.$broadcast('notifyToggleShortTip', options);
		},
		dispatchRedirectCardList : function(){
			this.$broadcast('notifyRedirectCardList');
		},
		dispatchResetPages: function() {
			require('CanvasController').resetPagesData();
			this.$broadcast('notifyRepaintProject');
		},
		dispatchModifyFrameTracker: function() {
			if(Store.isPortal) return;

			var imageCount = 0;
			var textCount = 0;
			
			Store.pages.forEach(function(page) {
				page.canvas.params.forEach(function(param) {
					switch(param.elType) {
						case 'image':
							param.isScaled || param.isMoved ? imageCount++ : '';
							break;
						case 'text':
							param.isScaled || param.isMoved ? textCount++ : '';
							break;
					}
				});
			});
			
			require('trackerService')({ev: require('trackerConfig').ModifyPhotoFrame, count: imageCount});
			require('trackerService')({ev: require('trackerConfig').ModifyTextFrame, count: textCount});
		},

		dispatchRemoveFrameTracker: function() {
			require('trackerService')({ev: require('trackerConfig').RemovePhotoFrame, count: Store.removeImageFrameCount});
			require('trackerService')({ev: require('trackerConfig').RemoveTextFrame, count: Store.removeTextFrameCount});
		}
	}
};
