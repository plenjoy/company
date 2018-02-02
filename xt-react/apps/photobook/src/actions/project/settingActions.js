import { isEmpty, some, merge } from 'lodash';
import Immutable from 'immutable';

import * as types from '../../contants/actionTypes';
import {
  productTypes,
  elementTypes,
  pageTypes,
  coverTypes
} from '../../contants/strings';
import { getSpineWidth } from '../../utils/sizeCalculator';
import { getNewCropByBase } from '../../utils/crop';
import { getDataFromState } from '../../utils/getDataFromState';

import projectParser from '../../../../common/utils/projectParser';
import { getPxByPt, getPxByInch, guid } from '../../../../common/utils/math';
import { generatePageArray, generateCover } from '../../utils/projectGenerator';
import { getImageUsedMap } from '../../utils/countUsed';
import { computedCameoElementOptions } from '../../utils/cameo';
import { clearHistory } from '../system/undoAction';
import setElementByType from '../../utils/setElementByType';
import { getCoverContainerMap } from '../../utils/projectDataUtil';
import {
  checkIsSupportHalfImageInCover,
  checkIsSupportFullImageInCover,
  checkIsSupportPaintedTextInSpine,
  checkIsSupportSpineText
} from '../../utils/cover';

import { getSpineTextRect } from '../../utils/spine';

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

function transformStickerElement(element, stickerArray, pageWidth, pageHeight) {
  const theSticker = stickerArray.find(o => {
    return o.get('code') === element.get('decorationId');
  });

  if (theSticker) {
    const ratio = theSticker.get('width') / theSticker.get('height');
    const newWidth = element.get('pw') * pageWidth;
    const newHeight = newWidth / ratio;

    return element.merge({
      x: element.get('px') * pageWidth,
      y: element.get('py') * pageHeight,
      width: newWidth,
      height: newHeight
    });
  }
  return element;
}

function transformPhotoElement(
  element,
  imageArray,
  pageWidth,
  pageHeight,
  ratio
) {
  const newWidth = element.get('pw') * pageWidth;
  const newHeight = element.get('ph') * pageHeight;

  const newX = element.get('px') * pageWidth;
  const newY = element.get('py') * pageHeight;

  const imageDetail = imageArray.find(item => {
    return item.get('encImgId') === element.get('encImgId');
  });

  let elementOptions = {
    width: newWidth,
    height: newHeight,
    x: newX,
    y: newY
  };

  if (imageDetail) {
    const cropOptions = getNewCropByBase(
      element.merge(elementOptions),
      element,
      imageDetail.toJS(),
      ratio
    );

    elementOptions = Object.assign({}, elementOptions, cropOptions);
  }

  return element.merge(elementOptions);
}

function transformElementArray(
  transformedPage,
  imageArray,
  backgroundArray,
  stickerArray,
  ratio
) {
  let transformedElementArray = Immutable.List();

  const willTransformElements = transformedPage.get('elements');
  const pageWidth = transformedPage.get('width');
  const pageHeight = transformedPage.get('height');

  willTransformElements.forEach(element => {
    let transformedElement = null;
    switch (element.get('type')) {
      case elementTypes.text:
      case elementTypes.paintedText:
        transformedElement = transformTextElement(
          element,
          pageWidth,
          pageHeight
        );
        break;
      case elementTypes.sticker:
        transformedElement = transformStickerElement(
          element,
          stickerArray,
          pageWidth,
          pageHeight
        );
        break;
      case elementTypes.cameo:
      case elementTypes.photo:
        transformedElement = transformPhotoElement(
          element,
          imageArray,
          pageWidth,
          pageHeight,
          ratio
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
        backgroundArray,
        stickerArray
      )
    );
  });

  return transformedElementArray;
}

