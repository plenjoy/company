import Immutable from 'immutable';
import {
  SHOW_OAUTH_PAGE,
  HIDE_OAUTH_PAGE
} from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: true
});

const oAuthPage = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_OAUTH_PAGE:
      return state.merge({ isShown: true });
    case HIDE_OAUTH_PAGE:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default oAuthPage;
