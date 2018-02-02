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

		dispatchRepaintProject: function() {
			this.$broadcast('notifyRepaintProject');
		},

		dispatchAddImage : function(params){
			this.$broadcast("notifyAddImage",params);
		},

		dispatchRefreshMirror : function(){
			this.$broadcast("notifyRefreshMirror");
		},
		dispatchClearMirror : function(idx){
			this.$broadcast("notifyClearMirror",idx);
		},


		dispatchRefreshBorder : function(type){
			this.$broadcast("notifyRefreshBorder",type);
		},

		dispatchRefreshScreenshot : function(){
			this.$broadcast("notifyRefreshScreenshot");
		},

		dispatchShowEditBorder : function(){
			this.$broadcast("notifyShowEditBorder");
		},

		dispatchShowBorder : function(){
			this.$broadcast("notifyShowBorder");
		},
		dispatchShowCloneWindow:function(){
			this.$broadcast("notifyShowCloneWindow");
		},
		dispatchCanvasPriceChange:function(){
			this.$broadcast("notifyCanvasPriceChange");
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
		dispatchShowMattingChange:function(id,value){
			this.$broadcast("notifyShowMattingChange",id,value)
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
		  if(currentCanvas.elements[idx]) {
			currentCanvas.elements[idx].setImageById(imageId);
		  }
		},
		dispatchApplyTemplate:function(templateId,suitId,designSize){
			require('TemplateService').getTemplateItemInfo(templateId,designSize);
			Store.projectSettings[Store.currentSelectProjectIndex].tplGuid = templateId;
			Store.projectSettings[Store.currentSelectProjectIndex].tplSuitId = suitId;
			if(Store.projectSettings[Store.currentSelectProjectIndex].category==='categoryCanvas'){
				if(this.sharedStore.isImageBorder){
	                CanvasController.changeBorderToMirror(true);
	            }else{
	                CanvasController.changeBorderToMirror();
	            }
			}
            this.$broadcast("notifyFreshCrop");
            this.$dispatch("dispatchRepaintProject");
            this.$dispatch("dispatchRefreshScreenshot");
            this.$broadcast("notifyFreshCrop");
		},
		dispatchTemplateItemInfo:function(xml){
			console.log(xml);
			this.$broadcast("notifyApplyTemplate",xml);
		},
		dispatchRotateTemplate:function(){

			if(Store.projectSettings[Store.currentSelectProjectIndex].category === 'categoryTableTop') {
			// if(Store.projectSettings[Store.currentSelectProjectIndex].category === 'categoryTableTop' && Store.templateList.length === 0) {

				var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
				var idx = currentCanvas.selectedIdx;
				this.elementData = currentCanvas.params[idx];
				this.elementData.width = currentCanvas.width / currentCanvas.ratio;
				this.elementData.height = currentCanvas.height / currentCanvas.ratio;
				this.$broadcast("notifyFreshCrop");
				this.$dispatch("dispatchRepaintProject");

			} else {

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

			}

			require('CanvasController').autoLayout();

		},
		dispatchRefreshScreenshot : function(){
			this.$broadcast("notifyRefreshScreenshot");
		},
		dispatchShowProjectChooseWindow:function(){
			Store.fromCart=true;
			Store.watches.isProjectLoaded=false;
			Store.isPageLoadingShow = false;
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
		dispatchSaveScreenshotDelay: function(delayMs) {
			var _this = this;
			var initGuid = require('UtilParam').getUrlParam("initGuid");

			if(Store.isNewProject) {
				setTimeout(function() {
					_this.$broadcast("notifySaveScreenshot");
				}, delayMs);
			}
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
		dispatchShowUpgradWindow:function(title){

			this.$broadcast("notifyShowUpgradWindow", title);

		},
		dispatchSaveProject: function() {
			require('ProjectController').saveProjectOnly(this);
		},
		dispatchChangeUpgradeSize: function(oriSize) {
			Store.oriSize = oriSize;
			Store.upgradeSize = Store.upgradeSizeMaps[oriSize];
		}
	}
};
