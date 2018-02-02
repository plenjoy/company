import Immutable from 'immutable';
import {
  SHOW_PREVIEW_MODAL,
  HIDE_PREVIEW_MODAL
} from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const previewModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PREVIEW_MODAL:
      return state.merge({ isShown: true });
    case HIDE_PREVIEW_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default previewModal;
