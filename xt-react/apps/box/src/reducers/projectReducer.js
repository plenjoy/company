import qs from 'qs';
import securityString from '../../../common/utils/securityString';
import {
  merge,
  get,
  set,
  pick,
  forEach,
  isEmpty,
  findIndex,
  isArray,
  isUndefined,
  isObject,
  some
} from 'lodash';
import {
  API_SUCCESS,
  CHANGE_PROJECT_SETTING,
  INIT_PROJECT_SETTING,
  INIT_IMAGE_ARRAY,
  INIT_IMAGE_USED_COUNT_MAP,
  UPDATE_IMAGE_USED_COUNT_MAP,
  CREATE_ELEMENT,
  UPDATE_ELEMENT,
  SELECT_ELEMENT,
  DELETE_ELEMENT,
  CLEAR_ELEMENT_SELECT,
  UPDATE_CONTAINER,
  UPLOAD_COMPLETE,
  DELETE_PROJECT_IMAGE,
  PROJECT_LOAD_COMPLETED,
  SET_PROJECT_ORDERED_STATE,
  CHANGE_PROJECT_TITLE,
  INIT_COVER,
  INIT_PAGE_ARRAY,
  ROTATE_COVER,
  INIT_COVER_ROTATE,
  UPDATE_PROJECT_ID
} from '../contants/actionTypes';
import {
  GET_PROJECT_DATA,
  GET_SPEC_DATA,
  NEW_PROJECT,
  SAVE_PROJECT,
  GET_MY_PHOTO_IMAGES
} from '../contants/apiUrl';

import { getCropOptions } from '../utils/crop';
import { checkIsSupportPaintedTextInCover } from '../utils/cover';
import { getPxByInch, guid, getPxByPt } from '../../common/utils/math';
import {
  generateSpreadArray,
  generateSpread,
  generatePageArray,
  generateCover,
  generateInner
} from '../../src/utils/projectGenerator';
import { convertObjIn } from '../../common/utils/typeConverter';
import projectParser from '../../common/utils/projectParser';
import specParser from '../../common/utils/specParser';

import {
  elementTypes,
  pageTypes,
  AUTO_DELETE_PAGE,
  panelTypes
} from '../contants/strings';

// 从url附加的参数信息中获取用户project的一些初始属性
const queryStringObj = qs.parse(window.location.search.substr(1));
const settingObj = pick(
  queryStringObj, [
    'product', 'size', 'type', 'cover',
    'leatherColor', 'spineThickness', 'finish', 'dvdType',
    'dvdPrinted', 'usbCapacities', 'paper'
  ]
);

settingObj.spineThickness = queryStringObj.spine;

if(queryStringObj.isPreview) {
  settingObj.product = settingObj.product ? settingObj.product : 'IB';
}


const initGuid = queryStringObj.initGuid;

if(initGuid){
  securityString.encProjectId = initGuid
}

const initialState = {
  projectId: +initGuid || -1,
  encProjectIdString: +initGuid ? '' : (initGuid || ''),
  title: queryStringObj.title || '',
  setting: settingObj,
  inner: {},
  cover: {},
  pageArray: [],
  elementArray: [],
  spreadArray: [],
  imageArray: [],
  imageUsedCountMap: {},
  deletedEncImgIds: [],
  isProjectLoadCompleted: false,
  isProjectEdited: false,
  createdDate: new Date(),
  orderState: {},
  isSpecLoaded: false
};

const affectedDrawSettingKeys = ['size', 'type'];

const convertParametersUnit = (parameterMap) => {
  if (isEmpty(parameterMap))return null;
  const { baseSize, innerBaseSize } = parameterMap;
  const outObj = merge({}, parameterMap);
  outObj.baseSize = {
    height: getPxByInch(baseSize.heightInInch),
    width: getPxByInch(baseSize.widthInInch)
  };
  outObj.innerBaseSize = {
    height: getPxByInch(innerBaseSize.heightInInch),
    width: getPxByInch(innerBaseSize.widthInInch)
  };
  return outObj;
};

const addElementIdIfHasNoId = (elements, imageArray) => {
  const outArray = [];
  elements.forEach((element) => {
    if (element) {
      if (!element.id) {
        element = merge({}, element, { id: guid() })
      }

      if(!element.encImgId) {
        const image = imageArray.find(image => {
          return String(image.id) === element.imageid
        }) || {};
        element.encImgId = image.encImgId;
      }

      outArray.push(element);
    }
  });
  return outArray;
};

