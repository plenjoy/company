import { isEmpty, some, merge } from 'lodash';
import Immutable from 'immutable';


import * as types from '../../constants/actionTypes';
import { productTypes, elementTypes, pageTypes } from '../../constants/strings';
import { getCropOptions } from '../../utils/crop';
import { getDataFromState } from '../../utils/getDataFromState';

import projectParser from '../../../../common/utils/projectParser';
import { getPxByPt, getPxByInch, guid } from '../../../../common/utils/math';
import {
  generatePageArray,
  generateCover
} from '../../utils/projectGenerator';
import { getImageUsedMap } from './imageUsedMapActions';

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

function transformTextElement(element, pageWidth, pageHeight) {
  const MIN_FONT_SIZE = 4;
  const MAX_FONT_SIZE = 120;

  const newFontSize = clamp(
    element.get('fontSize'),
    getPxByPt(MIN_FONT_SIZE) / pageHeight,
    getPxByPt(MAX_FONT_SIZE) / pageHeight
  );

  return element.merge({
    x: element.get('px') * pageWidth,
    y: element.get('py') * pageHeight,
    width: element.get('pw') * pageWidth,
    height: element.get('ph') * pageHeight,
    fontSize: newFontSize
  });
}

function transformDecorationElement(element, pageWidth, pageHeight) {
  const ratio = element.get('width') / element.get('height');

  const newWidth = element.get('pw') * pageWidth;
  const newHeight = newWidth / ratio;

  return element.merge({
    x: element.get('px') * pageWidth,
    y: element.get('py') * pageHeight,
    width: newWidth,
    height: newHeight,
    ph: newHeight / pageHeight
  });
}

function transformPhotoElement(element, imageArray, pageWidth, pageHeight) {
  const newWidth = element.get('pw') * pageWidth;
  const newHeight = element.get('ph') * pageHeight;

  const newX = element.get('px') * pageWidth;
  const newY = element.get('py') * pageHeight;

  const imageDetail = imageArray.find((item) => {
    return item.get('encImgId') === element.get('encImgId');
  });

  let elementOptions = {
    width: newWidth,
    height: newHeight,
    x: newX,
    y: newY
  };

  if (imageDetail) {
    const options = getCropOptions(
      imageDetail.get('width'),
      imageDetail.get('height'),
      newWidth,
      newHeight,
      element.get('imgRot')
    );
    const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
    elementOptions = merge({}, elementOptions, {
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    });
  }

  return element.merge(elementOptions);
}

function transformElementArray(transformedPage, imageArray, calendarArea) {
  let transformedElementArray = Immutable.List();

  const willTransformElements = transformedPage.get('elements');
  const pageWidth = transformedPage.get('width');
  const pageHeight = transformedPage.get('height');

  willTransformElements.forEach((element) => {
    let transformedElement = null;
    switch (element.get('type')) {
      case elementTypes.text:
        transformedElement = transformTextElement(
          element, pageWidth, pageHeight
        );
        break;
      case elementTypes.photo:
        transformedElement = transformPhotoElement(
          element, imageArray, pageWidth, pageHeight
        );
        break;
      case elementTypes.calendar:
        {
          transformedElement = element.merge({
            x: calendarArea.get('x'),
            y: calendarArea.get('y'),
            width: calendarArea.get('width'),
            height: calendarArea.get('height'),
            px: calendarArea.get('x') / pageWidth,
            py: calendarArea.get('y') / pageHeight,
            pw: calendarArea.get('width') / pageWidth,
            ph: calendarArea.get('height') / pageHeight
          });
        }
        break;
      default:
        {
          transformedElement = element.merge({
            x: element.get('px') * pageWidth,
            y: element.get('py') * pageHeight,
            width: element.get('pw') * pageWidth,
            height: element.get('ph') * pageHeight
          });
        }
    }

    transformedElementArray = transformedElementArray.push(
      transformedElement
    );
  });

  return transformedElementArray;
}

function transformPageArray(existsPageArray, newPageArray, newParameterMap, imageArray) {
  const firstNewPage = newPageArray.first();
  const calendarArea = newParameterMap.get('calendarArea');

  let resultPageArray = existsPageArray.map((page) => {
    return page.merge({
      width: firstNewPage.get('width'),
      height: firstNewPage.get('height'),
      bleed: firstNewPage.get('bleed')
    });
  }).slice(0);

  resultPageArray.forEach((page, index) => {
    resultPageArray = resultPageArray.setIn(
      [String(index), 'elements'], transformElementArray(page, imageArray, calendarArea)
    );
  });

  return resultPageArray;
}


