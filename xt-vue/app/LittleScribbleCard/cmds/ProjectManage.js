var UtilDateFormat = require('UtilDateFormat');

module.exports = {
  initProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var defaultSetting = {};
    var initPages = $.extend(true,[],this.initPages());

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
        pages: initPages,
        images: []
      }
    };
  },

  initPages: function() {
    var pages = [];
    var baseSize = require('JsonProjectManage').getBaseSize();
    var bleedSize = require('JsonProjectManage').getBleedSize();
    var pageWith = baseSize.width + bleedSize.left + bleedSize.right;
    var pageHeight = baseSize.height + bleedSize.top + bleedSize.right;
    // var defaultElements = [require('JsonProjectManage').getDefaultElement(pageWith, pageHeight)];

    // 获取初始化page的spec
    var optionIds = require('SpecManage').getOptionIds();
    var currentProject = Store.projectSettings[Store.currentSelectProjectIndex];
    var specObject = {};
    for (var i = 0; i < optionIds.length; i++) {
      specObject[optionIds[i]] = currentProject[optionIds[i]];
    };
    specObject.quantity = 1;

    for(var i = 0; i < Store.LSCPageNum; i++){
      pages.push({
        "id": require("UtilProject").guid(),
        "width": pageWith,
        "height": pageHeight,
        "type": "Page",
        "bleed": bleedSize,
        "spec": specObject,
        "elements": [require('JsonProjectManage').getDefaultElement(pageWith, pageHeight)],
        "backend": {
            "isPrint": true
        }
      });
    }
    return pages;
  },

  getCurrentProjectJson: function() {
    var optionIds = require('SpecManage').getOptionIds();
    var defaultSetting = {};
    for (var i = 0; i < optionIds.length; i++) {
      defaultSetting[optionIds[i]] = Store.baseProject[optionIds[i]];
    };
    var specVersion = $(Store.spec.specXml).find('product-spec').attr('version');
    var pages = this.getPages();
    var images = require('JsonProjectManage').getImages();
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

  getPages: function() {
    var pages = [];

    for(var i = 0; i < Store.pages.length; i++ ) {
      if(Store.pages[i].isDeleted || Store.projectSettings[i].quantity === 0)continue;

      var bleedSize = require('JsonProjectManage').getBleedSize(i);
      var photoLayer = require('JsonProjectManage').getPhotoLayer(i);
      var pageWith = photoLayer.width;
      var pageHeight = photoLayer.height;
      var elements = require('JsonProjectManage').getElements(i);

      // 获取page的spec
      var optionIds = require('SpecManage').getOptionIds();
      var currentProject = Store.projectSettings[i];
      var specObject = {};
      for (var j = 0; j < optionIds.length; j++) {
        specObject[optionIds[j]] = currentProject[optionIds[j]];
      };
      specObject.quantity = currentProject.quantity;
      var pageId = Store.pages[i].guid || require("UtilProject").guid();

      pages.push({
        "id": pageId,
        "width": pageWith,
        "height": pageHeight,
        "type": "Page",
        "spec": specObject,
        "bleed": bleedSize,
        "elements": require('JsonProjectManage').getElements(i),
        "backend": {
          "isPrint": true
        }
      })
    }
    return pages;
  }
};
