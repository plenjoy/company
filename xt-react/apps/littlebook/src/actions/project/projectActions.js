import { get, merge } from 'lodash';
import Immutable from 'immutable';
import qs from 'qs';

import { CALL_API } from '../../middlewares/api';
import * as apiUrl from '../../contants/apiUrl';
import * as types from '../../contants/actionTypes';
import {
  DEFAULT_FONT_FAMILY_ID,
  DEFAULT_FONT_WEIGHT_ID,
  PARENT_BOOK_SIZE,
  pageTypes,
  elementTypes
} from '../../contants/strings';

import { getRandomNum, guid, getPxByInch } from '../../../../common/utils/math';
import { generateProject, generateSku } from '../../utils/projectGenerator';
import { getCropOptions } from '../../utils/crop';
import { computedSpineTextSize } from '../../utils/elementHelper';

function resolveMobileCompatibilities(project) {
  const outProject = Object.assign({}, project);

  // 1. android的page的type不正确. 应该是sheet + page.
  if (/android/i.test(outProject.createAuthor)) {
    outProject.pages.forEach((page, index) => {
      if (!page.backend.isPrint && page.type === pageTypes.sheet) {
        outProject.pages[index].type = pageTypes.page;
      }
    });

    const spinePageIndex = outProject.cover.containers.findIndex(
      page => page.type === pageTypes.spine
    );
    if (spinePageIndex !== -1) {
      const spinePage = outProject.cover.containers[spinePageIndex];
      const spinePageHight = spinePage.height;
      const spinePageWidth = spinePage.width;

      const spinePageElementIndex = spinePage.elements.findIndex(
        ele => ele.type === elementTypes.text
      );
      if (spinePageElementIndex !== -1) {
        // 找到spinetextelement 修改为我们使用的 数据
        const spineTextElement = spinePage.elements[spinePageElementIndex];

        const spineTextElemenObj = computedSpineTextSize(
          spinePageWidth,
          spinePageHight
        );

        const spineTextElementWidth = spineTextElemenObj.spineTextElementWidth;
        const spineTextElementHeight =
          spineTextElemenObj.spineTextElementHeight;

        spineTextElement.height = spineTextElementHeight;
        spineTextElement.width = spineTextElementWidth;
        spineTextElement.pw = spineTextElementWidth / spinePageWidth;
        spineTextElement.ph = spineTextElementHeight / spinePageHight;
        spineTextElement.textAlign = 'center';
        spineTextElement.textVAlign = 'middle';

        outProject.cover.containers[spinePageIndex].elements[
          spinePageElementIndex
        ] = spineTextElement;
      }
    }
  }

  // 2. ios的project中的page, 缺少id字段.
  outProject.cover.containers.forEach((page, index) => {
    const updateObject = {};
    if (!page.id) {
      updateObject.id = guid();
    }

    if (!page.template) {
      updateObject.template = {};
    }

    outProject.cover.containers[index] = Object.assign({}, page, updateObject);
  });

  outProject.pages.forEach((page, index) => {
    const updateObject = {};
    if (!page.id) {
      updateObject.id = guid();
    }

    if (!page.template) {
      updateObject.template = {};
    }

    outProject.pages[index] = Object.assign({}, page, updateObject);
  });

  return outProject;
}

/**
 * 处理获取到的project的返回值.
 * @param res
 * @param dispatch
 */
