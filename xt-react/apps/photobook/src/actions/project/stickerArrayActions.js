import * as types from '../../contants/actionTypes';


export function addProjectSticker(sticker) {
  return {
    type: types.ADD_PROJECT_STICKER,
    sticker
  };
}

export function deleteProjectSticker(stickerId) {
  return {
    type: types.DELETE_PROJECT_STICKER,
    stickerId
  };
}
