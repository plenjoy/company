import qs from 'qs';
import { get } from 'lodash';
import { oAuthTypes, securityString } from '../../constants/strings';
import * as types from '../../constants/actionTypes';
import * as apiUrls from '../../constants/apiUrl';
import { getUrl } from '../../../../common/utils/url';
import OAuth from '../../../../common/utils/OAuth';
import { CALL_API } from '../../middlewares/api';
import { getRandomNum } from '../../../../common/utils/math';
import { generateProject, generateSku } from '../../utils/projectGenerator';

export function generateVolumes() {
  return async (dispatch, getState) => {
    const {system, projects, spec} = getState();

    const photoArray = system.photoArray;
    const oAuthUser = system.oAuth.user;
    const preVolumeArray = projects.data.get('volumes');

    dispatch({
      type: types.GENERATE_VOLUMES,
      photoArray,
      oAuthUser,
      spec: spec.data,
      preVolumeArray
    });
  };
}

export function selectVolume(volumeIdx) {
  return {
    type: types.SELECT_VOLUME,
    volumeIdx
  }
}

export function orderVolumes(volumeIds) {
  return {
    type: types.ORDER_VOLUMES,
    volumeIds
  }
}

export function changePageToCover(coverPhotoId) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CHANGE_PAGE_TO_COVER,
      photoArray: getState().system.photoArray,
      spec: getState().spec.data,
      coverPhotoId
    });
  };
}

export function changeSettings(settings) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CHANGE_SETTINGS,
      settings
    });

    dispatch({
      type: types.UPDATE_VOLUMES,
      photoArray: getState().system.photoArray,
      spec: getState().spec.data
    });
  };
}

export function changeSummary(summary) {
  return async (dispatch, getState) => {
    dispatch({
      type: types.CHANGE_SUMMARY,
      summary
    });

    refreshPrice(dispatch, getState);
    refreshPageInfo(dispatch, getState);
  };
}

function refreshPageInfo(dispatch, getState) {
  const {projects, spec} = getState();
  const currentSummary = projects.data.get('summary');
  const currentParameters = spec.data.getIn([currentSummary.get('size'), currentSummary.get('cover'), 'parameters']);
  const maxPageCount = currentParameters.getIn(['sheetNumberRange', 'max']);
  const minPageCount = currentParameters.getIn(['sheetNumberRange', 'min']);

  dispatch({
    type: types.CHANGE_PAGE_INFO,
    pageInfo: {
      max: maxPageCount,
      min: minPageCount
    }
  });
}

export function toggleCover() {
  return async (dispatch, getState) => {
    dispatch({
      type: types.TOGGLE_COVER
    });

    await refreshPrice(dispatch, getState);
  };
}

export function orderAllVolumes() {
  return {
    type: types.ORDER_ALL_VOLUMES
  }
}

export function cancelAllOrderedVolumes() {
  return {
    type: types.CANCEL_ALL_ORDERED_VOLUMES
  }
}

export function uploadThirdPartyImages(volumes) {
  return (dispatch, getState) => {
    const stateData = getState();
    const urls = get(stateData, 'system.env.urls');
    const baseUrl = urls.get('baseUrl');
    const userInfo = get(stateData, 'system.env.userInfo');
    const userId = userInfo.get('id');
    const securityToken = get(stateData, 'system.oAuth.token').get('accessToken');

    const photoUrls = [];
    const photoObjs = [];

    volumes = volumes.toJS();

    for(const volume of volumes) {
      if(volume.isOrder) {
        const url = get(volume, 'cover.photo.url');
        const photo = get(volume, 'cover.photo');

        if(url) {
          photoUrls.push(url);
          photoObjs.push(photo);
        }

        for(const page of volume.pages) {
          const url = get(page, 'photo.url');
          const photo = get(page, 'photo');

          if(url) {
            photoUrls.push(url);
            photoObjs.push(photo);
          }
        }
      }
    }
    
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.UPLOAD_THIRD_PARTY_IMAGES,
          params: { baseUrl }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            uid: userId,
            platformId: OAuth.authType === oAuthTypes.FACEBOOK ? 1 : 2,
            'urls[]': photoUrls.toString(),
            // securityToken,
            // timestamp: Date.now()
          })
        }
      }
    });
  }
}

