import * as types from '../../constants/actionTypes';

export function deleteProjectImage(encImgId) {
  return {
    type: types.DELETE_PROJECT_IMAGE,
    encImgId
  };
}
