import Immutable from 'immutable';
import { SHOW_PAGE_LOADING_MODAL, HIDE_PAGE_LOADING_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  text: 'Loading'
});

const pageLoadingModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PAGE_LOADING_MODAL:
      return state.merge({ isShown: true, text: action.text });
    case HIDE_PAGE_LOADING_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default pageLoadingModal;
