import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_VARIABLE_MAP: {
      const { variableMap } = action;
      if (Immutable.Map.isMap(variableMap)) {
        return variableMap;
      }

      return state;
    }
    default:
      return state;
  }
};
