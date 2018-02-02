import qs from 'qs';
import { get, merge } from 'lodash';
import Immutable, { fromJS } from 'immutable';
import * as apiUrl from '../../contants/apiUrl';
import * as types from '../../contants/actionTypes';
import { getSpineTextRect } from '../../utils/spine';

import {
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID,
  PARENT_BOOK_SIZE,
  DEVIATION,
  pageTypes,
  coverTypes,
  elementTypes,
  BACKGROUND_ELEMENT_DEP,
  rotatedAngle
} from '../../contants/strings';

import { CALL_API } from '../../middlewares/api';
import { getPxByInch } from '../../../../common/utils/math';
import {
  generateProject,
  generateSku,
  generateImageJson
} from '../../utils/projectGenerator';
import { getDataFromState } from '../../utils/getDataFromState';

import {
  checkIsSupportParentBook,
  checkIsSupportEditParentBook,
  checkIsSupportPaintedTextInSpine,
  checkIsSupportSpineText
} from '../../utils/cover';
import { getCropOptions } from '../../utils/crop';

import { computeNewData, changeProjectSetting } from './settingActions';
import { fillImagesByDateTime } from './pageArrayActions';
import {
  getImageUsedMap,
  getStickerUsedMap,
  getBackgroundUsedMap
} from '../../utils/countUsed';

