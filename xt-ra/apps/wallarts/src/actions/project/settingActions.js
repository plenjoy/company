import { isEmpty, merge } from 'lodash';
import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';
import { getDataFromState } from '../../utils/getDataFromState';

import projectParser from '../../../../common/utils/projectParser';
import { getPxByInch } from '../../../../common/utils/math';
import { getCropOptions, getFitCrop } from '../../utils/crop';
import setElementByType from '../../utils/setElementByType';
import { generatePageArray } from '../../utils/projectGenerator';
import { getImageUsedMap } from '../../utils/countUsed';
import {
  elementTypes,
  enumOrientation,
  enumPhotoQuantity
} from '../../constants/strings';
import { hexString2Number } from '../../../../common/utils/colorConverter';

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);
let storeSettingMap = new Map();
function convertParametersUnit(parameterMap) {
  if (!isEmpty(parameterMap)) {
    const { frameBaseSize } = parameterMap;
    const outObj = merge({}, parameterMap);
    outObj.frameBaseSize = {
      height: Math.round(getPxByInch(frameBaseSize.heightInInch)),
      width: Math.round(getPxByInch(frameBaseSize.widthInInch))
    };

    return outObj;
  }
  return null;
}

export function computeNewData(
  stateData,
  newSetting = null,
  isOldProject = false
) {
  const {
    configurableOptionArray,
    parameterArray,
    variableArray,
    property,
    allOptionMap,
    disableOptionArray,
    setting
  } = stateData;

  const isNewProject = !isOldProject && property.get('projectId') === -1;
  const currentSetting = setting.toJS();
  let computedSetting = null;
  if (isNewProject) {
    computedSetting = projectParser.getDefaultProjectSetting(
      currentSetting,
      configurableOptionArray
    );
  } else {
    computedSetting = projectParser.getNewProjectSetting(
      currentSetting,
      newSetting,
      configurableOptionArray
    );
  }

  const parameterMap = projectParser.getParameters(
    computedSetting,
    parameterArray
  );

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const pageArray = generatePageArray(computedSetting, convertedParameterMap);

  const variableMap = projectParser.getVariables(
    computedSetting,
    variableArray
  );

  const availableOptionMap = projectParser.getAvailableOptionMap(
    computedSetting,
    configurableOptionArray,
    allOptionMap,
    disableOptionArray
  );
  availableOptionMap.category = merge({}, allOptionMap.category);
  return {
    pageArray,
    variableMap,
    setting: computedSetting,
    parameterMap: convertedParameterMap,
    availableOptionMap
  };
}