function transformCover(newCover, newParameterMap, oldCover, imageArray) {
  const outCover = newCover;
  const calendarArea = newParameterMap.get('calendarArea');
  const newCoverPage = newCover.get('containers').first();

  let resultContainers = oldCover.get('containers').map((page) => {
    return page.merge({
      width: newCoverPage.get('width'),
      height: newCoverPage.get('height'),
      bleed: newCoverPage.get('bleed')
    });
  });

  resultContainers.forEach((page, index) => {
    resultContainers = resultContainers.setIn(
      [String(index), 'elements'], transformElementArray(page, imageArray, calendarArea)
    );
  });

  return outCover.set('containers', resultContainers);
}

function convertParametersUnit(parameterMap) {
  if (!isEmpty(parameterMap)) {
    const { baseSize } = parameterMap;
    const outObj = merge({}, parameterMap);
    outObj.baseSize = {
      height: Math.round(getPxByInch(baseSize.heightInInch)),
      width: Math.round(getPxByInch(baseSize.widthInInch))
    };

    return outObj;
  }
  return null;
}

export function computeNewData(stateData, newSetting = null, isOldProject=false) {
  const {
    configurableOptionArray,
    parameterArray,
    variableArray,
    property,
    calendarSetting,
    allOptionMap,
    setting
  } = stateData;

  const isNewProject = !isOldProject && (property.get('projectId') === -1);

  const currentSetting = setting.toJS();
  let computedSetting = null;
  if (isNewProject) {
    computedSetting = projectParser.getDefaultProjectSetting(
      currentSetting, configurableOptionArray
    );
  } else {
    computedSetting = projectParser.getNewProjectSetting(
      currentSetting, newSetting, configurableOptionArray
    );
  }

  const parameterMap = projectParser.getParameters(
    computedSetting,
    parameterArray
  );

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const productType = computedSetting.product;

  const pageArray = generatePageArray(
    productType, convertedParameterMap, computedSetting.numberOfMonth, calendarSetting
  );

  const variableMap = projectParser.getVariables(
    computedSetting,
    variableArray
  );

  const cover = generateCover(
    productType,
    convertedParameterMap,
    calendarSetting
  );

  const availableOptionMap = projectParser.getAvailableOptionMap(
    computedSetting,
    configurableOptionArray,
    allOptionMap,
    []
  );

  return {
    pageArray,
    variableMap,
    cover,
    setting: computedSetting,
    parameterMap: convertedParameterMap,
    availableOptionMap
  };
}

function resetData(dispatch, result) {
  dispatch({
    type: types.SET_COVER,
    cover: result.get('cover')
  });

  dispatch({
    type: types.SET_PAGE_ARRAY,
    pageArray: result.get('pageArray')
  });

  dispatch({
    type: types.SET_VARIABLE_MAP,
    variableMap: result.get('variableMap')
  });

  dispatch({
    type: types.SET_PARAMETER_MAP,
    parameterMap: result.get('parameterMap')
  });

  dispatch({
    type: types.SET_OPTION_MAP,
    availableOptionMap: result.get('availableOptionMap')
  });

  dispatch({
    type: types.CHANGE_PROJECT_SETTING,
    setting: result.get('setting')
  });

  dispatch({ type: types.CLEAR_ELEMENT_ARRAY });

  dispatch({ type: types.CLEAR_IMAGE_USED_MAP });

  dispatch({ type: types.CLEAR_DECORATION_USED_MAP });
}

export function changeProjectSetting(setting) {
  if ('dateStyle' in setting) {
    return {
      type: types.CHANGE_PROJECT_SETTING,
      setting
    };
  }

  return (dispatch, getState) => {
    if (!isEmpty(setting)) {
      const stateData = getDataFromState(getState());

      const result = Immutable.fromJS(computeNewData(stateData, setting, true));

      dispatch({
        type: types.CHANGE_PROJECT_SETTING,
        setting: result.get('setting')
      });

      dispatch({
        type: types.SET_VARIABLE_MAP,
        variableMap: result.get('variableMap')
      });

      dispatch({
        type: types.SET_PARAMETER_MAP,
        parameterMap: result.get('parameterMap')
      });

      dispatch({
        type: types.SET_IMAGE_USED_MAP,
        imageUsedMap: getImageUsedMap(getDataFromState(getState()).elementArray)
      });

      if (setting.size || setting.orientation) {
        const oldCover = stateData.cover;
        const pageArray = stateData.pageArray;
        const imageArray = stateData.imageArray;

        const transformedPageArray = transformPageArray(
          pageArray,
          result.get('pageArray'),
          result.get('parameterMap'),
          imageArray
        );

        const transformedCover = transformCover(
          result.get('cover'),
          result.get('parameterMap'),
          oldCover,
          imageArray
        );

        dispatch({
          type: types.SET_COVER,
          cover: transformedCover
        });

        dispatch({
          type: types.SET_PAGE_ARRAY,
          pageArray: transformedPageArray
        });
      }
      return Promise.resolve(result.get('setting'));
    }
    return Promise.resolve();
  };
}
