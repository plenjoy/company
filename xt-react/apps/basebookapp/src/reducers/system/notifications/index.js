import Immutable from 'immutable';
import * as types from '../../../constants/actionTypes';


let notificationSystem = null;
const notifications = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION: {
      const { data } = action;
      notificationSystem.addNotification(data);
      return state;
    }
    case types.REMOVE_NOTIFICATION: {
      const { uid } = action;
      notificationSystem.removeNotification(uid);
      return state;
    }
    case types.CLEAR_NOTIFICATION: {
      notificationSystem.clearNotifications();
      return state;
    }
    case types.INIT_NOTIFICATION_SYSTEM: {
      notificationSystem = action.notificationSystem;
    }
    default:
      return state;
  }
};

export default notifications;
