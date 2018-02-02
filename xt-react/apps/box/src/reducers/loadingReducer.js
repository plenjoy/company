import { merge } from 'lodash';
import { SHOW_LOADING, HIDE_LOADING } from '../contants/actionTypes';

const loadingData = (state = { isShow: false, isModalShow: false }, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return merge({}, state, {
        isShow: true,
        isModalShow: action.isModalShow || false
      });
    case HIDE_LOADING:
      return merge({}, state, {
        isShow: false
      });
    default:
      return state;
  }
};

export default loadingData;