const handleProjectData = (res, fontList, dispatch) => {
  const projectObj = resolveMobileCompatibilities(res.project);

  // 过滤cover页面空的photoelement
  projectObj.cover.containers.forEach(container => {
    if (
      container.type === pageTypes.full &&
      !get(container, 'template.tplGuid')
    ) {
      const newElement = container.elements.filter(element => {
        return (
          (element.encImgId && element.type === elementTypes.photo) ||
          element.type !== elementTypes.photo
        );
      });
      container.elements = newElement;
    }
  });

  dispatch({
    type: types.INIT_PROJECT_SETTING,
    setting: projectObj.spec
  });

  const addedSheetNumber = projectObj.summary.pageAdded / 2;

  dispatch({
    type: types.INIT_COVER,
    cover: projectObj.cover,
    addedSheetNumber
  });

  dispatch({
    type: types.INIT_PAGE_ARRAY,
    pages: projectObj.pages
  });

  dispatch({
    type: types.INIT_IMAGE_ARRAY,
    images: projectObj.images
  });

  dispatch({
    type: types.INIT_DECORATION_ARRAY,
    decorations: projectObj.decorations
  });

  const serverBookSetting = projectObj.summary.editorSetting;
  const theFontFamily = fontList.find(o => {
    return o.id === serverBookSetting.font.fontFamilyId;
  });

  if (theFontFamily && theFontFamily.deprecated) {
    dispatch({
      type: types.CHANGE_BOOK_SETTING,
      bookSetting: {
        font: merge({}, serverBookSetting.font, {
          fontFamilyId: DEFAULT_FONT_FAMILY_ID,
          fontId: DEFAULT_FONT_WEIGHT_ID
        })
      }
    });
  }
};

export function getProjectData(userId, projectId, webClientId, fontList) {
  return (dispatch, getState) => {
    const env = get(getState(), 'system.env');
    const baseUrl = env.urls.get('baseUrl');

    const autoRandomNum = getRandomNum();

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_DATA,
          params: {
            baseUrl,
            userId,
            projectId,
            webClientId,
            autoRandomNum
          }
        }
      }
    }).then(res => {
      handleProjectData(res, fontList, dispatch);
    });
  };
}

export function getPreviewProjectData(projectId) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const uploadBaseUrl = urls.uploadBaseUrl;
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PREVIEW_PROJECT_DATA,
          params: {
            uploadBaseUrl,
            projectId: encodeURIComponent(projectId)
          }
        }
      }
    }).then(res => {
      handleProjectData(res, [], dispatch);
    });
  };
}

export function getProjectTitle(userId, projectId) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.GET_PROJECT_TITLE,
          params: {
            baseUrl,
            userId,
            projectId
          }
        }
      }
    });
  };
}

export function changeProjectSetting(setting) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CHANGE_PROJECT_SETTING,
      setting
    });
    return Promise.resolve(getState());
  };
}

export function changeBookSetting(bookSetting, fontList) {
  return {
    type: types.CHANGE_BOOK_SETTING,
    bookSetting,
    fontList
  };
}

export function projectLoadCompleted() {
  return {
    type: types.PROJECT_LOAD_COMPLETED
  };
}

export function deleteProjectImage(encImgId) {
  return {
    type: types.DELETE_PROJECT_IMAGE,
    encImgId
  };
}

export function saveProject(project, userInfo, specVersion, newTitle = '') {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    const projectId = project.get('projectId');
    const projectType = project.getIn(['setting', 'product']);
    const userId = userInfo.get('id');

    const projectObj = generateProject(project, userInfo, specVersion);
    const skuObj = generateSku(projectObj);

    const isSaveNewProject = Boolean(newTitle);

    let requestApiUrl = null;
    let projectTitle = project.get('title');

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
      project.getIn(['setting', 'product']),
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
            requestKey: requestKeyArray.join('|')
          })
        }
      }
    });
  };
}

export function cloneProject(project, userInfo, specVersion, newTitle) {
  return saveProject(project, userInfo, specVersion, newTitle);
}

export function updateProjectId(projectId) {
  return {
    type: types.UPDATE_PROJECT_ID,
    projectId
  };
}

export function createContainer(containerType, width, height, bleed) {
  return {
    type: types.CREATE_CONTAINER,
    containerType,
    width,
    height,
    bleed
  };
}

export function deleteContainer(containerId) {
  return {
    type: types.DELETE_CONTAINER,
    containerId
  };
}

export function createDualPage(insertIndex) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_DUAL_PAGE,
      insertIndex,
      n: 1
    });

    return Promise.resolve();
  };
}

export function createMultipleDualPage(insertIndex, n) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_MULTIPLE_DUAL_PAGE,
      insertIndex,
      n
    });

    return Promise.resolve();
  };
}

