import Immutable from 'immutable';
import { isNumber, get } from 'lodash';
import * as types from '../../constants/actionTypes';

import { productTypes, defaultBorder, elementTypes, pageTypes } from '../../constants/strings';
import { generatePage, generateSheet } from '../../utils/projectGenerator';
import { getDataFromState } from '../../utils/getDataFromState';
import { getImageUsedMap } from './imageUsedMapActions';
import { guid } from '../../../../common/utils/math';
import {
  getUpdatedCoverElementsOnSheetNumChange,
  getUpdatedCoverElementsOnApplyTemplate
} from '../../utils/getUpdatedCoverElements';
import {
  updateElementsByTemplate
} from '../../utils/autoLayoutHepler';

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

function getUpdateObjectArray(
  cover,
  imageArray,
  parameterMap,
  addedSpineWidth
) {
  const updatedElements = getUpdatedCoverElementsOnSheetNumChange(
    cover,
    imageArray,
    parameterMap,
    addedSpineWidth
  );

  if (updatedElements) {
    let fullContainer = null;
    let backContainer = null;

    cover.get('containers').forEach((container) => {
      const containerType = container.get('type');
      switch (containerType) {
        case 'Full':
          fullContainer = container;
          break;
        case 'Back':
          backContainer = container;
          break;
        default:
      }
    });

    let fullContainerUpdateElements = Immutable.List();
    let backContainerUpdateElements = Immutable.List();

    updatedElements.forEach((element) => {
      if (fullContainer) {
        const isElementInFull = fullContainer.get('elements').find((o) => {
          return o.get('id') === element.get('id');
        });
        if (isElementInFull) {
          fullContainerUpdateElements = fullContainerUpdateElements.push(
            element
          );
        }
      }

      if (backContainer) {
        const isElementInBack = backContainer.get('elements').find((o) => {
          return o.get('id') === element.get('id');
        });

        if (isElementInBack) {
          backContainerUpdateElements = backContainerUpdateElements.push(
            element
          );
        }
      }
    });

    if (fullContainer) {
      return Immutable.fromJS([
        {
          pageId: fullContainer.get('id'),
          elements: fullContainerUpdateElements
        }
      ]);
    }

    // return Immutable.fromJS([
    //   {
    //     pageId: backContainer.get('id'),
    //     elements: backContainerUpdateElements
    //   }
    // ]);
  }

  return null;
}

export function createMultipleDualPage(insertIndex, insertNum) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { parameterMap, pageArray, setting } = stateData;
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

    const { cover, imageArray } = getDataFromState(getState());

    const updateObjectArray = getUpdateObjectArray(
      cover,
      imageArray,
      parameterMap,
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
    const { parameterMap } = stateData;

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

    const { cover, imageArray } = getDataFromState(getState());

    const updateObjectArray = getUpdateObjectArray(
      cover,
      imageArray,
      parameterMap,
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

export function changePageBgColor(pageId, bgColor) {
  return {
    type: types.CHANGE_PAGE_BGCOLOR,
    pageId,
    bgColor
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
    const { cover, containers, setting, imageArray, parameterMap } = stateData;

    let fixedTemplateDataArray = templateDataArray;

    fixedTemplateDataArray.forEach((templateData, index) => {
      let templateElements = addElementId(templateData.get('elements'));
      const fullContainerIndex = containers.findIndex((container) => {
        return container.get('type') === 'cover';
      });
      const fullContainer = containers.get(fullContainerIndex);

      // if (templateData.get('pageId') === fullContainer.get('id')) {
      //   templateElements = getUpdatedCoverElementsOnApplyTemplate(
      //     cover,
      //     imageArray,
      //     parameterMap,
      //     templateElements
      //   );
      // }

      fixedTemplateDataArray = fixedTemplateDataArray.setIn(
        [String(index), 'elements'],
        templateElements
      );
    });

    dispatch({
      type: actionType,
      templateDataArray: fixedTemplateDataArray
    });

    dispatch({
      type: types.SET_IMAGE_USED_MAP,
      imageUsedMap: getImageUsedMap(getDataFromState(getState()).elementArray)
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

export function applyDefaultTemplateToPages(template) {
  return (dispatch, getState) => {
    let pageArray = get(getState(), 'project.data.pageArray');
    const setting = get(getState(), 'project.data.setting');
    const productType = setting.get('product');
    if (pageArray.size) {
      pageArray = pageArray.map((page) => {
        if(productType === productTypes.WC && page.get('type') === pageTypes.bottom) return page;
        page = page.setIn(['template', 'tplGuid'], template.id);
        const oldElements = page.get('elements');
        let newElements = updateElementsByTemplate(
          page,
          Immutable.List(),
          Immutable.List(),
          template
        );
        newElements = oldElements.concat(newElements);
        if (newElements && newElements.size) {
          newElements = newElements.map((element) => {
            if (element.get('type') === elementTypes.photo) {
              return element.get('border')
                ? element.delete('border')
                : element
            }
            return element;
          });
        }
        return page.set('elements', newElements);
      });
    }

    dispatch({
      type: types.CHANGE_PROJECT_PROPERTY,
      data: { isInnerDefaultTemplateUsed: true }
    });

    return dispatch({
      type: types.SET_PAGE_ARRAY,
      pageArray
    });
  }
}
