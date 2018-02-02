import Immutable from 'immutable';
import { SHOW_HOW_THIS_WORKS_MODAL, HIDE_HOW_THIS_WORKS_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const howThisWorksModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_HOW_THIS_WORKS_MODAL:
      return state.merge({ isShown: true });
    case HIDE_HOW_THIS_WORKS_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default howThisWorksModal;
