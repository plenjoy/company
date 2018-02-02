import Immutable from 'immutable';
import * as types from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const propertyModal = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_TEXT_EDIT_MODAL: {
      const { data } = action;
      if (data) {
        return state.merge(action.data, { isShown: true });
      }
      return Immutable.Map({ isShown: true });
    }
    case types.HIDE_TEXT_EDIT_MODAL:
      return state.merge({ isShown: false });
    default:
      return state;
  }
};

export default propertyModal;
