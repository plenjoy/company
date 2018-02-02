import { elementTypes, productTypes, RESIZE_LIMIT } from '../contants/strings';
import { errors } from '../contants/errorMessage';
import { checkIsSupportImageInCover } from './cover';
import { getScale } from './scale';

import { Map } from 'immutable';
import { merge } from 'lodash';

/*
 * checkWholeBookElements 函数：检测书中是否包含 有效元素
 *
 * @param      {array}  elementArray  页面中所有 elementArray
 * @return     {boolean}  { 书中是否含有有效的元素 }
 */
const checkWholeBookElements = (elementArray) => {
  const hasUsefulElement = elementArray.some((item) => {
    return item.type === elementTypes.text || item.encImgId || item.imageid;
  });
  return hasUsefulElement;
};

/*
 * checkBlankElement 函数：检测sheet中的 elementIds 是否包含 空元素 或者 全部为无效元素。
 *
 * @param      {array}  elementIds    需要校验的 elementId 的数组；
 * @param      {array}  elementArray  书中所有元素对象的集合；
 * @return     {Object}  { hasEmptyElement, allElementsEmpty }
 */
const checkBlankElement = (elements, pageNumber, sheetIndex, pageId) => {
  // hasEmptyElement 表示当前的 elementIds 中有空白元素
  // allElementsBlank 表示当前的 elementIds 全部为空元素
  let hasEmptyElement = false;
  let allElementsEmpty = true;
  const emptyItems = [];

  elements.forEach((item) => {
    switch (item.type) {
      case elementTypes.cameo:
      case elementTypes.photo: {
        if (!item.encImgId) {
          hasEmptyElement = true;
          emptyItems.push({
            pageNumber,
            errorMessage: errors.emptyPhotoFrame,
            elementId: item.id,
            sheetIndex,
            pageId,
            errorType: 1
          });
        } else {
          allElementsEmpty = false;
        }

        break;
      }
      case elementTypes.text: {
        if (!item.text || (!item.text.trim())) {
          emptyItems.push({
            pageNumber,
            errorMessage: errors.emptyTextFrame,
            elementId: item.id,
            sheetIndex,
            pageId,
            errorType: 1
          });
        } else {
          allElementsEmpty = false;
        }
        break;
      }
      case elementTypes.paintedText: {
        if (!item.text || (!item.text.trim())) {
          emptyItems.push({
            pageNumber,
            errorMessage: errors.emptyPaintedTextFrame,
            elementId: item.id,
            sheetIndex,
            pageId,
            errorType: 1
          });
        } else {
          allElementsEmpty = false;
        }
        break;
      }
      default: {
        break;
      }
    }
  });

  return { hasEmptyElement, allElementsEmpty, emptyItems };
};

/**
 * checkImageQuality 函数：
 * 检测图片 图片元素 或者 天窗元素 的的 encImgId有一个 不存在则 判定 包含 空元素；
 * 包含文字元素 或者 有图片元素或者天窗元素的encImgId 不为空则判断不是所有元素无效；
 *
 * @param      {array}            elementIds    检测的元素 id 集合；
 * @param      {array}            elementArray  书中所有 元素对象的集合；
 * @param      {array}            imageArray    书中所有图片对象的集合；
 * @return     { boolean }  { 是否包含图片质量偏低的 布尔值 }
 */
const checkImageQuality = (elements, imageArray, pageNumber, sheetIndex, pageId) => {
  let isPoorQualityImage = false;
  const poorQualityImageItems = [];
  elements.forEach((item) => {
    if (item.type === elementTypes.cameo || item.type === elementTypes.photo) {
      const elementId = item.id;
      const encImgId = item.encImgId;
      imageArray.forEach((imageItem) => {
        if (imageItem.encImgId === encImgId) {
          const imageScaled = getScale(merge(item, {
            imageDetail: Map(imageItem)
          }));
          isPoorQualityImage = imageScaled > RESIZE_LIMIT;
          if (isPoorQualityImage) {
            poorQualityImageItems.push({
              pageNumber,
              errorMessage: 'Photo has low resolution and may look poor in print.',
              elementId,
              sheetIndex,
              pageId,
              errorType: 0
            });
          }
        }
      });
    }
  });
  return poorQualityImageItems;
};


