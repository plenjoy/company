// var been=require('beenjs');
module.exports = {
    loadLocalProject: function() {
        console.log('projectService');
        $.ajax({
            url: './assets/data/tshirt-project.1.0.xml',
            type: 'get',
            dataType: 'xml',
            async: false
        }).done(function(projectResult) {

            Store.xml = projectResult;

        });
    },
    insertProject: function(obj,xml) {
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
        Store.projectXml = xml;
        var encodeimage="";
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        var crossSell = Store.mainProjectUid ? 'cart' : '';
        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR"||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="IPadCase"){
            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
        }
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            data: { mainProjectUid:Store.mainProjectUid,crossSell:crossSell,removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey() ,isFromMarketplace : Store.isFromMarketplace, title: title,quantity: quantity }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                console.log('new project successfully' + result);
                Store.projectId = $(result).find('guid').text() || '';
                Store.projectXml = result;
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;
                Store.isNewInsertProject = true;
                // Store.isPrjSaved=true;
            } else {
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;
                if($(result).find('errorCode').text()==="-3"){
                    //obj.$dispatch('dispatchShowPopup', { type: 'save', status: -2});
                    obj.$dispatch('dispatchShowProjectChooseWindow');
                }

            };
        });
    },
    saveProject: function(obj, xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH,callback) {
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
        var encodeimage="";
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint"|| Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
        }

        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'xml',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity },
            error: function(result) {
                Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
            }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                Store.projectXml = result;
                if(callback && typeof callback==="function"){
                    callback();
                }else{
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                }
                require('trackerService')({ev: require('trackerConfig').SaveComplete});
                Store.isPrjSaved=true;

            }else if(result && $(result).find('resultData').attr('state') === 'fail'){

                if($(result).find('code').text()==="201"){
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
                    Store.vm.$broadcast('notifyCloseWindow');
                }else if($(result).find('code').text()==="202"){
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
                    Store.vm.$broadcast('notifyCloseWindow');
                }else if($(result).find('code').text()==="205"){
                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
                }else{
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
                }
            }else {
                // been.showMsg('Save failed.', 'fail', 'Message',null,null,'ok');
                obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
            };
        });
    },
    orderProject: function(obj,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH) {
        if(!Store.projectId){
            return;
        }
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
        var encodeimage="";
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        if(Store.projectType==="CV"||Store.projectType==="FM" || Store.projectType === "PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
        }
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'xml',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity },
            error: function(result) {
                Store.vm.$dispatch("dispatchShowPopup", { type : 'noInterenet', status : 0 });
            }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                console.log('save project successfully' + result);
                console.log('errorCode' + $(result).find('errorCode').text());
                Store.projectXml = result;
                Store.isPrjSaved=true;
                Store.isPopSave = false;
                window.location = '/' + Store.orderType + '/addShoppingCart.html?projectGUID=' + Store.projectId + '&quantity=' + quantity;
            }else if(result && $(result).find('resultData').attr('state') === 'fail'){
                if($(result).find('code').text()==="201"){
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
                    Store.vm.$broadcast('notifyCloseWindow');
                }else if($(result).find('code').text()==="205"){
                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
                }else{
                    obj.$dispatch("dispatchShowPopup", { type : 'order', status : -1});
                }
            }else {
                obj.$dispatch("dispatchShowPopup", { type : 'order', status : -1});
            };
        });
    },
    getShareProject:function(){

        var _this = this;
        $.ajax({
            url: Store.domains.uploadUrl + '/upload/Preview/GetPhotobookXmlByProjectId?projectId='+ encodeURIComponent(Store.projectId),
            type: 'get',
            dataType: 'xml',
            data: 'webClientId=1'
        }).done(function(result) {
            if (result) {
                //Store.projectXml = (new XMLSerializer()).serializeToString(result);
                Store.encProjectId = Store.projectId;
                Store.projectXml = result;
                Store.title = $(result).find('title').text();
                Store.projectId = $(result).find('guid').text();
                Store.projectSettings.length=0;
                for (var i = 0; i < $(result).find('spec').length; i++) {

                    var spec = $(result).find('spec').eq(i);

                    var PrjConstructor = require('Prj');
                    var Prj = PrjConstructor();

                    for (var j = 0; j < spec.find('option').length; j++) {
                        var option = spec.find('option').eq(j);
                        Prj[option.attr('id')]=option.attr('value');
                    };
                    // value fix for old flex project
                    if(Prj.category === 'categoryFrame' || Prj.category === 'categoryCanvas' || Prj.category === 'categoryWallarts') {
                      Prj.metalType = Prj.metalType || 'none';
                      Prj.finish = Prj.finish || 'none';
                    };
                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
                        Prj[setting.attr('id')]=setting.attr('value');
                    }
                    if($(result).find('frameBoard')){
                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
                    }
                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
                            Store.cardId = $(result).find('card').attr('id');
                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
                            Prj.trim= Prj.trim || $(result).find('trim').attr('value');
                    };
                    console.log(Prj);

                    Store.projectSettings.push(Prj);
                }



                _this.getAlbumId();
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;
            }
        });

    },
    getProject: function() {
        var _this = this;
        $.ajax({
            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/project/' + Store.projectId,
            type: 'get',
            dataType: 'xml',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {

                Store.projectXml = result;
                Store.title = $(result).find('title').text();
                Store.projectId = $(result).find('guid').text();
                Store.projectSettings.length=0;
                for (var i = 0; i < $(result).find('spec').length; i++) {

                    var spec = $(result).find('spec').eq(i);

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
                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
                        Prj[setting.attr('id')]=setting.attr('value');
                    }
                    if($(result).find('frameBoard')){
                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
                    }

                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
                            Store.cardId = $(result).find('card').attr('id');
                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
                            Prj.trim= Prj.trim ? Prj.trim : $(result).find('trim').attr('value');
                    };

                    console.log(Prj);

                    Store.projectSettings.push(Prj);
                }

                if(Store.projectType=="PR"){
                    if($(result).find('spec')&&$(result).find('spec').length>0){
                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
                        Store.baseProject.size=size;
                        Store.baseProject.paper=paper;
                    }else{
                        Store.baseProject.size='4X6';
                        Store.baseProject.paper='GP';
                    }
                }

                if(Store.projectType=="flushMountPrint"){
                    if($(result).find('spec')&&$(result).find('spec').length>0){
                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
                        var surfaceType=$(result).find('spec').eq(0).find('option[id="surfaceType"]').attr("value");
                        Store.baseProject.size=size;
                        Store.baseProject.paper=paper;
                        Store.baseProject.surfaceType=surfaceType;
                    }else{
                        Store.baseProject.size='4X6';
                        Store.baseProject.paper='GP';
                        Store.baseProject.surfaceType='SS';
                    }
                }

                _this.getAlbumId();
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;

                //console.log(require("ProjectManage").getFrameBorderAsset());
            }
        });


    },
    getAlbumId: function() {

        var _instance = this;

        $.ajax({
            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/getAlbumId?projectId=' + Store.projectId,
            type: 'get'
        }).done(function(aResult) {
            if (aResult && $(aResult).find('resultData').attr('state') === 'success') {
                Store.userSettings.albumId = $(aResult).find('albumId').text() || '';
            } else {
                Store.userSettings.albumId = '';
                _instance.addOrUpdateAlbum(Store.title);
            }
        });
    },
    addOrUpdateAlbum: function(title, obj, eventName) {
        var timestamp = (new Date()).valueOf();
        $.ajax({
            url: Store.domains.baseUrl + '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
            type: 'get',
            data: 'timestamp=' + timestamp + '&projectId=' + Store.projectId + '&albumName=' + title + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {
                if ($(result).find('resultData').attr('state') == 'success') {
                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
                    if (obj)
                        obj.$dispatch(eventName, false, 'This title already exists, please try again.');

                } else {

                    if (obj)
                        obj.$dispatch(eventName, true, 'This title already exists, please try again.');

                }
            }
        });
    },
    handledSaveProject: function(obj,eventName,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH) {
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + Store.projectType;
        var encodeimage="";
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        if(Store.projectType==="CV"||Store.projectType==="FM"||Store.projectType==="PHC"||Store.projectType==="CLO"||Store.projectType==="PR" ||Store.projectType==="flushMountPrint" || Store.projectType==="PP" || Store.projectType==="CR" || Store.projectType==="IPadCase"){
            encodeimage=this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
        }
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectId + '/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'xml',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title, quantity: quantity }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                console.log('save project successfully' + result);
                Store.projectXml = result;
                Store.isPrjSaved=true;
                //been.showMsg('Save success.', 'default', 'Message',null,null,'ok');
                obj.$dispatch(eventName,'success');

            } else {

                if($(result).find('code').text()==="205"){
                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
                }else{
                    obj.$dispatch(eventName,'failed');
                }
            };
        });
    },
    getProjectOrderedState: function(obj) {
        $.ajax({

            url: '/userid/' + Store.userSettings.userId + '/getProjectOrderedState/' + Store.projectId,
            type: 'get',
            dataType: 'xml',
            data: 'webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum()

        }).done(function(result) {
            if (result) {

                Store.userSettings.ordered = $(result).find('ordered').text()=="true"?true:false;
                Store.checkFailed=$(result).find('checkFailed').text()=="true"?true:false;
                Store.watches.isProjectOrderedStateLoaded = true;


                if (Store.userSettings.ordered == "true") {
                    //obj.$dispatch("dispatchShowPopup", { type : 'isOrder',status:-1});
                }
            };
        });
    },
    sentContactUs: function(obj,question, featureRequest, bug,os,browser) {

        $.ajax({
            url: Store.domains.baseUrl + '/userid/service/feedback',
            type: 'post',
            dataType: 'xml',
            data: {
                userId: Store.userSettings.userId,
                userName: Store.userSettings.userName,
                userEmail: Store.userSettings.email,
                sku: '',
                projectName: Store.title,
                projectId: Store.projectId,
                autoRandomNum: require('UtilMath').getRandomNum(),
                webClientId: 1,
                os: os,
                browser: browser,
                question: question,
                featureRequest: featureRequest,
                bug: bug
            }

        }).done(function(result) {
            if ($(result).find('resultData').attr('state') == 'success') {
                obj.$dispatch("dispatchShowPopup", { type : 'contact', status : 0})
            }else{
                obj.$dispatch("dispatchShowPopup", { type : 'contact', status : -1})
            }
        });
    },
    cloneProject:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
        var _this = this;
        var encodeimage = '';
        var timestamp = (new Date()).valueOf();
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        if(Store.projectType==="CV" || Store.projectType==="FM" || Store.projectType === "PHC" || Store.projectType==="IPadCase"){
            encodeimage=_this.getScreenshot().replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","");
        }
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                var successString = 'Clone and saved successfully';
                Store.projectId = $(result).find('guid').text() || '';
                Store.projectXml = result;
                Store.isPrjSaved=true;
                //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 , info:successString});
                Store.vm.$broadcast('notifyHideCloneWindow');
                require("ProjectService").getProjectInfo();

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
                            var errorString;
                            Store.title=oldTitle;
                            if(errorCode === "1"){
                                errorString= "Title existed, please pick another one.";
                            }else if(errorCode === "2"){
                                errorString = "Please input new project name";
                            }else{
                                errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
                            }
                            Store.vm.$broadcast('notifyShowInvalidTitle',errorString);
                            //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 ,info:errorString});

                        }
                    }

                });
            } else {
                var failedString = 'Clone failed';
                Store.title=oldTitle;
                Store.vm.$broadcast('notifyShowInvalidTitle',failedString);
                //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 , info:failedString});

            };
        });


    },
    getScreenshot:function(){
        return require("ScreenshotController").convertScreenshotToBase64();
    },
    getProjectInfo: function() {
        if(Store.isPreview && Store.source === 'factory') return;

        $.ajax({

            url: Store.domains.baseUrl +'/clientH5/projectInfo/' + Store.projectId + "?" + new Date().getTime(),
            type: 'get',
            dataType: 'json'

        }).done(function(result) {
            if (result) {
                Store.projectInfo.isOrdered=result.order===1?true:false;
                Store.projectInfo.isInCart=result.cart===1?true:false;
                if(result.market === 1 || result.market === 2){
                     Store.projectInfo.isInMarket=true;
                }else{
                    Store.projectInfo.isInMarket=false;
                }
                if((typeof result.market) !== "undefined"){
                    Store.isShowPostToSale=true;
                }
                Store.watches.isProjectInfoLoaded = true;
                Store.vm.$dispatch('dispatchResetProjectInfo');
            }
        });
    },

    updateCheckStatus: function(obj) {
        $.ajax({

            url: '/userid/'+Store.userSettings.userId+'/submitCheckFailProject/'+Store.projectId+'?isParentBook=false&redirectParentBook=false',
            type: 'get',
            dataType: 'xml'
        }).done(function(result) {
            if (result) {
                var code = $(result).find('code').text();
                if(code==="200"){
                    Store.checkFailed=false;
                    if(Store.submitTitle){

                        Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Thank you for submitting your changes to this ordered "+Store.submitTitle+" project. We will review this "+Store.submitTitle+" project again. If no issue is found, we will proceed with your order processing."});

                    }else{
                        Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Thank you for submitting your changes to this ordered frame project. We will review this frame project again. If no issue is found, we will proceed with your order processing."});
                    }
                }else{
                    Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"notifyShowInvalidTitle','Submit failed, please try again or contact us."});

                }

            };
        });
    },
    getPhotoPrice:function(product,options,idx){
        if(Store.isTopPriceShow) return;
        var isInclude = false;
        for (var i = 0; i < Store.priceOptions.length; i++) {
            var key = Store.priceOptions[i].key;
            var value = Store.priceOptions[i].value;
            if(key && key == options){
                isInclude = true;
                if(value){
                    Store.projectSettings[idx].price = value;
                }else{
                    var idxs = Store.priceOptions[i].idxs;
                    if(idxs.indexOf(idx) == -1){
                        Store.priceOptions[i].idxs.push(idx);
                    }
                }
            }
        }
        if(!isInclude){
            var option = {"key":options,"value":"",idxs:[idx]};
            Store.priceOptions.push(option);
        }else{
            return ;
        }

        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: { product : product,options : options,timestamp : Store.freshTimestamp || 0 },
            dataType : 'json'
        }).done(function(result){
            console.log("getPhotoPrice",options);
            if(result){
                if(result.couponId){
                    Store.projectSettings[idx].price = +result.sPrice;
                }else{
                    Store.projectSettings[idx].price = +result.oriPrice;
                }
                for (var i = 0; i < Store.priceOptions.length; i++) {
                    var key = Store.priceOptions[i].key;
                    var value = Store.priceOptions[i].value;
                    if(key && key == options){
                        for (var j = 0; j < Store.priceOptions[i].idxs.length; j++) {
                            Store.projectSettings[Store.priceOptions[i].idxs[j]].price = Store.projectSettings[idx].price;
                        }
                        Store.priceOptions[i].value = Store.projectSettings[idx].price;
                        Store.priceOptions[i].idxs = [];
                    }
                };
            }else{
                console.log(result.error);
            }
        });
    },
    getNewPrintPrice:function(){
        var optionIds = require('SpecManage').getOptionIds();
        var product = Store.baseProject.product;
        var options = [];

        if(!Store.isTopPriceShow) return;

        optionIds.forEach(function(optionId) {
            if(optionId !== 'product') {
                options.push(Store.baseProject[optionId]);
            }
        });

        options = options.filter(function(option) {
            return option && option !== 'none';
        });
        var _this = this;
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: { product : product, options : options.join(','), timestamp : Store.freshTimestamp || 0},
            dataType : 'json'
        }).done(function(result){
            console.log("getNewPrintPrice",options);
            if(result){
                Store.photoPrice.oriPrice = +result.oriPrice;
                Store.photoPrice.sPrice = +result.sPrice;
                Store.photoPrice.couponId = result.couponId || '';
                Store.photoPrice.options = result.options || {};
                Store.priceChange = true;
            }else{
                console.log(result.error);
            }
        });
    },
    getCanvasPrice:function(product,options,userId){
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: { product : product,options : options,userId : userId},
            dataType : 'json'
        }).done(function(result){
            console.log(result);
            if(result){
                Store.photoPrice.oriPrice = (result.oriPrice - 0).toFixed(2) - 0;
                Store.photoPrice.sPrice = (result.sPrice - 0).toFixed(2) - 0;
                Store.photoPrice.couponId = result.couponId || '';
                Store.photoPrice.options = result.options || {};

                Store.priceChange = true;
            }else{
                console.log(result.error);
            }
        })
    },
    getPadPrice:function(product,options,userId){
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: { product : product,options : options,userId : userId},
            dataType : 'json'
        }).done(function(result){
            console.log(result);
            if(result){
               if(typeof result.trialPrice !=='undefined'){
                    Store.photoPrice.trialPrice = +result.trialPrice;
                }else {
                    if(result.sPrice>0){
                        Store.photoPrice.trialPrice = +result.sPrice;
                    }
                }
                Store.photoPrice.oriPrice = +result.oriPrice;
                Store.priceChange = true;
            }else{
                console.log(result.error);
            }
        })
    },
    getPosterPrice:function(product,options,userId){
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: { product : product,options : options,userId : userId},
            dataType : 'json'
        }).done(function(result){
            console.log(result);
            if(result){
               /* if(typeof result.trialPrice !=='undefined'){
                    Store.photoPrice.trialPrice ="$ "+ (result.trialPrice-0).toFixed(2);
                }else {
                    if(result.sPrice>0){
                        Store.photoPrice.trialPrice ="$ "+ (result.sPrice-0).toFixed(2);
                    }
                }
                Store.photoPrice.oriPrice ="$ "+ result.oriPrice;
                Store.priceChange = true;*/
                Store.photoPrice.oriPrice = (result.oriPrice - 0).toFixed(2) - 0;
                Store.photoPrice.sPrice = (result.sPrice - 0).toFixed(2) - 0;
                Store.photoPrice.couponId = result.couponId || '';
                Store.photoPrice.options = result.options || {};

                Store.priceChange = true;
            }else{
                console.log(result.error);
            }
        })
    },
    getCardsPrice:function(product,options,quantity,rounded,userId){
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/book/price',
            type: 'get',
            data: {
                product : product,
                options : options
            },
            dataType : 'json'
        }).done(function(result){
            if(result){
                var mainPrice = result.data.main;
                var optionPrice = result.data.options;

                Store.photoPrice.oriPrice = +mainPrice.oriPrice;
                Store.photoPrice.sPrice = +mainPrice.sPrice;
                Store.photoPrice.couponId = mainPrice.couponId || '';
                Store.photoPrice.options = optionPrice || {};

                Store.priceChange = true;
            }else{
                console.log(result.error);
            }
        })
    },
    getLMCPrice: function(product, size, shape, options, userId) {
        $.ajax({
            url: Store.domains.baseUrl+'/clientH5/product/price',
            type: 'get',
            data: {
                product : product,
                options : options,
                userId : userId
            },
            dataType : 'json'
        }).done(function(result){
            if(result){
                Store.photoPrice.allSize.push({
                    size: size,
                    shape: shape,
                    oriPrice: result.oriPrice - 0,
                    sPrice: result.sPrice - 0
                });

                Store.priceChange = true;
            }else{
                console.log(result);
            }
        });
    },
    saveRemarkProject : function(successCallback,failedCallback){
        var xml = require('ProjectManage').getRemarkProjectXml();
        var url = Store.domains.portalBaseUrl + '/portal/h5-client/feedBackPrintsRemark.ep';
        $.ajax({
            url: url,
            type: 'post',
            data: { projectId : Store.projectId, remarkProjectXml : xml, orderNumber : Store.orderNumber,timestamp:Store.timestamp,token:Store.token,pUser:Store.pUser}
        }).done(function(result) {
            console.log(result);

            if(result && $(result).find('resultData').attr('state') === 'success'){
                successCallback && successCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
            }else{
                failedCallback && failedCallback();
                Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});

            }
        });
    },
    // saveNewPrintRemarkProject : function(successCallback,failedCallback){
    //     var projectJson = require('JsonProjectManage').getRemarkProjectXml();
    //     var url = Store.domains.portalBaseUrl + '/portal/h5-client/feedBackPrintsRemark.ep';
    //     $.ajax({
    //         url: url,
    //         type: 'post',
    //         data: { projectId : Store.projectId, remarkProjectXml : projectJson, orderNumber : Store.orderNumber,timestamp:Store.timestamp,token:Store.token,pUser:Store.pUser}
    //     }).done(function(result) {
    //         console.log(result);

    //         if(result && $(result).find('resultData').attr('state') === 'success'){
    //             successCallback && successCallback();
    //             Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Reprint successfully"});
    //         }else{
    //             failedCallback && failedCallback();
    //             Store.vm.$dispatch("dispatchShowPopup", { type : 'checkFailed', status : 0 ,info:"Failed to reprint, please try again later."});

    //         }
    //     });
    // },
    getPortalProject:function(){

        var _this = this;
        $.ajax({
            url: Store.domains.portalBaseUrl + '/portal/projectProcess/getProjectById.ep?projectId='+ encodeURIComponent(Store.projectId),
            type: 'get',
            dataType: 'xml'
        }).done(function(result) {
            if (result) {
                Store.encProjectId = Store.projectId;
                Store.projectXml = result;
                Store.title = $(result).find('title').text();
                Store.projectId = $(result).find('guid').text();
                Store.projectSettings.length=0;
                for (var i = 0; i < $(result).find('spec').length; i++) {

                    var spec = $(result).find('spec').eq(i);

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
                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
                        Prj[setting.attr('id')]=setting.attr('value');
                    }
                    if($(result).find('frameBoard')){
                        Prj.rotated=$(result).find('frameBoard').attr('rotated')==="true"?true:false;
                        Store.bgColor=parseInt($(result).find('frameBoard').attr('canvasBorderColor'));
                    }

                    console.log(Prj);

                    Store.projectSettings.push(Prj);
                }
                if(Store.projectType=="PR"){
                    if($(result).find('spec')&&$(result).find('spec').length>0){
                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
                        Store.baseProject.size=size;
                        Store.baseProject.paper=paper;
                    }else{
                        Store.baseProject.size='4X6';
                        Store.baseProject.paper='GP';
                    }
                }

                if(Store.projectType=="flushMountPrint"){
                    if($(result).find('spec')&&$(result).find('spec').length>0){
                        var size=$(result).find('spec').eq(0).find('option[id="size"]').attr("value");
                        var paper=$(result).find('spec').eq(0).find('option[id="paper"]').attr("value");
                        var surfaceType=$(result).find('spec').eq(0).find('option[id="surfaceType"]').attr("value");
                        Store.baseProject.size=size;
                        Store.baseProject.paper=paper;
                        Store.baseProject.surfaceType=surfaceType;
                    }else{
                        Store.baseProject.size='4X6';
                        Store.baseProject.paper='GP';
                        Store.baseProject.surfaceType='SS';
                    }
                }

                _this.getAlbumId();
                //require('CanvasController').initCanvasData();
                Store.watches.isProjectLoaded = true;
            }
        });

    },
    getProjectIdByTitle:function(title){
        var customerId=Store.userSettings.userId;
        $.ajax({
            url: Store.domains.baseUrl+'/userid/getProjectUidByTitleAndCid.ep?customerId='+customerId+'&title='+encodeURIComponent(title),
            type: 'get'
        }).done(function(result){
            if (result && $(result).find('resultData').attr('state') === 'success' ) {
                Store.projectId = $(result).find('projectId').text() || '';
                Store.vm.$dispatch("dispatchGetProjectIdByTitleSuccess");
            }
        });

    },
    createProject:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
        var _this = this;
        var encodeimage = '';
        var timestamp = (new Date()).valueOf();

        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                var successString = 'Create and saved successfully';
                Store.projectId = $(result).find('guid').text() || '';
                Store.projectXml = result;
                Store.watches.isProjectLoaded = true;
                Store.vm.$broadcast('notifyHideNewProjectWindow');

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
                            Store.errCode = false;
                            var errorString;
                            Store.title=oldTitle;
                            if(errorCode === "1"){
                                errorString= "Title existed, please pick another one.";
                            }else if(errorCode === "2"){
                                errorString = "Please input new project name";
                            }else{
                                errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
                            }
                            Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
                            //obj.$dispatch("dispatchShowPopup", { type : 'clone', status : 0 ,info:errorString});

                        }
                    }

                });
                require("ProjectService").getProjectInfo();
            } else {
                var failedString = 'Create failed';
                Store.title=oldTitle;
                Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',failedString);

            };
        });


    },
    createProjectAddOrUpdateAlbum: function(newTitle,oldTitle, success, failed) {
        var timestamp = (new Date()).valueOf();
        $.ajax({
            url: '/userid/' + Store.userSettings.userId + '/addOrUpdateAlbum',
            type: 'get',
            data: 'timestamp=' + timestamp + '&projectId=' + Store.projectId + '&albumName=' + newTitle + '&webClientId=' + Store.webClientId + '&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {
                if ($(result).find('resultData').attr('state') == 'success') {
                    Store.userSettings.albumId = $(result).find('albumId').text() || '';
                   success && success(newTitle);
                }
                else if($(result).find('resultData').attr('state') == 'fail'){
                    var errorCode = $(result).find('errorCode').text();
                    var errorString;
                    Store.title=oldTitle;
                    if(errorCode === "1"){
                        errorString= "Title existed, please pick another one.";
                    }else if(errorCode === "2"){
                        errorString = "Please input new project name";
                    }else{
                        errorString = "Save project name failed. errorInfo："+$(result).find('errorInfo').text();
                    }
                    Store.vm.$broadcast('notifyShowNewProjectInvalidTitle',errorString);
                   failed && failed(newTitle);

                }
            }
        });
    },
    createProjectSuccess:function(obj,oldTitle,newTitle,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH){
        var encodeimage = '';
        var url = Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + Store.projectType;
        var title = Store.title;
        var quantity = Store.quantity ?  Store.quantity : 1;
        Store.errCode = true;
        if(Store.projectType==="CV"||Store.projectType==="FM"){
            var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
            var product = currentProject.product;
            url=Store.domains.baseUrl + '/general/' + Store.userSettings.userId + '/project/' + product;
        }
        $.ajax({
            url: url,
            type: 'post',
            data: { removeCart:Store.fromCart,encodeimage:encodeimage,projectXml: xml, requestKey: require('UtilParam').getRequestKey(), isFromMarketplace : Store.isFromMarketplace,thumbnailPX: thumbnailPX, thumbnailPY: thumbnailPY, thumbnailPW: thumbnailPW, thumbnailPH: thumbnailPH,title: title,quantity: quantity}
        }).done(function(result) {
            if(result){
                if (result && $(result).find('resultData').attr('state') === 'success') {
                    var successString = 'Create and saved successfully';
                    Store.projectId = $(result).find('guid').text() || '';
                    Store.projectXml = result;
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
    getTitle: function() {
        var _this = this;
        var url = Store.domains.baseUrl +  '/web-api/customerId/' + Store.userSettings.userId + '/getProjectNameByProjectId';
        $.ajax({
            url: url,
            type: 'get',
            data: 'projectId=' + Store.projectId + '&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result){
            if(result){
                if(result.respCode === '200') {
                    Store.title = result.projectName;
                    _this.getAlbumId();
                }
            }
        })
    },
    changeProjectTitle: function(title,obj,eventName) {
        var url = Store.domains.baseUrl +  '/web-api/customerId/' + Store.userSettings.userId + '/updateProjectAndAlbumTitle';
        $.ajax({
            url: url,
            type: 'get',
            data: 'projectId=' + Store.projectId + '&projectName=' + title
        }).then(function(result){
            if(result){
                if(result.respCode === '200') {
                    // Store.title = title;
                    if (obj)
                        obj.$dispatch(eventName, false, 'This title already exists, please try again.');
                }else{
                    if (obj)
                        obj.$dispatch(eventName, true, 'This title already exists, please try again.');
                }
            }
        })
    },
    savePortalCardProject: function(obj,xml,callback) {
        Store.projectXml = xml;
        var timestamp = (new Date()).valueOf();
        var url = Store.domains.baseUrl +  '/card-template/save.ep';
        $.ajax({
            url: url,
            type: 'post',
            data: {projectXml: xml,autoRandomNum:timestamp,webClientId: 1 }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                Store.projectId = $(result).find('guid').text() || '';
                Store.projectXml = result;
                Store.watches.isProjectLoaded = true;
                if(callback && typeof callback==="function"){
                    callback();
                }else{
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                }
            } else {
                Store.watches.isProjectLoaded = true;
                if($(result).find('code').text()==="300"){
                    // obj.$dispatch('dispatchShowProjectChooseWindow');
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -5});
                }

            };
        });
    },
    getCardPortalProject: function() {
        var _this = this;
        $.ajax({
            url: Store.domains.baseUrl + '/card-template/get.ep',
            type: 'get',
            dataType: 'xml',
            data: 'initGuid='+Store.projectId+'&webClientId=1&autoRandomNum=' + require('UtilMath').getRandomNum()
        }).done(function(result) {
            if (result) {
                Store.projectXml = result;
                Store.title = $(result).find('title').text();
                Store.projectId = $(result).find('guid').text();
                Store.projectSettings.length=0;
                for (var i = 0; i < $(result).find('spec').length; i++) {
                    var spec = $(result).find('spec').eq(i);
                    var PrjConstructor = require('Prj');
                    var Prj = PrjConstructor();

                    for (var j = 0; j < spec.find('option').length; j++) {
                        var option = spec.find('option').eq(j);
                        Prj[option.attr('id')]=option.attr('value');
                        if(Prj[option.attr('id')]==="None"){
                            Prj[option.attr('id')]="none";
                        }
                    };
                    for (var k = 0; k < $(result).find('tshirtSetting').eq(i).find('setting').length; k++) {
                        var setting = $(result).find('tshirtSetting').eq(i).find('setting').eq(k);
                        Prj[setting.attr('id')]=setting.attr('value');
                    }
                     // 获取 project 时将 cardId 和 DeletedPhoto 初始化到 Store 中；
                    if(['FT','FD'].indexOf($(result).find('project').attr('productType') !== -1)){
                            Store.cardId = $(result).find('card').attr('id');
                            Store.deletedPhoto = $(result).find('deletedPhoto').text();
                            Prj.trim= Prj.trim ? Prj.trim : $(result).find('trim').attr('value');
                    };
                    Store.projectSettings.push(Prj);
                }
                _this.getAlbumId();
                Store.watches.isProjectLoaded = true;
            }
        });
    },
    submitPortalCardProject: function(obj, xml){
        var url = Store.domains.baseUrl + '/card-template/submit.ep';
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'xml',
            data: { encodeimage1:Store.encodeImage1,encodeimage2: Store.encodeImage2,projectXml: xml,webClientId:1 ,autoRandomNum:require('UtilMath').getRandomNum() }
        }).done(function(result) {
            if (result && $(result).find('resultData').attr('state') === 'success') {
                Store.projectXml = result;
                // if(callback && typeof callback==="function"){
                //     callback();
                // }else{
                //     obj.$dispatch('dispatchShowPopup', { type: 'save', status: 0});
                // }
                Store.isPrjSaved=true;
                Store.vm.$dispatch('dispatchShowPopup', { type: 'save', status: 1});

            }else if(result && $(result).find('resultData').attr('state') === 'fail'){

                if($(result).find('code').text()==="201"){
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -3});
                    Store.vm.$broadcast('notifyCloseWindow');
                }else if($(result).find('code').text()==="202"){
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -4});
                    Store.vm.$broadcast('notifyCloseWindow');
                }else if($(result).find('code').text()==="205"){
                    obj.$dispatch('dispatchShowPopup', { type: 'login', status: 0});
                }else{
                    obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
                }
            }else {
                // been.showMsg('Save failed.', 'fail', 'Message',null,null,'ok');
                obj.$dispatch('dispatchShowPopup', { type: 'save', status: -1});
            };
        });
    },
    getMainProject: function(obj, projectId,encImageId,shouldApplyImages){
        var url = Store.domains.baseUrl + '/clientH5/project/imageInfo';
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: { projectId:projectId,autoRandomNum:require('UtilMath').getRandomNum() }
        }).done(function(result) {
            if (result && result.errorCode === '1') {
                var sJson = '', sXml = '', imgId = '';

                try {
                    sJson = JSON.parse(result.data);
                } catch(e) {
                    sXml = require('UtilXML').stringToXml(result.data);
                }

                if(sXml) {
                    var imgCount = $(sXml).find('images').find('image').length;
                    Store.imageList = [];
                    if (imgCount > 0) {
                        for (var i = 0; i < imgCount; i++) {
                            var id=$(sXml).find('images').find('image').eq(i).attr('id');
                            var encId=$(sXml).find('images').find('image').eq(i).attr('encImgId') || '';
                            Store.imageList.push({
                                id: id,
                                guid: $(sXml).find('images').find('image').eq(i).attr('guid') || '',
                                // url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
                                encImgId: encId,
                                url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + $(sXml).find('images').find('image').eq(i).attr('encImgId') + '&rendersize=fit' + require('UtilParam').getSecurityString(),
                                name: decodeURIComponent($(sXml).find('images').find('image').eq(i).attr('name')) || '',
                                width: parseFloat($(sXml).find('images').find('image').eq(i).attr('width')) || 0,
                                height: parseFloat($(sXml).find('images').find('image').eq(i).attr('height')) || 0,
                                shotTime: $(sXml).find('images').find('image').eq(i).attr('shotTime') || '',
                                orientation: $(sXml).find('images').find('image').eq(i).attr('orientation') || 0,
                                usedCount: 0,
                                previewUrl: ''
                            });
                            if(encImageId&&encodeURIComponent(encImageId)===encId){
                                imgId=id;
                            }

                            require('UtilImage').getBlobImagePreviewUrl(i);
                        };
                    };
                } else if(sJson) {
                    var imgCount = sJson.length;
                    Store.imageList = [];
                    if (imgCount > 0) {
                        for (var i = 0; i < imgCount; i++) {
                            Store.imageList.push({
                                id: sJson[i].id.toString() || '',
                                guid: sJson[i].guid || '',
                                // url: asFn.getImageUrl($(sXml).find('images').find('image').eq(i).attr('id')),
                                encImgId: sJson[i].encImgId || '',
                                url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + sJson[i].encImgId + '&rendersize=fit' + require('UtilParam').getSecurityString(),
                                name: decodeURIComponent(sJson[i].name) || '',
                                width: parseFloat(sJson[i].width) || 0,
                                height: parseFloat(sJson[i].height) || 0,
                                shotTime: sJson[i].shotTime || '',
                                orientation: sJson[i].orientation || 0,
                                usedCount: 0,
                                previewUrl: ''
                            });
                            if(encImageId&&encodeURIComponent(encImageId)===sJson[i].encImgId){
                                imgId=sJson[i].id.toString();
                            }

                            require('UtilImage').getBlobImagePreviewUrl(i);
                        };
                    };
                }

                if(imgId){
                    obj.$dispatch('dispatchSingleImageUploadComplete',imgId);
                } else if(shouldApplyImages) {
                    Store.vm.$broadcast("notifyAddMyPhotosIntoPages", Store.imageList);
                }

            }else{

            }
        });
    },
    getMyPhotoImages: function(obj, userId, shouldApplyImages){
        var url = Store.domains.baseUrl + '/web-api/customer/getMyPhotosInfo';
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: { customerId:userId,autoRandomNum:require('UtilMath').getRandomNum() }
        }).done(function(result){
            if (result && result.errorCode === '1' && result.data) {
                var imageList = JSON.parse(result.data);
                var formedImageList = [];

                // 如果有最大图片限制
                if(Store.maxPageNum && imageList.length > Store.maxPageNum) {
                    imageList.length = Store.maxPageNum;
                }

                imageList.forEach(function(img) {
                    var newItem = {
                        id: String(img.id),
                        guid: img.guid,
                        encImgId: img.encImgId,
                        url: Store.domains.uploadUrl + '/upload/UploadServer/PicRender?qaulityLevel=0&puid=' + img.encImgId + '&rendersize=fit' + require('UtilParam').getSecurityString(),
                        name: img.name,
                        width: img.width,
                        height: img.height,
                        shotTime: img.shotTime,
                        orientation: !isNaN(+img.orientation) ? +img.orientation : 0,
                        previewUrl: '',
                        usedCount: 0
                    };
                    formedImageList.push(newItem);
                    Store.imageList.push(newItem);
                    require('UtilImage').getBlobImagePreviewUrl(Store.imageList.length - 1);
                });
                if(shouldApplyImages) {
                    Store.vm.$broadcast("notifyAddMyPhotosIntoPages", formedImageList);
                }
            }
        });
    },

    getTshirtDisableOptions: function() {
        var url = Store.domains.baseUrl + '/clientH5/getTshirtOffLine';
        var userId = Store.userSettings.userId;

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                customerId: userId,
                autoRandomNum: require('UtilMath').getRandomNum()
            }
        }).done(function(result) {
            if(result) {
                var disableArray = result.disable;
                var disableOptions = {};
                var allMeasures = ['S', 'M', 'L', 'XL', 'XXL'];

                // 整理disableArray数据，组装成disableOptions键值对数组
                disableArray.forEach(function(disableItem) {
                    var color = disableItem.color;
                    var value = disableItem.measure;

                    // 如果键值对选项不存在，就新建一个
                    if(!disableOptions[color]) {
                        disableOptions[color] = new Object();
                        disableOptions[color].options = new Array();
                        disableOptions[color].isAllDisabled = false;
                    }

                    disableOptions[color].options.push(value);

                    // 如果disableOptions的数量大于等于所有尺寸的数量，就附加该颜色全部禁止的标记
                    if(disableOptions[color].options.length >= allMeasures.length) {
                        disableOptions[color].isAllDisabled = true;
                    }
                });

                // 存储禁用尺寸，并且初始化第一件Tshirt，尺寸改为非禁用尺寸
                Store.disableOptions = disableOptions;
            }
            Store.watches.isDisableOptionLoaded = true;
        });
    },
    getLocalTshirtDisableOptions: function() {
        var url = './assets/data/disableTshirt.json';
        var userId = Store.userSettings.userId;

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                customerId: userId,
                autoRandomNum: require('UtilMath').getRandomNum()
            }
        }).done(function(result) {
            if(result) {
                var disableArray = result.disable;
                var disableOptions = {};
                var allMeasures = ['S', 'M', 'L', 'XL', 'XXL'];

                // 整理disableArray数据，组装成disableOptions键值对数组
                disableArray.forEach(function(disableItem) {
                    var color = disableItem.color;
                    var value = disableItem.measure;

                    // 如果键值对选项不存在，就新建一个
                    if(!disableOptions[color]) {
                        disableOptions[color] = new Object();
                        disableOptions[color].options = new Array();
                        disableOptions[color].isAllDisabled = false;
                    }

                    disableOptions[color].options.push(value);

                    // 如果disableOptions的数量大于等于所有尺寸的数量，就附加该颜色全部禁止的标记
                    if(disableOptions[color].options.length >= allMeasures.length) {
                        disableOptions[color].isAllDisabled = true;
                    }
                });

                // 存储禁用尺寸，并且初始化第一件Tshirt，尺寸改为非禁用尺寸
                Store.disableOptions = disableOptions;
                Store.watches.isDisableOptionLoaded = true;
            }
        });
    },

  deleteImageList:function(callback){
     var urlAlbumId = Store.userSettings.albumId;
     var url = Store.domains.baseUrl + '/web-api/album/deleteImages'
     if(Store.deleImagelist && Store.deleImagelist.length >0){
         $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: {

                     data: JSON.stringify({
                       albumId: urlAlbumId,
                       images: Store.deleImagelist
                    })
            }
        }).done(
           function(res){
              Store.deleImagelist=[],
              callback && callback()
           }
        )
     }else{
         callback && callback()
     }

  }


}
