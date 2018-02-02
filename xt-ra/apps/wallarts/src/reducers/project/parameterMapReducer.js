import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';

export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_PARAMETER_MAP: {
      const { parameterMap } = action;
      if (Immutable.Map.isMap(parameterMap)) {
        return parameterMap;
      }

      return state;
    }
    default:
      return state;
  }
};
