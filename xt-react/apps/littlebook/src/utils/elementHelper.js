import { toEncode, toDecode } from '../../../common/utils/encode';
import { getPxByPt, guid } from '../../../common/utils/math';
import { coverTypes } from '../contants/strings';
import {
  generateTemplateInfo,
  getTemplateIdOnCreate,
  checkElementTemplateType,
  templateTypes,
  customeTemplateIds } from './customeTemplate';

import {
  elementTypes,
  defaultSpineTextFontSize,
  defaultTextFontSize,
  defaultTextLength
} from '../contants/strings';
import Element from '../utils/entries/element';
import { getCropOptions } from './crop';
import { merge } from 'lodash';

const getHalfCoverFullPageSizeWithoutBleed = (fullPage, spinePage) => {
  // 出血.
  const bleed = fullPage.get('bleed');
  const bleedTop = bleed.get('top');
  const bleedBottom = bleed.get('bottom');
  const bleedRight = bleed.get('right');
  const bleedLeft = bleed.get('left');

  const pageWidth = fullPage.get('width');
  const pageHeight = fullPage.get('height');

  // 计算临时变量.
  const spineWidth = spinePage.get('width');
  const halfPageWidthWithoutBleed = ((pageWidth - (bleedRight + bleedLeft)) - spineWidth) / 2;

  const width = halfPageWidthWithoutBleed;
  const height = pageHeight - (bleedBottom + bleedTop);

  return { width, height };
};

export const sliceTextByLimited = (text, length = defaultTextLength) => {
  if (!text) {
    return '';
  }

  return toDecode(text).substring(0, length);
};

export const computedCoverTextPosition = (fullPage, spinePage, expandingOverFrontcover = 0) => {
  let x = 0;
  let y = 0;

  const pageWidth = fullPage.get('width');
  const pageHeight = fullPage.get('height');
  const bleed = fullPage.get('bleed');

  // 元素宽高.
  const spineWidth = spinePage.get('width');

  const { width, height } = getHalfCoverFullPageSizeWithoutBleed(fullPage, spinePage);

  const pageWidthWithoutBleed = pageWidth - (bleed.get('left') + bleed.get('right'));
  const halfPageWidth = (pageWidthWithoutBleed - spineWidth) / 2;

  // 计算封面文本的x,y
  x = bleed.get('left') + halfPageWidth + spineWidth + (halfPageWidth - width) / 2 + expandingOverFrontcover;
  y = (pageHeight - height) / 2;

  return {
    x,
    y,
    px: x / pageWidth,
    py: y / pageHeight
  };
};

export const computedSpineTextPosition = (spinePage, elementWidth, elementHeight) => {
  const pageWidth = spinePage.get('width');
  const pageHeight = spinePage.get('height');

  const x = (pageWidth - elementWidth) / 2;
  const y = (pageHeight - elementHeight) / 2;

  return {
    x,
    y,
    px: x / pageWidth,
    py: y / pageHeight
  };
};

export const computedSpineTextSize = (spinePageWidth, spinePageHeight) => {
  const obj = {};
  const w = spinePageWidth * 0.82;
  const h = spinePageHeight - 100;
      // 宽高对换.
  const [width, height] = [h, w];
  obj.spineTextElementWidth = width;
  obj.spineTextElementHeight = height;
  return obj;
};

/**
 * 创建封面书脊上的默认的text元素
 * @param  {[type]} spinePage   [description]
 * @param  {[type]} bookSetting [description]
 * @param  {String} fontColor   [description]
 * @param  {String} text        [description]
 * @return {[type]}             [description]
 */
export const createSpineTextElement = (spinePage, bookSetting, fontColor = '#000000', text = '') => {
  const fontSize = defaultSpineTextFontSize;

  let fontWeight = null;
  let fontFamily = null;
  if (bookSetting) {
    fontWeight = bookSetting.font.fontId;
    fontFamily = toEncode(bookSetting.font.fontFamilyId);
  }

  const spinePageWidth = spinePage.get('width');
  const spinePageHeight = spinePage.get('height');

  const spineTextElemenObj = computedSpineTextSize(spinePageWidth, spinePageHeight);
  const width = spineTextElemenObj.spineTextElementWidth;
  const height = spineTextElemenObj.spineTextElementHeight;

  const { x, y, px, py } = computedSpineTextPosition(spinePage, width, height);

  const newElement = {
    width,
    height,
    fontColor,
    fontWeight,
    fontFamily,
    text: toEncode(sliceTextByLimited(text)),
    fontSize: getPxByPt(fontSize) / spinePage.get('height'),
    type: elementTypes.text,
    textAlign: 'center',
    textVAlign: 'middle',
    dep: 1,
    x,
    y,
    px,
    py,
    pw: width / spinePage.get('width'),
    ph: height / spinePage.get('height'),
    rot: 90,
    id: guid()
  };

  return newElement;
};

