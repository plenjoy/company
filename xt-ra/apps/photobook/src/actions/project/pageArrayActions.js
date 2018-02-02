import qs from 'qs';
import Immutable from 'immutable';
import { isNumber } from 'lodash';
import * as types from '../../contants/actionTypes';
import * as apiUrl from '../../contants/apiUrl';
import { productTypes, elementTypes, pageTypes } from '../../contants/strings';
import { generatePage, generateSheet } from '../../utils/projectGenerator';
import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap, getStickerUsedMap } from '../../utils/countUsed';
import { guid } from '../../../../common/utils/math';
import {
  getUpdateObjectArrayOnSheetNumChange,
  getUpdatedCoverElementsOnApplyTemplate
} from '../../utils/getUpdatedCoverElements';
import { CALL_API } from '../../middlewares/api';
import { mergeTemplateElements } from '../../utils/template/mergeTemplateElements';
import { getAutoFillDataByGroups } from '../../../../common/utils/autofill/autofill';
import { getBookThemeProjectData } from './projectActions';

function generateDualPage(isPressBook, parameterMapObj, bgColor) {
  let leftPage = null;
  let rightPage = null;

  if (isPressBook) {
    leftPage = generatePage(parameterMapObj, bgColor);
    rightPage = generatePage(parameterMapObj, bgColor);
  } else {
    leftPage = generateSheet(parameterMapObj, bgColor);
    rightPage = generatePage(parameterMapObj, bgColor);
    rightPage.backend.isPrint = false;
  }

  return [leftPage, rightPage];
}

function getInsertPageArray(insertNum, stateData) {
  const { setting, parameterMap, bookSetting } = stateData;

  const isPressBook = setting.get('product') === productTypes.PS;
  const parameterMapObj = parameterMap.toJS();
  const bgColor = bookSetting.getIn(['background', 'color']);

  let insertPageArray = Immutable.List();
  for (let i = 0; i < insertNum; i += 1) {
    const [leftPage, rightPage] = generateDualPage(
      isPressBook,
      parameterMapObj,
      bgColor
    );

    insertPageArray = insertPageArray.push(Immutable.fromJS(leftPage));
    insertPageArray = insertPageArray.push(Immutable.fromJS(rightPage));
  }

  return insertPageArray;
}

export function createMultipleDualPage(insertIndex, insertNum) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { parameterMap, pageArray, setting, ratioMap } = stateData;
    const insertPageArray = getInsertPageArray(insertNum, stateData);
    const isPressBook = setting.get('product') === productTypes.PS;

    const length = pageArray.size;
    let index = isPressBook ? length - 2 : length;
    if (isNumber(insertIndex)) {
      index = insertIndex;
    }

    const additionalValue = parameterMap.getIn([
      'spineWidth',
      'addtionalValue'
    ]);

    dispatch({
      type: types.CREATE_MULTIPLE_DUAL_PAGE,
      insertIndex: index,
      insertPageArray
    });

    const addedSpineWidth = additionalValue * insertNum;

    dispatch({
      type: types.UPDATE_SPINE_WIDTH,
      spineWidth: addedSpineWidth
    });

    const {
      cover,
      imageArray,
      backgroundArray,
      stickerArray
    } = getDataFromState(getState());

    const updateObjectArray = getUpdateObjectArrayOnSheetNumChange(
      cover,
      imageArray,
      backgroundArray,
      stickerArray,
      parameterMap,
      ratioMap,
      addedSpineWidth
    );

    if (updateObjectArray) {
      dispatch({
        type: types.UPDATE_ELEMENTS,
        updateObjectArray
      });
    }

    return Promise.resolve();
  };
}

export function createDualPage(insertIndex) {
  const insertNum = 1;
  return createMultipleDualPage(insertIndex, insertNum);
}

