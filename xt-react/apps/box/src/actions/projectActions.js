import { get, isUndefined, merge } from 'lodash';
import qs from 'qs';
import { CALL_API } from '../middlewares/api';
import x2jsInstance from '../../common/utils/xml2js';
import { getDefaultCropLRXY } from '../../common/utils/crop';
import { Element } from '../../common/utils/entry';
import { convertObjIn } from '../../common/utils/typeConverter';
import { combine } from '../utils/url';
import { pageTypes, elementTypes, errorTypes } from '../contants/strings';

import { guid } from '../../common/utils/math';
import { generateProject, generateSku } from '../../src/utils/projectGenerator';
import { toCanvas } from '../../src/utils/snippingHelper';

import {
  GET_PROJECT_DATA,
  GET_PREVIEW_PROJECT_DATA,
  SAVE_PROJECT,
  NEW_PROJECT,
  GET_MAIN_PROJECT_IMAGE,
  GET_ENCODE_IMAGE_IDS,
  GET_PROJECT_ORDERED_STATE,
  GET_PROJECT_ORDERED_INFO,
  UPDATE_CHECK_STATUS,
  SAVE_PROJECT_TITLE,
  UPLOAD_COVER_IMAGE,
  GET_MY_PHOTO_IMAGES,
  CHECK_PROJECT_TITLE,
  DELETE_SERVER_PHOTOS,
  IMAGE_SRC
} from '../contants/apiUrl';
import {
  CHANGE_PROJECT_SETTING,
  INIT_IMAGE_ARRAY,
  UPDATE_IMAGE_USED_COUNT_MAP,
  CREATE_ELEMENT,
  UPDATE_ELEMENT,
  SELECT_ELEMENT,
  DELETE_ELEMENT,
  CLEAR_ELEMENT_SELECT,
  DELETE_PROJECT_IMAGE,
  PROJECT_LOAD_COMPLETED,
  AUTO_ADD_PHOTO_TO_CANVAS,
  SET_PROJECT_ORDERED_STATE,
  CHANGE_PROJECT_TITLE,
  INIT_PROJECT_SETTING,
  INIT_COVER,
  INIT_PAGE_ARRAY,
  ROTATE_COVER,
  INIT_COVER_ROTATE,
  UPDATE_PROJECT_ID
} from '../contants/actionTypes';
import { DONE } from '../contants/uploadStatus';

import { formatOldVersionProject } from './project/handler';

const handleProjectData = (res, dispatch, getState) => {
  const version = get(res, 'project.version');

  if (!version) {
    res = formatOldVersionProject(res, getState);
  }

  const projectObj = res.project;

  dispatch({
    type: INIT_PROJECT_SETTING,
    setting: projectObj.spec,
    isOldProject: !version
  });

  dispatch({
    type: INIT_IMAGE_ARRAY,
    images: projectObj.images
  });

  dispatch({
    type: INIT_COVER,
    cover: projectObj.cover
  });

  dispatch({
    type: INIT_PAGE_ARRAY,
    pages: projectObj.pages
  });

  dispatch({
    type: CHANGE_PROJECT_SETTING,
    setting: projectObj.spec,
    isOldProject: !version
  });

  dispatch({
    type: INIT_COVER_ROTATE,
    isRotate: projectObj.cover.isRotate
  });
};

export function changeProjectTitle(title) {
  return {
    type: CHANGE_PROJECT_TITLE,
    title
  };
}

export function getProjectData(userId, projectId) {
  return (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls.baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PROJECT_DATA,
          params: { baseUrl, userId, projectId }
        }
      }
    }).then(res => {
      handleProjectData(res, dispatch, getState);
    });
  };
}

export function getPreviewProjectData(projectId) {
  return (dispatch, getState) => {
    const state = getState();
    const uploadBaseUrl = get(state, 'system.env.urls.uploadBaseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PREVIEW_PROJECT_DATA,
          params: {
            uploadBaseUrl,
            projectId: encodeURIComponent(projectId)
          }
        }
      }
    }).then(res => {
      handleProjectData(res, dispatch, getState);
    });
  };
}