/**
 * 创建封面正面的一个默认的图片元素
 * @param  {Object} fullPage                [description]
 * @param  {Object} spinePage               [description]
 * @param  {Number} expandingOverFrontcover 书脊正面的延边尺寸.
 */
export const createCoverPagePhotoElement = (
   fullPage,
   spinePage,
   coverThickness,
   expandingOverFrontcover = 0,
   coverType = coverTypes.LBPAC,
   imageObj = null,
   imgRot = 0) => {
  const { x, y, width, height } = getCoverPhotoElementRect(fullPage, spinePage, coverThickness, expandingOverFrontcover, coverType);

  // 计算crop信息.
  let encImgId = '';
  let cropOptions;

  if (imageObj) {
    encImgId = imageObj.encImgId;
    cropOptions = getCropOptions(imageObj.width, imageObj.height, width, height, imgRot);
  }

  const { cropLUX = 0, cropLUY = 0, cropRLX = 0, cropRLY = 0 } = cropOptions || {};

  return new Element({
    type: elementTypes.photo,
    width,
    height,
    x,
    y,
    px: x / fullPage.get('width'),
    py: y / fullPage.get('height'),
    pw: width / fullPage.get('width'),
    ph: height / fullPage.get('height'),
    dep: 1,
    imgRot,
    encImgId,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY,
    id: guid()
  });
};

export const getCoverPhotoElementRect = (
    fullPage,
    spinePage,
    coverThickness,
    expandingOverFrontcover,
    coverType
  ) => {
  // 封面厚度.
  const top = coverThickness.get('top');
  const right = coverThickness.get('right');
  const bottom = coverThickness.get('bottom');
  const left = coverThickness.get('left');

  // 出血.
  const bleed = fullPage.get('bleed');
  const bleedTop = bleed.get('top');
  const bleedBottom = bleed.get('bottom');
  const bleedRight = bleed.get('right');
  const bleedLeft = bleed.get('left');

  // 计算临时变量.
  const spineWidth = spinePage.get('width');
  const halfPageWidthWithoutBleed = ((fullPage.get('width') - (bleedRight + bleedLeft)) - spineWidth) / 2;

  // 计算新的photoelement的高宽.
  // 1. hard cover:
  //    - 高的计算方式为: 基础高 + 上下的封面厚度
  //    - 宽的计算方式为: 基础宽 - 书脊的正面压线 + 封面的右侧厚度.
  //
  // 2. paper cover
  //   - 高的计算方式为: 基础高 + 上下出血
  //   - 宽的计算方式为: 基础宽 - 书脊的正面压线 + 封面的右侧出血.
  let width = 0;
  let height = 0;
  if (coverType === coverTypes.LBHC) {
    width = (halfPageWidthWithoutBleed - expandingOverFrontcover + right);
    height = fullPage.get('height') - (bleedTop + bleedBottom) + (top + bottom);
  } else if (coverType === coverTypes.LBPAC) {
    width = (halfPageWidthWithoutBleed - expandingOverFrontcover + bleedRight);
    height = fullPage.get('height');
  }

  const x = halfPageWidthWithoutBleed + spineWidth + bleedLeft + expandingOverFrontcover;
  const y = (fullPage.get('height') - height) / 2;

  return {
    x, y, width, height
  };
};

/**
 * 创建封面正面上的默认的text元素
 * @param  {[type]} fullPage    [description]
 * @param  {[type]} bookSetting [description]
 * @param  {String} fontColor   [description]
 * @param  {String} text        [description]
 * @return {[type]}             [description]
 */
export const createCoverPageTextElement = (
  fullPage,
  spinePage,
  bookSetting,
  expandingOverFrontcover = 0,
  fontColor = '#000000',
  text = '') => {
  // 文本字体.
  const fontSize = defaultTextFontSize;
  const fontWeight = bookSetting ? bookSetting.font.fontId : '';
  const fontFamily = bookSetting ? toEncode(bookSetting.font.fontFamilyId) : '';

  const pageWidth = fullPage.get('width');
  const pageHeight = fullPage.get('height');

  const halfPageBaseSize = getHalfCoverFullPageSizeWithoutBleed(fullPage, spinePage);
  const width = halfPageBaseSize.width - expandingOverFrontcover;
  const height = halfPageBaseSize.height;

  const { x, y, px, py } = computedCoverTextPosition(fullPage, spinePage, expandingOverFrontcover);

  const newElement = {
    width,
    height,
    fontColor,
    fontWeight,
    fontFamily,
    text: toEncode(sliceTextByLimited(text)),
    fontSize: getPxByPt(fontSize) / pageHeight,
    type: elementTypes.text,
    dep: 1,
    x,
    y,
    px,
    py,
    pw: width / pageWidth,
    ph: height / pageHeight,
    rot: 0,
    textAlign: 'center',
    textVAlign: 'middle',
    id: guid()
  };

  return newElement;
};

