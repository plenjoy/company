import qs from 'qs';
import { get, merge, template, isNumber, isEmpty } from 'lodash';

import {
  GET_TEMPLATE,
  GET_SPREAD,
  SAVE_TEMPLATE,
  PUBLISH_TEMPLATE,
  COPY_TEMPLATE,
  GET_STYLE_LIST,
  GET_TEST_IMAGE_URL,
  GET_LIVE_IMAGE_URL,
  GET_TAG_LIST
} from '../constants/apiUrl';
import {
  defaultTextList,
  elementTypes,
  productTypes,
  DEFAULT_FONT_COLOR
} from '../constants/strings';

import {
  INIT_SPREAD,
  INIT_SPREAD_SETTING,
  INIT_ELEMENTS,
  CREATE_ELEMENT,
  UPDATE_ELEMENT,
  UPDATE_SETTING,
  UPDATE_MULTI_ELEMENT,
  DELETE_ELEMENTS,
  UPDATE_ELEMENT_DEPTH,
  CHANGE_SPREAD_SETTING
} from '../constants/actionTypes';
import { CALL_API } from '../middlewares/api';
import { generateTemplate } from '../utils/templateGenerator';

import { guid, getPxByInch } from '../../../common/utils/math';
import { getUrlParam } from '../../../common/utils/url';
import { convertObjIn } from '../../../common/utils/typeConverter';
import projectParser from '../../../common/utils/projectParser';
import {
  numberToHex,
  hexString2Number
} from '../../../common/utils/colorConverter';

import x2jsInstance from '../../../common/utils/xml2js';

import {
  getCoverSheetSize,
  getInnerSheetSize,
  getInnerPageSize,
  getFrontCoverSize
} from '../utils/sizeCalculator';

const MAX_VIEW_BOOK_WIDTH = 1200;

const makeElement = (dep, type = elementTypes.photo) => {
  const element = {
    id: guid(),
    type,
    x: 20 * dep,
    y: 10 * dep,
    width: 500,
    height: 600,
    rot: 0,
    dep,
    isLock: false,
    keepRatio: false
  };
  if (type === elementTypes.text) {
    return merge({}, element, {
      text: defaultTextList[0],
      fontColor: DEFAULT_FONT_COLOR,
      fontSize: 95.8,
      textAlign: 'center',
      fontWeight: 'normal',
      fontFamily: 'Roboto',
      textVAlign: 'middle',
      width: 1200,
      height: 120
    });
  }
  return element;
};

function handleProjectData(projectData, state, dispatch) {
  const { viewData, sheetType } = projectData;

  const isNewProject = !viewData;

  const initElements = [];

  let elements = initElements;

  let spread = {
    type: sheetType,
    bgColor: 16777215
  };

  if (isNewProject) {
    let { frameHorizonNum, textFrameHorizonNum } = projectData;

    let i = 0;

    while (frameHorizonNum--) {
      initElements.push(makeElement(i++));
    }
    while (textFrameHorizonNum--) {
      initElements.push(makeElement(i++, elementTypes.text));
    }
  } else {
    const xmlData = x2jsInstance.xml2js(get(projectData, 'viewData'));
    spread = xmlData.templateView.spread;

    const serverElements = get(spread, 'elements.element');

    if (serverElements instanceof Array) {
      elements = serverElements;
    } else {
      elements = [serverElements];
    }
  }

  const bookParameters = getBookParameters(projectData, state.spec);
  const { originalWidth, originalHeight } = bookParameters;

  const newElements = calculateElementRelativeProperty(
    elements,
    originalWidth,
    originalHeight
  );

  dispatch({
    type: INIT_SPREAD,
    spread
  });

  dispatch({
    type: INIT_ELEMENTS,
    elements: newElements
  });

  // 初始化面板尺寸
  dispatch({
    type: INIT_SPREAD_SETTING,
    options: {
      ...bookParameters
    }
  });
}

