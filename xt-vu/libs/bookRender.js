 /*
  使用实例:
  
 window.onload = function() {
      var oBox = document.getElementById('box');
      var targetWidth = 800;
      var targetHeight = 600;
      var spainW = 75;
      var backImages = [
          './img/back/Back-01.png',
          './img/back/Back-02.png',
          './img/back/Back-03.png',
          './img/back/Back-04.png',
          './img/back/Back-05.png',
          './img/back/Back-06.png',
          './img/back/Back-07.png',
          './img/back/Back-08.png',
          './img/back/Back-09.png'
      ];
      var spainImages = [
          './img/spain/Spain-01.png',
          './img/spain/Spain-02.png',
          './img/spain/Spain-03.png',
          './img/spain/Spain-04.png',
          './img/spain/Spain-05.png',
          './img/spain/Spain-06.png',
          './img/spain/Spain-07.png',
          './img/spain/Spain-08.png',
          './img/spain/Spain-09.png'
      ];
      var coverImages = [
          './img/cover/Cover-01.png',
          './img/cover/Cover-02.png',
          './img/cover/Cover-03.png',
          './img/cover/Cover-04.png',
          './img/cover/Cover-05.png',
          './img/cover/Cover-06.png',
          './img/cover/Cover-07.png',
          './img/cover/Cover-08.png',
          './img/cover/Cover-09.png'
      ];


      bookRender.run({
          images: backImages,
          size: {
              width: targetWidth,
              height: targetHeight
          }
      }, {
          images: spainImages,
          size: {
              width: spainW,
              height: targetHeight
          }
      }, {
          images: coverImages,
          size: {
              width: targetWidth,
              height: targetHeight
          }
      }, function(opt) {
          oBox.src = opt.data;
      });

  };
  */

 (function(global, factory) {
     // commonjs
     if (typeof exports === 'object' && typeof module !== 'undefined') {
         module.exports = factory();
     } else if (typeof define === 'function' && define.amd) {
         // amd
         define(factory);
     } else {
         // 直接使用
         global.bookRender = global.bookRender || factory();
     }
 }(this, function() {
     'use strict';

     /*九宫格合成算法*/
     var p9Scale = (function() {
         /*---------------images的相关方法--------------------------*/
         /**
          * 加载图片
          * @param  {string} url 待加载图片的地址
          * @param  {Function} cb 加载完成后的回调
          */
         function loadImage(url, cb) {
             if (!url) {
                 return;
             }

             var img = new Image();
             img.onload = function() {
                 cb && cb(img);
             };

             img.src = url;
         }

         /**
          * 计算图片的宽和高
          * @param  {string} url 待加载图片的地址
          * @param  {Function} cb 加载完成后的回调
          */
         function getImageSize(url, cb) {
             var size = {
                 width: 0,
                 height: 0
             };

             if (!url) {
                 cb && cb(size);
             } else {
                 loadImage(url, function(img) {
                     size.width = img.width;
                     size.height = img.height;

                     cb && cb(size);
                 });
             }
         }
         /*---------------end images的相关方法------------------------*/


         /*---------------计算的相关方法------------------------*/
         /**
          * 根据9张小图, 计算使用这9张小图拼接(不缩放)后的图片的基础宽高.
          * @param  {array} images 包含待拼接的9张小图的数组
          */
         function getBaseImageSize(images) {
             var size = {
                 width: 0,
                 height: 0
             };

             if (images && images.length === 9) {
                 size.width = images[0].width + images[1].width + images[2].width;
                 size.height = images[0].height + images[3].height + images[6].height;
             }

             return size;
         }

         /**
          * 获取4个角上的缩放比.
          * @param  {object} baseSize   包含width和height两个属性的对象
          * @param  {object} targetSize  包含width和height两个属性的对象
          */
         function getRatio(baseSize, targetSize) {
             var ratio = 1;
             if (baseSize && targetSize) {
                 var wRatio = baseSize.width / targetSize.width;
                 var hRatio = baseSize.height / targetSize.height;

                 // ratio = wRatio < hRatio ? wRatio : hRatio;            
                 ratio = hRatio;
             }

             return ratio;
         }

         /**
          * 计算白边占用整个宽高的比例.
          * @param  {number} padding  白边的像素值
          * @param  {[type]} baseSize 包含width和height两个属性的对象
          */
         function getPaddingRatio(paddings, baseSize) {
             return {
                 top: paddings.top / baseSize.height,
                 right: paddings.right / baseSize.width,
                 bottom: paddings.bottom / baseSize.height,
                 left: paddings.left / baseSize.width
             };
         }

         /**
          * 计算每张图片在canvas上的坐标和实际要绘制的大小.
          * @param  {array} images 基于Stream的图片数组, 每一对象包含图片的实际数据和图片的各个属性如width, height
          * @param  {number} targetWidth 合成后的图片的宽
          * @param  {number} targetHeight 合成后的图片的高
          * @param  {number} padding 白边的大小.
          */
         function computedImageParamsInCanvas(images, targetWidth, targetHeight, paddings) {
             var baseSize = getBaseImageSize(images);
             var paddingRatios = getPaddingRatio(paddings, baseSize);

             // 期望的宽加上左侧白边的宽
             var paddingsInContainer = {
                 top: paddingRatios.top ? (paddingRatios.top * targetHeight) / (1 - paddingRatios.top) : 0,
                 right: paddingRatios.right ? (paddingRatios.right * targetWidth) / (1 - paddingRatios.right) : 0,
                 bottom: paddingRatios.bottom ? (paddingRatios.bottom * targetHeight) / (1 - paddingRatios.bottom) : 0,
                 left: paddingRatios.left ? (paddingRatios.left * targetWidth) / (1 - paddingRatios.left) : 0
             };
             var containerWidth = targetWidth + paddingsInContainer.left + paddingsInContainer.right;

             // 期望的高加上下宽白边的高.
             var containerHeight = targetHeight + paddingsInContainer.top + paddingsInContainer.bottom;
             var containerSize = { width: containerWidth, height: containerHeight };
             var ratio = getRatio(baseSize, containerSize);

             var imagesOptionsInCanvas = {
                 container: {
                     paddings: paddingsInContainer,
                     width: containerWidth,
                     height: containerHeight
                 },
                 images: []
             };

             /* 计算小图缩放后的大小 */
             // 左上角   
             var topLeftImgSize = {
                 width: Math.round(images[0].width / ratio),
                 height: Math.round(images[0].height / ratio)
             };

             // 右上角
             var topRightImgSize = {
                 width: Math.round(images[2].width / ratio),
                 height: topLeftImgSize.height
             };

             // 左下角
             var bottomLeftImgSize = {
                 width: topLeftImgSize.width,
                 height: Math.round(images[6].height / ratio)
             };

             // 右下角
             var bottomRightImgSize = {
                 width: topRightImgSize.width,
                 height: bottomLeftImgSize.height
             };

             // 顶部中间区域
             var topMiddleImgSize = {
                 width: containerWidth - (topLeftImgSize.width + topRightImgSize.width),
                 height: topLeftImgSize.height
             };

             // 左侧中间区域
             var leftMiddleImgSize = {
                 width: topLeftImgSize.width,
                 height: containerHeight - (topLeftImgSize.height + bottomLeftImgSize.height)
             };

             // 中间区域
             var middleImgSize = {
                 width: topMiddleImgSize.width,
                 height: leftMiddleImgSize.height
             };

             // 右侧中间区域
             var rightMiddleImgSize = {
                 width: topRightImgSize.width,
                 height: containerHeight - (topRightImgSize.height + bottomRightImgSize.height)
             };

             // 底部中间区域
             var bottomMiddleImgSize = {
                 width: topMiddleImgSize.width,
                 height: bottomLeftImgSize.height
             };
             /*--------------------------------------------*/

             // 计算左上角小图的坐标和缩放后的大小.
             var topLeftImg = {
                 x: 0,
                 y: 0,
                 dWidth: topLeftImgSize.width,
                 dHeight: topLeftImgSize.height,
                 img: images[0]
             };

             // 计算顶部中间小图的坐标和缩放后的大小.
             var topMiddleImg = {
                 x: topLeftImg.dWidth,
                 y: 0,
                 dWidth: topMiddleImgSize.width,
                 dHeight: topMiddleImgSize.height,
                 img: images[1]
             };

             // 计算右上角张小图的坐标和缩放后的大小.
             var topRightImg = {
                 x: topLeftImgSize.width + topMiddleImgSize.width,
                 y: 0,
                 dWidth: topRightImgSize.width,
                 dHeight: topRightImgSize.height,
                 img: images[2]
             };

             // 计算左侧中间区域小图的坐标和缩放后的大小.
             var leftMiddleImg = {
                 x: 0,
                 y: topLeftImgSize.height,
                 dWidth: rightMiddleImgSize.width,
                 dHeight: rightMiddleImgSize.height,
                 img: images[3]
             };

             // 计算中间区域小图的坐标和缩放后的大小.
             var middleImg = {
                 x: topLeftImgSize.width,
                 y: topLeftImgSize.height,
                 dWidth: middleImgSize.width,
                 dHeight: middleImgSize.height,
                 img: images[4]
             };

             // 计算右侧中间区域小图的坐标和缩放后的大小.
             var rightMiddleImg = {
                 x: topLeftImgSize.width + middleImgSize.width,
                 y: topLeftImgSize.height,
                 dWidth: rightMiddleImgSize.width,
                 dHeight: rightMiddleImgSize.height,
                 img: images[5]
             };

             // 计算左下角张小图的坐标和缩放后的大小.
             var bottomLeftImg = {
                 x: 0,
                 y: topRightImgSize.height + leftMiddleImgSize.height,
                 dWidth: bottomLeftImgSize.width,
                 dHeight: bottomLeftImgSize.height,
                 img: images[6]
             };

             // 计算底部中间区域小图的坐标和缩放后的大小.
             var bottomMiddleImg = {
                 x: bottomLeftImgSize.width,
                 y: topRightImgSize.height + leftMiddleImgSize.height,
                 dWidth: bottomMiddleImgSize.width,
                 dHeight: bottomMiddleImgSize.height,
                 img: images[7]
             };

             // 计算底部右侧区域小图的坐标和缩放后的大小.
             var bottomRightImg = {
                 x: bottomLeftImgSize.width + bottomMiddleImgSize.width,
                 y: topRightImgSize.height + leftMiddleImgSize.height,
                 dWidth: bottomRightImgSize.width,
                 dHeight: bottomRightImgSize.height,
                 img: images[8]
             };

             // 计算后的添加到数组中并返回
             imagesOptionsInCanvas.images.push(topLeftImg);
             imagesOptionsInCanvas.images.push(topMiddleImg);
             imagesOptionsInCanvas.images.push(topRightImg);
             imagesOptionsInCanvas.images.push(leftMiddleImg);
             imagesOptionsInCanvas.images.push(middleImg);
             imagesOptionsInCanvas.images.push(rightMiddleImg);
             imagesOptionsInCanvas.images.push(bottomLeftImg);
             imagesOptionsInCanvas.images.push(bottomMiddleImg);
             imagesOptionsInCanvas.images.push(bottomRightImg);

             return imagesOptionsInCanvas;
         }

         /*---------------end 计算的相关方法------------------------*/


         /*---------------DOM的相关方法------------------------*/
         /**
          * 新建一个指定宽高的canvas容器
          * @param  {number} width 待创建的canvas的宽
          * @param  {number} height 待创建的canvas的高
          */
         function createCanvas(width, height) {
             var canvas = document.createElement('canvas');
             canvas.width = width;
             canvas.height = height;

             return canvas;
         }

         /**
          * 在canvas上绘制图片.
          * @param  {HTMLElement} canvas canvas节点
          * @param  {blob} img 待绘制的图片
          * @param  {number} x 目标画布的左上角在目标canvas上 X 轴的位置
          * @param  {number} y 目标画布的左上角在目标canvas上 Y 轴的位置
          * @param  {number} width 需要绘制到目标上下文中的，源图像的矩形选择框的宽度
          * @param  {number} height 需要绘制到目标上下文中的，源图像的矩形选择框的高度
          * @param  {number} dWidth 在目标画布上绘制图像的宽度。 允许对绘制的图像进行缩放
          * @param  {number} dHeight 在目标画布上绘制图像的高度。 允许对绘制的图像进行缩放
          */
         function drawImage(canvas, img, x, y, width, height, dWidth, dHeight) {
             if (!canvas || !img) {
                 return;
             }

             var ctx = canvas.getContext('2d');
             if (ctx) {
                 ctx.drawImage(img, 0, 0, width, height, x, y, dWidth, dHeight);
             }
         }

         /**
          * 把canvas数据转换成base64.
          * @param  {HTMLElement} canvas canvas节点
          */
         function canvasToBase64(canvas) {
             return canvas.toDataURL();
         }

         /*---------------end DOM的相关方法------------------------*/

         /**
          * 做初始化工作, 获取所有图片的的信息, 包括宽和高.
          * @param  {array} images 所有小图的地址的数组
          * @param  {function} 所有图片的宽高都获取成功后的回调.
          */
         function init(images, cb) {
             var imagesArray = [];
             var getNameFromUrl = function(url) {
                 var arr = url.split('/');

                 return arr[arr.length - 1];
             };

             if (!images || !images.length) {
                 return;
             }

             images.forEach(function(url) {
                 loadImage(url, function(img) {
                     imagesArray.push(img);

                     if (imagesArray.length === images.length) {
                         imagesArray = imagesArray.sort(function(first, second) {
                             var fName = getNameFromUrl(first.src);
                             var sName = getNameFromUrl(second.src);

                             return fName > sName;
                         });

                         cb && cb(imagesArray);
                     }
                 });
             });
         }

         /**
          * 根据9张小图片, 拼接成一张指定宽高的大图.
          * @param  {array} images 所有小图的地址的数组
          * @param  {number} targetWidth 拼接后的图片的宽
          * @param  {number} targetHeight 拼接后的图片的高
          * @param  {number} paddings 图片白边：包括top, right, bottom, left四个方向的值.
          * @param  {function} 拼接完成后的回调, 参数里包含了拼接后的大图.
          */
         function combine(images, targetWidth, targetHeight, paddings, cb) {
             targetWidth = parseInt(targetWidth) || 0;
             targetHeight = parseInt(targetHeight) || 0;
             paddings.top = parseInt(paddings.top) || 0;
             paddings.right = parseInt(paddings.right) || 0;
             paddings.bottom = parseInt(paddings.bottom) || 0;
             paddings.left = parseInt(paddings.left) || 0;

             // 参数检查.
             if (!images || images.length !== 9 || !targetWidth || !targetHeight) {
                 return;
             }

             // 获取所有图片的信息, 包括宽和高.
             init(images, function(allImages) {
                 // 计算每一张小图在canvas绘制时的坐标和宽高
                 var imagesOptionsInCanvas = computedImageParamsInCanvas(allImages, targetWidth, targetHeight, paddings);

                 // 新建一个新的canvas作为绘图容器
                 var container = imagesOptionsInCanvas.container;
                 var canvas = createCanvas(container.width, container.height);

                 console.log(imagesOptionsInCanvas);

                 // 把图片绘制到canvas上.
                 imagesOptionsInCanvas.images.forEach(function(imgOption) {
                     drawImage(canvas,
                         imgOption.img,
                         imgOption.x,
                         imgOption.y,
                         imgOption.img.width,
                         imgOption.img.height,
                         imgOption.dWidth,
                         imgOption.dHeight);
                 });

                 var base64Data = canvasToBase64(canvas);

                 cb && cb({
                     paddings: container.paddings,
                     size: {
                         width: container.width,
                         height: container.height
                     },
                     img: base64Data
                 })

             });
         }

         return {
             combine: combine
         };
     })();

     /*利用27张小图合成一张大的封面图*/
     var render = (function() {
         // 默认的back的白边参数
         var defaultPaddingsForBack = {
             top: 50,
             left: 50,
             right: 0,
             bottom: 50
         };

         // 默认的spain的白边参数
         var defaultPaddingsForSpain = {
             top: 50,
             left: 0,
             right: 0,
             bottom: 50
         };

         // 默认的cover的白边参数
         var defaultPaddingsForCover = {
             top: 50,
             left: 0,
             right: 50,
             bottom: 50
         };

         /**
          * 对参数进行校正.        
          */
         function correctParams(back, spain, cover) {
             back.paddings = back.paddings || defaultPaddingsForBack;
             spain.paddings = spain.paddings || defaultPaddingsForSpain;
             cover.paddings = cover.paddings || defaultPaddingsForCover;

             return {
                 back: back,
                 spain: spain,
                 cover: cover
             };
         }

         /**
          * 对参数的合法性检测.        
          */
         function checkParams(back, spain, cover) {
             var isPassed = true;
             var verify = function(obj) {
                 var valid = true;

                 if (!obj ||
                     !obj.size ||
                     !obj.size.width ||
                     !obj.size.height ||
                     !obj.images ||
                     obj.images.length !== 9) {
                     valid = false;
                 }

                 return valid;
             };

             if (!verify(back) || !verify(spain) || !verify(cover)) {
                 isPassed = false;
             }

             return isPassed;
         }

         /**
          * 加载图片
          * @param  {string} url 待加载图片的地址
          * @param  {Function} cb 加载完成后的回调
          */
         function loadImage(url, cb) {
             if (!url) {
                 return;
             }

             var img = new Image();
             img.onload = function() {
                 cb && cb(img);
             };

             img.src = url;
         }

         /**
          * 新建一个指定宽高的canvas容器
          * @param  {number} width 待创建的canvas的宽
          * @param  {number} height 待创建的canvas的高
          */
         function createCanvas(width, height) {
             var canvas = document.createElement('canvas');
             canvas.width = width;
             canvas.height = height;

             return canvas;
         }

         /**
          * 绘制图片到canvas
          * @param  {blob} img    待绘制的图片数据
          * @param  {number} x     起始点的x轴
          * @param  {number} y      起始点的y轴
          * @param  {number} width  在目标画布上绘制图像的宽度
          * @param  {number} height 在目标画布上绘制图像的高度
          */
         function drawImage(canvas, img, x, y, width, height, done) {
             if (canvas) {
                 var cxt = canvas.getContext('2d');

                 loadImage(img, function(data) {
                     cxt.drawImage(data, x, y, width, height);
                     done && done();
                 });
             }
         }

         /**
          * 把3张大图合并成一张封面图.
          * @param  {object}   back  back图的对象, 结构为: {img, paddings}
          * @param  {object}   spain  spain图的对象, 结构为: {img, paddings}
          * @param  {object}   cover  cover图的对象, 结构为: {img, paddings}
          * @param  {Function} done  合并完成后的回调.
          */
         function toOne(back, spain, cover, done) {
             var iNow = 0;
             var canvasWidth = back.size.width + spain.size.width + cover.size.width;
             var canvasHeight = back.size.height;
             var drawCompleted = function() {
                 if (++iNow === 3) {
                     // 获取绘制好的图片.
                     var data = canvas.toDataURL();

                     done && done({
                         data: data
                     });
                 }
             };

             // 新建一个用于绘制大图的canvas容器.
             var canvas = createCanvas(canvasWidth, canvasHeight);

             // 绘制back
             drawImage(canvas, back.img, 0, 0, back.size.width, back.size.height, drawCompleted);

             // 绘制spain
             drawImage(canvas, spain.img, back.size.width, 0, spain.size.width, spain.size.height, drawCompleted);

             // 绘制cover
             drawImage(canvas, cover.img, back.size.width + spain.size.width, 0, cover.size.width, cover.size.height, drawCompleted);
         }

         /**
          * 调用9p-scale.js的scale方法, 分别生成back, spain和cover上的图片, 然后合并成一张后输出.
          * @param  {object}   back 生成背面图片的9张小图, 其数据结构为: {paddings, size, images} 
          * @param  {object}   spain 生成背面图片的9张小图, 其数据结构为: {paddings, size, images}
          * @param  {object}   cover 生成背面图片的9张小图, 其数据结构为: {paddings, size, images}
          * @param  {function} done 大图合成以后的回调, 参数里包含了新合成的大图的数据.
          */
         function run(back, spain, cover, done) {

             if (!checkParams(back, spain, cover)) {
                 return;
             }

             // 对参数的paddings进行校正.
             var obj = correctParams(back, spain, cover);

             // 用于存放合成后的back, spain, cover.
             var imgObj = {};
             var iNow = 0;

             // 合成back.
             p9Scale.combine(obj.back.images, obj.back.size.width, obj.back.size.height, obj.back.paddings, function(opt) {
                 imgObj.back = opt;
                 if (++iNow === 3) {
                     // 把3张小图合成一张大图
                     toOne(imgObj.back, imgObj.spain, imgObj.cover, done);
                 }
             });

             // 合成spain.
             p9Scale.combine(obj.spain.images, obj.spain.size.width, obj.spain.size.height, obj.spain.paddings, function(opt) {
                 imgObj.spain = opt;

                 if (++iNow === 3) {
                     // 把3张小图合成一张大图
                     toOne(imgObj.back, imgObj.spain, imgObj.cover, done);
                 }
             });

             // 合成cover.
             p9Scale.combine(obj.cover.images, obj.cover.size.width, obj.cover.size.height, obj.cover.paddings, function(opt) {
                 imgObj.cover = opt;

                 if (++iNow === 3) {
                     // 把3张小图合成一张大图
                     toOne(imgObj.back, imgObj.spain, imgObj.cover, done);
                 }
             });
         }

         return {
             run: run
         };
     })();

     return {
         // 九宫格合成算法.
         combine: p9Scale.combine,

         // 利用27张小图合成一张大的封面图
         run: render.run
     };
 }));
