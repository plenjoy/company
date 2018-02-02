import { Map } from  'immutable';
import { TOGGLE_UPLOAD } from '../../../contants/actionTypes';

const initialState = Map({
  isShown: false
});

const upload = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_UPLOAD:
      return state.merge({
        isShown: action.status
      });
    default:
      return state;
  }
};

export default upload;