const convertElements = (elements) => {
  const xmlTextKey = '__text';
  const outArray = [];
  elements.forEach((element) => {
    let outElement = merge({}, element);
    if (element[xmlTextKey]) {
      outElement = merge(outElement, {
        text: element[xmlTextKey]
      });
    }

    delete outElement[xmlTextKey];
    delete outElement.toString;

    outArray.push(outElement);
  });

  return outArray;
};

const convertSpreads = (spreads, parameterMap, imageArray) => {
  const outArray = [];
  const spreadArray = isArray(spreads.spread)
    ? [...spreads.spread]
    : [spreads.spread];

  spreadArray.forEach((spread) => {
    const newSpread = generateSpread(
      spread.type,
      parameterMap,
      spread.pageNumber
    );
    const overwriteSpreadObj = pick(
      newSpread,
      [
        'w', 'h', 'bleedTop', 'bleedBottom', 'bleedLeft', 'bleedRight',
        'spineThicknessWidth', 'wrapSize'
      ]
    );
    const mergedSpread = merge({}, spread, overwriteSpreadObj);

    const outObj = {};
    forEach(mergedSpread, (value, key) => {
      if (key === 'elements') {
        const { element } = value;
        const elements = isArray(element) ? [...element] : [element];
        outObj.elements = addElementIdIfHasNoId(convertElements(elements), imageArray);
      } else {
        outObj[key] = value;
      }
    });
    outArray.push(outObj);
  });

  return outArray;
};

function computeDataBySetting(
  configurableOptionArray,
  parameterArray,
  variableArray,
  { needDefaultSetting,
    currentSetting,
    newSetting,
    bgColor,
    prevCover,
    prevPageArray,
    prevElementArray,
    imageArray,
    isRotate,
    shouldBeDefaultCrop
  }) {
  let setting = null;
  let shouldCoverDefaultCrop = false;
  let shouldInnerDefaultCrop = false;

  if (needDefaultSetting) {
    setting = projectParser.getDefaultProjectSetting(
      currentSetting, configurableOptionArray
    );
  } else {
    setting = projectParser.getNewProjectSetting(
      currentSetting,
      newSetting,
      configurableOptionArray
    );
  }

  const parameterMap = projectParser.getParameters(
    setting,
    parameterArray
  );

  const convertedParameterMap = convertParametersUnit(parameterMap);

  const variableMap = projectParser.getVariables(
    setting,
    variableArray
  );

  const newCover = generateCover(
    setting,
    convertedParameterMap,
    variableMap,
    isRotate
  );

  const newPageArray = generatePageArray(
    setting, convertedParameterMap, variableMap
  );

  const inner = generateInner(
    setting,
    convertedParameterMap,
    variableMap,
    newPageArray
  );

  if(currentSetting.size !== setting.size ||
      currentSetting.product !== setting.product ||
      shouldBeDefaultCrop
  ) {
    shouldCoverDefaultCrop = true;
    shouldInnerDefaultCrop = true;
  }

  if(currentSetting.dvdType !== setting.dvdType) {
    shouldInnerDefaultCrop = true;
  }

  if(setting.dvdType === 'two') {
    setting.cameoShape = 'Box_Rect';
  }

  const {cover, elementArray: coverElementArray} = mergeOldCoverToNew(prevCover, newCover, prevElementArray, imageArray, setting, shouldCoverDefaultCrop);
  const {pageArray, elementArray: pageElementArray} = mergeOldPageToNew(prevPageArray, newPageArray, prevElementArray, imageArray, setting, shouldInnerDefaultCrop);

  return {
    setting,
    cover,
    inner,
    pageArray,
    variableMap,
    variableArray,
    parameterArray,
    configurableOptionArray,
    parameterMap: convertedParameterMap,
    elementArray: [...coverElementArray, ...pageElementArray]
  };
}

