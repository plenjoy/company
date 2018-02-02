import * as types from '../../contants/actionTypes';

export function addImages(files) {
  return (dispatch, getState) => {
    const state = getState();
    const { system } = state;

    // 未登录不上传
    if (!system.env.userInfo) {
      return false;
    }

    // 将格式不对的图片排到前面
    files.sort(item => {
      return (
        ['image/jpeg', 'image/jpg', 'image/png', 'image/x-png'].indexOf(
          item.type
        ) !== -1
      );
    });

    dispatch({ type: types.ADD_IMAGES, files });

    return true;
  };
}

export function deleteImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: types.DELETE_IMAGE,
      guid
    });
  };
}

export function retryImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: types.RETRY_IMAGE,
      guid
    });
  };
}

export function uploadComplete(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPLOAD_COMPLETE,
      fields
    });

    return Promise.resolve();
  };
}

/*
 * 用于设置, 在图片上传完成后, 自动添加到画布中去.
 * @param {boolean} status true: 自动添加到画布, false: 不需要添加
 * @param {string} spreadId
 * @param targetWidth 当前容器, 或画布的宽, 用于图片裁剪
 * @param targetHeight 当前容器, 或画布的高, 用于图片裁剪
 * @returns {{type, status: *, spreadId: *, targetWidth: *, targetHeight: *}}
 */
export function autoAddPhotoToCanvas(params) {
  return {
    type: types.AUTO_ADD_PHOTO_TO_CANVAS,
    params
  };
}

export function addStatusCount(fieldName, count) {
  return {
    type: types.ADD_STATUS_COUNT,
    params: {
      fieldName,
      count
    }
  };
}

export function updateStatusCount(fieldName, count) {
  return {
    type: types.UPDATE_STATUS_COUNT,
    params: {
      fieldName,
      count
    }
  };
}

export function resetStatusCount() {
  return {
    type: types.RESET_STATUS_COUNT
  };
}

export function clearAllImages() {
  return {
    type: types.CLEAR_IMAGES
  };
}
