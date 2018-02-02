import Immutable from 'immutable';
import { HIDE_USE_SPEC_MODAL, SHOW_USE_SPEC_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const useSpecModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_USE_SPEC_MODAL:
      let { url } = action;
      url = url || {};
      return state.merge({ isShown: true, url });
    case HIDE_USE_SPEC_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default useSpecModal;
