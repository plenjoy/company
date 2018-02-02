import Immutable from 'immutable';
import { SHOW_CONFIRM, HIDE_CONFIRM } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  hideOnOk: true,
  onOkClick: () => {},
  closeConfirmModal: () => {},
  confirmMessage: ''
});

const confirmModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_CONFIRM:
      return state.merge(action.confirmData, { isShown: true });
    case HIDE_CONFIRM:
      return initialState;
    default :
      return state;
  }
};

export default confirmModal;
