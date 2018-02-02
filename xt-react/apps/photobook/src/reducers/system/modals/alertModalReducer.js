import Immutable from 'immutable';
import { SHOW_ALERT_MODAL, HIDE_ALERT_MODAL } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  title: '',
  message: '',
  onButtonClick: () => {},
  closeAlertModal: () => {}
});

const alertModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ALERT_MODAL:
      return state.merge(action.alertData, { isShown: true });
    case HIDE_ALERT_MODAL:
      return initialState;
    default :
      return state;
  }
};

export default alertModal;
