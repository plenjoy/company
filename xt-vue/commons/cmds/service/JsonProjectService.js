module.exports ={
    insertProject: function(obj,projectJson,skuJson) {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
        var product = currentProject.product;
        var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' + product;
        var projectJson = JSON.stringify(projectJson);
        var title = Store.title;
        var crossSell = Store.mainProjectUid ? 'cart' : '';
        var skuJson = JSON.stringify(skuJson);
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { projectJson: projectJson,skuJson: skuJson,crossSell:crossSell,mainProjectUid:Store.mainProjectUid,removeCart:Store.fromCart,isFromMarketplace : Store.isFromMarketplace, requestKey: require('UtilParam').getJSONRequestKey(), title: title }
        }).done(function(result) {
            if (result && result.errorCode == '200') {
                console.log('new project successfully' + result);
                Store.projectId = result.data.guid || require('UtilParam').getUrlParam("initGuid") || '';
                // window.history.replaceState({}, 'LittleRoundBlock', '?initGuid=' + result.data.guid + '&webClientId=1');
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;
                Store.isNewInsertProject = true;
                // Store.isPrjSaved=true;
            } else {
                //require('CanvasController').initCanvasData();
                if(result.errorCode == "-103"){
                  setTimeout(function(){obj.$dispatch('dispatchShowProjectChooseWindow');});
                }
            };
        });
    },
    saveProject: function(obj,projectJson,skuJson,callback) {
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
      var product = currentProject.product;
      var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' +　Store.projectId　+ '/' + product;
      var title = Store.title;
      var projectString = JSON.stringify(projectJson);
      var skuString = JSON.stringify(skuJson);
      var _this = this;

      $.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          error:function(XMLHttpRequest, textStatus, errorThrown) {
            obj.$dispatch('dispatchShowPopup', { type: 'save', status: -6});
            Store.isProjectSavePending = false;
          },
          data: { projectJson: projectString,skuJson: skuString,removeCart:Store.fromCart, requestKey: require('UtilParam').getJSONRequestKey(), isFromMarketplace : Store.isFromMarketplace,title: title }
      }).done(function(result) {
          if (result && result.errorCode == '200') {
              Store.projectJson = projectJson;
              _this.uploadCoverImage(obj, callback);
              // if(callback && typeof callback==="function"){
              //     callback();
              // }else{
              //     obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
              // }
              Store.isPrjSaved=true;
              Store.isProjectSavePending = false;
          }else if(result){
           if(result.errorCode=="-108"){
              obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
              Store.vm.$broadcast('notifyCloseWindow');
            }else if(result.errorCode=="-111"){
              obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
            }else{
              obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
            }
            Store.isPageLoadingShow = false;
            Store.isProjectSavePending = false;
          }else {
            obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
        };
      });
    },
    saveProjectOnly: function(obj,projectJson,skuJson){
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
      var product = currentProject.product;
      var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' +　Store.projectId　+ '/' + product;
      var title = Store.title;
      var projectString = JSON.stringify(projectJson);
      var skuString = JSON.stringify(skuJson);
      var _this = this;

      $.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          data: { projectJson: projectString,skuJson: skuString,removeCart:Store.fromCart, requestKey: require('UtilParam').getJSONRequestKey(), isFromMarketplace : Store.isFromMarketplace,title: title }
      }).done(function(result) {
          if (result && result.errorCode == '200') {
              Store.projectJson = projectJson;
              Store.isPrjSaved=true;
              Store.isProjectSavePending = false;

              setTimeout(function() {
                _this.uploadCoverImage(obj, function(){});
              }, 500);
          }
      });
    },
    handledSaveProject: function(obj,projectJson,skuJson,eventName) {
      var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
      var product = currentProject.product;
      var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' +　Store.projectId　+ '/' + product;
      var title = Store.title;
      var projectString = JSON.stringify(projectJson);
      var skuString = JSON.stringify(skuJson);
      var _this = this;

      $.ajax({
          url: url,
          type: 'post',
          dataType: 'json',
          error:function(XMLHttpRequest, textStatus, errorThrown) {
            obj.$dispatch('dispatchShowPopup', { type: 'save', status: -6});
            Store.isProjectSavePending = false;
          },
          data: { projectJson: projectString,skuJson: skuString,removeCart:Store.fromCart, requestKey: require('UtilParam').getJSONRequestKey(), isFromMarketplace : Store.isFromMarketplace,title: title }
      }).done(function(result) {
          if (result && result.errorCode == '200') {
              Store.projectJson = projectJson;
              Store.isPrjSaved=true;
              _this.uploadCoverImage(null, function(){
                obj.$dispatch(eventName,'success');
              });
          }else if(result){
            if(result.errorCode=="-108"){
              obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
              Store.vm.$broadcast('notifyCloseWindow');
            }else if(result.errorCode=="-111"){
              obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
            }else{
              obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
            }
          };
      });
    },
    getShareProject:function(){

        var _this = this;
        $.ajax({
            url: Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId),
            type: 'get',
            dataType: 'json',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {
                Store.encProjectId = Store.projectId;
                Store.projectJson = result;
                Store.projectId = result.project.guid || require('UtilParam').getUrlParam("initGuid") || '';
                Store.createdDate = result.project.createdDate;
                Store.projectSettings.length=0;
                var PrjConstructor = require('Prj');
                var Prj = PrjConstructor();
                var spec = result.project.spec;
                var specKeys = Object.keys(spec);
                for (var i = 0; i < specKeys.length; i++) {
                  var itemKey = specKeys[i];
                  Prj[itemKey]=spec[itemKey];
                }
                Prj.rotated = Prj.orientation === 'Landscape' ? true : false;
                Store.projectSettings.push(Prj);
                Store.watches.isProjectLoaded = true;
            }
        });

    },
    getProject: function() {
        var _this = this;
        $.ajax({
            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId,
            type: 'get',
            dataType: 'json',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {
                Store.projectJson = result;
                Store.projectId = result.project.guid || require('UtilParam').getUrlParam("initGuid");
                Store.createdDate = result.project.createdDate;
                Store.projectSettings.length=0;
                var PrjConstructor = require('Prj');
                var Prj = PrjConstructor();
                var spec = result.project.spec;
                var specKeys = Object.keys(spec);
                for (var i = 0; i < specKeys.length; i++) {
                  var itemKey = specKeys[i];
                  Prj[itemKey]=spec[itemKey];
                }
                Prj.rotated = Prj.orientation === 'Landscape' ? true : false;
                Store.projectSettings.push(Prj);
                Store.watches.isProjectLoaded = true;
            }
        });
    },
    uploadCoverImage: function(obj, callback) {
        var project = Store.projectJson.project;
        var encodeimage = '';

        if(project.pages.length === 0) {
            encodeimage = Store.emptyImage;
        } else {
            encodeimage = require('ProjectService').getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
            Store.beforeUpgradeScreenshot = encodeimage;
        }

        var url = Store.domains.uploadUrl + '/upload/servlet/UploadCoverImgServlet';
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
        var product = currentProject.product;
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'text',
            data: {
                projectid: Store.projectId,
                encodeimage: encodeimage,
                projectType: product,
                webClientId: 1,
                autoRandomNum: require('UtilMath').getRandomNum(),
                customerId: Store.userSettings.userId,
                token: Store.userSettings.token,
                timestamp: Store.userSettings.uploadTimestamp
            }
        }).done(function(result) {
          if(callback && typeof callback==="function"){
              callback();
          }else{
              obj && obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
          }
        });
    },
    cloneProject:function(obj,oldTitle,newTitle,projectJson,skuJson){
        var _this = this;
        var timestamp = (new Date()).valueOf();

        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
        var product = currentProject.product;
        var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' + product;
        var title = Store.title;
        var crossSell = Store.mainProjectUid ? 'cart' : '';
        var projectString = JSON.stringify(projectJson);
        var skuString = JSON.stringify(skuJson);
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { projectJson: projectString,skuJson: skuString,crossSell:crossSell,mainProjectUid:Store.mainProjectUid,removeCart:Store.fromCart,isFromMarketplace : Store.isFromMarketplace, requestKey: require('UtilParam').getJSONRequestKey(), title: title }
        }).done(function(result) {
            if (result && result.errorCode == '200') {
               Store.projectId = result.data.guid || require('UtilParam').getUrlParam("initGuid") || '';
               Store.isPrjSaved=true;
               Store.vm.$broadcast('notifyHideCloneWindow');

               $.ajax({
                   url: '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
                   type: 'get',
                   data: 'timestamp=' + timestamp + '&projectId=' + Store.projectId + '&albumName=' + newTitle + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + require('UtilMath').getRandomNum()
               }).done(function(result) {
                   if (result) {
                       if ($(result).find('resultData').attr('state') == 'success') {
                           Store.userSettings.albumId = $(result).find('albumId').text() || '';

                       }else if($(result).find('resultData').attr('state') == 'fail'){
                           var errorCode = $(result).find('errorCode').text();
                           var code = $(result).find('code').text();
                           var errorString;
                           Store.title=oldTitle;
                           if(errorCode === "1"){
                               errorString= "Title existed, please pick another one.";
                           }else if(code === "2"){
                               Store.vm.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
                           }else{
                               errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
                           }
                           Store.vm.$broadcast('notifyShowInvalidTitle',errorString);
                       }
                   }
               });

               require('ProjectService').getProjectOrderedState(obj);
               require("ProjectService").getProjectInfo();
               _this.uploadCoverImage(obj);

               var url = window.location.href;
               var prefix = url.split('index.html?')[0];
               window.history.pushState({}, '', prefix + 'index.html?initGuid=' + Store.projectId + '&webClientId=1');
            } else {
                var failedString = 'Clone failed';
                Store.title=oldTitle;
                Store.vm.$broadcast('notifyShowInvalidTitle',failedString);
            };
        });

    },
    createProjectSuccess:function(obj,oldTitle,newTitle,projectJson,skuJson){
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex] || Store.baseProject;
        var product = currentProject.product;
        var url = Store.domains.baseUrl + '/general/json/' + Store.userSettings.userId + '/project/' + product;
        var title = Store.title;
        var crossSell = Store.mainProjectUid ? 'cart' : '';
        var projectString = JSON.stringify(projectJson);
        var skuString = JSON.stringify(skuJson);
        Store.errCode = true;
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { projectJson: projectString,skuJson: skuString,crossSell:crossSell,mainProjectUid:Store.mainProjectUid,removeCart:Store.fromCart,isFromMarketplace : Store.isFromMarketplace, requestKey: require('UtilParam').getJSONRequestKey(), title: title }
        }).done(function(result) {
            if(result){
                if (result && result.errorCode == '200') {
                    var successString = 'Create and saved successfully';
                    Store.projectId = result.data.guid || require('UtilParam').getUrlParam("initGuid") || '';
                    Store.watches.isProjectLoaded = true;
                    Store.vm.$broadcast('notifyHideNewProjectWindow');
                    require("ProjectService").getProjectInfo();
                } else {
                    var failedString = 'Create failed';
                    Store.title=oldTitle;
                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',failedString);
                };
            }
        });
    },
    getNewPrintProject:function(projectType){
        var _this = this;

        switch(projectType) {
            case 'Share':
                url = Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'Portal':
                url = Store.domains.portalBaseUrl + '/portal/projectProcess/getProjectById.ep?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'Local':
                url = './assets/data/project.json';
                dataType = undefined;
                break;
            case 'OldProject':
            default:
                url = Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId;
                break;
        }

        $.ajax({
            url: url,
            type: 'get',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum(),
            complete: function(res) {
                var isJSON = require('UtilJSON').isJSON(res.responseText);
                var result = {};
                var canBeRemark = true;
                Store.encProjectId = Store.projectId;

                if(isJSON) {
                    result = JSON.parse(res.responseText);
                    Store.projectJson = result;
                } else {
                    var xml = require('UtilXML').stringToXml(res.responseText);

                    // AR和LPR项目没有ID，因此无法被remake
                    canBeRemark = $(xml).find('content').eq(0).attr('id');

                    result = require('ProjectController').transformProjectXmlToJson(xml);
                    Store.projectJson = result;
                }

                Store.encProjectId = Store.projectId;
                Store.projectId = result.project.guid || require('UtilParam').getUrlParam("initGuid") || '';
                Store.createdDate = result.project.createdDate;
                Store.projectSettings.length = [];

                // 如果是用户打开项目 或者 是remake界面并且能够被remake的情况下，进行render页面
                if(!Store.isRemark || (Store.isRemark && canBeRemark)) {
                    Store.watches.isProjectLoaded = true;
                } else {
                    alert('This project cannot be remaked by user. Please connect engineer to remake.');
                }
            }
        });
    },

    saveRemarkProject : function(successCallback,failedCallback){
        var remarkProjectJson = require('JsonProjectManage').getNewPrintRemarkProject();
        var remarkSkuJson = require('JsonProjectManage').getNewPrintSkuJson(remarkProjectJson);
        var url = Store.domains.portalBaseUrl + '/portal/h5-client/newPrintsRemake.ep';
        $.ajax({
            url: url,
            type: 'post',
            data: {
                projectId: Store.projectId,
                remarkProjectJson: JSON.stringify(remarkSkuJson),
                orderNumber: Store.orderNumber,
                timestamp:Store.timestamp,
                token:Store.token,
                pUser:Store.pUser
            },
            statusCode: {
                '504': function() {
                    Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Response timeout."});
                }
            },
            error: function(result) {
                console.log(result)
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"An Error has happened, please connect with engineer and check the status."});
            }
        }).done(function(result) {
            console.log(result);

            if(result && result.status === 'success'){
                successCallback && successCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
            }else{
                failedCallback && failedCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});
            }
        });
    },
    getWallartsProject:function(projectType){
        var _this = this;

        switch(projectType) {
            case 'Share':
                url = Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'Portal':
                url = Store.domains.portalBaseUrl + '/portal/projectProcess/getProjectById.ep?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'OldProject':
            default:
                url = Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId;
                break;
        }

        $.ajax({
            url: url,
            type: 'get',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum(),
            complete: function(res) {
                var isJSON = require('UtilJSON').isJSON(res.responseText);
                var result = {};
                var canBeRemark = true;
                Store.projectSettings.length = [];
                Store.encProjectId = Store.projectId;
                if(isJSON) {
                    result = JSON.parse(res.responseText);
                    Store.projectJson = result;
                    var baseProject = Store.projectJson.project.summary.defaultSetting;
                    var optionIds = require('SpecManage').getOptionIds();
                    var settings = {};
                    optionIds.forEach(function(optionId) {
                        settings[optionId] = baseProject[optionId] || require('SpecManage').getOptionsMapDefaultValue(optionId, [{"key":"product","value":baseProject.product}]);
                    });
                    settings.rotated = (baseProject['orientation'] == 'Landscape' ) ? true : false ;
                    Store.projectSettings.push(settings);
                    Store.projectId = result.project.guid || require('UtilParam').getUrlParam("initGuid") || '';
                    Store.createdDate = result.project.createdDate;

                } else {
                    var xml = require('UtilXML').stringToXml(res.responseText);

                   /* result = require('ProjectController').transformProjectXmlToJson(xml);
                    Store.projectJson = result;*/
                    Store.title = $(xml).find('title').text();
                    Store.projectId = $(xml).find('guid').text();
                    Store.projectXml = xml;
                    for (var i = 0; i < $(xml).find('spec').length; i++) {

                        var spec = $(xml).find('spec').eq(i);

                        var PrjConstructor = require('Prj');
                        var Prj = PrjConstructor();

                        for (var j = 0; j < spec.find('option').length; j++) {
                            var option = spec.find('option').eq(j);
                            Prj[option.attr('id')]=option.attr('value');
                            if(Prj[option.attr('id')]==="None"){
                                Prj[option.attr('id')]="none";
                            }
                        };
                        // value fix for old flex project
                        if(Prj.category === 'categoryFrame' || Prj.category === 'categoryCanvas' || Prj.category === 'categoryWallarts') {
                          Prj.metalType = Prj.metalType || 'none';
                          Prj.metalType === 'undefined'? Prj.metalType = 'none': Prj.metalType;
                          Prj.finish = Prj.finish || 'none';
                          Prj.finish === 'undefined'? Prj.finish = 'none': Prj.finish;
                        };

                        if($(xml).find('frameBoard')){
                            Prj.rotated=$(xml).find('frameBoard').attr('rotated')==="true"?true:false;
                            Store.bgColor=parseInt($(xml).find('frameBoard').attr('canvasBorderColor'));
                        }

                        Store.projectSettings.push(Prj);
                    }
                }

                Store.watches.isProjectLoaded = true;
            }
        });
    },


     getPhonecaseProject:function(projectType){
        var _this = this;

        switch(projectType) {
            case 'Share':
                url = Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'Portal':
                url = Store.domains.portalBaseUrl + '/portal/projectProcess/getProjectById.ep?projectId='+ encodeURIComponent(Store.projectId);
                break;
            case 'OldProject':
            default:
                url = Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId;
                break;
        }

        $.ajax({
            url: url,
            type: 'get',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum(),
            complete: function(res) {
                var isJSON = require('UtilJSON').isJSON(res.responseText);
                var result = {};
                var canBeRemark = true;
                Store.projectSettings.length = [];
                Store.encProjectId = Store.projectId;
                if(isJSON) {
                    result = JSON.parse(res.responseText);
                    Store.projectJson = result;
                    var baseProject = Store.projectJson.project.summary.defaultSetting;
                    var optionIds = require('SpecManage').getOptionIds();
                    var settings = {};
                    optionIds.forEach(function(optionId) {
                        settings[optionId] = baseProject[optionId] || require('SpecManage').getOptionsMapDefaultValue(optionId, [{"key":"product","value":baseProject.product}]);
                    });
                    Store.projectSettings.push(settings);
                    Store.projectId = result.project.guid || require('UtilParam').getUrlParam("initGuid") || Store.projectId || '';
                    Store.createdDate = result.project.createdDate;

                } else {
                    var xml = require('UtilXML').stringToXml(res.responseText);

                    Store.title = $(xml).find('title').text();
                    Store.projectId = $(xml).find('guid').text();
                    Store.projectXml = xml;
                    for (var i = 0; i < $(xml).find('spec').length; i++) {

                        var spec = $(xml).find('spec').eq(i);

                        var PrjConstructor = require('Prj');
                        var Prj = PrjConstructor();

                        for (var j = 0; j < spec.find('option').length; j++) {
                            var option = spec.find('option').eq(j);
                            Prj[option.attr('id')]=option.attr('value');
                            if(Prj[option.attr('id')]==="None"){
                                Prj[option.attr('id')]="none";
                            }
                        };

                        Store.projectSettings.push(Prj);
                    }
                }

                Store.watches.isProjectLoaded = true;
            }
        });
    }
}
