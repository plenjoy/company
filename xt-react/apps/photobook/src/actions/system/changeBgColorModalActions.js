import { SHOW_CHANGE_BGCOLOR_MODAL, HIDE_CHANGE_BGCOLOR_MODAL } from '../../contants/actionTypes';

export function showChangeBgColorModal(dataObj) {
  return {
    type: SHOW_CHANGE_BGCOLOR_MODAL,
    dataObj
  };
}

export function hideChangeBgColorModal() {
  return {
    type: HIDE_CHANGE_BGCOLOR_MODAL
  };
}
