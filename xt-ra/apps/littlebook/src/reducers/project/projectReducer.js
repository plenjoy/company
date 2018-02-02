import Immutable from 'immutable';
import { isEmpty, isNumber, isUndefined, merge, pick, some, get } from 'lodash';
// import undoable, { includeAction } from 'redux-undo';
import undoable from '../../utils/undoable';
import securityString from '../../../../common/utils/securityString';
import * as types from '../../contants/actionTypes';
import * as apiUrl from '../../contants/apiUrl';
import { getSpineRect } from '../../utils/spine';
import specParser from '../../../../common/utils/specParser';
import projectParser from '../../../../common/utils/projectParser';
import {
  getPxByInch,
  getPxByPt,
  guid,
  decToHex
} from '../../../../common/utils/math';
import { convertObjIn } from '../../../../common/utils/typeConverter';

import {
  elementTypes,
  productTypes,
  coverTypes,
  pageTypes,
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID
} from '../../contants/strings';

import { getQueryStingObj } from '../../utils/url';
import { getSpineWidth } from '../../utils/sizeCalculator';
import { getCropOptions } from '../../utils/crop';
import {
  createCoverPagePhotoElement,
  updateElementByTemplate,
  createCoverPageTextElement,
  computedCoverTextPosition,
  createSpineTextElement
} from '../../utils/elementHelper';

import {
  generatePageArray,
  generatePage,
  generateCover,
  generateSheet,
  generateContainer
} from '../../utils/projectGenerator';

const queryStringObj = getQueryStingObj();
const settingObj = pick(queryStringObj, ['title', 'product', 'size']);
const initGuid = queryStringObj.initGuid || queryStringObj.mainProjectUid;

if(initGuid){
  securityString.encProjectId = initGuid
}

const defaultBookSetting = {
  // 是否应用全局的字体设置.
  font: {
    fontSize: 23,
    color: '#000000',
    fontFamilyId: DEFAULT_FONT_FAMILY_ID,
    fontId: DEFAULT_FONT_WEIGHT_ID
  },

  // 全局边框的默认值.
  border: {
    color: '#000000',
    size: 0,
    opacity: 100
  }
};

const defaultSpec = {
  client: 'h5',
  size: '5X7',
  cover: 'LBPAC', // 'LBHC',
  paperThickness: 'ExtraThin',
  paper: 'DP',
  colorScheme: 'ColorScheme0',
  product: 'LB2'
};

const initialState = Immutable.fromJS({
  projectId: +initGuid || -1,
  encProjectIdString: +initGuid ? '' : initGuid || '',

  // 手动输入的title,如果客户没有手动输入, 那么与defaultTitle的值一致.
  title: queryStringObj.title,

  webClientId: queryStringObj.webClientId,
  setting: merge({}, defaultSpec, settingObj),
  isProjectLoadCompleted: false,
  isProjectEdited: false,
  createdDate: new Date(),
  cover: {},
  pageArray: [],
  elementArray: [],
  deletedEncImgIds: [],
  imageArray: [],
  imageUsedCountMap: {},
  decorationUsedCountMap: {},
  bookSetting: defaultBookSetting,
  isAutoSaveProject: false
});

const affectedCoverSettingKeys = ['cover', 'leatherColor'];

const containersPathArr = ['cover', 'containers'];

function getImage(images, encImgId) {
  return images.find((im) => {
    return im.get('encImgId') === encImgId;
  });
}

function convertParametersUnit(parameterMap) {
  if (!isEmpty(parameterMap)) {
    const { bookCoverBaseSize, bookInnerBaseSize } = parameterMap;
    const outObj = merge({}, parameterMap);
    outObj.bookCoverBaseSize = {
      height: getPxByInch(bookCoverBaseSize.heightInInch),
      width: getPxByInch(bookCoverBaseSize.widthInInch)
    };

    outObj.bookInnerBaseSize = {
      height: getPxByInch(bookInnerBaseSize.heightInInch),
      width: getPxByInch(bookInnerBaseSize.widthInInch)
    };
    return outObj;
  }
  return null;
}

function convertVariableColor(variables, keys) {
  if (!variables || !keys || !keys.length) {
    return variables;
  }

  const newVariables = merge({}, variables);
  keys.forEach((k) => {
    const v = newVariables[k];
    newVariables[k] = decToHex(v);
  });

  return newVariables;
}

function addElementIdIfHasNoId(elements) {
  const outArray = [];

  if (elements && elements.forEach) {
    elements.forEach((element) => {
      if (element) {
        if (typeof element.id !== 'undefined') {
          outArray.push(element);
        } else {
          outArray.push(merge({}, element, { id: guid() }));
        }
      }
    });
  }

  return outArray;
}

function computeDataBySetting(
  configurableOptionArray,
  parameterArray,
  variableArray,
  { needDefaultSetting, currentSetting, newSetting, bgColor }
) {
  let setting = null;
  if (needDefaultSetting) {
    setting = projectParser.getDefaultProjectSetting(
      currentSetting,
      configurableOptionArray
    );
  } else {
    setting = projectParser.getNewProjectSetting(
      currentSetting,
      newSetting,
      configurableOptionArray
    );
  }

  const parameterMap = projectParser.getParameters(setting, parameterArray);

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const pageArray = generatePageArray(
    setting.product,
    convertedParameterMap,
    bgColor
  );

  const variableMap = projectParser.getVariables(setting, variableArray);

  // coverBackgroundColor, coverForegroundColor变成16进制.
  const newVariables = convertVariableColor(variableMap, [
    'coverBackgroundColor',
    'coverForegroundColor'
  ]);

  const cover = generateCover(
    setting.cover,
    convertedParameterMap,
    newVariables
  );

  return {
    setting,
    cover,
    pageArray,
    variableMap: newVariables,
    parameterMap: convertedParameterMap
  };
}

