import {
  elementTypes,
  productTypes,
  coverTypes,
  paintedTextTypes
} from '../constants/strings';

import { round } from './math';

// 价格接口返回参数中不需要计算的值列表
const ignoreList = ['pagescope'];

// painted text的key.
const paintedTextKeys = [
  'frontPaintedText',
  'backPaintedText',
  'spinePaintedText'
];

const computedAccessoryPrice = (priceObj = {}, count = 0) => {
  const { oriPrice = 0, sPrice = 0 } = priceObj;

  return {
    oriPrice: round(oriPrice * count),
    sPrice: round((sPrice || oriPrice) * count),
    discount: round((oriPrice - (sPrice || oriPrice)) * count),
    count
  };
};

/**
 * 计算天窗的数量.
 * @param  {Immutable.LIST} containers 封面集合.
 * @param  {String} productType 产品类型.
 * @param  {String} coverType 封面类型.
 * @return {Number}          天窗的数量
 */
export const getCamoeCount = (containers, productType, coverType) => {
  let count = 0;

  if (containers) {
    containers.forEach(page => {
      page.get('elements').forEach(element => {
        if (element.get('type') === elementTypes.cameo) {
          count += 1;
        }
      });
    });

    if (count) {
      // 如果为PressBook，且Cover为Linen cover和Leatherette天窗自带不计入价格
      if (
        productType === productTypes.PS &&
        [coverTypes.PSNC, coverTypes.PSLC].indexOf(coverType) >= 0
      ) {
        count = 0;
      }
    }
  }

  return count;
};

/**
 * 计算烫边的数量
 * @param  {String} gilding
 * @return {Number}
 */
export const getGildingCount = gilding => {
  let count = 0;
  if (gilding && gilding !== 'none') {
    count = 1;
  }

  return count;
};

/**
 * 计算新增的pages数量.
 * @param  {Number} currentSheetCount 当前总的sheet数量.
 * @param  {Number} baseSheetCount   基础的sheet数量
 * @return {Number}        新增的pages数量.
 */
export const getAddPagesCount = (currentSheetCount, baseSheetCount) => {
  let count = 0;

  if (
    currentSheetCount &&
    baseSheetCount &&
    currentSheetCount > baseSheetCount
  ) {
    count = (currentSheetCount - baseSheetCount) * 2;
  }

  return count;
};

/**
 * 计算paintedtext的数量.
 * @param  {Array} paintedTextStatus
 * @return {Number}              paintedtext的数量
 */
export const getPaintedTextCount = paintedTextStatus => {
  let count = 0;

  if (paintedTextStatus) {
    for (const key in paintedTextStatus) {
      const value = paintedTextStatus[key];
      if (
        paintedTextKeys.indexOf(key) >= 0 &&
        value !== paintedTextTypes.none
      ) {
        count += 1;
      }
    }
  }

  return count;
};

/**
 * 计算天窗, 烫边, 新增页面, paintedtext等配件的数量.
 * @return {Number}  配件的.
 */
export const getAccessoriesCount = ({
  containers,
  settings = {},
  currentSheetCount = 0,
  baseSheetCount = 0,
  paintedTextStatus = []
}) => {
  const { product, cover, gilding } = settings;

  const cameo = getCamoeCount(containers, product, cover);
  const pageAdded = getAddPagesCount(currentSheetCount, baseSheetCount);
  const gildingCount = getGildingCount(gilding);
  const paintedText = getPaintedTextCount(paintedTextStatus);

  return {
    cameo,
    pageAdded,
    paintedText,
    gilding: gildingCount
  };
};

/**
 * 计算原始价格, 打折后的价格, 以及各个配件的价格. 价格的计算规则是:
 * - 总价四舍五入
 * - 各个配件的显示价格也是四舍五入.
 * - 所有的显示都是保留两位小数.
 * @return {Object}
 */
export const computedPrice = (main, options, accessoriesCount = {}) => {
  // 获取各个配件的数量.
  const {
    cameo = 0,
    pageAdded = 0,
    gilding = 0,
    paintedText = 0
  } = accessoriesCount;

  const { oriPrice = 0, sPrice = 0, trialPrice = undefined } = main || {};

  // 原始的未加任何配件的价格.
  const base = {
    oriPrice: round(oriPrice),
    sPrice: round(trialPrice || sPrice || oriPrice),
    discount: round(oriPrice - sPrice)
  };

  // 计算各个配件的价格.
  const accessories = {};
  if (cameo && options) {
    accessories.cameo = computedAccessoryPrice(options.cameo, cameo);
  }
  if (pageAdded && options) {
    accessories.pageAdded = computedAccessoryPrice(
      options.pageAdded,
      pageAdded
    );
  }
  if (gilding && options) {
    accessories.gilding = computedAccessoryPrice(options.gilding, gilding);
  }
  if (paintedText && options) {
    accessories.paintedText = computedAccessoryPrice(
      options.paintedText,
      paintedText
    );
  }

  // 计算总价格: 包括基础的 + 各个配件.
  const total = {
    oriPrice,
    sPrice: trialPrice || sPrice || oriPrice,
    discount: 0
  };

  // 汇总各个部件的总价.
  for (const key in accessories) {
    const priceObj = accessories[key];
    total.oriPrice += priceObj.oriPrice;
    total.sPrice += priceObj.sPrice;
  }

  // 四舍五入.
  total.oriPrice = round(total.oriPrice);
  total.sPrice = round(total.sPrice);
  total.discount = round(total.oriPrice - total.sPrice);

  return { base, accessories, total };
};
