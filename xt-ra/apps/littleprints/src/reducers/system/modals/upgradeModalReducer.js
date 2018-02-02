import Immutable from 'immutable';
import { SHOW_UPGRADE, HIDE_UPGRADE } from '../../../constants/actionTypes';

const initialState = Immutable.Map({
  isShown: false
});

const upgradeModal = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UPGRADE:
      return state.merge({ isShown: true, saveFun: action.upgradeFun });
    case HIDE_UPGRADE:
      return state.merge({ isShown: false });
    default :
      return state;
  }
};

export default upgradeModal;
