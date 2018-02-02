import { Map } from 'immutable';
import { SHOW_NOTIFY, HIDE_NOTIFY } from '../../../contants/actionTypes';
import { guid } from '../../../../../common/utils/math';

const initialState = Map({
  guid: '',
  isShow: false,
  notifyMessage: ''
});

const notifications = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFY :
      return state.merge({
        notifyMessage: action.notifyMessage,
        isShow: true,
        guid: guid()
      });
    case HIDE_NOTIFY :
      return state.merge({
        notifyMessage: '',
        isShow: false
      });
    default:
      return state;
  }
};

export default notifications;