function transformPageArray(
  existsPageArray,
  newPageArray,
  newParameterMap,
  imageArray,
  backgroundArray,
  stickerArray,
  ratio
) {
  const firstNewPage = newPageArray.first();
  const minSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'min']);
  const maxSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'max']);
  const maxPageNumber = maxSheetNumber * 2;
  const minPageNumber = minSheetNumber * 2;

  let resultPageArray = existsPageArray
    .map(page => {
      return page.merge({
        width: firstNewPage.get('width'),
        height: firstNewPage.get('height'),
        bleed: firstNewPage.get('bleed')
      });
    })
    .slice(0, maxPageNumber);

  if (resultPageArray.size < minPageNumber) {
    resultPageArray = resultPageArray.concat(
      newPageArray.slice(resultPageArray.size)
    );
  }

  resultPageArray.forEach((page, index) => {
    resultPageArray = resultPageArray.setIn(
      [String(index), 'elements'],
      transformElementArray(
        page,
        imageArray,
        backgroundArray,
        stickerArray,
        ratio
      )
    );

    resultPageArray = resultPageArray.setIn(
      [String(index), 'template', 'tplGuid'],
      ''
    );
  });

  return resultPageArray;
}

function keepOldCoverElementsInNewCover(
  oldCover,
  oldCoverType,
  newCover,
  newCoverType,
  isSupportCameo
) {
  let outCover = newCover;

  const oldContainerMap = getCoverContainerMap(oldCover);
  const oldSpineContainer = oldContainerMap.get('spineContainer');

  const newContainerMap = getCoverContainerMap(newCover);
  const newSpineContainerIndex = newContainerMap.get('spineContainerIndex');

  if (
    oldCoverType === newCoverType ||
    (checkIsSupportHalfImageInCover(oldCoverType) &&
      checkIsSupportHalfImageInCover(newCoverType)) ||
    (checkIsSupportFullImageInCover(oldCoverType) &&
      checkIsSupportFullImageInCover(newCoverType))
  ) {
    const oldActivateContainer = oldContainerMap.get('activateContainer');
    const oldBackContainer = oldContainerMap.get('backContainer');

    const newActivateContainerIndex = newContainerMap.get(
      'activateContainerIndex'
    );
    const newActivateContainer = newContainerMap.get('activateContainer');

    const newBackContainerIndex = newContainerMap.get('backContainerIndex');
    const newBackContainer = newContainerMap.get('backContainer');

    const oldElements = oldActivateContainer.get('elements');
    const newElements = oldElements.filter(o => {
      // 如果新的settings不支持cameo, 那么就要过滤cameo. 否则保留.
      if (!isSupportCameo) {
        return o.get('type') !== elementTypes.cameo;
      }

      return true;
    });

    outCover = outCover.setIn(
      ['containers', String(newActivateContainerIndex)],
      newActivateContainer.merge({
        elements: newElements,
        fontColor: oldActivateContainer.get('fontColor'),
        bgColor: oldActivateContainer.get('bgColor')
      })
    );

    if (newBackContainerIndex !== -1) {
      outCover = outCover.setIn(
        ['containers', String(newBackContainerIndex)],
        newBackContainer.merge({
          elements: oldBackContainer.get('elements'),
          fontColor: oldBackContainer.get('fontColor'),
          bgColor: oldBackContainer.get('bgColor')
        })
      );
    }

    outCover = outCover.setIn(
      ['containers', String(newSpineContainerIndex), 'bgColor'],
      oldActivateContainer.get('bgColor')
    );
  }

  const oldSpineTextElement = oldSpineContainer.getIn(['elements', '0']);
  if (oldSpineTextElement) {
    switch (oldSpineTextElement.get('type')) {
      case elementTypes.paintedText:
        if (checkIsSupportPaintedTextInSpine(newCoverType)) {
          outCover = outCover.setIn(
            ['containers', String(newSpineContainerIndex), 'elements', '0'],
            oldSpineTextElement
          );
        }
        break;

      case elementTypes.text: {
        if (checkIsSupportSpineText(newCoverType)) {
          outCover = outCover.setIn(
            ['containers', String(newSpineContainerIndex), 'elements', '0'],
            oldSpineTextElement
          );
        }
        break;
      }
    }
  }

  return outCover;
}

