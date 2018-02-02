import * as types from '../../contants/actionTypes';

export function addNotification(data) {
  return {
    type: types.ADD_NOTIFICATION,
    data
  };
}

export function removeNotification(uid) {
  return {
    type: types.REMOVE_NOTIFICATION,
    uid
  };
}

export function clearNotification() {
  return {
    type: types.CLEAR_NOTIFICATION
  };
}

export function initNotificationSystem(notificationSystem) {
  return {
    type: types.INIT_NOTIFICATION_SYSTEM,
    notificationSystem
  };
}
