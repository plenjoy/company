import { combine } from "./point9Scale";

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
 * 对参数的合法性检测.
 */
function checkParams(imgObj) {
  var isPassed = true;
  var verify = function (obj) {
    var valid = true;

    if (!obj || !obj.size || !obj.size.width || !obj.size.height || !obj.images ||
      obj.images.length !== 9) {
      valid = false;
    }

    return valid;
  };

  if (!verify(imgObj)) {
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
  img.onload = function () {
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
 */
function drawImage(canvas, img, x, y, done) {
  if (canvas) {
    var cxt = canvas.getContext('2d');

    loadImage(img, function (data) {
      cxt.drawImage(data, x, y);
      done && done();
    });
  }
}

/**
 * 把3张大图合并成一张封面图.
 * @param  {object}   back  back图的对象, 结构为: {0: {img, paddings}}
 * @param  {number}  count 把多少张图片合并成一张大图.
 * @param  {Function} done  合并完成后的回调.
 */
function toOne(imgObj, count, done) {
  var iNow = 0;
  var canvasWidth = 0;
  var canvasHeight = 0;
  var drawCompleted = function () {
    if (++iNow === count) {
      // 获取绘制好的图片.
      var data = canvas.toDataURL();

      done && done({
        img: data,
        size: {
          width: canvasWidth,
          height: canvasHeight
        }
      });
    }
  };

  // 计算canvas的宽和高.
  for (var i = 0; i < count; i++) {
    canvasWidth += Math.ceil(imgObj[i].size.width);

    // 高就以第一张图片为基准.
    canvasHeight = Math.ceil(imgObj[0].size.height);
  }

  // 新建一个用于绘制大图的canvas容器.
  var canvas = createCanvas(canvasWidth, canvasHeight);

  // 绘制所有图片.
  var tempX = 0;
  var baseY = 0;
  for (var i = 0; i < count; i++) {
    var obj = imgObj[i];
    if(i=== 0){
      baseY = obj.paddings.top;
    }
    if (i !== 0) {
      tempX += Math.ceil(imgObj[i - 1].size.width);
    }
    drawImage(canvas, obj.img, tempX, baseY - obj.paddings.top, drawCompleted);
  }
}

/**
 * 调用9p-scale.js的scale方法, 分别生成back, spain和cover上的图片, 然后合并成一张后输出.
 * @param  {array} imgObjArray 生成背面图片的9张小图, 其数据结构为: [{paddings, size, images}]
 * @param  {function} done 大图合成以后的回调, 参数里包含了新合成的大图的数据.
 */
export const run = (imgObjArray, done) => {
  if (!imgObjArray || !imgObjArray.length) {
    log('合并渲染图片时, 参数imgObjArray不能为空.');
    return;
  }

  // 用于存放合成后的所有图片.
  const imgObj = {};
  let iNow = 0;

  const callback = () => {
    if (++iNow === imgObjArray.length) {
      // 把多张张小图合成一张大图
      toOne(imgObj, imgObjArray.length, (opt)=> {
        opt.paddings = imgObj[0].paddings;
        opt.outPaddings = imgObj[0].outPaddings;
        done && done(opt);
      });
    }
  };

  // 参数检查.
  imgObjArray.forEach((item)=> {
    if (!checkParams(item)) {
      return;
    }
  });

  // 合成
  imgObjArray.forEach((item, i)=> {
    combine(item.images, Math.ceil(item.size.width), Math.ceil(item.size.height), item.paddings, item.outPaddings, function (opt) {
      imgObj[i] = opt;
      callback();
    });
  });
};

/*
 使用实例:

 <img alt="" id="box">
 <script>
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
 </script>

 */
