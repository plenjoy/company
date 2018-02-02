import Immutable from 'immutable';

import * as types from '../../contants/actionTypes';
import { getStickerUsedMap } from '../../utils/countUsed';


export default (state = Immutable.Map(), action) => {
  switch (action.type) {
    case types.SET_STICKER_USED_MAP: {
      const { stickerUsedMap } = action;
      if (Immutable.Map.isMap(stickerUsedMap)) {
        return stickerUsedMap;
      }
      return state;
    }
    case types.CREATE_ELEMENTS: {
      const { elements } = action;
      const newImageUsedMap = getStickerUsedMap(elements);
      let newState = state;
      if (newImageUsedMap.size) {
        newImageUsedMap.forEach((num, key) => {
          const oldNum = newState.get(key) || 0;
          newState = newState.set(key, oldNum + num);
        });
      }
      return newState;
    }
    case types.CLEAR_STICKER_USED_MAP: {
      return Immutable.Map();
    }
    default:
      return state;
  }
};
