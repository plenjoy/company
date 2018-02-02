import { merge } from 'lodash';
import Immutable from 'immutable';
import { GET_SHARE_URLS } from '../../../contants/apiUrl';
import {
  SHOW_THEME_OVERLAY_MODAL,
  HIDE_THEME_OVERLAY_MODAL,
  API_SUCCESS
} from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const themeOverlayModal = (state = initialState, action) => {
  const { params } = action;
  switch (action.type) {
    case SHOW_THEME_OVERLAY_MODAL:
      const newState = state.merge({ isShown: true }, {
        currentTheme: params.theme,
        onApplyClick: params.onApplyClick
      });
      return newState;
    case HIDE_THEME_OVERLAY_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default themeOverlayModal;
