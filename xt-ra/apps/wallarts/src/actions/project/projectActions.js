import qs from 'qs';
import { get, merge, isNumber, isArray } from 'lodash';
import { generateProject, generateSku } from '../../utils/projectGenerator';
import { getDataFromState } from '../../utils/getDataFromState';

import { CALL_API } from '../../middlewares/api';
import * as apiUrl from '../../constants/apiUrl';
import * as types from '../../constants/actionTypes';
import { computeNewData, changeProjectSetting } from './settingActions';
import Immutable, { fromJS } from 'immutable';
import { getImageUsedMap } from './imageUsedMapActions';
import { guid } from '../../../../common/utils/math';
import { getCropOptions, getFitCrop } from '../../utils/crop';
import projectParser from '../../../../common/utils/projectParser';
import { pageTypes, elementTypes, productTypes } from '../../constants/strings';

export function saveProject(newTitle = '') {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { urls, property, setting } = stateData;
    const { project, spec, system } = getState();
    const env = system.env;
    const baseUrl = urls.get('baseUrl');

    const { userInfo } = env;
    const specVersion = spec.get('version');

    const projectId = property.get('projectId');
    const projectType = setting.get('product');
    const userId = userInfo.get('id');

    const projectObj = generateProject(project.data, userInfo, specVersion);
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

const handleProjectData = (res, getState, dispatch) => {
  if (!res || !res.project) {
    return;
  }
  let stateData = getDataFromState(getState());
  const { setting, configurableOptionArray, allOptionMap } = stateData;
  const projectObj = res.project;
  let newSetting = projectObj.spec;

  if (newSetting) {
    newSetting.category = projectParser.getKeyPatternsByValue('product', newSetting.product, 'category', configurableOptionArray)[0];
    newSetting = projectParser.getNewProjectSetting(
      setting.toJS(),
      newSetting,
      configurableOptionArray,
      allOptionMap
    );
    

  }

  if(!projectObj.photoFrame && !newSetting){
    newSetting = projectObj.pages[0].spec;
    if(newSetting.client){
      const settingObj = setting.toJS();
      for(let obj in settingObj){
        if(!newSetting[obj]){
          newSetting[obj] = 'none';
        }
      }
      if(newSetting.product.indexOf('table') !== -1){
        newSetting.category = 'categoryTableTop';
        newSetting.frameStyle = 'none';
      }
      delete newSetting.client;
    }
    projectObj.pages[0].canvasBorderThickness = {};
    projectObj.pages[0].canvasBorderThickness.left = projectObj.pages[0]
      .canvasBorder
      ? projectObj.pages[0].canvasBorder.left
      : 0;
    projectObj.pages[0].canvasBorderThickness.right = projectObj.pages[0]
      .canvasBorder
      ? projectObj.pages[0].canvasBorder.right
      : 0;
    projectObj.pages[0].canvasBorderThickness.top = projectObj.pages[0]
      .canvasBorder
      ? projectObj.pages[0].canvasBorder.top
      : 0;
    projectObj.pages[0].canvasBorderThickness.bottom = projectObj.pages[0]
      .canvasBorder
      ? projectObj.pages[0].canvasBorder.bottom
      : 0;
  }
  if(!newSetting){
    if(isArray(projectObj.images.image)){
      projectObj.images = projectObj.images.image;
    }else{
      if(!projectObj.images.image){
        projectObj.images = [];
      }else{
        projectObj.images = [projectObj.images.image];
      }
    }

    let settingObj = {};
    for(let obj of projectObj.photoFrame.spec.option){
      settingObj[obj.id] = obj.value;
    }
    const frameBoard = projectObj.photoFrame.frameBoard;
    const photosLayer = frameBoard.photosLayer;
    const matteLayer = frameBoard.matteLayer
      ? {
          top: frameBoard.matteLayer.matteTop,
          bottom: frameBoard.matteLayer.matteBottom,
          left: frameBoard.matteLayer.matteLeft,
          right: frameBoard.matteLayer.matteRight
        }
      : {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
    settingObj.orientation =
      frameBoard.rotated === 'true' ? 'Landscape' : 'Portrait';
    newSetting = settingObj;

    photosLayer.elements.element.id = guid();
    const findImage = projectObj.images.find(
      o =>
        o &&
        o.id &&
        photosLayer.elements.element.imageid &&
        o.id === photosLayer.elements.element.imageid
    );
    if(findImage){
      photosLayer.elements.element.encImgId = findImage.encImgId;
    }

    projectObj.pages = [
      {
        id: guid(),
        type: 'Page',
        elements: [photosLayer.elements.element],
        spec: newSetting,
        bleed: {
          top: photosLayer.bleedTop,
          bottom: photosLayer.bleedBottom,
          left: photosLayer.bleedLeft,
          right: photosLayer.bleedRight
        },
        boardInMatting: {
          top: frameBoard.boardInMattingTop,
          bottom: frameBoard.boardInMattingBottom,
          left: frameBoard.boardInMattingLeft,
          right: frameBoard.boardInMattingRight
        },
        canvasBorder: {
          top: frameBoard.canvasBorderThicknessTop,
          bottom: frameBoard.canvasBorderThicknessBottom,
          left: frameBoard.canvasBorderThicknessLeft,
          right: frameBoard.canvasBorderThicknessRight,
          color: parseInt(frameBoard.canvasBorderColor)
        },
        canvasBorderThickness: {
          top: frameBoard.canvasBorderThicknessTop,
          bottom: frameBoard.canvasBorderThicknessBottom,
          left: frameBoard.canvasBorderThicknessLeft,
          right: frameBoard.canvasBorderThicknessRight
        },
        frameBorderThickness: {
          top: frameBoard.frameBorderThicknessTop,
          bottom: frameBoard.frameBorderThicknessBottom,
          left: frameBoard.frameBorderThicknessLeft,
          right: frameBoard.frameBorderThicknessRight
        },
        matteSize: matteLayer,
        backend: {
          isPrint: true,
          slice: false
        }
      }
    ];
  }

  /*if(newSetting.product === 'floatFrame'){
    newSetting.product = 'floatFrame_modernFrame';
  }*/

  dispatch({
    type: types.INIT_PROJECT_SETTING,
    setting: newSetting
  });

  stateData = getDataFromState(getState());
  const { property } = stateData;

  const result = Immutable.fromJS(computeNewData(stateData, newSetting));
  const newPageArray = result.get('pageArray');

  const imageArray = projectObj.images;
  const serverPages = Immutable.fromJS(projectObj.pages);
  const resetedPageArray = getResetedPageArray(serverPages, newPageArray);

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
    imageArray: Immutable.fromJS(imageArray)
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
};

function getResetedPageArray(serverPages, newPageArray) {
  let outPageArray = serverPages;

  const firstNewPage = newPageArray.first();
  const overwritePageObj = {
    width: firstNewPage.get('width'),
    height: firstNewPage.get('height'),
    bleed: firstNewPage.get('bleed')
  };

  outPageArray.forEach((page, index) => {
    outPageArray = outPageArray.set(
      String(index),
      page.merge(overwritePageObj)
    );
  });

  return recalculateElementAttrsByPageArray(outPageArray);
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

function recalculateElementAttrs(elements, pageWidth, pageHeight) {
  return elements.map(element => {
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
export function cloneProject(newTitle) {
  return saveProject(newTitle);
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

//获取主工程图片列表，并把符合encImgId的图片应用到cover上面，仅在新项目创建的时候会被触发
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
        mainProjectImages = get(
          x2jsInstance.xml2js(mainProjectImages),
          'images.image'
        );

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

        imageArray.sort((prev, next) => {
          if (next.encImgId === encodeURIComponent(encImgId)) {
            return 1;
          }
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
    const deletedEncImgIds = project.deletedEncImgIds.toJS();
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

export function swapPhotoElement(
  fromPageId,
  fromElementId,
  toPageId,
  toElementId
) {
  return (dispatch, getState) => {
    const stateData = getDataFromState(getState());
    const { pageArray, imageArray, containers, ratioMap } = stateData;

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
      const toImageRot = toElement.get('imgRot');
      const imageWidth =
        Math.abs(toImageRot) === 90
          ? toImage.get('height')
          : toImage.get('width');
      const imageHeight =
        Math.abs(toImageRot) === 90
          ? toImage.get('width')
          : toImage.get('height');

      const fromCropOptions = getFitCrop(
        imageWidth,
        imageHeight,
        toElement.get('cropLUX'),
        toElement.get('cropLUY'),
        toElement.get('cropRLX') - toElement.get('cropLUX'),
        toElement.get('cropRLY') - toElement.get('cropLUY'),
        fromElement.get('width'),
        fromElement.get('height'),
        fromElement.get('width'),
        fromElement.get('height'),
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

    const fromImageRot = fromElement.get('imgRot');
    const fromImageWidth =
      Math.abs(fromImageRot) === 90
        ? fromImage.get('height')
        : fromImage.get('width');
    const fromImageHeight =
      Math.abs(fromImageRot) === 90
        ? fromImage.get('width')
        : fromImage.get('height');

    const toCropOptions = getFitCrop(
      fromImageWidth,
      fromImageHeight,
      fromElement.get('cropLUX'),
      fromElement.get('cropLUY'),
      fromElement.get('cropRLX') - fromElement.get('cropLUX'),
      fromElement.get('cropRLY') - fromElement.get('cropLUY'),
      toElement.get('width'),
      toElement.get('height'),
      toElement.get('width'),
      toElement.get('height'),
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