function transformPhotoElement(
  element,
  imageArray,
  pageWidth,
  pageHeight,
  newElement
) {
  const newWidth = newElement.get('width');
  const newHeight = newElement.get('height');

  const newX = newElement.get('x');
  const newY = newElement.get('y');

  const imageDetail = imageArray.find(item => {
    return item.get('encImgId') === element.get('encImgId');
  });

  let elementOptions = {
    width: newWidth,
    height: newHeight,
    x: newX,
    y: newY,
    px: newX / pageWidth,
    py: newY / pageHeight,
    pw: newWidth / pageWidth,
    ph: newHeight / pageHeight,
    bleed: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  if (imageDetail) {
    /*const options = getCropOptions(
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
    });*/
    const imageRotate = element.get('imgRot');
    const imageWidth =
      Math.abs(imageRotate) === 90
        ? imageDetail.get('height')
        : imageDetail.get('width');
    const imageHeight =
      Math.abs(imageRotate) === 90
        ? imageDetail.get('width')
        : imageDetail.get('height');
    const newFitCrop = getFitCrop(
      imageWidth,
      imageHeight,
      element.get('cropLUX'),
      element.get('cropLUY'),
      element.get('cropRLX') - element.get('cropLUX'),
      element.get('cropRLY') - element.get('cropLUY'),
      element.get('width'),
      element.get('height'),
      newWidth,
      newHeight
    );
    elementOptions = merge({}, elementOptions, {
      cropLUX: newFitCrop.cropLUX,
      cropLUY: newFitCrop.cropLUY,
      cropRLX: newFitCrop.cropRLX,
      cropRLY: newFitCrop.cropRLY
    });
  }

  return element.merge(elementOptions);
}

function transformElementArray(transformedPage, newElement, imageArray) {
  let transformedElementArray = Immutable.List();

  const willTransformElements = transformedPage.get('elements');
  const pageWidth = transformedPage.get('width');
  const pageHeight = transformedPage.get('height');

  willTransformElements.forEach(element => {
    let transformedElement = null;
    switch (element.get('type')) {
      case elementTypes.photo:
        transformedElement = transformPhotoElement(
          element,
          imageArray,
          pageWidth,
          pageHeight,
          newElement
        );
        break;
      default: {
        transformedElement = element.merge({
          x: element.get('px') * pageWidth,
          y: element.get('py') * pageHeight,
          width: element.get('pw') * pageWidth,
          height: element.get('ph') * pageHeight
        });
      }
    }

    transformedElementArray = transformedElementArray.push(
      setElementByType(
        transformedElement,
        transformedPage,
        imageArray,
        undefined,
        false
      )
    );
  });

  return transformedElementArray;
}

function transformPageArray(
  existsPageArray,
  newPageArray,
  newParameterMap,
  newSetting,
  imageArray
) {
  const firstNewPage = newPageArray.first();
  const firstNewPhotoElement = firstNewPage
    .get('elements')
    .find(ele => ele.get('type') === elementTypes.photo);
  let resultPageArray = existsPageArray.map(page => {
    return page.merge({
      width: firstNewPage.get('width'),
      height: firstNewPage.get('height'),
      bleed: firstNewPage.get('bleed'),
      spec: newSetting,
      borderInFrame: firstNewPage.get('borderInFrame'),
      boardInMatting: firstNewPage.get('boardInMatting'),
      matteSize: firstNewPage.get('matteSize'),
      frameBorderThickness: firstNewPage.get('frameBorderThickness'),
      canvasBorderThickness: firstNewPage.get('canvasBorderThickness'),
      canvasBorder: firstNewPage
        .get('canvasBorder')
        .merge({ color: page.getIn(['canvasBorder', 'color']) })
    });
  });
  resultPageArray.forEach((page, index) => {
    resultPageArray = resultPageArray.setIn(
      [String(index), 'elements'],
      transformElementArray(page, firstNewPhotoElement, imageArray)
    );
  });
  return resultPageArray;
}

function keepElementsOnSettingChange(oldPageArray, newPageArray, imageArray) {
  let outPageArray = newPageArray.map((page, i) => {
    const oldPageId = oldPageArray.getIn([String(i), 'id']);

    if (oldPageId) {
      return page.merge({
        id: oldPageId
      });
    }

    return page;
  });

  const oldPageElements = oldPageArray
    .getIn([String(0), 'elements'])
    .filter(o => o.get('encImgId'));
  const newPageElements = newPageArray.getIn([String(0), 'elements']);

  const outElements = newPageElements.map((element, i) => {
    const oldElement = oldPageElements.get(String(i));
    if (oldElement) {
      const theImage = imageArray.find(
        o => o.get('encImgId') === oldElement.get('encImgId')
      );

      const imageRotate = oldElement.get('imgRot');
      let imageWidth = theImage.get('width');
      let imageHeight = theImage.get('height');

      if (Math.abs(imageRotate) === 90) {
        imageWidth = theImage.get('height');
        imageHeight = theImage.get('width');
      }

      const newFitCrop = getFitCrop(
        imageWidth,
        imageHeight,
        oldElement.get('cropLUX'),
        oldElement.get('cropLUY'),
        oldElement.get('cropRLX') - oldElement.get('cropLUX'),
        oldElement.get('cropRLY') - oldElement.get('cropLUY'),
        oldElement.get('width'),
        oldElement.get('height'),
        element.get('width'),
        element.get('height')
      );

      return element.merge({
        encImgId: oldElement.get('encImgId'),
        imgRot: imageRotate,
        ...newFitCrop
      });
    }

    return element;
  });

  return outPageArray.setIn([String(0), 'elements'], outElements);
}

export function changeProjectSetting(setting) {
  return (dispatch, getState) => {
    if (!isEmpty(setting)) {
      const stateData = getDataFromState(getState());
      const { pageArray, imageArray } = stateData;
      const currentSetting = stateData.setting;

      const oldProduct =
        stateData && stateData.currentPage
          ? stateData.currentPage.toJS().spec.product
          : '';
      const oldSize =
        stateData && stateData.currentPage ? stateData.setting.toJS().size : '';
      /*if(setting.canvasBorderColor){
        const colorNumber = hexString2Number(setting.canvasBorderColor.hex);
        const changePageData = stateData.pageArray.toJS();
        changePageData[0].canvasBorder.color = colorNumber;
        stateData.pageArray = Immutable.fromJS(changePageData);
      }*/

      if (setting['product']) {
        storeSettingMap.set(oldProduct, stateData.setting);
        const matchSetting = storeSettingMap.get(setting.product);
        if (matchSetting) {
          stateData.setting = matchSetting;
          stateData.setting = stateData.setting.merge({ size: oldSize });
        }
      }
      if (setting['category']) {
        storeSettingMap.set(oldProduct, stateData.setting);
        const computedSetting = projectParser.getNewProjectSetting(
          stateData.setting.toJS(),
          setting,
          stateData.configurableOptionArray
        );

        const matchSetting = storeSettingMap.get(computedSetting.product);
        if (matchSetting) {
          stateData.setting = matchSetting;
          stateData.setting = stateData.setting.merge({ size: oldSize });
        }
      }

      const result = Immutable.fromJS(computeNewData(stateData, setting, true));
      const newSetting = projectParser.getNewProjectSetting(
        stateData.setting.toJS(),
        setting,
        stateData.configurableOptionArray
      );

      if (
        currentSetting.get('photoQuantity') !== newSetting.photoQuantity ||
        newSetting.photoQuantity === enumPhotoQuantity.three
      ) {
        const outPageArray = keepElementsOnSettingChange(
          pageArray,
          result.get('pageArray'),
          imageArray
        );
        dispatch({
          type: types.SET_PAGE_ARRAY,
          pageArray: outPageArray
        });
      } else {
        const pageArray = stateData.pageArray;
        const imageArray = stateData.imageArray;

        const transformedPageArray = transformPageArray(
          pageArray,
          result.get('pageArray'),
          result.get('parameterMap'),
          result.get('setting'),
          imageArray
        );

        dispatch({
          type: types.SET_PAGE_ARRAY,
          pageArray: transformedPageArray
        });
      }

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
        type: types.SET_OPTION_MAP,
        availableOptionMap: result.get('availableOptionMap')
      });

      const newElementArray = getDataFromState(getState()).elementArray;

      dispatch({
        type: types.SET_IMAGE_USED_MAP,
        imageUsedMap: getImageUsedMap(newElementArray)
      });

      return Promise.resolve(result.get('setting'));
    }
    return Promise.resolve();
  };
}

export function changeCanvasBorderColor(setting) {
  return (dispatch, getState) => {
    if (!isEmpty(setting)) {
      if (setting.canvasBorderColor) {
        const colorNumber = hexString2Number(setting.canvasBorderColor.hex);
        dispatch({
          type: types.CHANGE_CANVAS_BORDER_COLOR,
          color: colorNumber
        });
      }
      return Promise.resolve(setting);
    }

    return Promise.resolve();
  };
}
