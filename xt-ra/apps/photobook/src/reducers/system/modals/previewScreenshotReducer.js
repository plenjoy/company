import Immutable from 'immutable';
import { SHOW_SCREENSHOT_MODAL, HIDE_SCREENSHOT_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  screenshot: null
});

const previewScreenshot = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SCREENSHOT_MODAL:
      return state.merge({ isShown: true }, action.data);
    case HIDE_SCREENSHOT_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default previewScreenshot;
