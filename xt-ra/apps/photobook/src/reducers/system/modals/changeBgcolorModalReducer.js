import Immutable from 'immutable';
import { SHOW_CHANGE_BGCOLOR_MODAL, HIDE_CHANGE_BGCOLOR_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  onOkClick: () => {},
  onCancelClick: () => {}
});

const changeBgColorModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CHANGE_BGCOLOR_MODAL:
      return state.merge(action.dataObj, { isShown: true });
    case HIDE_CHANGE_BGCOLOR_MODAL:
      return initialState;
    default :
      return state;
  }
};

export default changeBgColorModal;