export function deleteDualPage(leftPageId, rightPageId) {
  return (dispatch, getState) => {
    dispatch({
      type: types.DELETE_DUAL_PAGE,
      dualPageIdList: [
        {
          leftPageId,
          rightPageId
        }
      ]
    });

    return Promise.resolve();
  };
}

export function deleteMultipleDualPage(dualPageIdList) {
  return (dispatch, getState) => {
    dispatch({
      type: types.DELETE_MULTIPLE_DUAL_PAGE,
      dualPageIdList
    });

    return Promise.resolve();
  };
}

export function createElement(pageId, element, type = types.CREATE_ELEMENT) {
  return (dispatch, getState) => {
    const newElementId = guid();

    const newElement = merge({}, element, { id: newElementId });
    dispatch({
      type,
      pageId,
      element: Immutable.fromJS(newElement)
    });

    return Promise.resolve(newElement);
  };
}

export function createElements(pageId, elements, type = types.CREATE_ELEMENTS) {
  return (dispatch, getState) => {
    let newElements = Immutable.List();

    elements.forEach(element => {
      const newElement = merge({}, element, { id: guid() });

      newElements = newElements.push(Immutable.fromJS(newElement));
    });

    dispatch({
      type,
      pageId,
      elements: newElements
    });

    return Promise.resolve(newElements);
  };
}

export function deleteElement(pageId, elementId) {
  return (dispatch, getState) => {
    dispatch({
      type: types.DELETE_ELEMENT,
      pageId,
      elementId
    });

    return Promise.resolve({
      pageId,
      elementId
    });
  };
}

export function deleteElements(pageId, elementIds) {
  return (dispatch, getState) => {
    dispatch({
      type: types.DELETE_ELEMENTS,
      pageId,
      elementIds
    });

    return Promise.resolve({
      pageId,
      elementIds
    });
  };
}

export function deleteAll() {
  return (dispatch, getState) => {
    dispatch({
      type: types.DELETE_ALL
    });

    return Promise.resolve();
  };
}

export function updateElement(element) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_ELEMENT,
      element
    });
    return Promise.resolve();
  };
}

export function updateElements(elements) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_ELEMENTS,
      elements
    });
    return Promise.resolve();
  };
}

export function saveProjectTitle(projectId, projectTitle) {
  return (dispatch, getState) => {
    const { system } = getState();

    const urls = system.env.urls;
    const baseUrl = urls.get('baseUrl');

    const userId = system.env.userInfo.get('id');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.SAVE_PROJECT_TITLE,
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

export function changeProjectTitle(title) {
  return {
    type: types.CHANGE_PROJECT_TITLE,
    title
  };
}

export function applyTemplate(
  pageId,
  templateId,
  elements,
  actionType = types.APPLY_TEMPLATE
) {
  return (dispatch, getState) => {
    const templateDataArray = Immutable.fromJS([
      {
        pageId,
        templateId,
        elements
      }
    ]);

    dispatch({
      type: actionType,
      templateDataArray
    });

    return Promise.resolve({
      data: templateDataArray
    });
  };
}

export function applyTemplateToPages(
  templateDataArray,
  actionType = types.APPLY_TEMPLATE
) {
  return (dispatch, getState) => {
    dispatch({
      type: actionType,
      templateDataArray
    });

    return Promise.resolve({
      data: templateDataArray
    });
  };
}

export function checkProjectTitle(paramsObj) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.CHECK_PROJECT_TITLE,
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

export function uploadCoverImage(projectId, encodeimage) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const userInfo = get(getState(), 'system.env.userInfo').toJS();
    const uploadBaseUrl = urls.uploadBaseUrl;
    const project = get(getState(), 'project.data.present');
    const projectid = projectId || project.get('projectId');
    const projectType = project.getIn(['setting', 'product']);
    const timestamp = userInfo.timestamp;
    const token = userInfo.authToken;
    const customerId = userInfo.id;
    if (
      !encodeimage ||
      (typeof encodeimage === 'string' &&
        encodeimage.substring(0, 50).length < 50)
    ) {
      return Promise.resolve();
    }

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.UPLOAD_COVER_IMAGE,
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

export function checkProjectInfo(projectid) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;
    const autoRandomNum = getRandomNum();
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrl.CHECK_PROJECT_INFO,
          params: {
            baseUrl,
            projectid,
            autoRandomNum
          }
        }
      }
    });
  };
}

