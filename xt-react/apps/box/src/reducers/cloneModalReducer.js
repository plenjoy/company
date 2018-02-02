import { merge } from 'lodash';
import { SHOW_CLONE_MODAL, HIDE_CLONE_MODAL } from '../contants/actionTypes';

const initialState = {
  isShown: false
};

const cloneModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CLONE_MODAL:
      return merge({}, state, { isShown: true });
    case HIDE_CLONE_MODAL:
      return merge({}, state, { isShown: false });
    default:
      return state;
  }
};

export default cloneModal;
