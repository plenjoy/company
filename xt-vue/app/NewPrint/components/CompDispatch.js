var CanvasController = require("CanvasController");
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

		dispatchShowPrintPreview : function(){
			this.$broadcast('notifyShowPrintPreview');
		},

		dispatchResetSelectItemPram : function(){
			this.$broadcast('notifyResetSelectItemPram');
		},

		dispatchCommitSelectItemPrjPram : function() {
			this.$broadcast('notifyCommitSelectItemPrjPram');
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

		dispatchShowChangeAll : function() {
     			this.$broadcast('notifyShowChangeAll');
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

		dispatchRepaintProject: function() {
			this.$broadcast('notifyRepaintProject');
		},

		dispatchAddImage : function(params){
			this.$broadcast("notifyAddImage",params);
		},

		dispatchRefreshMirror : function(){
			this.$broadcast("notifyRefreshMirror");
		},

		dispatchRefreshBorder : function(type){
			this.$broadcast("notifyRefreshBorder",type);
		},

		dispatchRefreshScreenshot : function(pageIdx){
			this.$broadcast("notifyRefreshScreenshot",pageIdx);
		},

		dispatchShowEditBorder : function(){
			this.$broadcast("notifyShowEditBorder");
		},

		dispatchShowBorder : function(){
			this.$broadcast("notifyShowBorder");
		},
		dispatchShowRemindMsg : function(){
			this.$broadcast("notifyShowRemindMsg");
		},
		dispatchShowCloneWindow:function(){
			this.$broadcast("notifyShowCloneWindow");
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
		dispatchOptionItemSelect:function(id,value){
			this.$broadcast("notifyOptionItemSelect",id,value);
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
			Store.isLostFocus = true;
		},
		dispatchSingleImageUploadComplete:function(imageId){
	      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
	      var idx = currentCanvas.selectedIdx;
	      currentCanvas.elements[idx].setImageById(imageId);
		},
		dispatchApplyTemplate:function(templateId,suitId,designSize){
			require('TemplateService').getTemplateItemInfo(templateId,designSize);
			Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = templateId;
			Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = suitId;
			if(this.sharedStore.isImageBorder){
                CanvasController.changeBorderToMirror(true);
            }else{
                CanvasController.changeBorderToMirror();
            }
            this.$dispatch("dispatchRepaintProject");
            this.$dispatch("dispatchRefreshScreenshot");
		},
		dispatchTemplateItemInfo:function(xml){
			console.log(xml);
			this.$broadcast("notifyApplyTemplate",xml);
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
		dispatchRefreshScreenshot : function(pageIdx){
			this.$broadcast("notifyRefreshScreenshot",pageIdx);
		},
		dispatchDeletePhoto : function(){
			this.$broadcast("notifyDeletePhoto");
		},
		dispatchRecoverDeletedPhoto : function(){
			this.$broadcast("notifyRecoverDeletedPhoto");
		},
		dispatchDuplicatePhoto : function(did){
			this.$broadcast("notifyDuplicatePhoto",did);
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
		dispatchOrderedPreview: function() {
			var hasProjectId = !!Store.projectId;
			var isProjectLocked = Store.projectInfo.isOrdered || Store.projectInfo.isInCart;
			var isNotCheckFailed = !Store.checkFailed;
			var isNotPreview = !Store.isPreview;
			var isNotRemake = !Store.isRemark;
			var isNotFromCart = !Store.fromCart;

			if(hasProjectId && isProjectLocked && isNotCheckFailed && isNotPreview && isNotRemake && isNotFromCart) {
				this.$broadcast("notifyOrderedPreview");
				Store.isPreview = true;
			}
		},
		dispatchSaveProject: function() {
			require('ProjectController').saveProjectOnly(this);
		}
	}
};