function calculateElementRelativeProperty(
  elements,
  originalWidth,
  originalHeight
) {
  const fixedElements = convertObjIn(elements);
  return fixedElements.map((item) => {
    // 新的元素不会添加px.
    const isNewElement = item.px === undefined;

    let element = null;

    if (isNewElement) {
      element = merge({}, item, {
        px: item.x / originalWidth,
        py: item.y / originalHeight,
        pw: item.width / originalWidth,
        ph: item.height / originalHeight
      });
    } else {
      element = merge({}, item, {
        x: item.px * originalWidth,
        y: item.py * originalHeight,
        width: item.pw * originalWidth,
        height: item.ph * originalHeight
      });
    }

    if (element.type === elementTypes.text) {
      const { fontSize, color, lineSpacing } = element;
      if (fontSize && fontSize > 1) {
        element.fontSize = fontSize / originalHeight;
      }

      if (!element.text) {
        element.text = element.__text || defaultTextList[0];
      }

      if (isNumber(color)) {
        element.fontColor = numberToHex(color);
        delete element.color;
      }

      if (typeof lineSpacing === 'undefined') {
        element.lineSpacing = 1.2;
      }
    }

    return element;
  });
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

function getBookParametersFromServer(serverBookParameters) {
  const {
    bookWidth,
    bookHeight,
    bleedingPixelTop,
    bleedingPixelBottom,
    bleedingPixelLeft,
    bleedingPixelRight
  } = serverBookParameters;

  return {
    originalWidth: bookWidth + bleedingPixelLeft + bleedingPixelRight,
    originalHeight: bookHeight + bleedingPixelTop + bleedingPixelBottom,

    bleed: {
      top: bleedingPixelTop,
      bottom: bleedingPixelBottom,
      left: bleedingPixelLeft,
      right: bleedingPixelRight
    }
  };
}

function getBookParametersFromSpec(isCover, setting, spec) {
  const computedSetting = projectParser.getDefaultProjectSetting(
    setting,
    spec.configurableOptionArray,
    spec.allOptionMap
  );

  const parameterMap = projectParser.getParameters(
    computedSetting,
    spec.parameterArray
  );

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const {
    bookCoverBaseSize,
    bookInnerBaseSize,
    innerPageBleed,
    coverPageBleed,
    coverExpandingSize
  } = convertedParameterMap;

  let sheetSize = {};

  const { cover } = setting;
  const halfPageCoverList = ['MC', 'GM', 'CC', 'GC'];

  const isHalfPageCover = halfPageCoverList.indexOf(cover) !== -1;
  const isPressBook = setting.product === productTypes.PS;
  if (isCover) {
    if (!isHalfPageCover) {
      sheetSize = getCoverSheetSize(
        bookCoverBaseSize,
        coverPageBleed,
        coverExpandingSize,
        convertedParameterMap.spineWidth
      );
    } else {
      sheetSize = getFrontCoverSize(
        bookCoverBaseSize,
        coverPageBleed,
        coverExpandingSize
      );
    }
  } else if (!isPressBook) {
    sheetSize = getInnerSheetSize(bookInnerBaseSize, innerPageBleed);
  } else {
    sheetSize = getInnerPageSize(bookInnerBaseSize, innerPageBleed);
  }

  const parameters = {
    originalWidth: sheetSize.width,
    originalHeight: sheetSize.height,
    safeZone: convertedParameterMap.safeZone
  };

  if (isCover) {
    parameters.bleed = coverPageBleed;

    if (!isHalfPageCover) {
      parameters.spineWidth = convertedParameterMap.spineWidth;
      parameters.spineExpanding = convertedParameterMap.spineExpanding;
    }
  } else {
    parameters.bleed = innerPageBleed;
  }

  return parameters;
}

function getBookParameters(projectData, spec) {
  const serverBookParameters = projectData.specInfo;
  const setting = projectData.productInfo;
  const isCover = projectData.isCoverTemplate;

  let bookParameters = null;

  if (setting) {
    bookParameters = getBookParametersFromSpec(isCover, setting, spec);
  } else {
    bookParameters = getBookParametersFromServer(serverBookParameters);
  }

  const viewWidth = MAX_VIEW_BOOK_WIDTH;
  const ratio = viewWidth / bookParameters.originalWidth;
  const viewHeight = Math.round(bookParameters.originalHeight * ratio);

  return {
    ratio,
    viewWidth,
    viewHeight,
    ...bookParameters
  };
}

export function getStyleList() {
  return (dispatch, getState) => {
    const state = getState();
    const urls = get(getState(), 'system.env.urls');
    const styleType = getUrlParam('format');
    const styleSize = get(state, 'project.setting.size');
    dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_STYLE_LIST,
          params: {
            styleType,
            styleSize
          }
        }
      }
    }).then((res) => {
      handleStyleList(res, dispatch, state, urls);
    });
  };
}

const handleStyleList = (res, dispatch, state, urls) => {
  const list = get(res, 'data');
  const position = get(state, 'project.setting.usePosition');
  const styleId = getUrlParam('styleId');
  const calendarBaseUrl = urls.calendarBaseUrl;
  let bgUrl = '';

  if (list.length) {
    const currentStyle = list.find((item) => {
      return item.uidPk == styleId;
    });
    const guid = currentStyle.guid;
    bgUrl = template(GET_LIVE_IMAGE_URL)({ calendarBaseUrl, guid, position });

    dispatch({
      type: CHANGE_SPREAD_SETTING,
      bgUrl
    });

    dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TAG_LIST,
          params: {
            wwwBaseUrl: urls.wwwBaseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            categoryLeafNode: currentStyle.festival
          })
        }
      }
    });
  }
};

