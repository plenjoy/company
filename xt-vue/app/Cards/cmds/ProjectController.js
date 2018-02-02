var strings = require('../contants/strings');

var INSIDE_PAGE = strings.pageTypes.INSIDE_PAGE;
var FRONT_PAGE = strings.pageTypes.FRONT_PAGE;
var FLAT = strings.cardTypes.FLAT;
var FOLDER = strings.cardTypes.FOLDER;
var TOP = strings.formatTypes.TOP;
var SIDE = strings.formatTypes.SIDE;

module.exports = {

    saveNewProject: function(obj) {
        var xml = require('ProjectManage').getCardInitXml();
        Store.projectXml = xml;
        console.log(Store.projectXml);
        require('ProjectService').insertProject(obj,xml);
        //require('CanvasController').initCanvasData();
        //Store.watches.isProjectLoaded = true;
    },
    savePortalCardProject: function(obj) {
        var xml = '';
        if(Store.projectId){
            xml = require('ProjectManage').getCardCurrentProjectXml();
        }else{
            xml = require('ProjectManage').getCardInitXml();
        }
        require('ProjectService').savePortalCardProject(obj,xml);
    },
    submitPortalCardProject: function(obj) {
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        require('ProjectService').submitPortalCardProject(obj,xml);
    },
    saveOldProject: function(obj,callback) {
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        // console.log(xml);
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
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        // console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;

        require('ProjectService').handledSaveProject(obj,eventName, xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
    },
    getOldProject: function() {
        if(Store.isPreview){
            if(Store.source !== 'self') {
                require('ProjectService').getShareProject();
            } else {
                require('ProjectService').getProject();
            }
        }else{
            require('ProjectService').getProject();
        }
    },
    getOldPortalProject: function() {
        require('ProjectService').getCardPortalProject();
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
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        // console.log(xml);
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        require('ProjectService').orderProject(obj,xml,thumbnailPX,thumbnailPY,thumbnailPW,thumbnailPH);
    },

    cloneProject: function(obj,title) {
        var oldTitle=Store.title;
        Store.title=title;
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        // console.log(xml);
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
        var trimDefaultValue = SpecManage.getOptionsMapDefaultValue("trim",[{"key":"product","value":Prj.product}]);
        Prj.trim =  trimDefaultValue?trimDefaultValue:'none';
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
        var xml = require('ProjectManage').getCardCurrentProjectXml();
        Store.projectXml = xml;
        var thumbnailPX=0;
        var thumbnailPY=0;
        var thumbnailPW=1;
        var thumbnailPH=1;
        // require('ProjectService').createProject(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
        require('ProjectService').createProjectSuccess(obj,oldTitle,title,xml,thumbnailPX, thumbnailPY, thumbnailPW, thumbnailPH);
    },
    getInitDefaultProject: function() {
        var PrjConstructor = require('Prj');
        var UtilParam = require('UtilParam');
        var SpecManage = require('SpecManage');
        var Prj = PrjConstructor();
        var optionIds = SpecManage.getOptionMapIds();
        var paramsArray = [];

        // 设置初始项目产品类型
        Prj.product = UtilParam.getUrlParam('product') || 'FT';
        paramsArray.push({ key: 'product', value: Prj.product});

        // 设置项目初始值 UtilParam/SpecManage
        optionIds.forEach(function(optionId) {
            var defaultValue = SpecManage.getOptionsMapDefaultValueWithoutDisableOption(optionId, paramsArray);
            Prj[optionId] = UtilParam.getUrlParam(optionId) || defaultValue;

            paramsArray.push({ key: optionId, value: Prj[optionId]});
        });

        if(Prj.product === 'FD' && Prj.size === '5X5') {
            switch(Prj.orientation) {
                case 'LA':
                    Prj.format = 'TOP';
                    break;
                case 'PO':
                    Prj.format = 'SIDE';
                    break;
            }
        }

        return Prj;
    },
    getMyPhotoImages: function(obj,userId){
        require('ProjectService').getMyPhotoImages(obj,userId);
    },
    loadResetProject: function() {
        var sXml = Store.templateXML;
        var spreadsXml = $(sXml).find('card').eq(0).find('spread');

        for (var pageIdx = 0; pageIdx < spreadsXml.length; pageIdx++) {
            var currentSpreadXml = spreadsXml.eq(pageIdx);

            Store.resetPages.push({
                type: currentSpreadXml.attr('type') || '',
                id: currentSpreadXml.attr('id') || '',
                tplGuid: currentSpreadXml.attr('tplGuid') || '',
                pageNumber: currentSpreadXml.attr('pageNumber') || '',
                styleId: currentSpreadXml.attr('styleId') || '',
                styleItemId: currentSpreadXml.attr('styleItemId') || '',
                width: currentSpreadXml.attr('width') || '',
                height: currentSpreadXml.attr('height') || '',
                name: '',
                canvas: {
                    oriWidth: 0, // real size
                    oriHeight: 0,
                    oriX: 0,
                    oriY: 0,
                    oriBgWidth: 0,
                    oriBgHeight: 0,
                    oriSpineWidth: 0,
                    realBleedings: {},
                    frameBaseSize: {},
                    frameBorderThickness: {},
                    boardInFrame: {},
                    boardInMatting: {},
                    mattingSize: {},
                    expendSize: {},
                    photoLayer: {},
                    params: []
                }
            });

            var currentCanvas = Store.resetPages[pageIdx].canvas;

            var spread = require("ProjectManage").getCardSpread();
            var orientation = Store.projectSettings[0].orientation;
            var format = Store.projectSettings[0].format;
            var currentPage = Store.projects[0].pages[pageIdx].type;
            var product = Store.projectSettings[0].product;

            currentCanvas.oriWidth = product === FOLDER && format === SIDE && currentPage !== INSIDE_PAGE ? spread.width / 2 : spread.width;
            currentCanvas.oriHeight = product === FOLDER && format === TOP && currentPage !== INSIDE_PAGE ? spread.height / 2 : spread.height;
            currentCanvas.oriX = 0;
            currentCanvas.oriY = 0;
            currentCanvas.photoLayer = { width: currentCanvas.oriWidth, height: currentCanvas.oriHeight };
            currentCanvas.realBleedings = { top: spread.bleedTop, right: spread.bleedRight, bottom: spread.bleedBottom, left: spread.bleedLeft };
            currentCanvas.foreground = require('CanvasController').getForeground(spread, currentCanvas, 0, pageIdx, currentPage);
            currentCanvas.formedSpread = require('CanvasController').getFormedSpread(spread, currentCanvas, product, format, currentPage);
            currentCanvas.oriBgWidth = currentCanvas.foreground.width;
            currentCanvas.oriBgHeight = currentCanvas.foreground.height;
            currentCanvas.oriX = currentCanvas.foreground.x;
            currentCanvas.oriY = currentCanvas.foreground.y;

            // get elements' size params
            var paramsCount = currentSpreadXml.find('element').length;

            for (var paramIdx = 0; paramIdx < paramsCount; paramIdx++) {
                var currentParamXml = currentSpreadXml.find('element').eq(paramIdx);

                var imgId = (!Store.isPortal && Store.deletedPhoto === 'false') ? '' : currentParamXml.attr('imageid') || '',
                    imageDetail = require('ImageListManage').getImageDetail(imgId) || '',
                    sourceImageUrl = '';

                var ox = parseFloat(currentParamXml.attr('x')) || 0,
                    oy = parseFloat(currentParamXml.attr('y')) || 0,
                    ow = parseFloat(currentParamXml.attr('width')) || 0,
                    oh = parseFloat(currentParamXml.attr('height')) || 0;
                // var shiftedValue = ParamsManage.getShiftValue(currentCanvas);
                // var newPosition = ParamsManage.getShiftPosition(ox, oy, ow, oh, shiftedValue.x, shiftedValue.y);
                var elType = '';
                if (currentParamXml.attr('type') === 'CalendarStyleElement') {
                    elType = 'style';
                    // 兼容 spec的 baseSize 更改后老项目的 style 撑满支持。
                    ox = 0, oy = 0, ow = currentCanvas.oriWidth, oh = currentCanvas.oriHeight;
                } else if (currentParamXml.attr('type') === 'PhotoElement') {
                    elType = 'image';
                } else if (currentParamXml.attr('type') === 'TextElement') {
                    elType = 'text';
                } else if (currentParamXml.attr('type') === 'DecorationElement') {
                    elType = 'decoration';
                };

                var baseParam = {
                    id: paramIdx,
                    elType: elType,
                    styleGuid: currentParamXml.attr('styleGuid') || '',
                    styleItemId: currentParamXml.attr('styleItemId') || '',
                    styleId: currentParamXml.attr('styleId') || '',
                    styleImageId: currentParamXml.attr('imageId') || '',
                    // url: sourceImageUrl,
                    url: '',
                    isRefresh: false,
                    text: decodeURIComponent(currentParamXml.text()) || '',
                    // x: currentCanvas.oriWidth * (parseFloat(currentParamXml.attr('px')) || 0),
                    x: ox,
                    // y: currentCanvas.oriHeight * (parseFloat(currentParamXml.attr('py')) || 0),
                    y: oy,
                    // width: currentCanvas.oriWidth * (parseFloat(currentParamXml.attr('pw')) || 0),
                    width: ow,
                    // height: currentCanvas.oriHeight * (parseFloat(currentParamXml.attr('ph')) || 0),
                    height: oh,
                    rotate: parseFloat(currentParamXml.attr('rot')),
                    dep: parseInt(currentParamXml.attr('dep')) || 0,
                    imageId: '',
                    imageGuid: '',
                    imageWidth: '',
                    imageHeight: '',
                    imageRotate: 0,
                    // imageFlip: ,
                    cropPX: 0,
                    cropPY: 0,
                    cropPW: 1,
                    cropPH: 1,
                    isFamilyName: currentParamXml.attr('isFamilyName') || 'false',
                    fontFamily: decodeURIComponent(currentParamXml.attr('fontFamily')) || '',
                    fontSize: currentCanvas.oriHeight * parseFloat(currentParamXml.attr('fontSize') || 0),
                    fontWeight: currentParamXml.attr('fontWeight') || '',
                    textAlign: currentParamXml.attr('textAlign') || 'left',
                    textVAlign: currentParamXml.attr('textVAlign') || 'top',
                    lineSpacing: currentParamXml.attr('lineSpacing') || '1',
                    fontColor: currentParamXml.attr('color') || '0',
                    decorationid: currentParamXml.attr('decorationid') || '',
                    decorationtype: currentParamXml.attr('decorationtype') || '',
                    isDisableRemind: currentParamXml.attr('isDisableRemind') === 'true' ? true : false
                }
                if(currentParamXml.attr('tagType') &&
                    currentParamXml.attr('tagType') !== 'Null' ) {
                    $.extend(baseParam, {
                        tagName: currentParamXml.attr('tagName') || '',
                        tagType: currentParamXml.attr('tagType') || '',
                        mandatory: parseInt(currentParamXml.attr('mandatory')) || 0,
                        constant: currentParamXml.attr('constant') === 'true',
                        textFormat: strings.tagFormats[currentParamXml.attr('tagType')],
                        // 如果constant是true，那么isEdit也是true，否则按照设定的数据中来
                        isEdit: currentParamXml.attr('constant') === 'true'
                            ? true
                            : (currentParamXml.attr('isEdit') === 'true' ? true : false),
                        order: parseInt(currentParamXml.attr('order'))
                    });
                }
                currentCanvas.params.push(baseParam);
            };
        };
    }
}
