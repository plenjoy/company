import { merge } from 'lodash';
import { toEncode, toDecode } from '../../../common/utils/encode';
import { getPxByPt, guid } from '../../../common/utils/math';
import {
  generateTemplateInfo,
  getTemplateIdOnCreate,
  customeTemplateIds } from './customeTemplate';

import {
  elementTypes,
  defaultTextLength
} from '../constants/strings';
import Element from './entries/element';
import { getCropOptions } from './crop';

export const sliceTextByLimited = (text, length = defaultTextLength) => {
  if (!text) {
    return '';
  }

  return toDecode(text).substring(0, length);
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

  const imageWidth = parseInt(imageInfo.width);
  const imageHeight = parseInt(imageInfo.height);
  const encImgId = imageInfo.encImgId;
  const templateId = getTemplateIdOnCreate(userId, imageInfo);
  const templateInfo = generateTemplateInfo(pageWidth, pageHeight, templateId, isLeft);

  // 元素的宽高.
  const width = pageWidth * templateInfo.pw;
  const height = pageHeight * templateInfo.ph;

  // 计算旋转角度.
  const angle = 0; // autoRotate ? (imageWidth < imageHeight ? -90 : 0) : 0;

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
    templateId = customeTemplateIds.full,
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