export function getProjectOrderedState(userId, projectId) {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls.baseUrl');
    const webClientId = 1;
    const autoRandomNum = 1;
    const timestamp = Date.now();

    // 如果projectId为-1，不去请求接口，返回空数据
    if (projectId === -1) {
      return { orderState: {} };
    }

    let { resultData: orderedState } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PROJECT_ORDERED_STATE,
          params: { baseUrl, userId, projectId, webClientId, autoRandomNum }
        }
      }
    });

    if (!orderedState) {
      throw { code: errorTypes.NETWORK_ERROR };
    }

    orderedState = {
      checkFailed: orderedState.checkFailed === 'true' ? true : false,
      ordered: orderedState.ordered === 'true' ? true : false
    };

    let orderInfo = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PROJECT_ORDERED_INFO,
          params: { baseUrl, projectId, timestamp }
        }
      }
    });

    orderInfo = {
      isOrdered: orderInfo.order === 1 ? true : false,
      isInCart: orderInfo.cart === 1 ? true : false,
      isInMarket:
        orderInfo.market === 1 || orderInfo.market === 2 ? true : false,
      isShowPostToSale: typeof orderInfo.market !== 'undefined'
    };

    return dispatch({
      type: SET_PROJECT_ORDERED_STATE,
      orderState: Object.assign({}, orderedState, orderInfo)
    });
  };
}

export function updateCheckStatus(userId, projectId) {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls.baseUrl');

    const res = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: UPDATE_CHECK_STATUS,
          params: { baseUrl, userId, projectId }
        }
      }
    });

    return res.resultData.code == 200;
  };
}

export function projectLoadCompleted() {
  return {
    type: PROJECT_LOAD_COMPLETED
  };
}

export function changeProjectSetting(setting) {
  return {
    type: CHANGE_PROJECT_SETTING,
    setting
  };
}

export function rotateCover(isRotate) {
  return {
    type: ROTATE_COVER,
    isRotate
  };
}

export function uploadSnapData({ projectId, boundProjectActions }) {
  if (projectId === -1 || !projectId) {
    return Promise.resolve();
  } else {
    return boundProjectActions.uploadCoverImage(projectId);
  }
}

export function saveProject(
  project,
  userInfo,
  mainProjectUid,
  boundProjectActions
) {
  return (dispatch, getState) => {
    const projectId = project.projectId;

    return uploadSnapData({ projectId, boundProjectActions }).then(() => {
      const { baseUrl } = get(getState(), 'system.env.urls');
      const specVersion = getState().spec.version;
      const { projectId, setting } = project;
      const { product } = setting;
      const userId = userInfo.id;

      const projectObj = generateProject(project, userInfo, specVersion);
      const skuObj = generateSku(projectObj);

      const requestApiUrl = !~projectId ? NEW_PROJECT : SAVE_PROJECT;

      const crossSellObj = mainProjectUid
        ? { crossSell: 'cart', mainProjectUid }
        : null;

      const title = project.title;

      const requestKeyArray = [
        'web-h5',
        '1',
        'JSON',
        product,
        specVersion,
        Date.now()
      ];

      const body = qs.stringify({
        title,
        projectJson: JSON.stringify(projectObj),
        skuJson: JSON.stringify(skuObj),
        requestKey: requestKeyArray.join('|'),
        ...crossSellObj
      });

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: requestApiUrl,
            params: { baseUrl, userId, projectId, product }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body
          }
        }
      });
    });
  };
}

export function cloneProject(project, userInfo, mainProjectUid, newTitle = '') {
  return (dispatch, getState) => {
    const { baseUrl } = get(getState(), 'system.env.urls');
    const specVersion = getState().spec.version;
    const { projectId, setting } = project;
    const { product } = setting;
    const userId = userInfo.id;

    const projectObj = generateProject(project, userInfo, specVersion);
    const skuObj = generateSku(projectObj);

    const requestKeyArray = [
      'web-h5',
      '1',
      'JSON',
      product,
      specVersion,
      Date.now()
    ];

    const body = qs.stringify({
      title: newTitle,
      projectJson: JSON.stringify(projectObj),
      skuJson: JSON.stringify(skuObj),
      requestKey: requestKeyArray.join('|')
    });

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: NEW_PROJECT,
          params: { baseUrl, userId, projectId, product }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body
        }
      }
    });
  };
}

