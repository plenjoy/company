import qs from 'qs';
import { get, merge } from 'lodash';
import Immutable from 'immutable';
import x2jsInstance from '../../../../common/utils/xml2js';
import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';

import {
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID,
  PARENT_BOOK_SIZE,
  pageTypes,
  elementTypes,
  productTypes
} from '../../constants/strings';

import { CALL_API } from '../../middlewares/api';
import { getPxByInch } from '../../../../common/utils/math';
import { generateProject, generateSku } from '../../utils/projectGenerator';
import { getDataFromState } from '../../utils/getDataFromState';

import { getCropOptions } from '../../utils/crop';

import { computeNewData } from './settingActions';
import { getImageUsedMap } from './imageUsedMapActions';

function setDefaultFontIfUserFontDeprecated(
  fontList,
  serverBookSetting,
  dispatch
) {
  const theFontFamily = fontList.find((o) => {
    return o.id === serverBookSetting.getIn(['font', 'fontFamilyId']);
  });

  if (theFontFamily && theFontFamily.deprecated) {
    dispatch({
      type: types.CHANGE_BOOK_SETTING,
      bookSetting: {
        font: Object.assign({}, serverBookSetting.get('font').toJS(), {
          fontFamilyId: DEFAULT_FONT_FAMILY_ID,
          fontId: DEFAULT_FONT_WEIGHT_ID
        })
      }
    });
  }
}

/**
 * 计算parent book的缩放比例.
 * @param  {[type]} innerPageSize [description]
 * @return {[type]}               [description]
 */
const calcScaleInfo = (page) => {
  // 英寸转为像素.
  // parent book内页的宽或高缩放后的尺寸.
  const parentBookSizeInPx = getPxByInch(PARENT_BOOK_SIZE);

  // 计算内页的缩放比例.
  let scaleRatio = 0;

  const { width, height, bleed } = page;
  const { top, right, bottom, left } = bleed;

  const baseWidth =
    page.type === pageTypes.sheet
      ? (width - (left + right)) / 2
      : width - (left + right);

  const baseHeight = height - (top + bottom);

  // 以小边作为缩放的基准.
  scaleRatio =
    baseWidth >= baseHeight
      ? parentBookSizeInPx / height
      : parentBookSizeInPx / (width / 2);

  return {
    scale: scaleRatio,
    baseWidth,
    baseHeight
  };
};

const transformContainerElements = (containers) => {
  if (containers && containers.length) {
    containers.forEach((container) => {
      const elements = container.elements;
      const pageWidth = container.width;
      const pageHeight = container.height;

      if (elements && elements.length) {
        elements.forEach((ele, index) => {
          elements[index].x = pageWidth * ele.px;
          elements[index].y = pageHeight * ele.py;
          elements[index].width = pageWidth * ele.pw;
          elements[index].height = pageHeight * ele.ph;
        });

        container.elements = elements;
      }
    });

    return containers;
  }

  return [];
};


function addDefaultElementProperty(bookSetting, elements) {
  let newElements = elements;

  elements.forEach((element, index) => {
    if (element.get('type') === elementTypes.photo) {
      const newElement = element.merge(
        {
          border: bookSetting.get('border')
            ? bookSetting.get('border').toJS()
            : null
        },
        { border: element.get('border') }
      );

      newElements = newElements.set(String(index), newElement);
    }
  });

  return newElements;
}

function recalculateElementAttrs(elements, pageWidth, pageHeight) {
  return elements.map((element) => {
    const updateAttrs = {
      x: element.get('px') * pageWidth,
      y: element.get('py') * pageHeight
    };

    if (element.get('type') !== elementTypes.photo) {
      updateAttrs.width = element.get('pw') * pageWidth;
      updateAttrs.height = element.get('ph') * pageHeight;
    } else {
      updateAttrs.pw = element.get('width') / pageWidth;
      updateAttrs.ph = element.get('height') / pageHeight;
    }
    return element.merge(updateAttrs);
  });
}

function recalculateElementAttrsByPageArray(pageArray) {
  let outPageArray = pageArray;

  outPageArray.forEach((page, i) => {
    if (page.get('type') !== pageTypes.spine) {
      const newElements = recalculateElementAttrs(
        page.get('elements'),
        page.get('width'),
        page.get('height')
      );
      outPageArray = outPageArray.setIn([String(i), 'elements'], newElements);
    }
  });

  return outPageArray;
}

