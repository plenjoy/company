import { merge } from 'lodash';
import { cropLimitedSize } from '../contants/strings';
import { getDefaultCrop } from '../../common/utils/crop';

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
  let iWidth, iHeight;
  if (Math.abs(imageRotate) === 90) {
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
  const {cropLUX, cropLUY, cropRLX, cropRLY} = cropLR;

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
