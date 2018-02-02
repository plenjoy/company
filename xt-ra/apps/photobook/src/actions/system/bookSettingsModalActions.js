import * as types from '../../contants/actionTypes';


export function showBookSettingsModal() {
  return {
    type: types.SHOW_BOOK_SETTINGS_MODAL
  };
}

export function hideBookSettingsModal() {
  return {
    type: types.HIDE_BOOK_SETTINGS_MODAL
  };
}
