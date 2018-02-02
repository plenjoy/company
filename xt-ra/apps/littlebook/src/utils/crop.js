import { merge, get } from 'lodash';
import { cropLimitedSize } from '../contants/strings';
import { getDefaultCrop } from '../../../common/utils/crop';

/**
 * { 调整图片到限制尺寸以内 }
 * @param {[number]} width  预计显示宽度；
 * @param {[number]} height 预计显示高度；
 * @param {[number]} limitedSize 最大的截图限制尺寸；
 */
export const covertCropSizeToLimit = (oldWidth, oldHeight, limitedSize) => {
  let width = oldWidth;
  let height = oldHeight;
  if (width > limitedSize) {
    const scale = limitedSize / width;
    width = limitedSize;
    height = Math.round(height * scale);
  }
  if (height > limitedSize) {
    const scale = limitedSize / height;
    height = limitedSize;
    width = Math.round(width * scale);
  }
  return { width, height };
};

/**
 * 获取用于图片裁剪时的各种参数.
 * @param  {[number]} cropLUX 左上角的x坐标
 * @param  {[number]} cropLUY 左上角的y坐标
 * @param  {[number]} cropRLX 右下角的x坐标
 * @param  {[number]} cropRLY 右下角的y坐标
 * @param  {[number]} targetWidth  容器的宽
 * @param  {[number]} targetHeight 容器的高
 */
export const getCropOptionsByLR = (cropLUX, cropLUY, cropRLX, cropRLY, targetWidth, targetHeight, limitedSize = cropLimitedSize) => {
  const px = cropLUX;
  const py = cropLUY;
  const pw = cropRLX - cropLUX;
  const ph = cropRLY - cropLUY;
  let width = Math.round(targetWidth / pw);
  let height = Math.round(targetHeight / ph);

  if (limitedSize) {
    const newSizes = covertCropSizeToLimit(width, height, limitedSize);
    width = newSizes.width;
    height = newSizes.height;
  }

  return { px, py, pw, ph, width, height };
};

/**
 * 获取用于裁剪时的各种参数
 * @param  {[number]} px
 * @param  {[number]} py
 * @param  {[number]} pw
 * @param  {[number]} ph
 * @return {[object]}
 */
export const getCropLRByOptions = (px, py, pw, ph) => {
  const cropLUX = px;
  const cropLUY = py;
  const cropRLX = cropLUX + pw;
  const cropRLY = cropLUY + ph;
  return { cropLUX, cropLUY, cropRLX, cropRLY };
};

/**
 * 获取用于图片裁剪时的各种参数.
 * @param  {number} imageWidth 图片的原始宽
 * @param  {number} imageHeight 图片的原始高
 * @param  {number} targetWidth 容器的宽
 * @param  {number} targetHeight 容器的高
 */
export const getCropOptions = (imageWidth, imageHeight, targetWidth, targetHeight, imageRotate) => {
  let iWidth,
    iHeight;

  // 90, 270
  const isSwitched = ((Math.abs(imageRotate) / 90) % 2) === 1;
  if (isSwitched) {
    iWidth = imageHeight;
    iHeight = imageWidth;
  } else {
    iWidth = imageWidth;
    iHeight = imageHeight;
  }
  const cropOptions = getDefaultCrop(iWidth, iHeight, targetWidth, targetHeight);
  const { px, py, pw, ph } = cropOptions;

  // 裁剪时的左上角和右下角坐标.
  const cropLR = getCropLRByOptions(px, py, pw, ph);
  const { cropLUX, cropLUY, cropRLX, cropRLY } = cropLR;

  let width = Math.round(targetWidth / pw);
  let height = Math.round(targetHeight / ph);

  if (cropLimitedSize) {
    const newSizes = covertCropSizeToLimit(width, height, cropLimitedSize);
    width = newSizes.width;
    height = newSizes.height;
  }

  return merge({}, {
    px,
    py,
    pw,
    ph,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    // width: Math.round(targetWidth / pw),
    // height: Math.round(targetHeight / ph)
    width,
    height
  });
};

export const getCropRect = (element, im) => {
  const imWidth = im ? im.width : 0;
  const imHeight = im ? im.height : 0;
  const { cropLUX, cropLUY, cropRLX, cropRLY, width, height } = element;
  const px = cropLUX;
  const py = cropLUY;
  const pw = cropRLX - cropLUX;
  const ph = cropRLY - cropLUY;

  return {
    x: imWidth * px,
    y: imHeight * py,
    width: imWidth * pw,
    height: imHeight * ph
  };
};

