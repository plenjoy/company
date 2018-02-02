import Immutable from 'immutable';
import { SHOW_QUICK_START_MODAL, HIDE_QUICK_START_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const quickStartModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_QUICK_START_MODAL:
      return state.merge({ isShown: true });
    case HIDE_QUICK_START_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default quickStartModal;