function getResetedCover(
  pageArray,
  newCover
) {

  let outCover = newCover;
  let firstPage = pageArray.first();
  if(firstPage.get('type') === pageTypes.cover) {
    outCover = outCover.setIn(['containers', '0'], firstPage);
  }
  return outCover;
}

function getResetedPageArray(serverPages, newPageArray) {
  let outPageArray = serverPages;
  let firstPage = serverPages.first();
  if(firstPage.get('type') === pageTypes.cover) {
    outPageArray = serverPages.shift();
  }

  const firstNewPage = newPageArray.first();
  const overwritePageObj = {
    // width: firstNewPage.get('width'),
    // height: firstNewPage.get('height'),
    bleed: firstNewPage.get('bleed'),
    type: 'bottomPage'
  };

  outPageArray.forEach((page, index) => {

    outPageArray = outPageArray.set(
      String(index),
      page.merge(overwritePageObj)
    );
  });

  return recalculateElementAttrsByPageArray(outPageArray);
}

/**
 * 处理获取到的project的返回值.
 * @param res
 * @param dispatch
 */
const handleProjectData = (res, getState, dispatch) => {
  const projectObj = res.project;
  const newSetting = projectObj.spec;

  dispatch({
    type: types.INIT_PROJECT_SETTING,
    setting: newSetting
  });

  const stateData = getDataFromState(getState());
  const result = Immutable.fromJS(computeNewData(stateData, newSetting));
  // 当前重算出来的 cover 和 pages;
  const newCover = result.get('cover');
  const newPageArray = result.get('pageArray');

  const productType = result.getIn(['setting', 'product']);
  if (productType === productTypes.LPS) {
    dispatch({
      type: types.SWITCH_SHEET,
      index: 1
    });
  }

  // 服务器端请求过来的 pages
  const serverPages = Immutable.fromJS(projectObj.pages);
  // const serverCalendarSetting = Immutable.fromJS(projectObj.calendarSetting);

  const resetedCover = getResetedCover(
    serverPages,
    newCover
  );
  const resetedPageArray = getResetedPageArray(
    serverPages,
    newPageArray
  );

  dispatch({
    type: types.SET_COVER,
    cover: resetedCover
  });

  dispatch({
    type: types.SET_PAGE_ARRAY,
    pageArray: resetedPageArray
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
    type: types.SET_IMAGE_ARRAY,
    imageArray: Immutable.fromJS(projectObj.images)
  });

  dispatch({
    type: types.INIT_CALENDAR_SETTING,
    calendarSetting: Immutable.fromJS(projectObj.calendarSetting)
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

  // const { fontList } = stateData;
  // setDefaultFontIfUserFontDeprecated(fontList, serverBookSetting, dispatch);
};

export function getProjectData(projectId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, userId } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_DATA,
          params: {
            baseUrl,
            userId,
            projectId,
            autoRandomNum: Date.now()
          }
        }
      }
    }).then((res) => {

      handleProjectData(res, getState, dispatch);
    });
  };
}

export function getPreviewProjectData(projectId, isParentBook = false) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls } = stateData;
    const uploadBaseUrl = urls.get('uploadBaseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PREVIEW_PROJECT_DATA,
          params: {
            uploadBaseUrl,
            isParentBook,
            projectId: encodeURIComponent(projectId)
          }
        }
      }
    }).then((res) => {
      handleProjectData(res, getState, dispatch);
    });
  };
}

export function saveProject(project, userInfo, specVersion, newTitle = '') {
  return (dispatch, getState) => {
    specVersion = '2.0';
    const stateData = getDataFromState(getState());
    const { urls, property, setting } = stateData;
    const baseUrl = urls.get('baseUrl');

    const projectId = property.get('projectId');
    const projectType = setting.get('product');
    const userId = userInfo.get('id');
    const saveTitle = newTitle || property.get('title');
    const crossSell = property.get('crossSell');
    const mainProjectUid = property.get('mainProjectUid');
    const projectObj = generateProject(project, userInfo, specVersion, saveTitle);
    const skuObj = generateSku(projectObj);

    const isSaveNewProject = Boolean(newTitle);

    let requestApiUrl = null;
    let projectTitle = property.get('title');

    if (projectId === -1) {
      requestApiUrl = apiUrl.NEW_PROJECT;
    } else {
      requestApiUrl = apiUrl.SAVE_PROJECT;
    }

    if (isSaveNewProject) {
      delete projectObj.guid;

      requestApiUrl = apiUrl.NEW_PROJECT;
      projectTitle = newTitle;
    }

    const crossSellObj = crossSell
      ? { crossSell, mainProjectUid }
      : null;

    const requestKeyArray = [
      'web-h5',
      '1',
      'JSON',
      projectType,
      specVersion,
      Date.now()
    ];

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: requestApiUrl,
          params: { baseUrl, userId, projectId, projectType }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            title: projectTitle,
            projectJson: JSON.stringify(projectObj),
            skuJson: JSON.stringify(skuObj),
            requestKey: requestKeyArray.join('|'),
            ...crossSellObj
          })
        }
      }
    });
  };
}

