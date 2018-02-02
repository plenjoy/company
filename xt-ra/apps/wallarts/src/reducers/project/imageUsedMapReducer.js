import Immutable from 'immutable';

import * as types from '../../constants/actionTypes';
import { getImageUsedMap } from '../../utils/countUsed';


export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_IMAGE_USED_MAP: {
      const { imageUsedMap } = action;
      if (Immutable.Map.isMap(imageUsedMap)) {
        return imageUsedMap;
      }
      return state;
    }
    case types.CREATE_ELEMENTS: {
      const { elements } = action;
      const newImageUsedMap = getImageUsedMap(elements);
      let newState = state;
      if (newImageUsedMap.size) {
        newImageUsedMap.forEach((num, key) => {
          const oldNum = newState.get(key) || 0;
          newState = newState.set(key, oldNum + num);
        });
      }
      return newState;
    }
    case types.CLEAR_IMAGE_USED_MAP: {
      return Immutable.Map();
    }
    default:
      return state;
  }
};
