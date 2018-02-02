var Vue = require('vuejs');
var CompUpgradePhotoElement = Vue.component('upgrade-photo-element');

module.exports = {

    upgradeProject: function(oriSize) {

        var size = Store.upgradeSizeMaps[oriSize];
        console.log('size',size);
        var upgradeCanvas;
        if(!Store.upgradeCanvas){
          upgradeCanvas = {};
        }else{
          upgradeCanvas = Store.upgradeCanvas
        }
        if (Store.pages.length > 0) {
            var pageIdx = -1;

            Store.pages.forEach(function(item,index){
              if(pageIdx === -1 &&  !item.isDeleted){
                pageIdx = index;
              }

            });
            var currentCanvas = Store.pages[pageIdx].canvas;
            var frameBaseSize = this.getLMCBaseSize(pageIdx,size);
            var bleedSize = this.getLMCBleedSize(pageIdx,size);
            var photoLayer = this.getLMCPhotoLayer(pageIdx,size);
            var canvasBorder = this.getLMCCanvasBorder(pageIdx,size);
            var pageWith = photoLayer.width;
            var pageHeight = photoLayer.height;

            upgradeCanvas.realBleedings = bleedSize;
            upgradeCanvas.frameBaseSize = frameBaseSize;
            upgradeCanvas.canvasBordeThickness = canvasBorder;
            upgradeCanvas.mirrorSize = { top: upgradeCanvas.canvasBordeThickness.top + upgradeCanvas.realBleedings.top, right: upgradeCanvas.canvasBordeThickness.right + upgradeCanvas.realBleedings.right, bottom: upgradeCanvas.canvasBordeThickness.bottom + upgradeCanvas.realBleedings.bottom, left: upgradeCanvas.canvasBordeThickness.left + upgradeCanvas.realBleedings.left };
            upgradeCanvas.photoLayer = photoLayer;
            upgradeCanvas.foreground = require("CanvasController").getForeground(upgradeCanvas.frameBaseSize, { left: 0, top: 0, right: 0, bottom: 0 }, upgradeCanvas.photoLayer, 0);
            upgradeCanvas.oriWidth = upgradeCanvas.photoLayer.width;
            upgradeCanvas.oriHeight = upgradeCanvas.photoLayer.height;
            upgradeCanvas.oriBgWidth = upgradeCanvas.foreground.width;
            upgradeCanvas.oriBgHeight = upgradeCanvas.foreground.height;

            var foreground = this.getForegroundVariable(pageIdx);
            upgradeCanvas.oriX = foreground.left * upgradeCanvas.foreground.ratioX - upgradeCanvas.realBleedings.left - upgradeCanvas.canvasBordeThickness.left;
            upgradeCanvas.oriY = foreground.top * upgradeCanvas.foreground.ratioY - upgradeCanvas.realBleedings.top - upgradeCanvas.canvasBordeThickness.top;
            Store.mirrorLength = upgradeCanvas.canvasBordeThickness.top;
            var oldW = currentCanvas.params[0].width;
            var oldH = currentCanvas.params[0].height;
            upgradeCanvas.params = [{}];
            upgradeCanvas.params[0].width = upgradeCanvas.photoLayer.width - canvasBorder.left - canvasBorder.right;
            upgradeCanvas.params[0].height = upgradeCanvas.photoLayer.height - canvasBorder.top - canvasBorder.bottom;
            for(var key in currentCanvas.params[0]){
                upgradeCanvas.params[0][key] = currentCanvas.params[0][key];
            }
            upgradeCanvas.params[0].width = upgradeCanvas.photoLayer.width - canvasBorder.left - canvasBorder.right;
            upgradeCanvas.params[0].height = upgradeCanvas.photoLayer.height - canvasBorder.top - canvasBorder.bottom;
            if (currentCanvas.params[0].imageId) {
                var imageId = currentCanvas.params[0].imageId;

                var imageDetail = require("ImageListManage").getImageDetail(imageId);

                if (Math.abs(currentCanvas.params[0].imageRotate) === 90) {
                    var cWidth = currentCanvas.params[0].imageHeight,
                        cHeight = currentCanvas.params[0].imageWidth;
                } else {
                    var cWidth = currentCanvas.params[0].imageWidth,
                        cHeight = currentCanvas.params[0].imageHeight;
                };

                var defaultCrops = require("UtilCrop").getConformCrop(cWidth, cHeight, currentCanvas.params[0].cropPX, currentCanvas.params[0].cropPY, currentCanvas.params[0].cropPW, currentCanvas.params[0].cropPH, oldW, oldH, upgradeCanvas.params[0].width, upgradeCanvas.params[0].height);

                var px = defaultCrops.px,
                    py = defaultCrops.py,
                    pw = defaultCrops.pw,
                    ph = defaultCrops.ph;

                upgradeCanvas.params[0].cropX = imageDetail.width * px;
                upgradeCanvas.params[0].cropY = imageDetail.height * py;
                upgradeCanvas.params[0].cropW = imageDetail.width * pw;
                upgradeCanvas.params[0].cropH = imageDetail.height * ph;

                upgradeCanvas.params[0].cropPX = px;
                upgradeCanvas.params[0].cropPY = py;
                upgradeCanvas.params[0].cropPW = pw;
                upgradeCanvas.params[0].cropPH = ph;
            }

            
            console.log('currentCanvas',currentCanvas);
        }
        if(!upgradeCanvas.elements){
          upgradeCanvas.elements = [];
        }
        
        Store.upgradeCanvas = upgradeCanvas;
        console.log('upgradeCanvas',upgradeCanvas);
        
    },

    getLMCBaseSize: function(pageIdx,size) {
        var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
        var currentProject = Store.projectSettings[useIndex];
        var size = size;
        var product = currentProject.product;
        var frameStyle = currentProject.frameStyle;
        var orientation = currentProject.orientation;
        var sizeObject = require('SpecManage').getParameter('frameBaseSize', [{ key: 'product', value: product }, { key: 'frameStyle', value: frameStyle }, { key: 'size', value: size }, { key: 'orientation', value: orientation }]);

        return {
            width: parseFloat(sizeObject.widthInInch) * require('SpecManage').getDPI(),
            height: parseFloat(sizeObject.heightInInch) * require('SpecManage').getDPI()
        };
    },
    getLMCBleedSize: function(pageIdx,size) {
        var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
        var currentProject = Store.projectSettings[useIndex];
        var size = size;
        var product = currentProject.product;
        var bleedObject = require('SpecManage').getParameter('bleed', [{ key: 'product', value: product }, { key: 'size', value: size }]);

        return {
            top: parseFloat(bleedObject.top),
            right: parseFloat(bleedObject.right),
            bottom: parseFloat(bleedObject.bottom),
            left: parseFloat(bleedObject.left)
        }
    },
    getLMCCanvasBorder: function(pageIdx,size) {
        var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
        var currentProject = Store.projectSettings[useIndex];
        var size = size;
        var product = currentProject.product;
        var canvasBorderSize = currentProject.canvasBorderSize;
        var canvasBorderObject = require('SpecManage').getParameter('canvasBorderThickness', [{ key: 'product', value: product }, { key: 'size', value: size }, { key: 'canvasBorderSize', value: canvasBorderSize }]);

        return {
            top: parseFloat(canvasBorderObject.top),
            right: parseFloat(canvasBorderObject.right),
            bottom: parseFloat(canvasBorderObject.bottom),
            left: parseFloat(canvasBorderObject.left)
        }
    },
    getLMCPhotoLayer: function(pageIdx,size) {
      var useIndex = (typeof pageIdx !== 'undefined') ? pageIdx : Store.currentSelectProjectIndex;
      var currentProject = Store.projectSettings[useIndex];
      var orientation = currentProject.orientation;
      var object = {};

      var frameBaseSize = this.getLMCBaseSize(useIndex,size);

      var canvasBorderThickness = this.getLMCCanvasBorder(useIndex,size);
      var canvasBorderThicknessTop = canvasBorderThickness.top;
      var canvasBorderThicknessBottom = canvasBorderThickness.bottom;
      var canvasBorderThicknessLeft = canvasBorderThickness.left;
      var canvasBorderThicknessRight = canvasBorderThickness.right;

      var bleed = this.getLMCBleedSize(useIndex,size);
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
  getForegroundVariable : function(projectIdx){
        var useIndex = (typeof projectIdx) !== 'undefined' ? projectIdx : Store.currentSelectProjectIndex;
        var type = 'foreground',
                SpecManage = require("SpecManage"),
                keyPatterns = SpecManage.getVariableKeyPatternById(type).split("-"),
                params = [],
                res,
                currentProject = Store.projectSettings[useIndex];

        for(var i=0,l=keyPatterns.length;i<l;i++){
            var key = currentProject[keyPatterns[i]];
            if(key && key !== 'size'){
                var item = { key : keyPatterns[i], value : key};
                params.push(item);
            }
        }
        params.push({key: 'size', value: '11X14'})
        res = SpecManage.getVariable(type,params);
        if(currentProject.rotated){
            var width = parseFloat(res.rWidth);
            var height = parseFloat(res.rHeight);
            var left = parseFloat(res.rPaddingLeft);
            var right = parseFloat(res.rPaddingRight);
            var top = parseFloat(res.rPaddingTop);
            var bottom = parseFloat(res.rPaddingBottom);
        }
        else {
            var width = parseFloat(res.width);
            var height = parseFloat(res.height);
            var left = parseFloat(res.paddingLeft);
            var right = parseFloat(res.paddingRight);
            var top = parseFloat(res.paddingTop);
            var bottom = parseFloat(res.paddingBottom);
        }
        if(res){
            return {
                width : width,
                height : height,
                left : left,
                right : right,
                top : top,
                bottom : bottom,
            }
        }else{
            return null;
        }
     },

     createElement: function(idx, pageIdx, ratio) {
        var currentCanvas = Store.upgradeCanvas;

        var el = new CompUpgradePhotoElement();

        el.init(idx, pageIdx, ratio);
        el.$mount().$appendTo("#upgradeContainer");
        currentCanvas.elements.push(el);
    
    },


}