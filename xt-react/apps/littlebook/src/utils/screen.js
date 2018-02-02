import { merge } from 'lodash';
import { getSize, getScreenSize } from '../../../common/utils/helper';
import { isMobileDevice } from '../../../common/utils/mobile';

/**
 * 根据传入的页面的总宽高, 计算当前页面上实际可用区域的大小.
 * @param {object} pageSize 页面的总宽高, 结构: {width, height}
 * @param {object} spreadSize spread的原始宽高, 结构: {width, height}
 * @param {object} offset 不可使用的区域, 结构: {top, right, bottom, left}
 * @param {number} percent 期望使用区域与总可使用区域的占比.
 * @returns {object} 计算后得到的实际可使用区域的大小,  结构: {width, height}
 */
export const getAvailableSize = (pageSize, spreadSize, offset, percent) => {
  const result = { width: 0, height: 0 };

  // 参数检查.
  if (
    !pageSize ||
    !pageSize.width ||
    !pageSize.height ||
    !spreadSize ||
    !spreadSize.width ||
    !spreadSize.height
  ) {
    return result;
  }

  // 参数校正.
  const iOffset = merge(
    {},
    {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    offset
  );

  const iPercent = percent || 1;

  // 最小size.
  const minSize = 220;

  let pageWidth = pageSize.width;
  let pageHeight = pageSize.height;

  const isMobile = isMobileDevice();

  // 在移动端, 确保都是横屏显示. 即宽要大于高.
  if (isMobile && pageSize.width < pageSize.height) {
    pageWidth = pageSize.height;
    pageHeight = pageSize.width;
  }

  const maxWidth = (pageWidth - (iOffset.left + iOffset.right)) * iPercent;
  const maxHeight = pageHeight - (iOffset.top + iOffset.bottom);

  // 根据workspace的高度, 计算workspace的宽.
  result.width = maxHeight * spreadSize.width / spreadSize.height;
  result.height = maxWidth * spreadSize.height / spreadSize.width;

  // 如果根据最大高度计算出来的宽大于最大宽, 那就使用最大宽.
  if (result.width > maxWidth) {
    result.width = maxWidth;
  } else {
    result.height = maxHeight;
  }

  // 检查是否小于最小值.
  const minV = Math.min(result.width, result.height);
  if (minV < minSize) {
    if (result.width <= result.height) {
      result.width = minSize;
      result.height = minSize * pageHeight / pageWidth;
    } else {
      result.height = minSize;
      result.width = pageWidth * minSize / pageHeight;
    }
  }

  return result;
};

/**
 * 计算spread在当前的分辨率的页面下的缩放比.
 * @param {object} spreadSize spread的原始宽高, 结构: {width, height}
 * @param {object} offset 不可使用的区域, 结构: {top, right, bottom, left}
 * @param {number} percent 期望使用区域与总可使用区域的占比.
 * @returns {number} spread在当前的分辨率的页面下的缩放比
 */
export const computedWorkSpaceRatio = (spreadSize, offset, percent) => {
  let ratio = 1;

  const pageSize = getSize();
  const availableSize = getAvailableSize(pageSize, spreadSize, offset, percent);

  if (availableSize && availableSize.width && availableSize.height) {
    ratio = availableSize.width / spreadSize.width;
  }

  return ratio;
};

/**
 * 计算spread在当前的分辨率下, 以屏幕为基准的缩放比.
 * @param {object} spreadSize spread的原始宽高, 结构: {width, height}
 * @param {object} offset 不可使用的区域, 结构: {top, right, bottom, left}
 * @param {number} percent 期望使用区域与总可使用区域的占比.
 * @returns {number} spread在当前的分辨率下, 以屏幕为基准的缩放比
 */
export const computedScreeRatio = (spreadSize, offset, percent) => {
  let ratio = 1;

  const screenSize = getScreenSize();
  const availableSize = getAvailableSize(
    screenSize,
    spreadSize,
    offset,
    percent
  );

  if (availableSize && availableSize.width && availableSize.height) {
    ratio = availableSize.width / spreadSize.width;
  }

  return ratio;
};
