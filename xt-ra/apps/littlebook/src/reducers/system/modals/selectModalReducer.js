import { Map } from  'immutable';
import { SHOW_SELECT, HIDE_SELECT } from '../../../contants/actionTypes';

const initialState = Map({
  isShown: false
});

const upload = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SELECT: {
      return state.merge({
        isShown: true
      });
    }
    case HIDE_SELECT: {
      return state.merge({
        isShown: false
      });
    }
    default:
      return state;
  }
};

export default upload;