export function resetProjectInfo() {
  return {
    type: types.RESET_PROJECT_INFO
  };
}

export function changePageBgColor(pageId, bgColor) {
  return {
    type: types.CHANGE_PAGE_BGCOLOR,
    pageId,
    bgColor
  };
}

export function updatePageTemplateId(pageId, templateId = '') {
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

/**
 * 获取项目的订单信息.
 */
export function getProjectOrderedState(userId, projectId) {
  return (dispatch, getState) => {
    const urls = get(getState(), 'system.env.urls').toJS();
    const baseUrl = urls.baseUrl;

    return dispatch({
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
  };
}

/**
 * 重置project的订单状态.
 *  - ordered: false,
 *  - checkFailed: false
 */
export function resetProjectOrderedState() {
  return {
    type: types.RESET_PROJECT_ORDERED_STATUS
  };
}

/**
 * 提交打回的订单.
 */
export function submitCheckFailProject() {
  return (dispatch, getState) => {
    const state = getState();
    const baseUrl = get(state, 'system.env.urls').get('baseUrl');

    const project = get(state, 'project.data.present');
    const projectId = project.get('projectId');

    const userId = get(state, 'system.env.userInfo').get('id');

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

export function swapPhotoElement(
  fromPageId,
  fromElementId,
  toPageId,
  toElementId
) {
  return (dispatch, getState) => {
    const state = getState();
    const project = get(state, 'project.data.present');
    const ratioMap = get(state, 'system.global.ratio');

    const ratio = ratioMap.get('innerWorkspaceForArrangePages');

    const elementArray = project.get('elementArray');
    const imageArray = project.get('imageArray');

    let fromElement = null;
    let toElement = null;

    elementArray.forEach(element => {
      if (element.get('id') === fromElementId) {
        fromElement = element;
      }

      if (element.get('id') === toElementId) {
        toElement = element;
      }
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

    if (!fromImage || !toImage) {
      return Promise.reject();
    }

    const fromCropOptions = getCropOptions(
      toImage.get('width'),
      toImage.get('height'),
      fromElement.get('width') * ratio,
      fromElement.get('height') * ratio,
      toElement.get('imgRot')
    );

    const toCropOptions = getCropOptions(
      fromImage.get('width'),
      fromImage.get('height'),
      toElement.get('width') * ratio,
      toElement.get('height') * ratio,
      fromElement.get('imgRot')
    );

    const updateObjectArray = [
      {
        id: fromElementId,
        encImgId: toElement.get('encImgId'),
        imgRot: toElement.get('imgRot'),
        cropLUX: fromCropOptions.cropLUX,
        cropLUY: fromCropOptions.cropLUY,
        cropRLX: fromCropOptions.cropRLX,
        cropRLY: fromCropOptions.cropRLY
      },
      {
        id: toElementId,
        encImgId: fromElement.get('encImgId'),
        imgRot: fromElement.get('imgRot'),
        cropLUX: toCropOptions.cropLUX,
        cropLUY: toCropOptions.cropLUY,
        cropRLX: toCropOptions.cropRLX,
        cropRLY: toCropOptions.cropRLY
      }
    ];

    dispatch({
      type: types.UPDATE_ELEMENTS,
      elements: updateObjectArray
    });

    return Promise.resolve();
  };
}

/**
 * 是否要自动保存项目.
 */
export function autoSaveProject(isAutoSaveProject = false) {
  return {
    type: types.AUTO_SAVE_PROJECT,
    isAutoSaveProject
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
    const project = get(state, 'project.data.present');
    const deletedEncImgIds = project.get('deletedEncImgIds').toJS();
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
