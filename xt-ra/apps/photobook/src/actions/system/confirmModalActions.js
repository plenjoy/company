import { SHOW_CONFIRM, HIDE_CONFIRM } from '../../contants/actionTypes';

export function showConfirm(confirmData) {
  return {
    type: SHOW_CONFIRM,
    confirmData
  };
}

export function hideConfirm() {
  return {
    type: HIDE_CONFIRM
  };
}
