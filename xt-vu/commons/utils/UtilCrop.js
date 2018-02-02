
// util -- crop image
module.exports = {
	// get default crop params
	getDefaultCrop: function(imageWidth, imageHeight, targetWidth, targetHeight) {
		if(imageWidth && imageHeight && targetWidth && targetHeight) {
			var imageX = imageWidth / imageHeight,
					targetX = targetWidth / targetHeight,
					px, py, pw, ph;

			if(imageX > targetX) {
				// horizonal image + portrait target container
				var finalHeight = imageHeight,
						finalWidth = finalHeight * targetX,
						paddingSize = (imageWidth - finalWidth) / 2;

				px = paddingSize / imageWidth;
				py = 0;
				pw = finalWidth / imageWidth;
				ph = 1;
			}
			else {
				// portrait image + horizonal target container
				var finalWidth = imageWidth,
						finalHeight = finalWidth / targetX,
						paddingSize = (imageHeight - finalHeight) / 2;

				px = 0;
				py = paddingSize / imageHeight;
				pw = 1;
				ph = finalHeight / imageHeight;
			};

			return {
				px: Math.abs(px.toFixed(8)),
				py: Math.abs(py.toFixed(8)),
				pw: Math.abs(pw.toFixed(8)),
				ph: Math.abs(ph.toFixed(8))
			};
		}
		else {
			// wrong params, crop whole image
			return { px: 0, py: 0, pw: 1, ph: 1 };
		}
	},
	getConformCrop: function(imageWidth, imageHeight,cropPX,cropPY,cropPW,cropPH,currentWidth,currentHeight,targetWidth,targetHeight){
		var cropx=cropPX*imageWidth;
		var cropy=cropPY*imageHeight;
		var cropw=cropPW*imageWidth;
		var croph=cropPH*imageHeight;
		var targetCropW=targetWidth*cropw/currentWidth;
		var targetCropH=targetHeight*croph/currentHeight;
		
		var w,h;
		if((targetCropW-cropw)<(targetCropH-croph)){
			w=cropw;
			h=w/targetCropW*targetCropH;
		}else{
			h=croph;
			w=h/targetCropH*targetCropW;
		}
		targetCropW=w;
		targetCropH=h;

		var differW=(targetCropW-cropw)/2;
		var differH=(targetCropH-croph)/2;
		var targetCropX=cropx-differW;
		var targetCropY=cropy-differH;
		var targetCropRX=targetCropX+targetCropW;
		var targetCropRY=targetCropY+targetCropH;

		if(targetCropX<0){
			targetCropX=0;
		}

		if(targetCropY<0){
			targetCropY=0;
		}

		if(targetCropRX>imageWidth){
			targetCropX=imageWidth-targetCropW;
		}

		if(targetCropRY>imageHeight){
			targetCropY=imageHeight-targetCropH;
		}

		if( targetCropW>imageWidth || targetCropH>imageHeight){

			if((targetCropW-cropw)>(targetCropH-croph)){
				w=cropw;
				h=w/targetCropW*targetCropH;
			}else{
				h=croph;
				w=h/targetCropH*targetCropW;
			}
			targetCropW=w;
			targetCropH=h;

			differW=(targetCropW-cropw)/2;
			differH=(targetCropH-croph)/2;
			targetCropX=cropx-differW;
			targetCropY=cropy-differH;
		}
		
		
		return {px:targetCropX/imageWidth,py:targetCropY/imageHeight,pw:targetCropW/imageWidth,ph:targetCropH/imageHeight};

	},

	// get rotated angle
	getRotatedAngle: function(nCurrentAngle, nDegree) {
		if(nCurrentAngle != undefined && nCurrentAngle != null) {
			// valid degree now is 0 | 90 | 180 | -90
			nDegree = !isNaN(parseFloat(nDegree)) ? parseFloat(nDegree) : 90;

			nCurrentAngle += nDegree;
			// degree value fix
			nCurrentAngle > 180 ? nCurrentAngle -= 360 : nCurrentAngle;
			nCurrentAngle < -90 ? nCurrentAngle += 360 : nCurrentAngle;

			return nCurrentAngle;
		}
		else {
			return 0;
		};
	},

	// steche function (for front end cropping)
	stecheTo: function(sourceW, sourceH, tarW, tarH, type) {
		/* for now, disable slice type */
		// type = type || 'meet';			// type --> 'meet'/'slice'
		type = 'meet';
		var divisionSource = sourceW / sourceH,
				divisionTar = tarW / tarH,
				scale = 1;

		if(divisionSource > divisionTar) {
			if(type === 'slice') {
				// adjust by height
				scale = tarH / sourceH;
			}
			else {
				// adjust by width
				scale = tarW / sourceW;
			};
		}
		else {
			if(type === 'slice') {
				// adjust by width
				scale = tarW / sourceW;
			}
			else {
				// adjust by height
				scale = tarH / sourceH;
			};
		};

		// return final container size
		return { width: sourceW * scale, height: sourceH * scale };
	},
};
