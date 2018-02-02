import Immutable from 'immutable';
import {
  SHOW_OAUTH_LOADING,
  HIDE_OAUTH_LOADING
} from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const oAuthLoading = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_OAUTH_LOADING:
      return state.merge({ isShown: true });
    case HIDE_OAUTH_LOADING:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default oAuthLoading;
