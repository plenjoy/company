import Immutable from 'immutable';
import { SHOW_GUIDE_lINE_MODAL, HIDE_GUIDE_lINE_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const guideLineModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_GUIDE_lINE_MODAL:
      return state.merge({ isShown: true });
    case HIDE_GUIDE_lINE_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default guideLineModal;
