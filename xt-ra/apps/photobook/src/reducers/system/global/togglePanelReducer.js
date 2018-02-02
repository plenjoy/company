import { Map } from 'immutable';
import { TOGGLE_PANEL, CHANGE_BOTTOM_PANEL_TAB } from '../../../contants/actionTypes';

const initialState = Map({
  step: 1,

  // 0 -> layouts, 1-> pages
  tabIndex: 0
});

const togglePanel = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANEL: {
      return state.merge({
        step: action.step
      });
    }
    case CHANGE_BOTTOM_PANEL_TAB: {
      return state.merge({
        tabIndex: action.tabIndex
      });
    }
    default:
      return state;
  }
};

export default togglePanel;
