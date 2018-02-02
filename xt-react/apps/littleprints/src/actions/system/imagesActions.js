import {
  ADD_IMAGES,
  RETRY_IMAGE,
  DELETE_IMAGE,
  UPLOAD_COMPLETE,
  CLEAR_IMAGES,
  AUTO_ADD_PHOTO_TO_CANVAS
} from '../../constants/actionTypes';

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

    dispatch({ type: ADD_IMAGES, files });

    return true;
  };
}

export function retryImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: RETRY_IMAGE,
      guid
    });
  };
}

export function uploadComplete(fields) {
  return (dispatch, getState) => {
    dispatch({
      type: UPLOAD_COMPLETE,
      fields
    });

    return Promise.resolve();
  };
}

export function deleteImage(guid) {
  return (dispatch, getState) => {
    return dispatch({
      type: DELETE_IMAGE,
      guid
    });
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
    type: AUTO_ADD_PHOTO_TO_CANVAS,
    params
  };
}

export function clearAllImages() {
  return {
    type: CLEAR_IMAGES
  };
}
