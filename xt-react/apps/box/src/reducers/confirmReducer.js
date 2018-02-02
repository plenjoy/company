import { merge } from 'lodash';
import { SHOW_CONFIRM, HIDE_CONFIRM } from '../contants/actionTypes';

const confirmData = (state = { isShow: false, onOkClick: () => {} }, action) => {
  switch (action.type) {
    case SHOW_CONFIRM:
      return merge({}, state, action.confirmData, {
        isShow: true
      });
    case HIDE_CONFIRM:
      return {
        isShow: false,
        onOkClick: () => {},
        onModalClose: () => {}
      };
    default :
      return state;
  }
};

export default confirmData;
