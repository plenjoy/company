import { Map } from 'immutable';
import { TOGGLE_PANEL } from '../../../contants/actionTypes';

const initialState = Map({
  step: 1
});

const togglePanel = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANEL: {
      return state.merge({
        step: action.step
      });
    }
    default:
      return state;
  }
};

export default togglePanel;