export function deleteDualPage(leftPageId, rightPageId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { parameterMap, ratioMap } = stateData;

    dispatch({
      type: types.DELETE_DUAL_PAGE,
      leftPageId,
      rightPageId
    });

    const additionalValue = parameterMap.getIn([
      'spineWidth',
      'addtionalValue'
    ]);

    const addedSpineWidth = -additionalValue;

    dispatch({
      type: types.UPDATE_SPINE_WIDTH,
      spineWidth: addedSpineWidth
    });

    const {
      cover,
      imageArray,
      backgroundArray,
      stickerArray
    } = getDataFromState(getState());

    const updateObjectArray = getUpdateObjectArrayOnSheetNumChange(
      cover,
      imageArray,
      backgroundArray,
      stickerArray,
      parameterMap,
      ratioMap,
      addedSpineWidth
    );

    if (updateObjectArray) {
      dispatch({
        type: types.UPDATE_ELEMENTS,
        updateObjectArray
      });

      const newElementArray = getDataFromState(getState()).elementArray;
      dispatch({
        type: types.SET_IMAGE_USED_MAP,
        imageUsedMap: getImageUsedMap(newElementArray)
      });
    }

    return Promise.resolve();
  };
}

export function changePageBgColor(pageId, bgColor) {
  return {
    type: types.CHANGE_PAGE_BGCOLOR,
    pageId,
    bgColor
  };
}

export function changePageDefaultFontColor(pageId, fontColor) {
  return {
    type: types.CHANGE_PAGE_DEFAULT_FONT_COLOR,
    pageId,
    fontColor
  };
}

function addElementId(elementArray) {
  let newElementArray = elementArray;

  newElementArray.forEach((element, index) => {
    if (!element.get('id')) {
      newElementArray = newElementArray.setIn([String(index), 'id'], guid());
    }
  });

  return newElementArray;
}

export function applyTemplateToPages(
  templateDataArray,
  actionType = types.APPLY_TEMPLATE_TO_PAGES
) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const {
      cover,
      containers,
      imageArray,
      parameterMap,
      backgroundArray,
      stickerArray,
      ratioMap
    } = stateData;

    let fixedTemplateDataArray = templateDataArray;

    fixedTemplateDataArray.forEach((templateData, index) => {
      let templateElements = addElementId(templateData.get('elements'));
      const fullContainerIndex = containers.findIndex(container => {
        return container.get('type') === 'Full';
      });
      const fullContainer = containers.get(fullContainerIndex);

      if (templateData.get('pageId') === fullContainer.get('id')) {
        templateElements = getUpdatedCoverElementsOnApplyTemplate(
          cover,
          imageArray,
          backgroundArray,
          stickerArray,
          parameterMap,
          templateElements,
          ratioMap
        );
      }

      fixedTemplateDataArray = fixedTemplateDataArray.setIn(
        [String(index), 'elements'],
        templateElements
      );
    });

    dispatch({
      type: actionType,
      templateDataArray: fixedTemplateDataArray
    });

    const newElementArray = getDataFromState(getState()).elementArray;

    dispatch({
      type: types.SET_IMAGE_USED_MAP,
      imageUsedMap: getImageUsedMap(newElementArray)
    });

    return Promise.resolve();
  };
}

export function applyTemplate(
  pageId,
  templateId,
  elements,
  actionType = types.APPLY_TEMPLATE_TO_PAGES
) {
  return applyTemplateToPages(
    Immutable.fromJS([{ pageId, templateId, elements }]),
    actionType
  );
}

export function updatePageTemplateId(pageId, templateId) {
  return {
    type: types.UPDATE_PAGE_TEMPLATE_ID,
    pageId,
    templateId
  };
}

/**
 * 把指定的page插入到特定的page前面.
 * @param  {string} pageId 正在移动的page id
 * @param  {string} beforePageId 插入到指定page的前面的page id.
 */
export function movePageBefore(pageId, beforePageId) {
  return {
    type: types.MOVE_PAGE_BEFORE,
    pageId,
    beforePageId
  };
}

export function uploadPageImage(encodeImage, pageId, sheetIndex) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property } = stateData;

    const projectId = property.get('bookThemeId');
    const baseUrl = urls.get('baseUrl');

    if (
      !encodeImage ||
      (typeof encodeImage === 'string' &&
        encodeImage.substring(0, 50).length < 50)
    ) {
      return Promise.resolve();
    }

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SAVE_THEME_SCREENSHOT,
          params: {
            baseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            guid: projectId,
            imageBase64: encodeImage,
            index: sheetIndex
          })
        }
      }
    });
  };
}

