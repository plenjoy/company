import * as types from '../../contants/actionTypes';


export function addProjectBackground(background) {
  return {
    type: types.ADD_PROJECT_BACKGROUND,
    background
  };
}

export function deleteProjectBackground(backgroundId) {
  return {
    type: types.DELETE_PROJECT_BACKGROUND,
    backgroundId
  };
}
