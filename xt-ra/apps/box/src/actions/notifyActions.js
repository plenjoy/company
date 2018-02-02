import { SHOW_NOTIFY, HIDE_NOTIFY } from '../contants/actionTypes';

export function showNotify(mes) {
  return {
    type: SHOW_NOTIFY,
    mes
  };
}

export function hideNotify() {
  return {
    type: HIDE_NOTIFY,
  };
}