function mergeOldPageToNew(prevPageArray = [], newPageArray = [], prevElementArray = [], imageArray = [], setting, shouldDefaultCrop) {
  let newElementArray = [];
  const LEFT = 0;
  const RIGHT = 1;

  // 遍历迁移所有的pages元素
  newPageArray = newPageArray.map((newPage, index) => {
    // 检查当前page是否左页
    // 如果是左页，拿取原来pageArray里面的左页
    // 如果是右页，拿取原来pageArray里面的右页
    const isLeftPage = !(index % 2);
    const oldPage = prevPageArray.find(oldPage => oldPage.position === (isLeftPage ? 'left' : 'right'));

    // 如果是左页，检查setting的type是否是BL或者BP，或者是双片无dvd产品
    // 如果是，则返回null为空，删除page
    if(
      ( isLeftPage &&
        (setting.type === panelTypes.blackLeatherette || setting.type === panelTypes.blackPanel) &&
        setting.dvdType !== 'two'
      ) ||
      (setting.dvdPrinted === 'noPrinted' && newPage.type === pageTypes.dvd)
      ) {
        // 可配置项：用来控制是否要删除page；如果控制不删除page，那就清空元素
      if(AUTO_DELETE_PAGE) {
        return null;
      }
      return { ...newPage, elements: [] };
    }

    // 如果有原来页面，判断如果页面的type没有改变，就迁移element
    if(oldPage) {
      if(oldPage.type === newPage.type && oldPage.elements.length) {
        return { ...newPage, elements: oldPage.elements };
      }
    }

    let newElement = {};

    // 如果没有原来旧的page，帮助page自动生成element
    switch(newPage.type) {
      case pageTypes.page: {
        const newElement = createPhotoElement(newPage);
        newElementArray.push(newElement);

        return { ...newPage, elements: [newElement.id] }
      }
      case pageTypes.dvd: {
        const newElement = createDvdElement(newPage);
        newElementArray.push(newElement);

        return { ...newPage, elements: [newElement.id] }
      }
      default: {
        return { ...newPage, elements: [] }
      }
    }
  });

  // 给新的page添加position
  if(newPageArray[LEFT]) {
    newPageArray[LEFT].position = 'left';
  }

  if(newPageArray[RIGHT]) {
    newPageArray[RIGHT].position = 'right';
  }

  // 删除page数组中的null -> 被删除的page
  newPageArray = newPageArray.filter(page => page !== null);

  // 迁移element，element按条件会自动crop
  const transformedElementArray = transformElementArray(
    prevElementArray, newPageArray, imageArray, shouldDefaultCrop
  );

  return {
    pageArray: newPageArray,
    elementArray: [...transformedElementArray, ...newElementArray]
  };
}

function mergeOldCoverToNew(prevCover = {}, newCover = {}, prevElementArray = [], imageArray = [], setting, shouldDefaultCrop) {
  let newContainers = newCover.containers || [];
  let oldContainers = prevCover.containers || [];
  let newElementArray = [];
  let deletedElements = [];

  // 当封面类型不支持PaintedText的时候，把所有PaintedTextElement列入删除元素队列
  if(!checkIsSupportPaintedTextInCover(setting.cover)) {
    const paintedTextElements = prevElementArray.filter(element => element.type === elementTypes.paintedText);
    deletedElements = [...deletedElements, ...paintedTextElements];
  }

  newContainers = newContainers.map(newContainer => {
    // 新的cover类型，是否有与旧cover相同
    const oldContainer = oldContainers.find(
      oldContainer => oldContainer.type === newContainer.type
    );

    // 相同的话，迁移旧cover的elementIds
    if(oldContainer && oldContainer.elements.length !== 0) {
      // 获得删除后的elementIds
      const elementIds = oldContainer.elements.filter((elementId) => {
        return deletedElements.length ? deletedElements.every(deletedElement => elementId !== deletedElement.id) : true;
      });

      // elementIds存入新cover
      return {
        ...newContainer,
        elements: elementIds
      };

    // 如果不同，并且cover类型为全页，自动创建photoElement
    } else if(newContainer.type === pageTypes.full) {
      const newElement = createPhotoElement(newContainer);
      newElementArray.push(newElement);

      return {
        ...newContainer,
        elements: [newElement.id]
      };
    }

    return newContainer;
  });

  // 获取迁移，自适应crop后的elements
  let transformedElementArray = transformElementArray(
    prevElementArray, newContainers, imageArray, shouldDefaultCrop
  );

  // 双片dvd自动移除天窗
  if(setting.dvdType === 'two') {
    const cameoElement = transformedElementArray.find(element => element.type === elementTypes.cameo);

    if(cameoElement) {
      newContainers = newContainers.map(newContainer => {
        newContainer.elements = newContainer.elements.filter((elementId) => {
          return elementId !== cameoElement.id
        });
        return newContainer;
      });
      transformedElementArray = transformedElementArray.filter(element => element.type !== elementTypes.cameo);
    }
  }

  return {
    cover: {
      ...newCover,
      containers: newContainers
    },
    elementArray: [...transformedElementArray, ...newElementArray]
  }
}

