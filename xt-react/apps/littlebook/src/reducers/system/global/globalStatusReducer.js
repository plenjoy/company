import Immutable from 'immutable';
import {
  ON_CHANGE_SETTING,
  COMPLETE_CHANGE_SETTING,
} from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isOnChangeSetting: false
});

const globalStatus = (state = initialState, action) => {
  switch (action.type) {
    case ON_CHANGE_SETTING:
      const newState = state.merge({ isOnChangeSetting: true });
      return newState;
    case COMPLETE_CHANGE_SETTING:
      return state.merge({ isOnChangeSetting: false });
    default:
      return state;
  }
};

export default globalStatus;
