import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.DELETE_PROJECT_IMAGE: {
      const { encImgId } = action;
      return state.push(encImgId);
    }
    default:
      return state;
  }
};