export function fillImagesByDateTime() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const stateData = getDataFromState(getState());
      const { imageArray, pageArray, containers, elementArray } = stateData;

      const coverPages = containers.filter(container => {
        return (
          container.get('type') === pageTypes.full ||
          container.get('type') === pageTypes.front
        );
      });

      let hasPhotoElementPage = Immutable.List();
      const allPages = coverPages.concat(pageArray);
      const countPhotoElementGroup = [];
      allPages.forEach(page => {
        const emptyPhotoElements = page.get('elements').filter(element => {
          return (
            element.get('type') === elementTypes.photo &&
            !element.get('encImgId')
          );
        });

        if (emptyPhotoElements.size) {
          hasPhotoElementPage = hasPhotoElementPage.push(page);
          countPhotoElementGroup.push(emptyPhotoElements.size);
        }
      });

      if (!countPhotoElementGroup.length) {
        resolve();
      }

      const imageUsedMap = getImageUsedMap(elementArray);

      const unusedImageArray = imageArray.filter(image => {
        return !imageUsedMap.get(image.get('encImgId'));
      });

      const groupedImages = getAutoFillDataByGroups(
        unusedImageArray.toJS(),
        countPhotoElementGroup
      );

      if (groupedImages) {
        let templateDataArray = Immutable.List();
        hasPhotoElementPage.forEach((page, i) => {
          if (!groupedImages[i]) return false;
          let filledImagePage = page;
          page.get('elements').forEach((element, j) => {
            if (
              element.get('type') === elementTypes.photo &&
              !element.get('encImgId')
            ) {
              const image = groupedImages[i].shift();
              if (!image) return false;

              filledImagePage = filledImagePage.setIn(
                ['elements', String(j), 'encImgId'],
                image.encImgId
              );
            }
          });

          const newElements = mergeTemplateElements(
            filledImagePage,
            filledImagePage.get('elements'),
            imageArray
          );

          templateDataArray = templateDataArray.push(
            Immutable.Map({
              pageId: page.get('id'),
              templateId: '',
              elements: newElements
            })
          );
        });

        if (templateDataArray.size) {
          dispatch(applyTemplateToPages(templateDataArray)).then(() => {
            resolve();
          });
        }
        resolve();
      }
    });
  };
}

function getPagesBySheetIndex(sheetIndex, containers, pageArray) {
  let outPages = Immutable.List();

  const getCoverPage = o => {
    return (
      o.get('type') === pageTypes.full || o.get('type') === pageTypes.front
    );
  };

  if (sheetIndex === 0) {
    const coverPage = containers.find(container => {
      return getCoverPage(container);
    });
    outPages = outPages.push(coverPage);
  } else {
    const realSheetIndex = sheetIndex - 1;
    const pageIndex = realSheetIndex * 2;

    outPages = outPages.concat(
      pageArray.filter((page, index) => {
        return index === pageIndex || index === pageIndex + 1;
      })
    );
  }

  return outPages;
}

export function applyThemePage(bookThemeId, themeSheetIndex, sheetIndex) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { imageArray, setting, pageArray, containers } = stateData;

    const isPressBook = setting.get('product') === productTypes.PS;

    const willApplyPages = getPagesBySheetIndex(
      sheetIndex,
      containers,
      pageArray
    );

    const isApplyTheme = true;

    return dispatch(getBookThemeProjectData(bookThemeId, isApplyTheme)).then(
      res => {
        if (res) {
          const projectObj = res.project;
          const themeContainers = Immutable.fromJS(projectObj.cover.containers);
          const themePageArray = Immutable.fromJS(projectObj.pages);

          const themePages = getPagesBySheetIndex(
            themeSheetIndex,
            themeContainers,
            themePageArray
          );

          let templateDataArray = Immutable.List();
          willApplyPages.forEach((page, i) => {
            const themePage = themePages.get(i);

            if (
              themePage &&
              themePage.get('elements') &&
              themePage.get('elements').size
            ) {
              const newElements = mergeTemplateElements(
                page,
                themePage.get('elements'),
                imageArray
              );

              templateDataArray = templateDataArray.push(
                Immutable.Map({
                  pageId: page.get('id'),
                  templateId: '',
                  elements: newElements
                })
              );
            }
          });

          if (templateDataArray.size) {
            return dispatch(applyTemplateToPages(templateDataArray));
          }
        }

        return Promise.reject();
      }
    );
  };
}
