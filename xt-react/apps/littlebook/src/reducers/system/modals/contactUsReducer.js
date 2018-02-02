import Immutable from 'immutable';
import { SHOW_CONTACT_US_MODAL, HIDE_CONTACT_US_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const contactUsModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CONTACT_US_MODAL:
      return state.merge({ isShown: true });
    case HIDE_CONTACT_US_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default contactUsModal;
