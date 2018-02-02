import * as types from '../../../contants/actionTypes';
import { addImages } from '../images/imagesActions';

export function setOAuthUser(user) {
  return {
    type: types.SET_OAUTH_USER,
    user
  };
}

export function setOAuthToken(token) {
  return {
    type: types.SET_OAUTH_TOKEN,
    token
  };
}

export function getFacebookAlbums(albums) {
  return {
    type: types.GET_FACEBOOK_ALBUMS,
    albums
  };
}

export function setSelectAddPhotos(selectPhotos) {
  return {
    type: types.SET_SELECT_PHOTOS,
    selectPhotos
  };
}

export function deleteSelectPhotos(selectPhotos) {
  return {
    type: types.DELETE_SELECT_PHOTOS,
    selectPhotos
  };
}

export function moveAllPhotoToAddImages(selectPhotos) {
  return (dispatch, getState) => {
    //添加图片到 上传列表
    dispatch(addImages(selectPhotos.toJS()));
    dispatch({ type: types.MOVE_ALL_PHOTOS_TO_Add_IMAGES });
    //打开上传模态框
    dispatch({ type: types.TOGGLE_UPLOAD, status: true});
  };
}

export function removeAllimage(){
  return {
    type:types.REMOVE_ALL_IMAGES
  }
}