export function clearElementSelect() {
  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_ELEMENT_SELECT
    });
    return Promise.resolve();
  };
}

export function createElement(pageId, element) {
  return dispatch => {
    const newElementId = guid();

    const newElement = merge({}, element, { id: newElementId });
    dispatch({
      type: CREATE_ELEMENT,
      pageId,
      element: newElement
    });

    return Promise.resolve(newElement);
  };
}

export function updateElement(element) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ELEMENT,
      element
    });
    return Promise.resolve();
  };
}

export function selectElement(element) {
  return (dispatch, getState) => {
    dispatch({
      type: SELECT_ELEMENT,
      element
    });
    return Promise.resolve();
  };
}

export function deleteElement(pageId, elementId) {
  return dispatch => {
    dispatch({
      type: DELETE_ELEMENT,
      pageId,
      elementId
    });
  };
}

export function deleteProjectImage(imageId) {
  return {
    type: DELETE_PROJECT_IMAGE,
    imageId
  };
}

// 获取主工程图片列表，并把符合encImgId的图片应用到cover上面，仅在新项目创建的时候会被触发
export function loadMainProjectImages(mainProjectUid, encImgId) {
  return async (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls.baseUrl');
    const autoRandomNum = 123;

    // 获取主工程图片列表
    let { errorCode, data: mainProjectImages } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_MAIN_PROJECT_IMAGE,
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
      } catch (e) {
        mainProjectImages = get(
          x2jsInstance.xml2js(mainProjectImages),
          'images.image'
        );

        if (!(mainProjectImages instanceof Array)) {
          mainProjectImages = [mainProjectImages];
        }

        const imageIds = getImageIdsString(mainProjectImages);

        let encImgIds = await dispatch({
          [CALL_API]: {
            apiPattern: {
              name: GET_ENCODE_IMAGE_IDS,
              params: { baseUrl }
            },
            options: {
              method: 'POST',
              headers: {
                'Content-type':
                  'application/x-www-form-urlencoded; charset=UTF-8'
              },
              body: qs.stringify({ imageIds })
            }
          }
        });

        mainProjectImages = mappingEncImgIdToMainProjectImages(
          mainProjectImages,
          get(encImgIds, 'result.images.image')
        );
      } finally {
        const orginalImages = get(state, 'project.imageArray');
        const imageArray = [
          ...(orginalImages ? orginalImages : []),
          ...(mainProjectImages ? mainProjectImages : [])
        ];

        // 刷新图片列表
        dispatch({
          type: INIT_IMAGE_ARRAY,
          images: imageArray
        });

        // 选出封面图片
        const autoAddedFile = imageArray.filter(
          image => image.encImgId === encodeURIComponent(encImgId)
        )[0];

        if (autoAddedFile) {
          // 自动载入封面图片到currentSpread上面
          autoAddPhotoToCanvas(getState, dispatch, autoAddedFile);
        }
      }
    }
  };
}

function getImageIdsString(mainProjectImages) {
  return mainProjectImages
    .reduce(
      (imageIdsStr, mainProjectImage) =>
        `${imageIdsStr},${mainProjectImage.id}`,
      ''
    )
    .replace(/^\,/, '');
}

function mappingEncImgIdToMainProjectImages(mainProjectImages, encImgIds) {
  if (!(encImgIds instanceof Array)) {
    encImgIds = [encImgIds];
  }

  return mainProjectImages.map(mainProjectImage => {
    const encImage = encImgIds.filter(
      encImgId => encImgId.id === mainProjectImage.id
    )[0];
    mainProjectImage.encImgId = encImage.encImgId;

    return mainProjectImage;
  });
}

function getFileInfo(getState, autoAddedFile) {
  const state = getState();
  const env = get(state, 'system.env');
  return {
    name: autoAddedFile.name,
    url: combine(get(env, 'urls.uploadBaseUrl'), IMAGE_SRC, {
      qaulityLevel: 0,
      puid: autoAddedFile.encImgId
    }),
    usedCount: 0,
    status: DONE,
    imageId: autoAddedFile.id,
    totalSize: autoAddedFile.size,
    guid: autoAddedFile.guid,
    uploadTime: new Date(autoAddedFile.insertTime).getTime(),
    encImgId: autoAddedFile.encImgId,
    width: autoAddedFile.width,
    height: autoAddedFile.height,
    createTime: autoAddedFile.lastModified
  };
}

