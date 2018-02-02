import * as types from '../../contants/actionTypes';

export function deleteProjectImage(encImgId) {
  return {
    type: types.DELETE_PROJECT_IMAGE,
    encImgId
  };
}
