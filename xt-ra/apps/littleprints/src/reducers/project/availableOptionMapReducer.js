import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_OPTION_MAP: {
      const { availableOptionMap } = action;
      if (Immutable.Map.isMap(availableOptionMap)) {
        return availableOptionMap;
      }

      return state;
    }
    default:
      return state;
  }
};
