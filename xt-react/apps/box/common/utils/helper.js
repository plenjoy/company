import { forIn } from 'lodash';

/**
 * 获取元素的宽和高
 * @param {HTMLElement} ele 待获取的元素, 如果没传, 就获取屏幕的.
 */
export const getSize = (ele) => {
  const page = ele || (document.documentElement || document.body);

  return {
    width: page.clientWidth,
    height: page.clientHeight
  };
};

/**
 * 获取屏幕的宽和高
 */
export const getScreenSize = () => {
  const screen = window.screen;

  return {
    width: screen.width,
    height: screen.height
  };
};

/**
 * 获取屏幕的缩放比例。
 */
export const getScreenRatio = () => {
  const screenWidth = getScreenSize().width;
  const pageWidth = getSize().width;

  return (screenWidth / pageWidth);
};

/**
 * 设置元素的style
 * @param ele
 * @param properties
 */
export const setElementStyles = (ele, styles) => {
  if (!ele || !styles) {
    return;
  }

  forIn(styles, (value, key) => {
    ele.style[key] = value;
  });
};

/**
 * 设置元素在水平方向上居中显示
 * @param {HTMLElement} ele
 * @param {HTMLElement} parent
 * @param {number} xOffset
 */
export const setElementToHorizontalCenter = (ele, parent, xOffset = 0) => {
  if (!ele) {
    return;
  }

  // 获取元素的宽和高
  const eleSize = getSize(ele);

  // 获取父元素的宽和高
  const pEle = parent || (document.documentElement || document.body);
  const parentSize = getSize(pEle);

  const left = xOffset + (((parentSize.width - xOffset) - eleSize.width) / 2);

  // 设置元素的位置.
  setElementStyles(ele, {
    position: 'absolute',
    left: `${left}px`
  });
};
