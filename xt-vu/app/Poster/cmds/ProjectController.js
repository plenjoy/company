module.exports = {

    saveNewProject: function(obj) {
        var xml = require('ProjectManage').getPosterInitProjectXml();
        Store.projectXml = xml;
        console.log(Store.projectXml);
        require('ProjectService').insertProject(obj,xml);
        //require('CanvasController').initCanvasData();
        //Store.watches.isProjectLoaded = true;
    },
    saveOldProject: function(obj,callback) {
        var xml = require('ProjectManage').getPosterCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        if(callback && typeof callback==="function"){
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH,callback);
        }else{
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
        }
    },
    handledSaveOldProject: function(obj,eventName) {
        /*var xml = this.getCurrentProjectXml();
        console.log(xml);
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var thumbnailPX=base.x/background.width;
        var thumbnailPY=base.y/background.height;
        var thumbnailPW=base.width/background.width;
        var thumbnailPH=base.height/background.height;
        require('ProjectService').handledSaveProject(obj,eventName,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);*/

        var xml = require('ProjectManage').getPosterCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        require('ProjectService').handledSaveProject(obj,eventName, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
    },
    getOldProject: function() {
        if(Store.isPreview){
            require('ProjectService').getShareProject();
        }else{
            require('ProjectService').getProject();
        }

    },
    getProjectOrderedState: function(obj) {
        require('ProjectService').getProjectOrderedState(obj);
    },
    addOrUpdateAlbum: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').addOrUpdateAlbum(title, dispatchObj, dispatchEventName);
    },
    changeProjectTitle: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').changeProjectTitle(title, dispatchObj, dispatchEventName);
    },
    newProject:function(color,measure,count){
        var PrjConstructor = require('Prj');
        var project = PrjConstructor();
        project.product = 'TS';
        project.color = color;
        project.size = '14X16';
        project.measure = measure;
        project.count = count;
        return project;
    },
    orderProject: function(obj) {
        var xml = require('ProjectManage').getPosterCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        require('ProjectService').orderProject(obj,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
    },

    cloneProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var xml = require('ProjectManage').getPosterCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;

        require('ProjectService').cloneProject(obj,oldTitle,title,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);

    },
    setDefaultValue: function(){
        var Prj = Store.projectSettings[Store.currentSelectProjectIndex];

        var SpecManage = require('SpecManage');
        //paper的默认选项
        var paperDefaultValue = SpecManage.getOptionsMapDefaultValue("paper",[{"key":"product","value":Prj.product}]);
        Prj.paper =  paperDefaultValue?paperDefaultValue:'none';
    },

    createProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var PrjConstructor = require('Prj');
        var Prj = PrjConstructor();
        var UtilParam = require('UtilParam');
        Prj.product = UtilParam.getUrlParam('product');
        Prj.size = UtilParam.getUrlParam('size');
        Prj.paper = UtilParam.getUrlParam('paper');
        Store.category=UtilParam.getUrlParam('category');
        Store.projectType="PP";
        Prj.rotated = true;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        require("ImageController").deleteImage(0);
        Store.vm.$broadcast('notifyRefreshScreenshot');
        // var ll=currentCanvas.params.length;
        // for(var v=0;v<ll;v++){
        //     Store.vm.$broadcast('notifyRemoveImage',0);
        // }
        currentCanvas.params.length=0;
        Store.projectSettings.length=0;
        Store.projects.length=0;
        Store.imageList.length=0;
        Store.projectSettings.push(Prj);
        var xml = require('ProjectManage').getPosterInitProjectXml();
        Store.projectXml = xml;
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
        require('ProjectService').createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);

    },
    getMainProjectImages:function(obj,projectId,imageId){
        require('ProjectService').getMainProject(obj,projectId,imageId);
    },
    getMyPhotoImages:function(obj,userId){
        require('ProjectService').getMyPhotoImages(obj,userId);
    }
}
