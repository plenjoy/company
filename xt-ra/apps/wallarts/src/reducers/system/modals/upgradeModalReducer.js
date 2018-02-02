import Immutable from 'immutable';
import { SHOW_UPGRADE, HIDE_UPGRADE } from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false,
  onOkClick: () => {},
  onCancelClick: () => {},

  // 待升级的预览数据
  from: {
    coverType: '',
    effectImage: null,
    element: {},
    options: {}
  },

  // 升级后的预览数据.
  to: {
    coverType: '',
    effectImage: null,
    element: {},
    options: {}
  }
});

const upgradeModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UPGRADE:
      return state.merge(action.upgradeData, { isShown: true });
    case HIDE_UPGRADE:
      return state.merge(action.upgradeData, { isShown: false });
    default :
      return state;
  }
};

export default upgradeModal;
