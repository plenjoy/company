import { merge } from 'lodash';
import hexRgb from 'hex-rgb';

/**
 * 获取15位数的随机数
 * @returns {number} 随机数
 */
export const getRandomNum = () => {
  return Math.round(Math.random() * 10000000000000);
};

/**
 * 像素转换成英寸
 * @param {number} nPx 像素值
 * @returns {number} 转换后的英寸值
 */
export const getInchByPx = (nPx) => {
  const px = parseFloat(nPx) || 0;

  return px / 300;
};

/**
 * 英寸转换成像素
 * @param {number} nInch 英寸值
 * @returns {number} 转换后的像素值
 */
export const getPxByInch = (nInch) => {
  const inch = parseFloat(nInch) || 0;

  return inch * 300;
};

/**
 * 转换毫米为英寸
 * @param {number} nMM 毫米数
 * @returns {number}
 */
export const getInchByMM = (nMM) => {
  const nmm = parseFloat(nMM) || 0;

  const nPx = parseFloat((nmm * 30) / 2.54);

  return parseFloat((nPx / 300).toFixed(7));
};

/**
 * change px into pt
 * @param nPx
 * @returns {number}
 */
export const getPtByPx = (nPx) => {
  const px = parseFloat(nPx) || 0;

  return (px / 300) * 72;
};

/**
 * change pt into px
 * @param nPt
 * @returns {number}
 */
export const getPxByPt = (nPt) => {
  const pt = parseFloat(nPt) || 0;

  return (pt * 300) / 72;
};

/**
 * 转换毫米到像素
 * @param nMM
 * @returns {number}
 */
export const getPxByMM = (nMM) => {
  const mm = parseFloat(nMM) || 0;

  return (mm * 30) / 2.54;
};

export const hexToDec = (hex) => {
  return parseInt(hex.replace('#', ''), 16);
};

export const decToHex = (dec) => {
  let hex = (dec).toString(16);
  while (hex.length < 6) {
    hex = `0${hex}`;
  }
  return `#${hex}`;
};

export const hexToRgb = (hex) => {
  return hexRgb(hex);
};

/**
 * 生成一个新的id
 * @param prefix 前缀
 */
export const makeId = (prefix = 'ID') => {
  const random = getRandomNum();
  return `${prefix}_${random}`;
};

/**
 * get the view font size fit for screen
 * @param nRealSize
 * @returns {number}
 */
// export const getTextViewFontSize = (nRealSize) => {
//   if (nRealSize && nRealSize > 0) {
//     const ratio = Store.pages[Store.selectedPageIdx].canvas.ratio;
//
//     const viewSize = parseFloat(nRealSize) * ratio;
//
//     return viewSize;
//   }
//   else {
//     return 0;
//   }
// };
//

/**
 * 生成GUID
 * @returns {string}
 */
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

/**
 * 把字符串转换为float
 * @param value
 * @returns {number}
 */
export const toFloat = (value) => {
  let newValue = 0;
  if (value && typeof value === 'string') {
    try {
      newValue = parseFloat(value);
    } catch (ex) {
      newValue = 0;
    }
  } else if (value && typeof value === 'number') {
    newValue = value;
  }

  return newValue;
};

/**
 * 把字符串转换为Int
 * @param value
 * @returns {number}
 */
export const toInt = (value) => {
  let newValue = 0;
  if (value && typeof value === 'string') {
    try {
      newValue = parseInt(value);
    } catch (ex) {
      newValue = 0;
    }
  } else if (value && typeof value === 'number') {
    newValue = value;
  }

  return newValue;
};

/**
 * 把对象的制定的属性值转换为数字类型.
 * @param obj 要转换的对象
 * @param {array}properties 要转换的对象的属性的key
 */
export const parsePropertiesToFloat = (obj, properties) => {
  if (!obj || !properties) {
    return obj;
  }

  const newObj = {};
  properties.forEach((key) => {
    newObj[key] = toFloat(obj[key]);
  });

  return merge({}, obj, newObj);
};

/**
 * 把对象的制定的属性值转换为数字类型.
 * @param obj 要转换的对象
 * @param {array}properties 要转换的对象的属性的key
 */
export const parsePropertiesToInt = (obj, properties) => {
  if (!obj || !properties) {
    return obj;
  }

  const newObj = {};
  properties.forEach((key) => {
    newObj[key] = toInt(obj[key]);
  });

  return merge({}, obj, newObj);
};

/**
 * 保留n位小数
 * @param  {[type]}  num           数值
 * @param  {[type]}  remainDecimal 保留的小数位数
 */
export function toFixed(num, remainDecimal) {
  const str = String(num);
  const dottedIndex = str.indexOf('.');

  if (dottedIndex !== -1) {
    // 有一位是点.
    return str.substr(0, dottedIndex + remainDecimal + 1);
  }

  return str;
}

/**
 * 四舍五入的方式保留指定的小数位.
 * @param  {Number} num        数值
 * @param  {Number} remainDecimal 保留的小数位数
 * @return {Number}               [description]
 */
export function round(num, remainDecimal = 2) {
  if (isNaN(num)) {
    return 0;
  }

  // 100, 1000...
  const step = Math.pow(10, 2);
  const v = Math.round(num * step) / step;

  return parseFloat(toFixed(v, remainDecimal)).toFixed(remainDecimal);
}