import Immutable from 'immutable';
import { SHOW_MAIN_LOADING, HIDE_MAIN_LOADING } from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const cloneModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MAIN_LOADING:
      return state.merge({ isShown: true });
    case HIDE_MAIN_LOADING:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default cloneModal;