function autoAddPhotoToCanvas(getState, dispatch, autoAddedFile) {
  const state = getState();
  const containers = get(state, 'project.cover.containers');
  const elementArray = get(state, 'project.elementArray');
  const crossSellCover = containers.find(
    container =>
      container.type === pageTypes.full || container.type === pageTypes.front
  );
  const fileInfo = getFileInfo(getState, autoAddedFile);

  let newData = convertObjIn(
    merge({}, fileInfo, { imageid: fileInfo.imageId })
  );

  // 获取图片的裁剪参数.
  let element = new Element(
    merge(
      newData,
      getDefaultCropLRXY(
        newData.width,
        newData.height,
        crossSellCover.width,
        crossSellCover.height
      ),
      {
        width: crossSellCover.width,
        height: crossSellCover.height
      }
    )
  );

  delete element.id;

  let crossSellPhotoElement = crossSellCover.elements
    .map(elementId => {
      const element = elementArray.find(element => element.id === elementId);
      if (element.type === elementTypes.photo) {
        return element;
      } else {
        return null;
      }
    })
    .find(element => element !== null);

  crossSellPhotoElement = {
    ...crossSellPhotoElement,
    ...element
  };

  // 新增一个element.
  dispatch({
    type: UPDATE_ELEMENT,
    element: crossSellPhotoElement
  });

  // 更新图片的使用次数
  dispatch({
    type: UPDATE_IMAGE_USED_COUNT_MAP
  });
}

export function saveProjectTitle(projectId, projectTitle) {
  return (dispatch, getState) => {
    const { system } = getState();

    const urls = system.env.urls;
    const baseUrl = urls.baseUrl;

    const userId = system.env.userInfo.id;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: SAVE_PROJECT_TITLE,
          params: {
            baseUrl,
            userId,
            projectId,
            projectName: encodeURIComponent(projectTitle)
          }
        }
      }
    });
  };
}

export function uploadCoverImage(projectId) {
  return async (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls');
    const project = get(getState(), 'project');
    const sheetIndex = get(getState(), 'system.pagination.sheetIndex');

    const userInfo = get(getState(), 'system.env.userInfo');
    const timestamp = userInfo.timestamp;
    const token = userInfo.authToken;
    const customerId = userInfo.id;

    const uploadBaseUrl = urls.uploadBaseUrl;
    const projectid = projectId || project.projectId;
    const projectType = project.setting.product;

    let encodeimage = '';

    if (sheetIndex !== 0) {
      encodeimage = get(getState(), 'system.snapData.coverSnap');
    } else {
      const bookCoverNode = document.querySelector('.box-cover');
      let data = '';

      try {
        data = await toCanvas(bookCoverNode, 300, null);
      } catch (e) {}

      if (data) {
        encodeimage = data.replace('data:image/png;base64,', '');
      }
    }

    if (
      !encodeimage ||
      (typeof encodeimage === 'string' &&
        encodeimage.substring(0, 50).length < 50)
    ) {
      return await Promise.resolve();
    }

    return await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: UPLOAD_COVER_IMAGE,
          params: {
            uploadBaseUrl,
            timestamp,
            token,
            customerId
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            projectid,
            encodeimage,
            projectType
          })
        }
      }
    });
  };
}

export function getMyPhotoImages(baseUrl, userId) {
  return (dispatch, getState) => {
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_MY_PHOTO_IMAGES,
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
            customerId: userId
          })
        }
      }
    });
  };
}

export function checkProjectTitle(paramsObj) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls');
    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: CHECK_PROJECT_TITLE,
          params: {
            baseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify(paramsObj)
        }
      }
    });
  };
}

export function updateProjectId(projectId) {
  return {
    type: UPDATE_PROJECT_ID,
    projectId
  };
}

export function deleteServerPhotos() {
  return async (dispatch, getState) => {
    const state = getState();
    const urls = get(state, 'system.env.urls');
    const baseUrl = urls.baseUrl;
    const albumId = String(get(state, 'system.env.albumId'));
    const images = get(state, 'project.deletedEncImgIds');
    if (!images.length) return null;
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: DELETE_SERVER_PHOTOS,
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
