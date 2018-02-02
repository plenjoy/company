import Immutable from 'immutable';
import {
  SET_CLIPBOARD_DATA,
  CLEAR_CLIPBOARD_DATA
} from '../../../contants/actionTypes';

const clipboard = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case SET_CLIPBOARD_DATA: {
      return Immutable.fromJS(action.data);
    }
    case CLEAR_CLIPBOARD_DATA: {
      return Immutable.List([]);
    }
    default:
      return state;
  }
};

export default clipboard;
