import Immutable from 'immutable';

import { SET_DECORATION_USED_MAP } from '../../contants/actionTypes';


export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case SET_DECORATION_USED_MAP: {
      const { decorationUsedMap } = action;
      if (Immutable.List.isList(decorationUsedMap)) {
        return decorationUsedMap;
      }
      return state;
    }
    default:
      return state;
  }
};
