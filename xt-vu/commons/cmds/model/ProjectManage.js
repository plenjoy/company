module.exports = {

    getFrameBaseSize: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var size = currentProject.size;
        var sizeObject = require('SpecManage').getParameter('frameBaseSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.width = sizeObject.heightInInch * require('SpecManage').getDPI();
            object.height = sizeObject.widthInInch * require('SpecManage').getDPI();
        } else {
            object.width = sizeObject.widthInInch * require('SpecManage').getDPI();
            object.height = sizeObject.heightInInch * require('SpecManage').getDPI();
        }

        return object;
    },
    getCanvasBorderThickness: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var canvasBorderSize = currentProject.canvasBorderSize;
        var sizeObject = require('SpecManage').getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'canvasBorderSize', value: canvasBorderSize }, { key: 'frameStyle', value: frameStyle }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }

        return object;
    },
    getFrameBorderThickness: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var sizeObject = require('SpecManage').getParameter('frameBorderThickness', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }

        return object;
    },
    getBleed: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var size = currentProject.size;
        var frameStyle = currentProject.frameStyle;
        var sizeObject = require('SpecManage').getParameter('bleed', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }
        return object;
    },
    getBoardInFrame: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var size = currentProject.size;
        var sizeObject = require('SpecManage').getParameter('boardInFrame', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }
        return object;
    },
    getBoardInMatting: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var size = currentProject.size;
        var matte = currentProject.matte;
        var frameStyle = currentProject.frameStyle;
        var sizeObject = require('SpecManage').getParameter('boardInMatting', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }
        return object;
    },
    getMatteSize: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var size = currentProject.size;
        var matte = currentProject.matte;
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var sizeObject = require('SpecManage').getParameter('matteSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }
        return object;
    },
    getMatteStyleColor: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var matteStyle = currentProject.matteStyle;
        var sizeObject = require('SpecManage').getParameter('matteStyleColor', [{ key: 'matteStyle', value: matteStyle }]);
        if (sizeObject && sizeObject.color === "0") {
            return 0;
        } else {
            return 16777215;
        }
    },
    getInitProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getBaseInfoXml();
        var option = this.getOptionXml();
        var frameBoard = this.getFrameBoardXml();
        var matteLayer = this.getMatteLayerXml();
        var photoLayer = this.getPhotoLayerXml();
        var elements = this.getIntiElementXml();
        var images = this.getImagesXml();

        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
        ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getCurrentProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getBaseInfoXml();
        var option = this.getOptionXml();
        var frameBoard = this.getFrameBoardXml();
        var matteLayer = this.getMatteLayerXml();
        var photoLayer = this.getPhotoLayerXml();
        var elements = this.getElementsXml();
        var images = this.getImagesXml();

        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
        if (currentProject.matte !== "none") {
            ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
        }
        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getOptionXml: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var s = '<spec version="' + require('SpecManage').getVersion() + '">';

        var optionIds = require('SpecManage').getOptionIds();
        for (var i = 0; i < optionIds.length; i++) {
            s += '<option id="' + optionIds[i] + '" value="' + currentProject[optionIds[i]] + '"/>';
        };

        s += '</spec>';

        return require('UtilXML').stringToXml(s);
    },
    getElementsXml: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var currentCanvas = Store.pages[index].canvas;
        var elememts = currentCanvas.params;
        var s = '<elements>';

        for (var i = 0; i < elememts.length; i++) {

            var x = elememts[i].x;
            var y = elememts[i].y;
            var width = elememts[i].width;
            var height = elememts[i].height;
            var px = x / currentCanvas.oriWidth;
            var py = y / currentCanvas.oriHeight;
            var ph = height / currentCanvas.oriHeight;
            var pw = width / currentCanvas.oriWidth;
            var rot = elememts[i].rotate;
            var dep = elememts[i].dep;
            var imageid = elememts[i].imageId;
            var imgRot = elememts[i].imageRotate;
            var imgFlip = false;
            var cropPX = parseFloat(elememts[i].cropPX),
                cropPY = parseFloat(elememts[i].cropPY),
                cropPW = parseFloat(elememts[i].cropPW),
                cropPH = parseFloat(elememts[i].cropPH);
            console.log(elememts[i]);
            if (elememts[i].elType === 'text') {

                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[i].fontColor + '" fontSize="' + parseFloat(elememts[i].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[i].fontFamily) + '" fontWeight="' + elememts[i].fontWeight + '" textAlign="' + elememts[i].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[i].text) + ']]></element>';

            } else if (elememts[i].elType === 'logo') {

                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX.toString() + '" cropLUY="' + cropPY.toString() + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH).toString() + '" />';

            } else if (elememts[i].elType === 'image') {

                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX.toString() + '" cropLUY="' + cropPY.toString() + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH).toString() + '" />';
            }

        }
        s += '</elements>';
        return require('UtilXML').stringToXml(s);
    },
    getIntiElementXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhotoLayer();

        var width = photoLayer.width;
        var height = photoLayer.height;
        var s = '<elements>' +
            /*            '<element type="PhotoElement" x="0" y="0" width="' + width + '" height="' + height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +
             */
            '</elements>';
        return require('UtilXML').stringToXml(s);
    },
    getBaseInfoXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var s = '<project schemaVersion="2.0" clientId="web-h5">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description></description>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<uiSetting>' +
            '<templateStrip>' +
            '<showTemplatePanel>false</showTemplatePanel>' +
            '<autoLayout>false</autoLayout>' +
            '</templateStrip>' +
            '</uiSetting>' +
            '<photoFrame>' +
            '</photoFrame>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },
    getFrameBoardXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var rotated = currentProject.rotated;

        var frameBaseSize = this.getFrameBaseSize();


        var frameBorderThickness = this.getFrameBorderThickness();
        var frameBorderThicknessTop = frameBorderThickness.top;
        var frameBorderThicknessBottom = frameBorderThickness.bottom;
        var frameBorderThicknessLeft = frameBorderThickness.left;
        var frameBorderThicknessRight = frameBorderThickness.right;

        var canvasBorderThickness = this.getCanvasBorderThickness();
        var canvasBorderThicknessTop = canvasBorderThickness.top;
        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
        var canvasBorderThicknessLeft = canvasBorderThickness.left;
        var canvasBorderThicknessRight = canvasBorderThickness.right;

        var boardInFrame = this.getBoardInFrame();
        var boardInFrameTop = boardInFrame.top;
        var boardInFrameBottom = boardInFrame.bottom;
        var boardInFrameLeft = boardInFrame.left;
        var boardInFrameRight = boardInFrame.right;

        var boardInMatting = this.getBoardInMatting();
        var boardInMattingTop = boardInMatting.top;
        var boardInMattingBottom = boardInMatting.bottom;
        var boardInMattingLeft = boardInMatting.left;
        var boardInMattingRight = boardInMatting.right;

        var width = frameBaseSize.width + canvasBorderThicknessLeft + canvasBorderThicknessRight;
        var height = frameBaseSize.height + canvasBorderThicknessTop + canvasBorderThicknessBottom;
        var borderColor = Store.bgColor + "";
        if (isNaN(borderColor)) {
            borderColor = "0";
        }
        var s = '<frameBoard rotated="' + rotated + '" height="' + height + '" width="' + width + '" frameBorderThicknessTop="' + frameBorderThicknessTop + '" frameBorderThicknessBottom="' + frameBorderThicknessBottom + '" frameBorderThicknessLeft="' + frameBorderThicknessLeft + '" frameBorderThicknessRight="' + frameBorderThicknessRight + '" canvasBorderThicknessTop="' + canvasBorderThicknessTop + '" canvasBorderThicknessBottom="' + canvasBorderThicknessBottom + '" canvasBorderThicknessLeft="' + canvasBorderThicknessLeft + '" canvasBorderThicknessRight="' + canvasBorderThicknessRight + '" boardInFrameTop="' + boardInFrameTop + '" boardInFrameBottom="' + boardInFrameBottom + '" boardInFrameLeft="' + boardInFrameLeft + '" boardInFrameRight="' + boardInFrameRight + '" boardInMattingTop="' + boardInMattingTop + '" boardInMattingBottom="' + boardInMattingBottom + '" boardInMattingLeft="' + boardInMattingLeft + '" boardInMattingRight="' + boardInMattingRight + '" canvasBorderColor="' + borderColor + '"></frameBoard>';

        return require('UtilXML').stringToXml(s);
    },
    getMatteLayerXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var id = currentProject.matte;
        var color = this.getMatteStyleColor();

        var matteSize = this.getMatteSize();
        var matteTop = matteSize.top;
        var matteBottom = matteSize.bottom;
        var matteLeft = matteSize.left;
        var matteRight = matteSize.right;
        var s = '<matteLayer id="' + id + '" x="0" y="0" px="0" py="0" matteTop="' + matteTop + '" matteBottom="' + matteBottom + '" matteLeft="' + matteLeft + '" matteRight="' + matteRight + '" depth="1" color="' + color + '"/>';
        return require('UtilXML').stringToXml(s);
    },
    getPhotoLayerXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhotoLayer();

        var bleed = this.getBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var x = photoLayer.x;
        var y = photoLayer.y;
        var px = photoLayer.px;
        var py = photoLayer.py;
        var pw = photoLayer.pw;
        var ph = photoLayer.ph;
        var width = photoLayer.width;
        var height = photoLayer.height;
        console.log('color', Store.bgColor);
        var tplGuid = currentProject.tplGuid;
        var tplSuitId = currentProject.tplSuitId;
        var s = '';
        if (tplGuid && tplSuitId) {

            s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '" tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '"></photosLayer>';

        } else {
            s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '"></photosLayer>';

        }
        return require('UtilXML').stringToXml(s);
    },
    getImagesXml: function() {
        var s = '<images>';
        for (i = 0; i < Store.imageList.length; i++) {
            var orientationAttr = !isNaN(Store.imageList[i].orientation) ? 'orientation="' + Store.imageList[i].orientation + '" ' : '';

            s += '<image id="' + Store.imageList[i].id + '" guid="' + Store.imageList[i].guid + '" encImgId="' + Store.imageList[i].encImgId + '" order="' + i + '" name="' + encodeURIComponent(Store.imageList[i].name) + '" width="' + Store.imageList[i].width + '" height="' + Store.imageList[i].height + '" shotTime="' + Store.imageList[i].shotTime + '" ' + orientationAttr +'/>';
        };
        s += '</images>';
        return require('UtilXML').stringToXml(s);
    },
    getPhotoLayer: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var object = {};
        var rotated = currentProject.rotated;

        var frameBaseSize = this.getFrameBaseSize();

        var frameBorderThickness = this.getFrameBorderThickness();
        var frameBorderThicknessTop = frameBorderThickness.top;
        var frameBorderThicknessBottom = frameBorderThickness.bottom;
        var frameBorderThicknessLeft = frameBorderThickness.left;
        var frameBorderThicknessRight = frameBorderThickness.right;

        var canvasBorderThickness = this.getCanvasBorderThickness();
        var canvasBorderThicknessTop = canvasBorderThickness.top;
        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
        var canvasBorderThicknessLeft = canvasBorderThickness.left;
        var canvasBorderThicknessRight = canvasBorderThickness.right;

        var boardInFrame = this.getBoardInFrame();
        var boardInFrameTop = boardInFrame.top;
        var boardInFrameBottom = boardInFrame.bottom;
        var boardInFrameLeft = boardInFrame.left;
        var boardInFrameRight = boardInFrame.right;

        var boardInMatting = this.getBoardInMatting();
        var boardInMattingTop = boardInMatting.top;
        var boardInMattingBottom = boardInMatting.bottom;
        var boardInMattingLeft = boardInMatting.left;
        var boardInMattingRight = boardInMatting.right;

        var bleed = this.getBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var size = currentProject.size;
        var matte = currentProject.matte;
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var sizeObject = require('SpecManage').getParameter('matteSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'matte', value: matte }]);

        var matteTop = parseInt(sizeObject.top);
        var matteBottom = parseInt(sizeObject.bottom);
        var matteLeft = parseInt(sizeObject.left);
        var matteRight = parseInt(sizeObject.right);

        var floatBgSize = require('SpecManage').getParameter('floatBgSize', [{ key: 'product', value: product }, { key: 'size', value: size }]);
        var floatBgTop = floatBgSize ? parseInt(floatBgSize.top) : 0;
        var floatBgLeft = floatBgSize ? parseInt(floatBgSize.left) : 0;
        var floatBgRight = floatBgSize ? parseInt(floatBgSize.right) : 0;
        var floatBgBottom = floatBgSize ? parseInt(floatBgSize.bottom) : 0;

        var baseWidth = frameBaseSize.width + canvasBorderThicknessLeft + canvasBorderThicknessRight;
        var baseHeight = frameBaseSize.height + canvasBorderThicknessTop + canvasBorderThicknessBottom;

        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        if (currentProject.rotated) {
            x = matteBottom - bleedBottom - boardInMattingBottom + floatBgBottom /*- canvasBorderThicknessBottom*/ ;
            y = matteLeft - bleedLeft - boardInMattingLeft + floatBgLeft /*- canvasBorderThicknessLeft*/ ;
            width = baseWidth + bleedTop + bleedBottom - matteTop - matteBottom + boardInMattingTop + boardInMattingBottom - floatBgTop - floatBgBottom;
            height = baseHeight + bleedLeft + bleedRight - matteLeft - matteRight + boardInMattingLeft + boardInMattingRight - floatBgLeft - floatBgRight;
        } else {
            x = matteLeft - bleedLeft - boardInMattingLeft + floatBgLeft /*- canvasBorderThicknessLeft*/ ;
            y = matteTop - bleedTop - boardInMattingTop + floatBgTop /*- canvasBorderThicknessTop*/ ;
            width = baseWidth + bleedLeft + bleedRight - matteLeft - matteRight + boardInMattingLeft + boardInMattingRight - floatBgLeft - floatBgRight;
            height = baseHeight + bleedTop + bleedBottom - matteTop - matteBottom + boardInMattingTop + boardInMattingBottom - floatBgTop - floatBgBottom;
        }
        var px = x / baseWidth;
        var py = y / baseHeight;
        var pw = width / baseWidth;
        var ph = height / baseHeight;

        object.x = x;
        object.y = y;
        object.width = width;
        object.height = height;
        object.px = px;
        object.py = py;
        object.pw = pw;
        object.ph = ph;

        return object;
    },

    getFrameBorderAsset: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        return require("SpecManage").getVariable('frameBorderAsset', [{ key: 'product', value: currentProject.product }, { key: 'color', value: currentProject.color }]);
    },
    isSupportMatte: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var matte = require("SpecManage").getVariable('availableOperation', [{ key: 'product', value: currentProject.product }, { key: 'frameStyle', value: currentProject.frameStyle }]);
        return matte.supportMatte === "true" ? true : false;
    },
    isSupportGlass: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var matte = require("SpecManage").getVariable('availableOperation', [{ key: 'product', value: currentProject.product }, { key: 'frameStyle', value: currentProject.frameStyle }]);
        return matte.supportGlassStyle === "true" ? true : false;
    },

    //poster产品

    getBaseSize: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var product = currentProject.product;
        var size = currentProject.size;
        var sizeObject = require('SpecManage').getParameter('baseSize', [{ key: 'product', value: product }, { key: 'size', value: size }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.width = sizeObject.heightInInch * require('SpecManage').getDPI();
            object.height = sizeObject.widthInInch * require('SpecManage').getDPI();
        } else {
            object.width = sizeObject.widthInInch * require('SpecManage').getDPI();
            object.height = sizeObject.heightInInch * require('SpecManage').getDPI();
        }
        return object;
    },
    getPageBleed: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var product = currentProject.product;
        var size = currentProject.size;
        var sizeObject = require('SpecManage').getParameter('pageBleed', [{ key: 'product', value: product }, { key: 'size', value: size }]);
        var object = {};
        var rotated = currentProject.rotated;
        if (rotated) {
            object.top = parseInt(sizeObject.left);
            object.bottom = parseInt(sizeObject.right);
            object.left = parseInt(sizeObject.top);
            object.right = parseInt(sizeObject.bottom);
        } else {
            object.top = parseInt(sizeObject.top);
            object.bottom = parseInt(sizeObject.bottom);
            object.left = parseInt(sizeObject.left);
            object.right = parseInt(sizeObject.right);
        }
        return object;
    },
    getProuctCode: function() {
        var length = Store.projectSettings.length;
        var str = '|';
        for (var i = 0; i < length; i++) {
            var product = Store.projectSettings[i].product;
            if (str.indexOf("|" + product + "|") < 0) {
                str += product + '|';
            };
        }
        return str.substring(1, str.length - 1);
    },
    getPosterBaseInfoXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var s = '<project schemaVersion="3.0" createAuthor="web-h5|1.0|1" clientId="web-h5" productCode="' + this.getProuctCode() + '" categoryCode="' + Store.category + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<products>' +
            '</products>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },

    getPosterInitProjectXml: function() {

        var base = this.getPosterBaseInfoXml();
        // var product=this.getInitProductXml();
        var product = this.getInitPosterXml();
        var images = this.getImagesXml();

        ($(base).find('products')).append(product.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getInitPosterXml: function() {
        var s = '';
        var projectLength = Store.projectSettings.length;
        for (var i = 0; i < projectLength; i++) {
            var currentProject = Store.projectSettings[i];
            s += '<product type="' + currentProject.product + '">';
            var option = this.getOptionXml(i);
            s += require('UtilXML').xmlToString(option);
            s += '<productSetting/>';
            s += '<contents>';
            var contentXml = this.getInitPosterContentXml();
            s += require('UtilXML').xmlToString(contentXml);
            s += '</contents>';
            s += '</product>';
        }
        return require('UtilXML').stringToXml(s);
    },
    getInitPosterContentXml: function() {
        var currentProject = Store.projectSettings[0];
        var content = this.getContent(0);
        var rotated = currentProject.rotated;
        var tplGuid = "null";
        var tplSuitId = "null";
        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
        s += "<elememts>";
        s += '<element type="PhotoElement" x="0" y="0" width="' + content.width + '" height="' + content.height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />';
        s += "</elememts>";
        s += '</content>';
        return require('UtilXML').stringToXml(s);
    },
    getPosterCurrentProjectXml: function() {

        var base = this.getPosterBaseInfoXml();
        var product = this.getProductXml();
        var images = this.getImagesXml();

        ($(base).find('products')).append(product.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getContent: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var object = {};
        var rotated = currentProject.rotated;

        var baseSize = this.getBaseSize();

        var baseWidth = baseSize.width;
        var baseHeight = baseSize.height;

        var bleed = this.getPageBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;


        var width = baseWidth + bleedLeft + bleedRight;
        var height = baseHeight + bleedTop + bleedBottom;

        var object = {};
        object.width = width;
        object.height = height;
        object.bleedTop = bleedTop;
        object.bleedBottom = bleedBottom;
        object.bleedLeft = bleedLeft;
        object.bleedRight = bleedRight;

        return object;
    },
    getProductXml: function() {
        var s = '';
        var projectLength = Store.projectSettings.length;
        for (var i = 0; i < projectLength; i++) {
            var currentProject = Store.projectSettings[i];
            s += '<product type="' + currentProject.product + '">';
            var option = this.getOptionXml(i);
            s += require('UtilXML').xmlToString(option);
            s += '<productSetting/>';
            s += '<contents>';
            var contentXml = this.getContentXml(i);
            s += require('UtilXML').xmlToString(contentXml);
            s += '</contents>';
            s += '</product>';
        }
        return require('UtilXML').stringToXml(s);

    },
    getInitProductXml: function() {
        var s = '';
        var projectLength = Store.projectSettings.length;
        for (var i = 0; i < projectLength; i++) {
            var currentProject = Store.projectSettings[i];
            s += '<product type="' + currentProject.product + '">';
            var option = this.getOptionXml(i);
            s += require('UtilXML').xmlToString(option);
            s += '<productSetting/>';
            s += '<contents>';
            var contentXml = this.getInitContentXml();
            s += require('UtilXML').xmlToString(contentXml);
            s += '</contents>';
            s += '</product>';
        }
        return require('UtilXML').stringToXml(s);

    },
    getContentXml: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var content = this.getContent(index);
        var rotated = currentProject.rotated;
        var tplGuid = currentProject.tplGuid;
        var tplSuitId = currentProject.tplSuitId;
        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
        var elements = this.getElementsXml(index);
        s += require('UtilXML').xmlToString(elements);
        s += '</content>';
        return require('UtilXML').stringToXml(s);
    },
    getInitContentXml: function() {
        var currentProject = Store.projectSettings[0];
        var content = this.getContent(0);
        var rotated = currentProject.rotated;
        var tplGuid = "null";
        var tplSuitId = "null";
        var s = '<content width="' + content.width + '" height="' + content.height + '" bleedTop="' + content.bleedTop + '" bleedBottom="' + content.bleedBottom + '" bleedLeft="' + content.bleedLeft + '" bleedRight="' + content.bleedRight + '" type="front"  tplGuid="' + tplGuid + '" tplSuitId="' + tplSuitId + '" rotated="' + rotated + '">';
        s += "<elememts>";
        s += "</elememts>";
        s += '</content>';
        return require('UtilXML').stringToXml(s);
    },

    //Phone Case产品

    getPhonecaseBaseSize: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index],
            product = currentProject.product,
            deviceType = currentProject.deviceType,
            dpi = require('SpecManage').getDPI(),
            sizeObject = require('SpecManage').getParameter('baseSizeInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
            object = {};
        object.width = sizeObject.width * dpi;
        object.height = sizeObject.height * dpi;
        return object;
    },

    getPhonecaseSide: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index],
            product = currentProject.product,
            deviceType = currentProject.deviceType,
            dpi = require('SpecManage').getDPI(),
            sizeObject = require('SpecManage').getParameter('sideInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
            object = {};
        object.top = sizeObject.top * dpi;
        object.bottom = sizeObject.bottom * dpi;
        object.left = sizeObject.left * dpi;
        object.right = sizeObject.right * dpi;
        return object;
    },

    getPhonecaseEdge: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index],
            product = currentProject.product,
            deviceType = currentProject.deviceType,
            dpi = require('SpecManage').getDPI(),
            sizeObject = require('SpecManage').getParameter('edgeInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
            object = {};
        object.top = sizeObject.top * dpi;
        object.bottom = sizeObject.bottom * dpi;
        object.left = sizeObject.left * dpi;
        object.right = sizeObject.right * dpi;
        return object;
    },

    getPhonecaseBleed: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index],
            product = currentProject.product,
            deviceType = currentProject.deviceType,
            dpi = require('SpecManage').getDPI(),
            sizeObject = require('SpecManage').getParameter('bleedInInch', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
            object = {};
        object.top = sizeObject.top * dpi;
        object.bottom = sizeObject.bottom * dpi;
        object.left = sizeObject.left * dpi;
        object.right = sizeObject.right * dpi;
        return object;
    },

    getPhonecaseForeground: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index],
            product = currentProject.product,
            deviceType = currentProject.deviceType,
            sizeObject = require('SpecManage').getVariable('foreground', [{ key: 'product', value: product }, { key: 'deviceType', value: deviceType }]),
            object = {};
        object.width = sizeObject.width;
        object.height = sizeObject.height;
        object.top = sizeObject.paddingTop;
        object.right = sizeObject.paddingRight;
        object.left = sizeObject.paddingLeft;
        object.bottom = sizeObject.paddingBottom;
        return object;
    },

    getPhonecaseBaseInfoXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var s = '<project schemaVersion="2.0" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.product + '" productType="' + Store.projectType + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<endpointToken></endpointToken>' +
            '<phoneCase>' +
            '</phoneCase>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },

    getPhonecasePhotoLayerXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhonecasePhotoLayer();

        var bleed = this.getPhonecaseBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var x = photoLayer.x;
        var y = photoLayer.y;
        var px = photoLayer.px;
        var py = photoLayer.py;
        var pw = photoLayer.pw;
        var ph = photoLayer.ph;
        var width = photoLayer.width;
        var height = photoLayer.height;
        console.log('color', Store.bgColor);
        var s = '<photosLayer x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" bleedTop="' + bleedTop + '" bleedBottom="' + bleedBottom + '" bleedLeft="' + bleedLeft + '" bleedRight="' + bleedRight + '"></photosLayer>';
        return require('UtilXML').stringToXml(s);
    },
    getPhonecasePhotoLayer: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var object = {};

        var BaseSize = this.getPhonecaseBaseSize();

        var baseWidth = BaseSize.width;
        var baseHeight = BaseSize.height;

        var side = this.getPhonecaseSide();
        var sideTop = side.top;
        var sideBottom = side.bottom;
        var sideLeft = side.left;
        var sideRight = side.right;

        var edge = this.getPhonecaseEdge();
        var edgeTop = edge.top;
        var edgeBottom = edge.bottom;
        var edgeLeft = edge.left;
        var edgeRight = edge.right;

        var bleed = this.getPhonecaseBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;
        x = -(sideLeft + edgeLeft + bleedLeft);
        y = -(sideTop + edgeTop + bleedTop);
        width = baseWidth + sideLeft + sideRight + edgeLeft + edgeRight + bleedLeft + bleedRight;
        height = baseHeight + sideTop + sideBottom + edgeTop + edgeBottom + bleedTop + bleedBottom;
        var px = x / baseWidth;
        var py = y / baseHeight;
        var pw = width / baseWidth;
        var ph = height / baseHeight;

        object.x = x;
        object.y = y;
        object.width = width;
        object.height = height;
        object.px = px;
        object.py = py;
        object.pw = pw;
        object.ph = ph;

        return object;
    },
    getPhonecaseInitProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPhonecaseBaseInfoXml();
        var option = this.getOptionXml();
        var face = this.getFaceXml();
        var photoLayer = this.getPhonecasePhotoLayerXml();
        var elements = this.getPhonecaseInitElemntsXml();
        var images = this.getImagesXml();

        ($(base).find('phoneCase')).append(option.firstChild.cloneNode(true));
        ($(base).find('phoneCase')).append(face.firstChild.cloneNode(true));
        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getPhonecaseCurrentProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPhonecaseBaseInfoXml();
        var option = this.getOptionXml();
        var face = this.getFaceXml();
        var photoLayer = this.getPhonecasePhotoLayerXml();
        var elements = this.getElementsXml();
        var images = this.getImagesXml();

        ($(base).find('phoneCase')).append(option.firstChild.cloneNode(true));
        ($(base).find('phoneCase')).append(face.firstChild.cloneNode(true));
        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },

    getPhonecaseInitElemntsXml: function() {
        var photolayer = this.getPhonecasePhotoLayer();
        var s = '<elements>';
        var x = 0;
        var y = 0;
        var width = photolayer.width;
        var height = photolayer.height;
        var px = x / photolayer.width;
        var py = y / photolayer.height;
        var ph = height / photolayer.height;
        var pw = width / photolayer.width;
        var rot = 0;
        var dep = 0;
        var imageid = '';
        var imgRot = false;
        var imgFlip = false;
        var cropPX = 0,
            cropPY = 0,
            cropPW = 1,
            cropPH = 1;
        s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
        s += '</elements>';
        return require('UtilXML').stringToXml(s);
    },

    getFaceXml: function() {
        var BaseSize = this.getPhonecaseBaseSize();
        var baseWidth = BaseSize.width;
        var baseHeight = BaseSize.height;

        var side = this.getPhonecaseSide();
        var sideTop = side.top;
        var sideBottom = side.bottom;
        var sideLeft = side.left;
        var sideRight = side.right;

        var edge = this.getPhonecaseEdge();
        var edgeTop = edge.top;
        var edgeBottom = edge.bottom;
        var edgeLeft = edge.left;
        var edgeRight = edge.right;
        var s = '';
        var projectLength = Store.projectSettings.length;
        for (var i = 0; i < projectLength; i++) {
            var currentProject = Store.projectSettings[i];
            s += '<face width="' + baseWidth + '" height="' + baseHeight + '" sideLeft="' + sideLeft + '" sideTop="' + sideTop + '" sideRight="' + sideRight + '" sideBottom="' + sideBottom + '" edgeLeft="' + edgeLeft + '" edgeTop="' + edgeTop + '" edgeRight="' + edgeRight + '" edgeBottom="' + edgeBottom + '">';
            s += '</face>';
        }
        return require('UtilXML').stringToXml(s);
    },

    getPhonecaseContent: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var object = {};

        var baseSize = this.getPhonecaseBaseSize();

        var baseWidth = baseSize.width;
        var baseHeight = baseSize.height;

        var side = this.getPhonecaseSide();
        var sideTop = side.top;
        var sideBottom = side.bottom;
        var sideLeft = side.left;
        var sideRight = side.right;

        var edge = this.getPhonecaseEdge();
        var edgeTop = edge.top;
        var edgeBottom = edge.bottom;
        var edgeLeft = edge.left;
        var edgeRight = edge.right;

        var bleed = this.getPhonecaseBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var foreground = this.getPhonecaseForeground();

        var width = baseWidth + bleedLeft + bleedRight + edgeLeft + edgeRight + sideLeft + sideRight;
        var height = baseHeight + bleedTop + bleedBottom + edgeTop + edgeBottom + sideTop + sideBottom;

        var realWidth = foreground.width - foreground.left - foreground.right;
        var realHeight = foreground.height - foreground.top - foreground.bottom;

        var ratio = baseWidth / realWidth;
        var bgWidth = foreground.width * ratio;
        var bgHeight = foreground.height * ratio;

        object.bgWidth = bgWidth;
        object.bgHeight = bgHeight;
        object.width = width;
        object.height = height;
        object.x = foreground.left * ratio - bleedLeft - sideLeft - edgeLeft;
        object.y = foreground.top * ratio - bleedTop - sideTop - edgeTop;
        object.bleedTop = bleedTop;
        object.bleedBottom = bleedBottom;
        object.bleedLeft = bleedLeft;
        object.bleedRight = bleedRight;
        object.sideTop = sideTop;
        object.sideBottom = sideBottom;
        object.sideLeft = sideLeft;
        object.sideRight = sideRight;
        object.edgeTop = edgeTop;
        object.edgeBottom = edgeBottom;
        object.edgeLeft = edgeLeft;
        object.edgeRight = edgeRight;
        return object;
    },

    //WallArts
    getWallArtsInitProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getBaseInfoXml();
        var option = this.getOptionXml();
        var frameBoard = this.getFrameBoardXml();
        var matteLayer = this.getMatteLayerXml();
        var photoLayer = this.getPhotoLayerXml();
        var elements = this.getWallArtsIntiElementXml();
        var images = this.getImagesXml();

        ($(base).find('photoFrame')).append(option.firstChild.cloneNode(true));
        ($(frameBoard).find('frameBoard')).append(matteLayer.firstChild.cloneNode(true));
        ($(photoLayer).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(frameBoard).find('frameBoard')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photoFrame')).append(frameBoard.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getWallArtsIntiElementXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhotoLayer();

        var width = photoLayer.width;
        var height = photoLayer.height;
        var s = '<elements>' +
            '<element type="PhotoElement" x="0" y="0" width="' + width + '" height="' + height + '" px="0" py="0" pw="1" ph="1" rot="0" dep="0" imageid="" imgRot="0" imgFlip="false" cropLUX="0" cropLUY="0" cropRLX="1" cropRLY="1" />' +
            '</elements>';
        return require('UtilXML').stringToXml(s);
    },
    getPrintInitProjectXml: function() {
        return require('UtilXML').xmlToString(this.getPrintInitXml());
    },
    getPrintInitXml: function() {

        var s = '<project schemaVersion="1" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.baseProject.product + '" productType="' + Store.projectType + '" baseSize="' + Store.baseProject.size + '" basePaper="' + Store.baseProject.paper + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<endpointToken></endpointToken>' +
            '<prints>' +
            '</prints>' +
            '<images>' +
            '</images>' +
            '</project>';

        return require('UtilXML').stringToXml(s);

    },
    getPrintBaseProjectXml: function() {
        var s = '<project schemaVersion="1" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.baseProject.product + '" productType="' + Store.projectType + '" baseSize="' + Store.baseProject.size + '" basePaper="' + Store.baseProject.paper + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<endpointToken></endpointToken>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },
    getPrintProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPrintBaseProjectXml();
        var content = this.getPrintContentXml();
        var images = this.getImagesXml();

        ($(base).find('project')).append(content.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getPrintContentXml: function() {

        var currentProjects = Store.projectSettings;
        var currentPages = Store.pages;
        var s = "";
        s += '<prints>';
        for (var i = 0; i < currentPages.length; i++) {
            var currentCanvas = currentPages[i].canvas;
            var elememts = currentCanvas.params;
            var currentProject = currentProjects[i];

            s += '<print id="' + require("UtilProject").guid() + '" quantity="' + currentProject.quantity + '" imageId="' + elememts[0].imageId + '">';
            s += '<spec version="' + require('SpecManage').getVersion() + '">';
            s += '<option id="paper" value="' + currentProject.paper + '"/>';
            s += '<option id="size" value="' + currentProject.size + '"/>';
            if (typeof(currentProject.surfaceType) != 'undefined' && currentProject.surfaceType !== 'undefined') {
                s += '<option id="surfaceType" value="' + currentProject.surfaceType + '"/>';
            }

            s += '</spec>';
            var baseSize = this.getPrintBaseSize({ 'size': currentProject.size, 'rotated': currentProject.rotated });
            var bleed = this.getPrintBleed(currentProject.size);
            var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
            var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';
            s += '<content id="' + require("UtilProject").guid() + '" width="' + baseSize.width + '" height="' + baseSize.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" borderLength="' + borderLength + '" borderColor="' + borderColor + '">';
            s += '<elements>';
            var x = elememts[0].x;
            var y = elememts[0].y;
            var width = elememts[0].width;
            var height = elememts[0].height;
            var px = x / currentCanvas.oriWidth;
            var py = y / currentCanvas.oriHeight;
            var ph = height / currentCanvas.oriHeight;
            var pw = width / currentCanvas.oriWidth;
            var rot = elememts[0].rotate;
            var dep = elememts[0].dep;
            var imageid = elememts[0].imageId;
            var imgRot = elememts[0].imageRotate;
            var imgFlip = false;
            var cropPX = elememts[0].cropPX,
                cropPY = elememts[0].cropPY,
                cropPW = elememts[0].cropPW,
                cropPH = elememts[0].cropPH;
            if (elememts[0].elType === 'text') {

                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[0].fontColor + '" fontSize="' + parseFloat(elememts[0].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[0].fontFamily) + '" fontWeight="' + elememts[0].fontWeight + '" textAlign="' + elememts[0].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[0].text) + ']]></element>';

            } else if (elememts[0].elType === 'logo') {

                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';

            } else if (elememts[0].elType === 'image') {

                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
            }

            s += '</elements>';
            s += '</content>';
            s += '</print>';
        };
        s += '</prints>';
        return require('UtilXML').stringToXml(s);
    },
    getRemarkProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPrintBaseProjectXml();
        var content = this.getRemarkContentXml();
        var images = this.getImagesXml();

        ($(base).find('project')).append(content.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getRemarkContentXml: function() {
        var currentProjects = Store.projectSettings;
        var currentPages = Store.pages;
        var remarkPages = [];
        for (var i = 0; i < currentProjects.length; i++) {
            if (Store.selectedSize) {
                if (Store.selectedPaper) {
                    if (currentProjects[i].size === Store.selectedSize && currentProjects[i].paper === Store.selectedPaper) {
                        remarkPages.push(currentPages[i]);
                        remarkPages[remarkPages.length - 1].oid = i;
                    }
                } else {
                    if (currentProjects[i].size === Store.selectedSize) {
                        remarkPages.push(currentPages[i]);
                        remarkPages[remarkPages.length - 1].oid = i;
                    }
                }
            } else {
                if (Store.selectedPaper) {
                    if (currentProjects[i].paper === Store.selectedPaper) {
                        remarkPages.push(currentPages[i]);
                        remarkPages[remarkPages.length - 1].oid = i;
                    }
                }
            }
        }
        if (remarkPages.length === 0) {
            remarkPages = currentPages;
            for (var i = 0; i < remarkPages.length; i++) {
                remarkPages[i].oid = i;
            }
        }
        var s = "";
        s += '<prints>';
        for (var i = 0; i < remarkPages.length; i++) {
            var currentCanvas = remarkPages[i].canvas;
            var elememts = currentCanvas.params;
            var currentProject = currentProjects[remarkPages[i].oid];

            s += '<print id="' + remarkPages[i].guid + '" quantity="' + currentProject.quantity + '" imageId="' + elememts[0].imageId + '">';
            s += '<spec version="' + require('SpecManage').getVersion() + '">';
            s += '<option id="paper" value="' + currentProject.paper + '"/>';
            s += '<option id="size" value="' + currentProject.size + '"/>';
            if (typeof(currentProject.surfaceType) != 'undefined' && currentProject.surfaceType !== 'undefined') {
                s += '<option id="surfaceType" value="' + currentProject.surfaceType + '"/>';
            }
            s += '</spec>';
            var baseSize = this.getPrintBaseSize({ 'size': currentProject.size, 'rotated': currentProject.rotated });
            var bleed = this.getPrintBleed(currentProject.size);
            var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
            var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';
            s += '<content id="' + currentCanvas.guid + '" width="' + baseSize.width + '" height="' + baseSize.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" borderLength="' + borderLength + '" borderColor="' + borderColor + '">';
            s += '<elements>';
            var x = elememts[0].x;
            var y = elememts[0].y;
            var width = elememts[0].width;
            var height = elememts[0].height;
            var px = x / currentCanvas.oriWidth;
            var py = y / currentCanvas.oriHeight;
            var ph = height / currentCanvas.oriHeight;
            var pw = width / currentCanvas.oriWidth;
            var rot = elememts[0].rotate;
            var dep = elememts[0].dep;
            var imageid = elememts[0].imageId;
            var imgRot = elememts[0].imageRotate;
            var imgFlip = false;
            var cropPX = elememts[0].cropPX,
                cropPY = elememts[0].cropPY,
                cropPW = elememts[0].cropPW,
                cropPH = elememts[0].cropPH;
            if (elememts[0].elType === 'text') {

                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + elememts[0].fontColor + '" fontSize="' + parseFloat(elememts[0].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[0].fontFamily) + '" fontWeight="' + elememts[0].fontWeight + '" textAlign="' + elememts[0].textAlign + '" ><![CDATA[' + encodeURIComponent(elememts[0].text) + ']]></element>';

            } else if (elememts[0].elType === 'logo') {

                s += '<element type="LogoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';

            } else if (elememts[0].elType === 'image') {

                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '" />';
            }

            s += '</elements>';
            s += '</content>';
            s += '</print>';
        };
        s += '</prints>';
        return require('UtilXML').stringToXml(s);
    },
    getPrintBaseSize: function(param) {
        var size, rotated;
        if (!param.size) {
            size = Store.baseProject.size;
        } else {
            size = param.size;
        }
        if (!param.rotated) {
            rotated = false;
        } else {
            rotated = param.rotated;
        }
        var sizeObject = require('SpecManage').getParameter('printsBaseSize', [{ key: 'product', value: 'print' }, { key: 'size', value: size }]);
        var object = {};
        if (rotated) {
            object.width = sizeObject.heightInInch * require('SpecManage').getDPI();
            object.height = sizeObject.widthInInch * require('SpecManage').getDPI();
        } else {
            object.width = sizeObject.widthInInch * require('SpecManage').getDPI();
            object.height = sizeObject.heightInInch * require('SpecManage').getDPI();
        }
        return object;
    },
    getPrintBleed: function(size) {
        if (!size) {
            size = Store.baseProject.size;
        }
        var sizeObject = require('SpecManage').getParameter('bleed', [{ key: 'size', value: size }]);
        var object = {};
        object.top = parseInt(sizeObject.left);
        object.bottom = parseInt(sizeObject.right);
        object.left = parseInt(sizeObject.top);
        object.right = parseInt(sizeObject.bottom);
        return object;
    },


    //  cards 产品
    getCardSpread: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var object = {};

        var baseSize = this.getCardBaseSize();

        var baseWidth = baseSize.width;
        var baseHeight = baseSize.height;

        var bleed = this.getPageBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var width = baseWidth + bleedLeft + bleedRight;
        var height = baseHeight + bleedTop + bleedBottom;

        var object = {};
        object.width = width;
        object.height = height;
        object.bleedTop = bleedTop;
        object.bleedBottom = bleedBottom;
        object.bleedLeft = bleedLeft;
        object.bleedRight = bleedRight;

        return object;
    },
    getCardBaseSize: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var product = currentProject.product;
        var size = currentProject.size;
        var format = currentProject.format;
        var orientation = currentProject.orientation;
        var sizeObject = require('SpecManage').getParameter('baseSize',[{key:'product',value:product},{key:'size',value:size},{key:'orientation',value:orientation},{key:'format',value:format}]);
        var object = {};

        object.width = sizeObject.widthInInch * require('SpecManage').getDPI();
        object.height = sizeObject.heightInInch * require('SpecManage').getDPI();

        return object;
    },
    getCardCurrentProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getCardsBaseProjectXml();
        var content = this.getCardsContentXml();
        var images = this.getImagesXml();
        var decorations = this.getDecorationXml();

        ($(base).find('project')).append(content.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));
        ($(base).find('project')).append(decorations.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getCardsBaseProjectXml: function() {
        if (Store.isPortal) { Store.deletedPhoto = 'false' }
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var s = '<project schemaVersion="1" clientId="web-h5" productType="' + currentProject.product + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<deletedPhoto>' + Store.deletedPhoto + '</deletedPhoto>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },
    getCardsContentXml: function() {
        var projectLength = Store.projectSettings.length;
        var s = '<card id="' + Store.cardId + '">';
        for (var i = 0; i < projectLength; i++) {
            var currentProject = Store.projectSettings[i];
            var option = this.getOptionXml(i);
            s += require('UtilXML').xmlToString(option);
            var contentXml = this.getCardContentXml(i);
            s += require('UtilXML').xmlToString(contentXml);
            var cardSetting = this.getCardSettingXml(i);
            s += require('UtilXML').xmlToString(cardSetting);
        }
        s += '</card>';
        return require('UtilXML').stringToXml(s);
    },
    getCardSettingXml: function(index) {
        var s = ' <cardSetting >';
        s += '<styleId value="' + Store.cardSetting.styleId + '"/>';
        s += '<festival value="' + Store.cardSetting.festival + '"/>';
        if(Store.templateGuid) {
            s += '<templateGuid value="' + Store.templateGuid + '"/>';
        }
        s += '</cardSetting>';
        return require('UtilXML').stringToXml(s);
    },
    getCardContentXml: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        };
        var currentProject = Store.projectSettings[index];
        var pages = Store.pages;
        var bleed = this.getPageBleed();
        var s = '<spreads>';
        var content = this.getCardSpread(index);
        for (var j = 0; j < pages.length; j++) {
            var currentPage = pages[j];
            s += '<spread id="' + currentPage.id + '" width="' + currentPage.width + '" height="' + currentPage.height + '" bleedTop="' + bleed.top + '" bleedBottom="' + bleed.bottom + '" bleedLeft="' + bleed.left + '" bleedRight="' + bleed.right + '" type="' + currentPage.type + '" month="0" year="0" tplGuid="' + currentPage.tplGuid + '" pageNumber="' + currentPage.pageNumber + '" styleId="' + currentPage.styleId + '" styleItemId="' + currentPage.styleItemId + '" w="' + currentPage.width + '" h="' + currentPage.height + '">'
            var elements = this.getCardElementsXml(j);
            s += require('UtilXML').xmlToString(elements);
            s += '</spread>';
        }
        s += '</spreads>';
        return require('UtilXML').stringToXml(s);
    },
    getCardElementsXml: function(index) {
        if (!index) {
            index = Store.currentSelectProjectIndex;
        }
        var currentProject = Store.projectSettings[index];
        var currentCanvas = Store.pages[index].canvas;
        var elememts = currentCanvas.params;
        var s = '<elements>';

        for (var i = 0; i < elememts.length; i++) {
            var index = elememts[i].index ? ' index="' + elememts[i].index + '" ' : '';
            var x = elememts[i].x;
            var y = elememts[i].y;
            var width = elememts[i].width;
            var height = elememts[i].height;
            var px = x / currentCanvas.oriWidth;
            var py = y / currentCanvas.oriHeight;
            var ph = height / currentCanvas.oriHeight;
            var pw = width / currentCanvas.oriWidth;
            var rot = elememts[i].rotate;
            var dep = elememts[i].dep;
            var imageid = elememts[i].imageId;
            var imgRot = elememts[i].imageRotate;
            var imgFlip = false;
            var cropPX = elememts[i].cropPX,
                cropPY = elememts[i].cropPY,
                cropPW = elememts[i].cropPW,
                cropPH = elememts[i].cropPH;
            var decorationid = elememts[i].decorationid;
            var decorationtype = elememts[i].decorationtype;
            var styleGuid = elememts[i].styleGuid;
            var styleId = elememts[i].styleId;
            var styleItemId = elememts[i].styleItemId;
            var styleImageId = elememts[i].styleImageId;
            var isFamilyName = elememts[i].isFamilyName || "false";
            var textAlign = elememts[i].textAlign || "left";
            var textVAlign = elememts[i].textVAlign || "top";
            var lineSpacing = elememts[i].lineSpacing || "1";
            var fontColor = elememts[i].fontColor;
            fontColor = (typeof(fontColor) == 'string' && fontColor.indexOf('#') > -1) ? require("UtilMath").hexToDec(fontColor) : fontColor;

            var addtionalAttrKeys = ['tagName', 'tagType', 'mandatory', 'constant', 'isEdit', 'isDisableRemind', 'order'];
            var addtionalAttrValues = [];
            addtionalAttrKeys.forEach(function(item) {
                if (item in elememts[i] && ((typeof elememts[i][item]) != 'undefined') && elememts[i][item] != 'undefined') {
                    addtionalAttrValues.push(' ' + item + '="' + elememts[i][item] + '"');
                }
            });
            var addtionalAttrString = addtionalAttrValues.join('');

            if (elememts[i].elType === 'style') {

                s += '<element type="CalendarStyleElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" styleId ="' + styleId + '" styleItemId ="' + styleItemId + '" styleGuid ="' + styleGuid + '" imageId="' + styleImageId + '"' + index + ' />';

            } else if (elememts[i].elType === 'text') {

                s += '<element type="TextElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" color="' + fontColor + '" fontSize="' + parseFloat(elememts[i].fontSize) / currentCanvas.oriHeight + '" fontFamily="' + encodeURIComponent(elememts[i].fontFamily) + '" fontWeight="' + elememts[i].fontWeight + '" textAlign="' + textAlign + '" textVAlign="' + textVAlign + '" lineSpacing="' + lineSpacing + '" isFamilyName="' + isFamilyName + '"' + addtionalAttrString + index + ' ><![CDATA[' + encodeURIComponent(elememts[i].text) + ']]></element>';

            } else if (elememts[i].elType === 'image') {

                s += '<element type="PhotoElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" imageid="' + imageid + '" imgRot="' + imgRot + '" imgFlip="' + imgFlip + '" cropLUX="' + cropPX + '" cropLUY="' + cropPY + '" cropRLX="' + (cropPX + cropPW) + '" cropRLY="' + (cropPY + cropPH) + '"' + index + ' />';
            } else if (elememts[i].elType === 'decoration') {
                if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height))
                    s += '<element type="DecorationElement" x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" px="' + px + '" py="' + py + '" pw="' + pw + '" ph="' + ph + '" rot="' + rot + '" dep="' + dep + '" decorationid="' + decorationid + '" decorationtype="' + decorationtype + '"' + index + ' />';
            }
        }
        s += '</elements>';
        return require('UtilXML').stringToXml(s);
    },
    getDecorationXml: function() {
        var s = '<decorations>';
        for (var i = 0; i < Store.allDecorationList.length; i++) {
            if (Store.allDecorationList[i].count) {
                var item = Store.allDecorationList[i];
                s += '<decoration guid="' + item.guid + '" name="' + item.name + '" type="' + item.type + '" count="' + item.count + '" displayRatio="' + item.displayRatio + '" width="' + item.width + '" height="' + item.height + '"/>'
            }
        };
        s += '</decorations>';
        return require('UtilXML').stringToXml(s);
    },
    getCardInitXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        Store.cardId = require("UtilProject").guid();
        var s = '<project schemaVersion="1" clientId="web-h5" productType="' + currentProject.product + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<deletedPhoto>false</deletedPhoto>' +
            '<card id="' + Store.cardId + '">' +
            '<spec version="1.0">' +
            '<option id="size" value="' + currentProject.size + '"/>' +
            '<option id="paper" value="' + currentProject.paper + '"/>' +
            '<option id="product" value="' + currentProject.product + '"/>' +
            '<option id="orientation" value="' + currentProject.orientation + '"/>' +
            '<option id="trim" value="' + currentProject.trim + '"/>' +
            '</spec>'
        var contentString = this.getCardContentInitString()
        s += contentString;
        s += '<cardSetting>' +
            '<styleId value="' + Store.styleId + '"/>' +
            '<festival value="' + Store.festival + '"/>' +
            '</cardSetting>' +
            '</card>' +
            '<images></images>' +
            '<decorations></decorations>' +
            '</project>';
        return s;
    },
    getCardContentInitString: function() {
        var product = Store.projectSettings[Store.currentSelectProjectIndex].product;
        var spread = this.getCardSpread();
        var spread = require("ProjectManage").getCardSpread();
        var orientation = Store.projectSettings[Store.selectedIdx].orientation;
        var product = Store.projectSettings[Store.selectedIdx].product;
        var coverWidth = product === "FD" && orientation == "PO" ? spread.width / 2 : spread.width;
        var coverHeight = product === "FD" && orientation == "LA" ? spread.height / 2 : spread.height;
        var s = '<spreads>';
        s += '<spread id="'+require("UtilProject").guid()+'" width="'+ coverWidth +'" height="'+ coverHeight +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="frontPage" month="0" year="0" tplGuid="null" pageNumber="0" styleId="'+ Store.styleId +'" styleItemId="0" w="'+ coverWidth +'" h="'+ coverHeight +'">' +
                '<elements>' +
                    (!Store.isBlankCard ?
                    '<element type="CalendarStyleElement" x="0" y="0" width="'+ coverWidth +'" height="'+ coverHeight +'" px="0" py="0" pw="1" ph="1" rot="0" dep="-999" styleId="'+ Store.styleId +'" styleItemId="0" styleGuid="'+ Store.styleGuid +'" imageId="0" />' : '')+
                '</elements>' +
              '</spread>' +
              '<spread id="'+require("UtilProject").guid()+'" width="'+ coverWidth +'" height="'+ coverHeight +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="backPage" month="0" year="0" tplGuid="null" pageNumber="1" styleId="'+ Store.styleId +'" styleItemId="1" w="'+ coverWidth +'" h="'+ coverHeight +'">' +
                '<elements>' +
                    (!Store.isBlankCard ?
                    '<element type="CalendarStyleElement" x="0" y="0" width="'+ coverWidth +'" height="'+ coverHeight +'" px="0" py="0" pw="1" ph="1" rot="0" dep="-999" styleId="'+ Store.styleId +'" styleItemId="1" styleGuid="'+ Store.styleGuid +'" imageId="1" />' : '')+
                '</elements>' +
              '</spread>'
        if( product === "FD" ){
            s += '<spread id="'+require("UtilProject").guid()+'" width="'+ spread.width +'" height="'+ spread.height +'" bleedTop="'+ spread.bleedTop +'" bleedBottom="'+ spread.bleedBottom +'" bleedLeft="'+ spread.bleedLeft +'" bleedRight="'+ spread.bleedRight +'" type="insidePage" month="0" year="0" tplGuid="null" pageNumber="2" styleId="'+ Store.styleId +'" styleItemId="2" w="'+ spread.width +'" h="'+ spread.height +'">' +
                    '<elements>' +
                    '</elements>' +
                  '</spread>'
        }
        s += '</spreads>';
        return s;
    },
    getPadcaseBaseInfoXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var product = currentProject.product;
        var s = '<project schemaVersion="2.0" createAuthor="web-h5|1.0|1" clientId="web-h5" product="' + Store.product + '" productType="' + Store.projectType + '">' +
            '<guid>' + Store.projectId + '</guid>' +
            '<userId>' + Store.userSettings.userId + '</userId>' +
            '<artisan>' + Store.userSettings.userName + '</artisan>' +
            '<title><![CDATA[' + Store.title + ']]></title>' +
            '<description/>' +
            '<createdDate></createdDate>' +
            '<updatedDate></updatedDate>' +
            '<endpointToken></endpointToken>' +
            '<padCase>' +
            '</padCase>' +
            '</project>';

        return require('UtilXML').stringToXml(s);
    },
    getPadcaseInitProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPadcaseBaseInfoXml();
        var option = this.getOptionXml();
        var face = this.getFaceXml();
        var photoLayer = this.getPhonecasePhotoLayerXml();
        var elements = this.getPhonecaseInitElemntsXml();
        var images = this.getImagesXml();

        ($(base).find('padCase')).append(option.firstChild.cloneNode(true));
        ($(base).find('padCase')).append(face.firstChild.cloneNode(true));
        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    getPadcaseCurrentProjectXml: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var base = this.getPadcaseBaseInfoXml();
        var option = this.getOptionXml();
        var face = this.getFaceXml();
        var photoLayer = this.getPhonecasePhotoLayerXml();
        var elements = this.getElementsXml();
        var images = this.getImagesXml();

        ($(base).find('padCase')).append(option.firstChild.cloneNode(true));
        ($(base).find('padCase')).append(face.firstChild.cloneNode(true));
        ($(base).find('face')).append(photoLayer.firstChild.cloneNode(true));
        ($(base).find('photosLayer')).append(elements.firstChild.cloneNode(true));
        ($(base).find('project')).append(images.firstChild.cloneNode(true));

        return require('UtilXML').xmlToString(base);
    },
    // 获取当前项目的projectSettings，如果当前项目不存在，获取baseProject的settings
    getProjectSettings: function(idx) {
        var projectSettings = {};
        var optionIds = require('SpecManage').getOptionIds();
        var currentProject = Store.projectSettings[idx || Store.currentSelectProjectIndex];

        if (!currentProject) {
            currentProject = Store.baseProject;
        }

        var projectSettingKeys = Object.keys(currentProject).filter(function(projectKey) {
            return optionIds.some(function(optionId) {
                return projectKey === optionId;
            });
        });

        projectSettingKeys.forEach(function(settingKey) {
            projectSettings[settingKey] = currentProject[settingKey];
        });

        return projectSettings;
    },
    // 获取当前项目的paramsList
    getParamsList: function(idx) {
        var projectSettings = this.getProjectSettings(idx);

        return Object.keys(projectSettings).map(function(settingKey) {
            return {
                key: settingKey,
                value: projectSettings[settingKey]
            }
        });
    },
    getSizedBgBorderParams: function(canvasId) {
        var canvasDom = document.getElementById(canvasId);
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;
        var foreground = currentCanvas.foreground;
        var oriBgWidth = currentCanvas.oriBgWidth;
        var oriBgHeight = currentCanvas.oriBgHeight;
        var oriWidth = currentCanvas.oriWidth;
        var oriHeight = currentCanvas.oriHeight;
        var ratio = canvasDom.width / oriBgWidth;
        var replaceX = Math.floor(foreground.left * ratio);
        var replaceY = Math.floor(foreground.top * ratio);
        var replaceWidth = Math.floor(oriWidth * ratio);
        var replaceHeight = Math.floor(oriHeight * ratio);

        return {
            x: replaceX,
            y: replaceY,
            width: replaceWidth,
            height: replaceHeight
        }
    },
    getWallArtsCurrentProjectJson: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };
        specObject.orientation = currentProject['rotated'] ? 'Landscape' : 'Portrait';
        var defaultPages = [this.getWallartsPages()];
        var json = {
            project: {
                "version": specVersion,
                "clientId": "web-h5",
                "createAuthor": "web-h5|1.1|1",
                "userId": Store.userSettings.userId,
                "artisan": Store.userSettings.userName,
                "title": Store.title,
                "updatedDate": require('UtilDateFormat').formatDateTime(new Date()),
                "createdDate": require('UtilDateFormat').formatDateTime(new Date()),
                "guid": Store.projectId,
                "summary": {
                    "defaultSetting": specObject
                },
                "pages": defaultPages,
                "images": this.getImages()

            }
        }

        return json;
    },
    getWallArtsInitProjectJson: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };
        specObject.orientation = 'Landscape';
        var defaultPages = [this.getWallartsPages(true)];
        var json = {
            project: {
                "version": specVersion,
                "clientId": "web-h5",
                "createAuthor": "web-h5|1.1|1",
                "userId": Store.userSettings.userId,
                "artisan": Store.userSettings.userName,
                "title": Store.title,
                "updatedDate": require('UtilDateFormat').formatDateTime(new Date()),
                "createdDate": require('UtilDateFormat').formatDateTime(new Date()),
                "guid": Store.projectId,
                "summary": {
                    "defaultSetting": specObject
                },
                "pages": defaultPages,
                "images": []

            }
        }

        return json;
    },
    getWallartsPages: function(isInit) {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhotoLayer();

        var bleed = this.getBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var x = photoLayer.x;
        var y = photoLayer.y;

        var width = photoLayer.width;
        var height = photoLayer.height;
        var tplGuid = currentProject.tplGuid;
        var tplSuitId = currentProject.tplSuitId;
        var frameBaseSize = this.getFrameBaseSize();


        var frameBorderThickness = this.getFrameBorderThickness();
        var frameBorderThicknessTop = frameBorderThickness.top;
        var frameBorderThicknessBottom = frameBorderThickness.bottom;
        var frameBorderThicknessLeft = frameBorderThickness.left;
        var frameBorderThicknessRight = frameBorderThickness.right;

        var canvasBorderThickness = this.getCanvasBorderThickness();
        var canvasBorderThicknessTop = canvasBorderThickness.top;
        var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
        var canvasBorderThicknessLeft = canvasBorderThickness.left;
        var canvasBorderThicknessRight = canvasBorderThickness.right;

        var boardInFrame = this.getBoardInFrame();
        var boardInFrameTop = boardInFrame.top;
        var boardInFrameBottom = boardInFrame.bottom;
        var boardInFrameLeft = boardInFrame.left;
        var boardInFrameRight = boardInFrame.right;

        var boardInMatting = this.getBoardInMatting();
        var boardInMattingTop = boardInMatting.top;
        var boardInMattingBottom = boardInMatting.bottom;
        var boardInMattingLeft = boardInMatting.left;
        var boardInMattingRight = boardInMatting.right;

        var borderColor = Store.bgColor + "";

        var color = this.getMatteStyleColor();

        var matteSize = this.getMatteSize();
        var matteTop = matteSize.top;
        var matteBottom = matteSize.bottom;
        var matteLeft = matteSize.left;
        var matteRight = matteSize.right;
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };
        var elements;
        if (isInit) {
            elements = [
                {
                    type: "PhotoElement",
                    x: "0",
                    y: "0",
                    width: width,
                    height: height,
                    px: "0",
                    py: "0",
                    pw: "1",
                    ph: "1",
                    rot: "0",
                    dep: "0",
                    imageid: "",
                    imgRot: "0",
                    imgFlip: false,
                    cropLUX: "0",
                    cropLUY: "0",
                    cropRLX: "1",
                    cropRLY: "1"
                }
            ];
        } else {
            elements = require('JsonProjectManage').getElements();
        }
        if(currentProject.product.indexOf('table_')> -1){
            return {
                "id": require("UtilProject").guid(),
                "width": width,
                "height": height,
                "bgColor": "#FFFFFF",
                "type": "Page",
                "bleed": {
                    "top": bleedTop,
                    "bottom": bleedBottom,
                    "left": bleedLeft,
                    "right": bleedRight
                },
                "elements": elements,
                "backend": {
                    "isPrint": true,
                    "slice": false
                },
                "quantity": 1,
                "spec":specObject,
                "frameBorder": {
                    "left": frameBorderThicknessLeft,
                    "top": frameBorderThicknessTop,
                    "right": frameBorderThicknessRight,
                    "bottom": frameBorderThicknessBottom
                },
                "borderInFrame": {
                    "left": boardInFrameLeft,
                    "top": boardInFrameTop,
                    "right": boardInFrameRight,
                    "bottom": boardInFrameBottom
                }
            }
        }else{
            return {
                "id": require("UtilProject").guid(),
                "width": width,
                "height": height,
                "bgColor": "#FFFFFF",
                "type": "Page",
                "bleed": {
                    "top": bleedTop,
                    "bottom": bleedBottom,
                    "left": bleedLeft,
                    "right": bleedRight
                },
                "elements": elements,
                "backend": {
                    "isPrint": true,
                    "slice": false
                },
                "quantity": 1,
                "spec":specObject,
                "frameBorder": {
                    "left": frameBorderThicknessLeft,
                    "top": frameBorderThicknessTop,
                    "right": frameBorderThicknessRight,
                    "bottom": frameBorderThicknessBottom
                },
                "borderInFrame": {
                    "left": boardInFrameLeft,
                    "top": boardInFrameTop,
                    "right": boardInFrameRight,
                    "bottom": boardInFrameBottom
                },
                "boardInMatting": {
                    "left": boardInMattingLeft,
                    "top": boardInMattingTop,
                    "right": boardInMattingRight,
                    "bottom": boardInMattingBottom
                },
                "matteLayer": {
                    "x": 0,
                    "y": 0,
                    "px": 0,
                    "py": 0,
                    "left": matteLeft,
                    "right": matteRight,
                    "top": matteTop,
                    "bottom": matteBottom,
                    "color": color,
                    "depth": 1
                },
                "canvasBorder": {
                    "left": canvasBorderThicknessLeft,
                    "top": canvasBorderThicknessTop,
                    "right": canvasBorderThicknessRight,
                    "bottom": canvasBorderThicknessBottom,
                    "color": borderColor
                }
            }

        }
        
    },
    getImages: function() {
        var images = [];
        for(var i = 0; i < Store.imageList.length; i++) {
          var item = Store.imageList[i];
          images.push({
            id: item.id,
            guid: item.guid,
            encImgId: item.encImgId,
            order: i,
            name: encodeURIComponent(item.name),
            width: item.width,
            height: item.height,
            shotTime: item.shotTime,
            orientation: item.orientation
          });
        }
        return images;
    },
    getPhonecaseCurrentProjectJson: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };
        var defaultPages = [this.getPhoneCasePages()];
        var json = {
            project: {
                "version": specVersion,
                "clientId": "web-h5",
                "createAuthor": "web-h5|1.1|1",
                "userId": Store.userSettings.userId,
                "artisan": Store.userSettings.userName,
                "title": Store.title,
                "updatedDate": require('UtilDateFormat').formatDateTime(new Date()),
                "createdDate": require('UtilDateFormat').formatDateTime(new Date()),
                "guid": Store.projectId,
                "summary": {
                    "defaultSetting": specObject
                },
                "pages": defaultPages,
                "images": this.getImages()

            }
        }

        return json;
    },
    getPhonecaseInitProjectJson: function() {
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };
        var defaultPages = [this.getPhoneCasePages(true)];
        var json = {
            project: {
                "version": specVersion,
                "clientId": "web-h5",
                "createAuthor": "web-h5|1.1|1",
                "userId": Store.userSettings.userId,
                "artisan": Store.userSettings.userName,
                "title": Store.title,
                "updatedDate": require('UtilDateFormat').formatDateTime(new Date()),
                "createdDate": require('UtilDateFormat').formatDateTime(new Date()),
                "guid": Store.projectId,
                "summary": {
                    "defaultSetting": specObject
                },
                "pages": defaultPages,
                "images": []

            }
        }

        return json;
    },
    getPhoneCasePages: function(isInit) {

        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var photoLayer = this.getPhonecasePhotoLayer();

        var bleed = this.getPhonecaseBleed();
        var bleedTop = bleed.top;
        var bleedBottom = bleed.bottom;
        var bleedLeft = bleed.left;
        var bleedRight = bleed.right;

        var x = photoLayer.x;
        var y = photoLayer.y;
        var px = photoLayer.px;
        var py = photoLayer.py;
        var pw = photoLayer.pw;
        var ph = photoLayer.ph;
        var width = photoLayer.width;
        var height = photoLayer.height;
        var optionIds = require('SpecManage').getOptionIds();
        var specObject = {};
        for (var i = 0; i < optionIds.length; i++) {
            specObject[optionIds[i]] = currentProject[optionIds[i]];
        };

        var elements;
        if (isInit) {
            elements = [
                {
                    type: "PhotoElement",
                    x: "0",
                    y: "0",
                    width: width,
                    height: height,
                    px: "0",
                    py: "0",
                    pw: "1",
                    ph: "1",
                    rot: "0",
                    dep: "0",
                    imageid: "",
                    imgRot: "0",
                    imgFlip: false,
                    cropLUX: "0",
                    cropLUY: "0",
                    cropRLX: "1",
                    cropRLY: "1"
                }
            ];
        } else {
            elements = require('JsonProjectManage').getElements();
        }
        
        return {
            "id": require("UtilProject").guid(),
            "width": width,
            "height": height,
            "bgColor": "#FFFFFF",
            "type": "Page",
            "bleed": {
                "top": bleedTop,
                "bottom": bleedBottom,
                "left": bleedLeft,
                "right": bleedRight
            },
            "elements": elements,
            "backend": {
                "isPrint": true,
                "slice": false
            },
            "quantity": 1,
            "spec": specObject
        }

        
        
    }

}