export function saveProject(ops = { isPublish: false }) {
  return (dispatch, getState) => {
    const state = getState();
    const { project, system } = state;
    const { spread, setting, spreadOptions } = project;
    const { originalWidth, originalHeight } = spreadOptions;

    let photoH = 0,
      photoV = 0,
      photoQ = 0,
      textH = 0,
      textV = 0;

    const clonedSpread = merge({}, spread);
    clonedSpread.elements.element.map((element) => {
      const ratio = element.width / element.height;
      element.px = element.x / originalWidth;
      element.pw = element.width / originalWidth;
      element.py = element.y / originalHeight;
      element.ph = element.height / originalHeight;
      element.rot = Math.round(element.rot);
      const type = element.type;
      if (ratio > 1) {
        if (type === elementTypes.photo) {
          photoH++;
        } else {
          textH++;
        }
      } else if (ratio < 1) {
        if (type === elementTypes.photo) {
          photoV++;
        } else {
          textV++;
        }
      } else if (type === elementTypes.photo) {
        photoQ++;
      }

      if (element.fontColor) {
        element.color = hexString2Number(element.fontColor);
        delete element.fontColor;
      }
    });

    const templateXmlString = generateTemplate(clonedSpread, system.tagList);
    const copySetting = merge({}, setting, {
      frameHorizonNum: photoH,
      frameVertialNum: photoV,
      frameSquareNum: photoQ,
      imageNum: photoH + photoV + photoQ,
      textFrameHorizonNum: textH,
      textFrameVertialNum: textV,
      textFrameTotalNum: textH + textV
    });
    const bodyParams = merge({}, copySetting, {
      viewData: templateXmlString,
      status: ops.isPublish ? 1 : 3
    });

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: ops.isPublish ? PUBLISH_TEMPLATE : SAVE_TEMPLATE
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify(bodyParams)
        }
      }
    }).then((res) => {
      const type = ops.isPublish ? 'Submit' : 'Save';
      if (res.errorCode === 0) {
        alert(`${type} successfully!`);
      } else {
        alert(`${type} failed!`);
      }
    });
  };
}

export function copyProject() {
  return (dispatch, getState) => {
    const state = getState();
    const uidpk = get(state, 'project.uidpk');
    const parentUidpk = get(state, 'project.__originalData__.parentUidpk');
    if (parentUidpk != 0) {
      alert('This is not original template');
      return;
    }
    if (uidpk == '' || uidpk == 0) {
      alert('uidpk is error');
    } else {
      window.open(template(COPY_TEMPLATE)({ uidpk }));
    }
  };
}

export function createElement(elementType, type = CREATE_ELEMENT) {
  return (dispatch, getState) => {
    const elements = getState().project.spread.elements.element;
    const spreadOptions = getState().project.spreadOptions;

    let maxDep = 0;
    if (elements.length) {
      maxDep = Math.max(...elements.map(o => o.dep));
    }
    const newElements = calculateElementRelativeProperty(
      [makeElement(maxDep + 1, elementType)],
      spreadOptions.originalWidth,
      spreadOptions.originalHeight
    );

    dispatch({
      type,
      element: newElements[0]
    });

    return Promise.resolve(newElements[0]);
  };
}

export function deleteElement(elementId) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_ELEMENTS,
      elementIds: [elementId]
    });
  };
}

export function deleteElements(elementIds) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_ELEMENTS,
      elementIds
    });
  };
}

export function updateElement(elementId, newAttribute) {
  return (dispatch, getState) => {
    const state = getState();
    const elements = get(state, 'project.spread.elements.element');
    const currentElement = elements.filter((item) => {
      return item.id === elementId;
    });
    if (
      typeof newAttribute.isLock === 'undefined' &&
      currentElement[0].isLock
    ) {
      return false;
    }
    dispatch({
      type: UPDATE_ELEMENT,
      elementId,
      newAttribute
    });
  };
}

export function updateMultiElement(newElementArray) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_MULTI_ELEMENT,
      newElementArray
    });
  };
}

export function updateSetting(newSetting) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_SETTING,
      newSetting
    });
  };
}

export function elementToFront(elementId) {
  let i = 0;
  return (dispatch, getState) => {
    const state = getState();
    const elements = get(state, 'project.spread.elements.element');
    // 获取当前选中元素的索引
    const elementIndex = elements.findIndex((item) => {
      return item.id === elementId;
    });

    const currentElement = elements[elementIndex];
    if (currentElement.isLock) {
      return false;
    }
    let newElementArray = elements.map((item) => {
      if (item.id !== elementId) {
        return {
          dep: item.dep,
          id: item.id
        };
      }
      return {
        dep: elements.length,
        id: item.id
      };
    });

    newElementArray.sort((a, b) => {
      return a.dep > b.dep;
    });

    newElementArray = newElementArray.map((item) => {
      if (elementId != item.id) {
        return merge({}, item, {
          dep: i++
        });
      }
      return item;
    });

    dispatch({
      type: UPDATE_ELEMENT_DEPTH,
      newElementArray
    });
  };
}

export function elementToBack(elementId) {
  let i = 1;
  return (dispatch, getState) => {
    const state = getState();
    const elements = get(state, 'project.spread.elements.element');
    const newElementArray = elements.map((item) => {
      if (item.id !== elementId) {
        return {
          dep: i++,
          id: item.id
        };
      }
      return {
        dep: 0,
        id: item.id
      };
    });
    dispatch({
      type: UPDATE_ELEMENT_DEPTH,
      newElementArray
    });
  };
}

export function getProjectData(uidpk) {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_TEMPLATE,
          params: {
            uidpk
          }
        }
      }
    }).then((res) => {
      const { data } = res;
      handleProjectData(data, state, dispatch);
    });
  };
}