function transformCover(
  newCover,
  newParameterMap,
  transformedPageArray,
  imageArray,
  backgroundArray,
  stickerArray,
  ratio
) {
  const currentSheetNumber = transformedPageArray.size / 2;
  const minSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'min']);
  const addedSheetNumber = currentSheetNumber - minSheetNumber;

  const coverPageBleed = newParameterMap.get('coverPageBleed');

  const spineWidthWithBleed =
    getSpineWidth(newParameterMap.get('spineWidth').toJS(), addedSheetNumber) +
    coverPageBleed.get('left') +
    coverPageBleed.get('right');

  const coverContainerMap = getCoverContainerMap(newCover);
  const spineContainerIndex = coverContainerMap.get('spineContainerIndex');
  const fullContainerIndex = coverContainerMap.get('fullContainerIndex');

  let outCover = newCover;

  if (fullContainerIndex !== -1) {
    const addtionalValue = newParameterMap.getIn([
      'spineWidth',
      'addtionalValue'
    ]);

    const coverWidth =
      newCover.get('width') + addedSheetNumber * addtionalValue;

    // 设置新的封面宽度
    outCover = outCover.set('width', coverWidth);
    outCover = outCover.setIn(
      ['containers', String(fullContainerIndex), 'width'],
      coverWidth
    );
  }

  const outCoverContainerMap = getCoverContainerMap(outCover);
  const activateContainer = outCoverContainerMap.get('activateContainer');
  const activateContainerIndex = outCoverContainerMap.get(
    'activateContainerIndex'
  );
  const backContainer = outCoverContainerMap.get('backContainer');
  const backContainerIndex = outCoverContainerMap.get('backContainerIndex');

  outCover = outCover.setIn(
    ['containers', String(activateContainerIndex), 'elements'],
    transformElementArray(
      activateContainer,
      imageArray,
      backgroundArray,
      stickerArray,
      ratio
    )
  );

  if (backContainerIndex !== -1) {
    outCover = outCover.setIn(
      ['containers', String(backContainerIndex), 'elements'],
      transformElementArray(
        backContainer,
        imageArray,
        backgroundArray,
        stickerArray,
        ratio
      )
    );
  }

  outCover = outCover.setIn(
    ['containers', String(activateContainerIndex), 'template', 'tplGuid'],
    ''
  );

  outCover = outCover.setIn(
    ['containers', String(spineContainerIndex), 'width'],
    spineWidthWithBleed
  );

  const spineContainer = outCover.getIn([
    'containers',
    String(spineContainerIndex)
  ]);

  const spineTextElement = spineContainer.getIn(['elements', '0']);

  if (spineTextElement) {
    const spineTextRect = getSpineTextRect(spineContainer);

    outCover = outCover.setIn(
      ['containers', String(spineContainerIndex), 'elements', '0'],
      spineTextElement.merge(spineTextRect)
    );
  }

  return outCover;
}

function logSpineWidth(oldSetting, oldCover, newSetting, newCover) {
  const resultMap = {};

  const oldCoverContainerMap = getCoverContainerMap(oldCover);
  const oldSpineContainer = oldCoverContainerMap.get('spineContainer');
  const oldSpineContainerBleed = oldSpineContainer.get('bleed');

  resultMap.before = {
    product: oldSetting.get('product'),
    size: oldSetting.get('size'),
    thickness: oldSetting.get('paperThickness'),
    spineWidth:
      oldSpineContainer.get('width') -
      (oldSpineContainerBleed.get('left') + oldSpineContainerBleed.get('right'))
  };

  const newCoverContainerMap = getCoverContainerMap(newCover);
  const newSpineContainer = newCoverContainerMap.get('spineContainer');
  const newSpineContainerBleed = newSpineContainer.get('bleed');

  resultMap.after = {
    product: newSetting.get('product'),
    size: newSetting.get('size'),
    thickness: newSetting.get('paperThickness'),
    spineWidth:
      newSpineContainer.get('width') -
      (newSpineContainerBleed.get('left') + newSpineContainerBleed.get('right'))
  };

  console.table(resultMap);
}

