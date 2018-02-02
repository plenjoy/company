import { Map } from 'immutable';
import { SHOW_PREVIEW, HIDE_PREVIEW } from '../../../contants/actionTypes';

const initialState = Map({
  isShown: false
});

const preview = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PREVIEW:
      return state.merge(action.data, { isShown: true });
    case HIDE_PREVIEW:
      return state.merge({
        isShown: false
      });
    default :
      return state;
  }
};

export default preview;
