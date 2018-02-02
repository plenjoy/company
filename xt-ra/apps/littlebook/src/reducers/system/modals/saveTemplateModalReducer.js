import Immutable from 'immutable';
import {
  SHOW_SAVE_TEMPLATE_MODAL,
  HIDE_SAVE_TEMPLATE_MODAL
} from '../../../contants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const saveTemplateModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SAVE_TEMPLATE_MODAL:
      return state.merge(action.paginationSpread, action.pagination, { isShown: true });
    case HIDE_SAVE_TEMPLATE_MODAL:
      return initialState;
    default:
      return state;
  }
};

export default saveTemplateModal;