function updateSpineContainerWidth(state, type = 'add') {
  const containers = state.getIn(containersPathArr);
  const parameterMap = state.get('parameterMap');
  const spineContainerIndex = containers.findIndex((container) => {
    return container.get('type') === 'Spine';
  });

  let newState = state;
  if (spineContainerIndex !== -1) {
    const spineContainer = containers.get(spineContainerIndex);
    const addtionalValue = parameterMap.getIn(
      ['spineWidth', 'addtionalValue']
    );
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

    newState = newState.setIn(
      containersPathArr.concat([String(spineContainerIndex)]),
      spineContainer.set(
        'width',
        newWidth
      )
    );
  }

  return newState;
}

const calculateCoverThumbnail = (parameterMap) => {
  const {
    baseWidth,
    baseHeight,
    bleedSize,
    wrapSize,
    spineThickness,
    width,
    height
  } = parameterMap;

  const pixelThumbnail = {
    x: bleedSize + wrapSize + baseWidth + spineThickness,
    y: bleedSize + wrapSize,
    width: baseWidth,
    height: baseHeight
  };

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  return {
    x: pixelThumbnail.x / width,
    y: pixelThumbnail.y / height,
    width: pixelThumbnail.width / width,
    height: pixelThumbnail.height / height
  };
};

const getImageUsedCountMap = (obj) => {
  const outObj = {};
  forEach(obj, (value, key) => {
    if (key === 'imageid') {
      outObj[value] = 1;
    }
    if (isObject(value)) {
      const resultMap = getImageUsedCountMap(value);
      forEach(resultMap, (v, k) => {
        if (isUndefined(outObj[k])) {
          outObj[k] = resultMap[k];
        } else {
          outObj[k] += resultMap[k];
        }
      });
    }
  });
  return outObj;
};

export let configurableOptionArray = null;
export let allOptionMap = null;
export let parameterArray = null;
export let variableArray = null;