const getCameoMes = (elements) => {
  const cameoMes = {
    id: '',
    isBlank: true
  };
  elements.forEach((item) => {
    if (item.type === elementTypes.cameo) {
      cameoMes.id = item.id;
      if (item.encImgId) { cameoMes.isBlank = false; }
    }
  });
  return cameoMes;
};

/**
 * { reviewCover }  检测封面的元素 是否有遗漏项；
 * @param      { object }  cover         封面对象
 * @param      { array }  elementArray  书中所有元素对象的集合
 * @param      { array }  imageArray    书中所有图片对象的集合
 * @param      { object }   reviewResult   上一级函数中传过来的reviewResult 对象。
 * @return     { no return }  { 对传入的 reviewResult 进行push修改，无返回值 }
 */
const reviewCover = (cover, imageArray, reviewResult, coverType) => {
  const coverError = {
    pageNumber: 'Cover',
    errorMessage: '',
    pageId: '',
    sheetIndex: 0,
    errorType: 0
  };

  const isSupportImage = checkIsSupportImageInCover(coverType);
  let elements = [];
  cover.containers.forEach((item) => {
    // 获取封面上的所有elements
    coverError.pageId = item.id;
    elements = elements.concat(item.elements);
  });

  if (!elements.length) {
    if (isSupportImage) {
      coverError.errorMessage = errors.emptyPage;
      reviewResult.cover.push(coverError);
      reviewResult.errorItems.push(coverError);
    }
  } else {
    const checkBlankElementResult = checkBlankElement(elements, coverError.pageNumber, coverError.sheetIndex, coverError.pageId);
    const { hasEmptyElement, allElementsEmpty, emptyItems } = checkBlankElementResult;
    reviewResult.errorItems = reviewResult.errorItems.concat(emptyItems);
    if (allElementsEmpty) {
      coverError.errorMessage = errors.emptyPage;
      reviewResult.cover.push(coverError);
    } else {
      const poorQualityImageItems = checkImageQuality(elements, imageArray, coverError.pageNumber, coverError.sheetIndex, coverError.pageId);
      reviewResult.errorItems = reviewResult.errorItems.concat(poorQualityImageItems);
    }
  }

  // 当前 cover 不支持图片的时候 判断是否包含天窗元素，如果有天窗元素则进行后续判断。
  if (elements.length) {
    const cameoMes = getCameoMes(elements);
    if (cameoMes.id && cameoMes.isBlank) {
      coverError.errorMessage = errors.blankCameo;
      reviewResult.cover.push(coverError);
    }
  }
};


/**
 * { reviewInnerPages }  检测书的中间页 是否有遗漏项
 *
 * @param      { array }  pageArray     书中内页的所有页面对象的集合
 * @param      { array }  elementArray  书中所有元素对象的集合
 * @param      { array }  imageArray    书中所有图片对象的集合
 * @param      { object }  reviewResult  上一级函数中传过来的结果对象。
 * @return     { no return }  { 对上一级函数传过来的 数组进行 push 操作，无返回值 }
 */
