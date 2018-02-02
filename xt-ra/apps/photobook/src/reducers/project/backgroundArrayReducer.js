import Immutable, { fromJS } from 'immutable';

import * as types from '../../contants/actionTypes';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.SET_BACKGROUND_ARRAY: {
      const { backgroundArray } = action;
      if (Immutable.List.isList(backgroundArray)) {
        return backgroundArray;
      }
      return state;
    }
    case types.ADD_PROJECT_BACKGROUND: {
      const { background } = action;
      return state.push(fromJS(background));
    }
    case types.DELETE_PROJECT_BACKGROUND: {
      const { backgroundId } = action;
      return state.filter((background) => {
        return background.get('code') !== backgroundId;
      });
    }
    default:
      return state;
  }
};
