import { merge } from 'lodash';
import Immutable from 'immutable';
import { GET_SHARE_URLS } from '../../../contants/apiUrl';
import {
  SHOW_GLOBAL_LOADING,
  HIDE_GLOBAL_LOADING,
} from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: true
});

const globalLoading = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_GLOBAL_LOADING:
      const newState = state.merge({ isShown: true });
      return newState;
    case HIDE_GLOBAL_LOADING:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default globalLoading;
