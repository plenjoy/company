var UtilMath = require('UtilMath');

//
module.exports = {
    // calculate new params value by element
    getParamsValueByElement: function(idx, nPageIdx) {
        nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
        var currentCanvas = Store.pages[nPageIdx].canvas;

        if (idx != undefined && idx != null) {
            // pass in element idx
            // if(i === 0) {
            // 	// background image, no trans, with different data model from those with trans
            // 	var W = currentCanvas.elements[i].attrs.width / currentCanvas.ratio,
            // 			H = currentCanvas.elements[i].attrs.height / currentCanvas.ratio,
            // 			OX = currentCanvas.elements[i].attrs.x / currentCanvas.ratio,
            // 			OY = currentCanvas.elements[i].attrs.y / currentCanvas.ratio,
            // 			ROT = 0;
            // }
            // else {
            // if(currentCanvas.elType === 'text') {
            // 	// text element use view width and height
            // 	var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
            // 			hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
            // 			W = wDot,
            // 			H = hDot;
            // }
            // else {
            var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
                hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
                W = wDot / currentCanvas.ratio,
                H = hDot / currentCanvas.ratio;
            // };
            var OX = (currentCanvas.trans[idx].attrs.x + currentCanvas.trans[idx].attrs.translate.x - (wDot - currentCanvas.trans[idx].attrs.size.x) / 2) / currentCanvas.ratio,
                OY = (currentCanvas.trans[idx].attrs.y + currentCanvas.trans[idx].attrs.translate.y - (hDot - currentCanvas.trans[idx].attrs.size.y) / 2) / currentCanvas.ratio,
                ROT = currentCanvas.trans[idx].attrs.rotate;
            // };

            if (Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
                // special rotate
                var cWidth = currentCanvas.elements[idx].imageHeight,
                    cHeight = currentCanvas.elements[idx].imageWidth;
            } else {
                var cWidth = currentCanvas.elements[idx].imageWidth,
                    cHeight = currentCanvas.elements[idx].imageHeight;
            };

            // calculate font size again
            if (currentCanvas.elements[idx].elType === 'text') {
                var finalFontSize = currentCanvas.elements[idx].fontSize * currentCanvas.trans[idx].attrs.scale.x;
            } else {
                var finalFontSize = currentCanvas.elements[idx].fontSize;
            };

            return {
                elType: currentCanvas.elements[idx].elType,
                url: currentCanvas.elements[idx].sourceImageUrl,
                text: currentCanvas.elements[idx].text,
                x: OX,
                y: OY,
                width: W,
                height: H,
                rotate: ROT,
                dep: currentCanvas.elements[idx].dep,
                imageId: currentCanvas.elements[idx].imageId,
                imageRotate: currentCanvas.elements[idx].imageRotate || 0,
                cropPX: currentCanvas.elements[idx].cropX / cWidth || 0,
                cropPY: currentCanvas.elements[idx].cropY / cHeight || 0,
                cropPW: currentCanvas.elements[idx].cropW / cWidth || 1,
                cropPH: currentCanvas.elements[idx].cropH / cHeight || 1,
                fontFamily: currentCanvas.elements[idx].fontFamily || '',
                fontSize: parseFloat(finalFontSize) || '',
                fontWeight: currentCanvas.elements[idx].fontWeight || '',
                textAlign: currentCanvas.elements[idx].textAlign || '',
                fontColor: currentCanvas.elements[idx].fontColor || ''
            };
        } else {
            // no idx
            return '';
        };
    },

    getCropParamsByElement: function(idx, nPageIdx) {
        nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
        var currentCanvas = Store.pages[nPageIdx].canvas;

        if (idx != undefined && idx != null) {
            var wDot = currentCanvas.trans[idx].attrs.size.x * currentCanvas.trans[idx].attrs.scale.x,
                hDot = currentCanvas.trans[idx].attrs.size.y * currentCanvas.trans[idx].attrs.scale.y,
                W = wDot / currentCanvas.ratio,
                H = hDot / currentCanvas.ratio;
            var OX = (currentCanvas.trans[idx].attrs.x + currentCanvas.trans[idx].attrs.translate.x - (wDot - currentCanvas.trans[idx].attrs.size.x) / 2) / currentCanvas.ratio,
                OY = (currentCanvas.trans[idx].attrs.y + currentCanvas.trans[idx].attrs.translate.y - (hDot - currentCanvas.trans[idx].attrs.size.y) / 2) / currentCanvas.ratio,
                ROT = currentCanvas.trans[idx].attrs.rotate;

            if (Math.abs(currentCanvas.elements[idx].imageRotate) === 90) {
                // special rotate
                var cWidth = currentCanvas.elements[idx].imageHeight,
                    cHeight = currentCanvas.elements[idx].imageWidth;
            } else {
                var cWidth = currentCanvas.elements[idx].imageWidth,
                    cHeight = currentCanvas.elements[idx].imageHeight;
            };

            // calculate font size again
            if (currentCanvas.elements[idx].elType === 'text') {
                var finalFontSize = currentCanvas.elements[idx].fontSize * currentCanvas.trans[idx].attrs.scale.x;
            } else {
                var finalFontSize = currentCanvas.elements[idx].fontSize;
            };

            var cropPX = currentCanvas.elements[idx].cropX/cWidth;
  			var cropPY = currentCanvas.elements[idx].cropY/cHeight;
  			var cropPW = currentCanvas.elements[idx].cropW/cWidth;
  			var cropPH = currentCanvas.elements[idx].cropH/cHeight;

            var width = W;
            var height = H;
            var cropLUX = cropPX;
            var cropRLX = cropPX + cropPW;
            var cropLUY = cropPY;
            var cropRLY = cropPY + cropPH;
            var viewRatio = height / width;
            var photoImageW = cWidth;
            var photoImageH = cHeight;
            var oldHWAspectRatio = (cropRLY - cropLUY) / (cropRLX - cropLUX);
            var cropCenterX = cropLUX + (cropRLX - cropLUX) / 2;
            var cropCenterY = cropLUY + (cropRLY - cropLUY) / 2;
            var oldCropX = cropLUX * photoImageW;
            var oldCropY = cropLUY * photoImageH;
            var oldCropW = (cropRLX - cropLUX) * photoImageW;
            var oldCropH = (cropRLY - cropLUY) * photoImageH;
            var oldCropCenterX = cropCenterX * photoImageW;
            var oldCropCenterY = cropCenterY * photoImageH;

            var cropUnitsPercentX = (cropRLX - cropLUX) * photoImageW / width;
			var cropUnitsPercentY = (cropRLY - cropLUY) * photoImageH / height;


            /*var newCropW;
            var newCropH;

            if (viewRatio > oldHWAspectRatio) {
                newCropH = oldCropH * photoImageH;
                newCropW = newCropH / viewRatio;
            } else {
                newCropW = oldCropW * photoImageW;
                newCropH = viewRatio * newCropW;
            }

            if (newCropW > photoImageW) {
                newCropW = photoImageW;
            }
            if (newCropH > photoImageH) {
                newCropH = photoImageH;
            }

            var resultX;
            var resultY;
            var resultW;
            var resultH;
            if (newCropW * viewRatio > newCropH) {
                resultH = newCropH;
                resultW = newCropH / viewRatio;
            } else {
                resultW = newCropW;
                resultH = newCropW * viewRatio;
            }

            resultX = oldCropCenterX - resultW / 2;
            resultX = resultX > 0 ? resultX : 0;
            if (resultX + resultW > photoImageW) {
                resultX = resultX - (resultX + resultW - photoImageW);
                resultX = resultX > 0 ? resultX : 0;
            }

            resultY = oldCropCenterY - resultH / 2;
            resultY = resultY > 0 ? resultY : 0;
            if (resultY + resultH > photoImageH) {
                resultY = resultY - (resultY + resultH - photoImageH);
                resultY = resultY > 0 ? resultY : 0;
            }
            var resultCropLUX = resultX / photoImageW;
            var resultCropLUY = resultY / photoImageH;
            var resultCropRLX = (resultX + resultW) / photoImageW;
            var resultCropRLY = (resultY + resultH) / photoImageH;*/

            var newCropW = width * cropUnitsPercentX;
				var newCropH = height * cropUnitsPercentY;
				if(newCropW > photoImageW){
					newCropW = photoImageW;
				}
				if(newCropH > photoImageH){
					newCropH = photoImageH;
				}

				var resultX;
				var resultY;
				var resultW;
				var resultH;
				if(newCropW * viewRatio > newCropH){
					resultH = newCropH;
					resultW = newCropH / viewRatio;
				}else{
					resultW = newCropW;
					resultH = newCropW * viewRatio;
				}

				resultX = oldCropCenterX - resultW/2;
				resultX = resultX > 0 ? resultX : 0;
				if(resultX + resultW > photoImageW){
					resultX = resultX - (resultX + resultW - photoImageW);
					resultX = resultX > 0 ? resultX : 0;
				}

				resultY = oldCropCenterY - resultH/2;
				resultY = resultY > 0 ? resultY : 0;
				if(resultY + resultH > photoImageH){
					resultY = resultY - (resultY + resultH - photoImageH);
					resultY = resultY > 0 ? resultY : 0;
				}

            var object = {
                elType: currentCanvas.elements[idx].elType,
                url: currentCanvas.elements[idx].sourceImageUrl,
                text: currentCanvas.elements[idx].text,
                x: OX,
                y: OY,
                width: W,
                height: H,
                rotate: ROT,
                dep: currentCanvas.elements[idx].dep,
                imageId: currentCanvas.elements[idx].imageId,
                imageRotate: currentCanvas.elements[idx].imageRotate || 0,
                cropPX: resultX / photoImageW|| 0,
                cropPY: resultY / photoImageH|| 0,
                cropPW: resultW / photoImageW|| 1,
                cropPH: resultH / photoImageH|| 1,
                fontFamily: currentCanvas.elements[idx].fontFamily || '',
                fontSize: parseFloat(finalFontSize) || '',
                fontWeight: currentCanvas.elements[idx].fontWeight || '',
                textAlign: currentCanvas.elements[idx].textAlign || '',
                fontColor: currentCanvas.elements[idx].fontColor || ''
            };
            return object;
        } else {
            return '';
        };
    },

    // get final cropped image url by crop params
    getCropImageUrl: function(idx, nPageIdx, ratio) {
      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
      var currentCanvas = Store.pages[nPageIdx].canvas;
      var viewRatio = ratio ? ratio : currentCanvas.ratio;

  		if(idx != undefined && idx != null && (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'image' || currentCanvas.params[idx].elType === 'logo' || currentCanvas.params[idx].elType === 'PhotoElement')) {
  			var loadImageUrl = '../../static/img/blank.png';
  			// var loadImageUrl = '';
  			if(currentCanvas.params[idx].imageId !== '') {
  				// already initialized, read old cropped image
  				var currentElement = currentCanvas.params[idx],
              px = Math.abs(currentElement.cropPX.toFixed(8)),
  						py = Math.abs(currentElement.cropPY.toFixed(8)),
  						pw = Math.abs(currentElement.cropPW.toFixed(8)),
  						ph = Math.abs(currentElement.cropPH.toFixed(8)),
  						width = currentElement.width * viewRatio / pw,
  						height = currentElement.height * viewRatio / ph,
              brightness = currentElement.style && currentElement.style.brightness ? currentElement.style.brightness : 0;

          var UtilProject = require('UtilProject');
          var encImgId = UtilProject.getEncImgId(currentCanvas.params[idx].imageId);
          var qs = UtilProject.getQueryString({
            encImgId: encImgId,
            px: px,
            py: py,
            pw: pw,
            ph: ph,
            width: Math.ceil(width),
            height: Math.ceil(height),
            rotation: currentCanvas.params[idx].imageRotate,
            brightness: brightness
          });

  				loadImageUrl = '/imgservice/op/crop?' + qs + require('UtilParam').getSecurityString();
  			};

  			return loadImageUrl;
  		}
      else {
        return '';
      };
    },
    getCropDecorationUrl: function(idx,nPageIdx){
      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
      var currentCanvas = Store.pages[nPageIdx].canvas;

      if(idx != undefined && idx != null && (currentCanvas.params[idx].elType === 'background' || currentCanvas.params[idx].elType === 'decoration' || currentCanvas.params[idx].elType === 'logo' || currentCanvas.params[idx].elType === 'DecorationElement')) {
        var loadDecorationUrl = '../../static/img/blank.png';
        // var loadDecorationUrl = '';
        if(currentCanvas.params[idx].decorationid !== '' ) {
          // already initialized, read old cropped image
          // var px = currentCanvas.params[idx].cropPX,
          //     py = currentCanvas.params[idx].cropPY,
          //     pw = currentCanvas.params[idx].cropPW,
          //     ph = currentCanvas.params[idx].cropPH,
          //     width = currentCanvas.params[idx].width * currentCanvas.ratio / pw,
          //     height = currentCanvas.params[idx].height * currentCanvas.ratio / ph;
          var imageGuid = currentCanvas.params[idx].decorationid;
          loadDecorationUrl = Store.domains.baseUrl+'/artwork/png/1000/'+imageGuid+'.png';
        };

        return loadDecorationUrl;
      }
      else {
        return '';
      };
    },

    // get final font image by params
    getFontImageUrl: function() {

    },

    //
  	getShiftValue: function(currentCanvas, nPageIdx) {
      nPageIdx != undefined && nPageIdx != null ? nPageIdx : nPageIdx = Store.selectedPageIdx;
      currentCanvas = currentCanvas || Store.pages[nPageIdx].canvas;
      // var currentCanvas = Store.pages[nPageIdx].canvas;

  		if(Store.project2.matte !== 'none') {
        var shiftedX = -1 * (currentCanvas.boardInMatting.left + currentCanvas.realBleedings.left);
  			var shiftedY = -1 * (currentCanvas.boardInMatting.top + currentCanvas.realBleedings.top);
        var shiftedXDot = -1 * (currentCanvas.boardInMatting.right + currentCanvas.realBleedings.right);
  			var shiftedYDot = -1 * (currentCanvas.boardInMatting.bottom + currentCanvas.realBleedings.bottom);
  		}
  		else {
  			// without matting
  			var shiftedX = -1 * (currentCanvas.boardInFrame.left + currentCanvas.realBleedings.left);
  			var shiftedY = -1 * (currentCanvas.boardInFrame.top + currentCanvas.realBleedings.top);
        var shiftedXDot = -1 * (currentCanvas.boardInFrame.right + currentCanvas.realBleedings.right);
  			var shiftedYDot = -1 * (currentCanvas.boardInFrame.bottom + currentCanvas.realBleedings.bottom);
  		};

      return {
        x: shiftedX,
        y: shiftedY,
        xDot: shiftedXDot,    // shifted x, y on the other side( right , bottom)
        yDot: shiftedYDot
      };
  	},

    // get fixed positions by shifting 获取迁移坐标系新位置
  	getShiftPosition: function(oriX, oriY, oriWidth, oriHeight, shiftX, shiftY) {
  		if(oriX != null && oriY != null && oriWidth != null && oriHeight != null) {
  			shiftX = shiftX || 0;
  			shiftY = shiftY || 0;

  			var newX = oriX + shiftX,
  					newY = oriY + shiftY;

  			return {
  				x: newX,
  				y: newY,
  				width: oriWidth,
  				height: oriHeight
  			};
  		}
  		else {
  			return {
  				x: 0,
  				y: 0,
  				width: 0,
  				height: 0
  			};
  		};
  	},

  	getUnshiftPosition: function(idx) {
      if(idx != undefined && idx != null) {
        var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

        var shiftX = -1 * this.getShiftValue().x,
            shiftY = -1 * this.getShiftValue().y,
            shiftXDot = -1 * this.getShiftValue().xDot,
            shiftYDot = -1 * this.getShiftValue().yDot;

        var x = currentCanvas.params[idx].x || 0,
            y = currentCanvas.params[idx].y || 0,
            w = currentCanvas.params[idx].width || 0,
            h = currentCanvas.params[idx].height || 0,
            fullW = currentCanvas.oriWidth || 0,
            fullH = currentCanvas.oriHeight || 0,
            px, py, pw, ph;
        //     px = parseFloat(currentCanvas.params[idx].px) || 0,
        //     py = parseFloat(currentCanvas.params[idx].py) || 0,
        //     pw = parseFloat(currentCanvas.params[idx].pw),
        //     ph = parseFloat(currentCanvas.params[idx].ph);

        // fix values
        x += shiftX;
        y += shiftY;
        px = x / (fullW + shiftX + shiftXDot);
        py = y / (fullH + shiftY + shiftYDot);
        pw = w / (fullW + shiftX + shiftXDot);
        ph = h / (fullH + shiftY + shiftYDot);
        px < 0 ? px = 0 : px;
        px > 1 ? px = 1 : px;
        py < 0 ? py = 0 : py;
        py > 1 ? py = 1 : py;
        pw < 0 ? pw = 0 : pw;
        pw > 1 ? pw = 1 : pw;
        ph < 0 ? ph = 0 : ph;
        ph > 1 ? ph = 1 : ph;

        return {
          x: x,
          y: y,
          px: px,
          py: py,
          pw: pw,
          ph: ph
        };
      }
      else {
        console.fail('idx is invalid in getUnshiftPosition() [ParamsManage]')
        return '';
      };
    },

    getIndexById: function(id,pageIdx) {
      var pageIdx = pageIdx || Store.selectedPageIdx;
      if(id != undefined && id != null && id !== '') {
        var currentCanvas = Store.pages[pageIdx].canvas;

        for(var i = 0; i < currentCanvas.params.length; i++) {
          if(currentCanvas.params[i].id === id) {
            return i;
          };
        };

        // loop ends and no matching
        return -1;
      }
      else {
        // wrong
        return -1;
      };
    },

    getIndexByDep: function(dep) {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      for(var i = 0; i < currentCanvas.params.length; i++) {
        if(currentCanvas.params[i].dep === dep) {
          return i;
        };
      };

      return 0;
    },

    getFrontElementIndex: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      // for the front element, it's depth is the same with params count - 1
      return this.getIndexByDep(currentCanvas.params.length - 1);
    },

    // NOTE: this function provides VIEW size, only valid for marketplace seller flow product for now
    getBorderHiddenSize: function() {
      var currentCanvas = Store.pages[Store.selectedPageIdx].canvas;

      var leftLimit = topLimit = rightLimit = bottomLimit = 0;

      if(Store.isCanvas) {
        // canvas
        leftLimit = (currentCanvas.canvasBordeThickness.left + currentCanvas.realBleedings.left) * currentCanvas.ratio;
        rightLimit = (currentCanvas.canvasBordeThickness.right + currentCanvas.realBleedings.right) * currentCanvas.ratio;
        topLimit = (currentCanvas.canvasBordeThickness.top + currentCanvas.realBleedings.top) * currentCanvas.ratio;
        bottomLimit = (currentCanvas.canvasBordeThickness.bottom + currentCanvas.realBleedings.bottom) * currentCanvas.ratio;
      }
      else {
        // frame
        var frameBoardWidth = currentCanvas.frameBaseSize.width * currentCanvas.ratio,    // board的宽度
            frameBoardHeight = currentCanvas.frameBaseSize.height * currentCanvas.ratio,
            frameLeft = Math.abs(currentCanvas.x),    // 照片板超出board的左部的尺寸
            frameTop = Math.abs(currentCanvas.y);

        // prepare leftLimit, rightLimit
        if(currentCanvas.width > frameBoardWidth) {
          // photoLayer比较大
          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
            // 有matte的情况
            leftLimit = frameLeft + currentCanvas.boardInMatting.left * currentCanvas.ratio;
            rightLimit = currentCanvas.width - frameBoardWidth - frameLeft + currentCanvas.boardInMatting.right * currentCanvas.ratio;
          }
          else {
            // 没matte的情况
            leftLimit = frameLeft + currentCanvas.boardInFrame.left * currentCanvas.ratio;
            rightLimit = currentCanvas.width - frameBoardWidth - frameLeft + currentCanvas.boardInFrame.right * currentCanvas.ratio;
          };
        }
        else {
          // frameBoard比较大
          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
            // 有matte的情况
            leftLimit = currentCanvas.boardInMatting.left * currentCanvas.ratio + currentCanvas.realBleedings.left * currentCanvas.ratio;
            rightLimit = currentCanvas.boardInMatting.right * currentCanvas.ratio + currentCanvas.realBleedings.right * currentCanvas.ratio;
          }
          else {
            // 没matte的情况
            leftLimit = currentCanvas.boardInFrame.left * currentCanvas.ratio + currentCanvas.realBleedings.left * currentCanvas.ratio;
            rightLimit = currentCanvas.boardInFrame.right * currentCanvas.ratio + currentCanvas.realBleedings.right * currentCanvas.ratio;
          };
        };

        // prepare topLimit, bottomLimit
        if(currentCanvas.height > frameBoardHeight) {
          // photoLayer比较大
          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
            // 有matte的情况
            topLimit = frameTop + currentCanvas.boardInMatting.top * currentCanvas.ratio;
            bottomLimit = currentCanvas.height - frameBoardHeight - frameTop + currentCanvas.boardInMatting.bottom * currentCanvas.ratio;
          }
          else {
            // 没matte的情况
            topLimit = frameTop + currentCanvas.boardInFrame.top * currentCanvas.ratio;
            bottomLimit = currentCanvas.height - frameBoardHeight - frameTop + currentCanvas.boardInFrame.bottom * currentCanvas.ratio;
          };
        }
        else {
          // frameBoard比较大
          if(Store.projectSettings[Store.currentSelectProjectIndex].matte && Store.projectSettings[Store.currentSelectProjectIndex].matte !== 'none') {
            // 有matte的情况
            topLimit = currentCanvas.boardInMatting.top * currentCanvas.ratio + currentCanvas.realBleedings.top * currentCanvas.ratio;
            bottomLimit = currentCanvas.boardInMatting.bottom * currentCanvas.ratio + currentCanvas.realBleedings.bottom * currentCanvas.ratio;
          }
          else {
            // 没matte的情况
            topLimit = currentCanvas.boardInFrame.top * currentCanvas.ratio + currentCanvas.realBleedings.top * currentCanvas.ratio;
            bottomLimit = currentCanvas.boardInFrame.bottom * currentCanvas.ratio + currentCanvas.realBleedings.bottom * currentCanvas.ratio;
          };
        };
      };

      return {
        left: leftLimit,
        top: topLimit,
        right: rightLimit,
        bottom: bottomLimit
      };
    },
};
