/* ---------------images的相关方法--------------------------*/
/**
 * 加载图片
 * @param  {string} url 待加载图片的地址
 * @param  {Function} cb 加载完成后的回调
 */
function loadImage(url) {
  const promise = new Promise((resolve, reject) => {
    if (!url) {
      reject();
    } else {
      const img = new Image();
      img.onload = function() {
        resolve(img);
      };
      img.onerror = function() {
        reject();
      };

      img.src = url;
    }
  });

  return promise;
}

/**
 * 计算图片的宽和高
 * @param  {string} url 待加载图片的地址
 * @param  {Function} cb 加载完成后的回调
 */
function getImageSize(url, cb) {
  const size = {
    width: 0,
    height: 0
  };

  if (!url) {
    cb && cb(size);
  } else {
    loadImage(url).then((img) => {
      size.width = img.width;
      size.height = img.height;

      cb && cb(size);
    });
  }
}
/* ---------------end images的相关方法------------------------*/


/* ---------------计算的相关方法------------------------*/
/**
 * 根据9张小图, 计算使用这9张小图拼接(不缩放)后的图片的基础宽高.
 * @param  {array} images 包含待拼接的9张小图的数组
 */
function getBaseImageSize(images) {
  const size = {
    width: 0,
    height: 0
  };

  if (images && images.length === 9) {
    size.width = images[0].width + images[1].width + images[2].width;
    size.height = images[0].height + images[3].height + images[6].height;
  }

  return size;
}


/* ---------------DOM的相关方法------------------------*/
/**
 * 新建一个指定宽高的canvas容器
 * @param  {number} width 待创建的canvas的宽
 * @param  {number} height 待创建的canvas的高
 */
function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
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

  const ctx = canvas.getContext('2d');
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

/* ---------------end DOM的相关方法------------------------*/

/**
 * 做初始化工作, 获取所有图片的的信息, 包括宽和高.
 * @param  {array} images 所有小图的地址的数组
 * @param  {function} 所有图片的宽高都获取成功后的回调.
 */
function init(images, cb) {
  const getNameFromUrl = function(url) {
    const arr = url.split('/');

    return arr[arr.length - 1];
  };

  if (!images || !images.length) {
    return;
  }

  const allPromises = [];
  images.forEach((url) => {
    allPromises.push(loadImage(url));
  });

  if (allPromises && allPromises.length) {
    Promise.all(allPromises).then(imagesArray => {
      cb && cb(imagesArray);
    });
  }
}

/**
 * 根据9张小图片, 拼接成一张指定宽高的大图.
 * @param  {array} images 所有小图的地址的数组
 * @param  {number} centerWidth 画布区域宽
 * @param  {number} centerHeight 画布区域高
 * @param  {number} borderSize 边框宽度：包括top, right, bottom, left四个方向的值.
 */

export default (images, centerWidth, centerHeight, borderSize, paddingSize, innerPaddingSize) => {
  const promise = new Promise((resolve, reject) => {
    centerWidth = centerWidth || 0;
    centerHeight = centerHeight || 0;
    borderSize.top = borderSize.top || 0;
    borderSize.right = borderSize.right || 0;
    borderSize.bottom = borderSize.bottom || 0;
    borderSize.left = borderSize.left || 0;

    if (!images || images.length !== 9 || !centerWidth || !centerHeight) {
      reject("param error");
    }

    init(images, (allImages) => {
      // 计算每一张小图在canvas绘制时的坐标和宽高
      const imagesOptionsInCanvas = computedImageParamsInCanvas(allImages, centerWidth, centerHeight, borderSize, paddingSize, innerPaddingSize);

      // 新建一个新的canvas作为绘图容器
      const container = imagesOptionsInCanvas.container;
      const canvas = createCanvas(container.width, container.height);

      // 把图片绘制到canvas上.
      imagesOptionsInCanvas.images.forEach((imgOption) => {
        drawImage(canvas,
          imgOption.img,
          imgOption.x,
          imgOption.y,
          imgOption.img.width,
          imgOption.img.height,
          imgOption.dWidth,
          imgOption.dHeight);
      });

      const base64Data = canvasToBase64(canvas);
      resolve({ img: base64Data, padding: imagesOptionsInCanvas.padding, container });
    });

  });

  return promise;
}

