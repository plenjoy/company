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
           /* '<element type="PhotoElement" elType="image" x="0" y="0" width="' + base.width + '" height="' + base.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +*/
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
                    xml += '<image id="'+ Store.imageList[i].id +'" guid="'+ Store.imageList[i].guid +'" encImgId="'+ Store.imageList[i].encImgId +'" order="'+ i +'" name="'+ encodeURIComponent(Store.imageList[i].name) +'" width="'+ Store.imageList[i].width +'" height="'+ Store.imageList[i].height +'" shotTime="'+ Store.imageList[i].shotTime +'"/>';
                };
        xml +='</images>'+
            '</project>';
        return xml;
    },
    saveNewProject: function(obj) {
        var xml = this.initProjectXml();
        Store.projectXml = xml;
        console.log(Store.projectXml);
        //require('CanvasController').initCanvasData();
        //Store.watches.isProjectLoaded = true;
        require('ProjectService').insertProject(obj,xml);
    },
    saveOldProject: function(obj,callback) {
        var xml = this.getCurrentProjectXml();
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var thumbnailPX=base.x/background.width;
        var thumbnailPY=base.y/background.height;
        var thumbnailPW=base.width/background.width;
        var thumbnailPH=base.height/background.height;
        if(callback && typeof callback==="function"){
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH,callback);
        }else{
            require('ProjectService').saveProject(obj, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
        }
    },
    handledSaveOldProject: function(obj,eventName) {
        var xml = this.getCurrentProjectXml();
        console.log(xml);
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var thumbnailPX=base.x/background.width;
        var thumbnailPY=base.y/background.height;
        var thumbnailPW=base.width/background.width;
        var thumbnailPH=base.height/background.height;
        require('ProjectService').handledSaveProject(obj,eventName,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
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
        var xml = this.getCurrentProjectXml();
        console.log(xml);
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var thumbnailPX=base.x/background.width;
        var thumbnailPY=base.y/background.height;
        var thumbnailPW=base.width/background.width;
        var thumbnailPH=base.height/background.height;
        require('ProjectService').orderProject(obj,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
    },

    cloneProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;

        var xml = this.getCurrentProjectXml();
        var specData = require('SpecController').analyseSpec({ product: Store.projectSettings[Store.currentSelectProjectIndex].product, size: Store.projectSettings[Store.currentSelectProjectIndex].size });
        var base = specData.base;
        var background = specData.background;
        var logo = specData.logo;
        var thumbnailPX=base.x/background.width;
        var thumbnailPY=base.y/background.height;
        var thumbnailPW=base.width/background.width;
        var thumbnailPH=base.height/background.height;
        require('ProjectService').cloneProject(obj,oldTitle,title,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);

    },

    createProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var PrjConstructor = require('Prj');
        var Prj = PrjConstructor();
        var UtilParam = require('UtilParam');
        Prj.product = UtilParam.getUrlParam("type");
        Prj.color = UtilParam.getUrlParam("color");
        Prj.size = '14X16';
        Prj.measure = 'M';
        Prj.count = 1;
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var ll=currentCanvas.params.length;
        for(var v=0;v<ll;v++){
            Store.vm.$broadcast('notifyRemoveImage',0);
        }
        currentCanvas.params.length=0;
        Store.projectSettings.length=0;
        Store.projects.length=0;
        Store.imageList.length=0;
        Store.projectSettings.push(Prj);
        var xml = this.initProjectXml();
        Store.projectXml = xml;
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
        require('ProjectService').createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);

    },
    getMyPhotoImages:function(obj,userId){
        require('ProjectService').getMyPhotoImages(obj,userId);
    }
}
