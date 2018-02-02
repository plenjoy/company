import Immutable from 'immutable';
import { SHOW_ORDER, HIDE_ORDER , SHOW_ORDER_LOADING ,HIDE_ORDER_LOADING } from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  isShowLoading: false,
  hideOnOk: true,
  onOkClick: () => {},
  closeOrderModal: () => {}
});

const orderModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_ORDER:
      return state.merge({ isShown: true });
    case HIDE_ORDER:
      return state.merge({ isShown: false });
    case SHOW_ORDER_LOADING:
      return state.merge({ isShowLoading: true });
    case HIDE_ORDER_LOADING:
      return state.merge({ isShowLoading: false });
    default :
      return state;
  }
};

export default orderModal;
