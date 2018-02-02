import { Map } from 'immutable';
import { SHOW_AUTO_UPGRADE_MODAL, HIDE_AUTO_UPGRADE_MODAL } from '../../../contants/actionTypes';

const initialState = Map({ isShow: false});
const autoUpload = (state = initialState, action) => {
  switch (action.type) {
    case HIDE_AUTO_UPGRADE_MODAL:
      return state.merge({
        isShow: false
      });
    case SHOW_AUTO_UPGRADE_MODAL:
      return state.merge({
        isShow: true
      });
    default:
      return state;
  }
};

export default autoUpload;
