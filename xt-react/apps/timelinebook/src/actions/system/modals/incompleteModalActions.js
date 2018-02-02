import * as types from '../../../constants/actionTypes';

export function showIncompleteModal(confirmData) {
  return {
    type: types.SHOW_INCOMPLETE_MODAL
  };
}

export function hideIncompleteModal() {
  return {
    type: types.HIDE_INCOMPLETE_MODAL,
  };
}