const project = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_PROJECT_DATA: {
          const xmlObj = action.response;
          const projectObj = xmlObj.project;

          return merge({}, state, {
            __originalData__: projectObj,
            createdDate: new Date(projectObj.createdDate)
          });
        }
        case GET_SPEC_DATA: {
          const specObj = get(action, 'response.product-spec');

          configurableOptionArray = specParser
            .prepareConfigurableOptionMap(specObj);
          allOptionMap = specParser.prepareOptionGroup(specObj);
          parameterArray = specParser.prepareParameters(specObj);
          variableArray = specParser.prepareVariables(specObj);

          const setting = projectParser
            .getDefaultProjectSetting(state.setting, configurableOptionArray);

          if (state.projectId !== -1) {
            return merge({}, state, computeDataBySetting(
              configurableOptionArray,
              parameterArray,
              variableArray,
              {
                needDefaultSetting: true,
                currentSetting: setting
              }
            ), {
              isSpecLoaded: true
            });
          }

          const availableOptionMap = projectParser.getAvailableOptionMap(
            setting, configurableOptionArray, allOptionMap
          );

          const parameterMap = projectParser.getParameters(
            setting,
            parameterArray
          );

          const convertedParameterMap = convertParametersUnit(parameterMap);
          const spreadArray = generateSpreadArray(
            setting.type, convertedParameterMap
          );

          const coverThumbnail = calculateCoverThumbnail(convertedParameterMap);

          return merge({}, state,
            computeDataBySetting(
              configurableOptionArray,
              parameterArray,
              variableArray,
              {
                needDefaultSetting: true,
                currentSetting: setting
              }
            ), {
              allOptionMap,
              coverThumbnail,
              parameterArray,
              variableArray,
              configurableOptionArray,
              prevElementArray: state.elementArray,
              isSpecLoaded: true
            }
          );
        }
        case NEW_PROJECT: {
          const initGuid = get(action.response, 'data.guid');
          securityString.encProjectId = initGuid;
          return merge({}, state, {
            projectId: +initGuid || -1,
            isProjectEdited: false
          });
        }
        case SAVE_PROJECT: {
          return merge({}, state, {
            isProjectEdited: false
          });
        }
        case GET_MY_PHOTO_IMAGES: {
          const result = action.response;
          if (result && get(result, 'status') === 'success' && get(result, 'data')) {
            const myPhotoList = JSON.parse(get(result, 'data'));
            return merge({}, state, {
              imageArray: get(state, 'imageArray').concat(convertObjIn(myPhotoList))
            });
          }
          return state;
        }
        default:
          return state;
      }
    }
    case INIT_PROJECT_SETTING:
    case CHANGE_PROJECT_SETTING: {
      let newSetting = action.setting;
      let isOldProject = action.isOldProject;

      if (!isEmpty(newSetting)) {
        const { configurableOptionArray, parameterArray, variableArray } = state;
        const isSpecDataLoaded = configurableOptionArray;

        const hasAffectedDrawSettingKey = some(
          Object.keys(newSetting),
          (key) => {
            return affectedDrawSettingKeys.indexOf(key) !== -1;
          }
        );
        if (isSpecDataLoaded && hasAffectedDrawSettingKey) {
          const setting = projectParser.getNewProjectSetting(
            state.setting,
            newSetting,
            configurableOptionArray
          );

          const availableOptionMap = projectParser.getAvailableOptionMap(
            setting,
            configurableOptionArray,
            allOptionMap
          );

          const parameterMap = projectParser.getParameters(
            setting,
            parameterArray
          );

          const variableMap = projectParser.getVariables(setting, variableArray);

          const convertedParameterMap = convertParametersUnit(parameterMap);
          const spreadArray = generateSpreadArray(
            setting.type, convertedParameterMap
          );

          const coverThumbnail = calculateCoverThumbnail(convertedParameterMap);

          const newState = merge({}, state, {
            setting,
            parameterMap: convertedParameterMap,
            variableMap
          });

          let result = computeDataBySetting(
            configurableOptionArray,
            parameterArray,
            variableArray,
            {
              needDefaultSetting: false,
              currentSetting: state.setting,
              newSetting,
              prevCover: state.cover,
              prevPageArray: state.pageArray,
              prevElementArray: state.elementArray,
              imageArray: state.imageArray,
              isRotate: setting.product === 'woodBox'
                ? state.isProjectRotate
                : false
            }
          );

          const imageUsedCountMap = getImageUsedCountMap(
            convertObjIn(result.elementArray)
          );

          set(newState, 'spreadArray', spreadArray);
          set(newState, 'coverThumbnail', coverThumbnail);
          set(newState, 'availableOptionMap', availableOptionMap);
          set(newState, 'imageUsedCountMap', imageUsedCountMap);
          set(newState, 'isProjectEdited', true);
          set(newState, 'cover', result.cover);
          set(newState, 'inner', result.inner);
          set(newState, 'pageArray', result.pageArray);
          set(newState, 'elementArray', result.elementArray);
          set(newState, 'parameterMap', convertedParameterMap);
          set(newState, 'variableMap', variableMap);
          set(newState, 'setting', result.setting);

          return newState;
        }

        return merge({}, state, {
          setting: newSetting,
          isProjectEdited: true
        });
      }
      return state;
    }
    case INIT_IMAGE_ARRAY: {
      let { images } = action;
      images = images instanceof Array ? images : [images];
      return merge({}, state, {
        imageArray: convertObjIn(images)
      });
    }
    case INIT_IMAGE_USED_COUNT_MAP:
    case UPDATE_IMAGE_USED_COUNT_MAP: {
      const { elementArray } = state;
      return {
        ...state,
        imageUsedCountMap: getImageUsedCountMap(elementArray)
      };
    }
    case CREATE_ELEMENT: {
      const containers = get(state, 'cover.containers');
      const pageArray = get(state, 'pageArray');
      const elementArray = get(state, 'elementArray');
      const { pageId, element } = action;
      const elementId = element.id;

      const containerIndex = containers.findIndex((container) => {
        return get(container, 'id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return get(page, 'id') === pageId;
      });
      const newElementArray = [...elementArray, element];
      const newState = {};
      if (containerIndex !== -1) {
        const oldElements = get(state, `cover.containers[${containerIndex}].elements`);
        const newElements = [...oldElements, elementId];
        set(newState, `cover.containers[${containerIndex}].elements`, newElements);
      } else if (pageIndex !== -1) {
        const oldElements = get(state, `pageArray[${pageIndex}].elements`);
        const newElements = [...oldElements, elementId];
        set(newState, `pageArray[${pageIndex}].elements`, newElements);
      }

      set(newState, 'elementArray', newElementArray);
      // set(newState, 'imageUsedCountMap', getImageUsedCountMap(newElementArray));
      return merge({}, state, newState);
    }
    case UPDATE_ELEMENT: {
      const element = action.element;
      const elementArray = get(state, 'elementArray');
      const newState = {...state};
      let newElementArray = [];
      elementArray.forEach((ele) => {
        const eId = get(ele, 'id');
        if (eId === get(element, 'id')) {
          newElementArray.push(
            merge({}, ele, element, {
              lastModified: Date.now()
            })
          );
        } else {
          newElementArray.push(ele);
        }
      });

      return {
        ...newState,
        elementArray: newElementArray,
        imageUsedCountMap: getImageUsedCountMap(newElementArray)
      };
    }
    case SELECT_ELEMENT: {
      const selectedElement = action.element;
      const elementArray = get(state, 'elementArray');
      const newState = {...state};

      const newElementArray = elementArray.map(element => {
        return { ...element, isSelect: element.id === selectedElement.id };
      });

      return {
        ...newState,
        elementArray: newElementArray
      };
    }
    case CLEAR_ELEMENT_SELECT: {
      const elementArray = get(state, 'elementArray');

      const newState = {...state};

      const newElementArray = elementArray.map(element => {
        return { ...element, isSelect: false };
      });

      return {
        ...newState,
        elementArray: newElementArray
      };
    }
    case DELETE_ELEMENT: {
      const { pageId } = action;
      const elementId = action.elementId;

      const containers = get(state, 'cover.containers');
      const pageArray = get(state, 'pageArray');
      const elementArray = get(state, 'elementArray');

      const containerIndex = containers.findIndex((container) => {
        return get(container, 'id') === pageId;
      });
      const pageIndex = pageArray.findIndex((page) => {
        return get(page, 'id') === pageId;
      });

      let newState = merge({}, state);
      if (containerIndex !== -1) {
        const oldElements = get(newState, `cover.containers[${containerIndex}].elements`);
        const newElements = oldElements.filter(id => id !== elementId);
        set(newState, `cover.containers[${containerIndex}].elements`, newElements);
      } else if (pageIndex !== -1) {
        const oldElements = get(newState, `pageArray[${pageIndex}].elements`);
        const newElements = oldElements.filter(id => id !== elementId);
        set(newState, `pageArray[${pageIndex}].elements`, newElements);
      }

      const newElementArray = elementArray.filter((element) => {
        return get(element, 'id') !== elementId;
      });

      set(newState, 'elementArray', newElementArray);

      set(newState, 'imageUsedCountMap', getImageUsedCountMap(newElementArray));

      return newState;
    }
    case UPLOAD_COMPLETE: {
      const { imageArray } = state;
      const { fields } = action;
      const imageObj = {
        id: fields.imageId,
        guid: fields.guid,
        encImgId: fields.encImgId,
        name: fields.name,
        height: fields.height,
        width: fields.width,
        createTime: fields.createTime,
        order: imageArray.length,
        shotTime: fields.shotTime,
        uploadTime: fields.uploadTime,
        orientation:fields.orientation
      };
      return merge({}, state, {
        imageArray: [...imageArray, convertObjIn(imageObj)],
        isProjectEdited: true
      });
    }
    case DELETE_PROJECT_IMAGE: {
      const { imageArray } = state;
      const { imageId } = action;
      const currentImageIndex = findIndex(
        imageArray,
        i => i.id === imageId
      );
      const encImgId = get(imageArray, `${currentImageIndex}.encImgId`);
      const newDeletedEncImgIds = state.deletedEncImgIds.slice();
      if (encImgId) {
        newDeletedEncImgIds.push(encImgId);
      }
      return set(
        merge({}, state, { isProjectEdited: true, deletedEncImgIds: newDeletedEncImgIds }),
        'imageArray',
        [
          ...imageArray.slice(0, currentImageIndex),
          ...imageArray.slice(currentImageIndex + 1)
        ]
      );
    }
    case PROJECT_LOAD_COMPLETED: {
      return merge({}, state, {
        isProjectLoadCompleted: true,
        isProjectEdited: false
      });
    }
    case UPDATE_PROJECT_ID: {
      return merge({}, state, {
        projectId: action.projectId
      });
    }
    case SET_PROJECT_ORDERED_STATE: {
      const { orderState } = action;
      return merge({}, state, {
        orderState
      });
    }
    case CHANGE_PROJECT_TITLE: {
      return merge({}, state, {
        title: action.title
      });
    }
    case INIT_COVER: {
      const { cover } = action;

      const newCover = generateCover(
        state.setting,
        state.parameterMap,
        state.variableMap
      );

      const overwriteCoverObj = {
        width: newCover.width,
        height: newCover.height,
        bleed: newCover.bleed,
        bgImageUrl: newCover.bgImageUrl,
        backgroundSize: newCover.backgroundSize,
        baseHeight: newCover.baseHeight,
        baseWidth: newCover.baseWidth,
        effectImageUrl: newCover.effectImageUrl,
      };

      const newFullContainer = newCover.containers.find((container) => {
        return container.type === pageTypes.full;
      });
      const newSpineContainer = newCover.containers.find((container) => {
        return container.type === pageTypes.spine;
      });

      const mergedCover = merge({}, cover, overwriteCoverObj);

      const newContainers = [];
      let newElementArray = [];

      mergedCover.containers.forEach(container => {
        const fixedElements = addElementIdIfHasNoId(container.elements, state.imageArray);

        newElementArray = newElementArray.concat(fixedElements);

        const detachedContainer = merge({}, container, {
          elements: fixedElements.map(e => e.id)
        });

        switch (detachedContainer.type) {
          case pageTypes.full:
            {
              const overwriteContainerObj = {
                width: newFullContainer.width,
                height: newFullContainer.height,
                bleed: newFullContainer.bleed,
                wrapSize: newCover.wrapSize
              };

              newContainers.push(
                merge({}, detachedContainer, overwriteContainerObj)
              );
              break;
            }
          case pageTypes.spine:
            {
              const overwriteContainerObj = {
                width: newSpineContainer.width,
                height: newSpineContainer.height,
                bleed: newSpineContainer.bleed
              };
              newContainers.push(
                merge({}, detachedContainer, overwriteContainerObj)
              );
              break;
            }
          default:
            newContainers.push(detachedContainer);
        }
      });

      mergedCover.containers = newContainers;

      return Object.assign({}, state, {
        cover: mergedCover,
        elementArray: newElementArray,
        title: ''
      });
    }
    case INIT_PAGE_ARRAY: {
      const { pages } = action;
      const {
        setting,
        elementArray,
        imageArray,
        pageArray
      } = state;

      const newPageArray = generatePageArray(
        setting,
        state.parameterMap,
        state.variableMap
      );

      let detachedPageArray = [];
      let newElements = [];

      pages.forEach((page, index) => {
        const fixedElements = addElementIdIfHasNoId(page.elements, imageArray);

        newElements = newElements.concat(fixedElements);

        const overwritePageObj = {
          width: newPageArray[index].width,
          height: newPageArray[index].height,
          bleed: newPageArray[index].bleed,
          baseHeight: newPageArray[index].baseHeight,
          baseWidth: newPageArray[index].baseWidth
        };

        const detachedPage = merge({}, page, {
          elements: fixedElements.map(e => e.id)
        }, overwritePageObj);

        detachedPageArray.push(detachedPage);
      });

      const newElementArray = elementArray.concat(newElements);

      detachedPageArray[0] = pageArray[0] ? Object.assign({}, pageArray[0], detachedPageArray[0]) : null;
      detachedPageArray[1] = pageArray[1] ? Object.assign({}, pageArray[1], detachedPageArray[1]) : null;

      detachedPageArray = detachedPageArray.filter(page => page !== null);

      return {
        ...state,
        pageArray: convertObjIn(detachedPageArray),
        elementArray: newElementArray,
        imageUsedCountMap: getImageUsedCountMap(newElementArray)
      };
    }
    case INIT_COVER_ROTATE:
    case ROTATE_COVER: {
      const {
        configurableOptionArray,
        parameterArray,
        variableArray,
        setting,
        cover,
        pageArray,
        elementArray,
        imageArray,
      } = state;

      const result = merge({}, state, computeDataBySetting(
        configurableOptionArray,
        parameterArray,
        variableArray,
        {
          needDefaultSetting: false,
          currentSetting: setting,
          newSetting: setting,
          prevCover: cover,
          prevPageArray: pageArray,
          prevElementArray: elementArray,
          imageArray: imageArray,
          isRotate: action.isRotate,
          shouldBeDefaultCrop: action.type === ROTATE_COVER
        }
      ), {
        isProjectRotate: action.isRotate
      });

      return result;
    }
    default:
      return state;
  }
};

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

