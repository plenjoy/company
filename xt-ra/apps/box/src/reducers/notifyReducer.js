import { merge } from 'lodash';
import { SHOW_NOTIFY, HIDE_NOTIFY } from '../contants/actionTypes';
import { guid } from '../../common/utils/math';

const initialState = {
  guid: '',
  isShow: false,
  notifyMessage: ''
};

const notifyData = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFY :
      return merge({}, state, {
        notifyMessage: action.notifyMessage,
        isShow: true,
        guid: guid()
      });
    case HIDE_NOTIFY :
      return merge({}, state, {
        notifyMessage: '',
        isShow: false
      });
    default:
      return state;
  }
};

export default notifyData;
