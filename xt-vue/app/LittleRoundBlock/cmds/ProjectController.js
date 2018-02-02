module.exports = {
    initProjectXml: function() {
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        console.log(specData);
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var xml = '<project clientId="web-h5" createAuthor="web-h5|1.0|1">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan/>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate/>' +
            '<updatedDate></updatedDate>' +
            '<tshirts>' +
            '<tshirt id="tshirt-1">' +
            '<spec version="1.0">' +
            '<option id="product" value="' + Store.projectSettings[Store.currentSelectProjectIndex].product + '" />' +
            '<option id="color" value="' + Store.projectSettings[Store.currentSelectProjectIndex].color + '" />' +
            '<option id="size" value="' + Store.projectSettings[Store.currentSelectProjectIndex].size + '" />' +
            '<option id="measure" value="' + Store.projectSettings[Store.currentSelectProjectIndex].measure + '" />' +
            '</spec>' +
            '<tshirtSetting>' +
            '<setting id="count" value="1" />' +
            '<setting id="pages" value="true,false"/>'+
            '</tshirtSetting>' +
            '<contents>' +
            '<content type="front" width="' + base.width + '" hight="' + base.height + '">' +
            '<elements>' +
                '<element type="PhotoElement" elType="image" x="0" y="0" width="' + base.width + '" height="' + base.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +
            /*'<element type="LogoElement"  elType="logo" x="' + logo.x + '" y="' + logo.y + '" width="' + logo.width + '" height="' + logo.height + '" px="' + logo.x / base.width + '" py="' + logo.y / base.height + '" pw="' + logo.width / base.width + '" ph="' + logo.height / base.height + '" rot="0" dep="1" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
            '</elements>' +
            '</content>' +
            '<content type="back" width="' + base.width + '" hight="' + base.height + '">' +
            '<elements>' +
            /*'<element type="PhotoElement" elType="image" x="0" y="0" width="' + base.width + '" height="' + base.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
            '</elements>' +
            '</content>' +
            '</contents>' +
            '</tshirt>' +
            '</tshirts>' +
            '<images/>' +
            '</project>';
        return xml;
    },
    getCurrentProjectXml: function() {
        require("CanvasController").syncProjectData();
        console.log(Store.currentSelectProjectIndex);
        console.log(Store.projectSettings[Store.currentSelectProjectIndex].product);
        console.log(Store.projectSettings[Store.currentSelectProjectIndex].size);
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        console.log(specData);
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var xml = '<project clientId="web-h5" createAuthor="web-h5|1.0|1">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan/>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate/>' +
            '<updatedDate></updatedDate>' +
            '<tshirts>';

        var projects = Store.projectSettings;
        for (var i = 0; i < projects.length; i++) {
            var projectItem = projects[i];
            xml += '<tshirt id="tshirt-' + i + '">' +
                '<spec version="1.0">' +
                '<option id="product" value="' + projectItem.product + '" />' +
                '<option id="color" value="' + projectItem.color + '" />' +
                '<option id="size" value="' + projectItem.size + '" />' +
                '<option id="measure" value="' + projectItem.measure + '" />' +
                '</spec>' +
                '<tshirtSetting>' +
                '<setting id="count" value="' + projectItem.count + '" />';
            var hasFront=false;
            var frontPage=Store.projects[i].pages[0];
            for (var u = 0; u < frontPage.canvas.params.length; u++) {
                //if (backPage.canvas.elements[u] != undefined) {
                    var ele = frontPage.canvas.params[u];
                    if (ele.elType === 'logo' || ele.elType === 'image') {
                        if(ele.imageId!=""){
                            hasFront=true;
                        }
                    }else if(ele.elType === 'text'){
                        hasFront=true;
                    }
                //}
            }
            var hasBack=false;
            var backPage=Store.projects[i].pages[1];
            for (var u = 0; u < backPage.canvas.params.length; u++) {
                //if (backPage.canvas.elements[u] != undefined) {
                    var ele = backPage.canvas.params[u];
                    if (ele.elType === 'logo' || ele.elType === 'image') {
                        if(ele.imageId!=""){
                            hasBack=true;
                        }
                    }else if(ele.elType === 'text'){
                        hasBack=true;
                    }
                //}
            }
            xml += '<setting id="pages" value="' + hasFront + ','+hasBack+'" />';
            xml +='</tshirtSetting>' +
                '<contents>';
            var pages = Store.projects[i].pages;
            for (var k = 0; k < pages.length; k++) {
                var type = (k === 0) ? 'front' : 'back';
                xml += '<content type="' + type + '" width="' + base.width + '" hight="' + base.height + '">';
                var content = pages[k].canvas;
                xml += '<elements>';
                for (var j = 0; j < content.params.length; j++) {

                    //if (content.elements[j] == undefined) {
                        console.log('spread which not inited');
                        var el = content.params[j];

                        var W = el.width,
                            H = el.height,
                            OX = el.x,
                            OY = el.y;

                        var px = OX / content.oriWidth,
                            py = OY / content.oriHeight,
                            pw = W / content.oriWidth,
                            ph = H / content.oriHeight,
                            rot = el.rotate;

                        if (content.params[j].elType === 'logo' || content.params[j].elType === 'image') {
                            var cropPX = el.cropPX,
                                cropPY = el.cropPY,
                                cropPW = el.cropPW,
                                cropPH = el.cropPH;

                            cropPX < 0 ? cropPX = 0 : cropPX;
                            cropPX > 1 ? cropPX = 1 : cropPX;
                            cropPY < 0 ? cropPY = 0 : cropPY;
                            cropPY > 1 ? cropPY = 1 : cropPY;
                            cropPW < 0 ? cropPW = 0 : cropPW;
                            cropPW > 1 ? cropPW = 1 : cropPW;
                            cropPH < 0 ? cropPH = 0 : cropPH;
                            cropPH > 1 ? cropPH = 1 : cropPH;
                        };

                   /* } else {
                        var el = content.elements[j],
                            transEl = content.trans[j],
                            ratio = content.ratio;

                        var wDot = transEl.attrs.size.x * transEl.attrs.scale.x,
                            hDot = transEl.attrs.size.y * transEl.attrs.scale.y,
                            W = wDot / ratio,
                            H = hDot / ratio,
                            OX = (transEl.attrs.x + transEl.attrs.translate.x - (wDot - transEl.attrs.size.x) / 2) / ratio,
                            OY = (transEl.attrs.y + transEl.attrs.translate.y - (hDot - transEl.attrs.size.y) / 2) / ratio,
                            rot = transEl.attrs.rotate || 0;


                        var px = OX / content.oriWidth,
                            py = OY / content.oriHeight,
                            pw = W / content.oriWidth,
                            ph = H / content.oriHeight;

                        if (content.params[j].elType === 'logo' || content.params[j].elType === 'image') {
                            if (Math.abs(el.imageRotate) === 90) {
                                // special rotate
                                var cWidth = el.imageHeight,
                                    cHeight = el.imageWidth;
                            } else {
                                var cWidth = el.imageWidth,
                                    cHeight = el.imageHeight;
                            };

                            var cropPX = el.cropX / cWidth,
                                cropPY = el.cropY / cHeight,
                                cropPW = el.cropW / cWidth,
                                cropPH = el.cropH / cHeight;

                            if (cWidth === '' || cHeight === '') {
                                cropPX = 0;
                                cropPY = 0;
                                cropPW = 1;
                                cropPH = 1;
                            };

                            cropPX < 0 ? cropPX = 0 : cropPX;
                            cropPX > 1 ? cropPX = 1 : cropPX;
                            cropPY < 0 ? cropPY = 0 : cropPY;
                            cropPY > 1 ? cropPY = 1 : cropPY;
                            cropPW < 0 ? cropPW = 0 : cropPW;
                            cropPW > 1 ? cropPW = 1 : cropPW;
                            cropPH < 0 ? cropPH = 0 : cropPH;
                            cropPH > 1 ? cropPH = 1 : cropPH;
                        };
                    }*/



                    if (content.params[j].elType === 'text') {

                        xml += '<element type="TextElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" color="' + el.fontColor + '" fontSize="' + parseFloat(el.fontSize) / content.oriHeight + '" fontFamily="' + encodeURIComponent(el.fontFamily) + '" fontWeight="' + el.fontWeight + '" textAlign="' + el.textAlign + '" >' + encodeURIComponent(el.text) + '</element>';
                    } else if (content.params[j].elType === 'logo') {
                        xml += '<element type="LogoElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" imageid="' + el.imageId + '" imgRot="' + (el.imageRotate || 0) + '" imgFlip="false" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"/>';

                    } else {
                        // image element
                        xml += '<element type="PhotoElement" elType="' + el.elType + '" x="' + OX + '" y="' + OY + '" width="' + W + '" height="' + H + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + el.dep + '" imageid="' + el.imageId + '" imgRot="' + (el.imageRotate || 0) + '" imgFlip="false" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"/>';
                    };

                }
                xml += '</elements>';
                xml += '</content>';

            }


            xml += '</contents>' +
                '</tshirt>';
        }
        xml += '</tshirts>' +
            '<images>';
            for(i = 0; i < Store.imageList.length; i++) {
                    xml += '<image id="'+ Store.imageList[i].id +'" guid="'+ Store.imageList[i].guid +'" encImgId="'+ Store.imageList[i].encImgId +'" order="'+ i +'" name="'+ Store.imageList[i].name +'" width="'+ Store.imageList[i].width +'" height="'+ Store.imageList[i].height +'" shotTime="'+ Store.imageList[i].shotTime +'"/>';
                };
        xml +='</images>'+
            '</project>';
        return xml;
    },
    saveNewProject: function(obj) {
        // var xml = require('ProjectManage').getWallArtsInitProjectXml();
        var projectJson = require('./ProjectManage').initProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        Store.createdDate = require('UtilDateFormat').formatDateTime(new Date());
        // Store.projectXml = xml;
        Store.projectJson = projectJson;
        /*Store.watches.isProjectLoaded = true;
        Store.isNewInsertProject = true;*/
        require('JsonProjectService').insertProject(obj,projectJson,skuJson);
    },
    saveOldProject: function(obj,callback) {
        var projectJson = require('./ProjectManage').getCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        if(callback && typeof callback==="function"){
            require('JsonProjectService').saveProject(obj,projectJson,skuJson,callback);
        }else{
            require('JsonProjectService').saveProject(obj,projectJson,skuJson);
        }
    },
    handledSaveOldProject: function(obj,eventName) {
        var projectJson = require('./ProjectManage').getCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        require('JsonProjectService').handledSaveProject(obj,projectJson,skuJson,eventName);
    },
    getOldProject: function() {
        if(Store.isPreview){
            require('JsonProjectService').getNewPrintProject('Share');
        }else if(Store.isRemark) {
            require('JsonProjectService').getNewPrintProject('Portal');
        }else{
            require('JsonProjectService').getNewPrintProject();
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
        project.product = Store.baseProject.product;
        project.size = Store.baseProject.size;
        project.paper = Store.baseProject.paper;
        project.color = Store.baseProject.color;
        project.canvasBorder = Store.baseProject.canvasBorder;
        project.canvasBorderSize = Store.baseProject.canvasBorderSize;
        project.frameStyle = Store.baseProject.frameStyle;
        project.rotated = true;
        project.orientation = "Landscape";
        project.quantity = 1;
        return project;
    },
    orderProject: function(obj) {
        var xml = require('ProjectManage').getCurrentProjectXml();
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
        var projectJson = require('./ProjectManage').getCurrentProjectJson();
        projectJson.project.guid = '';
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        // var xml = require('ProjectManage').getCurrentProjectXml();

        require('JsonProjectService').cloneProject(obj,oldTitle,title,projectJson,skuJson);
        // require('ProjectService').cloneProject(obj,oldTitle,title,xml, thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);

    },
    setDefaultValue: function(){
        var SpecManage = require('SpecManage');
        var optionIds = SpecManage.getOptionIds();
        var Prj = Store.baseProject;

        // 在选项id列表中去除product
        optionIds = optionIds.filter(function(optionId) {
            return optionId !== 'product';
        });

        optionIds.forEach(function(optionId) {
            var defaultValue = SpecManage.getOptionsMapDefaultValue(optionId, [{"key":"product","value":Prj.product}]);
            Prj[optionId] = Prj[optionId] === 'none' || !Prj[optionId] ? defaultValue : Prj[optionId];
        });
    },
    createProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var PrjConstructor = require('Prj');
        var Prj = PrjConstructor();
        var UtilParam = require('UtilParam');
        Prj.product = UtilParam.getUrlParam('product')||'none';
        Prj.rotated = true;
        Store.projectSettings.length=0;
        Store.projects.length=0;
        Store.imageList.length=0;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        require("ImageController").deleteImage(0);
        Store.vm.$broadcast('notifyRefreshScreenshot');
        Store.projectSettings.push(Prj);
        this.setDefaultValue();
        var projectJson = require('./ProjectManage').initProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        Store.createdDate = require('UtilDateFormat').formatDateTime(new Date());
        Store.projectJson = projectJson;
        require('JsonProjectService').createProjectSuccess(obj,oldTitle,title,projectJson,skuJson);
    },
    changeProjectTitle: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').changeProjectTitle(title, dispatchObj, dispatchEventName);
    },
    getMainProjectImages:function(obj,projectId,imageId){
        require('ProjectService').getMainProject(obj,projectId,imageId);
    },
    getMyPhotoImages: function(obj,userId, shouldApplyImages){
        require('ProjectService').getMyPhotoImages(obj,userId, shouldApplyImages);
    },
    initProjectSettings: function() {
        var projectJson = Store.projectJson.project;
        var optionIds = require('SpecManage').getOptionIds();
        var paramArray = [];

        optionIds.forEach(function(optionId) {
            try {
                Store.baseProject[optionId] = projectJson.summary.defaultSetting[optionId];
            } catch (e) {
                try {
                    Store.baseProject[optionId] = projectJson.pages[0].spec[optionId];
                } catch (e) {
                    Store.baseProject[optionId] = projectJson.spec[optionId];
                }
            }

            // 如果Store.baseProject的值为undefined，则取默认spec值
            Store.baseProject[optionId] = Store.baseProject[optionId] || require('SpecManage').getOptionsMapDefaultValue(optionId, paramArray);

            paramArray.push({key: optionId, value: Store.baseProject[optionId]});
        });

        // 兼容老的8x10，11x14变成长方形
        if(['8X10', '11X14'].indexOf(Store.baseProject.size) !== -1) {
            Store.baseProject.shape = 'Rect';
        }

        Store.projectSettings = [];

        projectJson.pages.forEach(function(currentPage) {
            var PrjConstructor = require('Prj');
            var Prj = PrjConstructor();

            // 如果spec的参数中有currentpage中的settings缺少的，补上baseProject的参数值
            optionIds.forEach(function(optionId) {
                if(!currentPage.spec) {
                    currentPage.spec = {};
                }

                if(!currentPage.spec[optionId]) {
                    currentPage.spec[optionId] = Store.baseProject[optionId];
                }
            });

            var spec = currentPage.spec;
            var specKeys = Object.keys(spec);
            for (var i = 0; i < specKeys.length; i++) {
                var itemKey = specKeys[i];
                Prj[itemKey]=spec[itemKey];
            }
            Prj.quantity = parseInt(spec.quantity) || 1;
            Prj.rotated = Prj.orientation === 'Landscape' ? true : false;

            // 兼容老的8x10，11x14变成长方形
            if(['8X10', '11X14'].indexOf(Prj.size) !== -1) {
                Prj.shape = 'Rect';
            }

            Store.projectSettings.push(Prj);
        });
    },
    transformOldProjectToNew: function() {
        var projectJson = Store.projectJson.project;
        var optionIds = require('SpecManage').getOptionIds();

        if(projectJson.spec) {
            projectJson.pages[0].spec = projectJson.spec;
        }
    },
    upgradeProject: function() {

        Store.baseProject["size"] = Store.upgradeSize;
        for(var i = 0; i < Store.pages.length; i++ ) {
            Store.projectSettings[i].size = Store.upgradeSize;
            var currentCanvas = Store.pages[i].canvas;
            var frameBaseSize = require('JsonProjectManage').getBaseSize(i);
            var bleedSize = require('JsonProjectManage').getBleedSize(i);
            var photoLayer = require('JsonProjectManage').getPhotoLayer(i);
            var canvasBorder = require('JsonProjectManage').getCanvasBorder(i);
            var pageWith = photoLayer.width;
            var pageHeight = photoLayer.height;

            currentCanvas.realBleedings = bleedSize;
            currentCanvas.frameBaseSize = frameBaseSize;
            currentCanvas.canvasBordeThickness = canvasBorder;
            currentCanvas.mirrorSize = { top: 0, right: 0, bottom: 0, left: 0 };
            currentCanvas.photoLayer = photoLayer;
            currentCanvas.foreground = require("CanvasController").getForeground(currentCanvas.frameBaseSize, {left:0,top:0,right:0,bottom:0},currentCanvas.photoLayer,i);
            currentCanvas.oriWidth = currentCanvas.photoLayer.width;
            currentCanvas.oriHeight = currentCanvas.photoLayer.height;
            currentCanvas.oriBgWidth = currentCanvas.foreground.width;
            currentCanvas.oriBgHeight = currentCanvas.foreground.height;
            var foreground = require("CanvasController").getForegroundVariable(i);
            currentCanvas.oriX = currentCanvas.foreground.x;
            currentCanvas.oriY = currentCanvas.foreground.y;
            Store.mirrorLength = currentCanvas.canvasBordeThickness.top;
            var oldW=currentCanvas.params[0].width;
            var oldH=currentCanvas.params[0].height;
            currentCanvas.params[0].width = currentCanvas.photoLayer.width;
            currentCanvas.params[0].height = currentCanvas.photoLayer.height;
            if (currentCanvas.params[0].imageId) {
                var imageId=currentCanvas.params[0].imageId;

                var imageDetail = require("ImageListManage").getImageDetail(imageId);

                if(Math.abs(currentCanvas.params[0].imageRotate) === 90) {
                    var cWidth = currentCanvas.params[0].imageHeight,
                        cHeight = currentCanvas.params[0].imageWidth;
                }
                else {
                    var cWidth = currentCanvas.params[0].imageWidth,
                        cHeight = currentCanvas.params[0].imageHeight;
                };

                var defaultCrops = require("UtilCrop").getConformCrop(cWidth, cHeight, currentCanvas.params[0].cropPX,currentCanvas.params[0].cropPY,currentCanvas.params[0].cropPW,currentCanvas.params[0].cropPH,oldW,oldH,currentCanvas.params[0].width, currentCanvas.params[0].height);

                var px = defaultCrops.px,
                    py = defaultCrops.py,
                    pw = defaultCrops.pw,
                    ph = defaultCrops.ph;

                currentCanvas.params[0].cropX = imageDetail.width * px;
                currentCanvas.params[0].cropY = imageDetail.height * py;
                currentCanvas.params[0].cropW = imageDetail.width * pw;
                currentCanvas.params[0].cropH = imageDetail.height * ph;

                currentCanvas.params[0].cropPX = px;
                currentCanvas.params[0].cropPY = py;
                currentCanvas.params[0].cropPW = pw;
                currentCanvas.params[0].cropPH = ph;
            }
      }
    },
    getTotalPageNum: function(){
      var pageNum = 0;
      Store.pages.forEach(function(item){
        if(!item.isDeleted){
           pageNum++;
        }
      });
      return pageNum;
    },
    saveProjectOnly: function(obj){
        var projectJson = require('./ProjectManage').getCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        require('JsonProjectService').saveProjectOnly(obj,projectJson,skuJson);
    }

}
