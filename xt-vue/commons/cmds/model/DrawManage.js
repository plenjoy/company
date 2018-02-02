/*
	drawImage('canvas', 'a.jpg', 0, 0,loaded,500,500);画图片

	function loaded() {
        drawLine('canvas', 'red', 0, 0, 200, 200, 20);画线
        drawText('canvas', 'woeqtwqoe', 0, 0, "red", "50px", "Georgia");画文字
        drawRect('canvas', 'orange', 0, 0, 200, 200, true, 2);画矩形
        drawCircular('canvas', 'gray', 100, 100, 100, true, 5);画圆形
		drawDashLine('canvas', 'black', 0, 0, 200, 200, 1, 3);画虚线
    }
*/

module.exports = {
	drawImage:function(canvas_id,url,x,y,loadedImageFunction,width,height,sx,sy,sw,sh){
		var c = document.getElementById(canvas_id);
    	var cxt = c.getContext("2d");
		var img = new Image();
    	img.src = url;
    	img.onload = function(event) {
    		if(width&&height){
                if(sx){
                    cxt.drawImage(img,sx,sy,sw,sh, x, y, width, height);
                }else{
                    cxt.drawImage(img, x, y, width, height);
                }
    		}else{
    			cxt.drawImage(img, x, y);
    		}
    		if(loadedImageFunction){
            	loadedImageFunction();
            }
    	}
        img.onerror= function(){
            require('trackerService')({ev: require('trackerConfig').ImageLoadFail,imageUrl: url});
        };
	},
    createRotateElementCanvas: function(oriSourceCanvas, rotate) {
        // 声明两个中间canvas，一个是存储根据旋转放大后尺寸的canvas(未旋转)，一个是存储旋转后的最终canvas，防止在同一canvas上操作造成叠影
        var sourceScaleCanvas = document.createElement("canvas"),
            sourceScaleCtx = sourceScaleCanvas.getContext("2d");
        var sourceRotateCanvas = document.createElement("canvas"),
            sourceRotateCtx = sourceRotateCanvas.getContext("2d");

        // 获取旋转后的放大尺寸
        var sCanvasSize = this.getCanvasRotateSize(oriSourceCanvas, rotate);

        // 放大canvas和旋转canvas的尺寸设置，如果旋转后的尺寸要比原来的小，则使用原来的尺寸
        sourceScaleCanvas.width = sCanvasSize.width < oriSourceCanvas.width ? oriSourceCanvas.width : sCanvasSize.width;
        sourceScaleCanvas.height = sCanvasSize.height < oriSourceCanvas.height ? oriSourceCanvas.height : sCanvasSize.height;
        sourceRotateCanvas.width = sCanvasSize.width < oriSourceCanvas.width ? oriSourceCanvas.width : sCanvasSize.width;
        sourceRotateCanvas.height = sCanvasSize.height < oriSourceCanvas.height ? oriSourceCanvas.height : sCanvasSize.height;

        // 获取canvas尺寸的中心点，即中点
        var xpos = sCanvasSize.width > oriSourceCanvas.width ? sCanvasSize.width / 2 : oriSourceCanvas.width / 2;
        var ypos = sCanvasSize.height > oriSourceCanvas.height ? sCanvasSize.height / 2 : oriSourceCanvas.height / 2;
        // 如果放大canvas的顶点如果小于0，则表示尺寸比原来小，保持为0
        var top = xpos - oriSourceCanvas.width / 2 < 0 ? 0 : xpos - oriSourceCanvas.width / 2;
        var left = ypos - oriSourceCanvas.height / 2 < 0 ? 0 : ypos - oriSourceCanvas.height / 2;

        // 清空canvas，为了修复bug ASH-5178
        sourceScaleCtx.clearRect(0, 0, sourceScaleCanvas.width, sourceScaleCanvas.height);
        sourceRotateCtx.clearRect(0, 0, sourceRotateCanvas.width, sourceRotateCanvas.height);

        // 原图片做中心旋转
        sourceScaleCtx.drawImage(oriSourceCanvas, top, left);
        sourceRotateCtx.translate(xpos, ypos);
        sourceRotateCtx.rotate(rotate * Math.PI / 180);
        sourceRotateCtx.translate(-xpos, -ypos);
        sourceRotateCtx.drawImage(sourceScaleCanvas, 0, 0);

        // 返回中心旋转canvas
        return sourceRotateCanvas;
    },
    drawRotateCanvas: function(options){
        // 解options
        var tarCanvasId = options.tarCanvasId,
            sourceCanvasId = options.sourceCanvasId,
            x = options.x,
            y = options.y,
            width = options.width,
            height = options.height,
            sx = options.sx,
            sy = options.sy,
            sw = options.sw,
            sh = options.sh,
            rotate = parseInt(options.rotate) || 0;

        var tarCanvas = document.getElementById(tarCanvasId),
            tarCtx = tarCanvas.getContext("2d"),
            sourceCanvas = document.getElementById(sourceCanvasId);

        if(sourceCanvas){
            var sourceCtx = sourceCanvas.getContext("2d");
            var rotateCanvas = this.createRotateElementCanvas(sourceCanvas, rotate);
            var sx = sx || 0,
                sy = sy || 0,
                sw = sw || rotateCanvas.width,
                sh = sh || rotateCanvas.height,
                x = x || 0,
                y = y || 0,
                w = width || rotateCanvas.width,
                h = height || rotateCanvas.height;

            if(sw > 0 && sh > 0) {
                x = x - (rotateCanvas.width - sourceCanvas.width) / 2;
                y = y - (rotateCanvas.height - sourceCanvas.height) / 2;
                tarCtx.drawImage(rotateCanvas,sx,sy,sw,sh,x,y,w,h);
            };
        }
    },
    drawCanvas : function(tarCanvasId,sourceCanvasId,x,y,width,height,sx,sy,sw,sh){
        var tarCanvas = document.getElementById(tarCanvasId),
            tarCtx = tarCanvas.getContext("2d"),
            sourceCanvas = document.getElementById(sourceCanvasId);

        if(sourceCanvas){
            var sourceCtx = sourceCanvas.getContext("2d"),
                sx = sx || 0,
                sy = sy || 0,
                sw = sw || sourceCanvas.width,
                sh = sh || sourceCanvas.height,
                x = x || 0,
                y = y || 0,
                w = width || sourceCanvas.width,
                h = height || sourceCanvas.height;

            if(sw > 0 && sh > 0) {
                tarCtx.drawImage(sourceCanvas,sx,sy,sw,sh,x,y,w,h);
            };
        }
    },
	drawText:function(canvas_id,text,x,y,color,fontSize,fontFamily){
		var c = document.getElementById(canvas_id);
    	var cxt = c.getContext("2d");
    	cxt.textBaseline="top";
    	var oldColor=cxt.fillStyle;
    	cxt.fillStyle=color;
    	cxt.font=fontSize+" "+fontFamily;
		cxt.fillText(text,x,y);
    	cxt.fillStyle=oldColor;
	},
	drawLine:function(canvas_id,color,fromX,fromY,toX,toY,lineWidth){
		var c = document.getElementById(canvas_id);
    	var cxt = c.getContext("2d");
    	var oldColor=cxt.strokeStyle;
    	cxt.strokeStyle=color;
    	var oldLineWidth=cxt.lineWidth;
    	if(lineWidth){
    		cxt.lineWidth=lineWidth;
    	}else{
    		cxt.lineWidth=1;
    	}

		cxt.beginPath();
    	cxt.moveTo(fromX, fromY);
        cxt.lineTo(toX, toY);
        cxt.closePath();
        cxt.stroke();
        cxt.strokeStyle=oldColor;
        cxt.lineWidth=oldLineWidth;
	},
	drawDashedLine:function(canvas_id, color, fromX, fromY, toX, toY, lineWidth, dashLen){
		var c = document.getElementById(canvas_id);
        var cxt = c.getContext("2d");
        var oldColor = cxt.strokeStyle;
        cxt.strokeStyle = color;
        var oldLineWidth = cxt.lineWidth;
        if (lineWidth) {
            cxt.lineWidth = lineWidth;
        } else {
            cxt.lineWidth = 1;
        }
        if(!dashLen){
        	dashLen=5;
        }
        cxt.beginPath();
        var beveling = this.getBeveling(toX-fromX,toY-fromY);
	    var num = Math.floor(beveling/dashLen);

        var x1,y1,x2,y2;
		for(var i = 0 ; i < num; i++)
		{
            x1=fromX+(toX-fromX)/num*i;
            y1=fromY+(toY-fromY)/num*i;
            x2=fromX+(toX-fromX)/num*(i+1);
            y2=fromY+(toY-fromY)/num*(i+1);
			cxt[i%2 == 0 ? 'moveTo' : 'lineTo'](fromX+(toX-fromX)/num*i,fromY+(toY-fromY)/num*i);
		}
        if(num%2 != 0){
            cxt['lineTo'](x2,y2);
        }

        cxt.closePath();
        cxt.stroke();
        cxt.strokeStyle = oldColor;
        cxt.lineWidth = oldLineWidth;
	},
	getBeveling:function(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },
	drawRect:function(canvas_id,color,x,y,width,height,isStroke,lineWidth){
		var c = document.getElementById(canvas_id);
    	var cxt = c.getContext("2d");
    	if(isStroke){

    		var oldLineWidth=cxt.lineWidth;
	    	if(lineWidth){
	    		cxt.lineWidth=lineWidth;
	    	}else{
	    		cxt.lineWidth=1;
	    	}
    		var oldColor=cxt.strokeStyle;
	    	cxt.strokeStyle=color;
			cxt.beginPath();
	    	cxt.moveTo(x, y);
	        cxt.strokeRect(x,y,width,height);
	        cxt.closePath();
	        cxt.stroke();
	        cxt.strokeStyle=oldColor;
	        cxt.lineWidth=oldLineWidth;
    	}else{
    		var oldColor=cxt.fillStyle;
	    	cxt.fillStyle=color;
			cxt.beginPath();
	    	cxt.moveTo(x, y);
	        cxt.fillRect(x,y,width,height);
	        cxt.closePath();
	        cxt.fillStyle=oldColor;
    	}
	},
	drawCircular:function(canvas_id, color, x, y, width, isStroke, lineWidth){
		var c = document.getElementById(canvas_id);
        var cxt = c.getContext("2d");
        if (isStroke) {

        	var oldLineWidth = cxt.lineWidth;
	        if (lineWidth) {
	            cxt.lineWidth = lineWidth;
	        } else {
	            cxt.lineWidth = 1;
	        }
	        var oldColor = cxt.strokeStyle;
	        cxt.strokeStyle = color;
	        cxt.moveTo(x, y);
	        cxt.beginPath();
	        cxt.arc(x, y, width,0,Math.PI*2);
	        cxt.closePath();
	        cxt.stroke();
	        cxt.strokeStyle = oldColor;
			cxt.lineWidth = oldLineWidth;
		}else{

			var oldColor = cxt.fillStyle;
            cxt.fillStyle = color;

            cxt.moveTo(x, y);
            cxt.beginPath();
            cxt.arc(x, y, width,0,Math.PI*2);
            cxt.closePath();
            cxt.fill();
            cxt.fillStyle = oldColor;
        }
	},

    clear:function(canvas_id,x,y,w,h){
        var c=document.getElementById(canvas_id),
            ctx=c.getContext("2d"),
            x = x || 0,
            y = y || 0,
            w = w || c.width,
            h = h || c.height;
        ctx.clearRect(x,y,w,h);
    },
    getImageData:function(canvas_id,x,y,w,h){
        var c=document.getElementById(canvas_id),
            ctx=c.getContext("2d")
            x = x || 0,
            y = y || 0,
            w = w || c.width,
            h = h || c.height;
        return ctx.getImageData(x,y,w,h);
    },
    fillImageData:function(canvas_id,imgData,x,y,w,h){
        var c=document.getElementById(canvas_id),
            ctx=c.getContext("2d"),
            w = w || c.width,
            h = h || c.height,
            x = x || 0,
            y = y || 0;
        ctx.putImageData(imgData,x,y,0,0,w,h);
    },
    createImageData : function(canvas_id,w,h){
        var c=document.getElementById(canvas_id),
            ctx=c.getContext("2d"),
            w = w || c.width,
            h = h || c.height;
        return ctx.createImageData(w,h);
    },
    getClient : function(canvas_id){
        var c = document.getElementById(canvas_id);
        return {
            width : c.width,
            height : c.height,
            context : c.getContext("2d")
        }
    },
    imageDataVRevert : function(sourceData,newData){ //pixel vertical revert
        for(var i=0,h=sourceData.height;i<h;i++){
            for(j=0,w=sourceData.width;j<w;j++){
                newData.data[i*w*4+j*4+0] = sourceData.data[(h-i)*w*4+j*4+0];
                newData.data[i*w*4+j*4+1] = sourceData.data[(h-i)*w*4+j*4+1];
                newData.data[i*w*4+j*4+2] = sourceData.data[(h-i)*w*4+j*4+2];
                newData.data[i*w*4+j*4+3] = sourceData.data[(h-i)*w*4+j*4+3];
            }
        }
        return newData;
    },
    imageDataHRevert : function(sourceData,newData){ //pixel horizontal revert
        for(var i=0,h=sourceData.height;i<h;i++){
            for(j=0,w=sourceData.width;j<w;j++){
                newData.data[i*w*4+j*4+0] = sourceData.data[i*w*4+(w-j)*4+0];
                newData.data[i*w*4+j*4+1] = sourceData.data[i*w*4+(w-j)*4+1];
                newData.data[i*w*4+j*4+2] = sourceData.data[i*w*4+(w-j)*4+2];
                newData.data[i*w*4+j*4+3] = sourceData.data[i*w*4+(w-j)*4+3];
            }
        }
        return newData;
    },
    canvasToBase64 : function(canvas_id){
        var canvas = document.getElementById(canvas_id);
        return canvas.toDataURL("image/jpeg");
    },
    wrapBorder : function(canvas_id,direction,length){ //pixel beveling
        var canvas = document.getElementById(canvas_id),
            tmpCanvas = document.createElement("canvas"),
            tctx = tmpCanvas.getContext("2d"),
            W = canvas.width,
            H = canvas.height,
            length = length || 0.5, // <=0.5
            direction = direction || 'right',
            params = {'top':[1,0,-length,length,0,H/2],'right':[-length,length,0,1,W/2,-W/2]};
        if(W>H){
            tmpCanvas.width = W + H / 2;
            tmpCanvas.height = H;
        }else{
            tmpCanvas.width = W;
            tmpCanvas.height = H + W / 2;
        }
        CanvasRenderingContext2D.prototype.transform.apply(tctx,params[direction]);
        if(W>H){
            tctx.drawImage(canvas,H/2,0);
        }else{
            tctx.drawImage(canvas,0,W/2);
        }
        return tctx.getImageData(0,0,tmpCanvas.width,tmpCanvas.height);
    },
    setSize : function(canvas_id,setting){
        var canvas = document.getElementById(canvas_id);
        setting.width && (canvas.width=setting.width);
        setting.height && (canvas.height=setting.height);
    },
    fillEmptyDataWithColor : function(imgData,rgb,width,height){
        for(var i=0;i<imgData.width*imgData.height;i++){
            if(imgData.data[4*i+3]===0){
                imgData.data[4*i] = rgb.r;
                imgData.data[4*i+1] = rgb.g;
                imgData.data[4*i+2] = rgb.b;
                imgData.data[4*i+3] = 255;
            }
        }
        return imgData;
    },
    replaceColor : function(imageData,x,y,sourceColor,w,h,replaceColor){ //replace or delete color in area
        var x = ~~(x || 0),
            y = ~~(y || 0),
            w = x + w || imageData.width,
            h = y + h || imageData.height;
        if(x<0 || y<0 || w>imageData.width || h>imageData.height){
            throw new Error("error params!");
        }
        for(var j=y;j<h;j++){
            for(var i=x;i<w;i++){
                var index = j * imageData.width + i,
                    r = imageData.data[4*index],
                    g = imageData.data[4*index+1],
                    b = imageData.data[4*index+2];
                if(r==sourceColor.r && g==sourceColor.g && b==sourceColor.b){
                    if(replaceColor){
                        imageData.data[4*index] = replaceColor.r;
                        imageData.data[4*index+1] = replaceColor.g;
                        imageData.data[4*index+2] = replaceColor.b;
                        imageData.data[4*index+3] = 255;
                    }else{
                        imageData.data[4*index+3] = 0;
                    }
                }
            }
        }
        return imageData;
    },
    resizeImage : function(canvasId,w,h){
        var canvas = document.getElementById(canvasId),
            ctx = canvas.getContext("2d"),
            tmpCanvas = document.createElement("canvas"),
            tctx = tmpCanvas.getContext("2d"),
            w = w || canvas.width,
            h = h || canvas.height;
        if(w !== canvas.width || h !== canvas.height){
            var ratio;
            if(w>h){
                ratio = canvas.width / w;
                h = canvas.height / ratio;
            }else if(w===h){
                if(canvas.width>canvas.height){
                    ratio = canvas.width / w;
                    h = canvas.height / ratio;
                }else{
                    ratio = canvas.height / h;
                    w = canvas.width / ratio;
                }
            }else{
                ratio = canvas.height / h;
                w = canvas.width / ratio;
            }
        }
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        tctx.drawImage(canvas,0,0,w,h);
        return tmpCanvas.toDataURL("image/png");
    },
    getCanvasRotateSize: function(canvas, rotateDeg) {
        var points = this.getCanvasRotatePoint(canvas, rotateDeg);
        var maxX = 0, maxY = 0;

        points.forEach(function(point) {
            maxX = point.x > maxX ? point.x : maxX;
            maxY = point.y > maxY ? point.y : maxY;
        });

        return {
            width: maxX * 2,
            height: maxY * 2
        }
    },
    getCanvasRotatePoint: function(canvas, rotateDeg) {
        var canvasRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
        var posX = 1, posY = 1, offsetDeg = 0, points = [];

        for(var i = 0; i < 4; i++) {
            switch (i) {
                case 0: posX = -1; posY = 1; offsetDeg = 360; break;
                case 1: posX = 1; posY = 1; offsetDeg = 0; break;
                case 2: posX = 1; posY = -1; offsetDeg = 180; break;
                case 3: posX = -1; posY = -1; offsetDeg = 180; break;
            }

            var oriPoint = {
                x: canvas.width / 2 * posX,
                y: canvas.height / 2 * posY
            }
            var oriPoint2CenterDeg = Math.atan(oriPoint.y / oriPoint.x) / Math.PI * 180 + offsetDeg;
            var point2CenterRadian = (oriPoint2CenterDeg + rotateDeg) / 180 * Math.PI;

            points.push({
                x: Math.cos(point2CenterRadian) * canvasRadius,
                y: Math.sin(point2CenterRadian) * canvasRadius
            })
        }

        return points;
    },
    // 这是给 flushMountPrint 增加的 画圆角和 画额外阴影的方法。通用性不一定好。
    drawBorderRadius: function(canvasId,radius,fillColor){
        var canvas = document.getElementById(canvasId),
            ctx = canvas.getContext("2d"),
            width = canvas.width || 0,
            height = canvas.height || 0;
            // 左上圆角
            ctx.fillStyle= fillColor || "#fff";
            ctx.beginPath();
            ctx.moveTo(0,0);           // 创建开始点
            ctx.lineTo(radius,0);          // 创建水平线
            ctx.arcTo(0,0,0,radius,radius); // 创建弧
            ctx.lineTo(0,0);         // 创建垂直线
            ctx.fill();
            ctx.closePath();
            // 右上圆角
            // ctx.fillStyle= "red";
            ctx.beginPath();
            ctx.moveTo(width,0);           // 创建开始点
            ctx.lineTo(width-radius,0);          // 创建水平线
            ctx.arcTo(width,0,width,radius,radius); // 创建弧
            ctx.lineTo(width,0);         // 创建垂直线
            ctx.fill();
            ctx.closePath();
            // 左下圆角
            ctx.beginPath();
            ctx.moveTo(0,height);           // 创建开始点
            ctx.lineTo(0,height-radius);          // 创建水平线
            ctx.arcTo(0,height,radius,height,radius); // 创建弧
            ctx.lineTo(0,height);         // 创建垂直线
            ctx.fill();
            ctx.closePath();
            // 右下圆角
            ctx.fillStyle= fillColor || "black";
            ctx.beginPath();
            ctx.moveTo(width,height);           // 创建开始点
            ctx.lineTo(width-radius,height);          // 创建水平线
            ctx.arcTo(width,height,width,height-radius,radius); // 创建弧
            ctx.lineTo(width,height);         // 创建垂直线
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle= fillColor || "rgba(0,0,0,0.6)";
            ctx.beginPath();
            ctx.moveTo(width-radius,0);
            ctx.arcTo(width,0,width,radius,radius);
            ctx.lineTo(width,radius/3);
            ctx.lineTo(width-radius,0);
            ctx.fill();
            ctx.closePath();

    },
    resizeImageWithShadow: function(canvasId,w,h,radiu){
        var canvas = document.getElementById(canvasId),
            ctx = canvas.getContext("2d"),
            tmpCanvas = document.createElement("canvas"),
            tctx = tmpCanvas.getContext("2d"),
            w = canvas.width,
            h = canvas.height;

        var tmpCanvasWidth = w + 20;
        var tmpCanvasHeight = h + 20;
        // radiu = radiu / ratio;
        tmpCanvas.width = tmpCanvasWidth;
        tmpCanvas.height = tmpCanvasHeight;
        tctx.fillStyle = 'white';
        tctx.fillRect(0,0,tmpCanvasWidth,tmpCanvasHeight);
        tctx.shadowBlur=1;
        tctx.shadowOffsetX=3;
        tctx.shadowOffsetY=2;
        tctx.fillStyle="black";
        tctx.shadowColor="rgba(0,0,0,0.8)";
       // tctx.fillStyle="rgba(0,0,0,0.8)";
        tctx.beginPath();
        tctx.moveTo(10+radiu,tmpCanvasHeight-10);
        tctx.arcTo(10,tmpCanvasHeight-10,10,tmpCanvasHeight-10-radiu,radiu);
        tctx.lineTo(10+radiu,10);
        tctx.arcTo(tmpCanvasWidth-10,10,tmpCanvasWidth-10,10+radiu/2,radiu);
        tctx.lineTo(tmpCanvasWidth-10,tmpCanvasHeight-10-radiu);
        tctx.arcTo(tmpCanvasWidth-10,tmpCanvasHeight-10,tmpCanvasWidth-10-radiu,tmpCanvasHeight-10,radiu);
        tctx.lineTo(10+radiu/1.5,tmpCanvasHeight-10);
        tctx.fill();
        tctx.closePath();
        tctx.shadowBlur=0;
        tctx.shadowColor="transparents";
        tctx.shadowOffsetX=0;
        tctx.shadowOffsetY=0;
        tctx.drawImage(canvas,10,10,w,h);

        return tmpCanvas.toDataURL("image/png");
    },
    replaceColorOutOfArea: function(imageData,x,y,sourceColor,w,h,replaceColor,replaceTransparentColor,type) {
        var x = ~~(x || 0),
            y = ~~(y || 0),
            w = x + w || imageData.width,
            h = y + h || imageData.height,
            canvasWidth = imageData.width,
            canvasHeight = imageData.height;
        if(x<0 || y<0 || w>imageData.width || h>imageData.height){
            // throw new Error("error params!");
            return imageData;
        }
        for(var j=0;j<canvasHeight;j++){
            for(var i=0;i<canvasWidth;i++){
                var rowInArea = true,
                    columnInArea = true;
                // 判断圆形抠图还是矩形抠图
                switch(type) {
                    case 'Round':
                        var centerX = (w + x) / 2,
                            centerY = (h + y) / 2,
                            distance = (w - x) / 2;
                        rowInArea = columnInArea = Math.sqrt(Math.pow((i - centerX), 2) + Math.pow((j - centerY), 2)) < distance;
                        break;
                    case 'Square':
                    default:
                        rowInArea = i >= x && i < w;
                        columnInArea = j >= y && j < h;
                        break;
                }
                var index = j * imageData.width + i,
                    r = imageData.data[4*index],
                    g = imageData.data[4*index+1],
                    b = imageData.data[4*index+2],
                    a = imageData.data[4*index+3];
                if(replaceTransparentColor && a !== 255) {
                    imageData.data[4*index+3] = 255;
                }
                if(rowInArea && columnInArea) {
                    if(replaceTransparentColor && a !== 255) {
                        imageData.data[4*index] = replaceTransparentColor.r;
                        imageData.data[4*index+1] = replaceTransparentColor.g;
                        imageData.data[4*index+2] = replaceTransparentColor.b;
                        imageData.data[4*index+3] = 255;
                    }
                    continue;
                }
                var isRMatched = r > sourceColor.r -50 && r < sourceColor.r + 50;
                var isGMatched = g > sourceColor.g -50 && g < sourceColor.g + 50;
                var isBMatched = b > sourceColor.b -50 && b < sourceColor.b + 50;
                if(isRMatched && isGMatched && isBMatched){
                    if(replaceColor){
                        imageData.data[4*index] = replaceColor.r;
                        imageData.data[4*index+1] = replaceColor.g;
                        imageData.data[4*index+2] = replaceColor.b;
                        imageData.data[4*index+3] = 255;
                    }else{
                        imageData.data[4*index+3] = 0;
                    }
                }
            }
        }
        return imageData;
    }
}