function transformTextElement(element, pageWidth, pageHeight) {
  const MIN_FONT_SIZE = 4;
  const MAX_FONT_SIZE = 120;

  const newFontSize = clamp(
    element.fontSize,
    getPxByPt(MIN_FONT_SIZE) / pageHeight,
    getPxByPt(MAX_FONT_SIZE) / pageHeight
  );

  return {
    ...element,
    x: element.px * pageWidth,
    y: element.py * pageHeight,
    width: element.pw * pageWidth,
    height: element.ph * pageHeight,
    fontSize: newFontSize
  };
}

function transformPhotoElement(element, imageArray, pageWidth, pageHeight, shouldDefaultCrop) {
  const newWidth = element.pw * pageWidth;
  const newHeight = element.ph * pageHeight;

  const newX = element.px * pageWidth;
  const newY = element.py * pageHeight;

  const imageDetail = imageArray.find((item) => {
    return item.encImgId === element.encImgId;
  });

  let elementOptions = {
    width: newWidth,
    height: newHeight,
    x: newX,
    y: newY
  };

  if (imageDetail && shouldDefaultCrop) {
    const options = getCropOptions(
      imageDetail.width,
      imageDetail.height,
      newWidth,
      newHeight,
      element.imgRot
    );
    const { cropLUX, cropLUY, cropRLX, cropRLY } = options;
    elementOptions = {
      ...elementOptions,
      cropLUX,
      cropLUY,
      cropRLX,
      cropRLY
    };
  }

  return {
    ...element,
    ...elementOptions
  };
}

