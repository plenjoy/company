import Immutable from 'immutable';
import { SHOW_APPROVAL_PAGE, HIDE_APPROVAL_PAGE } from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const approvalPage = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_APPROVAL_PAGE:
      return state.merge({ isShown: true }, action.data);
    case HIDE_APPROVAL_PAGE:
      return initialState;
    default:
      return state;
  }
};

export default approvalPage;