export function cloneProject(project, userInfo, specVersion, newTitle) {
  return saveProject(project, userInfo, specVersion, newTitle);
}

/**
 * 提交打回的订单.
 */
export function submitCheckFailProject() {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, userId } = stateData;
    const baseUrl = urls.get('baseUrl');
    const projectId = property.get('projectId');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SUBMIT_CHECK_FAIL_PROJECT,
          params: {
            baseUrl,
            projectId,
            userId
          }
        }
      }
    }).then((res) => {
      const code = get(res, 'resultData.code');
      if (code === '200') {
        dispatch({
          [CALL_API]: {
            apiPattern: {
              name: apiUrl.GET_PROJECT_ORDERED_STATUS,
              params: {
                baseUrl,
                projectId,
                userId
              }
            }
          }
        });
      }

      return code;
    });
  };
}

/**
 * 检查主书中是否有parentbook.
 */
export function hasParentBook(userId, projectId) {
  return (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.HAS_PARENT_BOOK,
          params: {
            baseUrl,
            projectId,
            userId
          }
        }
      }
    });
  };
}

export function swapPhotoElement(
  fromPageId,
  fromElementId,
  toPageId,
  toElementId
) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { pageArray, imageArray, containers, ratioMap } = stateData;

    const ratio = ratioMap.get('innerWorkspaceForArrangePages');

    let fromPage = null;
    let toPage = null;

    pageArray.forEach((page) => {
      if (page.get('id') === fromPageId) {
        fromPage = page;
      }

      if (page.get('id') === toPageId) {
        toPage = page;
      }
    });

    containers.forEach((container) => {
      if (container.get('id') === fromPageId) {
        fromPage = container;
      }

      if (container.get('id') === toPageId) {
        toPage = container;
      }
    });

    const fromElement = fromPage.get('elements').find((o) => {
      return o.get('id') === fromElementId;
    });

    const toElement = toPage.get('elements').find((o) => {
      return o.get('id') === toElementId;
    });

    let fromImage = null;
    let toImage = null;

    imageArray.forEach((image) => {
      if (image.get('encImgId') === fromElement.get('encImgId')) {
        fromImage = image;
      }

      if (image.get('encImgId') === toElement.get('encImgId')) {
        toImage = image;
      }
    });

    let updateObjectArray = Immutable.List();

    let updatedFromElement = Immutable.Map({
      id: fromElementId
    });
    let updatedToElement = Immutable.Map({
      id: toElementId
    });

    // 目标元素可能没有图片
    if (toImage) {
      const fromCropOptions = getCropOptions(
        toImage.get('width'),
        toImage.get('height'),
        fromElement.get('width') * ratio,
        fromElement.get('height') * ratio,
        toElement.get('imgRot')
      );

      updatedFromElement = updatedFromElement.merge({
        encImgId: toElement.get('encImgId'),
        style: toElement.get('style'),
        border: toElement.get('border'),
        cropLUX: fromCropOptions.cropLUX,
        cropLUY: fromCropOptions.cropLUY,
        cropRLX: fromCropOptions.cropRLX,
        cropRLY: fromCropOptions.cropRLY,
        imgRot: toElement.get('imgRot')
      });
    } else {
      updatedFromElement = updatedFromElement.merge({
        encImgId: '',
        style: toElement.get('style'),
        border: toElement.get('border'),
        imgRot: 0
      });
    }

    const toCropOptions = getCropOptions(
      fromImage.get('width'),
      fromImage.get('height'),
      toElement.get('width') * ratio,
      toElement.get('height') * ratio,
      fromElement.get('imgRot')
    );

    updatedToElement = updatedToElement.merge({
      encImgId: fromElement.get('encImgId'),
      style: fromElement.get('style'),
      border: fromElement.get('border'),
      cropLUX: toCropOptions.cropLUX,
      cropLUY: toCropOptions.cropLUY,
      cropRLX: toCropOptions.cropRLX,
      cropRLY: toCropOptions.cropRLY,
      imgRot: fromElement.get('imgRot')
    });

    updateObjectArray = updateObjectArray.push(
      Immutable.Map({
        pageId: fromPageId,
        elements: Immutable.List([updatedFromElement])
      })
    );

    updateObjectArray = updateObjectArray.push(
      Immutable.Map({
        pageId: toPageId,
        elements: Immutable.List([updatedToElement])
      })
    );

    dispatch({
      type: types.UPDATE_ELEMENTS,
      updateObjectArray
    });

    return Promise.resolve();
  };
}

