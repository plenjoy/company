import { forIn } from 'lodash';

/**
 * 根据最小值, 重新等比例计算width, height.
 * @param  {Object} size [description]
 * @param  {Number} min  [description]
 * @return {[type]}      [description]
 */
export const getLimitSize = (size, min = 0) => {
  const { width, height } = size;

  // width, height的缩放比
  let newWidth = width;
  let newHeight = height;

  const minV = Math.min(newWidth, newHeight);
  if (minV < min) {
    const r = newWidth / newHeight;

    if (newWidth < newHeight) {
      newWidth = min;
      newHeight = min / r;
    } else {
      newHeight = min;
      newWidth = min * r;
    }
  }

  return {
    width: newWidth,
    height: newHeight,

    // width, height的缩放比
    wR: width / newWidth,
    hR: height / newHeight
  };
};

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

/**
 * 计算每一行显示item的个数, 以及每个item的width.
 * @param  {Number} rowWidth       容器的可用宽
 * @param  {Number} minWidthOfItem 元素的最小宽
 * @param  {Number} marginOfItem   元素的margin值
 * @param  {Number} marginOfItem   元素的margin值
 * @return {Object}                {count, width}
 */
export const computedItemCountdAndWidthInRow = (
  widthOfContainer,
  leftPaddingOfContainer,
  rightPaddingOfContainer,
  minWidthOfItem,
  marginOfItem = 0) => {
  // 滚动条的宽.
  const scrollWidth = 30;
  const rowWidth = widthOfContainer - (leftPaddingOfContainer + rightPaddingOfContainer - scrollWidth);
  let width = 0;
  let count = 0;

  if (rowWidth && minWidthOfItem) {
    // 1行1个item
    if (rowWidth <= minWidthOfItem) {
      width = minWidthOfItem;
      count = 1;
    } else {
      count = Math.floor((marginOfItem + rowWidth) / (minWidthOfItem + marginOfItem));
      width = (rowWidth - (count - 1) * marginOfItem) / count;
    }
  }

  return { width, count };
};

/**
 * 根据容器的宽, 元素的宽, 和元素的margin值, 计算一行可以显示多少个元素, 以及左右剩余的空白大小.
 * @param  {[type]} widthOfContainer [description]
 * @param  {[type]} widthOfItem      [description]
 * @param  {[type]} marginOfItem     [description]
 * @return {[type]}                  [description]
 */
export const computedItemsCountInRowByFixedWidth = (
  widthOfContainer,
  widthOfItem,
  marginOfItem,
  minMarginOfContainer = 15,
  padding = 25
) => {
  let count = 0;
  let margin = 0;

  if (widthOfContainer && widthOfItem) {
    const newWidthOfContainer = widthOfContainer - padding;
    if (newWidthOfContainer <= marginOfItem) {
      count = 1;
      margin = 0;
    } else {
      count = Math.floor((newWidthOfContainer + marginOfItem) / (widthOfItem + marginOfItem));
      margin = Math.floor((newWidthOfContainer - (widthOfItem * count + marginOfItem * (count - 1))) / 2);

      if (margin < minMarginOfContainer) {
        count -= 1;
        margin = Math.floor((newWidthOfContainer - (widthOfItem * count + marginOfItem * (count - 1))) / 2);
      }

      // 防止1px的误差, 导致显示时空间不足.
      margin -= 2;
    }
  }

  return { count, margin };
};

export const convertToTwoDimenArr = (arr, numInRow = 1) => {
  if (!arr) {
    return [];
  }

  const newArr = [];

  // 转成2维数组, 每行3个.
  let tempArr = [];

  arr.forEach((t) => {
    if (tempArr.length === numInRow) {
      newArr.push(tempArr);
      tempArr = [];
    }

    tempArr.push(t);
  });

  if (tempArr.length) {
    newArr.push(tempArr);
    tempArr = [];
  }

  return newArr;
};

// 高/框
export const getImgRatioFromProjectSize = (projectSize) => {
  let arr = [];
  arr = projectSize.split('X');
  return arr[0] / (arr[1] * 2);
};