function setDefaultFontIfUserFontDeprecated(
  fontList,
  serverBookSetting,
  dispatch
) {
  const theFontFamily = fontList.find(o => {
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
const calcScaleInfo = page => {
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

const transformContainerElements = containers => {
  if (containers && containers.length) {
    containers.forEach(container => {
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

/**
 * 把封面的数据转换为parent book上的数据.
 * @param  {[type]} cover [description]
 * @return {[type]}       [description]
 */
const transformCoverToParentbook = (cover, innerPage) => {
  const { width, height } = cover;

  // 获取parent book内页的缩放比.
  const scaleInfo = calcScaleInfo(innerPage);
  const { scale, baseWidth, baseHeight } = scaleInfo;

  // 计算缩放后的cover的宽高.
  const newCoverWidth = width - baseWidth * 2 + baseWidth * scale * 2;
  const newCoverHeight = height - baseHeight + baseHeight * scale;

  // 更新封面上的page.
  let containers = cover.containers;
  if (containers && containers.length) {
    containers = containers.map(p => {
      switch (p.type) {
        case pageTypes.full: {
          return merge({}, p, {
            width: newCoverWidth,
            height: newCoverHeight
          });
        }
        case pageTypes.front:
        case pageTypes.back: {
          return merge({}, p, {
            width: p.width - baseWidth + baseWidth * scale,
            height: newCoverHeight
          });
        }
        case pageTypes.spine: {
          return merge({}, p, {
            height: newCoverHeight
          });
        }
        default: {
          return p;
        }
      }
    });
  }

  const newContainers = transformContainerElements(containers);

  return merge({}, cover, {
    width: newCoverWidth,
    height: newCoverHeight,
    containers: newContainers
  });
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

function recalculateElementAttrs(
  elements,
  pageWidth,
  pageHeight,
  imageArray,
  backgroundArray,
  stickerArray
) {
  return elements.map(element => {
    // 给后台出图用的绝对值，我们程序中使用百分比的值
    let updateAttrs = {
      x: element.get('px') * pageWidth,
      y: element.get('py') * pageHeight,
      width: element.get('pw') * pageWidth,
      height: element.get('ph') * pageHeight
    };

    const elementWidth = pageWidth * element.get('pw');
    const elementHeight = pageHeight * element.get('ph');
    const elementRatio = elementWidth / elementHeight;

    switch (element.get('type')) {
      case elementTypes.sticker: {
        const theSticker = stickerArray.find(o => {
          return o.code === element.get('decorationId');
        });
        if (theSticker) {
          const ratio = theSticker.width / theSticker.height;
          const newWidth = element.get('pw') * pageWidth;
          const newHeight = newWidth / ratio;

          updateAttrs.width = newWidth;
          updateAttrs.height = newHeight;
          updateAttrs.pw = newWidth / pageWidth;
          updateAttrs.ph = newHeight / pageHeight;
        }

        break;
      }
      case elementTypes.background: {
        updateAttrs.dep = BACKGROUND_ELEMENT_DEP;
        const backgroundImage = backgroundArray.find(background => {
          return background.code === element.get('backgroundId');
        });
        if (backgroundImage) {
          updateAttrs = merge(
            {},
            updateAttrs,
            updateCropInfo(
              element,
              backgroundImage,
              elementRatio,
              elementWidth,
              elementHeight
            )
          );
        }
        break;
      }
      case elementTypes.photo: {
        const currentImage = imageArray.find(im => {
          return im.encImgId === element.get('encImgId');
        });
        if (currentImage) {
          updateAttrs = merge(
            {},
            updateAttrs,
            updateCropInfo(
              element,
              currentImage,
              elementRatio,
              elementWidth,
              elementHeight
            )
          );
        }
        break;
      }

      default:
    }
    return element.merge(updateAttrs);
  });
}

function updateCropInfo(
  element,
  image,
  elementRatio,
  elementWidth,
  elementHeight
) {
  const updateAttrs = {
    cropLUX: element.get('cropLUX') || 0,
    cropRLX: element.get('cropRLX') || 0,
    cropLUY: element.get('cropLUY') || 0,
    cropRLY: element.get('cropRLY') || 0
  };

  // 判断是否旋转90度或者270度
  const isImgRotated =
    rotatedAngle.indexOf(Math.abs(element.get('imgRot'))) >= 0;

  const imageWidth = isImgRotated ? image.height : image.width;
  const imageHeight = isImgRotated ? image.width : image.height;

  const cropWidth =
    imageWidth * (element.get('cropRLX') - element.get('cropLUX'));
  const cropHeight =
    imageHeight * (element.get('cropRLY') - element.get('cropLUY'));

  const cropRatio = cropWidth / cropHeight;

  if (Math.abs(cropRatio - elementRatio) > DEVIATION) {
    const { cropLUX, cropRLX, cropLUY, cropRLY } = getCropOptions(
      image.width,
      image.height,
      elementWidth,
      elementHeight,
      element.get('imgRot')
    );
    updateAttrs.cropLUX = cropLUX;
    updateAttrs.cropRLX = cropRLX;
    updateAttrs.cropLUY = cropLUY;
    updateAttrs.cropRLY = cropRLY;
  }
  return updateAttrs;
}

function recalculateElementAttrsByPageArray(
  pageArray,
  imageArray,
  backgroundArray,
  stickerArray
) {
  let outPageArray = pageArray;

  outPageArray.forEach((page, i) => {
    if (page.get('type') !== pageTypes.spine) {
      const newElements = recalculateElementAttrs(
        page.get('elements'),
        page.get('width'),
        page.get('height'),
        imageArray,
        backgroundArray,
        stickerArray
      );
      outPageArray = outPageArray.setIn([String(i), 'elements'], newElements);
    } else {
      const spineTextElement = page.getIn(['elements', '0']);

      if (spineTextElement) {
        const spineTextRect = getSpineTextRect(page);
        const newSpineTextElement = spineTextElement.merge(spineTextRect);

        outPageArray = outPageArray.setIn(
          [String(i), 'elements', '0'],
          newSpineTextElement
        );
      }
    }
  });

  return outPageArray;
}

function getResetedCover(
  serverCover,
  newCover,
  serverBookSetting,
  addedSheetWidth,
  imageArray,
  backgroundArray,
  stickerArray
) {
  let outCover = serverCover;

  const newFullContainer = newCover.get('containers').find(container => {
    return container.get('type') === 'Full';
  });
  const newSpineContainer = newCover.get('containers').find(container => {
    return container.get('type') === 'Spine';
  });

  let coverWidth = newCover.get('width');
  if (newFullContainer) {
    coverWidth += addedSheetWidth;
  }

  const overwriteCoverObj = {
    width: coverWidth,
    height: newCover.get('height'),
    bleed: newCover.get('bleed'),
    bgImageUrl: newCover.get('bgImageUrl')
  };

  outCover = outCover.merge(overwriteCoverObj);
  outCover.get('containers').forEach((container, index) => {
    const newElements = addDefaultElementProperty(
      serverBookSetting,
      container.get('elements')
    );
    outCover = outCover.setIn(
      ['containers', String(index), 'elements'],
      newElements
    );

    switch (container.get('type')) {
      case 'Full': {
        outCover = outCover.setIn(
          ['containers', String(index)],
          container.merge({
            width: coverWidth,
            height: newFullContainer.get('height'),
            bleed: newFullContainer.get('bleed')
          })
        );
        break;
      }
      case 'Spine': {
        outCover = outCover.setIn(
          ['containers', String(index)],
          container.merge({
            width: newSpineContainer.get('width') + addedSheetWidth,
            height: newSpineContainer.get('height'),
            bleed: newSpineContainer.get('bleed')
          })
        );
        break;
      }
      default:
    }
  });

  outCover = outCover.set(
    'containers',
    recalculateElementAttrsByPageArray(
      outCover.get('containers'),
      imageArray,
      backgroundArray,
      stickerArray
    )
  );

  return outCover;
}

function getResetedPageArray(
  serverPages,
  newPageArray,
  serverBookSetting,
  imageArray,
  backgroundArray,
  stickerArray
) {
  let outPageArray = serverPages;

  const firstNewPage = newPageArray.first();
  const overwritePageObj = {
    width: firstNewPage.get('width'),
    height: firstNewPage.get('height'),
    bleed: firstNewPage.get('bleed')
  };

  serverPages.forEach((page, index) => {
    const newElements = addDefaultElementProperty(
      serverBookSetting,
      page.get('elements')
    );

    outPageArray = outPageArray.set(
      String(index),
      page.merge(overwritePageObj, {
        elements: newElements
      })
    );
  });

  return recalculateElementAttrsByPageArray(
    outPageArray.concat(newPageArray.slice(outPageArray.size)),
    imageArray,
    backgroundArray,
    stickerArray
  );
}

function initCameoElement(cover, setting) {
  const outCover = Object.assign({}, cover);
  cover.containers.forEach((container, i) => {
    container.elements.forEach((element, j) => {
      if (element.type === elementTypes.cameo) {
        outCover.containers[i].elements[j].cameo = setting.cameo;
        outCover.containers[i].elements[j].cameoShape = setting.cameoShape;
      }
    });
  });

  return outCover;
}

/**
 * 处理获取到的project的返回值.
 * @param res
 * @param dispatch
 */
const handleProjectData = (res, getState, dispatch) => {
  if (!res || !res.project) {
    return;
  }

  const projectObj = res.project;
  const newSetting = projectObj.spec;

  dispatch({
    type: types.INIT_PROJECT_SETTING,
    setting: newSetting
  });

  const addedSheetNumber = projectObj.summary.pageAdded / 2;

  const stateData = getDataFromState(getState());

  const result = Immutable.fromJS(computeNewData(stateData, newSetting));
  const newPageArray = result.get('pageArray');
  const newCover = result.get('cover');

  const imageArray = projectObj.images;
  const backgroundArray = projectObj.backgrounds;
  const stickerArray = projectObj.stickers;

  const addedSheetWidth =
    addedSheetNumber *
    (result.getIn(['parameterMap', 'spineWidth', 'addtionalValue']) || 0);

  const serverCover = Immutable.fromJS(
    initCameoElement(projectObj.cover, newSetting)
  );
  const serverPages = Immutable.fromJS(projectObj.pages);
  const serverBookSetting = Immutable.fromJS(projectObj.summary.editorSetting);

  const resetedCover = getResetedCover(
    serverCover,
    newCover,
    serverBookSetting,
    addedSheetWidth,
    imageArray,
    backgroundArray,
    stickerArray
  );

  const resetedPageArray = getResetedPageArray(
    serverPages,
    newPageArray,
    serverBookSetting,
    imageArray,
    backgroundArray,
    stickerArray
  );

  // 获取产品的类型, 尺寸, 以及封面类型.
  const productType = newSetting.product;
  const coverType = newSetting.cover;
  const productSize = newSetting.size;

  const { property } = stateData;

  const isParentBook = property.get('isParentBook');

  let preparedCover = resetedCover;

  // 检查是否为parent book.
  // 如果是parent book, 那么检查当前的书的类型是否真的支持parentbook, 防止用户伪造request.
  const isSupportParentBook = checkIsSupportParentBook(
    productType,
    productSize
  );
  const isSupportEditParentBook = checkIsSupportEditParentBook(coverType);
  if (isParentBook && isSupportParentBook && isSupportEditParentBook) {
    const page = resetedPageArray.size ? resetedPageArray.get(0).toJS() : null;

    if (page) {
      preparedCover = Immutable.fromJS(
        transformCoverToParentbook(resetedCover.toJS(), page)
      );
    }
  }

  dispatch({
    type: types.SET_IMAGE_ARRAY,
    imageArray: Immutable.fromJS(projectObj.images)
  });

  dispatch({
    type: types.SET_BACKGROUND_ARRAY,
    backgroundArray: Immutable.fromJS(projectObj.backgrounds)
  });

  dispatch({
    type: types.SET_STICKER_ARRAY,
    stickerArray: Immutable.fromJS(projectObj.stickers)
  });

  dispatch({
    type: types.SET_DECORATION_ARRAY,
    decorationArray: Immutable.fromJS(projectObj.decorations)
  });

  dispatch({
    type: types.SET_APPLY_BOOK_THEME_ID,
    bookThemeId: projectObj.applyBookThemeId
  });

  dispatch({
    type: types.SET_COVER,
    cover: preparedCover
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
    type: types.INIT_BOOK_SETTING,
    bookSetting: Immutable.fromJS(projectObj.summary.editorSetting)
  });

  const newElementArray = getDataFromState(getState()).elementArray;

  dispatch({
    type: types.SET_IMAGE_USED_MAP,
    imageUsedMap: getImageUsedMap(newElementArray)
  });

  const { fontList } = stateData;
  setDefaultFontIfUserFontDeprecated(fontList, serverBookSetting, dispatch);
};

export function getProjectData(projectId) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, userId } = stateData;
    const baseUrl = urls.get('baseUrl');
    const isParentBook = property.get('isParentBook');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_DATA,
          params: {
            baseUrl,
            userId,
            projectId,
            isParentBook,
            autoRandomNum: Date.now()
          }
        }
      }
    }).then(res => {
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
    }).then(res => {
      handleProjectData(res, getState, dispatch);
    });
  };
}

export function getBookThemeProjectData(bookThemeId, isApplyTheme = false) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls } = stateData;
    const baseUrl = urls.get('baseUrl');

    const requestPromise = dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_BOOK_THEME_PROJECT_DATA,
          params: {
            baseUrl,
            bookThemeId: encodeURIComponent(bookThemeId),
            autoRandomNum: Date.now()
          }
        }
      }
    });

    if (isApplyTheme) {
      return requestPromise;
    }

    return requestPromise.then(res => {
      handleProjectData(res, getState, dispatch);
    });
  };
}

