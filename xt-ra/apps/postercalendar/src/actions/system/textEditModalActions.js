import * as types from '../../constants/actionTypes';


export function showTextEditModal(data) {
  return {
    type: types.SHOW_TEXT_EDIT_MODAL,
    data
  };
}

export function hideTextEditModal() {
  return {
    type: types.HIDE_TEXT_EDIT_MODAL
  };
}
