import { Map } from 'immutable';
import * as types from '../../../contants/actionTypes';

const initialState = Map({
  isShown: false
});

const bookSettingsModal = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_BOOK_SETTINGS_MODAL:
      return state.merge({ isShown: true });
    case types.HIDE_BOOK_SETTINGS_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default bookSettingsModal;