export function getBookThemeImages(userId, themeCode) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls } = stateData;
    const baseUrl = urls.get('baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_BOOK_THEME_IMAGES,
          params: {
            baseUrl,
            userId,
            themeCode,
            autoRandomNum: Date.now()
          }
        }
      }
    }).then(res => {
      const images = get(res, 'data.images');
      let imageArray = [];

      if (images && images.length) {
        imageArray = images.map((image, index) => {
          return {
            encImgId: image.encImageId,
            width: image.pixelWidth,
            height: image.pixelHeight,
            shotTime: 0,
            guid: image.guid,
            name: image.imageName,
            uploadTime: image.updTime,
            order: index
          };
        });
      }

      dispatch({
        type: types.SET_IMAGE_ARRAY,
        imageArray: Immutable.fromJS(imageArray)
      });
    });
  };
}

export function saveProject(project, userInfo, specVersion, newTitle = '') {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, setting } = stateData;
    const baseUrl = urls.get('baseUrl');

    const projectId = property.get('projectId');
    const projectType = setting.get('product');
    const userId = userInfo.get('id');

    const projectObj = generateProject(project, userInfo, specVersion);
    const skuObj = generateSku(projectObj);

    const isSaveNewProject = Boolean(newTitle);
    const isParentBook = property.get('isParentBook');

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

    const requestKeyArray = [
      'web-h5',
      '1',
      'JSON',
      projectType,
      specVersion,
      Date.now()
    ];

    let body = {
      title: projectTitle,
      projectJson: JSON.stringify(projectObj),
      skuJson: JSON.stringify(skuObj),
      requestKey: requestKeyArray.join('|'),
      isParentBook
    };

    // 添加crosssell信息.
    const crossSell = stateData.queryStringObj.get('crossSell');
    const mainProjectUid = stateData.queryStringObj.get('mainProjectUid');

    if (crossSell) {
      body = merge({}, body, { crossSell });
    }

    if (mainProjectUid) {
      body = merge({}, body, { mainProjectUid });
    }

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
          body: qs.stringify(body)
        }
      }
    });
  };
}

