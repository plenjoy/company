import { fromJS } from 'immutable';
import { SHOW_LOADING, HIDE_LOADING } from '../../../constants/actionTypes';

const initialState = fromJS({ isShow: false, isModalShow: false });
const loadings = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_LOADING:
      return state.merge({
        isShow: true,
        isModalShow: action.isModalShow || false
      });
    case HIDE_LOADING:
      return state.merge({
        isShow: false
      });
    default:
      return state;
  }
};

export default loadings;
