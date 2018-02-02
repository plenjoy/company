import Immutable, { fromJS } from 'immutable';

import * as types from '../../contants/actionTypes';

export default (state = Immutable.List(), action) => {
  switch (action.type) {
    case types.SET_STICKER_ARRAY: {
      const { stickerArray } = action;
      if (Immutable.List.isList(stickerArray)) {
        return stickerArray;
      }
      return state;
    }
    case types.ADD_PROJECT_STICKER: {
      const { sticker } = action;
      return state.push(fromJS(sticker));
    }
    case types.DELETE_PROJECT_STICKER: {
      const { stickerId } = action;
      return state.filter((sticker) => {
        return sticker.get('code') !== stickerId;
      });
    }
    default:
      return state;
  }
};
