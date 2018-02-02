import Immutable from 'immutable';
import * as types from '../../../contants/actionTypes';

const initialState = Immutable.fromJS({
  isShown: false,
});

const paintedTextModal = (state = initialState, action) => {
   switch (action.type) {
    case types.SHOW_PAINTED_TEXT_MODAL: {
      const { data } = action;
      if (data) {
        return state.merge(action.data, { isShown: true });
      }
      return Immutable.Map({ isShown: true });
    }
    case types.HIDE_PAINTED_TEXT_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default paintedTextModal;