/**
 * 通过裁切区域的图片信息获取crop
 * @param  {[type]} imgCrop 图片裁切信息
 * @param  {[type]} im      原图信息
 */
export const getCropOptionsByRect = (imgCrop, im) => {
  const px = imgCrop.x / im.width;
  const py = imgCrop.y / im.height;
  const pw = imgCrop.width / im.width;
  const ph = imgCrop.height / im.height;
  return getCropLRByOptions(px, py, pw, ph);
};

/**
 * 基于原来的crop信息计算新的crop
 * @param  {[type]} element    新元素
 * @param  {[type]} oriElement 老元素
 * @param  {[type]} imageInfo  图片信息
 */
export const getNewCropByBase = (element, oriElement, imageInfo, ratio) => {
  let imageWidth = get(imageInfo, 'width');
  let imageHeight = get(imageInfo, 'height');

  const oriWidth = Math.round(oriElement.width);
  const oriHeight = Math.round(oriElement.height);
  const oriX = Math.round(oriElement.x);
  const oriY = Math.round(oriElement.y);
  const oriCropLUX = oriElement.cropLUX;
  const oriCropLUY = oriElement.cropLUY;
  const oriCropRLX = oriElement.cropRLX;
  const oriCropRLY = oriElement.cropRLY;

  const newWidth = Math.round(element.width);
  const newHeight = Math.round(element.height);
  const newX = Math.round(element.x);
  const newY = Math.round(element.y);
  const imageRot = oriElement.imgRot;

  // 如果图片旋转 交换宽高
  if (Math.abs(imageRot / 90) % 2 === 1) {
    imageWidth = [imageHeight, imageHeight = imageWidth][0];
  }

  // 计算上一次状态和当前状态的差值
  const diffX = Math.round((oriX - newX) * ratio);
  const diffY = Math.round((oriY - newY) * ratio);
  let diffWidth = Math.round((oriWidth - newWidth) * ratio);
  let diffHeight = Math.round((oriHeight - newHeight) * ratio);

  // 计算裁切图片区域信息
  let x = Math.round(imageWidth * oriCropLUX);
  let y = Math.round(imageHeight * oriCropLUY);
  let width = Math.round(imageWidth * (oriCropRLX - oriCropLUX));
  let height = Math.round(imageHeight * (oriCropRLY - oriCropLUY));

  const elementRatio = newWidth / newHeight;

  // x变动了
  if (diffX) {
    x -= diffX;
    width += diffX;
    // 如果左边碰到边 则向右延展
    if (x < 0) {
      width -= x;
      x = 0;
    }
    if (width > imageWidth) {
      width = imageWidth;
    }
  }

  // y变动了
  if (diffY) {
    y -= diffY;
    height += diffY;
    // 如果上边碰到边 则向下延展
    if (y < 0) {
      height -= y;
      y = 0;
    }
    if (height > imageHeight) {
      height = imageHeight;
    }
  }

  // x的变动会有width的变动 width的差值需要除掉这部分
  diffWidth = diffX + diffWidth;
  // width变动了
  if (diffWidth) {
    width -= diffWidth;
    // 如果右边碰到边 则向左扩展
    if (x + width > imageWidth) {
      width = imageWidth - x;
      x -= (x + width - imageWidth);
      if (x < 0) {
        x = 0;
      }
    }
  }

  // y的变动会有height的变动 height的差值需要除掉这部分
  diffHeight = diffY + diffHeight;
  // height变动了
  if (diffHeight) {
    height -= diffHeight;
    // 如果下边碰到边 则向上扩展
    if (y + height > imageHeight) {
      height = imageHeight - y;
      y -= (height + y - imageHeight);
      if (y < 0) {
        y = 0;
      }
    }
  }

  let cropWidth = width;
  let cropHeight = height;

  if (cropHeight > cropWidth) {
    cropWidth = cropHeight * elementRatio;
    if (x + cropWidth > imageWidth) {
      cropWidth = width;
      cropHeight = cropWidth / elementRatio;
    }
  } else {
    cropHeight = cropWidth / elementRatio;
    if (y + cropHeight > imageHeight) {
      cropHeight = height;
      cropWidth = cropHeight * elementRatio;
    }
  }

  return getCropOptionsByRect({
    x, y, width: cropWidth, height: cropHeight
  }, {
    width: imageWidth,
    height: imageHeight
  });
};
