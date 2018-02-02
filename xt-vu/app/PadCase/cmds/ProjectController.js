module.exports = {

    saveNewProject: function(obj) {
        /*var xml = require('ProjectManage').getPhonecaseInitProjectXml();
        Store.projectXml = xml;
        require('ProjectService').insertProject(obj,xml);*/

        var projectJson = require('ProjectManage').getPhonecaseInitProjectJson();
        var skuJson = require('JsonProjectManage').getWallartsSkuJson(projectJson);
        Store.createdDate = require('UtilDateFormat').formatDateTime(new Date());
        Store.projectJson = projectJson;
        require('JsonProjectService').insertProject(obj,projectJson,skuJson);
    },
    saveOldProject: function(obj,callback) {
        /*var xml = require('ProjectManage').getPhonecaseCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        if(callback && typeof callback==="function"){
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH,callback);
        }else{
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
        }*/

        var projectJson = require('ProjectManage').getPhonecaseCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getWallartsSkuJson(projectJson);
        require('JsonProjectService').saveProject(obj,projectJson,skuJson,callback);
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

       /* var xml = require('ProjectManage').getPhonecaseCurrentProjectXml();
        console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        require('ProjectService').handledSaveProject(obj,eventName, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);*/

        var projectJson = require('ProjectManage').getPhonecaseCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getWallartsSkuJson(projectJson);
        require('JsonProjectService').handledSaveProject(obj,projectJson,skuJson,eventName);
    },
    getOldProject: function() {
        /*if(Store.isPreview){
            require('ProjectService').getShareProject();
        }else{
            require('ProjectService').getProject();
        }*/

        if(Store.isPreview){
            if(Store.source !== 'self') {
                require('JsonProjectService').getPhonecaseProject('Share');
            } else {
                require('JsonProjectService').getPhonecaseProject('OldProject');
            }
        }else{
            require('JsonProjectService').getPhonecaseProject('OldProject');
        }

    },
    getProjectOrderedState: function(obj) {
        require('ProjectService').getProjectOrderedState(obj);
    },
    addOrUpdateAlbum: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').addOrUpdateAlbum(title, dispatchObj, dispatchEventName);
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
        var xml = require('ProjectManage').getPadcaseCurrentProjectXml();
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

        var projectJson = require('ProjectManage').getPhonecaseCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getWallartsSkuJson(projectJson);
        require('JsonProjectService').cloneProject(obj,oldTitle,title,projectJson,skuJson);
    },

    createProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var PrjConstructor = require('Prj');
        var Prj = PrjConstructor();
        var UtilParam = require('UtilParam');
        Prj.product = UtilParam.getUrlParam('product');
        Prj.deviceType = UtilParam.getUrlParam('deviceType');
        Prj.paper = UtilParam.getUrlParam('paper');
        Store.category=UtilParam.getUrlParam('category');
        Store.projectType="IPadCase";
        //var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        //currentCanvas.params.length=0;
        require("ImageController").deleteImage(0);
        Store.projectSettings.length=0;
        Store.projects.length=0;
        Store.imageList.length=0;
        Store.projectSettings.push(Prj);
        var xml = require('ProjectManage').getPadcaseInitProjectXml();
        Store.projectXml = xml;
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
        require('ProjectService').createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
    },
    getMyPhotoImages: function(obj,userId){
        require('ProjectService').getMyPhotoImages(obj,userId);
    },
    changeProjectTitle: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').changeProjectTitle(title, dispatchObj, dispatchEventName);
    }
}