function updateSpineContainerWidth(state, type = 'add') {
  const containers = state.getIn(containersPathArr);
  const elementArray = state.get('elementArray');
  const parameterMap = state.get('parameterMap');
  const spineContainerIndex = containers.findIndex((container) => {
    return container.get('type') === pageTypes.spine;
  });
  const backPageContainerIndex = containers.findIndex((container) => {
    return container.get('type') === pageTypes.back;
  });

  let newState = state;
  if (spineContainerIndex !== -1) {
    const spineContainer = containers.get(spineContainerIndex);
    const addtionalValue = parameterMap.getIn(['spineWidth', 'addtionalValue']);
    let newWidth = spineContainer.get('width');

    switch (type) {
      case 'add':
        newWidth += addtionalValue;
        break;
      case 'subtract':
        newWidth -= addtionalValue;
        break;
      default:
    }
    if (spineContainer.get('elements').size) {
      const spineHeight = spineContainer.get('height');
      const spineTextElementId = spineContainer.getIn(['elements', '0']);
      const spineTextElementIndex = elementArray.findIndex((ele) => {
        return ele.get('id') === spineTextElementId;
      });
      const spineTextElement = elementArray.get(spineTextElementIndex);

      const spineElementRect = getSpineRect(newWidth, spineHeight);
      let { x, y, width, height } = spineElementRect;
      if (backPageContainerIndex >= 0) {
        const spineBleed = spineContainer.get('bleed');
        const BleedLeft = spineBleed.get('left');
        const BleedRight = spineBleed.get('right');
        const BleedTop = spineBleed.get('top');
        const BleedBottom = spineBleed.get('bottom');
        const backpageWidth = newWidth - BleedLeft - BleedRight;
        const backpageHeight = spineHeight - BleedTop - BleedBottom;
        const spinePageSpineRect = getSpineRect(backpageWidth, backpageHeight);
        x = spinePageSpineRect.x + BleedLeft;
        y = spinePageSpineRect.y + BleedTop;
        width = spinePageSpineRect.width;
        height = spinePageSpineRect.height;
      }
      const newSpineElement = spineTextElement.merge({
        x,
        y,
        width,
        height,
        px: x / newWidth,
        py: y / spineHeight,
        pw: width / newWidth,
        ph: height / spineHeight
      });
      newState = newState.setIn(
        ['elementArray', spineTextElementIndex],
        newSpineElement
      );
    }

    newState = newState.setIn(
      containersPathArr.concat([String(spineContainerIndex)]),
      spineContainer.set('width', newWidth)
    );
  }

  return newState;
}

function countSpecifyKeyInObject(immutableObj, specifyKey) {
  let outObj = Immutable.Map();

  immutableObj.forEach((value, key) => {
    if (key === specifyKey && value) {
      outObj = outObj.set(String(value), 1);
    }
    if (value && value.size) {
      const resultMap = countSpecifyKeyInObject(value, specifyKey);
      resultMap.forEach((v, k) => {
        const stringKey = String(k);
        if (isUndefined(outObj.get(k))) {
          outObj = outObj.set(stringKey, resultMap.get(k));
        } else {
          outObj = outObj.set(
            stringKey,
            outObj.get(stringKey) + resultMap.get(stringKey)
          );
        }
      });
    }
  });
  return outObj;
}

function getImageUsedCountMap(immutableObj) {
  return countSpecifyKeyInObject(immutableObj, 'encImgId');
}

function getDecorationUsedCountMap(immutableObj) {
  return countSpecifyKeyInObject(immutableObj, 'decorationid');
}

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);