export function saveBookThemeProject(project, userInfo, specVersion) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, pageArray } = stateData;
    const baseUrl = urls.get('baseUrl');

    const bookThemeId = property.get('bookThemeId');
    const projectObj = generateProject(project, userInfo, specVersion);

    const imageJson = generateImageJson(pageArray.size / 2 + 1);

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SAVE_BOOK_THEME_PROJECT,
          params: { baseUrl, autoRandomNum: Date.now() }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            guid: bookThemeId,
            projectJson: JSON.stringify(projectObj),
            imagejson: JSON.stringify(imageJson)
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
    const isParentBook = property.get('isParentBook');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SUBMIT_CHECK_FAIL_PROJECT,
          params: {
            baseUrl,
            projectId,
            userId,
            isParentBook
          }
        }
      }
    }).then(res => {
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

    pageArray.forEach(page => {
      if (page.get('id') === fromPageId) {
        fromPage = page;
      }

      if (page.get('id') === toPageId) {
        toPage = page;
      }
    });

    containers.forEach(container => {
      if (container.get('id') === fromPageId) {
        fromPage = container;
      }

      if (container.get('id') === toPageId) {
        toPage = container;
      }
    });

    const fromElement = fromPage.get('elements').find(o => {
      return o.get('id') === fromElementId;
    });

    const toElement = toPage.get('elements').find(o => {
      return o.get('id') === toElementId;
    });

    let fromImage = null;
    let toImage = null;

    imageArray.forEach(image => {
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
      const toImageRot = toImage.get('orientation');
      const fromCropOptions = getCropOptions(
        toImage.get('width'),
        toImage.get('height'),
        fromElement.get('width'),
        fromElement.get('height'),
        toImageRot
      );

      updatedFromElement = updatedFromElement.merge({
        encImgId: toElement.get('encImgId'),
        style: toElement.get('style'),
        border: toElement.get('border'),
        cropLUX: fromCropOptions.cropLUX,
        cropLUY: fromCropOptions.cropLUY,
        cropRLX: fromCropOptions.cropRLX,
        cropRLY: fromCropOptions.cropRLY,
        imgRot: toImageRot
      });
    } else {
      updatedFromElement = updatedFromElement.merge({
        encImgId: '',
        imgRot: 0,
        style: toElement.get('style'),
        border: toElement.get('border')
      });
    }

    const fromImageRot = fromImage.get('orientation');
    const toCropOptions = getCropOptions(
      fromImage.get('width'),
      fromImage.get('height'),
      toElement.get('width'),
      toElement.get('height'),
      fromImageRot
    );

    updatedToElement = updatedToElement.merge({
      encImgId: fromElement.get('encImgId'),
      style: fromElement.get('style'),
      border: fromElement.get('border'),
      cropLUX: toCropOptions.cropLUX,
      cropLUY: toCropOptions.cropLUY,
      cropRLX: toCropOptions.cropRLX,
      cropRLY: toCropOptions.cropRLY,
      imgRot: fromImageRot
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

function removeElementsImage(elements) {
  return elements.map(element => {
    delete element.computed;
    delete element.isSelected;
    delete element.isDisabled;
    delete element.dateSelected;

    switch (element.type) {
      case elementTypes.photo:
      case elementTypes.cameo:
        return Object.assign({}, element, {
          encImgId: ''
        });
      default:
        return element;
    }
  });
}

function removeImmutableElementsImage(elements) {
  return elements.map(element => {
    switch (element.get('type')) {
      case elementTypes.photo:
      case elementTypes.cameo:
        return element.set('encImgId', '');
      default:
        return element;
    }
  });
}

export function applyTheme(theme) {
  return (dispatch, getState) => {
    const bookThemeId = theme.get('guid');
    const isApplyTheme = true;

    return new Promise((resolve, reject) => {
      dispatch(getBookThemeProjectData(bookThemeId, isApplyTheme)).then(res => {
        if (!res) reject();

        const stateData = getDataFromState(getState());
        const currentSetting = stateData.setting;

        const projectObj = res.project;
        const newSetting = projectObj.spec;

        const isCoverChanged = currentSetting.get('cover') !== newSetting.cover;

        // 应用theme时，不更改用户当前的封面设置。
        delete newSetting.cover;

        dispatch(changeProjectSetting(newSetting)).then(() => {
          // 应用theme时，清除用户当前所有图片，重新填充
          const currentPageArray = stateData.pageArray.map(page => {
            return page.set(
              'elements',
              removeImmutableElementsImage(page.get('elements'))
            );
          });
          const themePageArray = Immutable.fromJS(
            projectObj.pages.map(page => {
              return Object.assign({}, page, {
                elements: removeElementsImage(page.elements)
              });
            })
          );

          const newPageArray = currentPageArray.map((page, index) => {
            const themePage = themePageArray.get(index);
            if (themePage) {
              return page.set('elements', themePage.get('elements'));
            }
            return page;
          });

          if (!isCoverChanged) {
            const currentContainers = stateData.containers;

            const themeContainers = Immutable.fromJS(
              projectObj.cover.containers.map(container => {
                return Object.assign({}, container, {
                  elements: removeElementsImage(container.elements)
                });
              })
            );

            const newContainers = currentContainers.map((container, index) => {
              const themeContainer = themeContainers.get(index);
              return container.set('elements', themeContainer.get('elements'));
            });

            dispatch({
              type: types.SET_COVER,
              cover: stateData.cover.set('containers', newContainers)
            });
          }

          dispatch({
            type: types.SET_PAGE_ARRAY,
            pageArray: newPageArray
          });

          dispatch({
            type: types.SET_APPLY_BOOK_THEME_ID,
            bookThemeId
          });

          const newElementArray = getDataFromState(getState()).elementArray;

          const themeBackgroundArray = Immutable.fromJS(projectObj.backgrounds);
          const currentBackgroundArray = stateData.backgroundArray;

          let distinctCurrentBackgroundMap = Immutable.Map();

          currentBackgroundArray.forEach(background => {
            const backgroundId = background.get('code');
            if (!distinctCurrentBackgroundMap.get(backgroundId)) {
              distinctCurrentBackgroundMap = distinctCurrentBackgroundMap.set(
                backgroundId,
                background
              );
            }
          });

          const distinctCurrentBackgroundArray = distinctCurrentBackgroundMap.toList();

          const backgroundUsedMap = getBackgroundUsedMap(newElementArray);

          const currentUsedBackgroundArray = distinctCurrentBackgroundArray.filter(
            background => {
              return backgroundUsedMap.get(background.get('code'));
            }
          );

          const distinctThemeBackgroundArray = themeBackgroundArray.filter(
            background => {
              return currentUsedBackgroundArray.indexOf(background) === -1;
            }
          );

          const themeStickerArray = Immutable.fromJS(projectObj.stickers);

          const currentStickerArray = stateData.stickerArray;
          let distinctCurrentStickerMap = Immutable.Map();

          currentStickerArray.forEach(sticker => {
            const stickerId = sticker.get('code');
            if (!distinctCurrentStickerMap.get(stickerId)) {
              distinctCurrentStickerMap = distinctCurrentStickerMap.set(
                stickerId,
                sticker
              );
            }
          });

          const distinctCurrentStickerArray = distinctCurrentStickerMap.toList();

          const stickerUsedMap = getStickerUsedMap(newElementArray);

          const currentUsedStickerArray = distinctCurrentStickerArray.filter(
            sticker => {
              return stickerUsedMap.get(sticker.get('code'));
            }
          );

          const distinctThemeStickerArray = themeStickerArray.filter(
            sticker => {
              return currentUsedStickerArray.indexOf(sticker) === -1;
            }
          );

          dispatch({
            type: types.SET_BACKGROUND_ARRAY,
            backgroundArray: currentUsedBackgroundArray.concat(
              distinctThemeBackgroundArray
            )
          });

          dispatch({
            type: types.SET_STICKER_ARRAY,
            stickerArray: currentUsedStickerArray.concat(
              distinctThemeStickerArray
            )
          });

          dispatch({
            type: types.CHANGE_BOOK_SETTING,
            bookSetting: Immutable.fromJS({
              autoLayout: false
            })
          });

          dispatch(fillImagesByDateTime()).then(() => {
            resolve();
          });
        });
      }, reject);
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
          }
        },
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

export function deleteServerPhotos() {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');
    const albumId = String(get(state, 'system.env.albumId'));
    const project = get(state, 'project.data');
    const deletedEncImgIds = project.deletedEncImgIdArray.toJS();
    if (!deletedEncImgIds.length) return null;
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
              images: deletedEncImgIds
            })
          })
        }
      }
    });
  };
}
