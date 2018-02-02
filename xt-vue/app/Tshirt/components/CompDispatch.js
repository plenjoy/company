
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

		dispatchReplaceImage : function(param){
			this.$broadcast('notifyReplaceImage',param);
		},

		dispatchShowAddText: function() {
		  this.$broadcast('notifyShowAddText');
		},

		dispatchAddText: function(idx) {
			this.$broadcast('notifyAddText', idx);
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
		dispatchDepthFront: function(idx) {
			console.log(idx);
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
		}

	}
};
