import qs from 'qs';
import * as types from '../../../constants/actionTypes';
import * as textHelper from '../../../utils/textHelper';
import * as apiUrls from '../../../constants/apiUrl';
import { getUrl } from '../../../../../common/utils/url';
import { CALL_API } from '../../../middlewares/api';
import { getRandomNum } from '../../../../../common/utils/math';

/**
 * 在System下添加photoArray图片
 *
 * @param {*} photos
 */
export function addPhotos(photos) {
  return async (dispatch, getState) => {
    // 获取spec参数
    const { data } = getState().spec;
    const { modals } = getState().system;
    const innerPageSize = data.getIn(['6X6', 'TLBSC', 'parameters', 'innerPageSize']);

    if(!modals.fontCalculator.get('isInitialized')) {
      // 设置真实的DOM环境，模拟caption text
      dispatch({
        type: types.SET_FONT_CALCULATOR_SETTINGS,
        settings: {
          minHeight: innerPageSize.get('captionFontSize') * 3 + innerPageSize.get('captionFontSize') / 2,
          maxHeight: innerPageSize.get('captionFontSize') * 23 + innerPageSize.get('captionFontSize') / 2,
          width: innerPageSize.get('innerImageWidth'),
          fontSize: innerPageSize.get('captionFontSize'),
          textAlign: 'center'
        }
      });
    }

    const newPhotos = [];

    for(const photo of photos) {
      newPhotos.push(photo);
    }

    dispatch({
      type: types.ADD_PHOTOS,
      photos: newPhotos
    });
  };
}

export function setIsCaptionOutOfSize(captionMap) {
  return async (dispatch, getState) => {
    dispatch({
      type: types.SET_IS_CAPTION_OUT_OF_SIZE,
      captionMap
    });
  };
}

/**
 * 给photoArray排序
 */
export function sortPhotos() {
  return {
    type: types.SORT_PHOTOS
  };
}

/**
 * 清除photoArray
 */
export function clearPhotos() {
  return {
    type: types.CLEAR_PHOTOS
  };
}

/**
 * exclude图片，并且向服务器同步
 *
 * @param {*} ids
 */
export function excludePhotos(ids) {
  return async (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');
    const customerId = getState().system.env.userInfo.get('id').toString();

    const imageList = getState().system.photoArray

      .filter(photo => ids.includes(photo.get('id')))

      .map(photo => ({
        thirdpartyImageId: photo.get('id'),
        imageUrl: photo.get('originalImageUrl')
      }));

    const { message, errorCode } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.ADD_EXCLUDE_PHOTOS,
          params: {
            baseUrl,
            autoRandomNum: getRandomNum()
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            customerId,
            imageList: imageList.toJS()
          })
        }
      }
    });

    if (errorCode === '200') {
      dispatch({
        type: types.EXCLUDE_PHOTOS,
        ids
      });

      dispatch({
        type: types.UPDATE_VOLUMES,
        photoArray: getState().system.photoArray,
        spec: getState().spec.data
      });
    } else {
      console.log(message);
    }
  };
}

/**
 * include图片，并且向服务器同步
 *
 * @param {*} ids
 */
export function includePhotos(ids) {
  return async (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');
    const customerId = getState().system.env.userInfo.get('id').toString();

    const { message, errorCode } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.DELETE_EXCLUDE_PHOTOS,
          params: {
            baseUrl,
            autoRandomNum: getRandomNum()
          }
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: qs.stringify({
            customerId,
            imageIds: ids.toString()
          })
        }
      }
    });

    if (errorCode === '200') {
      dispatch({
        type: types.INCLUDE_PHOTOS,
        ids
      });

      dispatch({
        type: types.UPDATE_VOLUMES,
        photoArray: getState().system.photoArray,
        spec: getState().spec.data
      });
    } else {
      console.log(message);
    }
  };
}

/**
 * 浏览器计算caption文本是否超出三行尺寸
 *
 * @param {*} containerDOM
 * @param {*} innerDOM
 */
function isCaptionOutOfSize(containerDOM, innerDOM, text) {
  let isCaptionOutOfSize = false;
  let isCaptionLineBreakThree = text.split('\n').length > 2;

  // 如果有文本，并且超过三行回车，直接换页
  if(text && isCaptionLineBreakThree) {
    isCaptionOutOfSize = true;

  // 如果有文本，但没有超过三行回车，则放入dom计算
  } else if(text) {
    innerDOM.innerHTML = text;
    isCaptionOutOfSize = containerDOM.clientHeight < +getComputedStyle(innerDOM).height.replace('px', '');
  }

  return isCaptionOutOfSize;
}

/**
 * 向服务器获取Exclude图片列表
 */
export function getRemoteExcludePhotos() {
  return async (dispatch, getState) => {
    const urls = getUrl(getState(), 'system.env.urls');
    const baseUrl = urls.get('baseUrl');
    const customerId = getState().system.env.userInfo.get('id');

    const { data, errorCode, message } = await dispatch({
      [CALL_API]: {
        apiPattern: {
          name: apiUrls.GET_EXCLUDE_PHOTOS,
          params: {
            baseUrl,
            autoRandomNum: getRandomNum(),
            customerId
          }
        }
      }
    });

    if (errorCode === '200') {
      dispatch({
        type: types.EXCLUDE_PHOTOS,
        ids: data
      });
    } else {
      console.log(message);
    }
  };
}