function transformElementArray(existsElementArray, transformedPageArray, imageArray, shouldDefaultCrop) {
  let transformedElementArray = [];

  transformedPageArray.forEach((page) => {
    const willTransformElementIds = page.elements;
    const pageWidth = page.width;
    const pageHeight = page.height;
    if (willTransformElementIds && willTransformElementIds.length) {
      existsElementArray.forEach((element) => {
        if (willTransformElementIds.indexOf(element.id) !== -1) {
          let transformedElement = null;
          switch (element.type) {
            case elementTypes.text:
              transformedElement = transformTextElement(
                element, pageWidth, pageHeight, shouldDefaultCrop
              );
              break;
            case elementTypes.photo:
              transformedElement = transformPhotoElement(
                element, imageArray, pageWidth, pageHeight, shouldDefaultCrop
              );
              break;
            case elementTypes.cameo:
              // 因为中间变过出血和包边，xy值不准确，虽然px,py后台不一定用，但是任然重新计算
              const reCalcX = (pageWidth - get(page, 'bleed.left') - get(page, 'bleed.right') - get(page, 'wrapSize.right') - get(element, 'width')) / 2 + get(page, 'bleed.left');
              const reCalcY = ((pageHeight - get(element, 'height')) / 2);

              transformedElement = {
                ...element,
                // x: reCalcX,
                // y: reCalcY,
                // px: reCalcX / pageWidth,
                // py: reCalcX / pageHeight,
                x: element.px * pageWidth,
                y: element.py * pageHeight,
                width: element.width,
                height: element.height,
                pw: element.width / pageWidth,
                ph: element.height / pageHeight,
              }
              break;
            default:{
              transformedElement = {
                ...element,
                x: element.px * pageWidth,
                y: element.py * pageHeight,
                width: element.pw * pageWidth,
                height: element.ph * pageHeight
              }
            }
          }

          transformedElementArray.push(transformedElement);
        }
      });
    }
  });

  return transformedElementArray;
}

function createPhotoElement(page) {
  return {
    id: guid(),
    type: elementTypes.photo,
    elType: 'image',
    x: 0,
    y: 0,
    width: page.width,
    height: page.height,
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    imgFlip: false,
    rot: 0,
    imgRot: 0,
    encImgId: '',
    imageid: '',
    dep: 0,
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 0,
    cropRLY: 0,
    lastModified: Date.now()
  }
}

function createDvdElement(page) {
  return {
    id: guid(),
    type: elementTypes.dvd,
    elType: 'image',
    x: 0,
    y: 0,
    width: page.width,
    height: page.height,
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    imgFlip: false,
    rot: 0,
    imgRot: 0,
    encImgId: '',
    imageid: '',
    dep: 0,
    cropLUX: 0,
    cropLUY: 0,
    cropRLX: 0,
    cropRLY: 0,
    lastModified: Date.now()
  }
}

export default project;