function getImageIdsString(mainProjectImages) {
  return mainProjectImages.reduce(
    (imageIdsStr, mainProjectImage) => `${imageIdsStr},${mainProjectImage.id}`,
    ''
  ).replace(/^\,/, '');
}

function mappingEncImgIdToMainProjectImages(mainProjectImages, encImgIds) {
  if (!(encImgIds instanceof Array)) {
    encImgIds = [encImgIds];
  }

  return mainProjectImages.map((mainProjectImage) => {
    const encImage = encImgIds.filter(encImgId => encImgId.id === mainProjectImage.id)[0];
    mainProjectImage.encImgId = encImage.encImgId;

    return mainProjectImage;
  });
}

// 获取主工程图片列表，并把符合encImgId的图片应用到cover上面，仅在新项目创建的时候会被触发
export function loadMainProjectImages(mainProjectUid, encImgId) {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    const autoRandomNum = 123;

    // 获取主工程图片列表
    let { errorCode, data: mainProjectImages } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_MAIN_PROJECT_IMAGE,
          params: { baseUrl, mainProjectUid, autoRandomNum }
        }
      }
    });

    if (mainProjectImages && errorCode === '1') {
      // 把拿到的encImgId中的空格全部替换成加号(加号被浏览器主动编码)
      encImgId = encImgId.replace(/\s+/g, '+');
      try {
        // 新的H5 books数据是json
        mainProjectImages = JSON.parse(mainProjectImages);

      } catch(e) {
        mainProjectImages = get(x2jsInstance.xml2js(mainProjectImages), 'images.image');

        if(!(mainProjectImages instanceof Array)) {
          mainProjectImages = [mainProjectImages];
        }
        const imageIds = getImageIdsString(mainProjectImages);

        const encImgIds = await dispatch({
          [CALL_API]: {
            apiPattern: {
              name: apiUrl.GET_ENCODE_IMAGE_IDS,
              params: { baseUrl }
            },
            options: {
              method: 'POST',
              headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              body: qs.stringify({ imageIds })
            }
          }
        });

        mainProjectImages = mappingEncImgIdToMainProjectImages(mainProjectImages, get(encImgIds, 'result.images.image'));
      } finally {

        const orginalImages = get(state, 'project.imageArray');
        const imageArray = [
          ...(orginalImages ? orginalImages : []),
          ...(mainProjectImages ? mainProjectImages : [])
        ];

        imageArray.sort((prev, next) => {
          if (next.encImgId === encodeURIComponent(encImgId)) { return 1; }
          return prev.shotTime - next.shotTime;
        });

        // 刷新图片列表
        dispatch({
          type: types.SET_IMAGE_ARRAY,
          imageArray: Immutable.fromJS(imageArray)
        });

        return Promise.resolve(imageArray);
      }
    }

  };
}

export function deleteServerPhotos() {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    const albumId = String(get(state, 'system.env.albumId'));
    const images = get(state, 'project.data.deletedEncImgIds').toJS();
    if (!images.length) return null;
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.DELETE_SERVER_PHOTOS,
          params: { baseUrl }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            data: JSON.stringify({
              albumId,
              images
            })
          })
        }
      }
    });
  };
}

export function getMyPhotosInfo(customerId) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();

    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.MY_PHOTOS,
          params: {
            baseUrl
          } },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            customerId,
            autoRandomNum: Date.now()
          })
        }
      }
    });
  };
}
