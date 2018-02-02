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
        // var xml = require('ProjectManage').getPrintInitProjectXml();
        // Store.projectXml = xml;
        // console.log(Store.projectXml);
        // require('ProjectService').insertProject(obj,xml);

        // var xml = require('ProjectManage').getWallArtsInitProjectXml();
        var projectJson = require('JsonProjectManage').initNewPrintProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        Store.createdDate = require('UtilDateFormat').formatDateTime(new Date());
        // Store.projectXml = xml;
        Store.projectJson = projectJson;
        // Store.watches.isProjectLoaded = true;
        // return;
        console.log(projectJson)
        require('JsonProjectService').insertProject(obj,projectJson,skuJson);
    },
    saveOldProject: function(obj,callback) {
        var projectJson = require('JsonProjectManage').getNewPrintCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        if(callback && typeof callback==="function"){
            require('JsonProjectService').saveProject(obj,projectJson,skuJson,callback);
        }else{
            require('JsonProjectService').saveProject(obj,projectJson,skuJson);
        }
    },
    handledSaveOldProject: function(obj,eventName) {
        var projectJson = require('JsonProjectManage').getNewPrintCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        require('JsonProjectService').handledSaveProject(obj,projectJson,skuJson,eventName);
    },
    getOldProject: function() {
        if(Store.isPreview){
            if(Store.source !== 'self') {
                require('JsonProjectService').getNewPrintProject('Share');
            } else {
                require('JsonProjectService').getNewPrintProject();
            }
        }else if(Store.isRemark){
            require('JsonProjectService').getNewPrintProject('Portal');
        }else{

            // // 测试本地数据
            // require('JsonProjectService').getNewPrintProject('Local');
            // // 测试
            require('JsonProjectService').getNewPrintProject();
        }

    },
    getProjectOrderedState: function(obj) {
        require('ProjectService').getProjectOrderedState(obj);
    },
    addOrUpdateAlbum: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').addOrUpdateAlbum(title, dispatchObj, dispatchEventName);
    },
    newProject:function(size,paper,rotated,quantity){
        var optionIds = require('SpecManage').getOptionIds();
        var PrjConstructor = require('Prj');
        var Prj = PrjConstructor();
        if(!quantity){
            quantity=1;
        }

        optionIds.forEach(function(optionId) {
            Prj[optionId] = Store.baseProject[optionId];
        });

        Prj.size = size;
        Prj.paper = paper;
        Prj.rotated = rotated;
        Prj.quantity = quantity;
        Prj.product = Store.baseProject.product;
        Prj.price = 0;
        Store.projectSettings.push(Prj);
    },
    changeProject:function(idx,param){
        if(!param.size){
            Store.projectSettings[idx].size=param.size;
        }
        if(!param.price){
            Store.projectSettings[idx].price = parm.price;
        }
        if(!param.paper){
            Store.projectSettings[idx].paper=param.paper;
        }
        if(!param.quantity){
            Store.projectSettings[idx].quantity=param.quantity;
        }
    },
    orderProject: function(obj) {
        var xml = require('ProjectManage').getPrintProjectXml();
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
        var projectJson = require('JsonProjectManage').getNewPrintCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        delete projectJson.project.guid;

        require('JsonProjectService').cloneProject(obj, oldTitle, title, projectJson, skuJson);
    },
    createProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;

        var UtilParam = require('UtilParam');
        Store.selectedSize = decodeURIComponent(UtilParam.getUrlParam("size"));

        Store.orderNumber = decodeURIComponent(UtilParam.getUrlParam("orderNumber"));
        Store.projectId = UtilParam.getUrlParam("initGuid");
        Store.isPreview = UtilParam.getUrlParam("isPreview");
        Store.token = UtilParam.getUrlParam("token");
        Store.timestamp = UtilParam.getUrlParam("timestamp");
        Store.pUser = UtilParam.getUrlParam("pUser");
        Store.fromCart = UtilParam.getUrlParam("fromCart");
        Store.selectedPaper = decodeURIComponent(UtilParam.getUrlParam("paper"));


        Store.baseProject.product = UtilParam.getUrlParam('product')||'print';
        Store.baseProject.size = UtilParam.getUrlParam('size')||'none';
        Store.baseProject.paper = UtilParam.getUrlParam('paper')||'none';
        for (var i = 0; i < Store.pages.length; i++) {
            var currentCanvas = Store.pages[i].canvas;
            if (currentCanvas.pageItems.length) {
              currentCanvas.pageItems[0].$destroy(true);
              currentCanvas.pageItems.length = 0;
              currentCanvas.elements[0].$destroy(true);
              currentCanvas.elements.length = 0;
            }
          }
        if(Store.pages.length>0){
            var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
            currentCanvas.params.length=0;
        }
        Store.projectSettings.length=0;
        Store.projects.length=0;
        Store.imageList.length=0;
        Store.newUploadedImg.length=0;
        Store.pages.length=0;
        Store.vm.$broadcast('notifyFreshPages',true);
        var xml = require('ProjectManage').getPrintInitProjectXml();
        Store.projectXml = xml;
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
        require('ProjectService').createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);

    },
    getMyPhotoImages: function(obj,userId, shouldApplyImages){
        require('ProjectService').getMyPhotoImages(obj,userId, shouldApplyImages);
    },
    setDefaultValue: function(){
        var SpecManage = require('SpecManage');
        var optionIds = SpecManage.getOptionIds();
        var Prj = Store.projectSettings[Store.currentSelectProjectIndex];

        // 在选项id列表中去除product
        optionIds = optionIds.filter(function(optionId) {
            return optionId !== 'product';
        });

        optionIds.forEach(function(optionId) {
            var defaultValue = SpecManage.getOptionsMapDefaultValue(optionId, [{"key":"product","value":Prj.product}]);
            Prj[optionId] = Prj[optionId] === 'none' || !Prj[optionId] ? defaultValue : Prj[optionId];
            Store.baseProject[optionId] = Store.baseProject[optionId] === 'none' ? defaultValue : Store.baseProject[optionId];
        });
    },
    initProjectSettings: function() {
        var _this = this;
        var projectJson = Store.projectJson.project;
        var baseProject = projectJson.summary.defaultSetting;
        var optionIds = require('SpecManage').getOptionIds();

        optionIds.forEach(function(optionId) {
            Store.baseProject[optionId] = baseProject[optionId] || require('SpecManage').getOptionsMapDefaultValue(optionId, [{"key":"product","value":baseProject.product}]);
        });

        projectJson.pages.forEach(function(project) {
            var size = project.spec.size;
            var paper = project.spec.paper;
            var quantity = project.spec.quantity || 1;
            var rotated = parseFloat(project.width) < parseFloat(project.height);

            _this.newProject(size, paper, rotated, quantity);
        });
    },
    transformProjectXmlToJson: function(xml) {
        var _this = this;
        var defaultSetting = {};
        var pages = [];
        var images = [];
        var optionIds = require('SpecManage').getOptionIds();

        if($(xml).find('project').attr('productType')) {
            defaultSetting['size'] = $(xml).find('project').attr('baseSize');
            defaultSetting['paper'] = $(xml).find('project').attr('basePaper');
            defaultSetting['product'] = $(xml).find('project').attr('productType');

            optionIds.forEach(function(optionId) {
                if(optionId !== 'product' && optionId !== 'size' && optionId !== 'paper') {
                    var defaultValue = require('SpecManage').getOptionsMapDefaultValue(optionId, [{"key":"product","value": defaultSetting['product']}]);
                    defaultSetting[optionId] =
                        defaultSetting[optionId] === 'none' || !defaultSetting[optionId]
                            ? defaultValue
                            : defaultSetting[optionId];
                }
            });
        } else {
            for (var i = 0; i < $(xml).find('spec').length; i++) {
                var spec = $(xml).find('spec').eq(i);
                var pageXml = {};

                // 先转defaultSetting
                if(i === 0) {
                    for (var j = 0; j < spec.find('option').length; j++) {
                        var option = spec.find('option').eq(j);
                        defaultSetting[option.attr('id')]=option.attr('value');
                        if(defaultSetting[option.attr('id')]==="None"){
                            defaultSetting[option.attr('id')]="none";
                        }

                        if(option.attr('id') === 'product') {
                            optionIds.forEach(function(optionId) {
                                if(optionId !== 'product') {
                                    var defaultValue = require('SpecManage').getOptionsMapDefaultValue(optionId, [{"key":"product","value":option.attr('value')}]);
                                    defaultSetting[optionId] =
                                        defaultSetting[optionId] === 'none' || !defaultSetting[optionId]
                                            ? defaultValue
                                            : defaultSetting[optionId];
                                }
                            });
                        }
                    };
                }
            }
        }

        switch(defaultSetting.product) {
            case 'PR':
            case 'flushMountPrint':
                pageXml = $(xml).find('print');
                break;
            default:
                pageXml = $(xml).find('product');
                break;
        }

        pages = this.transformPageXmlToJson(pageXml, $(xml).find('images'));
        images = this.transformImageXmlToJson($(xml).find('images'));

        return {
            project: {
                guid: $(xml).find('guid').eq(0).text(),
                version: $(xml).find('version').eq(0).text(),
                clientId: $(xml).find('project').attr('clientId'),
                createAuthor: $(xml).find('project').attr('createAuthor'),
                userId: $(xml).find('userId').eq(0).text(),
                artisan: $(xml).find('artisan').eq(0).text(),
                createdDate: $(xml).find('createdDate').eq(0).text(),
                updatedDate: $(xml).find('updatedDate').eq(0).text(),
                summary: {
                    defaultSetting: defaultSetting
                },
                pages: pages,
                images: images
            }
        }
    },
    transformImageXmlToJson: function(imagesXml) {
        var images = [];
        imagesXml = imagesXml.find('image');

        for(var i = 0; i < imagesXml.length; i++) {
            var image = imagesXml.eq(i);
            images.push({
                 id: image.attr('id'),
                 guid: image.attr('guid'),
                 encImgId: image.attr('encImgId'),
                 order: image.attr('order'),
                 name: image.attr('name'),
                 width: image.attr('width'),
                 height: image.attr('height'),
                 shotTime: image.attr('shotTime')
            });
        }

        return images;
    },
    transformElementXmlToJson: function(elementsXml, imagesXml) {
        var elements = [];

        for(var i = 0; i < elementsXml.length; i++) {
            var element = elementsXml.eq(i);
            var imageId = element.attr('imageid');
            var encImgId = imageId ? imagesXml.find('[id='+ element.attr('imageid') + ']').attr('encImgId') : '';

            if(encImgId) {
                elements.push({
                    id: require("UtilProject").guid(),
                    type: element.attr('type'),
                    x: element.attr('x'),
                    y: element.attr('y'),
                    width: element.attr('width'),
                    height: element.attr('height'),
                    px: element.attr('px'),
                    py: element.attr('py'),
                    pw: element.attr('pw'),
                    ph: element.attr('ph'),
                    imgFlip: element.attr('imgFlip'),
                    rot: element.attr('rot'),
                    imgRot: element.attr('imgRot'),
                    encImgId: encImgId,
                    imageid: element.attr('imageid'),
                    dep: element.attr('dep'),
                    cropLUX: element.attr('cropLUX'),
                    cropLUY: element.attr('cropLUY'),
                    cropRLX: element.attr('cropRLX'),
                    cropRLY: element.attr('cropRLY')
                });
            }
        }

        return elements;
    },
    transformPageXmlToJson: function(pageXml, imagesXml) {
        var pages = [];

        for(var i = 0; i < pageXml.length; i++) {
            var id = pageXml.eq(i).attr('id') || pageXml.eq(i).find('content').eq(0).attr('id') || require("UtilProject").guid();
            var spec = {};
            var width = pageXml.eq(i).find('content').eq(0).attr('width');
            var height = pageXml.eq(i).find('content').eq(0).attr('height');
            var bleed = {
                top: pageXml.eq(i).find('content').eq(0).attr('bleedTop'),
                bottom: pageXml.eq(i).find('content').eq(0).attr('bleedBottom'),
                left: pageXml.eq(i).find('content').eq(0).attr('bleedLeft'),
                right: pageXml.eq(i).find('content').eq(0).attr('bleedRight')
            };
            // var rotated = pageXml.eq(i).find('content').eq(0).attr('rotated');
            var elements = this.transformElementXmlToJson(pageXml.eq(i).find('element'), imagesXml);
            var border = {
                color: pageXml.eq(i).find('content').eq(0).attr('borderColor') || 'none',
                size: parseInt(pageXml.eq(i).find('content').eq(0).attr('borderLength')) || 0
            };
            var backend = {
                isPrint: true
            };

            var options = pageXml.eq(i).find('spec').eq(0).find('option');
            for(var j = 0; j < options.length; j++) {
                var option = options.eq(j);
                spec[option.attr('id')] = option.attr('value');

                if(spec[option.attr('id')]==="None"){
                    spec[option.attr('id')]="none";
                }
            }

            spec.quantity = parseInt(pageXml.eq(i).attr('quantity')) || 1;

            if(elements.length > 0) {
                pages.push({
                    id: id,
                    spec: spec,
                    width: width,
                    height: height,
                    type: 'Print',
                    bleed: bleed,
                    border: border,
                    elements: elements,
                    backend: backend
                });
            }
        }

        return pages;
    },
    changeProjectTitle: function(title, dispatchObj, dispatchEventName) {
        require('ProjectService').changeProjectTitle(title, dispatchObj, dispatchEventName);
    },
    getMainProjectImages:function(obj,projectId,imageId){
        require('ProjectService').getMainProject(obj,projectId,imageId,true);
    },
    saveProjectOnly: function(obj,callback){
        var projectJson = require('JsonProjectManage').getNewPrintCurrentProjectJson();
        var skuJson = require('JsonProjectManage').getNewPrintSkuJson(projectJson);
        require('JsonProjectService').saveProjectOnly(obj,projectJson,skuJson);
        require('ProjectService').deleteImageList();
    }
}