function transformPageArray(existsPageArray, newPageArray, newParameterMap) {
  const firstNewPage = newPageArray.first();
  const minSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'min']);
  const maxSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'max']);
  const maxPageNumber = maxSheetNumber * 2;
  const minPageNumber = minSheetNumber * 2;

  let resultPageArray = existsPageArray
    .map((page) => {
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

  return resultPageArray;
}

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

function transformPhotoElement(
  element,
  imageArray,
  pageWidth,
  pageHeight,
  resetCrop = false
) {
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

  if (imageDetail && resetCrop) {
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

function transformElementArray(
  existsElementArray,
  transformedPageArray,
  imageArray
) {
  let transformedElementArray = Immutable.List();

  transformedPageArray.forEach((page) => {
    const willTransformElementIds = page.get('elements');
    const pageWidth = page.get('width');
    const pageHeight = page.get('height');
    if (willTransformElementIds && willTransformElementIds.size) {
      existsElementArray.forEach((element) => {
        if (willTransformElementIds.indexOf(element.get('id')) !== -1) {
          let transformedElement = null;
          switch (element.get('type')) {
            case elementTypes.text:
              transformedElement = transformTextElement(
                element,
                pageWidth,
                pageHeight
              );
              break;
            case elementTypes.decoration:
              transformedElement = transformDecorationElement(
                element,
                pageWidth,
                pageHeight
              );
              break;
            case elementTypes.photo:
              transformedElement = transformPhotoElement(
                element,
                imageArray,
                pageWidth,
                pageHeight
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
            transformedElement
          );
        }
      });
    }
  });

  return transformedElementArray;
}

const transformElementArrayColor = (elementsArray, textColor) => {
  let newElementsArray = elementsArray;

  if (textColor && newElementsArray && newElementsArray.size) {
    newElementsArray.forEach((ele, index) => {
      const fontColor = ele.get('fontColor');
      if (fontColor && fontColor !== textColor) {
        newElementsArray = newElementsArray.setIn(
          [`${index}`, 'fontColor'],
          textColor
        );
      }
    });
  }

  return newElementsArray;
};

const transformCoverElementArray = (
  elementsArray,
  containers,
  imageArray,
  parameterMap,
  setting,
  bookSetting
) => {
  let newElementsArray = Immutable.List([]);

  const fullPage = containers.find(
    c => c.get('type') === pageTypes.full && c.getIn(['backend', 'isPrint'])
  );
  const spinePage = containers.find(c => c.get('type') === pageTypes.spine);

  if (fullPage && spinePage && elementsArray && elementsArray.size) {
    const ids = fullPage.get('elements');

    // 书脊正面的延边.
    const expandingOverFrontcover = parameterMap.getIn([
      'spineExpanding',
      'expandingOverFrontcover'
    ]);
    const coverThickness = parameterMap.get('coverThickness');
    const coverType = setting.get('cover');

    if (ids && ids.size) {
      ids.forEach((id) => {
        const elementIndex = elementsArray.findIndex(
          ele => ele.get('id') === id
        );

        if (elementIndex !== -1) {
          const element = elementsArray.get(elementIndex);

          switch (element.get('type')) {
            case elementTypes.photo: {
              // const image = getImage(imageArray, element.get('encImgId'));
              // const imageInfo = {
              //   width: image ? image.get('width') : 0,
              //   height: image ? image.get('height') : 0
              // };
              // const templateId = element.get('templateId');

              // const newElement = updateElementByTemplate({
              //   page: fullPage,
              //   element,
              //   imageInfo,
              //   templateId,
              //   isCover: true,
              //   spinePage,
              //   expandingOverFrontcover,
              //   coverThickness,
              //   coverType
              // });

              // if (newElement) {
              //   const { x, y, px, py, pw, ph, templateId, width, height, cropLUX, cropLUY, cropRLX, cropRLY } = newElement;

              //   const mergedElement = merge({}, element.toJS(), { x, y, px, py, pw, ph, templateId, width, height, cropLUX, cropLUY, cropRLX, cropRLY });

              //   // const mergedElement = transformPhotoElement(Immutable.fromJS(newElement), imageArray, fullPage.get('width'), fullPage.get('height'), false);
              //   newElementsArray = newElementsArray.push(Immutable.fromJS(mergedElement));
              // }

              newElementsArray = newElementsArray.push(element);
              break;
            }
            case elementTypes.text: {
              // const {
              //   width,
              //   height,
              //   x,
              //   y,
              //   px,
              //   py,
              //   pw,
              //   ph,
              //   fontSize,
              //   textAlign,
              //   textVAlign
              // } = createCoverPageTextElement(
              //   fullPage,
              //   spinePage,
              //   null,
              //   expandingOverFrontcover
              // );
              //
              // const mergedElement = merge({}, element.toJS(), {
              //   width,
              //   height,
              //   x,
              //   y,
              //   px,
              //   py,
              //   pw,
              //   ph,
              //   fontSize,
              //   textAlign,
              //   textVAlign
              // });
              //
              // newElementsArray = newElementsArray.push(
              //   Immutable.fromJS(mergedElement)
              // );
              newElementsArray = newElementsArray.push(element);
              break;
            }
            default: {
              break;
            }
          }
        }
      });
    }

    // spine pages.
    const spineElements = spinePage.get('elements');
    if (spineElements && spineElements.size) {
      spineElements.forEach((id) => {
        const element = elementsArray.find(ele => ele.get('id') === id);
        if (element) {
          const {
            width,
            height,
            x,
            y,
            px,
            py,
            pw,
            ph,
            fontSize
          } = createSpineTextElement(spinePage, bookSetting);

          const newELement = element.merge({
            width,
            height,
            x,
            y,
            px,
            py,
            pw,
            ph,
            fontSize
          });
          newElementsArray = newElementsArray.push(newELement);
        }
      });
    }
  }

  return newElementsArray;
};

const transformTextElementArrayPosition = (
  transformedCover,
  elementsArray,
  parameterMap
) => {
  let newElementsArray = elementsArray;
  const containers = transformedCover.get('containers');
  const fullPage = containers.find(
    m => m.get('type') === pageTypes.full && m.getIn(['backend', 'isPrint'])
  );
  const spinePage = containers.find(m => m.get('type') === pageTypes.spine);

  if (fullPage && spinePage && newElementsArray && newElementsArray.size) {
    const ids = fullPage.get('elements');

    if (ids && ids.size) {
      ids.forEach((id) => {
        const elementIndex = newElementsArray.findIndex(
          ele => ele.get('id') === id
        );

        if (elementIndex !== -1) {
          const element = newElementsArray.get(elementIndex);

          if (element.get('type') === elementTypes.text) {
            // 书脊正面的延边.
            const expandingOverFrontcover = parameterMap.getIn([
              'spineExpanding',
              'expandingOverFrontcover'
            ]);

            const { x, y, px, py } = computedCoverTextPosition(
              fullPage,
              spinePage,
              expandingOverFrontcover
            );
            const newElement = element.merge({ x, y, px, py });

            newElementsArray = newElementsArray.setIn(
              [`${elementIndex}`],
              newElement
            );
          }
        }
      });
    }
  }

  return newElementsArray;
};

function transformCover(newCover, newParameterMap, transformedPageArray) {
  const currentSheetNumber = transformedPageArray.size / 2;
  const minSheetNumber = newParameterMap.getIn(['sheetNumberRange', 'min']);
  const addedSheetNumber = currentSheetNumber - minSheetNumber;

  const coverPageBleed = newParameterMap.get('coverPageBleed');

  const spineWidth = getSpineWidth(
    newParameterMap.get('spineWidth').toJS(),
    addedSheetNumber
  );
  // ) + coverPageBleed.get('left') + coverPageBleed.get('right');

  const newContainers = newCover.get('containers');
  const newSpineContainerIndex = newContainers.findIndex((container) => {
    return container.get('type') === pageTypes.spine;
  });

  return newCover.setIn(
    ['containers', String(newSpineContainerIndex), 'width'],
    spineWidth
  );
}

/**
 * 迁移老封面上的elements到新的封面上.
 * @param  {[type]} newCover [description]
 * @param  {[type]} oldCover [description]
 * @return {[type]}          [description]
 */
const transformCoverElements = (newCover, oldCover) => {
  let transformedCover = newCover;

  if (oldCover && oldCover.get('containers')) {
    oldCover.get('containers').forEach((container) => {
      const index = transformedCover
        .get('containers')
        .findIndex(c => c.get('type') === container.get('type'));
      if (index !== -1) {
        transformedCover = transformedCover.setIn(
          ['containers', `${index}`, 'elements'],
          container.get('elements')
        );

        // 设置template.
        transformedCover = transformedCover.setIn(
          ['containers', `${index}`, 'template'],
          container.get('template')
        );
      }
    });
  }

  return transformedCover;
};

const updatePageElementsFont = (state, page, elementArray, font) => {
  let newState = state;
  const elements = page.get('elements');
  if (elements && elements.size) {
    elements.forEach((elementId) => {
      const elementIndex = elementArray.findIndex(
        ele => ele.get('id') === elementId
      );
      if (elementIndex !== -1) {
        const element = elementArray.get(elementIndex);
        if (element && element.get('type') === elementTypes.text) {
          const fontSize = getPxByPt(font.fontSize) / page.get('height');

          const newElement = element.merge({
            fontColor: font.color,
            fontFamily: font.fontFamily,
            fontWeight: font.weight,
            fontSize
          });

          newState = newState.setIn(
            ['elementArray', String(elementIndex)],
            newElement
          );
        }
      }
    });
  }

  return newState;
};

function recalculateElementAttrs(elements, pageWidth, pageHeight) {
  return elements.map((element) => {
    const updateAttrs = {
      x: element.px * pageWidth,
      y: element.py * pageHeight
    };

    if (element.type !== elementTypes.photo) {
      updateAttrs.width = element.pw * pageWidth;
      updateAttrs.height = element.ph * pageHeight;
    } else {
      updateAttrs.pw = element.width / pageWidth;
      updateAttrs.ph = element.height / pageHeight;
    }

    return Object.assign({}, element, updateAttrs);
  });
}

export let configurableOptionArray = null;
export let disableOptionArray = null;
export let allOptionMap = null;
export let parameterArray = null;
export let variableArray = null;

const project = (state = initialState, action) => {
  switch (action.type) {
    case types.API_SUCCESS: {
      switch (action.apiPattern.name) {
        case apiUrl.GET_PROJECT_DATA: {
          const projectObj = action.response.project;
          const bookSetting = state.get('bookSetting');

          return state.merge(
            Immutable.fromJS({
              createdDate: new Date(projectObj.createdDate),

              // border frame的设置是后面才加上的, 为了兼容以前新建的项目.
              // 打开老项目时后, 合并默认的bookSetting设置.
              bookSetting: bookSetting.merge(projectObj.summary.editorSetting)
            })
          );
        }
        case apiUrl.GET_PROJECT_TITLE: {
          return state.merge({
            title: action.response.projectName
          });
        }
        case apiUrl.CHECK_PROJECT_INFO: {
          return state.merge({
            info: Immutable.fromJS(action.response)
          });
        }
        case apiUrl.DELETE_SERVER_PHOTOS: {
          return state.merge({
            deletedEncImgIds: []
          });
        }
        case apiUrl.MY_PHOTOS: {
          const data = JSON.parse(get(action, 'response.data'));
          const imageArray = state.get('imageArray');

          if (data && data.length) {
            // 去除id为空的images.
            const newData = data.filter(m => m.id);
            const newImageArray = imageArray.concat(Immutable.fromJS(convertObjIn(newData)));

            return state.merge({
              imageArray: newImageArray
            });
          }

          return state;
        }
        case apiUrl.GET_PROJECT_ORDERED_STATUS: {
          const { ordered, checkFailed } = get(action, 'response.resultData');

          return state.merge({
            orderStatus: Immutable.fromJS(
              convertObjIn({ ordered, checkFailed })
            )
          });
        }
        case apiUrl.NEW_PROJECT:
        case apiUrl.SAVE_PROJECT: {
          return state.merge({
            isProjectEdited: false
          });
        }
        default:
          return state;
      }
    }
    case types.GET_SPEC_DATA: {
      const specObj = action.response['product-spec'];

      configurableOptionArray = specParser.prepareConfigurableOptionMap(
        specObj
      );
      allOptionMap = specParser.prepareOptionGroup(specObj);
      parameterArray = specParser.prepareParameters(specObj);
      variableArray = specParser.prepareVariables(specObj);
      disableOptionArray = specParser.prepareDisableOptionMap(specObj);

      const currentSetting = state.get('setting').toJS();
      const projectId = state.get('projectId');

      // 如果打开已经存在的项目, 就不需要重新初始化project数据.
      if (projectId !== -1 || state.get('encProjectIdString')) {
        return state;
      }

      return state.merge(
        Immutable.fromJS(
          computeDataBySetting(
            configurableOptionArray,
            parameterArray,
            variableArray,
            {
              needDefaultSetting: true,
              currentSetting,
              bgColor: state.getIn(['bookSetting', 'background', 'color'])
            }
          )
        )
      );
    }
    case types.INIT_PROJECT_SETTING:
    case types.CHANGE_PROJECT_SETTING: {
      const newSetting = action.setting;
      const hasAffectedCoverSettingKeys = some(Object.keys(newSetting), (key) => {
        return affectedCoverSettingKeys.indexOf(key) !== -1;
      });

      if (!isEmpty(newSetting)) {
        const currentSetting = state.get('setting').toJS();

        const oldProduct = state.getIn(['setting', 'product']);

        const result = Immutable.fromJS(
          computeDataBySetting(
            configurableOptionArray,
            parameterArray,
            variableArray,
            {
              needDefaultSetting: false,
              bgColor: state.getIn(['bookSetting', 'background', 'color']),
              currentSetting,
              newSetting
            }
          )
        );

        if (
          newSetting.size ||
          newSetting.product ||
          newSetting.paperThickness
        ) {
          if (action.type === types.CHANGE_PROJECT_SETTING) {
            const pageArray = state.get('pageArray');
            const elementArray = state.get('elementArray');
            const imageArray = state.get('imageArray');
            const variableMap = result.get('variableMap');

            const transformedPageArray = transformPageArray(
              pageArray,
              result.get('pageArray'),
              result.get('parameterMap')
            );

            const transformedCover = transformCover(
              result.get('cover'),
              result.get('parameterMap'),
              transformedPageArray
            );

            // 把老的elements迁移到新的cover上.
            // 保留cover上的元素.
            const newTransformedCover = transformCoverElements(
              transformedCover,
              state.get('cover')
            );

            // 迁移page的elements.
            let transformedElementArray = transformElementArray(
              elementArray,
              transformedPageArray,
              imageArray
            );

            // 迁移cover上的elements.
            transformedElementArray = transformedElementArray.concat(
              transformCoverElementArray(
                elementArray,
                newTransformedCover.get('containers'),
                imageArray,
                result.get('parameterMap'),
                Immutable.fromJS(newSetting),
                state.get('bookSetting').toJS()
              )
            );

            // 更新text的颜色.
            transformedElementArray = transformElementArrayColor(
              transformedElementArray,
              variableMap.get('coverForegroundColor')
            );

            // 更新封面text的x,y等信息.
            // transformedElementArray = transformTextElementArrayPosition(newTransformedCover, transformedElementArray, result.get('parameterMap'));

            return state.merge(
              result,
              Immutable.fromJS({
                cover: newTransformedCover,
                pageArray: transformedPageArray,
                elementArray: transformedElementArray,
                imageUsedCountMap: getImageUsedCountMap(transformedElementArray)
              })
            );
          }

          // 初始化服务器获取的setting数据时，不渲染cover数据
          return state.merge({
            setting: result.get('setting'),
            pageArray: result.get('pageArray'),
            variableMap: result.get('variableMap'),
            parameterMap: result.get('parameterMap')
          });
        }

        return state.merge({
          setting: result.get('setting'),
          variableMap: result.get('variableMap'),
          parameterMap: result.get('parameterMap')
        });
      }

      return state;
    }
    case types.INIT_COVER: {
      const { cover, addedSheetNumber } = action;

      const newCover = generateCover(
        state.getIn(['setting', 'cover']),
        state.get('parameterMap').toJS(),
        state.get('variableMap').toJS(),
        addedSheetNumber
      );

      const overwriteCoverObj = pick(newCover, [
        'width',
        'height',
        'bleed',
        'bgColor',
        'bgImageUrl'
      ]);

      const newFullContainer = newCover.containers.find((container) => {
        return container.type === 'Full';
      });
      const newSpineContainer = newCover.containers.find((container) => {
        return container.type === pageTypes.spine;
      });

      const mergedCover = merge(
        {},
        convertObjIn(cover, ['text']),
        overwriteCoverObj
      );

      const newContainers = [];
      let newElementArray = [];
      mergedCover.containers.forEach((container) => {
        const fixedElements = addElementIdIfHasNoId(container.elements);
        let mergedElements = fixedElements.map((element) => {
          if (element.type === elementTypes.photo) {
            return merge({}, { border: defaultBookSetting.border }, element);
          }

          return element;
        });

        const detachedContainer = merge({}, container, {
          elements: mergedElements.map(e => e.id)
        });

        let overwriteContainerObj = {};

        switch (detachedContainer.type) {
          case pageTypes.full: {
            overwriteContainerObj = pick(newFullContainer, [
              'width',
              'height',
              'bleed'
            ]);
            break;
          }
          case pageTypes.spine: {
            overwriteContainerObj = pick(newSpineContainer, [
              'width',
              'height',
              'bleed'
            ]);
            break;
          }
          default:
        }

        const newContainer = merge(
          {},
          detachedContainer,
          overwriteContainerObj
        );
        newContainers.push(newContainer);

        mergedElements = recalculateElementAttrs(
          mergedElements,
          newContainer.width,
          newContainer.height
        );

        newElementArray = newElementArray.concat(mergedElements);
      });

      mergedCover.containers = newContainers;

      return state.merge({
        cover: mergedCover,
        elementArray: Immutable.fromJS(newElementArray)
      });
    }
    case types.INIT_PAGE_ARRAY: {
      const { pages } = action;
      const elementArray = state.get('elementArray');
      const setting = state.get('setting');

      const newPageArray = generatePageArray(
        setting.get('product'),
        state.get('parameterMap').toJS()
      );

      const detachedPageArray = [];
      let newElements = [];
      pages.forEach((page, index) => {
        const fixedElements = addElementIdIfHasNoId(page.elements);
        let mergedElements = fixedElements.map((element) => {
          if (element.type === elementTypes.photo) {
            return merge({}, { border: defaultBookSetting.border }, element);
          }

          return element;
        });

        const overwritePageObj = pick(newPageArray[index], [
          'width',
          'height',
          'bleed'
        ]);
        const detachedPage = merge(
          {},
          page,
          {
            elements: mergedElements.map(e => e.id)
          },
          overwritePageObj
        );

        mergedElements = recalculateElementAttrs(
          mergedElements,
          detachedPage.width,
          detachedPage.height
        );

        newElements = newElements.concat(mergedElements);

        detachedPageArray.push(detachedPage);
      });

      const newElementArray = elementArray.concat(
        Immutable.fromJS(newElements)
      );

      // 修复bug: ASH-3410 - 【book 2.0】加页后最后一页不出图，isPrint属性为False
      let newPages = convertObjIn(detachedPageArray).concat(
        newPageArray.slice(pages.length)
      );
      const isPressBook = setting.get('product') === productTypes.PS;

      if (newPages.length !== detachedPageArray.length && isPressBook) {
        newPages = newPages.map((p, index) => {
          if (index === 0 || index === newPages.length - 1) {
            p.backend.isPrint = false;
          } else {
            p.backend.isPrint = true;
          }
          return p;
        });
      }

      return state.merge({
        pageArray: Immutable.fromJS(newPages),
        elementArray: newElementArray,
        imageUsedCountMap: getImageUsedCountMap(newElementArray),
        decorationUsedCountMap: getDecorationUsedCountMap(newElementArray)
      });
    }
    case types.INIT_IMAGE_ARRAY: {
      const { images } = action;
      let imageArray = Immutable.fromJS(convertObjIn(images));

      // 给所有图片加一个orientation字段如果没有的话.
      imageArray = imageArray.map((m) => {
        if (!m.get('orientation')) {
          return m.set('orientation', 0);
        }

        return m;
      });

      return state.merge({ imageArray });
    }
    case types.INIT_DECORATION_ARRAY: {
      const { decorations } = action;

      return state.merge({
        decorationArray: Immutable.fromJS(convertObjIn(decorations))
      });
    }
    case types.PROJECT_LOAD_COMPLETED: {
      return state.merge({
        isProjectLoadCompleted: true,
        isProjectEdited: false
      });
    }
    case types.AUTO_SAVE_PROJECT: {
      const { isAutoSaveProject } = action;
      return state.merge({ isAutoSaveProject });
    }
    case types.UPLOAD_COMPLETE: {
      const imageArray = state.get('imageArray');
      const { fields } = action;
      const imageObj = {
        id: fields.imageId,
        guid: fields.guid,
        encImgId: fields.encImgId,
        name: fields.name,
        height: fields.height,
        width: fields.width,
        uploadTime: fields.uploadTime,
        order: imageArray.size,
        shotTime: fields.shotTime,
        orientation: fields.orientation,
        thirdpartyImageId: fields.thirdpartyImageId || null
      };

      return state.merge({
        imageArray: imageArray.push(Immutable.Map(convertObjIn(imageObj)))
      });
    }
    case types.DELETE_PROJECT_IMAGE: {
      const imageArray = state.get('imageArray');
      const { encImgId } = action;
      const currentImageIndex = imageArray.findIndex((o) => {
        return o.get('encImgId') === encImgId;
      });
      let newDeletedEncImgIds = state.get('deletedEncImgIds');
      newDeletedEncImgIds = newDeletedEncImgIds.push(encImgId);
      const newState = state.deleteIn(['imageArray', String(currentImageIndex)]);
      return newState.merge({
        deletedEncImgIds: newDeletedEncImgIds
      });
    }
    case types.CREATE_CONTAINER: {
      const { containerType, width, height, bleed } = action;
      const newContainer = Immutable.Map(
        generateContainer(containerType, width, height, bleed)
      );

      const containers = state.getIn(containersPathArr);

      return state.setIn(containersPathArr, containers.push(newContainer));
    }
    case types.DELETE_CONTAINER: {
      const { containerId } = action;
      const containers = state.getIn(containersPathArr);
      const elementArray = state.get('elementArray');
      const willDeleteContainerIndex = containers.findIndex((container) => {
        return container.get('id') === containerId;
      });
      const willDeleteContainer = containers.get(willDeleteContainerIndex);
      const willDeleteElementIds = willDeleteContainer.get('elements');

      const newElementArray = elementArray.filter((element) => {
        return willDeleteElementIds.indexOf(element.get('id')) === -1;
      });

      let newState = state.setIn(
        containersPathArr,
        containers.delete(willDeleteContainerIndex)
      );
      newState = newState.set('elementArray', newElementArray);
      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.CREATE_DUAL_PAGE:
    case types.CREATE_MULTIPLE_DUAL_PAGE: {
      const { insertIndex, n } = action;

      let newState = state;
      const parameterMapObj = state.get('parameterMap').toJS();
      const product = state.getIn(['setting', 'product']);
      const bgColor = state.getIn(['bookSetting', 'background', 'color']);

      const isPressBook = product === productTypes.PS;

      for (let i = 0; i < n; i += 1) {
        const pageArray = newState.get('pageArray');

        const length = pageArray.size;

        let leftPage = null;
        let rightPage = null;

        if (isPressBook) {
          leftPage = generatePage(product, parameterMapObj, length, bgColor);
          rightPage = generatePage(
            product,
            parameterMapObj,
            length + 1,
            bgColor
          );
        } else {
          leftPage = generateSheet(parameterMapObj, length, bgColor);
          rightPage = generatePage(
            product,
            parameterMapObj,
            length + 1,
            bgColor
          );
          rightPage.backend.isPrint = false;
        }

        let newPageArray;
        // PressBook不能插入到最后
        let index = isPressBook ? length - 2 : length;
        if (isNumber(insertIndex)) {
          index = insertIndex;
        }
        newPageArray = pageArray.insert(index, Immutable.fromJS(leftPage));
        newPageArray = newPageArray.insert(
          index + 1,
          Immutable.fromJS(rightPage)
        );

        newState = newState.set('pageArray', newPageArray);
        newState = updateSpineContainerWidth(newState, 'add');
      }

      return newState;
    }
    case types.DELETE_DUAL_PAGE:
    case types.DELETE_MULTIPLE_DUAL_PAGE: {
      const dualPageIdList = Immutable.fromJS(action.dualPageIdList);

      const pageArray = state.get('pageArray');

      let willDeleteElementIds = Immutable.List();
      let newState = state;
      let newPageArray = pageArray;

      dualPageIdList.forEach((dualPageIdObj) => {
        const leftPageId = dualPageIdObj.get('leftPageId');
        const rightPageId = dualPageIdObj.get('rightPageId');

        let willDeleteLeftPage = null;
        let willDeleteRightPage = null;

        newPageArray.forEach((page) => {
          const pageId = page.get('id');
          if (pageId === leftPageId) {
            willDeleteLeftPage = page;
          }

          if (pageId === rightPageId) {
            willDeleteRightPage = page;
          }
        });

        willDeleteElementIds = willDeleteElementIds.concat(
          willDeleteLeftPage.get('elements')
        );
        willDeleteElementIds = willDeleteElementIds.concat(
          willDeleteRightPage.get('elements')
        );

        newPageArray = newPageArray.filter((page) => {
          const pageId = page.get('id');
          return pageId !== leftPageId && pageId !== rightPageId;
        });

        newState = newState.set('pageArray', newPageArray);
        newState = updateSpineContainerWidth(newState, 'subtract');
      });

      const elementArray = newState.get('elementArray');

      const newElementArray = elementArray.filter((element) => {
        return willDeleteElementIds.indexOf(element.get('id')) === -1;
      });
      newState = newState.set('elementArray', newElementArray);
      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.CREATE_ELEMENT:
    case types.CREATE_ELEMENT_WITHOUT_UNDO:
    case types.CREATE_ELEMENTS:
    case types.CREATE_ELEMENTS_WITHOUT_UNDO: {
      const containers = state.getIn(containersPathArr);
      const pageArray = state.get('pageArray');
      const elementArray = state.get('elementArray');
      const { pageId } = action;

      const elements = Immutable.fromJS(action.elements || [action.element]);

      const elementIdArray = elements.map((element) => {
        return element.get('id');
      });

      const containerIndex = containers.findIndex((container) => {
        return container.get('id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return page.get('id') === pageId;
      });

      const newElementArray = elementArray.concat(elements);
      let newState = null;
      if (containerIndex !== -1) {
        const oldElements = state.getIn(
          containersPathArr.concat([String(containerIndex), 'elements'])
        );
        newState = state.setIn(
          containersPathArr.concat([String(containerIndex), 'elements']),
          oldElements.concat(elementIdArray)
        );

        // 添加新元素时, 情况模板信息.
        newState = newState.setIn(
          containersPathArr.concat([
            String(containerIndex),
            'template',
            'tplGuid'
          ]),
          ''
        );
      } else if (pageIndex !== -1) {
        const oldElements = state.getIn([
          'pageArray',
          String(pageIndex),
          'elements'
        ]);

        newState = state.setIn(
          ['pageArray', String(pageIndex), 'elements'],
          oldElements.concat(elementIdArray)
        );

        // 添加新元素时, 情况模板信息.
        newState = newState.setIn(
          ['pageArray', String(pageIndex), 'template', 'tplGuid'],
          ''
        );
      }

      newState = newState.set('elementArray', newElementArray);

      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.DELETE_ELEMENT:
    case types.DELETE_ELEMENTS: {
      const { pageId } = action;
      const elementIds = action.elementIds || [action.elementId];

      const containers = state.getIn(containersPathArr);
      const pageArray = state.get('pageArray');
      const elementArray = state.get('elementArray');

      const containerIndex = containers.findIndex((container) => {
        return container.get('id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return page.get('id') === pageId;
      });

      let newState = state;
      if (containerIndex !== -1) {
        const oldElements = newState.getIn(
          containersPathArr.concat([String(containerIndex), 'elements'])
        );
        newState = newState.setIn(
          containersPathArr.concat([String(containerIndex), 'elements']),
          oldElements.filter(id => elementIds.indexOf(id) === -1)
        );

        // 清空模板信息.
        newState = newState.setIn(
          containersPathArr.concat([
            String(containerIndex),
            'template',
            'tplGuid'
          ]),
          ''
        );
      } else if (pageIndex !== -1) {
        const oldElements = newState.getIn([
          'pageArray',
          String(pageIndex),
          'elements'
        ]);
        newState = newState.setIn(
          ['pageArray', String(pageIndex), 'elements'],
          oldElements.filter(id => elementIds.indexOf(id) === -1)
        );

        // 清空模板信息.
        newState = newState.setIn(
          ['pageArray', String(pageIndex), 'template', 'tplGuid'],
          ''
        );
      }

      const newElementArray = elementArray.filter((element) => {
        return elementIds.indexOf(element.get('id')) === -1;
      });

      newState = newState.set('elementArray', newElementArray);

      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.DELETE_ALL: {
      const containers = state.getIn(containersPathArr);
      const pageArray = state.get('pageArray');
      const elementArray = state.get('elementArray');

      const typeList = [
        elementTypes.photo,
        elementTypes.text,
        elementTypes.decoration,
        elementTypes.paintedText
      ];

      const setting = state.get('setting');
      const product = setting.get('product');
      const cover = setting.get('cover');

      const needCameoCoverTypes = [coverTypes.PSNC, coverTypes.PSLC];

      if (
        product !== productTypes.PS ||
        needCameoCoverTypes.indexOf(cover) === -1
      ) {
        typeList.push(elementTypes.cameo);
      }

      let newElementArray = elementArray.filter((element) => {
        return typeList.indexOf(element.get('type')) === -1;
      });

      // 如果存在cameo Element，清空图片信息
      const cameoIndex = newElementArray.findIndex((element) => {
        return element.get('type') === elementTypes.cameo;
      });

      if (cameoIndex >= 0) {
        const cameoElement = newElementArray.get(cameoIndex);
        const newCameoElement = cameoElement.merge({
          encImgId: ''
        });
        newElementArray = newElementArray.setIn([cameoIndex], newCameoElement);
      }

      const newElementIds = newElementArray.map(element => element.get('id'));

      let newState = state;
      containers.forEach((container, index) => {
        const oldElements = newState.getIn(
          containersPathArr.concat([String(index), 'elements'])
        );
        newState = newState.setIn(
          containersPathArr.concat([String(index), 'elements']),
          oldElements.filter((id) => {
            return newElementIds.indexOf(id) !== -1;
          })
        );

        // 清空模板信息.
        newState = newState.setIn(
          containersPathArr.concat([String(index), 'template', 'tplGuid']),
          ''
        );
      });

      pageArray.forEach((page, index) => {
        const oldElements = newState.getIn([
          'pageArray',
          String(index),
          'elements'
        ]);

        newState = newState.setIn(
          ['pageArray', String(index), 'elements'],
          oldElements.filter((id) => {
            return newElementIds.indexOf(id) !== -1;
          })
        );

        // 清空模板信息.
        newState = newState.setIn(
          ['pageArray', String(index), 'template', 'tplGuid'],
          ''
        );
      });

      newState = newState.set('elementArray', newElementArray);
      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );
      return newState;
    }
    case types.UPDATE_ELEMENT:
    case types.UPDATE_ELEMENTS: {
      const elements = Immutable.fromJS(action.elements || [action.element]);

      const elementArray = state.get('elementArray');
      let newElementArray = Immutable.List();

      elementArray.forEach((element) => {
        const eId = element.get('id');
        const theElement = elements.find(e => e.get('id') === eId);
        if (theElement) {
          newElementArray = newElementArray.push(
            element.merge(theElement, {
              lastModified: Date.now()
            })
          );
        } else {
          newElementArray = newElementArray.push(element);
        }
      });

      let newState = state.set('elementArray', newElementArray);
      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.CHANGE_BOOK_SETTING: {
      const { bookSetting, fontList } = action;
      let newState = state.set(
        'bookSetting',
        state.get('bookSetting').merge(bookSetting)
      );

      // 获取新的背景色.
      const backgroundColor = get(bookSetting, 'background.color');

      // 获取自动应用全局的背景色开关的值.
      const isApplyBackground = get(bookSetting, 'applyBackground');

      if (backgroundColor && isApplyBackground) {
        const pageArray = newState.get('pageArray');
        pageArray.forEach((page, index) => {
          newState = newState.setIn(
            ['pageArray', String(index), 'bgColor'],
            backgroundColor
          );
        });

        const containers = newState.getIn(containersPathArr);

        containers.forEach((container, index) => {
          newState = newState.setIn(
            containersPathArr.concat([String(index), 'bgColor']),
            backgroundColor
          );
        });
      }

      // 获取自动应用全局的边框设置开关的值.
      const isApplyBorderFrame = get(bookSetting, 'applyBorderFrame');

      // 获取全局的边框信息.
      const border = get(bookSetting, 'border');

      // 如果自动应用全局的边框设置开关设置为true.
      // 就更新所有page下的所有图片框的border设置.
      if (isApplyBorderFrame) {
        const elementArray = newState.get('elementArray');

        elementArray.forEach((element, index) => {
          if (element.get('type') === elementTypes.photo) {
            newState = newState.setIn(
              ['elementArray', String(index), 'border'],
              Immutable.fromJS(border)
            );
          }
        });
      }

      // 是否使用默认的全局字体设置.
      const isApplyFont = get(bookSetting, 'applyFont');
      const font = get(bookSetting, 'font');

      if (isApplyFont) {
        const elementArray = newState.get('elementArray');

        // 在fontlist中, 根据font id查找对应的font wight.
        let fontItem;
        const fontFamilyItem = fontList.find(
          item => item.id === font.fontFamilyId
        );
        if (fontFamilyItem && fontFamilyItem.font) {
          fontItem = fontFamilyItem.font.find(item => item.id === font.fontId);
        }

        const fontObj = merge({}, font, {
          weight: fontItem ? fontItem.weight : 'normal',
          fontFamily: fontItem ? fontItem.fontFamily : 'roboto'
        });

        // 更新所有page下的所有text elements.
        // text elements中的fontsize保存的是相对于page高的百分比.
        const pageArray = newState.get('pageArray');
        pageArray.forEach((page) => {
          newState = updatePageElementsFont(
            newState,
            page,
            elementArray,
            fontObj
          );
        });

        // 更新cover下的所有text elements.
        const containers = newState.getIn(containersPathArr);
        containers.forEach((page, index) => {
          newState = updatePageElementsFont(
            newState,
            page,
            elementArray,
            fontObj
          );
        });
      }

      return newState;
    }
    case types.APPLY_TEMPLATE_TO_PAGES:
    case types.APPLY_TEMPLATE_WITHOUT_UNDOABLE:
    case types.APPLY_TEMPLATE: {
      const { templateDataArray } = action;

      let newState = state;

      templateDataArray.forEach((templateData) => {
        const elements = templateData.get('elements');
        const pageId = templateData.get('pageId');
        const templateId = templateData.get('templateId');

        const containers = newState.getIn(containersPathArr);
        const pageArray = newState.get('pageArray');
        const elementArray = newState.get('elementArray');

        const containerIndex = containers.findIndex((container) => {
          return container.get('id') === pageId;
        });
        const pageIndex = pageArray.findIndex((page) => {
          return page.get('id') === pageId;
        });

        let oldElementIds = null;
        if (containerIndex !== -1) {
          newState = newState.setIn(
            containersPathArr.concat([
              String(containerIndex),
              'template',
              'tplGuid'
            ]),
            templateId
          );
          oldElementIds = newState.getIn(
            containersPathArr.concat([String(containerIndex), 'elements'])
          );
          newState = newState.setIn(
            containersPathArr.concat([String(containerIndex), 'elements']),
            elements.map(element => element.get('id'))
          );
        } else if (pageIndex !== -1) {
          newState = newState.setIn(
            ['pageArray', String(pageIndex), 'template', 'tplGuid'],
            templateId
          );
          oldElementIds = newState.getIn([
            'pageArray',
            String(pageIndex),
            'elements'
          ]);
          newState = newState.setIn(
            ['pageArray', String(pageIndex), 'elements'],
            elements.map(element => element.get('id'))
          );
        }

        let newElementArray = elementArray.filter((element) => {
          return oldElementIds.indexOf(element.get('id')) === -1;
        });

        newElementArray = newElementArray.concat(elements);

        newState = newState.set('elementArray', newElementArray);
      });

      const newElementArray = newState.get('elementArray');

      newState = newState.set(
        'imageUsedCountMap',
        getImageUsedCountMap(newElementArray)
      );
      newState = newState.set(
        'decorationUsedCountMap',
        getDecorationUsedCountMap(newElementArray)
      );

      return newState;
    }
    case types.CHANGE_PAGE_BGCOLOR: {
      const pageId = action.pageId;

      let newState = state;

      // 根据pageid查找对应的page.
      const containers = newState.getIn(containersPathArr);
      const pageArray = newState.get('pageArray');
      const containerIndex = containers.findIndex((container) => {
        return container.get('id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return page.get('id') === pageId;
      });

      const bgColor = action.bgColor;
      if (containerIndex !== -1) {
        containers.forEach((container, index) => {
          newState = newState.setIn(
            containersPathArr.concat([String(index), 'bgColor']),
            bgColor
          );
        });
      } else if (pageIndex !== -1) {
        newState = newState.setIn(
          ['pageArray', String(pageIndex), 'bgColor'],
          bgColor
        );
      }
      return newState;
    }
    case types.UPDATE_PAGE_TEMPLATE_ID: {
      const pageId = action.pageId;
      const templateId = action.templateId;

      let newState = state;

      // 根据pageid查找对应的page.
      const containers = newState.getIn(containersPathArr);
      const pageArray = newState.get('pageArray');
      const containerIndex = containers.findIndex((container) => {
        return container.get('id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return page.get('id') === pageId;
      });

      if (containerIndex !== -1) {
        containers.forEach((container, index) => {
          newState = newState.setIn(
            containersPathArr.concat([String(index), 'template', 'tplGuid']),
            templateId
          );
        });
      } else if (pageIndex !== -1) {
        newState = newState.setIn(
          ['pageArray', String(pageIndex), 'template', 'tplGuid'],
          templateId
        );
      }
      return newState;
    }
    case types.MOVE_PAGE_BEFORE: {
      const { pageId, beforePageId } = action;
      const pageArray = state.get('pageArray');

      let pageIndex = -1;
      let beforePageIndex = -1;

      pageArray.forEach((page, index) => {
        const pId = page.get('id');
        if (pId === pageId) {
          pageIndex = index;
        }

        if (pId === beforePageId) {
          beforePageIndex = index;
        }
      });

      const thePage = pageArray.get(pageIndex);
      let newPageArray = pageArray;

      const isPressBook = Boolean(thePage.get('type') !== pageTypes.sheet);

      if (beforePageIndex > pageIndex) {
        beforePageIndex -= isPressBook ? 1 : 2;
      }

      if (
        pageIndex !== -1 &&
        beforePageIndex !== -1 &&
        pageIndex !== beforePageIndex
      ) {
        if (!isPressBook) {
          const blankPageIndex = pageIndex + 1;
          const blankPage = pageArray.get(pageIndex + 1);

          newPageArray = newPageArray.filter((page, index) => {
            return index !== pageIndex && index !== blankPageIndex;
          });

          newPageArray = newPageArray
            .slice(0, beforePageIndex)
            .concat(Immutable.List([thePage, blankPage]))
            .concat(newPageArray.slice(beforePageIndex));
        } else {
          newPageArray = newPageArray.delete(pageIndex);

          newPageArray = newPageArray
            .slice(0, 1)
            .concat(newPageArray.slice(1, beforePageIndex))
            .concat(Immutable.List([thePage]))
            .concat(newPageArray.slice(beforePageIndex));
        }

        return state.set('pageArray', newPageArray);
      }

      return state;
    }
    case types.UPDATE_PROJECT_ID: {
      securityString.encProjectId = action.projectId;
      return state.merge({
        projectId: action.projectId
      });
    }
    case types.CHANGE_PROJECT_TITLE: {
      return state.merge({
        title: action.title
      });
    }
    case types.RESET_PROJECT_INFO: {
      return state.merge(
        Immutable.fromJS({
          info: {
            cart: 0,
            order: 0
          }
        })
      );
    }
    case types.RESET_PROJECT_ORDERED_STATUS: {
      return state.merge({
        orderStatus: Immutable.fromJS({
          ordered: false,
          checkFailed: false
        })
      });
    }
    default:
      return state;
  }
};

// 允许加到redo/undo里的action类型有.
const includeActionTypes = [
  // 创建绘图元素
  types.CREATE_ELEMENT,
  types.CREATE_ELEMENTS,

  // 更新绘图元素的属性
  types.UPDATE_ELEMENT,
  types.UPDATE_ELEMENTS,

  // 删除元素
  types.DELETE_ELEMENT,
  types.DELETE_ELEMENTS,
  types.DELETE_ALL,

  // 应用模板.
  // types.APPLY_TEMPLATE_TO_PAGES,
  types.APPLY_TEMPLATE,

  // 更新page背景色
  types.CHANGE_PAGE_BGCOLOR
];

const undoableProject = undoable(project, {
  filter: includeActionTypes,

  // 允许撤销10步, 第一步不会添加到history中.
  limit: 10
});

export default undoableProject;
