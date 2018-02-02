import Immutable from 'immutable';
import { SHOW_CLONE_MODAL, HIDE_CLONE_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const cloneModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CLONE_MODAL:
      return state.merge({ isShown: true });
    case HIDE_CLONE_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default cloneModal;