export function saveProject(index=0) {
  return (dispatch, getState) => {
    const stateData = getState();
    const urls = get(stateData, 'system.env.urls');
    const userInfo = get(stateData, 'system.env.userInfo');
    const userId = userInfo.get('id');
    const baseUrl = urls.get('baseUrl');
    const projects = get(stateData, 'projects.data');
    const projectId = '';
    const settings = projects.get('summary');
    const projectType = settings.get('product');
    const theVolume = projects.getIn(['volumes', String(index)]);
    const pageInfo = projects.get('pageInfo');
    const specVersion = '1.0';

    const projectJson = generateProject(theVolume, settings, userInfo, pageInfo, specVersion);
    const skuObj = generateSku(projectJson);

    const requestApiUrl = apiUrls.NEW_PROJECT;

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
            title: `Little Timeline Book(Volume ${index + 1}) - ${Date.now()}`,
            projectJson: JSON.stringify(projectJson),
            skuJson: JSON.stringify(skuObj),
            requestKey: requestKeyArray.join('|')
          })
        }
      }
    });
  };
}

export function uploadCoverImage(encodeImage, projectId) {
  return (dispatch, getState) => {
    const stateData = getState();
    const urls = get(stateData, 'system.env.urls');
    const userInfo = get(stateData, 'system.env.userInfo');
    const userId = userInfo.get('id');
    // const baseUrl = urls.get('baseUrl');
    const uploadBaseUrl = urls.get('uploadBaseUrl');
    const projects = get(stateData, 'projects.data');
    const settings = projects.get('summary');
    const projectType = settings.get('product');

    if (!encodeImage || (typeof encodeImage === 'string' &&
      encodeImage.substring(0, 50).length < 50)) {
      return Promise.resolve();
    }

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.UPLOAD_COVER_IMAGE,
          params: {
            uploadBaseUrl
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            projectid: projectId,
            encodeimage: encodeImage,
            projectType,
            ...securityString.get()
          })
        }
      }
    });
  };
}

async function refreshPrice(dispatch, getState) {
  const urls = getUrl(getState(), 'system.env.urls');
  const baseUrl = urls.get('baseUrl');
  const summary = getState().projects.data.get('summary');

  const { data } = await dispatch({
    [CALL_API]: {
      apiPattern: {
        name: apiUrls.ITEM_PRICE,
        params: {
          baseUrl,
          product: summary.get('product'),
          options: `${summary.get('cover')},${summary.get('size')}`,
          autoRandomNum: getRandomNum()
        }
      }
    }
  });

  dispatch({
    type: types.CHANGE_PRICE,
    price: {
      oriPrice: +data.main.oriPrice,
      sPrice: +data.main.sPrice
    }
  });
}

export function getPreviewProject() {
  return async (dispatch, getState) => {
    const { spec } = getState();
    const { urls, qs } = get(getState(), 'system.env');
    const baseUrl = urls.get('baseUrl');
    const initGuid = qs.get('initGuid');
    const autoRandomNum = getRandomNum();

    const response = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.GET_PREVIEW_PROJECT_DATA,
          params: { baseUrl, initGuid, autoRandomNum }
        }
      }
    });

    const projectJSON = JSON.parse(response.data);

    const {
      spec: projectSpec,
      cover: projectCover,
      pages: projectPages
    } = projectJSON.project;

    dispatch({
      type: types.GET_PREVIEW_PROJECT,
      spec: spec.data,
      projectSpec,
      projectCover,
      projectPages
    });

    refreshPageInfo(dispatch, getState);
  }
}