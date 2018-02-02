import { fromJS } from 'immutable';
import * as types from '../../../constants/actionTypes';

const initialState = fromJS({
  isShown: false
});

const incompleteModal = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_INCOMPLETE_MODAL:
      return state.merge({ isShown: true });
    case types.HIDE_INCOMPLETE_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default incompleteModal;
