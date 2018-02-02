import { SHOW_CONFIRM, HIDE_CONFIRM } from '../../constants/actionTypes';

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