const reviewInnerPages = (pageArray, imageArray, product, reviewResult) => {
  const sheetsResult = [];
  pageArray.forEach((item, index) => {
    if (index % 2 === 0) {
      sheetsResult.push({
        sheetIndex: Math.ceil((index + 1) / 2),
        pageNumber: `${errors.page} ${index + 1} - ${index + 2}`,
        errorMessage: '',
        page0Result: '',
        page1Result: ''
      });
      // if (!(pageArray[index].elements.length + pageArray[index + 1].elements.length)) {
      //   sheetsResult[Math.ceil((index) / 2)].errorMessage = 'Empty sheet';
      // return;
      // };
    }

    const currentSheetResult = sheetsResult[Math.floor((index) / 2)];
    if (!(product !== productTypes.PS && index % 2)) {
      const pageId = pageArray[index].id;
      if (item.elements.length) {
        const elements = item.elements;
        const pageNumber = product === productTypes.PS ? `${errors.page} ${index}` : sheetsResult[Math.floor((index) / 2)].pageNumber;
        const checkBlankElementResult = checkBlankElement(elements, pageNumber, sheetsResult[Math.floor((index) / 2)].sheetIndex, pageId);
        const { hasEmptyElement, allElementsEmpty, emptyItems } = checkBlankElementResult;
        reviewResult.errorItems = reviewResult.errorItems.concat(emptyItems);
        if (allElementsEmpty) {
          currentSheetResult.errorMessage = errors.emptyPage;
          currentSheetResult[`${errors.page} ${index % 2} ${errors.result}`] = errors.emptyPage;
          reviewResult.emptyPageArray.push(index);
        } else {
          const poorQualityImageItems = checkImageQuality(elements, imageArray, pageNumber, sheetsResult[Math.floor((index) / 2)].sheetIndex, pageId);
          reviewResult.errorItems = reviewResult.errorItems.concat(poorQualityImageItems);
        }
      } else {
        // 如果不是 PS 产品的 第一页和最后一页就将 该页推入 空页数组。
        if (!(product === productTypes.PS && (index === 0 || (index === pageArray.length - 1)))) {
          currentSheetResult.errorMessage =
            currentSheetResult.errorMessage === 'hasPoorQualityImage' || !currentSheetResult.errorMessage || currentSheetResult.errorMessage === 'hasEmptyElement' ? 'hasEmptyPage' : currentSheetResult.errorMessage;
          sheetsResult[Math.floor((index) / 2)][`${errors.page} ${index % 2} ${errors.result}`] = errors.emptyPage;
          reviewResult.emptyPageArray.push(index);
          const pageNumber = product === productTypes.PS ? `${errors.page} ${index}` : sheetsResult[Math.floor((index) / 2)].pageNumber;
          reviewResult.errorItems.push({
            pageNumber,
            errorMessage: errors.emptyPage,
            sheetIndex: Math.ceil((index + 1) / 2),
            pageId,
            errorType: 0
          });
        }
      }
    }


    if (index % 2 !== 0 && currentSheetResult.errorMessage) {
      reviewResult.pages.push(sheetsResult[Math.floor((index) / 2)]);
    }
  });
};


/**
 * { reviewPhotoBook } 对整本书进行检测，将检测结果以一个对象返回出去
 *
 * @param      { object }  project  当前的 project 对象
 * @return     { object }  { 检测结果的描述对象 }
 */
export const reviewPhotoBook = (project, isEditParentBook = false) => {
  const reviewResult = {
    // hasUsefulElement: false,
    cover: [],
    pages: [],
    emptyPageArray: [],
    errorItems: []
  };
  const { setting, cover, pageArray, imageArray } = project;
  const product = setting.get('product');
  const coverType = setting.get('cover');

  const coverObj = cover.present.toJS();
  const pageArrayObj = pageArray.present.toJS();
  const imageArrayObj = imageArray.toJS();

  // 检查书中是否函数有效元素， 有效元素的定义是 textElement 或者 imageis 不为空的 photoEmelemnt
  // reviewResult.hasUsefulElement = checkWholeBookElements(project.elementArray);
  // if (reviewResult.hasUsefulElement) {
  // 检查封面的元素情况并将检测结果存入 reviewResult 中的 cover 中；
  reviewCover(coverObj, imageArrayObj, reviewResult, coverType);

  // 检查内页中每个 sheet 的情况并将结果存入 reviewResult 中的 pages 和 emptyPageArray 中；
  if (!isEditParentBook) {
    reviewInnerPages(pageArrayObj, imageArrayObj, product, reviewResult);
  }

  return reviewResult;
};