function keepUserDataWhenSettingChanged() {}

function addUndeletableCameoInSpecialBook(
  setting,
  cover,
  convertedParameterMap,
  variableMap
) {
  if (
    !variableMap.cameoSupportCondition ||
    setting.product !== productTypes.PS ||
    [coverTypes.PSNC, coverTypes.PSLC].indexOf(setting.cover) === -1
  ) {
    return cover;
  }

  const outCover = Object.assign({}, cover);
  let spineContainerIndex = -1;
  let fullContainerIndex = -1;

  cover.containers.forEach((o, index) => {
    if (o.type === pageTypes.spine) {
      spineContainerIndex = index;
    }

    if (o.type === pageTypes.full) {
      fullContainerIndex = index;
    }
  });

  const spineContainer = cover.containers[spineContainerIndex];
  const fullContainer = cover.containers[fullContainerIndex];

  const hasCameoElement = fullContainer.elements.find(o => {
    return o.type === elementTypes.cameo;
  });

  if (spineContainer && !hasCameoElement) {
    const spineWidth = spineContainer.width;

    const cameoAttrs = computedCameoElementOptions(
      cover,
      convertedParameterMap.cameoSize,
      convertedParameterMap.cameoBleed,
      spineWidth
    );

    const newCameoElement = {
      type: elementTypes.cameo,
      elType: 'cameo',
      id: guid(),
      rot: 0,
      cameo: setting.cameo,
      cameoShape: setting.cameoShape,
      ...cameoAttrs
    };

    outCover.containers[fullContainerIndex].elements.push(newCameoElement);
  }

  return outCover;
}

function convertParametersUnit(parameterMap) {
  if (!isEmpty(parameterMap)) {
    const { bookCoverBaseSize, bookInnerBaseSize } = parameterMap;
    const outObj = merge({}, parameterMap);
    outObj.bookCoverBaseSize = {
      height: Math.round(getPxByInch(bookCoverBaseSize.heightInInch)),
      width: Math.round(getPxByInch(bookCoverBaseSize.widthInInch))
    };

    outObj.bookInnerBaseSize = {
      height: Math.round(getPxByInch(bookInnerBaseSize.heightInInch)),
      width: Math.round(getPxByInch(bookInnerBaseSize.widthInInch))
    };

    return outObj;
  }
  return null;
}

export function computeNewData(stateData, newSetting = null) {
  const {
    configurableOptionArray,
    allOptionMap,
    parameterArray,
    variableArray,
    bookSetting,
    setting
  } = stateData;

  const bgColor = bookSetting.getIn(['background', 'color']);

  const currentSetting = setting.toJS();
  let computedSetting = null;
  if (!newSetting) {
    computedSetting = projectParser.getDefaultProjectSetting(
      currentSetting,
      configurableOptionArray,
      allOptionMap
    );
  } else {
    computedSetting = projectParser.getNewProjectSetting(
      currentSetting,
      newSetting,
      configurableOptionArray,
      allOptionMap
    );
  }

  const parameterMap = projectParser.getParameters(
    computedSetting,
    parameterArray
  );

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const isPressBook = computedSetting.product === productTypes.PS;

  const pageArray = generatePageArray(
    isPressBook,
    convertedParameterMap,
    bgColor
  );

  const variableMap = projectParser.getVariables(
    computedSetting,
    variableArray
  );

  const cover = generateCover(
    computedSetting.cover,
    convertedParameterMap,
    variableMap,
    bgColor
  );

  return {
    pageArray,
    variableMap,
    cover: addUndeletableCameoInSpecialBook(
      computedSetting,
      cover,
      convertedParameterMap,
      variableMap
    ),
    setting: computedSetting,
    parameterMap: convertedParameterMap
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
    type: types.CHANGE_PROJECT_SETTING,
    setting: result.get('setting')
  });

  dispatch({
    type: types.SWITCH_SHEET,
    index: 0
  });

  dispatch({ type: types.CLEAR_ELEMENT_ARRAY });

  dispatch({ type: types.CLEAR_IMAGE_USED_MAP });

  dispatch({ type: types.CLEAR_STICKER_USED_MAP });
}