/**
 * [description]
 * @param  {[type]}  page           [description]
 * @param  {object}  imageInfo      {width, height, encImgId}
 * @param  {number}  workspaceRatio
 * @param  {Boolean} isLeft         [description]
 * @return {[type]}                 [description]
 */
export const createPhotoElement = (page, imageInfo, userId, isLeft = true, autoRotate = false) => {
  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  const orientation = parseInt(imageInfo.orientation || 0);
  const encImgId = imageInfo.encImgId;

  const templateId = getTemplateIdOnCreate(userId, imageInfo);
  const templateInfo = generateTemplateInfo(pageWidth, pageHeight, templateId, isLeft);

  // 元素的宽高.
  const width = pageWidth * templateInfo.pw;
  const height = pageHeight * templateInfo.ph;

  // 计算旋转角度.
  const angle = orientation; // autoRotate ? (imageWidth < imageHeight ? -90 : 0) : 0;

  // 计算crop信息.
  // const cropOptions = getCropOptions(imageWidth, imageHeight, width, height, angle);
  // const { cropLUX, cropLUY, cropRLX, cropRLY } = cropOptions;

  // 计算x, y
  const defaultPosition = {
    x: pageWidth * templateInfo.px,
    y: pageHeight * templateInfo.py
  };

  const newElement = new Element({
    type: elementTypes.photo,
    x: defaultPosition.x,
    y: defaultPosition.y,
    px: defaultPosition.x / pageWidth,
    py: defaultPosition.y / pageHeight,
    pw: width / pageWidth,
    ph: 1,
    dep: 1,
    imgRot: angle,
    width,
    height,
    encImgId,
    // cropLUX,
    // cropLUY,
    // cropRLX,
    // cropRLY,
    id: guid()
  });

  return merge({}, newElement, {
    templateId
  });
};


export const updateElementByTemplate = (options) => {
  const {
    page,
    element,
    imageInfo,
    isCover,
    spinePage,
    expandingOverFrontcover,
    coverThickness,
    coverType,
    templateId = customeTemplateIds.full
    } = options;

  const pageWidth = page.get('width');
  const pageHeight = page.get('height');

  const isLeft = element.get('px') < 0.5;

  const tmpId = isCover ? customeTemplateIds.full : templateId;
  const templateInfo = generateTemplateInfo(pageWidth, pageHeight, tmpId, isLeft);

  let width = pageWidth * templateInfo.pw;
  let height = pageHeight * templateInfo.ph;

  // 计算x, y
  const defaultPosition = {
    x: pageWidth * templateInfo.px,
    y: pageHeight * templateInfo.py
  };

  if (isCover) {
    const coverPhotoElementRect = getCoverPhotoElementRect(page, spinePage, coverThickness, expandingOverFrontcover, coverType);

    defaultPosition.x = coverPhotoElementRect.x;
    defaultPosition.y = coverPhotoElementRect.y;

    // if (checkElementTemplateType(tmpId) === templateTypes.full) {
    //   width = coverPhotoElementRect.width;
    // } else {
    //   if (width === height) {
    //     width = coverPhotoElementRect.height;
    //   } else if (width < height) {
    //     width = height * 2 / 3;
    //   }
    //   const offsetX = (coverPhotoElementRect.width - width) / 2;
    //   defaultPosition.x += offsetX;
    // }

    width = coverPhotoElementRect.width;
    height = coverPhotoElementRect.height;
  }

  // 计算crop信息.
  const cropOptions = imageInfo ? getCropOptions(imageInfo.width, imageInfo.height, width, height, element.get('imgRot')) : {};
  const { cropLUX = 0, cropLUY = 0, cropRLX = 0, cropRLY = 0 } = cropOptions;

  return {
    id: element.get('id'),
    x: defaultPosition.x,
    y: defaultPosition.y,
    px: defaultPosition.x / pageWidth,
    py: defaultPosition.y / pageHeight,
    pw: width / pageWidth,
    ph: height / pageHeight,
    templateId: tmpId,
    width,
    height,
    cropLUX,
    cropLUY,
    cropRLX,
    cropRLY
  };
};
