var UtilDateFormat = require('UtilDateFormat');

module.exports = {
  initProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var specObject = {};
    for (var i = 0; i < optionIds.length; i++) {
      specObject[optionIds[i]] = currentProject[optionIds[i]];
    };
    var defaultPages = [this.initPage()];
    return {
      project: {
        guid: '',
        version: specVersion,
        clientId: 'web-h5',
        createAuthor: 'web-h5|1.1|1',
        userId: Store.userSettings.userId,
        artisan: Store.userSettings.userName,
        createdDate: UtilDateFormat.formatDateTime(new Date()),
        updatedDate: UtilDateFormat.formatDateTime(new Date()),
        summary: {
        },
        spec: specObject,
        pages: defaultPages,
        images: []
      }
    };
  },

  initNewPrintProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var defaultSetting = {};
    var defaultPages = [];
    for (var i = 0; i < optionIds.length; i++) {
      defaultSetting[optionIds[i]] = currentProject[optionIds[i]];
    };
    return {
      project: {
        version: specVersion,
        clientId: 'web-h5',
        createAuthor: 'web-h5|1.1|1',
        userId: Store.userSettings.userId,
        artisan: Store.userSettings.userName,
        createdDate: UtilDateFormat.formatDateTime(new Date()),
        updatedDate: UtilDateFormat.formatDateTime(new Date()),
        summary: {
          defaultSetting: defaultSetting
        },
        pages: defaultPages,
        images: []
      }
    };
  },

  getCurrentProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var specObject = {};
    for (var i = 0; i < optionIds.length; i++) {
      specObject[optionIds[i]] = currentProject[optionIds[i]];
    };
    var pages = this.getPages();
    var images = this.getImages();
    return {
      project: {
        guid: Store.projectId,
        version: specVersion,
        clientId: 'web-h5',
        createAuthor: 'web-h5|1.1|1',
        userId: Store.userSettings.userId,
        artisan: Store.userSettings.userName,
        createdDate: Store.createdDate,
        updatedDate: UtilDateFormat.formatDateTime(new Date()),
        summary: {
        },
        spec: specObject,
        pages: pages,
        images: images
      }
    };
  },
  getSkuJson: function() {
    var userSettings = Store.userSettings;
    var optionIds = require('SpecManage').getOptionIds();
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];

    var skuJson = {
      project: {
        "version": specVersion,
        "clientId": "web-h5",
        "createAuthor": "web-h5|1.1|1",
        "userId": userSettings.userId,
        "artisan": userSettings.userName,
      }
    };
    for (var i = 0; i < optionIds.length; i++) {
      skuJson['project'][optionIds[i]] = currentProject[optionIds[i]];
    };
    return skuJson;
  },
  getBaseSize: function(pageIdx) {
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var optionIds = require('SpecManage').getOptionIds();
    var paramArray = [];
    optionIds.forEach(function(optionId) {
      paramArray.push({key: optionId, value: currentProject[optionId]});
    });
    var sizeObject = require('SpecManage').getParameter('baseSizeInInch', paramArray);

    return {
      width: sizeObject.width * require('SpecManage').getDPI(),
      height: sizeObject.height * require('SpecManage').getDPI()
    };
  },
  getBleedSize: function(pageIdx) {
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var DPI = require('SpecManage').getDPI();
    var size = currentProject.size;
    var product = currentProject.product;
    var bleedObject = require('SpecManage').getParameter('bleedInInch', [{ key: 'product', value: product }, { key: 'size', value: size }]);

    return {
      top: bleedObject.top * DPI,
      right: bleedObject.right * DPI,
      bottom: bleedObject.bottom * DPI,
      left: bleedObject.left * DPI
    }
  },
  getLMCBaseSize: function(pageIdx) {
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var size = currentProject.size;
    var product = currentProject.product;
    var frameStyle = currentProject.frameStyle;
    var orientation = currentProject.orientation;
    var sizeObject = require('SpecManage').getParameter('frameBaseSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle },{ key: 'size', value: size },{ key: 'orientation', value: orientation }]);

    return {
      width: parseFloat(sizeObject.widthInInch) * require('SpecManage').getDPI(),
      height: parseFloat(sizeObject.heightInInch) * require('SpecManage').getDPI()
    };
  },
  getLMCBleedSize: function(pageIdx) {
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var size = currentProject.size;
    var product = currentProject.product;
    var bleedObject = require('SpecManage').getParameter('bleed', [{ key: 'product', value: product }, { key: 'size', value: size }]);

    return {
      top: parseFloat(bleedObject.top),
      right: parseFloat(bleedObject.right),
      bottom: parseFloat(bleedObject.bottom),
      left: parseFloat(bleedObject.left)
    }
  },
  getLMCCanvasBorder:function(pageIdx){
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var size = currentProject.size;
    var product = currentProject.product;
    var size = currentProject.size;
    var canvasBorderSize = currentProject.canvasBorderSize;
    var canvasBorderObject = require('SpecManage').getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'size', value: size } , { key: 'canvasBorderSize', value: canvasBorderSize } ]);

    return {
      top: parseFloat(canvasBorderObject.top),
      right: parseFloat(canvasBorderObject.right),
      bottom: parseFloat(canvasBorderObject.bottom),
      left: parseFloat(canvasBorderObject.left)
    }
  },
  getCanvasBorder: function() {
    // var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    // var currentProject = Store.projectSettings[useIndex];
    // var size = currentProject.size;
    // var product = currentProject.product;
    // var frameStyle = currentProject.frameStyle;
    // var canvasBorderSize = currentProject.canvasBorderSize;
    // var canvasBorderObject = require('SpecManage').getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle } , { key: 'canvasBorderSize', value: canvasBorderSize } ]);

    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  },
  getLMCPhotoLayer: function(pageIdx) {
      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
      var currentProject = Store.projectSettings[useIndex];
      var orientation = currentProject.orientation;
      var object = {};

      var frameBaseSize = this.getLMCBaseSize(useIndex);

      var canvasBorderThickness = this.getLMCCanvasBorder(useIndex);
      var canvasBorderThicknessTop = canvasBorderThickness.top;
      var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
      var canvasBorderThicknessLeft = canvasBorderThickness.left;
      var canvasBorderThicknessRight = canvasBorderThickness.right;



      var bleed = this.getLMCBleedSize(useIndex);
      var bleedTop = bleed.top;
      var bleedBottom = bleed.bottom;
      var bleedLeft = bleed.left;
      var bleedRight = bleed.right;

      var baseWidth = frameBaseSize.width+canvasBorderThicknessLeft+canvasBorderThicknessRight;
      var baseHeight = frameBaseSize.height+canvasBorderThicknessTop+canvasBorderThicknessBottom;

      var x = 0;
      var y = 0;
      var width = 0;
      var height = 0;
      if (currentProject.orientation === 'Portrait') {
          x = -bleedBottom;
          y = -bleedLeft;
          width = baseWidth + bleedTop + bleedBottom ;
          height = baseHeight + bleedLeft + bleedRight ;
      } else {
          x = -bleedLeft;
          y = -bleedTop;
          width = baseWidth + bleedLeft + bleedRight;
          height = baseHeight + bleedTop + bleedBottom;
      }
      var px = x / width;
      var py = y / height;
      var pw = width / width;
      var ph = height / height;

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
  getLMCDefaultElement: function(pageIdx) {
      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
      var photoLayer=this.getLMCPhotoLayer(useIndex);
      var canvasBorder=this.getLMCCanvasBorder(useIndex);
      var bleed=this.getLMCBleedSize(useIndex);
      var x=bleed.left+canvasBorder.left;
      var y=bleed.top+canvasBorder.top;
      var width=photoLayer.width-canvasBorder.left-canvasBorder.right-bleed.left-bleed.right;
      var height=photoLayer.height-canvasBorder.top-canvasBorder.bottom-bleed.top-bleed.bottom;
      return {
          "id": require("UtilProject").guid(),
          "type": "PhotoElement",
          "elType": "image",
          "x": x,
          "y": y,
          "width": width,
          "height": height,
          "px": x/photoLayer.width,
          "py": y/photoLayer.height,
          "pw": width/photoLayer.width,
          "ph": height/photoLayer.height,
          "imgFlip": false,
          "rot": 0,
          "imgRot": 0,
          "encImgId": "",
          "imageid": "",
          "dep": 0,
          "cropLUX": 0,
          "cropLUY": 0,
          "cropRLX": 1,
          "cropRLY": 1,
          "lastModified": UtilDateFormat.formatDateTime(new Date())
      }

  },
  getDefaultElement: function(pageWith, pageHeight) {

      return {
          "id": require("UtilProject").guid(),
          "type": "PhotoElement",
          "elType": "image",
          "x": 0,
          "y": 0,
          "width": pageWith,
          "height": pageHeight,
          "px": 0,
          "py": 0,
          "pw": 1,
          "ph": 1,
          "imgFlip": false,
          "rot": 0,
          "imgRot": 0,
          "encImgId": "",
          "imageid": "",
          "dep": 0,
          "cropLUX": 0,
          "cropLUY": 0,
          "cropRLX": 1,
          "cropRLY": 1,
          "lastModified": UtilDateFormat.formatDateTime(new Date())
      }
  },
  initPage: function() {
    var baseSize = this.getBaseSize();
    var bleedSize = this.getBleedSize();
    var pageWith = baseSize.width + bleedSize.left + bleedSize.right;
    var pageHeight = baseSize.height + bleedSize.top + bleedSize.right;
    var defaultElements = [this.getDefaultElement(pageWith, pageHeight)];
    return {
      "id": require("UtilProject").guid(),
      "width": pageWith,
      "height": pageHeight,
      "type": "Page",
      "bleed": bleedSize,
      "elements": defaultElements,
      "backend": {
          "isPrint": true
      }
    }
  },
  getPhotoLayer: function(pageIdx) {
    var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
    var currentProject = Store.projectSettings[useIndex];
    var orientation = currentProject.orientation;

    var baseSize = this.getBaseSize(useIndex);
    var bleedSize = this.getBleedSize();
    var pageWith = baseSize.width + bleedSize.left + bleedSize.right;
    var pageHeight = baseSize.height + bleedSize.top + bleedSize.right;

    var x = 0;
    var y = 0;
    var width = 0;
    var height = 0;
    if (currentProject.orientation === 'Portrait') {
        x = -bleedSize.bottom;
        y = -bleedSize.left;
        width = baseSize.width + bleedSize.left + bleedSize.right;
        height = baseSize.height + bleedSize.top + bleedSize.right;
    } else {
        x = -bleedSize.left;
        y = -bleedSize.top;
        width = baseSize.width + bleedSize.left + bleedSize.right;
        height = baseSize.height + bleedSize.top + bleedSize.right;
    }

    return {
      x: x,
      y: y,
      width: width,
      height: height,
      px: x / baseSize.width,
      py: y / baseSize.height,
      pw: width / baseSize.width,
      ph: height / baseSize.height
    }
  },
  getPages: function() {
    var pages = [];
    var bleedSize = this.getBleedSize();
    var photoLayer = this.getPhotoLayer();
    var pageWith = photoLayer.width;
    var pageHeight = photoLayer.height;
    var elements = this.getElements();

    for(var i = 0; i < Store.pages.length; i++ ) {
        pages.push({
          "width": pageWith,
          "height": pageHeight,
          "type": "Page",
          "bleed": bleedSize,
          "elements": this.getElements(i),
          "backend": {
            "isPrint": true
          }
        })
    }
    return pages;
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
  getElements: function(index) {
    var useIndex = (typeof index !== 'undefined') ? index : Store.currentSelectProjectIndex;
    // if(!index){
    //   index=Store.currentSelectProjectIndex;
    // }
    var currentProject = Store.projectSettings[useIndex];
    var currentCanvas = Store.pages[useIndex].canvas;
    var elements = currentCanvas.params;
    var outputElements = [];

    for (var i = 0; i < elements.length; i++) {
      var currentElement = elements[i];
      var elementObj = {
        x: currentElement.x,
        y: currentElement.y,
        px: currentElement.x / currentCanvas.oriWidth,
        py: currentElement.y / currentCanvas.oriHeight,
        width: currentElement.width,
        height: currentElement.height,
        pw: currentElement.width / currentCanvas.oriWidth,
        ph: currentElement.height / currentCanvas.oriHeight,
        dep: currentElement.dep,
        rot: currentElement.rotate
      };
      switch(currentElement.elType) {
        case 'text':
          {
            elementObj.type = "TextElement";
            elementObj.color = currentElement.fontColor;
            elementObj.text = encodeURIComponent(currentElement.text);
            elementObj.fontWeight = currentElement.fontWeight;
            elementObj.textAlign = currentElement.textAlign;
            elementObj.fontFamily = encodeURIComponent(currentElement.fontFamily);
            elementObj.fontSize = parseFloat(currentElement.fontSize)  / currentCanvas.oriHeight;
          }
          break;
        case 'image':
          {
            var encImgId = currentElement.encImgId;
            if (!encImgId) {
              Store.imageList.some(function(img){
                if(img.id == currentElement.imageId) {
                  encImgId = img.encImgId;
                  return true;
                }
              })
            }
            elementObj.type = "PhotoElement";
            elementObj.imageid = currentElement.imageId;
            elementObj.encImgId = encImgId;
            elementObj.imgRot = currentElement.imageRotate;
            elementObj.imgFlip = false;
            elementObj.cropLUX = parseFloat(currentElement.cropPX).toString();
            elementObj.cropLUY = parseFloat(currentElement.cropPY).toString();
            elementObj.cropRLX = (parseFloat(currentElement.cropPX) + parseFloat(currentElement.cropPW)).toString();
            elementObj.cropRLY = (parseFloat(currentElement.cropPY) + parseFloat(currentElement.cropPH)).toString();
            elementObj.style = {
              brightness: currentElement.style && currentElement.style.brightness ? currentElement.style.brightness : 0,
              "effectId": 0,
              "opacity": 100
            }
            elementObj.border = {
              size: 0,
              "color": "#000000",
              "opacity": 100
            }
          }
          break;
      }
      outputElements.push(elementObj);
    }
    return outputElements;
  },

  getPrintBaseSize:function(params){
    var rotated = false;
    var paramsList = require('ProjectManage').getParamsList();
    if(params.size){
        paramsList = paramsList.map(function(param) {
            if(param.key === 'size') {
                param.value = params.size;
            }

            return param;
        });
    }
    if(params.rotated){
        rotated = params.rotated;
    }
    var sizeObject = require('SpecManage').getParameter('baseSizeInInch', paramsList);
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

  getPrintBleed: function(params) {
    var rotated = false;
    var DPI = require('SpecManage').getDPI();
    var paramsList = require('ProjectManage').getParamsList();

    paramsList = paramsList.map(function(param) {
        if(param.key === 'size') {
            if(params && params.size){
                param.value = params.size;
            } else {
                param.value = Store.baseProject.size;
            }
        }

        return param;
    });

    if(params.rotated){
        rotated = params.rotated;
    }

    var sizeObject = require('SpecManage').getParameter('bleedInInch', paramsList);
    var object = {};
    object.top = parseInt(sizeObject.top * DPI);
    object.bottom = parseInt(sizeObject.bottom * DPI);
    object.left = parseInt(sizeObject.left * DPI);
    object.right = parseInt(sizeObject.right * DPI);

    if(rotated) {
      object.top = parseInt(sizeObject.left * DPI);
      object.bottom = parseInt(sizeObject.right * DPI);
      object.left = parseInt(sizeObject.top * DPI);
      object.right = parseInt(sizeObject.bottom * DPI);
    }
    return object;
  },

  getPrintCornerRadius: function(params) {
    var DPI = require('SpecManage').getDPI();
    var paramsList = require('ProjectManage').getParamsList();

    paramsList = paramsList.map(function(param) {
        if(param.key === 'size') {
            if(params && params.size){
                param.value = params.size;
            } else {
                param.value = Store.baseProject.size;
            }
        }

        return param;
    });

    var cornerRadius = require('SpecManage').getParameter('cornerRadiusInInch', paramsList).value;
    cornerRadius = (cornerRadius - 0) * DPI;

    return cornerRadius;
  },

  getNewPrintCurrentProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var defaultSetting = {};
    for (var i = 0; i < optionIds.length; i++) {
      defaultSetting[optionIds[i]] = Store.baseProject[optionIds[i]];
    };
    var pages = this.getNewPrintPages();
    var images = this.getImages();
    return {
      project: {
        guid: Store.projectId,
        version: specVersion,
        clientId: 'web-h5',
        createAuthor: 'web-h5|1.1|1',
        userId: Store.userSettings.userId,
        artisan: Store.userSettings.userName,
        createdDate: Store.createdDate,
        updatedDate: UtilDateFormat.formatDateTime(new Date()),
        summary: {
          defaultSetting: defaultSetting
        },
        pages: pages,
        images: images
      }
    };
  },

  getNewPrintPages: function() {
    var pages = [];
    var currentProjects = Store.projectSettings;
    var currentPages = Store.pages;
    var optionIds = require('SpecManage').getOptionIds();

    for (var i = 0 ;i < currentPages.length; i++) {
      var currentCanvas = currentPages[i].canvas;
      var elements = this.getNewPrinteElements(currentCanvas, currentCanvas.params);
      var currentProject = currentProjects[i];

      var pageId = currentPages[i].guid || require("UtilProject").guid();
      var quantity = currentProject.quantity;
      var specVersion = require('SpecManage').getVersion();
      var specObject = {};
      var type = 'Print';
      for (var j = 0; j < optionIds.length; j++) {
        specObject[optionIds[j]] = currentProject[optionIds[j]];
      };
      specObject.quantity = quantity;

      var baseSize=this.getPrintBaseSize({size: currentProject.size, rotated: currentProject.rotated});
      var bleed = this.getPrintBleed({size: currentProject.size, rotated: currentProject.rotated});
      var borderLength = currentPages[i].canvas.borderLength ? currentPages[i].canvas.borderLength : 0;
      var borderColor = currentPages[i].canvas.borderColor ? currentPages[i].canvas.borderColor : 'none';

      pages.push({
        id: pageId,
        spec: specObject,
        width: baseSize.width + bleed.left + bleed.right,
        height: baseSize.height + bleed.top + bleed.bottom,
        type: type,
        bleed: bleed,
        border: {
          color: borderColor,
          size: borderLength
        },
        elements: elements,
        backend: {
          isPrint: true
        }
      });
    }

    return pages;
  },

  getNewPrinteElements: function(currentCanvas, params) {
    var elements = params.map(function(param) {

      var id = param.guid || require("UtilProject").guid();
      var x = param.x;
      var y = param.y;
      var width = param.width;
      var height = param.height;
      var px = x / currentCanvas.oriWidth;
      var py = y / currentCanvas.oriHeight;
      var ph = height / currentCanvas.oriHeight;
      var pw = width / currentCanvas.oriWidth;
      var rot = param.rotate;
      var dep = param.dep;
      var imageid = param.imageId;
      var imgRot = param.imageRotate;
      var imgFlip = false;
      var cropPX = param.cropPX,
          cropPY = param.cropPY,
          cropPW = param.cropPW,
          cropPH = param.cropPH;
      var brightness = param.style && param.style.brightness ? param.style.brightness : 0;

      var theImage = Store.imageList.filter(function(image) {
        return image.id === param.imageId;
      });

      var element = {
        id: id,
        x: x,
        y: y,
        width: width,
        height: height,
        px: px,
        py: py,
        pw: pw,
        ph: ph,
        rot: rot,
        dep: dep
      }
      if(param.elType==='text'){
        element.type = 'TextElement';
        element.color = param.fontColor;
        element.fontSize = parseFloat(param.fontSize) / currentCanvas.oriHeight;
        element.fontFamily = encodeURIComponent(param.fontFamily);
        element.fontWeight = param.fontWeight;
        element.textAlign = param.textAlign;
        element.text = encodeURIComponent(param.text);
      }else if(param.elType==='logo'){
        element.type = 'LogoElement';

      }else if(param.elType==='image'){
        element.type = 'PhotoElement';
        element.imageid = imageid;
        element.imgFlip = imgFlip;
        element.imgRot = imgRot;
        element.encImgId = theImage.length ? theImage[0].encImgId : '';
        element.cropLUX = cropPX;
        element.cropLUY = cropPY;
        element.cropRLX = (cropPX + cropPW);
        element.cropRLY = (cropPY + cropPH);
        element.style = {
          brightness: brightness,
          effectId: 0,
          opacity: 100
        };
        element.border = {
          "size": 0,
          "color": "#000000",
          "opacity": 100
        }
      }

      return element;
    });

    return elements;
  },
  getNewPrintSkuJson: function(projectJson) {
    var projects = projectJson.project.pages;
    var specVersion = projectJson.project.version;
    var clientId = projectJson.project.clientId;
    var createAuthor = projectJson.project.createAuthor;
    var userId = projectJson.project.userId;
    var artisan = projectJson.project.artisan;
    var skuJson = {};

    var defaultSetting = projectJson.project.summary.defaultSetting;
    var isLittlePrintBox = defaultSetting ? defaultSetting.product === 'LPP' : false;
    var isLSCProduct = defaultSetting ? defaultSetting.product === 'LSC' : false;

    var optionIds = require('SpecManage').getOptionIds();

    if(projects.length === 0) {
      defaultSetting.id = 'defaultSetting';
      defaultSetting.version = specVersion;
      defaultSetting.clientId = clientId;
      defaultSetting.createAuthor = createAuthor;
      defaultSetting.userId = userId;
      defaultSetting.artisan = artisan;
      defaultSetting.quantity = 1;

      skuJson = {
        defaultSetting: defaultSetting
      };
    }

    projects.forEach(function(project) {
      if((isLittlePrintBox || isLSCProduct) && Object.keys(skuJson).length > 0) return;

      skuJson[project.id] = {
        id: project.id,
        version: specVersion,
        clientId: clientId,
        createAuthor: createAuthor,
        userId: userId,
        artisan: artisan,
        quantity: project.spec ? project.spec.quantity : 1
      };

      for (var i = 0; i < optionIds.length; i++) {
        skuJson[project.id][optionIds[i]] = project.spec[optionIds[i]];
      };
    });

    return skuJson;
  },

  getNewPrintRemarkPages: function() {
    var currentProjects = Store.projectSettings;
    var currentPages = Store.pages;
    var remarkPages = [];
    var pages = [];
    var optionIds = require('SpecManage').getOptionIds();

    for(var i=0;i<currentProjects.length;i++){
      if(Store.selectedSize){
        if(Store.selectedPaper){
          if(currentProjects[i].size===Store.selectedSize && currentProjects[i].paper===Store.selectedPaper){
            remarkPages.push(currentPages[i]);
            remarkPages[remarkPages.length-1].oid = i;
          }
        }else{
          if(currentProjects[i].size===Store.selectedSize){
            remarkPages.push(currentPages[i]);
            remarkPages[remarkPages.length-1].oid = i;
          }
        }
      }else{
        if(Store.selectedPaper){
          if(currentProjects[i].paper===Store.selectedPaper){
            remarkPages.push(currentPages[i]);
            remarkPages[remarkPages.length-1].oid = i;
          }
        }
      }
    }
    if(remarkPages.length===0){
      remarkPages = currentPages;
      for(var i=0;i<remarkPages.length;i++){
        remarkPages[i].oid = i;
      }
    }

    for (var i = 0 ;i <remarkPages.length; i++) {
      var currentCanvas=remarkPages[i].canvas;
      var elements = this.getNewPrinteElements(currentCanvas, currentCanvas.params);
      var currentProject=currentProjects[remarkPages[i].oid];

      var pageId = remarkPages[i].guid || require("UtilProject").guid();
      var quantity = currentProject.quantity;
      var specVersion = require('SpecManage').getVersion();
      var specObject = {};
      var type = 'Print';
      for (var j = 0; j < optionIds.length; j++) {
        specObject[optionIds[j]] = currentProject[optionIds[j]];
      };

      specObject.quantity = quantity;

      var baseSize=this.getPrintBaseSize({size: currentProject.size, rotated: currentProject.rotated});
      var bleed = this.getPrintBleed({size: currentProject.size});
      var borderLength = remarkPages[i].canvas.borderLength ? remarkPages[i].canvas.borderLength : 0;
      var borderColor = remarkPages[i].canvas.borderColor ? remarkPages[i].canvas.borderColor : 'none';

      if(quantity) {
        pages.push({
          id: pageId,
          spec: specObject,
          width: baseSize.width,
          height: baseSize.height,
          type: type,
          quantity: quantity,
          bleed: bleed,
          border: {
            color: borderColor,
            size: borderLength
          },
          elements: elements,
          backend: {
            isPrint: true
          }
        });
      }
    };

    return pages;
  },

  getNewPrintRemarkProject : function(){
        var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
        var projectJson = this.getNewPrintCurrentProjectJson();
        var pages = this.getNewPrintRemarkPages();
        var images = this.getImages();

        projectJson.project.pages = pages;
        projectJson.project.images = images;

        return projectJson;
  },

  getWallartsSkuJson: function(projectJson) {
    var projects = projectJson.project.pages;
    var specVersion = projectJson.project.version;
    var clientId = projectJson.project.clientId;
    var createAuthor = projectJson.project.createAuthor;
    var userId = projectJson.project.userId;
    var artisan = projectJson.project.artisan;
    var skuJson = {};

    var defaultSetting = projectJson.project.summary.defaultSetting;
    var isLittlePrintBox = defaultSetting ? defaultSetting.product === 'LPP' : false;
    var isLSCProduct = defaultSetting ? defaultSetting.product === 'LSC' : false;

    var optionIds = require('SpecManage').getOptionIds();

    defaultSetting.id = projects[0].id;
    defaultSetting.version = specVersion;
    defaultSetting.clientId = clientId;
    defaultSetting.createAuthor = createAuthor;
    defaultSetting.userId = userId;
    defaultSetting.artisan = artisan;
    defaultSetting.quantity = 1;

    skuJson[projects[0].id] = defaultSetting
    return skuJson;
  },
};
