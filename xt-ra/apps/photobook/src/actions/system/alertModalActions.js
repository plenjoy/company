import { SHOW_ALERT_MODAL, HIDE_ALERT_MODAL } from '../../contants/actionTypes';

export function showAlertModal(alertData) {
  return {
    type: SHOW_ALERT_MODAL,
    alertData
  };
}

export function hideAlertModal() {
  return {
    type: HIDE_ALERT_MODAL
  };
}