function computedImageParamsInCanvas(images, centerWidth, centerHeight, borderSize, paddingSize, innerPaddingSize) {
  
  

  let offsetTop = 0;
  let offsetBottom = 0;
  let offsetLeft = 0;
  let offsetRight = 0;

  let innerOffsetTop = 0;
  let innerOffsetBottom = 0;
  let innerOffsetLeft = 0;
  let innerOffsetRight = 0;


  if(paddingSize){
    offsetTop = paddingSize.top;
    offsetBottom = paddingSize.bottom;
    offsetLeft = paddingSize.left;
    offsetRight = paddingSize.right;
  }

  if(innerPaddingSize){
    innerOffsetTop = innerPaddingSize.top;
    innerOffsetBottom = innerPaddingSize.bottom;
    innerOffsetLeft = innerPaddingSize.left;
    innerOffsetRight = innerPaddingSize.right;
  }

  let imageSize = {
    top: offsetTop + borderSize.top + innerOffsetTop,
    bottom: offsetBottom + borderSize.bottom + innerOffsetBottom,
    left: offsetLeft + borderSize.left + innerOffsetLeft,
    right: offsetRight + borderSize.right + innerOffsetRight
  }

  const imagesOptionsInCanvas = {
    container: {
      width: centerWidth + borderSize.left + borderSize.right + offsetLeft + offsetRight,
      height: centerHeight + borderSize.top + borderSize.bottom + offsetTop + offsetBottom
    },
    padding: {
      x: offsetLeft + borderSize.left,
      y: offsetTop + borderSize.top
    },
    images: []
  };


  centerWidth = centerWidth - innerOffsetLeft - innerOffsetRight;
  centerHeight = centerHeight - innerOffsetTop - innerOffsetBottom;

  
  /* 计算小图缩放后的大小 */
  // 左上角
  const topLeftImgSize = {
    width: (imageSize.left),
    height: (imageSize.top)
  };

  // 右上角
  const topRightImgSize = {
    width: (imageSize.right),
    height: (imageSize.top)
  };

  // 左下角
  const bottomLeftImgSize = {
    width: (imageSize.left),
    height: (imageSize.bottom)
  };

  // 右下角
  const bottomRightImgSize = {
    width: (imageSize.right),
    height: (imageSize.bottom)
  };

  // 顶部中间区域
  const topMiddleImgSize = {
    width: centerWidth,
    height: (imageSize.top)
  };

  // 左侧中间区域
  const leftMiddleImgSize = {
    width: (imageSize.left),
    height: centerHeight
  };

  // 中间区域
  const middleImgSize = {
    width: centerWidth,
    height: centerHeight
  };

  // 右侧中间区域
  const rightMiddleImgSize = {
    width: (imageSize.right),
    height: centerHeight
  };

  // 底部中间区域
  const bottomMiddleImgSize = {
    width: centerWidth,
    height: (imageSize.bottom)
  };
  /*--------------------------------------------*/

  // 计算左上角小图的坐标和缩放后的大小.
  const topLeftImg = {
    x: 0,
    y: 0,
    dWidth: topLeftImgSize.width,
    dHeight: topLeftImgSize.height,
    img: images[0]
  };

  // 计算顶部中间小图的坐标和缩放后的大小.
  const topMiddleImg = {
    x: topLeftImg.dWidth,
    y: 0,
    dWidth: topMiddleImgSize.width,
    dHeight: topMiddleImgSize.height,
    img: images[1]
  };

  // 计算右上角张小图的坐标和缩放后的大小.
  const topRightImg = {
    x: topLeftImgSize.width + topMiddleImgSize.width,
    y: 0,
    dWidth: topRightImgSize.width,
    dHeight: topRightImgSize.height,
    img: images[2]
  };

  // 计算左侧中间区域小图的坐标和缩放后的大小.
  const leftMiddleImg = {
    x: 0,
    y: topLeftImgSize.height,
    dWidth: leftMiddleImgSize.width,
    dHeight: leftMiddleImgSize.height,
    img: images[3]
  };

  // 计算中间区域小图的坐标和缩放后的大小.
  const middleImg = {
    x: topLeftImgSize.width,
    y: topLeftImgSize.height,
    dWidth: middleImgSize.width,
    dHeight: middleImgSize.height,
    img: images[4]
  };

  // 计算右侧中间区域小图的坐标和缩放后的大小.
  const rightMiddleImg = {
    x: topLeftImgSize.width + middleImgSize.width,
    y: topLeftImgSize.height,
    dWidth: rightMiddleImgSize.width,
    dHeight: rightMiddleImgSize.height,
    img: images[5]
  };

  // 计算左下角张小图的坐标和缩放后的大小.
  const bottomLeftImg = {
    x: 0,
    y: topRightImgSize.height + leftMiddleImgSize.height,
    dWidth: bottomLeftImgSize.width,
    dHeight: bottomLeftImgSize.height,
    img: images[6]
  };

  // 计算底部中间区域小图的坐标和缩放后的大小.
  const bottomMiddleImg = {
    x: bottomLeftImgSize.width,
    y: topRightImgSize.height + leftMiddleImgSize.height,
    dWidth: bottomMiddleImgSize.width,
    dHeight: bottomMiddleImgSize.height,
    img: images[7]
  };

  // 计算底部右侧区域小图的坐标和缩放后的大小.
  const bottomRightImg = {
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
  imagesOptionsInCanvas.images.push(middleImg);
  imagesOptionsInCanvas.images.push(leftMiddleImg);
  
  imagesOptionsInCanvas.images.push(rightMiddleImg);
  imagesOptionsInCanvas.images.push(bottomLeftImg);
  imagesOptionsInCanvas.images.push(bottomMiddleImg);
  imagesOptionsInCanvas.images.push(bottomRightImg);

  return imagesOptionsInCanvas;

}

//例子
/*draw(imageGroup[this.state.imageNubmer], this.state.width, this.state.height, {
            top: this.state.border,
            left: this.state.border,
            right: this.state.border,
            bottom: this.state.border
        }, padding).then((value) => {
            oBox.src = value;
            const width = this.state.imageNubmer == 2 ? (parseInt(this.state.width)) + "px" : (parseInt(this.state.width) + parseInt(this.state.border * 2)) + "px";
            const height = this.state.imageNubmer == 2 ? (parseInt(this.state.height)) + "px" : (parseInt(this.state.height) + parseInt(this.state.border * 2)) + "px";
            this.setState({
                showShadow: true,
                shadowWidth: width,
                shadowHeight: height,
                left: this.state.imageNubmer == 2 ? '49.5%' : '50%',
                top: this.state.imageNubmer == 2 ? '51%' : '50%',
            });

            if(this.state.imageNubmer == 5){
                this.setState({
                    showShadow: false
                });
            }
        });*/