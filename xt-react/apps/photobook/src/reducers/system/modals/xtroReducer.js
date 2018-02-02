import { fromJS } from 'immutable';
import {
  SHOW_XTRO_MODAL,
  HIDE_XTRO_MODAL,
  GOTO_INTRO_STEP
} from '../../../contants/actionTypes';

const initialState = fromJS({
  opened: false,
  current: 0,

  isShowSkip: true,
  isShowPrev: false,
  isShowNext: true,
  steps: []
});

const xtro = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_XTRO_MODAL: {
      return state.merge(action.data, { opened: true });
    }
    case HIDE_XTRO_MODAL: {
      return state.merge({ opened: false });
    }
    case GOTO_INTRO_STEP: {
      return state.merge({ current: action.stepIndex });
    }
    default:
      return state;
  }
};

export default xtro;