export function changeProjectSetting(setting) {
  return (dispatch, getState) => {
    if (!isEmpty(setting)) {
      const stateData = getDataFromState(getState());
      const oldSetting = stateData.setting;

      const result = Immutable.fromJS(computeNewData(stateData, setting));

      const oldProduct = oldSetting.get('product');

      if (
        (oldProduct === productTypes.PS && setting.product) ||
        setting.product === productTypes.PS
      ) {
        resetData(dispatch, result);
        return Promise.resolve();
      }

      const isSizeChanged =
        setting.size && oldSetting.get('size') !== setting.size;
      const isProductChanged =
        setting.product && oldSetting.get('product') !== setting.product;
      const isPaperThicknessChanged =
        setting.paperThickness &&
        oldSetting.get('paperThickness') !== setting.paperThickness;
      const isCoverChanged =
        setting.cover && oldSetting.get('cover') !== setting.cover;

      const cover = stateData.cover;
      if (
        isProductChanged ||
        isSizeChanged ||
        isCoverChanged ||
        isPaperThicknessChanged
      ) {
        const pageArray = stateData.pageArray;
        const imageArray = stateData.imageArray;
        const stickerArray = stateData.stickerArray;
        const backgroundArray = stateData.backgroundArray;
        const ratioMap = stateData.ratioMap;

        const transformedPageArray = transformPageArray(
          pageArray,
          result.get('pageArray'),
          result.get('parameterMap'),
          imageArray,
          backgroundArray,
          stickerArray,
          ratioMap.get('innerWorkspace')
        );

        const newCover = keepOldCoverElementsInNewCover(
          cover,
          oldSetting.get('cover'),
          result.get('cover'),
          result.get('setting').get('cover'),
          result.getIn(['variableMap', 'cameoSupportCondition'])
        );

        const transformedCover = transformCover(
          newCover,
          result.get('parameterMap'),
          transformedPageArray,
          imageArray,
          backgroundArray,
          stickerArray,
          ratioMap.get('coverWorkspace')
        );

        logSpineWidth(
          oldSetting,
          cover,
          result.get('setting'),
          transformedCover
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

      const isLeatherColorChanged =
        setting.leatherColor &&
        oldSetting.get('leatherColor') !== setting.leatherColor;

      if (
        isLeatherColorChanged &&
        (setting.leatherColor === 'rusticGreen' ||
          setting.leatherColor === 'rusticBrown')
      ) {
        const DEFAULT_COLOR = '#FFFFFF';

        let outCover = cover;

        outCover.get('containers').forEach((container, i) => {
          const elements = container.get('elements');
          elements.forEach((element, j) => {
            if (
              element.get('type') === elementTypes.paintedText ||
              element.get('type') === elementTypes.text
            ) {
              outCover = outCover.setIn(
                ['containers', String(i), 'elements', String(j), 'fontColor'],
                DEFAULT_COLOR
              );
            }
          });
        });

        dispatch({
          type: types.SET_COVER,
          cover: outCover
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

      const newElementArray = getDataFromState(getState()).elementArray;

      dispatch({
        type: types.SET_IMAGE_USED_MAP,
        imageUsedMap: getImageUsedMap(newElementArray)
      });

      dispatch({
        type: types.SWITCH_SHEET,
        index: 0
      });

      dispatch(clearHistory());
    }
    return Promise.resolve();
  };
}
