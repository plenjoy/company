import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const initialState = fromJS({
  isShown: true,
  isInitialized: false,
  settings: {
    minHeight: 0,
    maxHeight: 0,
    width: 0,
    fontSize: 0,
    lineHeight: '100%',
    textAlign: 'left'
  }
});

const fontCalculator = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_FONT_CALCULATOR_SETTINGS: {
      let newState = state;
      
      for(const key in action.settings) {
        newState = newState.setIn(['settings', key], action.settings[key]);
      }

      newState = newState.set('isInitialized', true);

      return newState;
    }
    default :
      return state;
  }
};

export default fontCalculator;
